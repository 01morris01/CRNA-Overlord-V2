#!/usr/bin/env python
"""Step 1c. Exercise the documented TotalSegmentator MCP server locally over stdio.

Starts `totalseg_mcp --transport stdio` as a child process with the MCP Python SDK's stdio client
(no Claude / IDE / Cursor configuration is read or written), lists its tools and calls them.

    # registry-only calls (instant, no weights):
    $HN_PY tools/headneck/03_mcp_probe.py --out $HN_WORK/logs/mcp_probe_registry.json

    # plus real image calls on a CT (get_modality, run_segmentation):
    $HN_PY tools/headneck/03_mcp_probe.py --ct $HN_WORK/data/ct.nii.gz \
        --seg-out $HN_WORK/masks/mcp_probe_total_fast --out $HN_WORK/logs/mcp_probe_segment.json
"""
import argparse
import asyncio
import json
import os
import shutil
import sys
import time
from pathlib import Path

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


def content_to_obj(result):
    """Turn an MCP CallToolResult into plain JSON-able data."""
    out = {"is_error": bool(getattr(result, "is_error", getattr(result, "isError", False)))}
    sc = getattr(result, "structured_content", getattr(result, "structuredContent", None))
    if sc is not None:
        out["structured"] = sc
    texts = []
    for c in getattr(result, "content", []) or []:
        t = getattr(c, "text", None)
        if t is not None:
            texts.append(t)
    if texts and "structured" not in out:
        joined = "\n".join(texts)
        try:
            out["structured"] = json.loads(joined)
        except Exception:
            out["text"] = joined
    elif texts and out["is_error"]:
        out["text"] = "\n".join(texts)
    return out


async def call(session, name, args, log, timeout=None):
    t0 = time.time()
    rec = {"tool": name, "arguments": args}
    try:
        coro = session.call_tool(name, args)
        res = await (asyncio.wait_for(coro, timeout) if timeout else coro)
        rec.update(content_to_obj(res))
    except Exception as e:  # protocol-level error
        rec["exception"] = f"{type(e).__name__}: {e}"
    rec["seconds"] = round(time.time() - t0, 2)
    log.append(rec)
    short = json.dumps(rec.get("structured", rec.get("text", rec.get("exception"))))
    print(f"[{rec['seconds']:8.2f}s] {name}({json.dumps(args)[:120]}) -> error={rec.get('is_error')} {short[:300]}")
    return rec


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ct", help="NIfTI CT for the image tools (optional)")
    ap.add_argument("--seg-out", help="output directory for run_segmentation")
    ap.add_argument("--device", default="mps", choices=["cpu", "mps", "gpu"])
    ap.add_argument("--out", required=True, help="JSON log to write")
    a = ap.parse_args()

    exe = shutil.which("totalseg_mcp")
    if exe is None:
        sys.exit("totalseg_mcp not on PATH (source tools/headneck/00_env.sh)")

    # The stdio client only forwards a small default set of variables; pass what the server needs.
    env = {k: os.environ[k] for k in ("PATH", "HOME", "TOTALSEG_HOME_DIR", "TMPDIR", "LANG") if k in os.environ}
    params = StdioServerParameters(command=exe, args=["--transport", "stdio"], env=env)

    log = {"server_command": [exe, "--transport", "stdio"], "calls": []}
    t_start = time.time()
    # the server's own stderr (tracebacks behind generic tool errors) goes to a file next to the JSON log
    errlog = open(str(Path(a.out).with_suffix(".server_stderr.log")), "w")
    async with stdio_client(params, errlog=errlog) as streams:
        read, write = streams[0], streams[1]
        async with ClientSession(read, write) as session:
            init = await session.initialize()
            info = getattr(init, "server_info", getattr(init, "serverInfo", None))
            log["server_info"] = {"name": getattr(info, "name", None), "version": getattr(info, "version", None)}
            log["protocol_version"] = str(getattr(init, "protocol_version", getattr(init, "protocolVersion", None)))
            log["instructions"] = getattr(init, "instructions", None)
            tools = await session.list_tools()
            log["tools"] = [
                {"name": t.name, "description": (t.description or "").strip().split("\n")[0],
                 "input_schema": getattr(t, "input_schema", getattr(t, "inputSchema", None))}
                for t in tools.tools
            ]
            print("server:", log["server_info"], "protocol", log["protocol_version"])
            print("tools:", [t["name"] for t in log["tools"]])

            c = log["calls"]
            await call(session, "list_all_tasks", {}, c)
            await call(session, "get_task_details", {"task_names": ["headneck_bones_vessels", "headneck_muscles", "face"]}, c)
            await call(session, "get_class_options", {"class_names": ["thyroid_cartilage", "trachea", "spinal_cord", "optic_nerve_left"]}, c)
            # Coverage probe: these must be rejected if the registry has no such class.
            await call(session, "get_class_options", {"class_names": ["brachial_plexus"]}, c)
            await call(session, "get_class_options", {"class_names": ["vagus_nerve", "phrenic_nerve", "recurrent_laryngeal_nerve"]}, c)
            r = await call(session, "list_all_classes", {}, c)
            try:
                ct_classes = r["structured"]["classes"]["CT"]
                log["ct_classes_with_nerve_or_plexus"] = [x for x in ct_classes if "nerve" in x or "plexus" in x or x == "spinal_cord"]
                # keep the log small: drop the long list, keep counts
                r["structured"] = {"class_count": r["structured"]["class_count"],
                                   "per_modality_counts": {k: len(v) for k, v in r["structured"]["classes"].items()}}
                print("CT classes with nerve/plexus/spinal_cord:", log["ct_classes_with_nerve_or_plexus"])
            except Exception as e:
                print("could not post-process list_all_classes:", e)

            if a.ct:
                ct = str(Path(a.ct).resolve())
                await call(session, "get_modality", {"input_path": ct}, c, timeout=600)
                await call(session, "detect_contrast_phase", {"input_path": ct, "device": a.device}, c, timeout=1800)
                if a.seg_out:
                    seg_out = str(Path(a.seg_out).resolve())
                    # A real segmentation through the MCP tool: 3 mm model, neck subset, with statistics.
                    seg_args = {"input_path": ct, "output_path": seg_out, "task": "total", "device": a.device,
                                "speed": "fast", "roi_subset": ["trachea", "thyroid_gland", "spinal_cord", "vertebrae_C5"],
                                "statistics": True}
                    r1 = await call(session, "run_segmentation", seg_args, c, timeout=3600)
                    if r1.get("is_error") and not Path(seg_out).exists():
                        # TotalSegmentator 2.18.0: with --statistics <out>/statistics.json the CLI opens that file before
                        # it has created <out>, so the MCP tool fails on a fresh output directory. Retry with the
                        # directory pre-created (the only change).
                        r1["note"] = "failed on a not-yet-existing output directory (FileNotFoundError for statistics.json, see server stderr)"
                        Path(seg_out).mkdir(parents=True)
                        r2 = await call(session, "run_segmentation", seg_args, c, timeout=3600)
                        r2["note"] = "same arguments, output directory created beforehand"
                    # A license-gated task must fail without a key (expected error, recorded verbatim).
                    await call(session, "run_segmentation", {
                        "input_path": ct, "output_path": seg_out + "_face_gated", "task": "face", "device": a.device,
                        "speed": "standard", "statistics": False}, c, timeout=600)
    log["total_seconds"] = round(time.time() - t_start, 2)
    errlog.close()
    err_txt = Path(a.out).with_suffix(".server_stderr.log").read_text(errors="replace")
    # the exception lines the MCP client never sees
    log["server_side_errors"] = sorted({ln.strip(" │") for ln in err_txt.split("\n")
                                        if any(t in ln for t in ("ValueError:", "RuntimeError:", "Unknown classes", "license", "License"))})[:20]
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    Path(a.out).write_text(json.dumps(log, indent=1, default=str) + "\n")
    print("wrote", a.out)


if __name__ == "__main__":
    asyncio.run(main())

#!/usr/bin/env python3
"""dev_server.py: serve the repo for local work with caching switched off, so an edit shows on the next reload.
   python3 tools/dev_server.py [PORT]   (default 8081; binds 127.0.0.1 only)

It also answers POST /api/tts the way the deployed function does (api/tts.js: same voices, same settings, read from that
file), so that on this computer the patient and Booth speak with the same ElevenLabs voices as in production instead of the
browser's built-in voice. That needs ELEVENLABS_API_KEY in the environment this server is started from. Without it the
answer is 501 and the page falls back to the browser's voice, exactly as the deployed function does.

The key is read from the environment, sent only to api.elevenlabs.io, and never written or logged. A cap on characters per
run (OVERLORD_TTS_CAP, default 6000) guards the account against a page that asks in a loop. The other /api/ routes need
keys that belong on the server; here they answer 501 and each page uses its own offline fallback."""
import http.server, json, os, re, sys, urllib.request, urllib.error

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
def voices():
    """The voice cast, read from api/tts.js so there is one place to change it."""
    src = open(os.path.join(ROOT, "api", "tts.js"), encoding="utf-8").read(); const = lambda n: (re.search(n + r"\s*=\s*'([A-Za-z0-9]+)'", src) or [None, None])[1]
    return {"cast": dict(re.findall(r"'([a-z]+-[a-z]+)':\s*'([A-Za-z0-9]+)'", src)), "operator": const("OPERATOR_DEFAULT_VOICE_ID"), "patient_male": const("PATIENT_MALE_DEFAULT_VOICE_ID"), "default": "21m00Tcm4TlvDq8ikWAM"}
V = voices(); CAP = int(os.environ.get("OVERLORD_TTS_CAP", "6000")); spent = 0
def resolve(voice):
    e = os.environ
    if voice in V["cast"]: return e.get("ELEVENLABS_VOICE_" + voice.replace("-", "_").upper()) or V["cast"][voice]
    if voice == "operator": return e.get("ELEVENLABS_OPERATOR_VOICE_ID") or V["operator"]
    if voice == "patient-male": return e.get("ELEVENLABS_PATIENT_MALE_VOICE_ID") or V["patient_male"]
    return e.get("ELEVENLABS_PATIENT_FEMALE_VOICE_ID") or e.get("ELEVENLABS_VOICE_ID") or V["default"]

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
    def log_message(self, fmt, *args):
        if args and str(args[1]) not in ("200", "304"):
            super().log_message(fmt, *args)
    def answer(self, code, body, kind="application/json"):
        data = body if isinstance(body, bytes) else json.dumps(body).encode()
        self.send_response(code); self.send_header("Content-Type", kind); self.send_header("Content-Length", str(len(data))); self.end_headers(); self.wfile.write(data)
    def do_GET(self):
        if self.path.startswith("/api/tts"): return self.answer(200, {"local": True, "configured": bool(os.environ.get("ELEVENLABS_API_KEY")), "characters_this_run": spent, "cap": CAP, "voices": sorted(V["cast"])})      # a status line for checks; no secret in it
        super().do_GET()
    def do_POST(self):
        global spent
        try: body = json.loads(self.rfile.read(int(self.headers.get("Content-Length") or 0)) or b"{}")
        except Exception: body = {}
        if not self.path.startswith("/api/tts"): return self.answer(501, {"error": "unavailable_locally", "reason": "this route needs server-side keys; the page uses its offline fallback"})
        key = os.environ.get("ELEVENLABS_API_KEY"); text = body.get("text") if isinstance(body.get("text"), str) else ""; text = text[:1200]
        if not key: return self.answer(501, {"error": "tts_unavailable", "reason": "ELEVENLABS_API_KEY not configured"})
        if not text.strip(): return self.answer(400, {"error": "Missing text"})
        if spent + len(text) > CAP: return self.answer(501, {"error": "tts_unavailable", "reason": "local character cap reached for this run of the dev server"})
        operator = body.get("voice") == "operator"; vid = body.get("voiceId").strip() if isinstance(body.get("voiceId"), str) and body.get("voiceId").strip() else resolve(body.get("voice"))
        model = (os.environ.get("ELEVENLABS_OPERATOR_MODEL_ID") if operator else None) or os.environ.get("ELEVENLABS_MODEL_ID") or "eleven_turbo_v2_5"
        req = urllib.request.Request("https://api.elevenlabs.io/v1/text-to-speech/" + urllib.request.quote(vid), data=json.dumps({"text": text, "model_id": model, "voice_settings": {"stability": 0.35, "similarity_boost": 0.8, "style": 0.45} if operator else {"stability": 0.5, "similarity_boost": 0.75}}).encode(),
                                     headers={"xi-api-key": key, "content-type": "application/json", "accept": "audio/mpeg"})
        try: audio = urllib.request.urlopen(req, timeout=60).read()
        except urllib.error.HTTPError as e: return self.answer(502, {"error": "tts_error", "details": e.code})
        except Exception as e: return self.answer(502, {"error": "tts_network", "details": type(e).__name__})
        spent += len(text); self.answer(200, audio, "audio/mpeg")

os.chdir(ROOT)
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()

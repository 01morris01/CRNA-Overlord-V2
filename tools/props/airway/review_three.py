"""review_three.py: screenshots of finished props in three.js r170 in Chrome (Metal), from the same specs as review_cycles.py.

   uv run --with playwright python3 tools/props/airway/review_three.py OUTDIR SPEC.json [SPEC.json ...]

Serves a scratch web root (symlinks to the repository, the work folder and the studio HDRI) on 127.0.0.1 and loads
review_three.html for each spec; each view is rendered by the page and captured from the canvas."""
import json, os, sys, threading, functools, http.server, socketserver, tempfile, base64
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); HOME = os.path.expanduser('~')
ROOTS = {'repo': os.path.join(HOME, 'Developer/overlord-next'), 'src': os.path.join(HOME, 'Developer/overlord-asset-sources')}


def web(path):
    path = os.path.abspath(os.path.expanduser(path))
    for k, r in ROOTS.items():
        if path.startswith(r + '/'): return '/' + k + path[len(r):]
    raise SystemExit('not under a served root: ' + path)


def machine(pg_factory, port, out, name, state, views):
    import urllib.parse
    q = urllib.parse.urlencode({'base': '/repo', 'hdri': web(os.path.join(ROOTS['src'], 'polyhaven/hdri/studio_small_09_1k.hdr')), 'state': json.dumps(state), 'views': json.dumps(views)})
    pg = pg_factory(); logs = []; pg.on('console', lambda m: logs.append(m.text)); pg.on('pageerror', lambda e: logs.append('PAGEERROR ' + str(e)))
    pg.goto('http://127.0.0.1:%d/machine.html?%s' % (port, q))
    try: pg.wait_for_function('window.READY === true', timeout=120000)
    except Exception: print('\n'.join(logs)); raise
    print('cuts:', pg.evaluate('window.CUTLOG'))
    for i, v in enumerate(views):
        pg.evaluate('i => window.setView(i)', i); data = pg.evaluate("() => document.querySelector('canvas').toDataURL('image/png')")
        f = os.path.join(out, 'machine_%s_%s_three.png' % (name, v['name'])); open(f, 'wb').write(base64.b64decode(data.split(',')[1])); print('SHOT', f)
    for l in logs:
        if 'error' in l.lower() or 'warn' in l.lower(): print('  console:', l[:200])
    pg.close()


MACHINE_VIEWS = [
    {'name': 'front', 'eye': [0.25, 1.45, 1.35], 'at': [0.0, 1.05, 0.0], 'fov': 40},
    {'name': 'bellows', 'eye': [-0.05, 1.12, 0.42], 'at': [-0.176, 0.99, -0.057], 'fov': 35},
    {'name': 'flowmeters', 'eye': [0.05, 1.28, 0.30], 'at': [0.02, 1.27, -0.05], 'fov': 35},
    {'name': 'block', 'eye': [-0.05, 1.12, 0.45], 'at': [-0.19, 0.9, 0.2], 'fov': 30},
    {'name': 'vaporizer', 'eye': [0.36, 1.36, 0.2], 'at': [0.348, 1.334, -0.06], 'fov': 35},
    {'name': 'flush', 'eye': [0.0, 1.10, 0.16], 'at': [-0.026, 1.075, -0.005], 'fov': 35},
    {'name': 'apl_top', 'eye': [-0.2, 1.06, 0.30], 'at': [-0.2, 0.895, 0.185], 'fov': 30},
]


def main():
    if sys.argv[1] == '--machine':
        out = sys.argv[2]; os.makedirs(out, exist_ok=True); webroot = tempfile.mkdtemp(prefix='propreview_')
        for k, r in ROOTS.items(): os.symlink(r, os.path.join(webroot, k))
        os.symlink(os.path.join(HERE, 'review_machine.html'), os.path.join(webroot, 'machine.html'))
        class Q(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *a): pass
        httpd = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Q, directory=webroot)); port = httpd.server_address[1]
        threading.Thread(target=httpd.serve_forever, daemon=True).start()
        with sync_playwright() as p:
            b = p.chromium.launch(channel='chrome', args=['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'])
            fac = lambda: b.new_page(viewport={'width': 1200, 'height': 800}, service_workers='block')
            machine(fac, port, out, 'rest', {'excursion': 1.0}, MACHINE_VIEWS)
            machine(fac, port, out, 'running', {'excursion': 0.55, 'o2': 2.0, 'air': 0.6, 'sevo': 2, 'apl': 30, 'mode': 'VENT'}, MACHINE_VIEWS)
            b.close()
        httpd.shutdown(); return
    out = sys.argv[1]; specs = sys.argv[2:]; os.makedirs(out, exist_ok=True)
    webroot = tempfile.mkdtemp(prefix='propreview_')
    for k, r in ROOTS.items(): os.symlink(r, os.path.join(webroot, k))
    os.symlink(os.path.join(HERE, 'review_three.html'), os.path.join(webroot, 'review.html'))
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Q, directory=webroot)); port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', args=['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'])
        for sp in specs:
            spec = json.load(open(sp)); spec['file_web'] = web(spec['file']); spec['hdri_web'] = web(spec.get('hdri_three', spec['hdri'].replace('_2k', '_1k')))
            spec['ruler_web'] = web(spec['ruler_tex'])
            for ex in spec.get('extra', []): ex['file_web'] = web(ex['file'])
            js = os.path.join(webroot, os.path.basename(sp)); json.dump(spec, open(js, 'w'))
            W, H = spec.get('size', [1200, 800])
            pg = b.new_page(viewport={'width': W, 'height': H}, service_workers='block')
            logs = []; pg.on('console', lambda m: logs.append(m.text)); pg.on('pageerror', lambda e: logs.append('PAGEERROR ' + str(e)))
            if spec.get('label_test'): pg.add_init_script('window.LABEL_TEST = true')
            pg.goto('http://127.0.0.1:%d/review.html?spec=/%s' % (port, os.path.basename(sp)))
            try: pg.wait_for_function('window.READY === true', timeout=60000)
            except Exception: print('\n'.join(logs)); raise
            for i, v in enumerate(spec['views']):
                pg.evaluate('i => window.setView(i)', i)
                data = pg.evaluate("() => document.querySelector('canvas').toDataURL('image/png')")
                f = os.path.join(out, '%s_%s_three.png' % (spec['name'], v['name'])); open(f, 'wb').write(base64.b64decode(data.split(',')[1])); print('SHOT', f)
            for l in logs:
                if 'warn' in l.lower() or 'error' in l.lower(): print('  console:', l[:200])
            pg.close()
        b.close()
    httpd.shutdown()


if __name__ == '__main__':
    main()

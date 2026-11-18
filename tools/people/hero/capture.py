"""capture.py OUT_DIR ROOT_DIR JOB [JOB ...]: open viewer.html in Chrome through Playwright and save one picture per job.
JOB is "name|query", e.g. "flat_head|pose=flat&cam=head_of_bed". Files are served to the page from ROOT_DIR (then from
this folder) by request interception; three.js r170 comes from the CDN address the app uses.
   uv run --with playwright python3 capture.py ...   (as the study's capture.py)"""
import sys, os, json, mimetypes
from playwright.sync_api import sync_playwright
out, root, jobs = sys.argv[1], sys.argv[2], sys.argv[3:]
here = os.path.dirname(os.path.abspath(__file__))
os.makedirs(out, exist_ok=True)


def serve(route):
    path = route.request.url.split('hero.test/', 1)[1].split('?')[0]
    for base in (root, here):
        f = os.path.realpath(os.path.join(base, path))
        if f.startswith(os.path.realpath(base) + os.sep) and os.path.isfile(f):
            return route.fulfill(status=200, body=open(f, 'rb').read(), content_type=mimetypes.guess_type(f)[0] or 'application/octet-stream')
    route.fulfill(status=404, body=b'not found')


with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 720}, service_workers='block')
    page = ctx.new_page()
    page.route('http://hero.test/**', serve)
    msgs = []
    page.on('console', lambda m: msgs.append(m.text)); page.on('pageerror', lambda e: msgs.append('PAGEERROR ' + str(e)))
    for job in jobs:
        name, query = job.split('|', 1)
        page.goto('http://hero.test/viewer.html?' + query)
        try:
            page.wait_for_function('window.__done === true', timeout=180000)
        except Exception as e:
            print('FAILED', name, str(e)[:200], msgs[-5:]); continue
        page.wait_for_timeout(200)
        page.screenshot(path=os.path.join(out, name + '.png'))
        print('captured', name, json.dumps(page.evaluate('window.__info')))
    print('console:', [m for m in msgs if 'error' in m.lower()][:5])
    b.close()

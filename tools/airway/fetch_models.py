"""fetch_models.py: download the source models for the airway props. No sign-in anywhere.

Files come from Objaverse 1.0 (allenai/objaverse on Hugging Face), the public research mirror of Creative Commons uploads to
Sketchfab up to about September 2022. Before a file is fetched its licence, title and author are read from Sketchfab's own public
record (api.sketchfab.com/v3/models/<uid>, no key needed), and anything that is not CC BY or CC0 there today is refused.
A uid that Objaverse does not hold is reported and skipped: it needs the owner's own Sketchfab sign-in.

Each model goes into its own new directory DEST/<uid>/<uid>.glb; DEST/sources.json records what was fetched and under which licence.

   python3 -I tools/airway/fetch_models.py DEST                 # the uids listed in tools/airway/sources.json
   python3 -I tools/airway/fetch_models.py DEST uid [uid ...]   # only these

DEST is normally ~/Developer/overlord-asset-sources/airway/downloads. Downloaded files are data: nothing in them is executed."""
import gzip, json, os, sys, time, urllib.request

MIRROR = 'https://huggingface.co/datasets/allenai/objaverse/resolve/main/'
AGENT = {'User-Agent': 'asset-fetch/1.0', 'Accept': '*/*'}
OPEN = {'by': 'CC BY 4.0', 'cc0': 'CC0 1.0'}
HERE = os.path.dirname(os.path.abspath(__file__))

def get(url, dest=None, tries=4):
    for k in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=AGENT), timeout=180) as r:
                if dest is None: return r.read()
                with open(dest + '.part', 'wb') as f:
                    while True:
                        b = r.read(1 << 20)
                        if not b: break
                        f.write(b)
            os.replace(dest + '.part', dest); return None
        except Exception:
            if k == tries - 1: raise
            time.sleep(5 * (k + 1))

def main():
    dest = os.path.abspath(os.path.expanduser(sys.argv[1])); os.makedirs(dest, exist_ok=True)
    uids = sys.argv[2:] or [s['uid'] for s in json.load(open(os.path.join(HERE, 'sources.json')))]
    index = os.path.join(dest, '_index'); os.makedirs(index, exist_ok=True); pf = os.path.join(index, 'object-paths.json.gz')
    if not os.path.exists(pf): get(MIRROR + 'object-paths.json.gz', pf)
    paths = json.load(gzip.open(pf)); manifest = os.path.join(dest, 'sources.json')
    have = {s['uid']: s for s in json.load(open(manifest))} if os.path.exists(manifest) else {}
    for uid in uids:
        path = paths.get(uid)
        if not path: print('%s  not in Objaverse: it needs the owner\'s own Sketchfab sign-in' % uid); continue
        rec = json.loads(get('https://api.sketchfab.com/v3/models/' + uid)); lic = rec.get('license') or {}
        if lic.get('slug') not in OPEN: print('%s  REFUSED: licence at source is %r (%s)' % (uid, lic.get('label'), rec.get('name'))); continue
        folder = os.path.join(dest, uid); out = os.path.join(folder, uid + '.glb')
        if not os.path.exists(out): os.makedirs(folder, exist_ok=True); get(MIRROR + path, out)
        have[uid] = {'uid': uid, 'title': rec['name'], 'author': rec['user'].get('displayName') or rec['user']['username'], 'user': rec['user']['username'], 'licence': OPEN[lic['slug']], 'licence_url': lic.get('url'),
                     'url': 'https://sketchfab.com/3d-models/' + uid, 'via': 'Objaverse 1.0 (allenai/objaverse on Hugging Face), ' + path, 'faces': rec.get('faceCount'), 'published': (rec.get('publishedAt') or '')[:10],
                     'licence_checked': time.strftime('%Y-%m-%d'), 'bytes': os.path.getsize(out)}
        print('%s  %-46s %-16s %-10s %9d bytes' % (uid, rec['name'][:46], have[uid]['user'][:16], have[uid]['licence'], have[uid]['bytes'])); time.sleep(0.4)
    json.dump(sorted(have.values(), key=lambda s: s['title'].lower()), open(manifest, 'w'), indent=1, ensure_ascii=False)

if __name__ == '__main__': main()

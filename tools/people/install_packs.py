"""install_packs.py: unpack the MakeHuman add-on and its asset packs into a private Blender user folder.
   python3 tools/people/install_packs.py [PEOPLE_DIR]
PEOPLE_DIR defaults to ~/Developer/overlord-asset-sources/people. Downloads are expected in PEOPLE_DIR/downloads/<pack>/<pack>.zip
(fetched by PEOPLE_DIR/downloads/fetch.sh). Nothing is installed into the real Blender settings of this computer: the patient
scripts run Blender with BLENDER_USER_RESOURCES pointing at PEOPLE_DIR/blender-user, and only that folder is written here.
An asset pack is a zip whose folders (skins/, hair/, eyes/, packs/ ...) belong directly in the add-on's user data folder;
that is all the add-on's own "install asset pack" button does. Safe to run again: files are simply written over."""
import os, sys, zipfile, glob

PEOPLE = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else '~/Developer/overlord-asset-sources/people')
USER = os.path.join(PEOPLE, 'blender-user')
ADDON_DIR = os.path.join(USER, 'extensions', 'user_default', 'mpfb')                 # where Blender looks for the add-on
DATA_DIR = os.path.join(USER, 'extensions', '.user', 'user_default', 'mpfb', 'data')  # where the add-on looks for asset packs


def safe_extract(zf, dest):
    """Extract every file, refusing any path that would land outside dest."""
    root = os.path.realpath(dest)
    n = 0
    for m in zf.infolist():
        if m.filename.startswith('__MACOSX') or m.is_dir():
            continue
        out = os.path.realpath(os.path.join(dest, m.filename))
        if not out.startswith(root + os.sep):
            raise SystemExit('refusing a path outside the target: ' + m.filename)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with zf.open(m) as src, open(out, 'wb') as dst:
            dst.write(src.read())
        n += 1
    return n


os.makedirs(DATA_DIR, exist_ok=True)
for z in sorted(glob.glob(os.path.join(PEOPLE, 'downloads', '*', '*.zip'))):
    pack = os.path.basename(os.path.dirname(z))
    with zipfile.ZipFile(z) as zf:
        if pack == 'mpfb-addon':
            os.makedirs(ADDON_DIR, exist_ok=True)
            print(pack, safe_extract(zf, ADDON_DIR), 'files ->', ADDON_DIR)
        else:
            if not any(n.startswith('packs/') for n in zf.namelist()):
                print(pack, 'SKIPPED: not an asset pack (no packs/ folder)')
                continue
            print(pack, safe_extract(zf, DATA_DIR), 'files ->', DATA_DIR)
print('installed packs:', sorted(os.path.basename(p)[:-5] for p in glob.glob(os.path.join(DATA_DIR, 'packs', '*.json'))))

#!/usr/bin/env python3
"""render_narration.py: record the institute's spoken lines ahead of time, so the app plays real audio and needs no speech
service while it runs.

   python3 tools/render_narration.py [--voice NAME_OR_ID] [--redo]

It reads every line the lessons speak (the plexus film's cues and the regional explanation's steps) straight from the data
modules, asks ElevenLabs for each line that has no recording yet, measures each recording, and writes
assets/audio/narration/<key>.mp3 and manifest.json. The lesson's timing is then taken from the recordings, so a line is never
cut off and never leaves dead air.

The key comes from the environment (ELEVENLABS_API_KEY) and is never written anywhere. Lines already recorded with the same
voice are skipped, so a re-run costs nothing; change a line's wording and only that line is recorded again. Needs node and
ffprobe. Captions always carry the same words, so the app works without these files too (it falls back to the browser's voice)."""
import hashlib, json, os, subprocess, sys, urllib.request, urllib.error
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); OUT = os.path.join(ROOT, 'assets', 'audio', 'narration'); os.makedirs(OUT, exist_ok=True)
VOICES = {'matilda': 'XrExE9yKIg1WjnnlVkGX', 'bella': 'hpp4J3VqNfWAUOO0d1Us', 'alice': 'Xb7hH8MSUJpSbSDYk0k2', 'brian': 'nPczCjzI2devNBz1zQrb', 'daniel': 'onwK4e9ZLuTAKqWW03F9', 'george': 'JBFqnCBsd6RMkjVDRZzb', 'bill': 'pqHfZKP75CvOlQylNhV4'}   # ElevenLabs premade voices
MODEL = 'eleven_multilingual_v2'; SETTINGS = {'stability': 0.5, 'similarity_boost': 0.8, 'style': 0.1, 'use_speaker_boost': True, 'speed': 0.97}
a = sys.argv[1:]; redo = '--redo' in a; name = a[a.index('--voice') + 1] if '--voice' in a else 'matilda'; voice = VOICES.get(name.lower(), name); key = os.environ.get('ELEVENLABS_API_KEY')
lines = json.loads(subprocess.run(['node', '--input-type=module', '-e', "import { FILM } from './world/data/plexus.js'; import { NARRATION } from './world/data/regional.js'; console.log(JSON.stringify([...FILM.cues.map((c) => ['film', c.say]), ...NARRATION.map((n) => ['regional', n.say])]));"], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
mpath = os.path.join(OUT, 'manifest.json'); old = json.load(open(mpath)) if os.path.exists(mpath) else {'clips': []}; had = {c['text']: c for c in old.get('clips', []) if old.get('voice_id') == voice}
clips = []; spent = 0
for where, text in lines:
    k = hashlib.sha1((voice + '|' + text).encode()).hexdigest()[:12]; f = os.path.join(OUT, k + '.mp3')
    if redo or not os.path.exists(f) or text not in had:
        if not key: sys.exit('ELEVENLABS_API_KEY is not set, and "%s..." has no recording yet.' % text[:40])
        req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128', data=json.dumps({'text': text, 'model_id': MODEL, 'voice_settings': SETTINGS}).encode(), headers={'xi-api-key': key, 'content-type': 'application/json', 'accept': 'audio/mpeg'})
        try: audio = urllib.request.urlopen(req, timeout=120).read()
        except urllib.error.HTTPError as e: sys.exit(f'ElevenLabs refused ({e.code}): {e.read()[:300].decode(errors="replace")}')
        open(f, 'wb').write(audio); spent += len(text); print('recorded', k, f'{len(audio) / 1e3:.0f} kB', text[:60])
    sec = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True, check=True).stdout.strip())
    clips.append({'text': text, 'file': k + '.mp3', 'seconds': round(sec, 2), 'for': where})
keep = {c['file'] for c in clips}
for f in os.listdir(OUT):
    if f.endswith('.mp3') and f not in keep: os.remove(os.path.join(OUT, f))                # a line that was reworded leaves no stale recording behind
json.dump({'voice': name, 'voice_id': voice, 'model': MODEL, 'made_with': 'ElevenLabs text to speech', 'clips': clips}, open(mpath, 'w'), indent=1)
print(f'{len(clips)} lines, {sum(c["seconds"] for c in clips):.1f} s of audio, {spent} characters sent this run; film {sum(c["seconds"] for c in clips if c["for"] == "film"):.1f} s, regional {sum(c["seconds"] for c in clips if c["for"] == "regional"):.1f} s')

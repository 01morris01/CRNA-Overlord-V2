"""patient_specs.py: decide what each of the 56 mock patients looks like, and write it down once.
   python3 tools/people/patient_specs.py [OUT.json]        (default: ~/Developer/overlord-asset-sources/people/work/specs.json)
Reads data/mock-or-day/index.json (age, sex, height, weight). Nothing here is random at run time: every choice comes
from the patient's id, so the same file is produced every time, and one line in OVERRIDES changes one patient.

Where the looks come from:
  * Age, sex, height and weight are the chart's.
  * The charts were read for anything said about appearance. They state no race or ethnicity for anyone, so skin tone and
    facial type are NOT taken from names or diagnoses: the 56 ids are dealt, in a fixed shuffled order, into four broad
    groups in fixed numbers (see GROUPS). That gives a varied, plausible spread that does not depend on who is who.
  * What the charts do say is honoured in OVERRIDES, with the chart's own words quoted beside each entry: beards,
    pregnancy, dentures out, a wig, an athletic or frail build, ascites, a goitre, jaundice, pallor.
Everything is a mock patient; no real person's likeness is used anywhere."""
import json, os, sys, hashlib, random

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else '~/Developer/overlord-asset-sources/people/work/specs.json')

# ---- the four broad groups: (name, how many of the 56, facial-type mixes to draw from, skin tone range on a 1..6 light-to-dark scale)
GROUPS = [
    ('A', 26, [{'caucasian': 1.0}, {'caucasian': 0.9, 'asian': 0.1}, {'caucasian': 0.9, 'african': 0.1}], (1.4, 2.9)),
    ('B', 11, [{'african': 1.0}, {'african': 0.85, 'caucasian': 0.15}], (4.7, 5.9)),
    ('C', 5, [{'asian': 1.0}, {'asian': 0.85, 'caucasian': 0.15}], (2.2, 3.3)),
    ('D', 14, [{'caucasian': 0.55, 'african': 0.45}, {'caucasian': 0.5, 'asian': 0.5}, {'caucasian': 0.7, 'african': 0.15, 'asian': 0.15}, {'african': 0.5, 'asian': 0.5},
               {'caucasian': 0.65, 'african': 0.35}], (3.1, 4.5)),
]
TONES = [(1.0, (0.95, 0.82, 0.74)), (2.0, (0.89, 0.73, 0.62)), (3.0, (0.80, 0.63, 0.50)), (4.0, (0.67, 0.49, 0.36)), (5.0, (0.48, 0.33, 0.23)), (6.0, (0.31, 0.21, 0.15))]
EYES = {'dark': (0.15, 0.085, 0.05), 'brown': (0.25, 0.145, 0.075), 'hazel': (0.25, 0.185, 0.10), 'green': (0.27, 0.33, 0.20), 'blue': (0.27, 0.38, 0.52), 'grey': (0.38, 0.43, 0.47)}
HAIR = {'black': (0.07, 0.06, 0.06), 'darkbrown': (0.16, 0.10, 0.07), 'brown': (0.30, 0.19, 0.11), 'lightbrown': (0.44, 0.31, 0.19), 'blond': (0.68, 0.54, 0.34), 'red': (0.50, 0.22, 0.10)}
GREY = (0.66, 0.66, 0.67)

# ---- what the charts say (quoted), and nothing else
OVERRIDES = {
    'p02': {'pregnant': 1.0, 'note': 'chart: repeat cesarean at term'},
    'p14': {'pregnant': 1.0, 'note': 'chart: labor epidural at term'},
    'p47': {'pregnant': 0.3, 'note': 'chart: 18 wk pregnant'},
    'p39': {'belly': 0.6, 'jaundice': 0.5, 'note': 'chart: "Abdomen distended", "Mild jaundice" (cirrhosis with ascites)'},
    'p13': {'jaundice': 0.4, 'note': 'chart: "Mild jaundice face/chest", fading'},
    'p06': {'goitre': 0.9, 'note': 'chart: "Large goiter, extends below the sternal notch"; shown only as a thicker neck'},
    'p16': {'muscle': 0.74, 'note': 'chart: "Athletic build"'},
    'p49': {'muscle': 0.28, 'note': 'chart: "72F frail"'},
    'p30': {'muscle': 0.38, 'note': 'chart: proximal weakness, difficulty rising from chairs'},
    'p04': {'beard': 'full', 'note': 'chart: "full beard"'},
    'p51': {'beard': 'full', 'note': 'chart: "Full beard for 10 years"'},
    'p31': {'beard': 'full', 'note': 'chart: "neck circ 46 cm, beard"'},
    'p28': {'beard': 'short', 'note': 'chart: "Beard trimmed short"'},
    'p07': {'beard': None, 'note': 'chart: "no beard"'},
    'p10': {'hair': None, 'browStrength': 0.35, 'note': 'chart: "Wears wig" after chemotherapy; shown without it, as in theatre'},
    'p03': {'teeth': 'none', 'note': 'chart: "Full upper and lower dentures, remove before induction"'},
    'p35': {'teeth': 'lower', 'note': 'chart: "Edentulous upper, lower partial denture (remove)"'},
    'p44': {'teeth': 'lower', 'note': 'chart: "Edentulous upper (denture given to wife), own lower teeth"'},
    'p23': {'pale': 0.5, 'note': 'chart: "pale, fatigued", "Pale conjunctivae"'},
    'p33': {'pale': 0.6, 'note': 'chart: "Pale, anxious, diaphoretic"'},
    'p45': {'pale': 0.4, 'note': 'chart: "Pale conjunctivae"'},
    'p50': {'note': 'chart: trisomy 21. No attempt is made to model its facial features; the figure is a generic 9-year-old'},
}


def rng_for(pid, salt=''):
    return random.Random(int(hashlib.sha256(('overlord-people:' + pid + ':' + salt).encode()).hexdigest()[:12], 16))


def tone_rgb(t):
    for (t0, c0), (t1, c1) in zip(TONES[:-1], TONES[1:]):
        if t <= t1:
            f = min(max((t - t0) / (t1 - t0), 0.0), 1.0)
            return [round(a + (b - a) * f, 4) for a, b in zip(c0, c1)]
    return list(TONES[-1][1])


def mh_age(years):
    """The add-on's age control: 0 = one year old, 0.1875 = ten, 0.5 = twenty-five, 1 = ninety."""
    if years <= 25:
        return max(0.0, (years - 1.0) / 48.0)
    if years <= 60:
        return 0.5 + (years - 25.0) / 130.0
    return min(0.93, 0.769 + (years - 60.0) / 30.0 * 0.14)      # past sixty the add-on's "old" shape is taken more slowly: its far end is a caricature


def pick(r, table):
    x = r.random() * sum(w for _, w in table)
    for name, w in table:
        x -= w
        if x <= 0:
            return name
    return table[-1][0]


# Symmetric face shapes to vary between people: (target folder/name without -incr/-decr or with the two ends given, spread)
FACE_PAIRS = [('nose/nose-scale-horiz', 0.30), ('nose/nose-scale-vert', 0.25), ('nose/nose-hump', 0.30), ('nose/nose-volume', 0.25), ('nose/nose-width2', 0.25),
              ('nose/nose-nostrils-width', 0.25), ('mouth/mouth-scale-horiz', 0.28), ('mouth/mouth-upperlip-volume', 0.30), ('mouth/mouth-lowerlip-volume', 0.30),
              ('chin/chin-width', 0.30), ('chin/chin-prominent', 0.25), ('chin/chin-height', 0.25), ('chin/chin-bones', 0.25), ('forehead/forehead-scale-vert', 0.2),
              ('forehead/forehead-temple', 0.2), ('head/head-scale-horiz', 0.2), ('head/head-fat', 0.12)]
FACE_LR = [('cheek/{s}-cheek-bones', 0.30), ('cheek/{s}-cheek-volume', 0.22), ('eyes/{s}-eye-scale', 0.18), ('eyes/{s}-eye-height2', 0.22), ('ears/{s}-ear-scale', 0.25),
           ('ears/{s}-ear-wing', 0.3), ('ears/{s}-ear-lobe', 0.3)]
FACE_ENDS = [(('nose/nose-point-up', 'nose/nose-point-down'), 0.3), (('eyes/{s}-eye-corner2-up', 'eyes/{s}-eye-corner2-down'), 0.2)]
HEAD_SHAPES = ['head/head-oval', 'head/head-round', 'head/head-rectangular', 'head/head-square', 'head/head-triangular', 'head/head-invertedtriangular', 'head/head-diamond']


def face_targets(r, amount):
    out = []
    g = lambda sd: max(-0.65, min(0.65, r.gauss(0, sd))) * amount
    for base, sd in FACE_PAIRS:
        v = g(sd)
        out.append([base + ('-incr' if v >= 0 else '-decr'), round(abs(v), 3)])
    for base, sd in FACE_LR:
        v = g(sd)
        for s in ('l', 'r'):
            out.append([base.format(s=s) + ('-incr' if v >= 0 else '-decr'), round(abs(v), 3)])
    for (up, down), sd in FACE_ENDS:
        v = g(sd)
        for s in (('l', 'r') if '{s}' in up else ('',)):
            out.append([(up if v >= 0 else down).format(s=s), round(abs(v), 3)])
    out.append([r.choice(HEAD_SHAPES), round(r.uniform(0.1, 0.55) * amount, 3)])
    return [t for t in out if t[1] > 0.02]


# ---- hair: which assets, for whom. All are CC0 (MakeHuman system assets and the "hair01" pack); see the ledger rows.
# Every style ends up worn off the face: make_person.py cuts the hair mesh back behind the hairline and paints the hairline itself.
HAIR_MEN = [('culturalibre_hair_02', 40), ('short02', 30), ('short04', 30)]
HAIR_MEN_B = [('afro01', 65), ('culturalibre_hair_02', 35)]
HAIR_WOMEN = [('toigo_blunt_bob', 20), ('toigo_curled_under_bob', 18), ('toigo_inverted_bob', 14), ('ponytail01', 24), ('rehmanpolanski_hair_bun_brown', 18), ('culturalibre_hair_01', 6)]
HAIR_WOMEN_B = [('afro01', 40), ('ponytail01', 25), ('rehmanpolanski_hair_bun_brown', 25), ('toigo_curled_under_bob', 10)]
HAIR_WOMEN_OLD = [('toigo_curled_under_bob', 30), ('short02', 30), ('rehmanpolanski_hair_bun_brown', 25), ('toigo_blunt_bob', 15)]
HAIR_BOYS = [('culturalibre_hair_02', 50), ('short02', 50)]
HAIR_GIRLS = [('ponytail01', 45), ('toigo_curled_under_bob', 35), ('toigo_blunt_bob', 20)]
BROWS_MEN = ['eyebrow012', 'eyebrow012', 'eyebrow009', 'eyebrow010']
BROWS_WOMEN = ['eyebrow001', 'eyebrow004', 'eyebrow005', 'eyebrow010', 'eyebrow011']
BROWS_CHILD = ['eyebrow004', 'eyebrow011']
BEARD = 'grinsegold_beard_sigmund_wip/grinsegold_beard_sigmund_wip.mhclo'      # used only for its outline: where a full beard grows (CC0, pack "bodyparts05")


def hair_file(name):
    """An asset's .mhclo file is not always named after its folder; look it up in the installed library."""
    lib = os.path.expanduser(os.environ.get('OVERLORD_PEOPLE', '~/Developer/overlord-asset-sources/people') + '/blender-user/extensions/.user/user_default/mpfb/data/hair/' + name)
    for f in sorted(os.listdir(lib)) if os.path.isdir(lib) else []:
        if f.endswith('.mhclo'):
            return name + '/' + f
    return name + '/' + name + '.mhclo'


def build():
    idx = json.load(open(os.path.join(REPO, 'data', 'mock-or-day', 'index.json')))['patients']
    ids = sorted(p['id'] for p in idx)
    order = sorted(ids, key=lambda i: hashlib.sha256(('overlord-people:deal:' + i).encode()).hexdigest())
    group_of = {}
    pos = 0
    for name, count, _, _ in GROUPS:
        for i in order[pos:pos + count]:
            group_of[i] = name
        pos += count
    specs = {}
    for p in idx:
        pid = p['id']; ph = p['physiology']
        ov = OVERRIDES.get(pid, {})
        r = rng_for(pid)
        male = p['sex'].upper().startswith('M')
        years = float(ph['ageYears'])
        H, W = float(ph['heightCm']) / 100.0, float(ph['weightKg'])
        gname = group_of[pid]
        _, _, mixes, (t_lo, t_hi) = next(g for g in GROUPS if g[0] == gname)
        mix = dict(r.choice(mixes))
        race = {k: mix.get(k, 0.0) for k in ('asian', 'caucasian', 'african')}
        t = r.uniform(t_lo, t_hi)
        rgb = tone_rgb(t)
        if ov.get('jaundice'):
            j = ov['jaundice']; rgb = [rgb[0] * (1 + 0.02 * j), rgb[1] * (1 + 0.02 * j), rgb[2] * (1 - 0.16 * j)]
        if ov.get('pale'):
            q = ov['pale']; m = sum(rgb) / 3; rgb = [c + (m * 1.06 - c) * 0.35 * q for c in rgb]
        child, infant, old = years < 13, years < 1, years >= 65
        mean_h = 1.76 if male else 1.63
        macros = {'gender': 1.0 if male else 0.0, 'age': round(mh_age(years), 4),
                  'muscle': ov.get('muscle', round((0.55 if male else 0.48) - (0.10 if years >= 70 else 0.0) + r.uniform(-0.05, 0.05), 3)),
                  'proportions': round(r.uniform(0.38, 0.62), 3), 'height': 0.5 if years < 18 else round(min(0.85, max(0.15, 0.5 + (H - mean_h) / 0.5)), 3),
                  'cupsize': round(r.uniform(0.42, 0.6), 3), 'firmness': round(max(0.25, 0.6 - max(0.0, years - 30) / 150.0), 3), 'race': race}
        targets = face_targets(rng_for(pid, 'face'), 0.55 if child else 1.0)
        wide = 0.18 if old else 0.32                                     # eyes a little more open than the base mesh's sleepy default
        targets += [['faceunits/eyeWideLeft', wide], ['faceunits/eyeWideRight', wide]]
        # a face at rest: brows a little up, the corners of the mouth not turned down (the base mesh, older faces most of all, frowns)
        targets += [['eyebrows/eyebrows-trans-up', 0.25], ['mouth/mouth-angles-up', 0.2 if years >= 40 else 0.1]]
        if male and not child:
            targets.append(['eyebrows/eyebrows-angle-down', 0.22])            # the thicker brow assets sit with their inner ends high, which reads as worry
        if ov.get('pregnant'):
            targets.append(['stomach/stomach-pregnant-incr', ov['pregnant']])
        if ov.get('belly'):
            targets.append(['stomach/stomach-pregnant-incr', ov['belly']])
        if ov.get('goitre'):
            targets += [['neck/measure-neck-circ-incr', ov['goitre']], ['neck/neck-scale-depth-incr', 0.5 * ov['goitre']]]
        band = 'young' if years < 40 else ('middleage' if years < 65 else 'old')
        kind = max(race, key=race.get)
        skin_sex = 'female' if (child or not male) else 'male'          # children of both sexes use the smooth young skin without stubble
        skin = f'{band}_{kind}_{skin_sex}/{band}_{kind}_{skin_sex}.mhmat'
        # eyes
        if gname == 'A':
            eye = pick(r, [('brown', 40), ('blue', 27), ('hazel', 16), ('green', 9), ('grey', 8)])
        elif gname == 'D':
            eye = pick(r, [('dark', 45), ('brown', 43), ('hazel', 12)])
        else:
            eye = pick(r, [('dark', 80), ('brown', 20)])
        # hair colour, then greying with age
        if gname == 'A':
            hc = pick(r, [('darkbrown', 32), ('brown', 30), ('lightbrown', 14), ('blond', 12 + (10 if child else 0)), ('black', 6), ('red', 6)])
        elif gname == 'D':
            hc = pick(r, [('black', 55), ('darkbrown', 45)])
        else:
            hc = 'black'
        grey = min(1.0, max(0.0, (years - 38 + r.uniform(-10, 10)) / 45.0)) * (1.0 if male else 0.8)      # many women colour their hair
        base = HAIR[hc]
        tint = [round(b + (g - b) * grey, 3) for b, g in zip(base, GREY)]
        light = sum(tint) / 3                                            # how light the hair ends up, 0 black .. 0.66 white
        # hair style
        rh = rng_for(pid, 'hair')
        if infant:
            style = None
        elif child:
            style = pick(rh, [('afro01', 100)] if gname == 'B' else (HAIR_BOYS if male else HAIR_GIRLS))
        elif male:
            style = pick(rh, HAIR_MEN_B if gname == 'B' else HAIR_MEN)
        else:
            style = pick(rh, HAIR_WOMEN_OLD if old else (HAIR_WOMEN_B if gname == 'B' else HAIR_WOMEN))
        if 'hair' in ov:
            style = ov['hair']
        hair = {'tint': tint, 'level': round(0.42 + 0.10 * light, 3), 'contrast': round(1.0 - 0.45 * light, 2), 'scalpShade': round(max(0.3, 0.92 - 1.0 * light), 2),
                'cutSides': style in ('culturalibre_hair_02', 'short02', 'short04', 'afro01')}
        if male and years >= 50 and style in ('culturalibre_hair_02', 'short04', 'short02'):
            thin = min(1.0, (years - 50) / 30.0) * rh.uniform(0.5, 1.0)                  # thinning with age, more for some than for others
            if thin > 0.55:
                hair['cutTop'] = round(0.80 - 0.07 * (thin - 0.55) / 0.45, 3)        # bald on top, hair left at the sides and back
                hair['scalpCover'] = 0.0
                hair['scalpShade'] = round(hair['scalpShade'] * 0.7, 2)
        if style == 'afro01':
            hair.update({'contrast': 0.12, 'level': 0.32})                           # tight curls read as one dark mass, not as light and dark patches
        if infant:
            hair.update({'scalpShade': 0.22, 'scalpClean': 0.9})                     # a newborn's fine hair: a faint tint on the scalp, no hair mesh
        if ov.get('hair', 1) is None:
            hair.update({'scalpShade': 0.07, 'scalpClean': 0.95})
        # brows, lashes
        rb = rng_for(pid, 'brow')
        brows = rb.choice(BROWS_CHILD if child else (BROWS_MEN if male else BROWS_WOMEN))
        btint = [round((b * 0.72) + (0.5 - b * 0.72) * grey * 0.55, 3) for b in base]
        brow = {'tint': btint, 'strength': ov.get('browStrength', round((0.6 if child else (1.0 if male else 0.9)) * (0.85 if old else 1.0) * (0.8 if hc == 'blond' else 1.0), 2))}
        lash = {'upper': round((0.62 if (male or child) else 0.8) * (0.85 if old else 1.0), 2), 'lower': 0.2 if (male or child) else 0.3,
                'rgb': [round(min(0.16, c * 0.6 + 0.02), 3) for c in base]}      # a painted lash line, dark brown rather than black, lighter for fair hair
        parts = {'eyes': 'high-poly/high-poly.mhclo', 'lashes': ('eyelashes01/eyelashes01.mhclo' if (male or child) else 'eyelashes02/eyelashes02.mhclo'),
                 'teeth': 'teeth_base/teeth_base.mhclo', 'tongue': 'tongue01/tongue01.mhclo', 'brows': f'{brows}/{brows}.mhclo'}
        if style:
            parts['hair'] = hair_file(style)
        spec = {'id': pid, 'sex': 'M' if male else 'F', 'ageYears': years, 'ageText': p['age'], 'heightM': round(H, 3), 'weightKg': W, 'group': gname, 'toneScale': round(t, 2),
                'macros': macros, 'targets': targets, 'skin': skin, 'tone': {'rgb': [round(c, 4) for c in rgb]},
                'eye': {'name': eye, 'rgb': list(EYES[eye]), 'pupil': round(r.uniform(0.27, 0.34), 3)},
                'hairColor': {'name': hc, 'grey': round(grey, 2)}, 'hairStyle': style, 'hair': hair, 'brow': brow, 'lash': lash, 'parts': parts,
                'reliefStrength': round(0.16 * (0.45 if child else (0.75 if years < 30 else (1.0 if years < 60 else 1.2))) * (0.75 if t > 4 else 1.0), 3),
                'saturation': 1.18 if t < 3.2 else (1.08 if t < 4.2 else 1.0), 'occlusion': (0.5 if t < 4.2 else 0.38) * (0.6 if child else 1.0),
                'teeth': ov.get('teeth', 'none' if infant else 'all'), 'flags': {k: v for k, v in ov.items() if k != 'note'}, 'note': ov.get('note', '')}
        if ov.get('beard'):
            parts['beard'] = BEARD
            spec['beard'] = {'tint': [round(c * 0.95, 3) for c in tint], 'shade': 0.93 if ov['beard'] == 'full' else 0.62}
        specs[pid] = spec
    return specs


if __name__ == '__main__':
    specs = build()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(specs, open(OUT, 'w'), indent=1)
    from collections import Counter
    print('wrote', OUT, len(specs), 'patients;', dict(Counter(s['group'] for s in specs.values())))
    for s in specs.values():
        print(s['id'], s['sex'], f"{s['ageYears']:5.1f}y", f"{s['heightM']:.2f}m {s['weightKg']:6.1f}kg", s['group'], f"tone {s['toneScale']:.1f}", s['eye']['name'].ljust(6), s['hairColor']['name'].ljust(10), f"grey {s['hairColor']['grey']:.2f}",
              str(s['hairStyle']).ljust(30), 'thin' if 'density' in s['hair'] else '    ', 'bald-top' if 'cutTop' in s['hair'] else '        ', s['parts']['brows'][:10], s['note'][:40])

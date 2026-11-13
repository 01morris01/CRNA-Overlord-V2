"""specs.py: the measurements the bedside props are built from, with where each came from. Plain Python, no Blender,
so the texture script and the Blender scripts read the same numbers.

Every dimension is in millimetres unless it says otherwise. "unsourced" means: my own proportion, chosen to look right
beside the sourced numbers; it is repeated as such in bedside.json and the README."""
import math

CHECKED = '2026-11-12'

# ------------------------------------------------------------------------------------------------------------ sources
SOURCES = {
    'harvard_syringes': {
        'what': 'Inside diameter of plastic syringe barrels by size ("BD Plastic": 1 mL 4.78, 3 mL 8.66, 5 mL 12.06, 10 mL 14.5, 20 mL 19.13, 50/60 mL 26.7 mm)',
        'title': 'Syringe Selection Guide: Common Syringe Data, Diameter and Plunger Surface Area', 'publisher': 'Harvard Apparatus (catalog page, 2005)',
        'url': 'https://karpova-lab.github.io/syringe-pump/v4.0/homepage/syringe_diameters.pdf', 'checked': CHECKED},
    'bd_catalog': {
        'what': 'Graduation interval of each syringe size (1 mL: 1/100 mL; 3 mL: 1/10 mL; 5 and 10 mL: 1/5 mL; 20, 30 and 50 mL: 1 mL) and that every size from 1 to 50 mL is made with a locking luer tip',
        'title': 'Hypodermic product catalog, BD-75999 (03/23), p. 5', 'publisher': 'Becton, Dickinson and Company',
        'url': 'https://go.bd.com/rs/565-YXD-236/images/BD-75999%20BD%20Hypodermics%20Catalog%20V3.pdf', 'checked': CHECKED},
    'luer': {
        'what': 'The luer fitting is a cone with a nominal 6 % taper (change of diameter per unit of length); a locking luer adds a threaded collar; ISO 80369-7 is the current standard for intravascular connectors. No diameters are given there.',
        'title': 'Luer taper', 'publisher': 'Wikipedia', 'url': 'https://en.wikipedia.org/wiki/Luer_taper', 'checked': CHECKED},
    'iso8362': {
        'what': 'Injection vial formats 2R to 100R: body and crimp-neck diameters, heights, wall and base thickness, radii, brimful capacity (the table "ISO 8362-1: Dimensions, brimful capacity and mass")',
        'title': 'Core Vials in StandardLine quality, datasheet 40141 ENGLISH 02/2026, p. 2', 'publisher': 'SCHOTT Pharma AG & Co. KGaA (reproducing ISO 8362-1)',
        'url': 'https://media.schott.com/api/public/content/0815cb6af9774080a9ff85e150f8a724', 'checked': CHECKED},
    'ecg_colours_wikipedia': {
        'what': 'Electrode colors under the AHA (United States) scheme: RA white, LA black, RL green, LL red, chest electrodes brown (V1 to V6 brown with a second color); IEC: R red, L yellow, N black, F green, C white',
        'title': 'Electrocardiography, section "Electrodes and leads", table of electrode names, placement and colors', 'publisher': 'Wikipedia',
        'url': 'https://en.wikipedia.org/wiki/Electrocardiography', 'checked': CHECKED},
    'ecg_colours_ge': {
        'what': 'AHA labels with colors as printed: LA (black), RA (white), LL (red), RL (green); in the five-electrode two-channel layout the chest electrode is brown and the ground is green',
        'title': 'Diagnostic ECG Lead Placement (poster), part number DC-0176-11.06-EN-US', 'publisher': 'GE Healthcare, 2006',
        'url': 'https://clinicalview.gehealthcare.com/sites/default/files/ECG%20Lead%20Placement%20Poster.pdf', 'checked': CHECKED},
    'electrode_fiab': {
        'what': 'An adult disposable monitoring electrode: 50 x 48 mm oval, medical-grade polyethylene foam backing, polyethylene reinforcing disc, solid gel, silver/silver chloride sensor, stainless steel snap; meets ANSI/AAMI EC12:2000',
        'title': 'Data sheet F9060 - F9060P, ECG disposable electrodes, 52501119BR4M 2021/09', 'publisher': 'FIAB SpA',
        'url': 'https://cdn.shopify.com/s/files/1/0754/1581/4486/files/Scheda_tecnica-elettrodo-monouso-F9060.pdf', 'checked': CHECKED},
    'electrode_nissha': {
        'what': 'A snap electrode data sheet giving a sensor (eyelet) diameter of 10.6 mm, a stainless steel stud and a wet-gel sponge',
        'title': 'SilveRest vinyl tape single use electrodes, reference A10009, rev. 09/26', 'publisher': 'Nissha Medical Technologies',
        'url': 'https://hs.nisshamedical.com/globalassets/specsheets/electrodes/silverest_6500032v.pdf', 'checked': CHECKED},
    'tof_nagelhout': {
        'what': 'The ulnar nerve with the thumb adductor is the preferred site; disposable electrodes go over the ulnar nerve, the distal one at the proximal flexor crease of the wrist and the other over and parallel to the flexor carpi ulnaris tendon; the thumb adducts on stimulation (paraphrased)',
        'title': 'Nurse Anesthesia, 7th ed. (Nagelhout, Heiner, Elisha; Elsevier, 2023), ch. 12, pp. 152-153 and Fig. 12.3', 'publisher': "the owner's own copy, read on the page", 'url': None, 'checked': CHECKED},
    'tof_lee2011': {
        'what': 'Two surface electrodes at the wrist over the ulnar nerve; the positive electrode about 3 cm proximal to the distal negative one; the negative electrode is recommended at the distal site and the pair less than 6 cm apart; skin cleaned first',
        'title': 'Lee HJ, Kim KS, Shim JC, Yoon SW. A comparison of the accuracy of ulnar versus median nerve stimulation for neuromuscular monitoring. Korean J Anesthesiol 2011;60(5):334-8',
        'publisher': 'PubMed Central PMC3110291', 'url': 'https://doi.org/10.4097/kjae.2011.60.5.334', 'checked': CHECKED},
    'cannula_colours': {
        'what': 'Peripheral cannula hub colors and outside diameters by gauge: 14G orange 2.0 mm, 16G gray 1.8, 18G green 1.3, 20G pink 1.1, 22G blue 0.9, 24G yellow 0.6 (the article credits a pediatric anesthesia text and names no standard)',
        'title': 'Peripheral venous catheter, table of sizes', 'publisher': 'Wikipedia', 'url': 'https://en.wikipedia.org/wiki/Peripheral_venous_catheter', 'checked': CHECKED},
    'french': {
        'what': '1 French = 1/3 mm of outside diameter (16 Fr = 5.33 mm, 18 Fr = 6.0 mm)', 'title': 'French catheter scale', 'publisher': 'Wikipedia', 'url': 'https://en.wikipedia.org/wiki/French_catheter_scale', 'checked': CHECKED},
    'og_staging': {
        'what': 'A stomach tube is passed through the mouth after the airway is secured and before the first incision in laparoscopy, to empty the stomach (which book pages say so is recorded in the staging research and its independent check)',
        'title': 'research/staging/staging.md stage 3 and research/staging-verify/staging-verify.md row V24', 'publisher': 'project research (Jaffe pp. 671-674; Nurse Anesthesia 7th ed. p. 784; Barash 9th ed. p. 1223, as checked there)', 'url': None, 'checked': '2026-11-11'},
    'formulary_notes': {
        'what': 'Stock presentations read on DailyMed by the formulary task (vial sizes 1, 2, 5, 10, 20, 50 and 100 mL; 1 mL ampules; acetaminophen 1,000 mg in 100 mL; lactated Ringer in 250, 500 and 1,000 mL bags). data/world/formulary.json did not exist when this set was built.',
        'title': 'overlord-asset-sources/work/formulary/notes/label_facts.md (in progress, not reviewed here)', 'publisher': 'project research', 'url': 'https://dailymed.nlm.nih.gov/', 'checked': CHECKED},
}

# ------------------------------------------------------------------------------------------------------------ syringes
# idmm: barrel inside diameter (harvard_syringes). tick/mid/major: graduation steps in mL; tick is the catalog interval (bd_catalog).
# Everything else (wall, flange, lengths of the tip, plunger and stopper) is unsourced proportion.
def _labels(step, top, fmt='%g'): return [(round(step * k, 4), fmt % (step * k)) for k in range(1, int(round(top / step)) + 1)]
SYRINGES = {
    '1ml':  dict(ml=1,  idmm=4.78,  wall=0.80, tick=0.01, mid=0.05, major=0.1, labels=_labels(0.1, 1, '%.1f'), flange=(10.0, 4.7), thumb=11.0, band=5.2, cap=1.55, segs=28, bore=1.1),
    '3ml':  dict(ml=3,  idmm=8.66,  wall=0.75, tick=0.1,  mid=0.5,  major=1.0, labels=_labels(1, 3),            flange=(11.5, 7.0), thumb=14.0, band=7.6, cap=2.5,  segs=36, bore=1.7),
    '5ml':  dict(ml=5,  idmm=12.06, wall=0.75, tick=0.2,  mid=1.0,  major=1.0, labels=_labels(1, 5),            flange=(13.5, 8.8), thumb=17.0, band=9.6, cap=2.8,  segs=36, bore=1.9),
    '10ml': dict(ml=10, idmm=14.5,  wall=0.75, tick=0.2,  mid=1.0,  major=1.0, labels=_labels(1, 10),           flange=(15.5, 10.2), thumb=19.5, band=11.5, cap=2.9, segs=40, bore=1.9),
    '20ml': dict(ml=20, idmm=19.13, wall=0.90, tick=1.0,  mid=5.0,  major=5.0, labels=_labels(5, 20),           flange=(19.0, 12.8), thumb=23.5, band=14.0, cap=3.4, segs=44, bore=2.0),
    '60ml': dict(ml=60, idmm=26.7,  wall=1.15, tick=1.0,  mid=5.0,  major=10.0, labels=_labels(10, 60),         flange=(26.0, 17.0), thumb=31.0, band=18.0, cap=4.2, segs=48, bore=2.1),
}
def syringe_geometry(key):
    """Derived lengths (mm) for one syringe size."""
    s = dict(SYRINGES[key]); r = s['idmm'] / 2; s['mm_per_ml'] = 1000.0 / (math.pi * r * r); s['travel'] = s['ml'] * s['mm_per_ml']; s['od'] = s['idmm'] + 2 * s['wall']
    s['stopper'] = max(4.4, min(12.0, s['idmm'] * 0.56)); s['nose'] = s['idmm'] * 0.17
    s['barrel'] = s['travel'] + s['stopper'] + max(5.5, 0.11 * s['travel'])              # inside length from the zero line to the open end
    s['scale_z0'] = -1.2; s['scale_z1'] = s['travel'] + 2.2                               # the printed strip, along the axis from the zero line
    s['label'] = (min(38.0, s['travel'] * 0.74), min(13.0, 0.36 * math.pi * s['od']))    # the drug label: length along the barrel, width round it
    return s

# ------------------------------------------------------------------------------------------------------------ vials (iso8362)
# d1 body, d2 crimp flange, d3 neck (max), d4 bore, h1 height, h2 height of the cylinder to the shoulder (min), h3 neck and flange,
# r1 shoulder radius, r2 heel radius, s1 wall, s2 base (min), brim = brimful capacity in mL.
VIALS = {
    '2ml':   dict(fmt='2R',   ml=2,   d1=16, d2=13, d3=10.5, d4=7.0,  h1=35,  h2=22, h3=8.0,  r1=2.5, r2=1.5, s1=1.0, s2=0.6, brim=4.0),
    '5ml':   dict(fmt='6R',   ml=5,   d1=22, d2=20, d3=16.5, d4=12.6, h1=40,  h2=26, h3=8.5,  r1=3.5, r2=2.0, s1=1.0, s2=0.7, brim=10.0),
    '10ml':  dict(fmt='10R',  ml=10,  d1=24, d2=20, d3=16.5, d4=12.6, h1=45,  h2=30, h3=9.0,  r1=4.0, r2=2.0, s1=1.0, s2=0.7, brim=13.5),
    '20ml':  dict(fmt='20R',  ml=20,  d1=30, d2=20, d3=17.5, d4=12.6, h1=55,  h2=35, h3=10.0, r1=5.5, r2=2.5, s1=1.2, s2=1.0, brim=26.0),
    '50ml':  dict(fmt='50R',  ml=50,  d1=40, d2=20, d3=17.5, d4=12.6, h1=73,  h2=49, h3=10.0, r1=6.0, r2=4.0, s1=1.5, s2=0.9, brim=62.0),
    '100ml': dict(fmt='100R', ml=100, d1=47, d2=20, d3=17.5, d4=12.6, h1=100, h2=75, h3=10.0, r1=6.5, r2=4.0, s1=1.7, s2=0.9, brim=123.0),
}

# ------------------------------------------------------------------------------------------------------------ ECG lead colors (ecg_colors_wikipedia, ecg_colors_ge)
ECG_LEADS = [   # label, where the label means, color name, sRGB
    ('RA', 'right arm', 'white', (0.90, 0.90, 0.88)),
    ('LA', 'left arm', 'black', (0.03, 0.03, 0.035)),
    ('RL', 'right leg', 'green', (0.05, 0.42, 0.16)),
    ('LL', 'left leg', 'red', (0.62, 0.05, 0.05)),
    ('V', 'chest', 'brown', (0.33, 0.17, 0.07)),
]

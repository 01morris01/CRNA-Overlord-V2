# 🎬 Quick Start - Pathophysiology Map Implementation

## ⚡ 5-Minute Setup

Follow these exact steps to get the pathophysiology map working:

### Step 1: Save Image File (1 minute)
```bash
# Create the directory structure
mkdir -p /Users/shawnmorris/Downloads/crna-overlord-main/assets/maps

# Option A: If you have the image file locally
cp ~/Downloads/pathophysiology-world.png /Users/shawnmorris/Downloads/crna-overlord-main/assets/maps/

# Option B: Move the attachment you received
# Navigate to Downloads folder and drag the image to:
# /Users/shawnmorris/Downloads/crna-overlord-main/assets/maps/
# Name it: pathophysiology-world.png

# Verify it's there
ls -lh /Users/shawnmorris/Downloads/crna-overlord-main/assets/maps/pathophysiology-world.png
```

**✅ Expected output:**
```
-rw-r--r-- 1 user staff 95K Apr 3 12:00 pathophysiology-world.png
```

### Step 2: Verify Image Dimensions (1 minute)
```bash
# Check if ImageMagick is installed
identify /Users/shawnmorris/Downloads/crna-overlord-main/assets/maps/pathophysiology-world.png

# Expected output:
# pathophysiology-world.png PNG 1200x350 1200x350+0+0 32-bit RGBA 95KB

# Or use Python to verify
python3 << 'EOF'
from PIL import Image
img = Image.open('/Users/shawnmorris/Downloads/crna-overlord-main/assets/maps/pathophysiology-world.png')
print(f"Dimensions: {img.width}x{img.height}")
print(f"Format: {img.format}")
print(f"Mode: {img.mode}")
EOF
# Expected output:
# Dimensions: 1200x350
# Format: PNG
# Mode: RGBA
```

### Step 3: Start Development Server (1 minute)
```bash
cd /Users/shawnmorris/Downloads/crna-overlord-main
python3 -m http.server 8002

# You should see:
# Serving HTTP on 0.0.0.0 port 8002 (http://0.0.0.0:8002/)
```

### Step 4: Open Browser and Test (2 minutes)
```
1. Open browser: http://localhost:8002
2. Click "SCRUB IN, ROOKIE"
3. Enter name and continue
4. Select "Advanced Physiology & Pathophysiology I"
5. Verify all 17 markers appear on the background image
6. Click markers to test interaction
7. Press F12 to verify console shows: ✅ Leaflet world map initialized
```

---

## ✅ What Should You See?

### On the Map Screen
- **Background**: Neon dark red/orange world with glowing paths
- **Markers**: 17 circles positioned along the path
  - **Orange** (15 markers): Regular topics 1-15
  - **Red, Larger** (1 marker): Synth at position 16
  - **Green, Larger** (1 marker): Mastery at position 17
- **Animation**: All markers have a pulsing glow effect
- **Bottom**: Store button and Back to Courses button (unchanged)

### In Console (F12)
```
✅ Leaflet world map initialized for course: Advanced Physiology & Pathophysiology I
   Image: assets/maps/pathophysiology-world.png
   Bounds: [[0,0],[350,1200]]
   Topics loaded: 17
```

---

## 🔍 Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| Image shows as 404 | Check file path: `ls assets/maps/pathophysiology-world.png` |
| Wrong dimensions | Verify: `identify assets/maps/pathophysiology-world.png` returns `1200x350` |
| Still showing old map | Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows) |
| Markers not visible | Check console (F12) for errors, verify image loaded in Network tab |
| Buttons disappeared | Reload page, verify index.html wasn't corrupted |

---

## 📋 Verification Checklist

Running quickly through this list to confirm everything is working:

```javascript
// In browser console (F12), copy and paste these commands:

// 1. Verify Leaflet
typeof L !== 'undefined' ? '✅ Leaflet loaded' : '❌ Leaflet missing'

// 2. Verify map instance
window.worldMap ? '✅ World map created' : '❌ Map not initialized'

// 3. Count markers
window.worldMap ? window.worldMap.getLayers().length : 'Map not ready'
// Should show 18-20 (1 image + 17 markers + debug elements)

// 4. Check first marker  
window.worldMap && window.worldMap.getLayers()[1] ? '✅ Markers present' : '❌ No markers'

// 5. Verify no errors
'Check console above - should only see ✅ messages'
```

---

## 🎯 Exact Node Positions (for reference)

If markers appear misaligned, these are the exact coordinates used:

```
Cell (1):         x:80,   y:280
Transport (2):    x:160,  y:275
APs (3):          x:240,  y:270
Muscle (4):       x:320,  y:265
Cardiac (5):      x:400,  y:260
ECG (6):          x:480,  y:245
Arrhythmia (7):   x:560,  y:245
Vascular (8):     x:640,  y:260
Flow Ctrl (9):    x:720,  y:270
Kidney BP (10):   x:800,  y:280
Failure (11):     x:880,  y:285
Shock (12):       x:950,  y:280
Body Fluids (13): x:1000, y:200
GFR (14):         x:900,  y:130
Electrolytes(15): x:800,  y:100
Synth (16):       x:1050, y:180 (RED)
Mastery (17):     x:1100, y:240 (GREEN)
```

All positions are in pixel coordinates relative to 1200×350 background image.

---

## Files Modified

✅ **index.html** - Removed test map div and script  
✅ **world-map.js** - Added course-specific image path support  
✅ **legacy/legacy.js** - Updated node coordinates to align with path  
✅ **assets/maps/** - New directory (awaiting image file)

---

## Next Steps

1. ✅ **Code implementation**: COMPLETE
2. ⏳ **Save image file**: `assets/maps/pathophysiology-world.png`
3. ⏳ **Test in browser**: Verify all 17 nodes visible and aligned
4. ⏳ **Deploy**: Once verified working

---

Done! The implementation is ready. Just place the image file and test in the browser. 🚀

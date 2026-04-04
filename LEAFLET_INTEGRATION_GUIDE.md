# Leaflet World Map Integration Guide

## Overview

The CRNA Overlord now uses Leaflet with custom 2D background images to render course maps as interactive overworlds, similar to the HelloMarioEngine style referenced in the design goals.

## Architecture

### Components

1. **world-map.js** - Core Leaflet integration module
   - Initializes Leaflet maps with CRS.Simple (pixel-based coordinates)
   - Renders topic markers as custom div icons
   - Handles marker interactions (tooltips, popups, selection)
   - Applies neon styling for different marker types

2. **legacy.js (showTopicMap function)** - Updated to use new system
   - Calls `initLeafletWorldMap()` instead of SVG rendering
   - Maintains backward compatibility with existing state

3. **maps/{courseId}-background.png** - Custom world backgrounds
   - 1200×350 pixel images
   - SRNA-themed retro/neon aesthetic
   - Positioned under Leaflet markers

4. **leaflet-test.js** - Test map (development only)
   - Can be removed in production
   - Tests Leaflet initialization

## File Structure

```
crna-overlord/
├── index.html                 # Main HTML (includes world-map.js)
├── world-map.js              # ✨ NEW: Leaflet integration module
├── generate-world-maps.js    # Helper: Generate placeholder SVGs
├── maps/
│   ├── README.md             # Instructions for map backgrounds
│   ├── adv-phys-path-1-background.png
│   ├── basics-anesthesia-background.png
│   ├── chem-phys-anesthesia-background.png
│   └── adv-health-assess-background.png
├── legacy/
│   └── legacy.js             # Modified showTopicMap() function
└── ... (other files unchanged)
```

## Setup Steps

### 1. Generate Placeholder SVG Templates

```bash
cd /Users/shawnmorris/Downloads/crna-overlord-main
node generate-world-maps.js
```

Output:
```
✅ Created: maps/adv-phys-path-1-background.svg
✅ Created: maps/basics-anesthesia-background.svg
✅ Created: maps/chem-phys-anesthesia-background.svg
✅ Created: maps/adv-health-assess-background.svg
✅ Created: maps/README.md
```

### 2. Convert SVG to PNG

**Using ImageMagick (recommended):**
```bash
convert maps/adv-phys-path-1-background.svg maps/adv-phys-path-1-background.png
convert maps/basics-anesthesia-background.svg maps/basics-anesthesia-background.png
convert maps/chem-phys-anesthesia-background.svg maps/chem-phys-anesthesia-background.png
convert maps/adv-health-assess-background.svg maps/adv-health-assess-background.png
```

**Using Online Tool:**
1. Go to https://convertio.co/svg-png/
2. Upload each SVG
3. Download PNG
4. Save to `maps/` directory

### 3. Verify Files

```bash
ls -la maps/*.png
# Should show 4 PNG files, each 1200×350 pixels
```

### 4. Test in Browser

1. **Start development server:**
   ```bash
   cd /Users/shawnmorris/Downloads/crna-overlord-main
   python3 -m http.server 8002
   ```

2. **Open browser:** http://localhost:8002

3. **Test workflow:**
   - Click "SCRUB IN, ROOKIE" to start
   - Enter name (or use existing)
   - Select a course
   - **Verify:** Background image loads with markers overlaid

4. **Console check:**
   ```javascript
   // In browser DevTools console
   L  // Should show Leaflet object
   window.worldMap  // Should show Leaflet map instance
   window.testMap   // Should show test map instance
   ```

## How It Works

### Coordinate System

Leaflet with CRS.Simple uses pixel-based coordinates, not latitude/longitude:

```javascript
// WORLD_LAYOUTS coordinates (from legacy.js)
{ order: 1, x: 80, y: 300 }   // Physical pixel position

// Becomes Leaflet marker coordinates
const coords = [300, 80];     // [y, x] format (row, column)

L.marker(coords, { icon: icon }).addTo(map)
```

### Image Overlay

```javascript
const WORLD_MAP_BOUNDS = [[0, 0], [350, 1200]];  // [height, width]

L.imageOverlay(
  'maps/adv-phys-path-1-background.png',
  WORLD_MAP_BOUNDS
).addTo(map);
```

### Marker Types

Each topic marker has a type that determines styling:

| Type | Color | Effect | Use Case |
|------|-------|--------|----------|
| `regular` | Orange neon | Pulsing glow | Standard topics |
| `synthesis` | Red neon | Intense pulse | Multi-topic challenges |
| `mastery` | Green neon | Intense pulse | Expert challenges |

## Key Functions

### `initLeafletWorldMap(courseId, course, layout)`

Main initialization function called by `showTopicMap()`.

**Parameters:**
- `courseId`: String ID from WORLD_LAYOUTS (e.g., 'adv-phys-path-1')
- `course`: Course object with `.title` and `.topics` array
- `layout`: Array of position objects with `.x`, `.y`, `.order`, `.type`

**Behavior:**
1. Creates Leaflet map with CRS.Simple
2. Loads background image overlay from `maps/{courseId}-background.png`
3. Renders topic markers at positions from `layout`
4. Sets up click handlers for topic selection
5. Exposes `window.worldMap` for debugging

### `createTopicMarker(topic, coords, idx)`

Creates individual Leaflet markers for topics.

**Features:**
- Custom div icon based on topic type
- Hover effects (brightness, scale)
- Tooltips on hover
- Popups on click
- Animation (pulsing glow)

### `getMarkerConfig(type)`

Returns styling configuration for marker types.

**Returns:** Object with:
- `color`: Hex/RGBA color code
- `glow`: Glow radius hex
- `label`: Marker type description
- `zIndex`: z-index layer value
- `pinStyle`: CSS inline styles

## Visual Design

### Marker Styling

**Regular Marker:**
```css
60px circle
Orange neon border (transparent fill)
Pulsing glow: 0-25px radii
Labeled with topic number
```

**Synthesis/Mastery:**
```css
70px circle (larger)
Red/green neon border
More intense pulsing
Doubled glow radius
```

### Animation

```css
@keyframes worldMarkerPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.08); }
}

@keyframes worldMarkerIntensePulse {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: [strong glow] }
  50% { opacity: 0.95; transform: scale(1.12); box-shadow: [stronger glow] }
}
```

## Customization

### Adding a Custom Background

1. Create 1200×350 pixel PNG with SRNA theme
2. Follow naming convention: `{courseId}-background.png`
3. Place in `maps/` directory
4. Reload browser (hard refresh: Ctrl+Shift+R)

### Adjusting Marker Positions

Edit `WORLD_LAYOUTS` in [legacy.js](legacy/legacy.js#L1588):

```javascript
const WORLD_LAYOUTS = {
  'adv-phys-path-1': [
    { order: 1, x: 80, y: 300 },    // Adjust x, y here
    { order: 2, x: 160, y: 280 },
    // ...
  ]
}
```

### Changing Marker Styles

Edit marker config in [world-map.js](world-map.js#L175-L250):

```javascript
function getMarkerConfig(type) {
  const configs = {
    'regular': {
      color: 'rgba(255, 120, 0, 1)',  // Adjust colors
      // ... other properties
    }
  }
}
```

## Debugging

### Enable Console Logging

The modules log detailed info:

```javascript
// From world-map.js
console.log(`✅ Leaflet world map initialized for course: ${course.title}`);

// From leaflet-test.js
console.log('%c✅ LEAFLET TEST MAP INITIALIZED', 'color: #00ff88; font-weight: bold');
```

### Check Marker Positions

```javascript
// In browser console
window.worldMap.eachLayer(layer => {
  if (layer.toGeoJSON) {
    console.log(layer.toGeoJSON().geometry.coordinates);
  }
});
```

### Verify Image Loading

```javascript
// Check if background image loaded
const img = new Image();
img.onload = () => console.log('✅ Image loaded');
img.onerror = () => console.log('❌ Image failed to load');
img.src = 'maps/adv-phys-path-1-background.png';
```

## Troubleshooting

### ❌ "404 (File not found)" for PNG

**Causes:**
- File doesn't exist in `maps/` directory
- Wrong filename (check courseId)
- Wrong path in world-map.js

**Fix:**
1. Verify files exist: `ls -la maps/*.png`
2. Check DevTools Network tab for exact filename requested
3. Ensure filename matches courseId exactly

### ❌ Markers not visible

**Causes:**
- Image not loading (z-index issue)
- Marker coordinates out of bounds
- CSS display properties wrong

**Fix:**
1. Check console for errors
2. Verify image dimensions (1200×350)
3. Test marker positions: `window.worldMap.getBounds()`
4. Check z-index values in marker config

### ❌ Map won't initialize

**Causes:**
- Leaflet not loaded
- world-map.js not included in HTML
- Container element missing

**Fix:**
1. Verify `<script src="leaflet-test.js"></script>` in HTML
2. Verify `<div id="world-map"></div>` exists in HTML
3. Check browser console for loading errors

## Production Deployment

### Before Deploying:

1. ✅ Remove `leaflet-test.js` reference from HTML (or comment out)
2. ✅ Verify all 4 course PNG backgrounds are present
3. ✅ Test on multiple browsers (Chrome, Firefox, Safari)
4. ✅ Test on mobile devices for responsiveness
5. ✅ Check file sizes (PNG files < 100KB each)

### Optimization:

- Compress PNG files (TinyPNG, PNGQuant)
- Consider WebP format for smaller file sizes
- Lazy-load images if needed on slow connections

## Future Enhancements

Potential improvements for future iterations:

- **Animated backgrounds**: Moving clouds, particles, or effects
- **Dynamic weather**: Time-of-day lighting changes
- **Pathfinding visualization**: Show connected topic journey
- **Zoom levels**: Smooth zoom transitions between regions
- **Mini-map**: Overview of full course layout
- **Accessibility**: High-contrast mode, enlarged text
- **Multiple themes**: Day/night, difficulty-specific coloring

## Reference Documentation

- **Leaflet API**: https://leafletjs.com/reference-1.9.4.html
- **CRS.Simple**: https://leafletjs.com/examples/crs-simple/
- **DivIcon**: https://leafletjs.com/reference-1.9.4.html#divicon
- **ImageOverlay**: https://leafletjs.com/reference-1.9.4.html#imageoverlay

## Support

For issues or questions:

1. Check browser DevTools Console for errors
2. Review this guide's troubleshooting section
3. Examine `world-map.js` and `legacy.js` for implementation details
4. Test with `leaflet-test.js` to verify Leaflet itself is working

---

**Last Updated**: April 3, 2026  
**Status**: Beta (Placeholder backgrounds, ready for custom artwork)

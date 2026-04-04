# SRNA World Map Backgrounds

This directory contains placeholder and custom background images for the Leaflet-based interactive course maps.

## Quick Start

1. **Generate SVG placeholders** (optional):
   ```bash
   node generate-world-maps.js
   ```
   This creates SVG guide templates in `maps/` directory.

2. **Convert SVG to PNG** (required for use with Leaflet):
   - **Option A**: Using ImageMagick:
     ```bash
     convert maps/*.svg maps/*.png
     ```
   - **Option B**: Online converter (https://convertio.co/svg-png/)
   - **Option C**: Using browser (open SVG, save as PNG)

3. **Place PNG files** in this directory with naming: `{courseId}-background.png`

## File Naming Convention

Background images **MUST** follow this exact naming pattern:
```
{courseId}-background.png
```

### Valid Examples
- `adv-phys-path-1-background.png`
- `basics-anesthesia-background.png`
- `chem-phys-anesthesia-background.png`
- `adv-health-assess-background.png`

The courseId values come from WORLD_LAYOUTS in `legacy/legacy.js`.

## Image Specifications

| Property | Value |
|----------|-------|
| **Dimensions** | 1200 × 350 pixels |
| **Format** | PNG (32-bit RGBA recommended) |
| **Color Mode** | RGB or RGBA |
| **Background** | Dark (retro arcade theme) |
| **Style** | Neon glows, cyberpunk aesthetic |

## Placeholder Structure

The generated SVG placeholders include these themed zones:
- **Cell Zone** (x: 10-190, y: 260-340): Cellular physiology region
- **Transport Zone** (x: 190-350, y: 240-340): Ion/substance transport
- **Action Potentials** (x: 350-490, y: 220-340): Electrical activity
- **Cardiac Zone** (x: 480-660, y: 200-340): Heart physiology  
- **Vascular Zone** (x: 650-820, y: 150-340): Blood vessel systems
- **Renal Zone** (x: 800-960, y: 180-340): Kidney/filtration
- **Synthesis Tower** (x: 980-1070, y: 100-250): Cross-topic synthesis landmark
- **Mastery Fortress** (x: 1100-1160, y: 50-250): Expert mastery landmark

## Coordinate System

Topic markers are positioned using WORLD_LAYOUTS coordinates:

```javascript
// Example from legacy.js
{ order: 1, x: 80, y: 300 }    // Position in pixels
{ order: 2, x: 160, y: 280 }
```

These are converted to Leaflet coordinates as `[y, x]` (row, column).

## Creating Custom Backgrounds

1. Start with the placeholder SVG as a template
2. Design your SRNA-themed world:
   - Use dark backgrounds (blacks, deep blues, purples)
   - Add neon highlights (orange, red, green, cyan)
   - Create visual zones for different systems
   - Add atmospheric effects (gradients, glows, glitter)
3. Maintain the exact 1200×350 pixel dimensions
4. Export as PNG with transparency
5. Save with correct naming convention

## Testing

After adding PNG files:

1. **Hard refresh** the browser (Ctrl+Shift+R or Cmd+Shift+R)
2. **Select a course** from course selector
3. **Verify**:
   - Background image loads (no 404 in console)
   - Markers overlay correctly on background
   - All 17 markers (or course-specific count) are visible
   - Tooltips appear on marker hover
   - Clicking markers selects them

## Troubleshooting

### Background not showing
- ✅ Check DevTools console for 404 errors
- ✅ Verify PNG filename matches courseId exactly
- ✅ Hard refresh browser cache

### Markers offset or overlapping incorrectly
- ✅ Check image dimensions (must be 1200×350)
- ✅ Verify marker coordinates in WORLD_LAYOUTS
- ✅ Check browser console for JavaScript errors

### Image file too large
- ✅ Compress PNG (try TinyPNG, PNGQuant)
- ✅ Reduce colors if possible
- ✅ Aim for < 100KB per image

## Reference

- **Leaflet imageOverlay docs**: https://leafletjs.com/reference-1.9.4.html#imageoverlay
- **CRS.Simple coordinate system**: https://leafletjs.com/reference-1.9.4.html#crs-simple
- **Marker customization**: https://leafletjs.com/reference-1.9.4.html#marker

## Next Steps

After placeholder images are created and converted to PNG:

1. Creative team creates illustrated SRNA-themed world art
2. Replace placeholder images with final artwork
3. Run full integration testing
4. Deploy to production

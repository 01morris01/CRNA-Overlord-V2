#!/usr/bin/env node
/**
 * Generate placeholder SRNA-themed world map backgrounds
 * Run: node generate-world-maps.js
 * 
 * Creates PNG maps for each course in maps/ directory
 */

const fs = require('fs');
const path = require('path');

// Check if we have canvas available
let canvasAvailable = false;
try {
  require.resolve('canvas');
  canvasAvailable = true;
} catch (e) {
  console.warn('⚠️  canvas module not found - will create SVG guides instead');
}

const mapsDir = path.join(__dirname, 'maps');

// Ensure maps directory exists
if (!fs.existsSync(mapsDir)) {
  fs.mkdirSync(mapsDir, { recursive: true });
}

// SVG Template for world maps (1200x350 px)
function generateMapSVG(courseName, regions) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="350" viewBox="0 0 1200 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <radialGradient id="darkGrad" cx="50%" cy="50%" r="80%">
      <stop offset="0%" style="stop-color:#0a0a20;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#000005;stop-opacity:1" />
    </radialGradient>
    <linearGradient id="horizGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a1a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Base background -->
  <rect width="1200" height="350" fill="url(#darkGrad)" />
  <rect width="1200" height="350" fill="url(#horizGrad)" opacity="0.5" />
  
  <!-- Subtle grid utility lines -->
  <g stroke="rgba(100,150,200,0.08)" stroke-width="1" stroke-dasharray="5,5">
    <line x1="100" y1="0" x2="100" y2="350" />
    <line x1="300" y1="0" x2="300" y2="350" />
    <line x1="500" y1="0" x2="500" y2="350" />
    <line x1="700" y1="0" x2="700" y2="350" />
    <line x1="900" y1="0" x2="900" y2="350" />
    <line x1="1100" y1="0" x2="1100" y2="350" />
  </g>
  
  <!-- Regional zones with neon accents -->
  <!-- Cell/Membrane zone (left) -->
  <rect x="10" y="260" width="180" height="80" fill="rgba(100, 100, 150, 0.1)" stroke="rgba(100, 150, 255, 0.3)" stroke-width="2" rx="8" />
  <text x="100" y="310" font-family="Courier New" font-size="12" fill="rgba(100, 150, 255, 0.5)" text-anchor="middle" font-weight="bold">CELL ZONE</text>
  
  <!-- Transport zone -->
  <rect x="190" y="240" width="160" height="100" fill="rgba(150, 100, 100, 0.1)" stroke="rgba(255, 150, 100, 0.3)" stroke-width="2" rx="8" />
  <text x="270" y="300" font-family="Courier New" font-size="12" fill="rgba(255, 150, 100, 0.5)" text-anchor="middle" font-weight="bold">TRANSPORT</text>
  
  <!-- Action Potentials zone -->
  <rect x="350" y="220" width="140" height="120" fill="rgba(100, 150, 100, 0.1)" stroke="rgba(150, 255, 100, 0.3)" stroke-width="2" rx="8" />
  <text x="420" y="285" font-family="Courier New" font-size="11" fill="rgba(150, 255, 100, 0.5)" text-anchor="middle" font-weight="bold">ACTION P.</text>
  
  <!-- Muscle/Cardiac zone -->
  <rect x="480" y="200" width="180" height="140" fill="rgba(150, 100, 150, 0.1)" stroke="rgba(255, 100, 200, 0.3)" stroke-width="2" rx="8" />
  <text x="570" y="280" font-family="Courier New" font-size="12" fill="rgba(255, 100, 200, 0.5)" text-anchor="middle" font-weight="bold">CARDIAC</text>
  
  <!-- Vascular/Flow zone -->
  <rect x="650" y="150" width="170" height="190" fill="rgba(100, 150, 150, 0.1)" stroke="rgba(100, 200, 255, 0.3)" stroke-width="2" rx="8" />
  <text x="735" y="250" font-family="Courier New" font-size="12" fill="rgba(100, 200, 255, 0.5)" text-anchor="middle" font-weight="bold">VASCULAR</text>
  
  <!-- Renal/Filtration zone -->
  <rect x="800" y="180" width="160" height="160" fill="rgba(100, 200, 150, 0.1)" stroke="rgba(100, 255, 150, 0.3)" stroke-width="2" rx="8" />
  <text x="880" y="265" font-family="Courier New" font-size="12" fill="rgba(100, 255, 150, 0.5)" text-anchor="middle" font-weight="bold">RENAL</text>
  
  <!-- Synthesis Tower (right-center) -->
  <g>
    <rect x="980" y="100" width="90" height="150" fill="rgba(200, 50, 50, 0.15)" stroke="rgba(255, 80, 80, 0.5)" stroke-width="3" />
    <polygon points="1025,80 1035,100 1015,100" fill="rgba(255, 80, 80, 0.4)" />
    <text x="1025" y="185" font-family="Courier New" font-size="11" fill="rgba(255, 100, 100, 0.6)" text-anchor="middle" font-weight="bold">SYNTHESIS</text>
  </g>
  
  <!-- Mastery Fortress (right-bottom) -->
  <g>
    <polygon points="1100,50 1160,50 1160,250 1100,250" fill="rgba(100, 200, 100, 0.12)" stroke="rgba(150, 255, 100, 0.5)" stroke-width="3" />
    <circle cx="1100" cy="75" r="8" fill="rgba(150, 255, 100, 0.4)" />
    <circle cx="1140" cy="65" r="8" fill="rgba(150, 255, 100, 0.4)" />
    <text x="1130" y="200" font-family="Courier New" font-size="11" fill="rgba(150, 200, 100, 0.6)" text-anchor="middle" font-weight="bold">MASTERY</text>
  </g>
  
  <!-- Connecting pathways (dashed lines) -->
  <g stroke="rgba(200, 150, 0, 0.2)" stroke-width="1" stroke-dasharray="3,3" fill="none">
    <path d="M 190 300 Q 270 270 350 270" />
    <path d="M 490 250 Q 550 230 650 200" />
    <path d="M 820 250 Q 900 220 980 150" />
  </g>
  
  <!-- Title overlay -->
  <text x="600" y="30" font-family="Courier New" font-size="18" fill="rgba(255, 150, 0, 0.3)" text-anchor="middle" font-weight="bold" text-anchor="middle">${courseName}</text>
  
  <!-- Neon glow accents -->
  <circle cx="100" cy="150" r="80" fill="rgba(255, 100, 0, 0.02)" />
  <circle cx="1050" cy="180" r="120" fill="rgba(100, 200, 255, 0.02)" />
</svg>`;
}

// Generate SVG placeholders for each course
const courses = [
  {
    id: 'adv-phys-path-1',
    name: 'Advanced Physiology & Pathophysiology I',
    description: 'Cardiac, Vascular, and Renal systems journey'
  },
  {
    id: 'basics-anesthesia',
    name: 'Basics of Anesthesia',
    description: 'Fundamental anesthesia principles'
  },
  {
    id: 'chem-phys-anesthesia',
    name: 'Chemistry & Physics of Anesthesia',
    description: 'Drug properties and physics'
  },
  {
    id: 'adv-health-assess',
    name: 'Advanced Health Assessment',
    description: 'Patient evaluation and diagnosis'
  }
];

courses.forEach(course => {
  const svgContent = generateMapSVG(course.name, []);
  const fileName = `${course.id}-background.svg`;
  const filePath = path.join(mapsDir, fileName);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created: ${filePath}`);
});

// Create README with conversion instructions
const readmeContent = `# World Map Backgrounds

This directory contains SRNA-themed world map backgrounds for interactive course maps.

## Current Status

Placeholder SVG maps have been generated for all courses:
- adv-phys-path-1-background.svg
- basics-anesthesia-background.svg  
- chem-phys-anesthesia-background.svg
- adv-health-assess-background.svg

## Converting SVG to PNG

To use with Leaflet's L.imageOverlay, SVG files need to be converted to PNG format.

### Option 1: Using ImageMagick (command line)
\`\`\`bash
convert maps/adv-phys-path-1-background.svg maps/adv-phys-path-1-background.png
convert maps/basics-anesthesia-background.svg maps/basics-anesthesia-background.png
convert maps/chem-phys-anesthesia-background.svg maps/chem-phys-anesthesia-background.png
convert maps/adv-health-assess-background.svg maps/adv-health-assess-background.svg
\`\`\

### Option 2: Using your browser (manual)
1. Open each SVG in your browser
2. Right-click → Save as → PNG format
3. Save to maps/ directory

### Option 3: Using Node.js + canvas
\`\`\`bash
npm install canvas
node generate-png.js  # (requires additional setup)
\`\`\

## File Naming Convention

Background images MUST be named: \`{courseId}-background.png\`

The world-map.js module expects this exact naming pattern:
\`\`\`javascript
const bgImagePath = \`maps/\${courseId}-background.png\`;
\`\`\

## Placeholder Image Specs

- **Dimensions**: 1200×350 pixels
- **Format**: PNG (32-bit with transparency recommended)
- **Color scheme**: Dark background with neon accents (orange, red, green, blue)
- **Regions**: 6 themed zones representing different physiological systems
- **Style**: Retro arcade / dark cyberpunk aesthetic

## Custom Backgrounds

To create custom illustrated backgrounds:

1. Start with the placeholder as a template
2. Paint over the SVG or create new artwork
3. Ensure regions are visually distinct
4. Use neon/glow effects for SRNA theme
5. Keep the exact 1200×350 dimensions
6. Save as PNG

## Testing

After adding/updating PNG files, test in browser:

1. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Select a course
3. Verify background image loads
4. Check that markers overlay correctly
5. Open DevTools console for any 404 errors

## Coordinate System

- **X axis**: 0-1200 pixels (corresponds to courseId column in WORLD_LAYOUTS)
- **Y axis**: 0-350 pixels (corresponds to courseId row in WORLD_LAYOUTS)
- **Marker placement**: Uses [y, x] format for Leaflet (row, column)

Example from WORLD_LAYOUTS:
\`\`\`javascript
{ order: 1, x: 80, y: 300 }   // Leaflet coords: [300, 80]
{ order: 2, x: 160, y: 280 }  // Leaflet coords: [280, 160]
\`\`\
`;

fs.writeFileSync(path.join(mapsDir, 'README.md'), readmeContent);
console.log(`✅ Created: maps/README.md`);
console.log('\n📌 NEXT STEPS:');
console.log('1. Convert SVG files to PNG using ImageMagick, browser, or canvas');
console.log('2. Place PNG files in maps/ directory');
console.log('3. Reload the app and select a course');

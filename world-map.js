/**
 * LEAFLET WORLD MAP INTEGRATION
 * Renders CRNA course maps as interactive 2D overworlds using Leaflet with custom background
 */

let leafletWorldMap = null;   // Global reference to current Leaflet map
let leafletWorldBounds = null; // Bounds of the current map (for re-fitting)

// Course-specific map bounds (height x width in pixels)
const COURSE_MAP_BOUNDS = {
  'adv-phys-path-1': [[0, 0], [350, 1200]],  // Pathophysiology world: 1200x350
  'default': [[0, 0], [350, 1200]]
};

// Course-specific background image paths
const COURSE_IMAGE_PATHS = {
  'adv-phys-path-1': 'assets/maps/pathophysiology-world.png',
  'default_prefix': 'maps'
};

/**
 * Initialize Leaflet world map for a course
 * @param {string} courseId - Course ID from WORLD_LAYOUTS
 * @param {Object} course - Course data with title and topics
 * @param {Array} layout - World layout positions from WORLD_LAYOUTS
 */
function initLeafletWorldMap(courseId, course, layout) {
  const mapContainer = document.getElementById('world-map');
  if (!mapContainer) {
    console.warn('❌ world-map container not found');
    return;
  }

  if (typeof L === 'undefined') {
    console.warn('❌ Leaflet not loaded');
    return;
  }

  // Destroy existing map if present
  if (leafletWorldMap) {
    leafletWorldMap.remove();
    leafletWorldMap = null;
  }

  // Clear container
  mapContainer.innerHTML = '';

  // Get course-specific bounds
  const bounds = COURSE_MAP_BOUNDS[courseId] || COURSE_MAP_BOUNDS['default'];
  leafletWorldBounds = bounds;

  // Create map with SimpleCoordinateReference (pixel-based, not geographic)
  leafletWorldMap = L.map(mapContainer, {
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 2,
    zoomControl: true,
    attributionControl: false,
    zoom: -1
  });

  // Determine background image path based on course
  let bgImagePath;
  if (courseId === 'adv-phys-path-1') {
    bgImagePath = COURSE_IMAGE_PATHS['adv-phys-path-1'];  // Custom pathophysiology image
  } else {
    bgImagePath = `maps/${courseId}-background.png`;  // Default path for other courses
  }
  const imageOverlay = L.imageOverlay(bgImagePath, bounds, {
    opacity: 1,
    interactive: false
  }).addTo(leafletWorldMap);

  // Fit to bounds
  leafletWorldMap.fitBounds(bounds);

  // Add reference rectangle (optional debug)
  const debugRect = L.rectangle(bounds, {
    color: 'rgba(100, 150, 200, 0.15)',
    weight: 1,
    fillColor: 'none',
    fillOpacity: 0,
    interactive: false,
    z_index: 1
  }).addTo(leafletWorldMap);

  // Add topic markers
  course.topics.forEach((topic, idx) => {
    const pos = layout[idx] || { x: 100, y: 100 };
    // Convert x,y to [y,x] for Leaflet (row, col)
    const coords = [pos.y, pos.x];

    // Create marker with custom icon based on topic type
    const marker = createTopicMarker(topic, coords, idx);
    marker.addTo(leafletWorldMap);
  });

  // Invalidate size after layout has had time to settle.
  // Multiple calls handle delayed flex/reflow calculations.
  const _doInvalidate = () => {
    if (!leafletWorldMap) return;
    leafletWorldMap.invalidateSize();
    leafletWorldMap.fitBounds(bounds);
  };
  setTimeout(_doInvalidate, 100);
  setTimeout(_doInvalidate, 350);
  setTimeout(() => {
    _doInvalidate();
    console.log(`✅ Leaflet world map initialized for course: ${course.title}`);
    console.log(`   Image: ${bgImagePath}`);
    console.log(`   Bounds: ${JSON.stringify(bounds)}`);
    console.log(`   Topics loaded: ${course.topics.length}`);
  }, 650);

  // Expose for debugging
  window.worldMap = leafletWorldMap;
}

/**
 * Create a custom marker for a topic node
 * @param {Object} topic - Topic data
 * @param {Array} coords - [lat, lng] in Leaflet terms (actually [y, x] in pixels)
 * @param {number} idx - Topic index
 * @returns {L.Marker}
 */
function createTopicMarker(topic, coords, idx) {
  // Determine marker style based on topic type
  let markerConfig = getMarkerConfig(topic.type);

  // Create custom div icon
  const icon = L.divIcon({
    className: 'world-map-marker',
    html: `
      <div class="world-marker-pin" style="${markerConfig.pinStyle}">
        <div class="world-marker-label">${topic.order}</div>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -30],
    tooltipAnchor: [0, -40]
  });

  // Create marker
  const marker = L.marker(coords, { icon: icon, zIndexOffset: markerConfig.zIndex });

  // Add tooltip (permanent, visible on hover for non-hover states)
  const tooltipText = `${topic.order}. ${topic.title}${topic.chapters ? ` (Ch. ${topic.chapters})` : ''}`;
  marker.bindTooltip(tooltipText, {
    permanent: false,
    direction: 'top',
    offset: [0, -15],
    className: 'world-map-tooltip'
  });

  // Add popup (click to view)
  const popupHtml = `
    <div style="background:rgba(5,10,30,.95);color:#ffaa00;font-family:monospace;padding:8px;border:1px solid rgba(255,150,0,.5);border-radius:4px;font-size:0.8rem;">
      <strong>${topic.order}. ${topic.title}</strong><br>
      ${topic.chapters ? `Ch. ${topic.chapters}<br>` : ''}
      ${markerConfig.label}
    </div>
  `;
  marker.bindPopup(popupHtml);

  // Add click handler for topic selection
  marker.on('click', () => {
    selectTopic(topic.id);
  });

  return marker;
}

/**
 * Get marker styling configuration based on topic type
 * @param {string} type - Topic type: 'regular', 'synthesis', 'mastery'
 * @returns {Object} Configuration with pinStyle, color, zIndex, label
 */
function getMarkerConfig(type) {
  const configs = {
    'regular': {
      color: 'rgba(255, 120, 0, 1)',
      glow: 'rgba(255, 120, 0, 0.6)',
      label: 'Standard Topic',
      zIndex: 10,
      pinStyle: `
        width: 60px;
        height: 60px;
        background: radial-gradient(circle at 35% 35%, rgba(255, 120, 0, 0.8), rgba(150, 60, 20, 0.3));
        border: 2px solid rgba(255, 120, 0, 0.9);
        border-radius: 50%;
        box-shadow: 0 0 25px rgba(255, 120, 0, 0.6), inset 0 0 15px rgba(255, 120, 0, 0.3), 0 0 45px rgba(255, 100, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: white;
        font-size: 22px;
        text-shadow: 0 0 12px rgba(0, 0, 0, 0.9);
        font-family: 'Courier New', monospace;
        animation: worldMarkerPulse 2s ease-in-out infinite;
      `
    },
    'synthesis': {
      color: 'rgba(255, 80, 80, 1)',
      glow: 'rgba(255, 80, 80, 0.6)',
      label: 'Synthesis Tower',
      zIndex: 20,
      pinStyle: `
        width: 70px;
        height: 70px;
        background: radial-gradient(circle at 35% 35%, rgba(255, 80, 80, 0.9), rgba(150, 40, 40, 0.4));
        border: 3px solid rgba(255, 80, 80, 1);
        border-radius: 50%;
        box-shadow: 0 0 35px rgba(255, 80, 80, 0.8), inset 0 0 20px rgba(255, 80, 80, 0.4), 0 0 60px rgba(255, 60, 60, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: #ffeeee;
        font-size: 24px;
        text-shadow: 0 0 12px rgba(0, 0, 0, 0.9);
        font-family: 'Courier New', monospace;
        animation: worldMarkerIntensePulse 1.5s ease-in-out infinite;
      `
    },
    'mastery': {
      color: 'rgba(100, 255, 150, 1)',
      glow: 'rgba(100, 255, 150, 0.6)',
      label: 'Mastery Fortress',
      zIndex: 20,
      pinStyle: `
        width: 70px;
        height: 70px;
        background: radial-gradient(circle at 35% 35%, rgba(100, 255, 150, 0.9), rgba(50, 150, 100, 0.4));
        border: 3px solid rgba(100, 255, 150, 1);
        border-radius: 50%;
        box-shadow: 0 0 35px rgba(100, 255, 150, 0.8), inset 0 0 20px rgba(100, 255, 150, 0.4), 0 0 60px rgba(80, 255, 130, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: white;
        font-size: 24px;
        text-shadow: 0 0 12px rgba(0, 0, 0, 0.9);
        font-family: 'Courier New', monospace;
        animation: worldMarkerIntensePulse 1.5s ease-in-out infinite;
      `
    }
  };

  return configs[type] || configs['regular'];
}

/**
 * Add CSS animations for markers
 */
function ensureWorldMapStyles() {
  const styleId = 'world-map-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .world-map-marker {
      filter: drop-shadow(0 0 8px rgba(255, 100, 0, 0.4));
    }

    .world-marker-pin {
      transition: all 0.2s ease;
    }

    .world-map-marker:hover .world-marker-pin {
      filter: brightness(1.2);
      transform: scale(1.1);
    }

    .world-marker-label {
      font-weight: 900;
    }

    @keyframes worldMarkerPulse {
      0%, 100% { 
        opacity: 1;
        transform: scale(1);
      }
      50% { 
        opacity: 0.9;
        transform: scale(1.08);
      }
    }

    @keyframes worldMarkerIntensePulse {
      0%, 100% { 
        opacity: 1;
        transform: scale(1);
        box-shadow: 0 0 35px rgba(255, 80, 80, 0.8), inset 0 0 20px rgba(255, 80, 80, 0.4), 0 0 60px rgba(255, 60, 60, 0.5);
      }
      50% { 
        opacity: 0.95;
        transform: scale(1.12);
        box-shadow: 0 0 50px rgba(255, 80, 80, 1), inset 0 0 25px rgba(255, 80, 80, 0.6), 0 0 80px rgba(255, 60, 60, 0.7);
      }
    }

    .world-map-tooltip {
      background: rgba(5, 10, 30, 0.95) !important;
      border: 1px solid rgba(255, 150, 0, 0.5) !important;
      border-radius: 4px !important;
      color: #ffaa00 !important;
      font-family: 'Courier New', monospace !important;
      font-size: 0.75rem !important;
      padding: 6px 10px !important;
      box-shadow: 0 0 12px rgba(255, 150, 0, 0.3) !important;
      text-shadow: 0 0 4px rgba(0, 0, 0, 0.8) !important;
      white-space: nowrap;
    }

    #world-map {
      width: 100%;
      height: 100%;
      min-height: 500px;
      background: rgba(5, 10, 30, 0.8) !important;
      border: 1px solid rgba(100, 150, 200, 0.3) !important;
      border-radius: 4px !important;
      position: relative;
      z-index: 1;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
}

// Ensure styles are loaded when script loads
ensureWorldMapStyles();

/** Force the active Leaflet map to recalculate its size and re-fit bounds. */
function invalidateWorldMap() {
  if (!leafletWorldMap) return;
  leafletWorldMap.invalidateSize();
  if (leafletWorldBounds) leafletWorldMap.fitBounds(leafletWorldBounds);
}

console.log('✅ world-map.js loaded - Leaflet integration ready');
window.initLeafletWorldMap = initLeafletWorldMap;
window.invalidateWorldMap  = invalidateWorldMap;

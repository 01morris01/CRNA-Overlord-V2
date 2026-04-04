// Leaflet Test Map Initialization - Fixed
// Wait for page load to ensure DOM and Leaflet are ready

window.addEventListener('load', () => {
  const mapEl = document.getElementById('leaflet-test-map');
  if (!mapEl) {
    console.warn('❌ leaflet-test-map container not found');
    return;
  }

  if (typeof L === 'undefined') {
    console.warn('❌ Leaflet library not loaded');
    return;
  }

  // Initialize map with simple CRS (pixel coordinates)
  const map = L.map('leaflet-test-map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
    zoomControl: true
  });

  // Set bounds and add boundary rectangle
  const bounds = [[0, 0], [1000, 1000]];
  L.rectangle(bounds, { 
    color: 'rgba(100, 150, 200, 0.5)', 
    weight: 1,
    fillColor: 'rgba(10, 20, 50, 0.1)',
    fillOpacity: 0.2
  }).addTo(map);

  // Fit map to bounds
  map.fitBounds(bounds);

  // Create custom div icon marker
  const createMarkerIcon = (num) => {
    const colors = [
      'rgba(255, 100, 0, 1)',  // Orange
      'rgba(255, 50, 50, 1)',  // Red
      'rgba(100, 255, 150, 1)' // Green
    ];
    const color = colors[num] || colors[0];

    return L.divIcon({
      html: `
        <div style="
          width: 50px;
          height: 50px;
          background: radial-gradient(circle at 35% 35%, ${color}, rgba(100, 50, 20, 0.3));
          border: 3px solid ${color};
          border-radius: 50%;
          box-shadow: 0 0 30px ${color}, inset 0 0 20px ${color}60, 0 0 50px ${color}80;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: white;
          font-size: 20px;
          text-shadow: 0 0 12px rgba(0, 0, 0, 0.9);
          font-family: 'Courier New', monospace;
        ">${num + 1}</div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25],
      className: 'custom-test-marker'
    });
  };

  // Define markers with clear positions
  const markers = [
    { coords: [200, 200], label: '1. Cell' },
    { coords: [450, 500], label: '2. Transport' },
    { coords: [700, 800], label: '3. APs' }
  ];

  // Add markers to map with custom icons
  markers.forEach(({ coords, label }, idx) => {
    L.marker(coords, { icon: createMarkerIcon(idx) })
      .addTo(map)
      .bindTooltip(label, { 
        permanent: true, 
        direction: 'bottom',
        offset: [0, 30],
        className: 'leaflet-test-tooltip'
      });
    console.log('✅ Added marker:', label, 'at', coords, '- icon:', idx + 1);
  });

  // Force map to recalculate size after render
  setTimeout(() => {
    map.invalidateSize();
    console.log('%c✅ LEAFLET TEST MAP INITIALIZED', 'color: #00ff88; font-weight: bold');
    console.log('%cBounds:', 'color: #ffaa00', bounds);
    console.log('%cMarkers:', 'color: #ffaa00', markers.length, 'visible');
    console.log('%cMap viewport:', 'color: #ffaa00', map.getBounds());
    console.log('%cAccess map:', 'color: #ffaa00', 'window.testMap');
  }, 100);

  // Expose for inspection
  window.testMap = map;
});


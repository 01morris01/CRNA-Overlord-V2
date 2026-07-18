const CACHE_VERSION = 'v53-rubric-debrief-2026-07-17';
const CACHE_NAME = `overlord-${CACHE_VERSION}`;

const APP_SHELL = [
  '/', '/index.html', '/app.js', '/legacyShim.js', '/legacy/legacy.js',
  '/world-map.js', '/hospital-map.js?v=48', '/course-map-3d.js', '/vendor/GLTFLoader.r128.js',
  '/core/state.js', '/core/auth.js', '/core/gameEngine.js',
  '/core/questionEngine.js', '/core/answerGrading.js', '/core/nodeConfig.js',
  '/core/voss.js', '/core/dailyMission.js', '/core/recallGrader.js',
  '/ui/gameUI.js', '/ui/menus.js',
  '/ui/reviewMode.js', '/ui/sceneRegistry.js', '/assets/css/tokens.css',
  '/live-sim-display.html', '/assets/css/live-sim.css', '/assets/css/live-sim-display.css',
  '/ui/liveSimView.js', '/ui/liveSimDisplay.js', '/ui/liveWaveformRenderer.js',
  '/ui/liveSimModel.js', '/ui/liveSimTransport.js',
  '/crisis-sim/ui/simRunner.js',
  '/crisis-sim/sim/index.js', '/crisis-sim/sim/float32.js', '/crisis-sim/sim/simRandom.js',
  '/crisis-sim/sim/patientPhysiology.js', '/crisis-sim/sim/drugSystem.js',
  '/crisis-sim/sim/lidocaineSystem.js',
  '/crisis-sim/sim/neuromuscularModel.js',
  '/crisis-sim/sim/airwayProcedureSystem.js',
  '/crisis-sim/sim/ventilatorSystem.js', '/crisis-sim/sim/simulationCore.js',
  '/crisis-sim/sim/scenario/scenarioManager.js', '/crisis-sim/sim/scenario/scenarioLoader.js',
  '/crisis-sim/sim/scenario/scenarioState.js', '/crisis-sim/sim/scenario/scenarioScoring.js',
  '/crisis-sim/sim/scenario/scenarioDebrief.js',
  '/crisis-sim/sim/scenario/rubricLoader.js',
  '/crisis-sim/sim/scenario/rubricScoringSession.js',
  '/crisis-sim/sim/scenario/rubricRules.js',
  '/crisis-sim/sim/scenario/rubricDebrief.js',
  '/crisis-sim/sim/scenario/actionLogger.js',
  '/crisis-sim/sim/scenario/actionCatalog.js',
  '/data/rubrics/carson-newman-standard-iv-induction.json',
  '/data/rubrics/carson-newman-rsi-induction.json',
  '/data/rubrics/carson-newman-anesthesia-emergence.json',
  '/crisis-sim/sim/scenarios/standard_iv_healthy_001.json',
  '/crisis-sim/sim/scenarios/rsi_full_stomach_001.json',
  '/crisis-sim/sim/scenarios/emergence_residual_block_001.json',
  '/crisis-sim/sim/scenarios/rsi_failed_first_attempt_001.json',
  '/data/recall-questions.js',
  '/data/recall-questions-atoms.js',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/data/questions/')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const networkPromise = fetch(event.request).then((response) => {
          if (response.ok && url.origin === self.location.origin) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => cached);
        return cached || networkPromise;
      })
    )
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

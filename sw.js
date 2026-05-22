const CACHE_VERSION = 'v9-fr-ux-2026-05-22';
const CACHE_NAME = `overlord-${CACHE_VERSION}`;

const APP_SHELL = [
  '/', '/index.html', '/app.js', '/legacyShim.js', '/legacy/legacy.js',
  '/world-map.js', '/core/state.js', '/core/auth.js', '/core/gameEngine.js',
  '/core/questionEngine.js', '/core/answerGrading.js', '/core/nodeConfig.js',
  '/core/voss.js', '/core/dailyMission.js', '/core/recallGrader.js',
  '/ui/gameUI.js', '/ui/menus.js',
  '/ui/reviewMode.js', '/ui/sceneRegistry.js', '/assets/css/tokens.css',
  '/data/recall-questions.js',
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

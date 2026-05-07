const CACHE_NAME = 'overlord-v5';
const APP_SHELL = [
  '/',
  '/index.html',
  '/app.js',
  '/legacyShim.js',
  '/core/state.js',
  '/core/auth.js',
  '/core/gameEngine.js',
  '/core/questionEngine.js',
  '/core/answerGrading.js',
  '/core/nodeConfig.js',
  '/core/voss.js',
  '/core/dailyMission.js',
  '/ui/gameUI.js',
  '/ui/menus.js',
  '/ui/reviewMode.js',
  '/ui/sceneRegistry.js',
  '/assets/css/tokens.css',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Do not cache question bank files (data/questions/*); always fetch fresh
  if (url.pathname.startsWith('/data/questions/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

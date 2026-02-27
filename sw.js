const CACHE = 'mustang-pm-v3';
const ASSETS = [
  '/PM-Tracker/',
  '/PM-Tracker/index.html',
  '/PM-Tracker/manifest.json',
  '/PM-Tracker/icon-192.png',
  '/PM-Tracker/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/PM-Tracker/index.html')))
  );
});

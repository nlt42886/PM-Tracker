const CACHE = 'mustang-pm-v7';
const ASSETS = ['/PM-Tracker/','/PM-Tracker/index.html','/PM-Tracker/manifest.json','/PM-Tracker/icon-192.png','/PM-Tracker/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Network first — always try to get latest from server, fall back to cache if offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (r && r.status === 200) {
          const cl = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, cl));
        }
        return r;
      })
      .catch(() => caches.match(e.request).then(c => c || caches.match('/PM-Tracker/index.html')))
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

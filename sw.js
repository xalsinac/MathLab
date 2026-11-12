const SW_VERSION = 'v2.0.0';
const CACHE_NAME = `mateslab-${SW_VERSION}`;

// Instalación del Service Worker: activar inmediatamente
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activación: limpiar cachés antiguas (como mateslab-v1) y tomar control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Estrategia Network-First: siempre obtiene la versión más reciente si hay red
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
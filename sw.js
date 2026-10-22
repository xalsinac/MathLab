const CACHE_NAME = 'mateslab-v1';

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

// Interceptar peticiones (hace que la app funcione más rápido al guardar cosas en caché)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
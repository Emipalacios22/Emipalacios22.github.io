const CACHE_NAME = 'todo-cache-v1';
const urlsToCache = [
  'index.html',
  'styles_i.css',
  'script.js',
  'manifest.json',
  'screenshots/screenshot-desktop.png',
  'screenshots/screenshot-mobile.jpg',
  'img/icon-192.png',
  'img/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('error:', url, err);
        }
      }
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => {
        // Si es navegación y está offline, devuelve index.html
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
        // Si es una imagen, devuelve una respuesta vacía
        if (event.request.destination === 'image') {
          return new Response('', { status: 404, statusText: 'Not Found' });
        }
        // Para otros recursos, devuelve un error genérico
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});
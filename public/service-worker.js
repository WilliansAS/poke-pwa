const CACHE_NAME = "pokedex-cache-v-FINAL";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/pokebola64.png",
  "/pokebola192.png",
  "/pokebola512.png",
  "/static/css/main.fe2f7fa9.css",
  "/static/js/main.cc88c14d.js",
  "/static/js/453.1a678cd3.chunk.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache abierta. Guardando la lista manual de archivos.");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Borrando caché antigua:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Si la red falla (estás offline), busca en la caché.
      return caches.match(event.request);
    })
  );
});

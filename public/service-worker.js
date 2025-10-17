const CACHE_APP_SHELL = "pokedex-app-shell-v1";
const CACHE_API_DATA = "pokedex-api-data-v1";

// Lista de archivos base de la aplicación.
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/pokebola64.png",
  "/pokebola192.png",
  "/pokebola512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_APP_SHELL).then((cache) => {
      console.log("Cache de la App Shell abierta y guardada.");
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
          if (cacheName !== CACHE_APP_SHELL && cacheName !== CACHE_API_DATA) {
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
  const apiUrl = "https://pokeapi.co/api/v2/pokemon";

  if (event.request.url.startsWith(apiUrl)) {
    event.respondWith(
      caches.open(CACHE_API_DATA).then((cache) => {
        return fetch(event.request)
          .then((networkResponse) => {
            // Si tiene éxito, la guarda en la caché para el futuro y la devuelve.
            console.log("API: Sirviendo desde la red y guardando en caché.");
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => {
            // 2. Si la red falla (estás offline), busca en la caché.
            console.log("API: Sirviendo desde la caché porque la red falló.");
            return cache.match(event.request);
          });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

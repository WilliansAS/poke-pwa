const CACHE_NAME = "pokedex-cache-v4";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache abierta. Obteniendo la lista de archivos...");
      return fetch("/asset-manifest.json")
        .then((response) => response.json())
        .then((manifest) => {
          const assetsToCache = Object.values(manifest.files);
          console.log(
            "Guardando la App Shell y los assets en caché:",
            assetsToCache
          );

          assetsToCache.push("/");
          assetsToCache.push("/index.html");
          assetsToCache.push("/manifest.json");
          assetsToCache.push("/pokebola64.png");
          assetsToCache.push("/pokebola192.png");
          assetsToCache.push("/pokebola512.png");

          // Guardamos TODO en la caché de una sola vez.
          return cache.addAll(assetsToCache);
        });
    })
  );
  self.skipWaiting();
});

// Limpia las cachés viejas para ahorrar espacio.
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

// Modo Offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

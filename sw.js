const CACHE_NAME = "dalbit-ubt-v6";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );

  self.skipWaiting();
});

// FETCH
self.addEventListener("fetch", event => {

  const request = event.request;
  const url = new URL(request.url);

  /*
   * IMPORTANT:
   * NEVER intercept MP3 files.
   * Let GitHub Pages serve audio directly.
   */
  if (
    request.destination === "audio" ||
    url.pathname.toLowerCase().endsWith(".mp3")
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys().then(keys => {

      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );

    })
  );

  self.clients.claim();
});

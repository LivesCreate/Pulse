// Pulse service worker
const CACHE_NAME = "pulse-v1.0.0";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Install: pre-cache the app shell, activate immediately
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// Activate: clear any old caches, take control
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Never cache live weather data — always go to the network.
  if (url.hostname === "api.open-meteo.com") {
    return; // let the browser handle it normally
  }

  // Same-origin app shell: cache-first, then network (and cache the result).
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(function (cached) {
        if (cached) return cached;
        return fetch(req).then(function (res) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
          return res;
        }).catch(function () {
          return caches.match("./index.html");
        });
      })
    );
    return;
  }

  // Cross-origin (CDN React): network-first, fall back to cache if offline.
  event.respondWith(
    fetch(req).then(function (res) {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
      return res;
    }).catch(function () {
      return caches.match(req);
    })
  );
});

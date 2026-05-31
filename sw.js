// Pulse service worker
const CACHE_NAME = "pulse-v1.1.0";

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

// Activate: clear any old caches, take control of open pages
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

  // Never cache live data APIs — always go to the network.
  if (url.hostname === "api.open-meteo.com" ||
      url.hostname === "geocoding-api.open-meteo.com" ||
      url.hostname === "api.bigdatacloud.net") {
    return; // let the browser handle it normally
  }

  // Same-origin app files: NETWORK-FIRST so updates always show when online.
  // Falls back to cache only when offline.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match("./index.html");
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

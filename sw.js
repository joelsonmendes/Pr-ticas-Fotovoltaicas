const CACHE_NAME = "senaihub-checklist-fv-gs-v1";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./assets/logo_senaihub.webp"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))); });
self.addEventListener("fetch", event => { event.respondWith(caches.match(event.request).then(response => response || fetch(event.request))); });

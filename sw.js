// Service Worker — ENEM Loghus PWA (funciona offline)
const CACHE = "enem-loghus-v1";
const ARQUIVOS = [
  "index.html",
  "checklist-enem-por-materia-loghus.html",
  "plano-enem-loghus.html",
  "plano-enem-completo-loghus.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
          .then(() => self.clients.claim())
  );
});

// cache-first para os arquivos locais; rede para o resto (ex.: portal Loghus)
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return resp;
      }).catch(() => caches.match("index.html")))
    );
  }
});

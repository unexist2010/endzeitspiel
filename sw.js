// Service Worker Endzeitspiel (PWA). Bei jeder neuen Version VERSION hochzählen, dann wird der Cache erneuert.
// Code und Seite (HTML/JS/CSS/Manifest): Netz zuerst, Cache als Rückfall (offline). Bilder: Cache zuerst.
const VERSION = "ezs-pwa-4";
const PRECACHE = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "wiki-catalog.js",
  "pwa.js",
  "mobile.js",
  "manifest.webmanifest",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-32.png",
  "icons/icon-512.png",
  "icons/icon-maskable-192.png",
  "icons/icon-maskable-512.png",
  "assets/gfx/banner2.jpg",
  "assets/gfx/brunnen2.jpg",
  "assets/gfx/ezs.gif",
  "assets/gfx/farm2.jpg",
  "assets/gfx/lines.gif",
  "assets/gfx/logo.jpg",
  "assets/gfx/menu.gif",
  "assets/gfx/animals/esel.gif",
  "assets/gfx/animals/hund.gif",
  "assets/gfx/animals/pferd.gif",
  "assets/gfx/buildings/brunnen2.jpg",
  "assets/gfx/buildings/farm2.jpg",
  "assets/gfx/buildings/lagerfeuer_aus2.jpg",
  "assets/gfx/buildings/menschenwall2.jpg",
  "assets/gfx/buildings/mutantenwall2.jpg",
  "assets/gfx/buildings/stall.jpg",
  "assets/gfx/table_main/11.gif",
  "assets/gfx/table_main/12.gif",
  "assets/gfx/table_main/13.gif",
  "assets/gfx/table_main/21.gif",
  "assets/gfx/table_main/23.gif",
  "assets/gfx/table_main/31.gif",
  "assets/gfx/table_main/32.gif",
  "assets/gfx/table_main/33.gif",
  "assets/gfx/ui/enter_klein.jpg",
  "assets/gfx/vehicles/fahr1.gif",
  "assets/gfx/vehicles/fahr2.gif",
  "assets/gfx/vehicles/fahr3.gif",
  "assets/gfx/vehicles/fahr7.gif",
  "assets/gfx/vehicles/fahr8.jpg",
  "assets/gfx/vehicles/fahr9.gif",
  "assets/header/header.jpg",
  "assets/header/title_day.jpg",
  "assets/header/title_night.jpg",
  "assets/ico/favicon.ico",
  "assets/map/karte-welt.jpg",
  "assets/rohstoffe/benzin.gif",
  "assets/rohstoffe/diamantblau.gif",
  "assets/rohstoffe/diamantgruen.gif",
  "assets/rohstoffe/diamantrot.gif",
  "assets/rohstoffe/diamantweiss.gif",
  "assets/rohstoffe/edelmetall.gif",
  "assets/rohstoffe/erz.gif",
  "assets/rohstoffe/gas.gif",
  "assets/rohstoffe/gold.gif",
  "assets/rohstoffe/holz.gif",
  "assets/rohstoffe/kristall.gif",
  "assets/rohstoffe/kronkorken.gif",
  "assets/rohstoffe/kunststoff.gif",
  "assets/rohstoffe/kupfer.gif",
  "assets/rohstoffe/metall.gif",
  "assets/rohstoffe/nahrung.gif",
  "assets/rohstoffe/nahrungskonzentrat.gif",
  "assets/rohstoffe/oel.gif",
  "assets/rohstoffe/sand.gif",
  "assets/rohstoffe/sirup.png",
  "assets/rohstoffe/stein.gif",
  "assets/rohstoffe/uran.gif",
  "assets/rohstoffe/uran_2018.gif",
  "assets/rohstoffe/wasser.gif"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("message", (e) => { if (e.data === "skipWaiting") self.skipWaiting(); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const code = req.mode === "navigate" || /\.(html|js|css|webmanifest)$/.test(url.pathname) || url.pathname.endsWith("/");
  if (code) {
    e.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || (req.mode === "navigate" ? caches.match("index.html") : Response.error())))
    );
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});

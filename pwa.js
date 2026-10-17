// PWA: Service Worker anmelden (nur über http/https, nicht bei file://). Spielstand bleibt in localStorage (Schlüssel v3).
(function () {
  if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").then(function (reg) {
      window.__swReady = true;
      // Neue Version gefunden: still übernehmen, beim nächsten Start ist sie aktiv.
      reg.addEventListener("updatefound", function () {
        var w = reg.installing;
        if (w) w.addEventListener("statechange", function () { if (w.state === "installed" && navigator.serviceWorker.controller) w.postMessage("skipWaiting"); });
      });
    }).catch(function (e) { window.__swError = String(e); });
  });
})();

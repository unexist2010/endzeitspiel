// Mobile Ansicht (unter 800 px Breite und Handys quer, DESIGN): Kopfleiste mit Kennwerten, Reiter unten öffnen die Menügruppen als Schublade.
// Liest nur das gerenderte DOM (#orig-left / #orig-right) – app.js bleibt unverändert, Klicks laufen weiter über den Handler auf #orig-game.
(function () {
  var MQ = window.matchMedia ? window.matchMedia("(max-width: 800px), (pointer: coarse) and (max-height: 520px) and (max-width: 1100px)") /* gleich wie styles.css */ : { matches: false, addEventListener: function () {} };
  var game = document.getElementById("orig-game");
  var left = document.getElementById("orig-left");
  var right = document.getElementById("orig-right");
  var top = document.getElementById("m-top");
  var tabs = document.getElementById("m-tabs");
  var scrim = document.getElementById("m-scrim");
  if (!game || !left || !right || !top || !tabs) return;
  var LEFT_GROUPS = { nachrichten: "nachrichten", "dein charakter": "charakter", aktionen: "aktionen", community: "community" };

  function tag() {
    left.querySelectorAll(".mbox").forEach(function (b) {
      var h = b.querySelector("h3");
      var t = h ? h.textContent.trim().toLowerCase() : "";
      b.setAttribute("data-mg", LEFT_GROUPS[t] || "mehr");
    });
    right.querySelectorAll(".mbox").forEach(function (b) { b.setAttribute("data-mg", "mehr"); });
  }
  function val(root, label) {
    var lines = root.querySelectorAll(".infoline, .resline");
    for (var i = 0; i < lines.length; i++) {
      var s = lines[i].children;
      if (s.length >= 2 && s[0].textContent.trim().toLowerCase().indexOf(label) === 0) return s[s.length - 1].textContent.trim();
    }
    return "–";
  }
  var lastTop = "";
  function updateTop() {
    var items = [
      ["EP", val(right, "erfahrung")], ["Müde", val(right, "müdigkeit")], ["Energie", val(right, "energie")],
      ["Strahlung", val(right, "strahlenlast")], ["Essen", val(right, "nahrung")], ["Wasser", val(right, "wasser")], ["Gold", val(right, "gold")],
    ];
    var html = items.map(function (it) { return '<span class="ms"><b>' + it[0] + "</b>" + it[1] + "</span>"; }).join("");
    if (html !== lastTop) { top.innerHTML = html; lastTop = html; }
  }
  function setOpen(g) {
    if (g) game.setAttribute("data-mopen", g); else game.removeAttribute("data-mopen");
    if (scrim) scrim.hidden = !g;
    tabs.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-mtab") === g); });
    document.body.classList.toggle("m-drawer-open", !!g);
    if (g) { left.scrollTop = 0; right.scrollTop = 0; }
  }
  function centerMap() {
    var wrap = document.querySelector("#orig-sheet .field-wrap");
    var you = wrap && wrap.querySelector(".field-cell.you");
    if (!wrap || !you || !MQ.matches) return;
    if (wrap.getAttribute("data-mcentered") === you.getAttribute("data-cell")) return;
    wrap.scrollLeft = Math.max(0, you.offsetLeft - wrap.clientWidth / 2 + you.offsetWidth / 2);
    wrap.setAttribute("data-mcentered", you.getAttribute("data-cell"));
  }
  tabs.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-mtab]");
    if (!b) return;
    var g = b.getAttribute("data-mtab");
    setOpen(game.getAttribute("data-mopen") === g ? null : g);
  });
  top.addEventListener("click", function () { setOpen(game.getAttribute("data-mopen") === "mehr" ? null : "mehr"); });
  if (scrim) scrim.addEventListener("click", function () { setOpen(null); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && game.getAttribute("data-mopen")) setOpen(null); });
  // Nach einem Tipp auf einen Link in der Schublade: zu und nach oben, damit die neue Seite sichtbar ist.
  game.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || !game.getAttribute("data-mopen")) return;
    if (!left.contains(a) && !right.contains(a)) return;
    setTimeout(function () { setOpen(null); if (MQ.matches) window.scrollTo(0, 0); }, 0);
  }, true); // Capture: vor dem Spiel-Handler, der die Spalten neu zeichnet
  var pending = false;
  function refresh() {
    pending = false;
    tag(); updateTop(); centerMap();
  }
  var mo = new MutationObserver(function () { if (!pending) { pending = true; (window.requestAnimationFrame || setTimeout)(refresh); } });
  mo.observe(left, { childList: true });
  mo.observe(right, { childList: true, subtree: true, characterData: true });
  var sheet = document.getElementById("orig-sheet");
  if (sheet) mo.observe(sheet, { childList: true });
  if (MQ.addEventListener) MQ.addEventListener("change", function () { if (!MQ.matches) setOpen(null); });
  refresh();
  window.__mobile = { open: setOpen };
})();

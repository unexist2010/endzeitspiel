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
      ["Strahlung", val(right, "strahlenlast")], ["Nahrung", val(right, "nahrung")], ["Wasser", val(right, "wasser")], ["Gold", val(right, "gold")],
    ];
    // Durchgang 9: knapper Vorrat (≤ 20) wird markiert
    var html = items.map(function (it) {
      var n = parseInt(it[1], 10), low = (it[0] === "Nahrung" || it[0] === "Wasser") && !isNaN(n) && n <= 20;
      return '<span class="ms' + (low ? (n <= 0 ? " ms-low ms-crit" : " ms-low") : "") + '"><b>' + it[0] + "</b>" + it[1] + "</span>";
    }).join("");
    // Durchgang 7: aktueller Ort (Name + Koordinaten), Tipp öffnet die Landkarte
    var loc = right.querySelector("a.loc-link");
    if (loc && loc.children.length >= 2) html = '<span class="ms ms-loc" role="link" tabindex="0" aria-label="Landkarte öffnen"><b>Ort</b>' + loc.children[1].textContent.trim() + "</span>" + html;
    if (html !== lastTop) { top.innerHTML = html; lastTop = html; }
    // Durchgang 10: Abzeichen am Reiter „Res./Stamm“, wenn Optimus eine Anfrage hat
    var mb = tabs.querySelector('button[data-mtab="mehr"]');
    if (mb) mb.classList.toggle("m-badge", !!right.querySelector('.p10-box[data-req="1"]'));
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
  top.addEventListener("click", function (e) {
    var l = e.target && e.target.closest ? e.target.closest(".ms-loc") : null;
    var a = l && right.querySelector("a.loc-link");
    if (a) { setOpen(null); a.click(); window.scrollTo(0, 0); return; } // Ort → Landkarte
    setOpen(game.getAttribute("data-mopen") === "mehr" ? null : "mehr");
  });
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

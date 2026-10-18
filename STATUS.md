# Endzeitspiel — Prototyp-Status (Single-Player)

Stand: 2026-09-30 (Europe/Vienna) · Pause für User-Testing

## Schnellstart

```bash
cd /workspace/endzeitspiel/prototype && python3 -m http.server 8765
```

Im Browser öffnen. **Hilfe**-Button (Header / HUD) · erste Anzeige per Overlay (Flag `endzeitspiel_help_dismissed_v1`). Spielstand: `localStorage` Key `endzeitspiel_prototype_v3` (Autosave). Alte Stände `endzeitspiel_prototype_v1` und `_v2` werden beim Start gelöscht und nicht geladen (Durchgang 6: frischer Charakter). Ohne Stand startet das Spiel still als neuer Charakter.

Archiv: `/workspace/endzeitspiel-prototype.tar.gz` (enthält `prototype/`, `DESIGN.md`, `STATUS.md`).

---

## Was funktioniert

| Bereich | Inhalt |
|---------|--------|
| Charakter | Mensch/Mutant, Attribute, TL0-Beruf, Persistenz + Migration |
| Needs | Nahrung/Wasser-Tick, Essen/Trinken, Tod bei ≤ −10 (Wiki) |
| Karte | POI-Liste mit Wiki-Höhlen-Koordinaten + DESIGN-Feldern, Reise, Zufallskampf |
| Arbeitsgänge | Sammeln/Graben/Jagen/… je Ort & Beruf |
| Craft & Handel | Beruf/TL-abhängig; Handel in Camp/Händlerhöhle |
| Kampf | lokales PvE (TP/KP **DESIGN**), Loot, KEP |
| Quests | Greifer, Railgun, Anfängerhöhlen, Kelch/Pokal-Ketten (light) |
| Techlevel | **TL0–TL9** Freischaltung (Schwellen **DESIGN**) |
| Gebäude | Privatgebäude im Ruinencamp |
| Fahrzeuge | Motorrad / Hoverbike (Kosten/Tempo DESIGN) |
| Kleidung | Sandalen, Fellhemd (Boni DESIGN) |
| Stamm | Gründung ≥25 EP (Wiki), Lager, 3 NPCs, Wall, Rivalen-PvE |
| Karma | Hell/Dunkel, Festigen, Licht-/Schattensprüche, Kelch 195/4, Pokal 198/8 |
| UX | Hilfe-Panel, Autosave-Anzeige, Kampf-/Karma-Feedback |

---

## Wiki vs DESIGN (kurz)

**Wiki (übernommen, wo klar):** Todesgrenze −10 Needs; Höhlen-Koordinaten; Quest-Schritte Greifer/Railgun/Kelch/Pokal; Stamm ab 25 EP; Karma-Konzept hell/dunkel + Spruchnamen; Lichtspruch verdoppelt Needs-Items (≤500); Kelch zerbrechlich / einmalige Höhle.

**DESIGN (Prototyp-Erfindung / stark vereinfacht):** Needs-Tick-Rate; AG-Dauern; Kampf-KP/TP-Formel; TL-Freischalt-Schwellen; viele Craft-/Baukosten; Stamm-NPCs & Rivalen; Karma-Schwelle **12+3** Festigen; Kelch = Self-Heal statt MP-Wiederbelebung; Schatten = Debuff nächster Kampf; Artefakt-Craft-Rezept.

Details: `DESIGN.md`.

---

## Bewusst offen (Restlücken)

1. **Volle Kachel-/Grid-Karte** — nur POI-Liste, kein originales Kartenraster.
2. **Original-KP-Formel** — unbekannt; Kampfsystem ist DESIGN-Balance.
3. **Online / Multiplayer** — kein Auth, kein persistenter Server, kein PvP, kein echter Stammkampf, keine Wiederbelebung anderer Spieler.
4. Tutorial-Tiefe. Alles, was einen Server braucht (siehe Durchgang 5, „Bleibt offen“).

Keine neuen TL-Inhalte in diesem Polish-Pass.

---

## Durchgang 3 (Okt 2026)

- Haus-Menü: 5 Privathäuser (Wiki-Kosten), Privatlager, Goldbunker, Chemieküche, 4 Erweiterungen. Eigenes Haus = besserer Schlafplatz. Haus nötig für die Stammgründung (Wiki).
- Graben nach Wiki-Regel mit Balken und Abbrechen; Boden kann Spitzhacke oder Dynamit verlangen.
- Questketten: Teleporter (9 Höhlen), Doppelläufiger Seelenbrenner (3 Höhlen), Mechaniker Junge, Ringhöhle. Teleporter in der rechten Hand: Eingabe auf der Landkarte.
- Artefaktschmiede (über Haus): Forschung mit Schriftrolle, 5 Gürtel, 2 Amulette; Ablegen an den Gürtelportalen.
- Schilde (linke Hand) und Munition; 7 neue Fahrzeuge und Pimpen (Garage).
- Hast-, Kraft-, Wahrnehmungspillen, Berufswahltrank, Karmatrank.
- Bis 25 Tiere (Stall, mit Stamm). Strahlung steigt langsam in Ruhe. Lagerfeuer schützt beim Schlafen draußen im Ruinencamp.
- Alles mit WIKI-/DESIGN-Kommentaren im Code. Details: `docs/wiki-gap-audit.md`.

## Durchgang 4 (Okt 2026)

- **Lange Arbeit** (Arbeiten-Seite): Dauer 30/60/120/240/480 min, Balken, abbrechbar (Ertrag nur für fertige halbe Stunden), Ertrag = Anzahl 30-min-Gänge. Wiki Handbuch S.12: Menschen bis 480 min ohne Verletzung. Mutanten nur mit wirkendem Pilzmix-S/-M (Wiki: „längere Arbeiten ohne verletzt zu werden"). 30 Wiki-min = 4 s, Nahrung/Wasser −1 je 30 min (DESIGN). Pilzmix erlaubt 15 min lang lange Arbeit (DESIGN).
- **Rohstofftränke** (Chemieküche): Holz-, Stein-, Metall-, Kunststofftrank (Wiki-Kosten, TL2/3), Erztrank (TL9, Kosten ÷100). Dazu ein **Rohstoffbestand je Land** (DESIGN): in %, −2% je Arbeitsgang, +1% je 10 min, Ertrag ×(0,4 + 0,6 × Bestand). Trank auf dem Land anwenden → 100%. Erztrank: braucht ≥10% Bestand, gibt 1000–19000 Erz von max. 90.000 (Wiki) als %.
- **Gifte** (Chemieküche): Giftstabilisator I/A/S, Spinnen-/Insekten-/Amphibiengift, drei Giftspritzen — alle Wiki-Rezepte. Insekten-/Amphibiengiftspritze in der linken Hand: Runde 1 K.o. mit 80%/50% (DESIGN), Spritze verbraucht. Spinnengiftspritze heilt eine Verletzung (DESIGN). Zutaten: Kleintiere mit Fangnetz fangen (Jagen-Seite, DESIGN) oder Drogendealer; Viren beim Biologen (DESIGN-Rezept) oder Drogendealer.
- **Kräuter- und Pilzsorten** (Seite „Kräuter & Pilze", über Haus und Arbeiten): rote/helle/braune Kräuter, Fliegen-, Strahlen-, Schimmel-, blaue, grüne Pilze. Gärtner/Pilzsammler brauchen immer eine Schaufel (Wiki). Kräutergarten/Pilzhaus mit Wiki-Kosten liefern Sorten; wildes Kräuterfeld/Pilzhain nur Sammelware + 30% eine Sorte (DESIGN). Rezepte (Wach-, Strahlen-, Hastpillen, Kräutermix, Pilzmixe, Karmatrank) nutzen jetzt die Wiki-Sorten und Reagenzgläser. Kräuter direkt: rote +5 Energie, helle −5 Müdigkeit, braune −5 Strahlung (DESIGN).
- **Stammgebäude** (Stamm → Stammgebäude): Forschungsgrundstück (RL1), Forschungsgebäude (RL2), Kunststoffschmelze, Erzverarbeitung (+3 Upgrades), Polymeresplitter, Reaktor I–III, Benzincracker, Erdöl-/Erdgasraffinerie, Kaserne, Waffenfabrik, Bäder, Öltank, Gastank (20 Stufen, nur Ölwerker/Gaswerker). Wiki-Kosten ÷100, Anforderungen RL/Intelligenz/Kraft aus dem Wiki. Kaserne: ausruhen (8 s: Energie +40, Müdigkeit/Strahlung −40, DESIGN), Techlevel senken/erhöhen (Wiki). Bäder: 70 Wiki-min, Energie auf Maximum, Ausstrahlung +2 (Wiki), Wasserqualität −25% je Bad, unter 25% erst austauschen (50 Wasser, DESIGN). Reaktor: seit Durchgang 5 mit Wirkung (siehe unten).
- **Forschung** (Stamm → Forschung): Researchlevel bis 15. Forscher forschen im Forschungsgebäude (auch lange Arbeit): 3 + Intelligenz Punkte je Gang, 15 × (RL+1) Punkte je Stufe, Forschungspunkte zählen 1:1 (alles DESIGN).
- **Erfindungen** (Ideenschmiede-Seite): alle 47 Wiki-Rezepte, Erfinder TL8, Intelligenz ÷100. Werkzeugmacher-Teile Bohrspitze, Förderrohre, Edelmetallplättchen, Mörser und Stössel mit Wiki-Kosten. Zutaten ohne Quelle (z. B. Kabel, Benzintank, FM Empfänger, Schmierseife) gibt es beim Händler (25 Gold, DESIGN).
- **Waffenfabrik** (Stamm → Waffenfabrik): Wallbrecher, Bola, Kleinmann SG6, Molotow Cocktail, Wurfsterne, Gasgranate (Wiki-Kosten ÷10), Seelenbrenner (Kosten DESIGN), Taserspitzen (DESIGN), Stein-/Metallkugeln jetzt nur hier. Nur Waffentechniker. Einweg-Waffen (Molotow, Wurfsterne, Gasgranate, Kristallsplitterbombe) werden zu Kampfbeginn verbraucht.
- **Charakter zurücksetzen** auf Status und Übersicht (mit Rückfrage).

Tests (Stand Durchgang 4): 88 Prüfungen in `smoke-pass4.js`.

## Durchgang 5 (Okt 2026)

- **Bauzeit** für alle Stammgebäude (Wiki-Minuten, 30 min = 4 s; z. B. Forschungsgrundstück 180 min → 24 s, Bäder 480 min → 64 s). Immer nur ein Bau, Fortschritt auf der Stammgebäude-Seite, die Spielzeit läuft weiter. Bauerfahrung +Bauminuten/10 (DESIGN).
- **Neue Stammgebäude** (Wiki-Kosten ÷100, Anforderungen aus dem Wiki): Werkstatt (RL10, nur Mechaniker, zählt wie die private Werkstatt), Uranerzaufbereitung (RL11), Konversionsanlage (RL12), Anreicherungsanlage (RL13), EMP Verteidigungsturm (RL14, EMP Verteidigungsanlage im Rucksack), Biolabor (RL15, 750 Int), Glasschmelze, Erdöl-/Erdgasraffinerie Stufe 2, Kampfarena, Radiostation, Löschvorrichtung, Brunnen und Farm (Stamm), Wachturm, Feuerstelle ohne Holz, Garage (Stamm), Raketenbasis (DESIGN).
- **Uran-Kette**: Natururan → Yellow Cake → Uranhexafluorid → Uranoxid nur noch in den drei Stammgebäuden (Forscher). Glasschmelze: 1 Uranhexafluorid + 50 Sand → 1 Glas (Wiki). Raffinerie Stufe 2: 400 Holz + 1200 Kunststoff → 120 Erdöl / 30 Erdgas (Wiki).
- **Biolabor**: Biolevel wie Researchlevel, Erfolg je nach Intelligenz bis 80% (Wiki); Antivirus (BL1), M4 Virus (BL2), XB-5000 Granate (BL3) — Rezepte DESIGN. Mikroskop nötig (Wiki).
- **Erfindungen mit Wirkung**: Erz-/Uran-/Diamantendetektor zeigen das Vorkommen je Land und die besten Fundorte; Mobiler Tiefenbohrer Pflicht für Öl/Gas, Fernglas für den Spion, Spitzhacke für den Erzsammler, Diamantendetektor + Mineral-/Diamantbohrer für den Diamantsucher, Mikroskop für den Biologen, Schere für den Schneider (alles Wiki). Diese Werkzeuge gibt es auch beim Händler (DESIGN-Ersatz für den Kauf bei Mitspielern). Scheinwerfer (linke Hand, Waffe rechts): −20% Treffer des Gegners, wilde Hunde ziehen ab, sicherer Schlaf draußen. EMP Vehicle Destructor: 40% Fahrzeug des Gegners zerstört, 15% Überladung (kaputt + verletzt). EMP Streuer, EMP Verteidiger, EMP-Turm, Sprengfalle, Stolperfalle (nur Spione) wirken gegen Überfälle. Radio speichert 30 Meldungen (Wiki). Napalm/Diamantmunition/Quadronika Munition als Munition. Schaufel/Spitzhacke nach 2 Einsätzen verbraucht, Edelmetall-Werkzeuge Mehrweg (Wiki). Benzinkanister: Werkzeugmacher baut ihn leer, Ölwerker füllt ihn im Benzincracker (Wiki), umfüllen = +10 Benzin (DESIGN).
- **Waffen-Anforderungen** (Wiki „Benutzen: … EP, … Intelligenz“, EP ÷5, Eigenschaften ÷100): ohne sie zählt die Waffe 0 KP, Einweg-Waffen werden nicht verbraucht. Gilt auch für Greifer und Railgun.
- **KP-Skala** (DESIGN): Wiki-Stärke bleibt sichtbar, KP = 2,5 × √Stärke. Molotow 600 → +61 statt +600, Railgun 1500 → 97, Bogen 50 → 18.
- **Reaktor** (Wiki: „ab dem ersten Reaktor kein Lagerfeuer mehr nötig“): Ohne Reaktor und ohne Feuer ist das Stammlager nachts zu 5% unsicher (DESIGN). Mit Reaktor: sicher, Schlaf ×1,4 statt ×1,25, sicherer Schlaf draußen im Stammland (bis 3 Felder ums Camp).
- **Überfälle der Rivalen** auf das Stammlager (DESIGN, frühestens 30 min nach der Gründung, dann höchstens alle 30 min mit 30%): Angriff 20 + 4×RL + 0–20, mit Fahrzeugen +30%. Verteidigung: deine KP (wenn du im Camp bist), passender Wall +25, Mitglieder je +5, Wachturm +10 (zeigt die Angreifer), Radiostation + Radio +10. Bei Niederlage gehen 20% des größten Lagerpostens verloren, 30% Brandgefahr (Löschvorrichtung löscht).
- **Fähigkeiten-Zähler**: Bauerfahrung, Spionageerfahrung, Diamantenerfahrung, Casino-Spiele. Neue Fähigkeiten: Glauben, Sehen, Amphibien-/Spinnenkunde, Erweiterte Architektur, Denkmalästhetik, Diamantenverarbeitung, Zahlenkunde, Mathematik, Physik, Informatik, Stammkampftaktik, Kleine/Große Sabotage, Fernspionage, Casino-Stufen. Wirkungen: Glauben/Sehen für Licht-/Schattenartefakt, Ort der Licht-/Schattenhöhle zum Finden, Casino VIP für Bewaffnete, Zoologie am Wasser, Kleine Sabotage im Rivalenlager, Architektur-Reihe beschleunigt den Bau (DESIGN).
- **Berufs-Voraussetzungen** (Wiki) beim Wechsel: Spion, Uransammler, Pilzsammler, Gärtner, Erfinder, Mechaniker, Schneider, Psioniker, Artefaktjuwelier, Diamantsucher, Tierfänger, Erzsammler, Biologe. Umschulung dauert 90 / 60 (Flexibilität) / 30 (Perfektion) Wiki-Minuten.
- **Kleinkram**: Mutanten Spezial Pillen (100 Kristall, nur Mutanten), Mutanten XTC (Chemiker-Experiment mit 10 Gegenständen), Steinspeer, Metallspeer, Pfeil und Bogen, Katapulte, Mechaniker Werkzeuge, Edelmetall-Werkzeuge herstellbar; Tier beißt bei Einstellung ≤ −80, Hund/Wolf/Adler jagen bei Hunger (DESIGN).

Tests: `node tests/smoke-sleep-pets.js`, `smoke-clicks.js`, `smoke-pass3.js`, `smoke-pass4.js`, `smoke-pass5.js` (80 Prüfungen für Durchgang 5). `smoke-pass4.js` stellt Stammgebäude jetzt über einen Helfer sofort fertig und gibt dem Charakter für den Wurfstern-Test die Wiki-Anforderung.

### Bleibt offen (braucht einen Server)

PvP und echte Stammkämpfe gegen Spieler, Handel zwischen Spielern, Kerker (Gefangene), Wiederbelebung anderer Spieler, Spionage/Fernspionage/Sabotage gegen Spieler, echte Serverzeiten (Tierkämpfe 0–3 Uhr, Brunnen/Farm im 3-Stunden-Takt), Moderation, Pinnwand/Umfragen mit anderen Spielern.

### Skalierung (Durchgang 4 + 5)

| Was | Faktor | Beispiel |
|---|---|---|
| Stammgebäude-Kosten, Erztrank | ÷100 | Bäder 1000 weiße Diamanten → 10 |
| Waffenfabrik-Waffen | ÷10 (wie Fahrzeuge) | Wallbrecher 9000 Holz → 900 |
| Intelligenz/Kraft-Anforderungen | ÷100 (ATTR_SCALE) | Reagenzgläser 750 Int → 8 |
| EP-Anforderungen der Giftspritzen | ÷5 (wie Fahrzeuge) | 3000 EP → 600 |
| Tanks | 100.000 → 400 je Stufe (÷250 wie Stammlager 50.000 → 200) | |
| Zeit | 30 Wiki-min = 4 s | Bad 70 min ≈ 9,3 s, Stammgebäude 60–480 min → 8–64 s |
| EP-Anforderungen der Waffen | ÷5 | Molotow 2000 EP → 400 |
| Waffen-KP | 2,5 × √Wiki-Stärke (DESIGN) | Molotow 600 → 61 |
| Stamm-Erträge (Farm, Brunnen) | Zeit ÷10 | 180 min → 18 echte Minuten |
| Unverändert | Tränke, Gifte, Erfindungen, Werkzeuge, Privatgebäude | |

Namen: Erdöl/Erdgas = Öl/Gas, Kaliumnitrat = Kalisalpeter, Yellocake = YellowCake, Kristalle = Kristall, weisse Diamanten = Diamant (weiß).

## Durchgang 6 (Okt 2026)

Vollständiger Klicktest im Headless-Chrome (puppeteer-core) plus ein Frühspiel aus Sicht eines neuen Spielers (19 Schritte). Gefundene und behobene Fehler:
- **Essen/Trinken** war in der sichtbaren Oberfläche nicht erreichbar. Neu: Kasten „Essen und Trinken“ im Rucksack (1 / 5 / alles; +8 Bedarf je Einheit, DESIGN).
- **Kaputte Gegenstandsnamen** aus dem Wiki-Parser (z. B. „Kosten: Vorschlaghammer“) konnten beim Graben auftauchen. `wiki-catalog.js` bereinigt: 145 Namen korrigiert, Doppelte zusammengelegt (273 → 251 Einträge).
- **Stumme Knöpfe** (CP-Verteilen, Herstellen, Anlegen, Verkaufen, Tränke, Logout, Notiz speichern) zeigen jetzt sichtbares Feedback; allgemein: schreibt eine Aktion nur ins Ereignisprotokoll, erscheint die letzte Zeile als Hinweis.
- **Baubalken** im Stamm lief nur alle 5 s weiter, die Fertigstellung kam bis zu 5 s zu spät. Jetzt alle 250 ms, mit Prozent und Restzeit.
- **Handeln ohne Händler** war eine Sackgasse. Jetzt Hinweis auf die 3 nächsten Händler mit Reise-Link.
- **Landkarte**: fast alle Orte liegen außerhalb des Ausschnitts. Neu: „Orte in der Nähe“ mit Entfernung, Richtung und Reise-Link sowie Schnellreise zum Ruinencamp (DESIGN).
- Leeres schwarzes Landbild → Platzhalter mit Ortsname. Englische „Craft“-Texte → „Herstellen“; „1 Siege“ → „1 Sieg“; der Abschlusstext eines Gebäudes ging beim Seitenaufruf verloren.

Tests: `smoke-pass6.js` (33 Prüfungen). Browser-Playtest: `node tests/playtest-pass6/run-all.js` (braucht puppeteer-core, Pfad per `PUPPETEER_DIR`, Chrome per `CHROME`). Der Crawler klickt jeden erreichbaren Link (≈1300 Klicks, ≈1500 verschiedene Links, ≈150 Seiten) und prüft JS-Fehler, NaN/undefined, kaputte Bilder, Überlauf und Knöpfe ohne Wirkung. Screenshots: `playtest-pass6/`.

## PWA / Mobil (Okt 2026)

- **Installierbar als Web-App:** `manifest.webmanifest` (Name „Endzeitspiel“, Kurzname „Endzeit“, schwarz/gold, `standalone`, Hoch- und Querformat), Icons in `icons/` (192/512, maskable, Apple-Touch-Icon; goldenes Knoten-Dreieck aus dem Kopf), Meta-Tags viewport/theme-color/apple-touch-icon.
- **Offline:** `sw.js` legt alle Spieldateien in den Cache (`VERSION` = `ezs-pwa-1`). HTML/JS/CSS/Manifest: Netz zuerst, Cache als Rückfall; Bilder: Cache zuerst. **Bei jeder neuen Version `VERSION` in sw.js hochzählen und `?v=` in index.html erhöhen.** Angemeldet wird der Service Worker in `pwa.js` (nur bei http/https, nicht bei file://).
- **Spielstand** bleibt in `localStorage`, Schlüssel unverändert `endzeitspiel_prototype_v3`.
- **Mobile Ansicht unter 800 px** (`mobile.js` + Block am Ende von `styles.css`, DESIGN): Kopfleiste mit EP, Müdigkeit, Energie, Strahlung, Essen, Wasser, Gold (Tipp öffnet Spielerinfo/Ressourcen); unten 5 Reiter Nachrichten · Charakter · Aktionen · Community · Res./Stamm, die die Menügruppen als Schublade öffnen (2 Spalten, Einträge ≥ 44 px, schließt nach Auswahl oder Tipp daneben). Inhalt volle Breite, Links im Inhalt ≥ 44 px hoch, Tabellen scrollen in sich, Karte wischbar mit 44-px-Feldern und zentriert auf „Du“, Balken volle Breite. `mobile.js` liest nur das gerenderte DOM, app.js ist dafür unverändert. Über 800 px bleibt das Desktop-Layout pixelgleich (im Test geprüft).
- **Lokal hosten:** `python3 tools/serve-pwa.py 8765` im Ordner prototype. Für das Handy braucht es HTTPS, z. B. `cloudflared tunnel --url http://localhost:8765` (temporäre trycloudflare-Adresse, kein Konto) oder dauerhaft GitHub Pages / Netlify / Cloudflare Pages.
- **Test:** `node tests/playtest-pwa/mobile.js` (Pixel 7, 412×915, Touch): Service Worker, Cache, Manifest, Installierbarkeit (Chrome), Icons, Offline-Start, alle Menüpunkte über die Reiter (frisch und mit Stamm), keine Überbreite, Tipp-Ziele, Karte, Balken, Desktop unverändert. Screenshots in `playtest-pwa/`.

## Live-Test GitHub Pages (Okt 2026)

Live unter **https://unexist2010.github.io/endzeitspiel/** (Repo `unexist2010/endzeitspiel`, Deploy-Checkout `/workspace/ezs-pages`).
- Alle Browser-Tests laufen auch gegen die echte Seite: `LIVE_URL=https://unexist2010.github.io/endzeitspiel/ node tests/playtest-pass6/run-all.js` bzw. `… node tests/playtest-pwa/mobile.js`. Der Test-Haken für app.js kommt dann per Request-Interception (nur im Test); die PWA-Prüfungen laufen ohne Eingriff (echter Service Worker, Bereich `/endzeitspiel/`, Offline-Start, Installierbarkeit).
- Darstellung in 6 Größen: `node tests/playtest-live/sizes.js` (Pixel 7 412×915, kleines Handy 360×740, Handy quer 915×412, Tablet 800×1280, Desktop 1366×768 und 1920×1080) mit Screenshots und Prüfungen (Überbreite, Bilder fehlen/verzerrt, kleine Schrift, Tipp-Ziele, Inhalt unter den Reitern, abgeschnittener Text).
- Service-Worker-Update: `node tests/playtest-live/sw-update.js install` vor dem Deploy, `NEW_CACHE=ezs-pwa-N NEW_V=N node tests/playtest-live/sw-update.js check` danach.
- Behoben: Handy quer bekam das Desktop-Layout mit winzigen Links → mobile Ansicht auch für Touch-Geräte bis 520 px Höhe (Kennwerte in einer Zeile, niedrige Reiter, Kopfbild ausgeblendet); sichere Ränder (Notch) links/rechts; Kopfleisten- und Reiter-Beschriftung 11 px statt 10 px, Kartenzahlen mobil 11 px statt 9 px; Überschriften in der Schublade ohne versetzten menu.gif-Balken; Tablet/Querformat: Kennwerte in einer Zeile, Schublade 3-spaltig; „im Bau (noch X s)“ in der Stammgebäude-Tabelle läuft jetzt live mit.
- Version: Service-Worker-Cache `ezs-pwa-5`, `?v=11` (zuletzt: Service Worker lädt am HTTP-Cache vorbei, damit Updates sofort ankommen; Tabellenzeilen unter 480 px gestapelt, kein schwarzer Streifen unter kurzen Seiten, Tabellenzellen oben ausgerichtet).

## Durchgang 7 (17.10.2026)

- **Aufgaben** (Menü „Dein Charakter → Aufgaben“, Kasten rechts / mobil Zeile über dem Inhalt und in der Schublade „Res./Stamm“): 10 Kapitel mit je 5 Aufgaben. Die Aufgaben 1–4 gehen in beliebiger Reihenfolge, die 5. (★) schließt das Kapitel ab. Zähler und Erkennung laufen automatisch, Belohnung je Aufgabe EP+Gold, je Kapitel zusätzlich 5 CP (DESIGN). Hinweise mit Links (hin: Ort · Seite). Das alte Tutorial ist in Kapitel 1 aufgegangen (Holz 40, Stein 30, Stock, Stock mit Stein, Holzhütte); Schrottfeld öffnet nach den Aufgaben 1–4. Nebenquests mit „einlösen“ auf der Aufgaben-Seite. Gespeichert in `state.guide`/`state.p7` (Spielstand v3, bestehende Stände: Erfülltes wird ohne Belohnung abgehakt).
- **Herstellen** (Aktionen → Herstellen): Karte je Rezept mit Bild, Zutaten „hast/brauchst“ (grün/rot), „im Rucksack: n“, Verwendungszweck, Kosten. Bilder: Rohstoffe/Fahrzeuge aus den Wiki-Archiv-GIFs, sonst erzeugte Symbole `assets/items/*.png` (`tools/gen_item_icons.py`).
- **Status**: Tabelle „Was die Werte bedeuten“ (Wirkung laut Wiki, aktueller Wert, nächster Punkt) plus Kennwerte. Neu wirksam (DESIGN-Faktoren): Kraft:Intelligenz 3:1 bei den Kampfpunkten, Wahrnehmung skaliert den Kleiderbonus (voll bei 501), Geschwindigkeit verkürzt Fußreisen (−3 %/Punkt, max −45 %) und Kampfrunden (900 ms −4 %/Punkt, min 450 ms), Ausdauer senkt Tränke-Nebenwirkungen (−3 %/Punkt, max 60 %), Ausstrahlung = Handelskontingent 300 + 100/Punkt je Stunde, Dynamik/Wahrnehmung bei Erkunden.
- **Erkunden**: Entdeckung ca. 18–20 % am Anfang (+1 %/Dynamik, +0,5 %/Wahrnehmung, Pferd ×1,25, max 45 %), kleine Funde ~40 % passend zum Gelände, Kosten am Knopf, Standort, N/O/S/W + Landkarte, Verlauf der letzten 20 Versuche.
- **Graben**: Bild, Erklärung (Funde, Wahrnehmung, Geschwindigkeit, Werkzeug, Bodenarten), Standort mit Boden, 1×/5×/10× mit Kosten, N/O/S/W + Landkarte, Verlauf 20. Gräbt hier auf dem Feld (nicht im Ruinencamp; Felsboden braucht Spitzhacke/Greifer, Glasfläche Dynamit).
- **Kosten/Wirkung** an allen Aktionsknöpfen; die Ergebniszeile nennt die echte Änderung (z. B. „Müdigkeit +3 (jetzt 12 %), Energie −2 (jetzt 92 %)“).
- **Ort im HUD**: Desktop in der Spielerinfo, mobil in der Kopfleiste; Klick/Tipp öffnet die Landkarte.
- **Tests**: `node tests/smoke-pass7.js` (Node), `node tests/playtest-pass7/p7.js` (Chrome, Desktop + Handy, Screenshots in `tests/playtest-pass7/shots` bzw. `SHOT_DIR`); in `run-all.js` aufgenommen.
- Version: Service-Worker-Cache `ezs-pwa-6`, `?v=12`.

## Durchgang 8 (18.10.2026)

- **Reisen per Klick**: Koordinaten wie „(77/88)“ in Ergebniszeilen, im Erkunden-/Graben-Verlauf, im Aufgaben-Kasten, auf der Aufgaben-Seite, bei Ereignissen und Länderseiten sind Links („77/88 ➜“). Tooltip: Entfernung, Dauer, Nahrung/Wasser −1, Müdigkeit. Eigener Standort erscheint grün, gesperrte Orte grau. Zähler wie „Im Stall (1 von 25)“ werden nicht verlinkt.
- **Reisen dauern jetzt wirklich** (vorher sofort): Reisebalken mit der angezeigten Dauer, danach wie gehabt Ankunft, Reise-EP und evtl. Begegnung.
- **Landkarte**: Feld „Zu Koordinaten reisen“ mit X/Y (Ziffernblock am Handy, 1–200), „Reisen“ zeigt Ziel, Entfernung, Dauer und Kosten, dann „Reise bestätigen“ oder „abbrechen“. Prüft Zahlen, Kartengrenzen, eigenen Standort und gesperrte Orte. Danach steht die Karte auf dem Ziel.
- **Fähigkeiten-Seite**: Kopf mit Beruf und TL-Fortschrittsbalken; Berufe als Karten je Techlevel (eigener Beruf gold, erlernbar grün mit „erlernen“ und Ausbildungszeit, gesperrt grau mit Grund); Fähigkeiten als Kategorie-Karten mit Stufe, Balken zur nächsten Fähigkeit, ✔/🔒 je Fähigkeit, Wirkung und „so steigt der Wert“. 36 Symbole im Item-Stil (`tools/gen_skill_icons.py`, `assets/skills/`). Beschreibungen/Anforderungen aus dem Wiki (`wiki/text/berufe`).
- **Tierbilder**: Hund, Esel, Pferd aus dem Wiki-Archiv; Affe, Wolf, Adler sowie Plünderer/Marodeur (vorher Esel/Pferd-Bild) neu gezeichnet (`tools/gen_animal_art.py`). Sichtbar im Tierstall (Galerie aller Tiere, Stallliste, Händlerangebot), in Fang-/Kauf-Ergebnissen und bei Tierkämpfen.
- **Kapitel 1 (Kunststoff)**: Die Holzhütte braucht laut Wiki 15 Kunststoff, 20 Metall, 20 Nahrung, 5 Wasser, Kapitel 1 lehrte aber nur Holz und Stein. Neu: 1 Holz 40 · 2 Stein 30 · 3 Stock + Stock mit Stein · 4 „Besorge Kunststoff, Metall und Vorräte“ (Schrottfeld 60/120 „Kunststoff/Metall sammeln“, Oase, Notverpflegung, Händler; Zähler „Kunststoff 3/15 · …“) · 5 Holzhütte. Schrottfeld öffnet nach 1–3. Hinweise zeigen „Es fehlt noch: …“.
- **Weitere Kapitel**: K2 Aufgabe 1 jetzt „einmal handeln“ (Wasser steckt in K1); K3 Aufgabe 4 jetzt „Mutierten Plünderer besiegen“ (Metall steckt in K1); K6/K10 Steinhaus-Hinweise: erst sammeln, dann einreißen (kein Upgrade); K9 Forschen-Hinweis nennt den Ort (Ruinencamp), Forschung-Seite verlinkt die Reise dorthin. Hausbau (DESIGN): der Inhalt des alten Lagers zählt beim Neubau mit – sonst passt das große Steinhaus (1000 Rohstoffe) nicht in den Rucksack (600).
- **Durchspiel-Test**: `node tests/walk-chapters.js [--seed N]` spielt alle 10 Kapitel als frischer Charakter nur über Links auf den Seiten (virtuelle Uhr, keine Cheats) – grün mit Seeds 7, 1, 2, 3, 42 (ca. 1 780–2 150 Klicks, 112–168 Spielminuten).
- **Tests**: `node tests/smoke-pass8.js`, `node tests/playtest-pass8/p8.js` (Chrome Desktop 1366 + Handy 412×915, in `run-all.js`). `tests/harness-virt.js` (virtuelle Uhr). Alte Node-Tests laufen mit `EZS_FAST_TRAVEL`.
- Version: Service-Worker-Cache `ezs-pwa-7`, `?v=13`. Spielstand-Schlüssel bleibt `endzeitspiel_prototype_v3` (kein Save-Break).

## Speichern & Migration

- Autosave nach Reisen, AGs, Kampf, Craft, Quests, Needs-Tick, Karma-Aktionen.
- Manuell: Button **Speichern** (Anzeige „Gespeichert“).
- Alte Stände werden in `migrateState` ergänzt (Karma, Stamm, Quests, TL).
- Durchgang 4: **Save-Break** — Schlüssel jetzt `endzeitspiel_prototype_v2`, `endzeitspiel_prototype_v1` wird beim Start gelöscht. „Charakter zurücksetzen“ (Status/Übersicht) löscht den Stand nach Rückfrage und startet einen neuen Standard-Charakter.
- Durchgang 5: **kein Save-Break**, Schlüssel bleibt v2. Nur neue Felder (Bauauftrag, Zähler bep/sep/dep, Fallen, Funk, Biolevel); `migrateState` ergänzt sie und benennt „Diamantdetektor“ in „Diamantendetektor“ um.
- Durchgang 6: **Save-Break** — Schlüssel `endzeitspiel_prototype_v3`, v1 und v2 werden beim Start gelöscht. Zurücksetzen funktioniert unverändert.
- PWA: kein Save-Break, Schlüssel bleibt v3.

---

## Durchgang 9 (18.10.2026)
- Nahrung/Wasser sind der Vorrat (inv.Nahrung/inv.Wasser = Bedarf), automatisch verbraucht, kein „Essen und Trinken“ mehr; Warnung ab ≤ 20. Migration alter Stände ×8 je Stück (Schlüssel v3, nichts gelöscht).
- Neuer Menüpunkt Aktionen → Nahrungssuche: Sammeln je Gelände (Wald/Oase viel, Wüste/Ruinen wenig), Beifunde, Angriffe, Jagd auf Wilden Hund, Wildschwein, Echse, Ratte; „Was dieses Feld bietet“, Verlauf 20.
- Wilder Hund 14–22 Nahrung je Sieg (vorher Ø ≈ 8). Details: NOTES-pass9.md. sw ezs-pwa-8, ?v=14.
- Hotfix 9.1: Nachholen nach Abwesenheit höchstens 30 Minuten; dadurch gestorbene Stände werden beim Laden wiederbelebt; tote Stände mit Fortschritt werden nie still ersetzt (Todesfenster mit Wiederbeleben/Neu). sw ezs-pwa-9, ?v=15.

## Feedback erwünscht

Balance (Needs/Kampf/TL), fehlende Wiki-Schritte, UX der Hilfe/Karte. Bugs bitte mit ungefährem Ablauf + Browser nennen.

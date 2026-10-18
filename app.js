/**
 * Endzeitspiel — Single-Player Prototyp
 * Wiki wo belegt; Needs/AG/Kampf/Quest-Belohnungen/TL-Unlock als DESIGN (../../DESIGN.md)
 */
(function () {
  "use strict";

  const STORAGE_KEY = "endzeitspiel_prototype_v3"; // Durchgang 6: neuer Schlüssel → frischer Standard-Charakter (Wunsch des Spielers)
  const LEGACY_STORAGE_KEYS = ["endzeitspiel_prototype_v1", "endzeitspiel_prototype_v2"]; // alte Stände werden beim Start ignoriert und entfernt
  const HELP_DISMISS_KEY = "endzeitspiel_help_dismissed_v1";
  const ATTRS = [
    "Ausdauer", "Ausstrahlung", "Dynamik", "Geschwindigkeit",
    "Intelligenz", "Kraft", "Wahrnehmung"
  ];

  const JOBS_TL0 = ["Holzsammler", "Geologe", "Metallbauer", "Kunststoffsammler"];
  const JOBS_TL1 = ["Sandsucher", "Chemiker", "Waffentechniker", "Ölwerker", "Gaswerker"];
  const JOBS_TL2 = ["Spion", "Erzsammler"];
  const JOBS_TL3 = ["Werkzeugmacher", "Glasschmelzer"];
  const JOBS_TL4 = ["Forscher", "Uransammler", "Tierfänger"];
  const JOBS_TL5 = ["Pilzsammler", "Mechaniker", "Gärtner"];
  const JOBS_TL6 = ["Schneider", "Diamantsucher"];
  const JOBS_TL7 = ["Öl-Techniker", "Gas-Techniker"];
  const JOBS_TL8 = ["Erfinder", "Psioniker"];
  const JOBS_TL9 = ["Biologe", "Artefaktjuwelier"];

  const ICONS = {
    Holz: "assets/rohstoffe/holz.gif",
    Stein: "assets/rohstoffe/stein.gif",
    Metall: "assets/rohstoffe/metall.gif",
    Kunststoff: "assets/rohstoffe/kunststoff.gif",
    Wasser: "assets/rohstoffe/wasser.gif",
    Nahrung: "assets/rohstoffe/nahrung.gif",
    Holzkohle: "assets/rohstoffe/oel.gif",
    Sand: "assets/rohstoffe/sand.gif",
    Kronkorken: "assets/rohstoffe/kronkorken.gif",
    Knochen: "assets/rohstoffe/erz.gif",
    Stock: "assets/rohstoffe/holz.gif",
    "Stock mit Stein": "assets/rohstoffe/stein.gif",
    Messer: "assets/rohstoffe/metall.gif",
    Holzspeer: "assets/rohstoffe/holz.gif",
    Öl: "assets/rohstoffe/oel.gif",
    Gas: "assets/rohstoffe/gas.gif",
    Benzin: "assets/rohstoffe/benzin.gif",
    Heiltrank: "assets/rohstoffe/nahrungskonzentrat.gif",
    Eimer: "assets/rohstoffe/metall.gif",
    Erz: "assets/rohstoffe/erz.gif",
    Kristall: "assets/rohstoffe/kristall.gif",
    Spitzhacke: "assets/rohstoffe/erz.gif",
    Blumen: "assets/rohstoffe/nahrung.gif",
    Schriftrolle: "assets/rohstoffe/kronkorken.gif",
    Greifer: "assets/rohstoffe/metall.gif",
    Fernglas: "assets/rohstoffe/kristall.gif",
    Glas: "assets/rohstoffe/sand.gif", // kein glas.gif — Sand-Icon als Platzhalter
    Edelmetall: "assets/rohstoffe/edelmetall.gif",
    Railgun: "assets/rohstoffe/uran.gif",
    "Maske der List": "assets/rohstoffe/kristall.gif",
    Papierentchen: "assets/rohstoffe/holz.gif",
    Schaufel: "assets/rohstoffe/stein.gif",
    Ölbehälter: "assets/rohstoffe/oel.gif",
    Gasbehälter: "assets/rohstoffe/gas.gif",
    Natururan: "assets/rohstoffe/uran.gif",
    YellowCake: "assets/rohstoffe/uran_2018.gif",
    Uranhexfluorid: "assets/rohstoffe/uran.gif",
    Uranoxid: "assets/rohstoffe/uran_2018.gif",
    Wurfnetz: "assets/rohstoffe/kunststoff.gif",
    Fell: "assets/rohstoffe/nahrung.gif",
    Forschungspunkt: "assets/rohstoffe/kristall.gif",
    Urandetektor: "assets/rohstoffe/uran.gif",
    Hund: "assets/gfx/animals/hund.gif",
    Esel: "assets/gfx/animals/esel.gif",
    Pferd: "assets/gfx/animals/pferd.gif",
    Pilze: "assets/rohstoffe/sirup.png",
    Kräuter: "assets/rohstoffe/nahrung.gif",
    Werkzeugkoffer: "assets/rohstoffe/metall.gif",
    Motorrad: "assets/gfx/vehicles/fahr1.gif",
    Hoverbike: "assets/gfx/vehicles/fahr2.gif",
    "Diamant (weiß)": "assets/rohstoffe/diamantweiss.gif",
    "Diamant (blau)": "assets/rohstoffe/diamantblau.gif",
    "Diamant (grün)": "assets/rohstoffe/diamantgruen.gif",
    "Diamant (rot)": "assets/rohstoffe/diamantrot.gif",
    Diamantendetektor: "assets/rohstoffe/diamantweiss.gif",
    Schere: "assets/rohstoffe/metall.gif",
    Sandalen: "assets/rohstoffe/sand.gif",
    Fellhemd: "assets/rohstoffe/nahrung.gif",
    "Mobiler Tiefenbohrer": "assets/rohstoffe/erz.gif",
    "Ölturm-Kit": "assets/rohstoffe/oel.gif",
    "Gasturm-Kit": "assets/rohstoffe/gas.gif",
    Erfindung: "assets/rohstoffe/kristall.gif",
    "PSI-Fokus": "assets/rohstoffe/diamantblau.gif",
    "Bio-Serum": "assets/rohstoffe/nahrungskonzentrat.gif",
    Antivirus: "assets/rohstoffe/wasser.gif",
    Artefakt: "assets/rohstoffe/diamantweiss.gif",
    Lichtartefakt: "assets/rohstoffe/diamantweiss.gif",
    Schattenartefakt: "assets/rohstoffe/diamantblau.gif",
    "Kelch des Lichts": "assets/rohstoffe/gold.gif",
    "Pokal des Verderbens": "assets/rohstoffe/uran.gif",
  };

  /** Waffen → KP-Bonus DESIGN: ca. Wiki-Stärke × 4 */
  const WEAPONS = {
    Stock: { kp: 8, dmg: 1, strength: 2 },
    "Stock mit Stein": { kp: 16, dmg: 2, strength: 4 },
    Messer: { kp: 32, dmg: 3, strength: 8 },
    Holzspeer: { kp: 64, dmg: 4, strength: 16 },
    Greifer: { kp: 40, dmg: 3, strength: 20 }, // DESIGN (Wiki 300 Str. zu stark)
    Railgun: { kp: 90, dmg: 6, strength: 50 }, // DESIGN — starkes Endgame-MVP
  };

  /**
   * Fahrzeuge — GFX aus Archiv; Tempo/Verbrauch DESIGN.
   * Wiki nennt Benzin-Pflicht und hohe Baukosten (hier stark reduziert).
   */
  const VEHICLES = {
    Motorrad: {
      name: "2-Rad-Motorrad",
      img: "assets/gfx/vehicles/fahr1.gif",
      speedFactor: 0.45, // Reisezeit-Multiplikator DESIGN
      needsCost: 0, // Nahrung/Wasser pro Reise DESIGN
      fuelPerTrip: 1, // Benzin DESIGN
      kpBonus: 5, // DESIGN (Wiki KP viel höher)
      minEP: 100, // Wiki 500 — DESIGN gelockert
    },
    Hoverbike: {
      name: "Hoverbike",
      img: "assets/gfx/vehicles/fahr2.gif",
      speedFactor: 0.35,
      needsCost: 0,
      fuelPerTrip: 2,
      kpBonus: 12,
      minEP: 200, // Wiki 1200 — DESIGN gelockert
    },
  };

  /** Kleidung — Wiki Sandalen/Fellhemd; Boni DESIGN (Wahrnehmung/KP) */
  const CLOTHING = {
    Sandalen: { kp: 2, wahrBonus: 1, strength: 3 },
    Fellhemd: { kp: 5, wahrBonus: 2, strength: 5 },
  };

  /**
   * Stamm / Dorf-Light — SP-Ersatz für Multiplayer-Stämme.
   * 25 EP Beitritt/Gründung: Wiki. Gründungskosten & NPC: DESIGN.
   * Stammlager-Kapazität stark skaliert (Wiki Stufe0=50k → Prototyp 200+).
   */
  const STAMM_FOUND_COST = { Holz: 50, Stein: 30, Metall: 20, gold: 100 }; // DESIGN
  const STAMM_LAGER_BASE = 200; // DESIGN units total
  const STAMM_LAGER_PER_LEVEL = 100;
  const STAMM_UPGRADE_COST = { Holz: 40, Stein: 30, Metall: 20, gold: 50 }; // DESIGN (Wiki 2000/1500/500)
  const STAMM_WALL_COST = { Stein: 40, Metall: 25, gold: 40 }; // DESIGN (Wiki per Mitglied)
  const STAMM_NPC_TEMPLATES = [
    { id: "npc_ash", name: "Ash", flavor: "Holzsammler-Veteran" },
    { id: "npc_rex", name: "Rex", flavor: "Wachposten" },
    { id: "npc_lira", name: "Lira", flavor: "Versorgerin" },
  ];
  const STAMM_ASSIGNMENTS = [
    { id: "none", label: "— untätig —" },
    { id: "holz", label: "Holz sammeln", item: "Holz" },
    { id: "stein", label: "Stein abbauen", item: "Stein" },
    { id: "metall", label: "Metall sammeln", item: "Metall" },
    { id: "nahrung", label: "Nahrung suchen", item: "Nahrung" },
    { id: "wachen", label: "Wache (Wall-Bonus)" },
  ];

  const ENEMIES = {
    wild_dog: {
      id: "wild_dog",
      name: "Wilder Hund",
      img: "assets/gfx/animals/hund.gif",
      kp: 14, hp: 10, roundsMax: 5,
      reward: { ep: 2, cp: 1, kep: 2 },
      food: [14, 22], animal: true, // Durchgang 9 (DESIGN): Fleisch immer, vorher 50 % × 1–3 Stück (≈ 8 Bedarf)
      loot: [
        { item: "Knochen", n: [1, 2], w: 60 },
        { item: "Kronkorken", n: [1, 2], w: 20 },
      ],
    },
    scavenger: {
      id: "scavenger",
      name: "Mutierter Plünderer",
      img: "assets/gfx/animals/pluenderer.png", // Durchgang 8: DESIGN-Bild statt Esel
      kp: 22, hp: 14, roundsMax: 6,
      reward: { ep: 3, cp: 2, kep: 2 },
      loot: [
        { item: "Metall", n: [1, 3], w: 40 },
        { item: "Kronkorken", n: [2, 4], w: 35 },
      ],
      food: [4, 8], // Durchgang 9 (DESIGN): Vorräte des Plünderers
    },
    raider: {
      id: "raider",
      name: "Marodeur",
      img: "assets/gfx/animals/marodeur.png", // Durchgang 8: DESIGN-Bild statt Pferd
      kp: 30, hp: 18, roundsMax: 7,
      reward: { ep: 4, cp: 2, kep: 3 },
      loot: [
        { item: "Metall", n: [2, 5], w: 35 },
        { item: "Kronkorken", n: [2, 5], w: 30 },
        { item: "Kunststoff", n: [1, 3], w: 15 },
      ],
      food: [6, 12], // Durchgang 9 (DESIGN)
    },
    rival_scout: {
      id: "rival_scout",
      name: "Rivalen-Späher",
      img: "assets/gfx/buildings/mutantenwall2.jpg",
      kp: 28, hp: 16, roundsMax: 6,
      reward: { ep: 5, cp: 3, kep: 3 },
      loot: [
        { item: "Metall", n: [2, 4], w: 30 },
        { item: "Holz", n: [3, 6], w: 30 },
        { item: "Kronkorken", n: [2, 5], w: 25 },
      ],
      food: [6, 12], // Durchgang 9 (DESIGN)
    },
  };

  /**
   * Orte: Anfänger-/Quest-/Händlerhöhlen-Koordinaten = WIKI.
   * Ruinencamp, Ressourcenfelder ohne Wiki-Coords = DESIGN.
   */
  const LOCATIONS = [
    { id: "camp", name: "Ruinencamp", x: 50, y: 100, tags: ["Start", "Händler", "Quest"], actions: ["rest"], trade: true, enemies: [] },
    { id: "wald", name: "Waldstück", x: 70, y: 90, tags: ["Holz", "Gefahr"], actions: ["holz"], enemies: ["wild_dog"] },
    { id: "bruch", name: "Steinbruch", x: 85, y: 110, tags: ["Stein"], actions: ["stein"], enemies: [] },
    { id: "schrott", name: "Schrottfeld", x: 60, y: 120, tags: ["Metall", "Kunststoff", "Gefahr"], actions: ["metall", "kunststoff"], enemies: ["scavenger"] },
    { id: "oase", name: "Oase", x: 40, y: 95, tags: ["Wasser"], actions: ["wasser"], enemies: ["wild_dog"] },
    { id: "sandwueste", name: "Sandwüste", x: 55, y: 130, tags: ["Sand", "TL1"], actions: ["sand"], enemies: [], design: true },
    { id: "oelfeld", name: "Ölfeld", x: 80, y: 140, tags: ["Öl", "TL1", "TL7"], actions: ["oel", "bohre_oel"], enemies: ["scavenger"], design: true },
    { id: "gasfeld", name: "Gasfeld", x: 120, y: 80, tags: ["Gas", "TL1", "TL7"], actions: ["gas", "bohre_gas"], enemies: [], design: true },
    // Anfängerhöhlen WIKI
    { id: "cave_w", name: "Anfängerhöhle West", x: 25, y: 118, tags: ["Höhle", "Anfänger"], actions: ["cave"], caveKey: "West", enemies: ["raider"], enemiesAfterCave: true },
    { id: "cave_n", name: "Anfängerhöhle Nord", x: 101, y: 10, tags: ["Höhle", "Anfänger"], actions: ["cave"], caveKey: "Nord", enemies: ["raider"], enemiesAfterCave: true },
    { id: "cave_e", name: "Anfängerhöhle Ost", x: 192, y: 103, tags: ["Höhle", "Anfänger"], actions: ["cave"], caveKey: "Ost", enemies: ["raider"], enemiesAfterCave: true },
    { id: "cave_s", name: "Anfängerhöhle Süd", x: 99, y: 191, tags: ["Höhle", "Anfänger"], actions: ["cave"], caveKey: "Süd", enemies: ["raider"], enemiesAfterCave: true },
    // Questhöhlen WIKI
    { id: "licht", name: "Lichthöhle", x: 195, y: 4, tags: ["Höhle", "Quest", "Karma"], actions: ["visit", "kelch_holen"], visitKey: "licht", enemies: [] },
    { id: "schatten", name: "Schattenhöhle", x: 198, y: 8, tags: ["Höhle", "Quest", "Karma"], actions: ["visit", "pokal_holen"], visitKey: "schatten", enemies: ["raider"] },
    { id: "chemiker_cave", name: "Chemikerhöhle", x: 197, y: 13, tags: ["Höhle", "Quest"], actions: ["visit"], visitKey: "chemiker", enemies: [] },
    { id: "blumen", name: "Blumenhöhle", x: 159, y: 69, tags: ["Höhle", "Greifer"], actions: ["visit", "pick_flowers"], visitKey: "blumen", enemies: ["wild_dog"] },
    { id: "trauung", name: "Mutantentrauung", x: 99, y: 135, tags: ["Höhle", "Greifer"], actions: ["visit", "give_flowers"], visitKey: "trauung", enemies: [] },
    { id: "krieger_greifer", name: "Kriegerhöhle (Greifer)", x: 200, y: 105, tags: ["Höhle", "Greifer"], actions: ["visit", "greifer_train"], visitKey: "krieger_greifer", enemies: ["raider"] },
    { id: "werkzeug", name: "Werkzeugmacher-Höhle", x: 2, y: 3, tags: ["Höhle", "Greifer"], actions: ["visit", "clear_cave", "buy_greifer"], visitKey: "werkzeug", enemies: [] },
    { id: "ring", name: "Ringhöhle", x: 170, y: 94, tags: ["Höhle", "Quest"], actions: ["visit"], visitKey: "ring", enemies: ["scavenger"] },
    { id: "forscher", name: "Forscherhöhle", x: 104, y: 139, tags: ["Höhle", "TL4"], actions: ["visit", "forschen"], visitKey: "forscher", enemies: [] },
    { id: "mechaniker", name: "Mechanikerhöhle", x: 50, y: 180, tags: ["Höhle", "TL5"], actions: ["visit", "repair_vehicle"], visitKey: "mechaniker", enemies: ["scavenger"] },
    { id: "erzfeld", name: "Erzader", x: 95, y: 125, tags: ["Erz", "Kristall", "TL2"], actions: ["erz"], enemies: ["scavenger"], design: true },
    { id: "edelmetallfeld", name: "Edelmetall-Schacht", x: 130, y: 150, tags: ["Edelmetall", "TL3"], actions: ["edelmetall"], enemies: ["raider"], design: true },
    { id: "glasschmelze", name: "Glasschmelze", x: 75, y: 75, tags: ["Glas", "TL3"], actions: ["visit"], visitKey: "glasschmelze", enemies: [], design: true },
    { id: "uranfeld", name: "Uranfeld", x: 145, y: 55, tags: ["Uran", "TL4"], actions: ["uran"], enemies: ["raider"], design: true },
    { id: "tiergebiet", name: "Tiergebiet", x: 88, y: 88, tags: ["Tiere", "TL4", "TL8"], actions: ["fang_hund", "fang_esel", "fang_pferd", "psi_tier"], enemies: ["wild_dog"], design: true },
    { id: "pilzhain", name: "Pilzhain", x: 62, y: 108, tags: ["Pilze", "TL5"], actions: ["pilze"], enemies: ["wild_dog"], design: true },
    { id: "kraeuterfeld", name: "Kräuterfeld", x: 48, y: 112, tags: ["Kräuter", "TL5"], actions: ["kraeuter"], enemies: [], design: true },
    { id: "diamantfeld", name: "Diamantfeld", x: 160, y: 40, tags: ["Diamanten", "TL6"], actions: ["diamanten"], enemies: ["raider"], design: true },
    { id: "rival_camp", name: "Rivalenlager", x: 110, y: 110, tags: ["Stamm", "Gefahr"], actions: ["stammkampf"], enemies: ["rival_scout"], design: true },
    { id: "biolabor", name: "Biolabor-Ruine", x: 135, y: 95, tags: ["Bio", "TL9"], actions: ["visit", "bio_forschen"], enemies: ["scavenger"], design: true },
    // Railgun-Kette WIKI
    { id: "masken", name: "Maskenhöhle", x: 30, y: 19, tags: ["Höhle", "Railgun"], actions: ["visit", "clear_masken", "extract_mask"], visitKey: "masken", enemies: [] },
    { id: "maedchen1", name: "Mädchenhöhle (Blumen)", x: 115, y: 101, tags: ["Höhle", "Railgun"], actions: ["visit", "give_flowers_girl"], visitKey: "maedchen1", enemies: [] },
    { id: "krieger_rail_train", name: "Kriegerhöhle (Railgun-Kurs)", x: 110, y: 30, tags: ["Höhle", "Railgun"], actions: ["visit", "railgun_train"], visitKey: "krieger_rail_train", enemies: ["raider"] },
    { id: "maedchen2", name: "Mädchenhöhle (Ente)", x: 20, y: 120, tags: ["Höhle", "Railgun"], actions: ["visit", "give_duck"], visitKey: "maedchen2", enemies: [] },
    { id: "krieger_rail_buy", name: "Kriegerhöhle (Railgun-Kauf)", x: 81, y: 150, tags: ["Höhle", "Railgun"], actions: ["visit", "buy_railgun"], visitKey: "krieger_rail_buy", enemies: ["raider"] },
    // Händler WIKI
    { id: "haendler", name: "Händlerhöhle", x: 170, y: 157, tags: ["Höhle", "Händler"], actions: ["visit"], visitKey: "haendler", trade: true, enemies: [] },
    { id: "haendler2", name: "Händlerhöhle Nordost", x: 190, y: 111, tags: ["Höhle", "Händler"], actions: ["visit"], visitKey: "haendler2", trade: true, enemies: [] },
  ];
  // WIKI Höhlenliste: Koordinate schon vorhanden → nicht doppeln.
  if (window.EZS_WIKI && EZS_WIKI.places) {
    EZS_WIKI.places.forEach((p) => {
      if (LOCATIONS.some((l) => l.x === p.x && l.y === p.y)) return;
      LOCATIONS.push({
        id: p.id, name: p.name, x: p.x, y: p.y,
        tags: p.tags || ["Höhle", "Wiki"], actions: ["visit"], enemies: [],
      });
    });
  }

  const ACTIONS = {
    holz: {
      label: "Holz sammeln", icon: "Holz", duration: 4000, needJob: "Holzsammler", softJob: true,
      run(state) {
        const n = rand(6, 14);
        addInv(state, "Holz", n);
        let msg = `Du hast ${n} Holz gesammelt.`;
        if (Math.random() < 0.15) { addInv(state, "Holzkohle", 1); msg += " Du findest Holzkohle!"; }
        gain(state, 1, 1);
        return { ok: true, msg };
      },
    },
    stein: {
      label: "Stein abbauen", icon: "Stein", duration: 4000, needJob: "Geologe", softJob: true,
      run(state) {
        const n = rand(5, 12); addInv(state, "Stein", n); gain(state, 1, 1);
        let extra = "";
        if (state.job === "Geologe") { // WIKI: Geologe kann Schwefel und Kalisalpeter finden; Chancen DESIGN
          if (Math.random() < 0.12) { addInv(state, "Schwefel", 1); extra += " Schwefel gefunden!"; }
          if (Math.random() < 0.1) { addInv(state, "Kalisalpeter", 1); extra += " Kalisalpeter gefunden!"; }
        }
        return { ok: true, msg: `Du brichst ${n} Stein heraus.` + extra };
      },
    },
    metall: {
      label: "Metall sammeln", icon: "Metall", duration: 4000, needJob: "Metallbauer", softJob: true,
      run(state) {
        const n = rand(4, 10); addInv(state, "Metall", n); gain(state, 1, 1);
        return { ok: true, msg: `Du findest ${n} Metall.` };
      },
    },
    kunststoff: {
      label: "Kunststoff sammeln", icon: "Kunststoff", duration: 4000, needJob: "Kunststoffsammler", softJob: true,
      run(state) {
        const n = rand(4, 10); addInv(state, "Kunststoff", n); gain(state, 1, 1);
        return { ok: true, msg: `Du findest ${n} Kunststoff.` };
      },
    },
    wasser: {
      label: "Wasser suchen", icon: "Wasser", duration: 3000,
      run(state) {
        const n = rand(12, 30); addInv(state, "Wasser", n); // Durchgang 9: Einheiten = Vorrat (vorher 3–8 Stück à 8) gain(state, 1, 0);
        return { ok: true, msg: `Du schöpfst ${n} Wasser.` };
      },
    },
    sand: {
      label: "Sand abbauen", icon: "Sand", duration: 4000, needJob: "Sandsucher", needTL: 1,
      run(state) {
        // Wiki: Eimer garantiert min. 4 — DESIGN: ohne Eimer 3–10, mit Eimer max(4, …)
        let n = rand(3, 10);
        if ((state.inv.Eimer || 0) > 0) n = Math.max(4, n);
        addInv(state, "Sand", n); gain(state, 1, 1);
        return { ok: true, msg: `Du förderst ${n} Sand.` };
      },
    },
    oel: {
      label: "Öl fördern", icon: "Öl", duration: 4500, needJob: "Ölwerker", needTL: 1,
      run(state) {
        let n = rand(2, 6);
        if ((state.inv.Ölbehälter || 0) > 0) n += 2; // DESIGN Wiki-Behälter
        addInv(state, "Öl", n); gain(state, 1, 1);
        return { ok: true, msg: `Du füllst ${n} Öl ab.` };
      },
    },
    gas: {
      label: "Gas fördern", icon: "Gas", duration: 4500, needJob: "Gaswerker", needTL: 1,
      run(state) {
        let n = rand(2, 6);
        if ((state.inv.Gasbehälter || 0) > 0) n += 2;
        addInv(state, "Gas", n); gain(state, 1, 1);
        return { ok: true, msg: `Du füllst ${n} Gas ab.` };
      },
    },
    graben: {
      label: "Graben", icon: "Sand", duration: 5000,
      run(state) {
        let wahr = state.attrs.Wahrnehmung || 1;
        const cloth = bestClothing(state);
        if (cloth) wahr += cloth.wahrBonus || 0; // Wiki: Kleiderbonus Wahrnehmung
        let chance = Math.min(0.55, 0.15 + wahr * 0.04);
        if ((state.inv.Schaufel || 0) > 0) chance = Math.min(0.75, chance + 0.15); // DESIGN
        gain(state, 1, 0);
        if (Math.random() > chance) return { ok: true, msg: "Du gräbst… nichts Brauchbares." };
        const loot = weighted([
          { item: "Sand", n: rand(2, 6), w: 40 },
          { item: "Kronkorken", n: rand(1, 3), w: 30 },
          { item: "Knochen", n: 1, w: 20 },
          { item: "Metall", n: 1, w: 10 },
          { item: "Edelmetall", n: 1, w: 5 },
        ]);
        let n = loot.n;
        if ((state.inv.Schaufel || 0) > 0) n += 1;
        addInv(state, loot.item, n);
        return { ok: true, msg: `Beim Graben: ${n}× ${loot.item}.` };
      },
    },
    cave: {
      label: "Höhle erkunden (Bonus)", icon: "Nahrung", duration: 500,
      run(state, loc) {
        const key = loc.caveKey;
        if (state.cavesVisited[key]) {
          return { ok: false, msg: `Anfängerhöhle ${key}: Bonus bereits geholt.` };
        }
        state.cavesVisited[key] = true;
        state.ep += 75; state.cp += 75;
        markVisit(state, "cave_" + key.toLowerCase());
        return { ok: true, msg: `Anfängerhöhle ${key}: +75 EP und +75 CP! (Wiki)` };
      },
    },
    visit: {
      label: "Höhle betreten", icon: "Nahrung", duration: 1500,
      run(state, loc) {
        markVisit(state, loc.visitKey || loc.id);
        gain(state, 1, 0);
        return { ok: true, msg: `Du betrittst ${loc.name} (${loc.x}/${loc.y}).` };
      },
    },
    erz: {
      label: "Erz/Kristall abbauen", icon: "Erz", duration: 4500, needJob: "Erzsammler", needTL: 2,
      run(state) {
        // Wiki: Spitzhacke nötig — DESIGN: ohne Spitzhacke halber Ertrag
        const hasPick = (state.inv.Spitzhacke || 0) > 0;
        let n = rand(3, 8);
        if (!hasPick) n = Math.max(1, Math.floor(n / 2));
        addInv(state, "Erz", n);
        let msg = `Du baust ${n} Erz ab` + (hasPick ? "." : " (ohne Spitzhacke, wenig Ertrag).");
        if (Math.random() < 0.25) {
          const k = rand(1, 3);
          addInv(state, "Kristall", k);
          msg += ` +${k} Kristall!`;
        }
        gain(state, 2, 1);
        return { ok: true, msg };
      },
    },
    spy: {
      label: "Gelände ausspähen", icon: "Kristall", duration: 3500, needJob: "Spion", needTL: 2,
      run(state) {
        // Wiki: Spion braucht Fernglas — DESIGN: ohne schlechtere Chance
        const glass = (state.inv.Fernglas || 0) > 0;
        const chance = glass ? 0.75 : 0.4;
        gain(state, 1, 1);
        if (Math.random() > chance) {
          return { ok: true, msg: "Du späht… nichts Auffälliges." };
        }
        const loot = weighted([
          { item: "Kronkorken", n: rand(1, 4), w: 40 },
          { item: "Metall", n: rand(1, 3), w: 25 },
          { item: "Nahrung", n: rand(5, 10), w: 20 },
          { item: "Schriftrolle", n: 1, w: 5 },
          { item: "Goldnugget", n: 1, w: 10 },
        ]);
        if (loot.item === "Goldnugget") {
          const g = rand(3, 8);
          state.gold += g;
          return { ok: true, msg: `Spionage: du findest ${g} Gold.` };
        }
        addInv(state, loot.item, loot.n);
        return { ok: true, msg: `Spionage: ${loot.n}× ${loot.item}.` };
      },
    },
    pick_flowers: {
      label: "Blumen pflücken (Greifer)", icon: "Nahrung", duration: 2000,
      run(state) {
        if ((state.inv.Blumen || 0) > 0) return { ok: false, msg: "Du hast schon Blumen." };
        addInv(state, "Blumen", 1);
        setChain(state, "greifer", Math.max(chainStep(state, "greifer"), 1));
        return { ok: true, msg: "Du pflückst seltene Blumen (Greifer-Quest, Wiki: Blumenhöhle)." };
      },
    },
    give_flowers: {
      label: "Blumen übergeben (Greifer)", icon: "Nahrung", duration: 1500,
      run(state) {
        if ((state.inv.Blumen || 0) < 1) return { ok: false, msg: "Du brauchst Blumen aus der Blumenhöhle." };
        takeInv(state, "Blumen", 1);
        addInv(state, "Schriftrolle", 1);
        state.flags = state.flags || {};
        state.flags.greifer_password = true;
        setChain(state, "greifer", Math.max(chainStep(state, "greifer"), 2));
        return { ok: true, msg: "Bräutigam nimmt die Blumen. Kennwort notiert; du erhältst eine Schriftrolle. Kriegerhöhle (200/105)!" };
      },
    },
    greifer_train: {
      label: "Greifer-Einweisung", icon: "Metall", duration: 2500,
      run(state) {
        if (!state.flags || !state.flags.greifer_password) {
          return { ok: false, msg: "Ohne Kennwort von der Trauung kommst du nicht weiter." };
        }
        if (state.flags.greifer_trained) return { ok: false, msg: "Einweisung bereits erledigt." };
        if ((state.inv.Kronkorken || 0) < 15) return { ok: false, msg: "Krieger verlangt 15 Kronkorken (Wiki)." };
        if ((state.inv.Schriftrolle || 0) < 1) return { ok: false, msg: "Krieger verlangt die Schriftrolle (Wiki)." };
        takeInv(state, "Kronkorken", 15);
        takeInv(state, "Schriftrolle", 1);
        state.flags.greifer_trained = true;
        setChain(state, "greifer", Math.max(chainStep(state, "greifer"), 3));
        gain(state, 10, 5);
        return { ok: true, msg: "Greifer-Einweisung abgeschlossen (−15 Kronkorken, Schriftrolle). Weiter zur Werkzeugmacher-Höhle (2/3)!" };
      },
    },
    clear_cave: {
      label: "Verschüttung freiräumen", icon: "Stein", duration: 4000,
      run(state) {
        state.flags = state.flags || {};
        if (state.flags.werkzeug_cleared) return { ok: false, msg: "Der Weg ist schon frei." };
        state.flags.werkzeug_cleared = true;
        gain(state, 2, 1);
        return { ok: true, msg: "Du räumst die Werkzeugmacher-Höhle frei (Wiki)." };
      },
    },
    buy_greifer: {
      label: "Greifer kaufen", icon: "Metall", duration: 2000,
      run(state) {
        state.flags = state.flags || {};
        if (!state.flags.werkzeug_cleared) return { ok: false, msg: "Erst den Weg freiräumen." };
        if (!state.flags.greifer_trained) return { ok: false, msg: "Ohne Greifer-Einweisung verkauft er nichts." };
        if ((state.inv.Greifer || 0) > 0) return { ok: false, msg: "Du hast schon einen Greifer." };
        // Wiki: 5 Kronkorken + 100 Erz — DESIGN: 5 Kronkorken + 25 Erz (Prototype-Tempo)
        if ((state.inv.Kronkorken || 0) < 5) return { ok: false, msg: "Braucht 5 Kronkorken (Wiki)." };
        if ((state.inv.Erz || 0) < 25) return { ok: false, msg: "Braucht 25 Erz (DESIGN; Wiki: 100)." };
        takeInv(state, "Kronkorken", 5);
        takeInv(state, "Erz", 25);
        addInv(state, "Greifer", 1);
        setChain(state, "greifer", 4);
        state.quests = state.quests || {};
        if (state.quests.greifer_chain) {
          state.quests.greifer_chain.status = "done";
          state.quests.greifer_chain.claimed = true;
        }
        gain(state, 25, 15);
        state.gold += 30;
        return { ok: true, msg: "Greifer erhalten! +25 EP/+15 CP/+30 Gold. (Erz-Kosten DESIGN 25 statt Wiki 100)" };
      },
    },
    edelmetall: {
      label: "Edelmetall schürfen", icon: "Edelmetall", duration: 5000, needTL: 2,
      run(state) {
        const n = rand(2, 6);
        addInv(state, "Edelmetall", n);
        gain(state, 2, 1);
        return { ok: true, msg: `Du schürfst ${n} Edelmetall.` };
      },
    },
    clear_masken: {
      label: "Maskenhöhle freiräumen", icon: "Stein", duration: 4000,
      run(state) {
        state.flags = state.flags || {};
        if (!(state.inv.Greifer > 0) || !state.flags.greifer_trained) {
          return { ok: false, msg: "Railgun-Quest braucht Greifer + Einweisung (Wiki)." };
        }
        if (state.flags.masken_cleared) return { ok: false, msg: "Bereits freigeräumt." };
        state.flags.masken_cleared = true;
        gain(state, 2, 1);
        setChain(state, "railgun", Math.max(chainStep(state, "railgun"), 1));
        return { ok: true, msg: "Maskenhöhle freigeräumt. Statue mit Maske sichtbar." };
      },
    },
    extract_mask: {
      label: "Maske der List lösen (Greifer)", icon: "Kristall", duration: 3000,
      run(state) {
        state.flags = state.flags || {};
        if (!state.flags.masken_cleared) return { ok: false, msg: "Erst freiräumen." };
        if (!(state.inv.Greifer > 0)) return { ok: false, msg: "Greifer muss im Inventar sein (Wiki)." };
        if ((state.inv["Maske der List"] || 0) > 0) return { ok: false, msg: "Maske schon im Besitz." };
        addInv(state, "Maske der List", 1);
        setChain(state, "railgun", Math.max(chainStep(state, "railgun"), 2));
        return { ok: true, msg: "Maske der List gelöst (Wiki). Weiter zur Mädchenhöhle (115/101)." };
      },
    },
    give_flowers_girl: {
      label: "Blumen dem Mädchen geben", icon: "Nahrung", duration: 1500,
      run(state) {
        if ((state.inv.Blumen || 0) < 1) {
          return { ok: false, msg: "Du brauchst Blumen (Blumenhöhle erneut pflücken, falls verbraucht)." };
        }
        takeInv(state, "Blumen", 1);
        state.flags = state.flags || {};
        state.flags.railgun_pw1 = true;
        setChain(state, "railgun", Math.max(chainStep(state, "railgun"), 3));
        return { ok: true, msg: "Mädchen gibt Kennwort für Kriegerhöhle (110/30)." };
      },
    },
    railgun_train: {
      label: "Railgun-Einweisung", icon: "Metall", duration: 2500,
      run(state) {
        state.flags = state.flags || {};
        if (!state.flags.railgun_pw1) return { ok: false, msg: "Ohne Kennwort (Mädchenhöhle) kein Zutritt." };
        if (state.flags.railgun_trained) return { ok: false, msg: "Einweisung bereits erledigt." };
        if ((state.inv.Kronkorken || 0) < 10) return { ok: false, msg: "Krieger will 10 Kronkorken (Wiki)." };
        if ((state.inv["Maske der List"] || 0) < 1) return { ok: false, msg: "Krieger will die Maske der List (Wiki)." };
        takeInv(state, "Kronkorken", 10);
        takeInv(state, "Maske der List", 1);
        state.flags.railgun_trained = true;
        setChain(state, "railgun", Math.max(chainStep(state, "railgun"), 4));
        gain(state, 15, 10);
        return { ok: true, msg: "Railgun-Einweisung fertig. Mädchenhöhle (20/120) für den Kaufweg!" };
      },
    },
    give_duck: {
      label: "Papierentchen schenken", icon: "Holz", duration: 1500,
      run(state) {
        if ((state.inv.Papierentchen || 0) < 1) {
          return { ok: false, msg: "Stell zuerst ein Papierentchen her (Holz, unter Herstellen)." };
        }
        takeInv(state, "Papierentchen", 1);
        state.flags = state.flags || {};
        state.flags.railgun_pw2 = true;
        setChain(state, "railgun", Math.max(chainStep(state, "railgun"), 5));
        return { ok: true, msg: "Mädchen gibt Kennwort für Kriegerhöhle (81/150)." };
      },
    },
    buy_railgun: {
      label: "Railgun kaufen", icon: "Metall", duration: 2500,
      run(state) {
        state.flags = state.flags || {};
        if (!state.flags.railgun_pw2) return { ok: false, msg: "Ohne zweites Kennwort kein Kauf." };
        if (!state.flags.railgun_trained) return { ok: false, msg: "Ohne Railgun-Einweisung kein Verkauf." };
        if ((state.inv.Railgun || 0) > 0) return { ok: false, msg: "Du hast schon eine Railgun." };
        // Wiki: 50 Kronkorken + 1000 Edelmetall — DESIGN: 50 Kronkorken + 40 Edelmetall
        if ((state.inv.Kronkorken || 0) < 50) return { ok: false, msg: "Braucht 50 Kronkorken (Wiki)." };
        if ((state.inv.Edelmetall || 0) < 40) return { ok: false, msg: "Braucht 40 Edelmetall (DESIGN; Wiki: 1000)." };
        takeInv(state, "Kronkorken", 50);
        takeInv(state, "Edelmetall", 40);
        addInv(state, "Railgun", 1);
        setChain(state, "railgun", 6);
        if (state.quests.railgun_chain) {
          state.quests.railgun_chain.status = "done";
          state.quests.railgun_chain.claimed = true;
        }
        gain(state, 40, 25);
        state.gold += 50;
        return { ok: true, msg: "Railgun erhalten! +40 EP/+25 CP/+50 Gold. KP-Bonus DESIGN +90." };
      },
    },
    uran: {
      label: "Natururan abbauen", icon: "Natururan", duration: 5000, needJob: "Uransammler", needTL: 4,
      run(state) {
        // Wiki: Urandetector + Skills — DESIGN: ohne Detektor etwas weniger
        let n = rand(2, 5);
        if ((state.inv.Urandetektor || 0) > 0) n += 2;
        addInv(state, "Natururan", n);
        gain(state, 2, 1);
        return { ok: true, msg: `Du baust ${n} Natururan ab.` };
      },
    },
    forschen: {
      label: "Forschen", icon: "Kristall", duration: 4500, needJob: "Forscher", needTL: 4,
      run(state, loc) {
        // Wiki: Forschungsgebäude / Stamm Research — DESIGN: Punkte + Chance Erfindung
        const intel = state.attrs.Intelligenz || 1;
        const pts = 1 + Math.floor(intel / 3);
        addInv(state, "Forschungspunkt", pts);
        gain(state, 2, 2);
        let msg = `Forschung: +${pts} Forschungspunkt(e).`;
        if (Math.random() < 0.2 + intel * 0.02) {
          const loot = weighted([
            { item: "Kristall", n: rand(1, 3), w: 40 },
            { item: "Edelmetall", n: rand(1, 2), w: 30 },
            { item: "YellowCake", n: 1, w: 15 },
            { item: "Glas", n: rand(1, 2), w: 15 },
          ]);
          addInv(state, loot.item, loot.n);
          msg += ` Nebenfund: ${loot.n}× ${loot.item}!`;
        }
        if (loc && loc.id === "forscher") msg += " (Forscherhöhle-Bonus-Atmosphäre)";
        return { ok: true, msg };
      },
    },
    fang_hund: {
      label: "Hund fangen", icon: "Hund", duration: 4000, needJob: "Tierfänger", needTL: 4,
      run(state) { return catchAnimal(state, "Hund", 0.45); },
    },
    fang_esel: {
      label: "Esel fangen", icon: "Esel", duration: 4500, needJob: "Tierfänger", needTL: 4,
      run(state) { return catchAnimal(state, "Esel", 0.35); },
    },
    fang_pferd: {
      label: "Pferd fangen", icon: "Pferd", duration: 5000, needJob: "Tierfänger", needTL: 4,
      run(state) { return catchAnimal(state, "Pferd", 0.25); },
    },
    pilze: {
      label: "Pilze sammeln", icon: "Pilze", duration: 4000, needJob: "Pilzsammler", needTL: 5,
      run(state) {
        // Wiki: Schaufel + Pilzhaus — DESIGN: Schaufel-Bonus, Gebäude optional
        if ((state.inv.Schaufel || 0) < 1 && !(state.buildings && state.buildings.pilzhaus)) {
          return { ok: false, msg: "Braucht Schaufel oder gebautes Pilzhaus (Wiki/DESIGN)." };
        }
        let n = rand(3, 8);
        if (state.buildings && state.buildings.pilzhaus) n += 2;
        addInv(state, "Pilze", n);
        gain(state, 2, 1);
        return { ok: true, msg: `Du sammelst ${n} Pilze.` };
      },
    },
    kraeuter: {
      label: "Kräuter ernten", icon: "Kräuter", duration: 4000, needJob: "Gärtner", needTL: 5,
      run(state) {
        if ((state.inv.Schaufel || 0) < 1 && !(state.buildings && state.buildings.kraeutergarten)) {
          return { ok: false, msg: "Braucht Schaufel oder Kräutergarten-Gebäude (Wiki/DESIGN)." };
        }
        let n = rand(3, 7);
        if (state.buildings && state.buildings.kraeutergarten) n += 2;
        addInv(state, "Kräuter", n);
        // Direktverzehr möglich — auch etwas Nahrung
        addInv(state, "Nahrung", rand(4, 8));
        gain(state, 2, 1);
        return { ok: true, msg: `Ernte: ${n} Kräuter (+ etwas Nahrung). NV-Flavor.` };
      },
    },
    repair_vehicle: {
      label: "Fahrzeug reparieren", icon: "Metall", duration: 3500, needJob: "Mechaniker", needTL: 5,
      run(state) {
        if (!state.activeVehicle) return { ok: false, msg: "Kein aktives Fahrzeug gewählt." };
        if ((state.inv.Werkzeugkoffer || 0) < 1) return { ok: false, msg: "Werkzeugkoffer nötig (Wiki)." };
        if ((state.inv.Metall || 0) < 5) return { ok: false, msg: "5 Metall für Reparatur (DESIGN)." };
        takeInv(state, "Metall", 5);
        // 20% Werkzeugkoffer verbrauchen DESIGN
        if (Math.random() < 0.2) takeInv(state, "Werkzeugkoffer", 1);
        state.flags = state.flags || {};
        state.flags.vehicle_condition = 100;
        gain(state, 2, 1);
        return { ok: true, msg: `${state.activeVehicle} repariert/gewartet. Zustand 100%.` };
      },
    },
    bohre_oel: {
      label: "Ölbohrung (Turm)", icon: "Öl", duration: 5500, needJob: "Öl-Techniker", needTL: 7,
      run(state) {
        // Wiki: Ölturm für Ölwerker — DESIGN: Kit/Flag + Bonusöl
        if ((state.inv["Mobiler Tiefenbohrer"] || 0) < 1 && !(state.flags && state.flags.oelturm)) {
          return { ok: false, msg: "Braucht Mobiler Tiefenbohrer (Erfinder) oder bestehenden Ölturm (Wiki/DESIGN)." };
        }
        state.flags = state.flags || {};
        let msg = "";
        if (!state.flags.oelturm) {
          state.flags.oelturm = true;
          msg = "Ölturm errichtet! ";
        }
        const n = rand(4, 10);
        addInv(state, "Öl", n);
        gain(state, 3, 2);
        return { ok: true, msg: msg + `Förderung: ${n} Öl.` };
      },
    },
    bohre_gas: {
      label: "Gasbohrung (Turm)", icon: "Gas", duration: 5500, needJob: "Gas-Techniker", needTL: 7,
      run(state) {
        if ((state.inv["Mobiler Tiefenbohrer"] || 0) < 1 && !(state.flags && state.flags.gasturm)) {
          return { ok: false, msg: "Braucht Mobiler Tiefenbohrer oder Gasturm (Wiki/DESIGN)." };
        }
        state.flags = state.flags || {};
        let msg = "";
        if (!state.flags.gasturm) {
          state.flags.gasturm = true;
          msg = "Gasturm errichtet! ";
        }
        const n = rand(4, 10);
        addInv(state, "Gas", n);
        gain(state, 3, 2);
        return { ok: true, msg: msg + `Förderung: ${n} Gas.` };
      },
    },
    psi_tier: {
      label: "PSI auf Tier wirken", icon: "PSI-Fokus", duration: 4000, needJob: "Psioniker", needTL: 8,
      run(state) {
        // WIKI: PSI-Tempel macht PSI-Tiere (Hund KP×2 bzw. 14×Größe, Esel Rucksack +3, Größe bis 400%).
        // DESIGN: Wahrnehmungs-Schwellen (500–900) im Prototyp nicht verlangt.
        if (!state.pet) return { ok: false, msg: "Kein Tier. Erst eines fangen oder kaufen (ab 400 EP)." };
        if (state.pet.psi) return { ok: false, msg: state.pet.name + " ist schon ein PSI-Tier." };
        state.pet.psi = true;
        gain(state, 2, 2);
        return { ok: true, msg: state.pet.name + " ist jetzt ein PSI-Tier (Wiki-Wirkung, Schwelle DESIGN gelockert)." };
      },
    },
    kelch_holen: {
      label: "Kelch des Lichts holen", icon: "Kelch des Lichts", duration: 2000,
      run(state) {
        const k = state.karma || {};
        if (!k.helleMacht || !k.helleGefestigt) {
          return { ok: false, msg: "Wiki: Helle Macht nötig (und gefestigt). Mehr friedliche AGs!" };
        }
        if ((state.inv.Lichtartefakt || 0) < 1) {
          return { ok: false, msg: "Wiki: Lichtartefakt in der Hand — stell eines unter Herstellen her." };
        }
        if (state.flags && state.flags.kelch_geholt) {
          return { ok: false, msg: "Wiki: Lichthöhle nur einmal betretbar für den Kelch." };
        }
        takeInv(state, "Lichtartefakt", 1);
        addInv(state, "Kelch des Lichts", 1);
        state.flags = state.flags || {};
        state.flags.kelch_geholt = true;
        markVisit(state, "licht");
        setChain(state, "kelch", 2);
        if (state.quests.kelch_chain) {
          state.quests.kelch_chain.status = "done";
          state.quests.kelch_chain.claimed = true;
        }
        gain(state, 20, 15);
        return { ok: true, msg: "Kelch des Lichts erhalten! (Wiki) Einmalig — Wächter warnt vor Rückkehr." };
      },
    },
    pokal_holen: {
      label: "Pokal des Verderbens holen", icon: "Pokal des Verderbens", duration: 2000,
      run(state) {
        const k = state.karma || {};
        if (!k.dunkleMacht || !k.dunkleGefestigt) {
          return { ok: false, msg: "Wiki: Dunkle Macht nötig (Kämpfen/Jagen, dann festigen)." };
        }
        if ((state.inv.Schattenartefakt || 0) < 1) {
          return { ok: false, msg: "Wiki: Schattenartefakt nötig — stell eines unter Herstellen her." };
        }
        if (state.flags && state.flags.pokal_geholt) {
          return { ok: false, msg: "Wiki: Schattenhöhle nur einmal für den Pokal." };
        }
        takeInv(state, "Schattenartefakt", 1);
        addInv(state, "Pokal des Verderbens", 1);
        state.flags = state.flags || {};
        state.flags.pokal_geholt = true;
        markVisit(state, "schatten");
        setChain(state, "pokal", 2);
        if (state.quests.pokal_chain) {
          state.quests.pokal_chain.status = "done";
          state.quests.pokal_chain.claimed = true;
        }
        gain(state, 20, 15);
        return { ok: true, msg: "Pokal des Verderbens erhalten! (Wiki)" };
      },
    },
    bio_forschen: {
      label: "Bio-Forschung", icon: "Bio-Serum", duration: 5000, needJob: "Biologe", needTL: 9,
      run(state) {
        const intel = state.attrs.Intelligenz || 1;
        gain(state, 3, 2);
        if (Math.random() < 0.35 + intel * 0.02) {
          addInv(state, "Bio-Serum", 1);
          return { ok: true, msg: "Bio-Serum synthetisiert (DESIGN; Wiki: XB-5000/M4-Flavor)." };
        }
        addInv(state, "Forschungspunkt", 2);
        return { ok: true, msg: "Laborarbeit: +2 Forschungspunkte." };
      },
    },
    diamanten: {
      label: "Diamanten abbauen", icon: "Diamant (weiß)", duration: 5000, needJob: "Diamantsucher", needTL: 6,
      run(state) {
        // Wiki: Detector + Bohrer + hohe Ausstrahlung — DESIGN: Detector-Bonus
        const aus = state.attrs.Ausstrahlung || 1;
        if (aus < 3 && (state.inv.Diamantendetektor || 0) < 1) {
          return { ok: false, msg: "Zu wenig Ausstrahlung / kein Diamantendetektor (Wiki ≈1000 Ausstr.; DESIGN gelockert)." };
        }
        let rolls = 1;
        if ((state.inv.Diamantendetektor || 0) > 0) rolls = 2;
        const colors = ["Diamant (weiß)", "Diamant (blau)", "Diamant (grün)", "Diamant (rot)"];
        const got = [];
        for (let i = 0; i < rolls; i++) {
          const c = colors[rand(0, 3)];
          const n = rand(1, 2);
          addInv(state, c, n);
          got.push(n + "× " + c);
        }
        gain(state, 3, 2);
        return { ok: true, msg: "Fund: " + got.join(", ") + "." };
      },
    },
    stammkampf: {
      label: "Stammkampf light", icon: "Metall", duration: 800,
      run(state) {
        if (!state.stamm) return { ok: false, msg: "Du brauchst einen eigenen Stamm (Tab Stamm)." };
        // Fight started separately via UI button — this AG just flavors
        return { ok: true, msg: "Die Rivalen sind in Sichtweite. Starte den Angriff über die Kampf-Aktion." };
      },
    },
    jagen_fell: {
      label: "Jagen (Fell)", icon: "Fell", duration: 4500, needJob: "Schneider", needTL: 6,
      run(state) {
        // Wiki: Schneider jagt für Fell; Schere empfohlen DESIGN
        const hasScissors = (state.inv.Schere || 0) > 0;
        let n = rand(1, 3);
        if (hasScissors) n += 1;
        if (state.buildings && state.buildings.schneiderei) n += 1;
        addInv(state, "Fell", n);
        gain(state, 2, 1);
        return { ok: true, msg: `Du erlegst Wild und gewinnst ${n} Fell.` };
      },
    },
    rest: {
      label: "Ausruhen", icon: "Nahrung", duration: 1000,
      run(state) {
        const beforeF = state.fatigue || 0;
        const beforeE = state.energy == null ? 100 : state.energy;
        state.fatigue = Math.max(0, beforeF - 15);
        state.energy = Math.min(200, beforeE + 10);
        const df = beforeF - state.fatigue;
        const de = state.energy - beforeE;
        return { ok: true, msg: "Du ruhst. Müdigkeit −" + df + ", Energie +" + de + "." };
      },
    },
  };

  const CRAFTS = [
    {
      id: "stock",
      label: "Stock fertigen",
      desc: "10 Holz → Stock (Wiki-Kosten). +8 KP. Prototyp: ohne Waffentechniker machbar.",
      cost: { Holz: 10 },
      result: { Stock: 1 },
      minTL: 0,
    },
    {
      id: "stock_stein",
      label: "Stock mit Stein",
      desc: "10 Holz + 10 Stein (Wiki). +16 KP. Wiki: Waffentechniker; Prototyp: ab Start für alle (DESIGN, Durchgang 7 – Aufgaben Kapitel 1).",
      cost: { Holz: 10, Stein: 10 },
      result: { "Stock mit Stein": 1 },
      minTL: 0, // DESIGN (Wiki: Waffentechniker, TL1) – wie der Stock für Anfänger freigegeben
    },
    {
      id: "messer",
      label: "Messer",
      desc: "10 Holz + 10 Stein + 20 Metall (Wiki). +32 KP. Waffentechniker.",
      cost: { Holz: 10, Stein: 10, Metall: 20 },
      result: { Messer: 1 },
      minTL: 1,
      needJob: "Waffentechniker",
    },
    {
      id: "holzspeer",
      label: "Holzspeer",
      desc: "100 Holz (Wiki). +64 KP. Waffentechniker.",
      cost: { Holz: 100 },
      result: { Holzspeer: 1 },
      minTL: 1,
      needJob: "Waffentechniker",
    },
    {
      id: "notverpflegung",
      label: "Notverpflegung",
      desc: "3 Holz + 2 Wasser → 10 Nahrung (DESIGN, Durchgang 9: Einheiten = Vorrat)",
      cost: { Holz: 3, Wasser: 2 },
      result: { Nahrung: 10 },
      minTL: 0,
    },
    {
      id: "holzkohle",
      label: "Holzkohle brennen",
      desc: "5 Holz → 1 Holzkohle (Wiki: Chemiker kann Holzkohle). Chemiker.",
      cost: { Holz: 5 },
      result: { Holzkohle: 1 },
      minTL: 1,
      needJob: "Chemiker",
    },
    {
      id: "heiltrank",
      label: "Heiltrank",
      desc: "2 Nahrung + 3 Wasser + 1 Holzkohle → Heiltrank (DESIGN). Chemiker.",
      cost: { Nahrung: 2, Wasser: 3, Holzkohle: 1 },
      result: { Heiltrank: 1 },
      minTL: 1,
      needJob: "Chemiker",
    },
    {
      id: "benzin",
      label: "Benzin cracken",
      desc: "3 Öl → 1 Benzin (DESIGN, angelehnt an Ölwerker/Benzincracker).",
      cost: { Öl: 3 },
      result: { Benzin: 1 },
      minTL: 1,
      needJob: "Ölwerker",
    },
    {
      id: "eimer",
      label: "Eimer (Sandbox)",
      desc: "5 Metall + 5 Kunststoff → Eimer (DESIGN-Kosten; Wiki: Eimer hilft Sand). Jeder ab TL1.",
      cost: { Metall: 5, Kunststoff: 5 },
      result: { Eimer: 1 },
      minTL: 1,
    },
    {
      id: "spitzhacke",
      label: "Spitzhacke",
      desc: "10 Holz + 15 Metall → Spitzhacke (DESIGN; Wiki: Werkzeugmacher). Hilft Erzsammler.",
      cost: { Holz: 10, Metall: 15 },
      result: { Spitzhacke: 1 },
      minTL: 2,
    },
    {
      id: "fernglas",
      label: "Fernglas",
      desc: "5 Kristall + 10 Metall → Fernglas (DESIGN). Verbessert Spion-Ausspähen (Wiki: Fernglas nötig).",
      cost: { Kristall: 5, Metall: 10 },
      result: { Fernglas: 1 },
      minTL: 2,
      needJob: "Spion",
    },
    {
      id: "papierentchen",
      label: "Papierentchen falten",
      desc: "5 Holz → Papierentchen (DESIGN; Wiki: Railgun-Quest).",
      cost: { Holz: 5 },
      result: { Papierentchen: 1 },
      minTL: 0,
    },
    {
      id: "glas",
      label: "Glas schmelzen",
      desc: "10 Sand → 3 Glas (Wiki: Glasschmelzer aus Sand). Am besten an der Glasschmelze craften.",
      cost: { Sand: 10 },
      result: { Glas: 3 },
      minTL: 3,
      needJob: "Glasschmelzer",
    },
    {
      id: "schaufel",
      label: "Schaufel",
      desc: "10 Holz + 10 Metall → Schaufel (Wiki: Werkzeugmacher). Bonus beim Graben (DESIGN).",
      cost: { Holz: 10, Metall: 10 },
      result: { Schaufel: 1 },
      minTL: 3,
      needJob: "Werkzeugmacher",
    },
    {
      id: "oelbehaelter",
      label: "Ölbehälter",
      desc: "5 Metall + 5 Glas → Ölbehälter (DESIGN angelehnt Wiki Werkzeugmacher).",
      cost: { Metall: 5, Glas: 5 },
      result: { Ölbehälter: 1 },
      minTL: 3,
      needJob: "Werkzeugmacher",
    },
    {
      id: "gasbehaelter",
      label: "Gasbehälter",
      desc: "5 Metall + 5 Glas → Gasbehälter (DESIGN).",
      cost: { Metall: 5, Glas: 5 },
      result: { Gasbehälter: 1 },
      minTL: 3,
      needJob: "Werkzeugmacher",
    },
    {
      id: "spitzhacke_wz",
      label: "Spitzhacke (Werkzeugmacher)",
      desc: "Bessere Spitzhacke: 5 Holz + 20 Metall + 2 Glas (DESIGN). Werkzeugmacher TL3.",
      cost: { Holz: 5, Metall: 20, Glas: 2 },
      result: { Spitzhacke: 1 },
      minTL: 3,
      needJob: "Werkzeugmacher",
    },
    // --- Tränke/Pillen/Pilzmixe: Kosten WIKI (Rohstoffnamen aus den Icons der Wiki-Seite) ---
    // DESIGN: Chemieküche (Wiki-Pflicht) gibt es im Prototyp nicht, daher nur Beruf + Techlevel.
    // DESIGN-Ersatz: helle/braune/rote Kräuter → Kräuter, Strahlen/Blaue/Grüne/Fliegenpilze → Pilze, Reagenzgläser → Glas.
    { id: "heil_s", label: "schwacher Heiltrank", desc: "WIKI: Energie +20%, Verletzung kürzer.", cost: { Holz: 60, Kunststoff: 30, Wasser: 40 }, result: { "schwacher Heiltrank": 1 }, minTL: 1, needJob: "Chemiker" },
    { id: "heil_st", label: "starker Heiltrank", desc: "WIKI: Energie +80%. Benutzen ab 10 Ausdauer.", cost: { Holz: 120, Kunststoff: 60, Wasser: 40 }, result: { "starker Heiltrank": 1 }, minTL: 1, needJob: "Chemiker" },
    { id: "wach_s", label: "schwacher Wachtrank", desc: "WIKI: Müdigkeit −20%.", cost: { Holz: 30, Kunststoff: 60, Wasser: 50 }, result: { "schwacher Wachtrank": 1 }, minTL: 1, needJob: "Chemiker" },
    { id: "wach_st", label: "starker Wachtrank", desc: "WIKI: Müdigkeit −80%. Benutzen ab 20 Ausdauer.", cost: { Holz: 60, Kunststoff: 120, Wasser: 50 }, result: { "starker Wachtrank": 1 }, minTL: 1, needJob: "Chemiker" },
    { id: "strahl_s", label: "schwacher Strahlentrank", desc: "WIKI: Strahlung −20%.", cost: { Kunststoff: 160, Stein: 80, Wasser: 60 }, result: { "schwacher Strahlentrank": 1 }, minTL: 1, needJob: "Chemiker" },
    { id: "strahl_st", label: "starker Strahlentrank", desc: "WIKI: Strahlung −80%. Benutzen ab 30 Ausdauer.", cost: { Kunststoff: 320, Stein: 160, Wasser: 60 }, result: { "starker Strahlentrank": 1 }, minTL: 2, needJob: "Chemiker" },
    { id: "strahlenpillen", label: "Strahlenpillen", desc: "WIKI: Strahlung −150%.", cost: { Holz: 300, Wasser: 100, Kräuter: 5 }, result: { Strahlenpillen: 1 }, minTL: 4, needJob: "Chemiker" },
    { id: "wachpillen", label: "Wachpillen", desc: "WIKI: Müdigkeit −150%.", cost: { Holz: 250, Wasser: 100, Kräuter: 5 }, result: { Wachpillen: 1 }, minTL: 4, needJob: "Chemiker" },
    { id: "kraeutermix", label: "Kräutermix", desc: "WIKI: Müdigkeit und Strahlung −10%. Kosten 1+1+1 Kräuter.", cost: { Kräuter: 3 }, result: { Kräutermix: 1 }, needJob: "Chemiker" },
    { id: "pilzmix_s", label: "Pilzmix-S", desc: "WIKI: wirkt später, Strahlung −80%, Müdigkeit +20%.", cost: { Wasser: 100, Glas: 1, Pilze: 5 }, result: { "Pilzmix-S": 1 }, minTL: 7, needJob: "Chemiker" },
    { id: "pilzmix_m", label: "Pilzmix-M", desc: "WIKI: wirkt später, Müdigkeit −80%, Strahlung +20%.", cost: { Wasser: 150, Glas: 1, Pilze: 4 }, result: { "Pilzmix-M": 1 }, minTL: 6, needJob: "Chemiker" },
    { id: "pilzmix_x", label: "Pilzmix-X", desc: "WIKI: weckt das Tier beim Füttern.", cost: { Wasser: 300, Glas: 1, Pilze: 3 }, result: { "Pilzmix-X": 1 }, minTL: 8, needJob: "Chemiker" },
    {
      id: "wurfnetz",
      label: "Wurfnetz",
      desc: "10 Kunststoff + 5 Holz → Wurfnetz (DESIGN; Wiki: Tierfänger braucht Netz).",
      cost: { Kunststoff: 10, Holz: 5 },
      result: { Wurfnetz: 1 },
      minTL: 4,
      needJob: "Tierfänger",
    },
    {
      id: "urandetektor",
      label: "Urandetektor",
      desc: "5 Kristall + 10 Metall + 2 Forschungspunkt → Urandetektor (DESIGN; Wiki: Uransammler).",
      cost: { Kristall: 5, Metall: 10, Forschungspunkt: 2 },
      result: { Urandetektor: 1 },
      minTL: 4,
      needJob: "Forscher",
    },
    {
      id: "yellowcake",
      label: "YellowCake herstellen",
      desc: "5 Natururan → 1 YellowCake (Wiki-Kette, vereinfacht). Forscher.",
      cost: { Natururan: 5 },
      result: { YellowCake: 1 },
      minTL: 4,
      needJob: "Forscher",
    },
    {
      id: "uranhex",
      label: "Uranhexfluorid",
      desc: "2 YellowCake + 1 Gas → 1 Uranhexfluorid (DESIGN-Rezept). Forscher.",
      cost: { YellowCake: 2, Gas: 1 },
      result: { Uranhexfluorid: 1 },
      minTL: 4,
      needJob: "Forscher",
    },
    {
      id: "uranoxid",
      label: "Uranoxid",
      desc: "2 Uranhexfluorid → 1 Uranoxid (DESIGN). Forscher.",
      cost: { Uranhexfluorid: 2 },
      result: { Uranoxid: 1 },
      minTL: 4,
      needJob: "Forscher",
    },
    {
      id: "erz_zu_edel",
      label: "Erz → Edelmetall",
      desc: "8 Erz → 2 Edelmetall (Wiki: Forscher in Erzverarbeitung). Forscher.",
      cost: { Erz: 8 },
      result: { Edelmetall: 2 },
      minTL: 4,
      needJob: "Forscher",
    },
    {
      id: "werkzeugkoffer",
      label: "Werkzeugkoffer",
      desc: "15 Metall + 5 Kunststoff → Werkzeugkoffer (DESIGN; Wiki: Mechaniker braucht Koffer).",
      cost: { Metall: 15, Kunststoff: 5 },
      result: { Werkzeugkoffer: 1 },
      minTL: 5,
      needJob: "Mechaniker",
    },
    {
      id: "motorrad",
      label: "2-Rad-Motorrad bauen",
      desc: "40 Metall + 20 Kunststoff + 10 Benzin + Werkzeugkoffer (DESIGN). Mechaniker + Werkstatt.",
      cost: { Metall: 40, Kunststoff: 20, Benzin: 10, Werkzeugkoffer: 1 },
      result: { Motorrad: 1 },
      minTL: 5,
      needJob: "Mechaniker",
      needBuilding: "werkstatt",
    },
    {
      id: "hoverbike",
      label: "Hoverbike bauen",
      desc: "60 Metall + 30 Kunststoff + 15 Benzin + 5 Edelmetall + Werkzeugkoffer (DESIGN). Mechaniker + Werkstatt.",
      cost: { Metall: 60, Kunststoff: 30, Benzin: 15, Edelmetall: 5, Werkzeugkoffer: 1 },
      result: { Hoverbike: 1 },
      minTL: 5,
      needJob: "Mechaniker",
      needBuilding: "werkstatt",
    },
    {
      id: "pilzmix",
      label: "Pilzmix (Snack)",
      desc: "3 Pilze → 16 Nahrung (DESIGN).",
      cost: { Pilze: 3 },
      result: { Nahrung: 16 },
      minTL: 5,
      needJob: "Chemiker",
    },
    {
      id: "kraeutertee",
      label: "Kräutertee",
      desc: "2 Kräuter + 1 Wasser → Heiltrank (DESIGN). Gärtner.",
      cost: { Kräuter: 2, Wasser: 1 },
      result: { Heiltrank: 1 },
      minTL: 5,
      needJob: "Gärtner",
    },
    {
      id: "schere",
      label: "Schere",
      desc: "5 Metall + 2 Glas → Schere (DESIGN; Wiki: Schneider braucht Schere).",
      cost: { Metall: 5, Glas: 2 },
      result: { Schere: 1 },
      minTL: 6,
      needJob: "Schneider",
      needBuilding: "schneiderei",
    },
    {
      id: "sandalen",
      label: "Sandalen",
      desc: "5 Fell → Sandalen (Wiki TL6 Schneider). +2 KP, +1 Wahrnehmung (DESIGN).",
      cost: { Fell: 5 },
      result: { Sandalen: 1 },
      minTL: 6,
      needJob: "Schneider",
      needBuilding: "schneiderei",
    },
    {
      id: "fellhemd",
      label: "Fellhemd",
      desc: "10 Fell → Fellhemd (Wiki TL6). +5 KP, +2 Wahrnehmung (DESIGN).",
      cost: { Fell: 10 },
      result: { Fellhemd: 1 },
      minTL: 6,
      needJob: "Schneider",
      needBuilding: "schneiderei",
    },
    {
      id: "diamantendetektor",
      label: "Diamantendetektor",
      desc: "3 Kristall + 2 Diamant (weiß) + 5 Metall (DESIGN; Wiki: Diamantsucher-Werkzeug).",
      cost: { Kristall: 3, "Diamant (weiß)": 2, Metall: 5 },
      result: { Diamantendetektor: 1 },
      minTL: 6,
      needJob: "Diamantsucher",
    },
    {
      id: "tiefenbohrer",
      label: "Mobiler Tiefenbohrer",
      desc: "20 Metall + 10 Erz + 5 Forschungspunkt (DESIGN; Wiki: Öl/Gas-Techniker brauchen Bohrer).",
      cost: { Metall: 20, Erz: 10, Forschungspunkt: 5 },
      result: { "Mobiler Tiefenbohrer": 1 },
      minTL: 8,
      needJob: "Erfinder",
      needBuilding: "ideenschmiede",
    },
    {
      id: "erfindung",
      label: "Erfindung tüfteln",
      desc: "5 Forschungspunkt + 10 Metall + 2 Kristall → Erfindung (DESIGN; Ideenschmiede).",
      cost: { Forschungspunkt: 5, Metall: 10, Kristall: 2 },
      result: { Erfindung: 1 },
      minTL: 8,
      needJob: "Erfinder",
      needBuilding: "ideenschmiede",
    },
    {
      id: "psi_fokus",
      label: "PSI-Fokus",
      desc: "2 Diamant (blau) + 3 Kristall (DESIGN). Psioniker + PSI-Tempel.",
      cost: { "Diamant (blau)": 2, Kristall: 3 },
      result: { "PSI-Fokus": 1 },
      minTL: 8,
      needJob: "Psioniker",
      needBuilding: "psi_tempel",
    },
    {
      id: "antivirus",
      label: "Antivirus",
      desc: "2 Bio-Serum + 5 Wasser (DESIGN; Wiki-Antivirus-Flavor). Biologe.",
      cost: { "Bio-Serum": 2, Wasser: 5 },
      result: { Antivirus: 1 },
      minTL: 9,
      needJob: "Biologe",
      needBuilding: "biolabor_geb",
    },
    {
      id: "artefakt",
      label: "Artefakt schmieden",
      desc: "1 Diamant (rot) + 5 Edelmetall + 1 Erfindung (DESIGN). Artefaktjuwelier.",
      cost: { "Diamant (rot)": 1, Edelmetall: 5, Erfindung: 1 },
      result: { Artefakt: 1 },
      minTL: 9,
      needJob: "Artefaktjuwelier",
      needBuilding: "artefaktschmiede",
    },
    {
      id: "diamant_faerben_blau",
      label: "Diamant blau färben",
      desc: "1 Diamant (weiß) + 1 Kristall → Diamant (blau) (Wiki: Artefaktjuwelier färbt Diamanten).",
      cost: { "Diamant (weiß)": 1, Kristall: 1 },
      result: { "Diamant (blau)": 1 },
      minTL: 9,
      needJob: "Artefaktjuwelier",
    },
    {
      id: "diamant_faerben_rot",
      label: "Diamant rot färben",
      desc: "1 Diamant (weiß) + 1 Edelmetall → Diamant (rot) (DESIGN).",
      cost: { "Diamant (weiß)": 1, Edelmetall: 1 },
      result: { "Diamant (rot)": 1 },
      minTL: 9,
      needJob: "Artefaktjuwelier",
    },
    {
      id: "lichtartefakt",
      label: "Lichtartefakt",
      desc: "3 Kristall + 1 Diamant (weiß) + 5 Gold (DESIGN; Wiki: für Lichthöhle).",
      cost: { Kristall: 3, "Diamant (weiß)": 1 },
      result: { Lichtartefakt: 1 },
      minTL: 0,
      goldCost: 5,
    },
    {
      id: "schattenartefakt",
      label: "Schattenartefakt",
      desc: "3 Kristall + 1 Diamant (blau) + 5 Gold (DESIGN; Wiki: für Schattenhöhle).",
      cost: { Kristall: 3, "Diamant (blau)": 1 },
      result: { Schattenartefakt: 1 },
      minTL: 0,
      goldCost: 5,
    },
  ];

  const TRADE = [
    { item: "Holz", buy: 1, sell: 1 },
    { item: "Stein", buy: 1, sell: 1 },
    { item: "Metall", buy: 2, sell: 1 },
    { item: "Kunststoff", buy: 2, sell: 1 },
    { item: "Sand", buy: 1, sell: 1 },
    { item: "Öl", buy: 4, sell: 2 },
    { item: "Gas", buy: 4, sell: 2 },
    { item: "Wasser", buy: 1, sell: 0 }, // Durchgang 9 (DESIGN): 1 Gold je Vorrat-Einheit, kein Rückkauf
    { item: "Nahrung", buy: 1, sell: 0 },
    { item: "Erz", buy: 3, sell: 2 },
    { item: "Kristall", buy: 5, sell: 3 },
    { item: "Kronkorken", buy: 2, sell: 1 },
    { item: "Edelmetall", buy: 8, sell: 4 },
    { item: "Glas", buy: 4, sell: 2 },
    { item: "Natururan", buy: 6, sell: 3 },
    { item: "YellowCake", buy: 12, sell: 6 },
    { item: "Fell", buy: 3, sell: 1 },
    { item: "Pilze", buy: 3, sell: 1 },
    { item: "Kräuter", buy: 3, sell: 1 },
    { item: "Benzin", buy: 5, sell: 2 },
    { item: "Diamant (weiß)", buy: 15, sell: 8 },
    { item: "Diamant (blau)", buy: 18, sell: 9 },
    { item: "Diamant (grün)", buy: 18, sell: 9 },
    { item: "Diamant (rot)", buy: 20, sell: 10 },
    { item: "Bio-Serum", buy: 25, sell: 10 },
    { item: "Erfindung", buy: 40, sell: 15 },
    // FAQ 2006: einige Tränke gibt es auf dem Getränkemarkt. Preise DESIGN.
    { item: "schwacher Wachtrank", buy: 12, sell: 4 },
    { item: "schwacher Heiltrank", buy: 12, sell: 4 },
    { item: "Kräutermix", buy: 6, sell: 2 },
    // WIKI: Einkauf 50 Kristalle, nur für Mutanten nutzbar
    { item: "Mutanten Energie Pillen", buy: 50, sell: 0, payItem: "Kristall" },
  ];

  /**
   * Privatgebäude am Ruinencamp.
   * Erträge angelehnt an Wiki-Stammgebäude (Brunnen ~Wasser, Farm ~Nahrung);
   * Baukosten = DESIGN (private Kosten im Wiki unklar).
   */
  const BUILDINGS = [
    {
      id: "brunnen",
      name: "Brunnen",
      img: "assets/gfx/buildings/brunnen2.jpg",
      desc: "Passiv Wasser. Wiki-Stamm: Brunnen liefert Wasser; Kosten DESIGN.",
      cost: { Stein: 25, Metall: 15, gold: 40 },
      effect: "Jeder Needs-Tick: +2 Wasser",
    },
    {
      id: "farm",
      name: "Farm",
      img: "assets/gfx/buildings/farm2.jpg",
      desc: "Passiv Nahrung. Wiki-Stamm: Farm liefert Nahrung; Kosten DESIGN.",
      cost: { Holz: 30, Stein: 10, Nahrung: 10, gold: 35 },
      effect: "Jeder Needs-Tick: +2 Nahrung",
    },
    {
      id: "lagerfeuer",
      name: "Lagerfeuer",
      img: "assets/gfx/buildings/lagerfeuer_aus2.jpg",
      desc: "Wärme und etwas Verpflegung (DESIGN).",
      cost: { Holz: 20, Stein: 10, gold: 10 },
      effect: "Jeder Needs-Tick: +1 Nahrung",
    },
    {
      id: "kraeutergarten",
      name: "Kräutergarten",
      img: "assets/gfx/buildings/farm2.jpg",
      desc: "Wiki: Gärtner braucht Kräutergarten. Kosten DESIGN.",
      cost: { Holz: 25, Stein: 15, Wasser: 10, gold: 50 },
      effect: "Needs-Tick +1 Nahrung; erleichtert Kräuter-Ernte",
    },
    {
      id: "pilzhaus",
      name: "Pilzhaus",
      img: "assets/gfx/buildings/stall.jpg",
      desc: "Wiki: Pilzsammler braucht Pilzhaus. Kosten DESIGN.",
      cost: { Holz: 30, Stein: 10, Sand: 10, gold: 55 },
      effect: "Needs-Tick +1 Nahrung; bessere Pilzernte",
    },
    {
      id: "werkstatt",
      name: "Werkstatt",
      img: "assets/gfx/buildings/menschenwall2.jpg",
      desc: "Wiki: Mechaniker braucht Werkstatt. Fahrzeuge herstellen (DESIGN).",
      cost: { Holz: 20, Metall: 40, Stein: 20, gold: 80 },
      effect: "Motorrad/Hoverbike craftbar",
    },
    {
      id: "schneiderei",
      name: "Schneiderei",
      img: "assets/gfx/buildings/stall.jpg",
      desc: "Wiki: Schneider braucht Schneiderei. Kosten DESIGN.",
      cost: { Holz: 25, Kunststoff: 15, Fell: 5, gold: 70 },
      effect: "Kleidung herstellen; bessere Felljagd",
    },
    {
      id: "ideenschmiede",
      name: "Ideenschmiede",
      img: "assets/gfx/buildings/brunnen2.jpg",
      desc: "Wiki: Erfinder braucht Ideenschmiede. Kosten DESIGN.",
      cost: { Holz: 20, Metall: 30, Kristall: 5, gold: 90 },
      effect: "Erfindungen / Tiefenbohrer craftbar",
    },
    {
      id: "psi_tempel",
      name: "PSI-Tempel",
      img: "assets/gfx/buildings/mutantenwall2.jpg",
      desc: "Wiki: Psioniker braucht PSI-Tempel. Kosten DESIGN.",
      cost: { Stein: 40, Kristall: 8, "Diamant (blau)": 1, gold: 100 },
      effect: "PSI-Fokus craftbar",
    },
    {
      id: "biolabor_geb",
      name: "Biolabor",
      img: "assets/gfx/buildings/farm2.jpg",
      desc: "Wiki: Biologe braucht Biolabor. Kosten DESIGN.",
      cost: { Metall: 35, Glas: 15, Wasser: 20, gold: 110 },
      effect: "Antivirus craftbar",
    },
    {
      id: "artefaktschmiede",
      name: "Artefaktschmiede",
      img: "assets/gfx/buildings/menschenwall2.jpg",
      desc: "Wiki: Artefaktjuwelier braucht Artefaktschmiede. Kosten DESIGN.",
      cost: { Metall: 40, Edelmetall: 10, "Diamant (weiß)": 2, gold: 120 },
      effect: "Artefakt craftbar",
    },
  ];

  /**
   * Quests — Ziele teilweise Wiki-inspiriert; Belohnungen DESIGN (außer wo vermerkt).
   */
  const QUESTS = [
    {
      id: "einfuehrung",
      title: "Einführung",
      desc: "Der Einstieg in fünf Schritten. Das ist das Tutorial — kein Extra-Fenster.",
      chain: true,
      chainId: "tutorial",
      autoClaim: true,
      steps: [
        "Holz einmal sammeln (+3 EP, 2 Holz, DESIGN)",
        "Wasser suchen (+3 EP, 2 Wasser, DESIGN)",
        "Einmal graben (+4 EP, 5 Gold, DESIGN)",
        "Zu einem zweiten Ort reisen (+4 EP, DESIGN)",
        "Einen Kampf abschließen — Schrottfeld frei (+8 EP, +2 CP, 10 Gold, DESIGN)",
      ],
      check(s) { return chainStep(s, "tutorial") >= 5; },
      progress(s) { return Math.min(5, chainStep(s, "tutorial")) + "/5"; },
      reward: {},
    },
    {
      id: "erste_hoehle",
      title: "Erste Höhle",
      desc: "Erkunde eine Anfängerhöhle und hole den Wiki-Bonus (+75 EP/CP).",
      check(s) { return Object.keys(s.cavesVisited || {}).length >= 1; },
      progress(s) { return `${Object.keys(s.cavesVisited || {}).length}/1 Höhlen`; },
      reward: { ep: 10, cp: 10, gold: 15, inv: { Nahrung: 25, Wasser: 25 } }, // DESIGN extras (Durchgang 9: Vorrat-Einheiten)
    },
    {
      id: "holz_lieferung",
      title: "Holzabgabe am Camp",
      desc: "Liefere 20 Holz im Ruinencamp ab (Inventar muss 20 Holz haben, dann Quest abschließen).",
      check(s) { return s.locId === "camp" && (s.inv.Holz || 0) >= 20; },
      progress(s) { return `${Math.min(20, s.inv.Holz || 0)}/20 Holz · Ort: Camp`; },
      onComplete(s) { takeInv(s, "Holz", 20); },
      reward: { ep: 15, cp: 10, gold: 25 }, // DESIGN
    },
    {
      id: "hundejagd",
      title: "Hundejagd",
      desc: "Besiege 2 Wilde Hunde (Waldstück/Oase oder Zufallsbegegnung).",
      check(s) { return (s.kills.wild_dog || 0) >= 2; },
      progress(s) { return `${Math.min(2, s.kills.wild_dog || 0)}/2 Hunde`; },
      reward: { ep: 12, cp: 8, gold: 10, inv: { Nahrung: 40 } }, // DESIGN (Durchgang 9: Vorrat-Einheiten)
    },
    {
      id: "zum_licht",
      title: "Zum Licht",
      desc: "Reise zur Lichthöhle (195/4, Wiki) und betritt sie.",
      check(s) { return !!(s.visited && s.visited.licht); },
      progress(s) { return s.visited && s.visited.licht ? "Lichthöhle besucht" : "Noch nicht besucht"; },
      reward: { ep: 20, cp: 15, gold: 20, inv: { Kronkorken: 5 } }, // DESIGN
    },
    {
      id: "greifer_chain",
      title: "Der Greifer (Kette)",
      desc: "Mehrstufige Wiki-Quest: Blumenhöhle → Trauung → Kriegerhöhle → Werkzeugmacher. Erz-Kauf DESIGN 25 (Wiki 100).",
      chain: true,
      chainId: "greifer",
      steps: [
        "Blumen in der Blumenhöhle (159/69) pflücken",
        "Blumen bei Mutantentrauung (99/135) abgeben",
        "Kriegerhöhle (200/105): 15 Kronkorken + Schriftrolle → Einweisung",
        "Werkzeugmacher (2/3): freiräumen, Greifer kaufen (5 Kronkorken + 25 Erz)",
      ],
      check(s) { return chainStep(s, "greifer") >= 4 || (s.inv.Greifer || 0) > 0; },
      progress(s) {
        const step = chainStep(s, "greifer");
        return `Schritt ${Math.min(4, step)}/4`;
      },
      reward: { ep: 0, cp: 0, gold: 0 },
      autoClaim: true,
    },
    {
      id: "railgun_chain",
      title: "Die Railgun (Kette)",
      desc: "Wiki-Quest (braucht Greifer + Einweisung). Edelmetall-Kauf DESIGN 40 (Wiki 1000).",
      chain: true,
      chainId: "railgun",
      requiresGreifer: true,
      steps: [
        "Maskenhöhle (30/19) freiräumen + Maske mit Greifer lösen",
        "Mädchenhöhle (115/101): Blumen geben → Kennwort",
        "Kriegerhöhle (110/30): 10 Kronkorken + Maske → Railgun-Einweisung",
        "Papierentchen craften, Mädchenhöhle (20/120) schenken",
        "Kriegerhöhle (81/150): 50 Kronkorken + 40 Edelmetall → Railgun",
      ],
      check(s) { return chainStep(s, "railgun") >= 6 || (s.inv.Railgun || 0) > 0; },
      progress(s) {
        if (!(s.inv.Greifer > 0) || !(s.flags && s.flags.greifer_trained)) {
          return "Gesperrt: erst Greifer-Quest abschließen";
        }
        const step = chainStep(s, "railgun");
        return `Schritt ${Math.min(5, Math.max(1, step))}/5 · Stand ${step}`;
      },
      reward: { ep: 0, cp: 0, gold: 0 },
      autoClaim: true,
    },
    {
      id: "kelch_chain",
      title: "Kelch des Lichts",
      desc: "Wiki: Helle Macht festigen → Lichtartefakt → Lichthöhle (195/4) einmal.",
      chain: true,
      chainId: "kelch",
      steps: [
        "Friedliche AGs bis Helle Macht + Festigung",
        "Lichtartefakt craften",
        "Kelch in der Lichthöhle holen",
      ],
      check(s) { return !!(s.flags && s.flags.kelch_geholt) || (s.inv["Kelch des Lichts"] || 0) > 0; },
      progress(s) {
        const k = s.karma || {};
        if (s.flags && s.flags.kelch_geholt) return "Kelch geholt";
        if (k.helleMacht && k.helleGefestigt) return "Macht bereit — Artefakt & Höhle";
        return `Hell ${k.light || 0} (DESIGN ≥12+3 festigen)`;
      },
      reward: { ep: 0, cp: 0, gold: 0 },
      autoClaim: true,
    },
    {
      id: "pokal_chain",
      title: "Pokal des Verderbens",
      desc: "Wiki: Dunkle Macht festigen → Schattenartefakt → Schattenhöhle (198/8) einmal.",
      chain: true,
      chainId: "pokal",
      steps: [
        "Kämpfen/Jagen bis Dunkle Macht + Festigung",
        "Schattenartefakt craften",
        "Pokal in der Schattenhöhle holen",
      ],
      check(s) { return !!(s.flags && s.flags.pokal_geholt) || (s.inv["Pokal des Verderbens"] || 0) > 0; },
      progress(s) {
        const k = s.karma || {};
        if (s.flags && s.flags.pokal_geholt) return "Pokal geholt";
        if (k.dunkleMacht && k.dunkleGefestigt) return "Macht bereit — Artefakt & Höhle";
        return `Dunkel ${k.dark || 0} (DESIGN ≥12+3 festigen)`;
      },
      reward: { ep: 0, cp: 0, gold: 0 },
      autoClaim: true,
    },
  ];

  // --- State ---
  let state = null;
  let busy = false;
  let progressTimer = null;
  let needsTimer = null;
  let createAttrs = null;
  let createCp = 5;
  let selectedRace = "Mensch";
  let fight = null;

  function rand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function weighted(list) {
    const total = list.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of list) { r -= x.w; if (r <= 0) return x; }
    return list[list.length - 1];
  }
  function manhattan(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }
  function addInv(s, item, n) { s.inv[item] = (s.inv[item] || 0) + n; }
  function takeInv(s, item, n) {
    if ((s.inv[item] || 0) < n) return false;
    s.inv[item] -= n;
    if (s.inv[item] <= 0) delete s.inv[item];
    return true;
  }
  function gain(s, ep, cp) { s.ep += ep; s.cp += cp; }
  function placeAt(x, y) { return LOCATIONS.find((l) => l.x === x && l.y === y) || null; }
  function fieldLoc(x, y) {
    return { id: "field", name: "Freies Land", x: x, y: y, tags: [], actions: ["graben"], enemies: [], free: true };
  }
  function locById(id) {
    if (id === "field" && state && typeof state.px === "number") return fieldLoc(state.px, state.py);
    return LOCATIONS.find((l) => l.id === id) || null;
  }
  function nowLabel() {
    return new Date().toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function markVisit(s, key) {
    if (!s.visited) s.visited = {};
    s.visited[key] = true;
  }
  function chainStep(s, id) {
    if (!s.chains) s.chains = {};
    return s.chains[id] || 0;
  }
  function setChain(s, id, step) {
    if (!s.chains) s.chains = {};
    s.chains[id] = step;
  }
  /** Tierfänger — Wiki: Wurfnetz (kann verbrauchen). DESIGN-Fangchancen. */
  function catchAnimal(state, animal, baseChance) {
    if ((state.ep || 0) < 400) {
      return { ok: false, msg: "Wiki: Tiere erst ab ~400 EP sinnvoll. Noch zu unerfahren." };
    }
    if ((state.inv.Wurfnetz || 0) < 1) {
      return { ok: false, msg: "Ohne Wurfnetz kein Fang (Wiki). Stell eines unter Herstellen her und lege es an." };
    }
    // 35% Chance Netz zu verbrauchen (DESIGN)
    if (Math.random() < 0.35) takeInv(state, "Wurfnetz", 1);
    const aus = state.attrs.Ausstrahlung || 1;
    const chance = Math.min(0.85, baseChance + aus * 0.03);
    gain(state, 2, 1);
    if (Math.random() > chance) {
      addInv(state, "Fell", rand(1, 2));
      return { ok: true, msg: `${animal} entkommt — du findest Fell. (Netz ggf. verbraucht)` };
    }
    state.te = (state.te || 0) + 1; // WIKI: Tierfänger 1 TE pro AG
    if (!canTakeAnimal(state)) {
      addInv(state, "Fell", 2);
      return { ok: true, msg: `Du hast schon ein Tier. Stattdessen Fell.` };
    }
    return giveAnimal(animal, "gefangen");
  }

  function bestWeapon(s) {
    let best = null;
    for (const [name, w] of Object.entries(WEAPONS)) {
      if ((s.inv[name] || 0) > 0) {
        if (!best || w.kp > best.kp) best = { name, ...w };
      }
    }
    return best;
  }
  function weaponLabel(s) {
    const w = bestWeapon(s);
    return w ? `${w.name} (+${w.kp} KP)` : "Fäuste";
  }
  function companionBonus(s) {
    // Tier: Hund WIKI 12×Größe KP (Prototyp-Skala 1/100), Esel leicht nachteilig. Siehe petKP().
    let b = petKP(s);
    if ((s.inv.Artefakt || 0) > 0) b += 10; // DESIGN Endgame-Schmuck
    if ((s.inv["PSI-Fokus"] || 0) > 0) b += 3;
    return b;
  }
  function bestClothing(s) {
    let best = null;
    for (const [name, c] of Object.entries(CLOTHING)) {
      if ((s.inv[name] || 0) > 0) {
        if (!best || c.kp > best.kp) best = { name, ...c };
      }
    }
    return best;
  }
  function clothingBonus(s) {
    const c = bestClothing(s);
    return c ? c.kp : 0;
  }

  function stammCapacity(stamm) {
    if (!stamm) return 0;
    return STAMM_LAGER_BASE + (stamm.lagerLevel || 0) * STAMM_LAGER_PER_LEVEL;
  }
  function stammUsed(stamm) {
    if (!stamm || !stamm.storage) return 0;
    return Object.values(stamm.storage).reduce((a, b) => a + (b || 0), 0);
  }
  function stammAdd(stamm, item, n) {
    if (!stamm.storage) stamm.storage = {};
    const free = stammCapacity(stamm) - stammUsed(stamm);
    if (free <= 0) return 0;
    const add = Math.min(n, free);
    stamm.storage[item] = (stamm.storage[item] || 0) + add;
    return add;
  }
  /** Karma — Wiki hell/dunkel; Schwellen DESIGN */
  const KARMA_POWER = 12; // DESIGN: Macht freischalten
  const KARMA_FEST = 3;   // DESIGN: Extra-AGs zum Festigen (Wiki: „noch ein paar AGs“)

  function ensureKarma(s) {
    if (!s.karma) {
      s.karma = {
        light: 0, dark: 0,
        helleMacht: false, dunkleMacht: false,
        helleGefestigt: false, dunkleGefestigt: false,
        lichtFest: 0, dunkelFest: 0,
        shadowNextFight: false,
      };
    }
    return s.karma;
  }

  function gainKarma(s, kind, n) {
    const k = ensureKarma(s);
    n = n || 1;
    if (kind === "light") {
      k.light += n;
      if (!k.helleMacht && k.light >= KARMA_POWER) {
        k.helleMacht = true;
        k.lichtFest = 0;
        log("Helle Macht erlangt! Noch " + KARMA_FEST + " friedliche AGs zum Festigen (Wiki).", "good");
        flashStatus("Helle Macht erlangt!", "good");
      } else if (k.helleMacht && !k.helleGefestigt) {
        k.lichtFest += n;
        if (k.lichtFest >= KARMA_FEST) {
          k.helleGefestigt = true;
          log("Helle Macht gefestigt — Kelch-Quest möglich.", "good");
          flashStatus("Helle Macht gefestigt — Kelch möglich", "good");
          setChain(s, "kelch", Math.max(chainStep(s, "kelch"), 1));
        }
      }
      flashKarma("light");
    } else if (kind === "dark") {
      k.dark += n;
      if (!k.dunkleMacht && k.dark >= KARMA_POWER) {
        k.dunkleMacht = true;
        k.dunkelFest = 0;
        log("Dunkle Macht erlangt! Noch " + KARMA_FEST + " Kämpfe/Jagden zum Festigen (Wiki).", "bad");
        flashStatus("Dunkle Macht erlangt!", "bad");
      } else if (k.dunkleMacht && !k.dunkleGefestigt) {
        k.dunkelFest += n;
        if (k.dunkelFest >= KARMA_FEST) {
          k.dunkleGefestigt = true;
          log("Dunkle Macht gefestigt — Pokal-Quest möglich.", "bad");
          flashStatus("Dunkle Macht gefestigt — Pokal möglich", "bad");
          setChain(s, "pokal", Math.max(chainStep(s, "pokal"), 1));
        }
      }
      flashKarma("dark");
    }
  }

  function karmaLabel(s) {
    const k = ensureKarma(s);
    const parts = [];
    if (k.helleGefestigt) parts.push("Hell✓");
    else if (k.helleMacht) parts.push("Hell…");
    else parts.push("Hell " + k.light + "/" + KARMA_POWER);
    if (k.dunkleGefestigt) parts.push("Dunkel✓");
    else if (k.dunkleMacht) parts.push("Dunkel…");
    else parts.push("Dunkel " + k.dark + "/" + KARMA_POWER);
    return parts.join(" · ");
  }

  function createStamm(name) {
    return {
      name: name.slice(0, 24),
      lagerLevel: 0,
      wall: false,
      storage: { Nahrung: 80, Wasser: 80, Holz: 5 },
      gold: 0,
      members: STAMM_NPC_TEMPLATES.map((t) => ({
        id: t.id, name: t.name, flavor: t.flavor, assignment: "none",
      })),
      rivalWins: 0,
    };
  }
  function getActiveVehicle(s) {
    const id = s.activeVehicle;
    if (!id || !VEHICLES[id]) return null;
    if ((s.inv[id] || 0) < 1) return null;
    return { id, ...VEHICLES[id] };
  }
  function playerKP(s) {
    const a = s.attrs;
    const w = bestWeapon(s);
    const bonus = w ? w.kp : 0;
    const veh = getActiveVehicle(s);
    const vBonus = veh && (s.ep || 0) >= veh.minEP ? vehKpBonus(s, veh) : 0;
    let kp = a.Kraft * 3 + a.Intelligenz * 1 + a.Geschwindigkeit * 0.5 + bonus + companionBonus(s) + vBonus + clothingBonus(s);
    // WIKI: Müdigkeit senkt KP, Energie unter 40% ist kritisch. Faktor ist DESIGN, Formel fehlt.
    const fat = s.fatigue || 0;
    if (fat > 0) kp *= (1 - Math.min(0.5, fat / 200));
    const en = s.energy == null ? 100 : s.energy;
    if (en < 40) kp *= 0.8;
    if (isInjured(s)) kp *= 0.8; // DESIGN: Verletzung (Wiki: "stark verletzt", ohne Zahl)
    const eq = s.equip && s.equip.rechts;
    if (eq && window.EZS_WIKI) {
      const it = (EZS_WIKI.items || []).find((i) => i.name === eq);
      if (it && it.staerke && ammoOk(s)) kp += wikiWeaponKP(s, eq, it.staerke); // WIKI Stärke, KP-Skala DESIGN (Durchgang 5). WIKI: ohne Munition nutzlos
    }
    kp += shieldKP(s);
    if (wornBelt(s) === "Gürtel der Stärke") kp += 10; // WIKI +1000 Kraft, Skala 1/100 DESIGN
    return Math.max(1, Math.floor(kp));
  }
  function playerMaxHP(s) { return 8 + (s.attrs.Ausdauer || 1) * 2; }
  function weaponDmgBonus(s) {
    const w = bestWeapon(s);
    return w ? w.dmg : 0;
  }

  /**
   * DESIGN Techlevel-Unlock (Original-Schwellen unbekannt):
   * TL1: EP ≥ 100 ODER ≥ 2 Anfängerhöhlen
   * TL2: TL1 UND (EP ≥ 250 ODER Greifer-Einweisung ODER ≥ 3 Quests)
   * TL3: TL2 UND (EP ≥ 400 ODER Railgun-Einweisung/Besitz ODER Greifer + ≥ 5 Quests)
   * TL4: TL3 UND (EP ≥ 550 ODER Railgun ODER ≥ 6 Quests)
   * TL5: TL4 UND (EP ≥ 700 ODER Uranoxid ODER ≥ 7 Quests)
   * TL6: TL5 UND (EP ≥ 850 ODER Hoverbike ODER ≥ 8 Quests)
   * TL7: TL6 UND (EP ≥ 1000 ODER Diamant rot ODER ≥ 9 Quests)
   * TL8: TL7 UND (EP ≥ 1200 ODER Ölturm/Gasturm ODER ≥ 10 Quests)
   * TL9: TL8 UND (EP ≥ 1500 ODER Erfindung ODER ≥ 11 Quests)
   */
  function evaluateTechlevel(s) {
    const caves = Object.keys(s.cavesVisited || {}).length;
    let tl = s.techlevel || 0;
    if (s.ep >= 100 || caves >= 2) tl = Math.max(tl, 1);
    const claimed = Object.values(s.quests || {}).filter((q) => q && q.claimed).length;
    if (tl >= 1) {
      const greiferOk = !!(s.flags && s.flags.greifer_trained) || chainStep(s, "greifer") >= 3;
      if (s.ep >= 250 || greiferOk || claimed >= 3) tl = Math.max(tl, 2);
    }
    if (tl >= 2) {
      const railOk = !!(s.flags && s.flags.railgun_trained) || (s.inv.Railgun || 0) > 0;
      const greiferInv = (s.inv.Greifer || 0) > 0;
      if (s.ep >= 400 || railOk || (greiferInv && claimed >= 5)) tl = Math.max(tl, 3);
    }
    if (tl >= 3) {
      if (s.ep >= 550 || (s.inv.Railgun || 0) > 0 || claimed >= 6) tl = Math.max(tl, 4);
    }
    if (tl >= 4) {
      if (s.ep >= 700 || (s.inv.Uranoxid || 0) > 0 || claimed >= 7) tl = Math.max(tl, 5);
    }
    if (tl >= 5) {
      if (s.ep >= 850 || (s.inv.Hoverbike || 0) > 0 || claimed >= 8) tl = Math.max(tl, 6);
    }
    if (tl >= 6) {
      if (s.ep >= 1000 || (s.inv["Diamant (rot)"] || 0) > 0 || claimed >= 9) tl = Math.max(tl, 7);
    }
    if (tl >= 7) {
      const turm = !!(s.flags && (s.flags.oelturm || s.flags.gasturm));
      if (s.ep >= 1200 || turm || claimed >= 10) tl = Math.max(tl, 8);
    }
    if (tl >= 8) {
      if (s.ep >= 1500 || (s.inv.Erfindung || 0) > 0 || claimed >= 11) tl = Math.max(tl, 9);
    }
    return tl;
  }

  function availableJobs(s) {
    const list = [...JOBS_TL0];
    if ((s.techlevel || 0) >= 1) list.push(...JOBS_TL1);
    if ((s.techlevel || 0) >= 2) list.push(...JOBS_TL2);
    if ((s.techlevel || 0) >= 3) list.push(...JOBS_TL3);
    if ((s.techlevel || 0) >= 4) list.push(...JOBS_TL4);
    if ((s.techlevel || 0) >= 5) list.push(...JOBS_TL5);
    if ((s.techlevel || 0) >= 6) list.push(...JOBS_TL6);
    if ((s.techlevel || 0) >= 7) list.push(...JOBS_TL7);
    if ((s.techlevel || 0) >= 8) list.push(...JOBS_TL8);
    if ((s.techlevel || 0) >= 9) list.push(...JOBS_TL9);
    return list;
  }

  function migrateState(s) {
    if (!s) return s;
    if (typeof s.kep !== "number") s.kep = 0;
    if (typeof s.techlevel !== "number") s.techlevel = 0;
    if (!s.cavesVisited) s.cavesVisited = {};
    if (!s.visited) s.visited = {};
    if (!s.inv) s.inv = {};
    if (!s.attrs) s.attrs = {};
    if (!s.kills) s.kills = {};
    if (!s.quests) s.quests = {};
    if (!s.buildings) s.buildings = {};
    if (!s.flags) s.flags = {};
    if (!s.chains) s.chains = {};
    if (s.activeVehicle == null) s.activeVehicle = null;
    if (s.stamm === undefined) s.stamm = null;
    ensureKarma(s);
    if (!s.flags.tutorialInit) {
      if ((s.ep || 0) >= 30) {
        setChain(s, "tutorial", 5);
        s.flags.tutorial_done = true;
      } else if (typeof s.chains.tutorial !== "number") {
        setChain(s, "tutorial", 0);
      }
      s.flags.tutorialInit = true;
    }
    QUESTS.forEach((q) => {
      if (!s.quests[q.id]) s.quests[q.id] = { status: "active", claimed: false };
      if (q.autoClaim && q.check(s)) {
        s.quests[q.id].status = "done";
        s.quests[q.id].claimed = true;
      }
    });
    ATTRS.forEach((a) => { if (typeof s.attrs[a] !== "number") s.attrs[a] = 1; });
    // DESIGN-Startwerte: Wiki nennt die Meter, aber keine Startzahl.
    if (typeof s.fatigue !== "number") s.fatigue = 0;
    if (typeof s.radiation !== "number") s.radiation = 0;
    if (typeof s.energy !== "number") s.energy = 100;
    if (typeof s.hep !== "number") s.hep = 0;
    if (typeof s.rep !== "number") s.rep = 0;
    if (typeof s.nv !== "number") s.nv = 0;
    if (typeof s.flex !== "number") s.flex = 0;
    if (typeof s.kreativ !== "number") s.kreativ = 0;
    if (typeof s.repSteps !== "number") s.repSteps = 0;
    if (typeof s.te !== "number") s.te = 0;
    if (typeof s.tradeUnits !== "number") s.tradeUnits = 0;
    if (s.pet === undefined) {
      s.pet = null;
      // Alte Stände: Tiere lagen als Gegenstand im Rucksack → ein echtes Tier daraus machen.
      const old = ["Pferd", "Hund", "Esel"].find((n) => (s.inv[n] || 0) > 0);
      if (old) s.pet = { type: old, name: old, kraft: 10, gesch: 10, energie: 100, hunger: 20, durst: 20, groesse: 100, einst: 0, sleeping: false, sick: false, inStall: false, psi: !!(s.flags && s.flags.psi_pet_bonus), tickAt: Date.now() };
      ["Pferd", "Hund", "Esel"].forEach((n) => { delete s.inv[n]; });
    }
    if (!s.equip) s.equip = { kopf: null, links: null, rechts: null, koerper: null, unterleib: null, lfuss: null, rfuss: null };
    if (!s.notes) s.notes = { post: "", board: "", block: "", pin: "" };
    let tl = evaluateTechlevel(s);
    if (typeof s.tlCap === "number") tl = Math.min(tl, s.tlCap);
    if (tl > (s.techlevel || 0)) s.techlevel = tl;
    // Karten-Sperren sind abgeleitet (EP/Flags), kein Extra-Feld.
    // Alter Stand bleibt am aktuellen Ort, auch wenn der Ort jetzt gesperrt wäre.
    if (s.locId && s.locId !== "field" && !LOCATIONS.some((l) => l.id === s.locId)) s.locId = "camp";
    if (typeof s.px !== "number" || typeof s.py !== "number") {
      const loc = LOCATIONS.find((l) => l.id === s.locId) || LOCATIONS.find((l) => l.id === "camp");
      s.px = loc ? loc.x : 50;
      s.py = loc ? loc.y : 100;
    }
    return s;
  }

  function save(opts) {
    if (!state) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    flashSave(!(opts && opts.quiet));
    if (!opts || !opts.quiet) log("Spielstand gespeichert.", "sys");
  }
  function flashSave(manual) {
    const el = document.getElementById("save-indicator");
    if (!el) return;
    el.textContent = manual ? "Gespeichert" : "Autosave";
    el.classList.toggle("manual", !!manual);
    el.classList.add("show");
    clearTimeout(flashSave._t);
    flashSave._t = setTimeout(() => el.classList.remove("show"), 1600);
  }
  function flashStatus(msg, cls) {
    showResult(msg, cls === "bad");
    if (!busy) setStatus("Bereit.");
  }
  function flashKarma(kind) {
    const el = document.getElementById("stat-karma");
    if (!el) return;
    el.classList.remove("karma-flash-light", "karma-flash-dark");
    void el.offsetWidth;
    el.classList.add(kind === "dark" ? "karma-flash-dark" : "karma-flash-light");
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return migrateState(JSON.parse(raw));
    } catch { return null; }
  }
  function clearSave() { localStorage.removeItem(STORAGE_KEY); }

  function log(msg, cls) {
    const el = document.getElementById("log");
    if (!el) return;
    const line = document.createElement("div");
    line.className = "line" + (cls ? " " + cls : "");
    line.textContent = `[${nowLabel()}] ${msg}`;
    el.prepend(line);
  }
  function needClass(v) {
    if (v <= 0) return "need crit stat-value";
    if (v <= 15) return "need warn stat-value";
    return "need ok stat-value";
  }
  function setStatus(t) { document.getElementById("status-line").textContent = t; }
  function setProgress(pct) { document.getElementById("progress-bar").style.width = pct + "%"; }
  let resultLines = [];
  let resultPage = null;
  let workUi = null;
  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }
  function renderResultBanner() {
    const el = document.getElementById("result-banner");
    if (!el) return;
    el.classList.toggle("show", resultLines.length > 0);
    el.classList.toggle("multi", resultLines.length > 1);
    el.innerHTML = resultLines.map((l) => '<div class="result-line' + (l.bad ? " bad" : "") + '">' + escapeHtml(l.text || l) + "</div>").join("");
  }
  function clearResults() { resultLines = []; resultPage = null; renderResultBanner(); }
  function showResult(line, bad) { resultLines = [{ text: line, bad: !!bad }]; resultPage = origPage; renderResultBanner(); }
  function pushResult(line, bad) { resultLines.push({ text: line, bad: !!bad }); renderResultBanner(); }
  function resultLine(res) {
    if (!res) return "—";
    if (res.headline) return res.headline;
    const msg = res.msg || "";
    const m = msg.match(/(\d+)\s+([^\s,.!]+)/);
    if (m) return m[1] + " " + m[2];
    if (/nichts/i.test(msg)) return "nichts";
    return msg || "fertig";
  }
  function travelNeeds() {
    const veh = state && getActiveVehicle(state);
    if (veh && vehUsable(state, veh)) return { f: 0, w: 0 };
    return { f: 1, w: 1 };
  }
  function stackCost(n, willTravel) {
    const t = willTravel ? travelNeeds() : { f: 0, w: 0 };
    return { f: n + t.f, w: n + t.w };
  }
  function needsDanger(cost) {
    if (!state) return false;
    return state.food - cost.f <= -10 || state.water - cost.w <= -10;
  }
  function costLabel(cost) {
    return "−" + cost.f + " Nahrung · −" + cost.w + " Wasser";
  }
  function focusKind() {
    if (!state || (state.flags && state.flags.tutorial_done) || chainStep(state, "tutorial") >= 5) return null;
    const step = TUTORIAL_STEPS[chainStep(state, "tutorial")];
    return step ? step.ev : null;
  }
  function jobMainKind() {
    const map = {
      Holzsammler: "holz", Geologe: "stein", Metallbauer: "metall", Kunststoffsammler: "kunststoff",
      Sandsucher: "sand", "Ölwerker": "oel", Gaswerker: "gas", Erzsammler: "erz",
    };
    return map[state.job] || null;
  }

  function maybeUnlockTL() {
    if (!state) return;
    const before = state.techlevel || 0;
    let tl = evaluateTechlevel(state);
    if (typeof state.tlCap === "number") tl = Math.min(tl, state.tlCap); // Kaserne: Techlevel gesenkt (WIKI)
    if (tl > before) {
      state.techlevel = tl;
      let jobs = "Sandsucher, Chemiker, Waffentechniker, Ölwerker, Gaswerker (TL1)";
      if (tl >= 9) jobs = "Biologe, Artefaktjuwelier (TL9)";
      else if (tl >= 8) jobs = "Erfinder, Psioniker (TL8)";
      else if (tl >= 7) jobs = "Öl-Techniker, Gas-Techniker (TL7)";
      else if (tl >= 6) jobs = "Schneider, Diamantsucher (TL6)";
      else if (tl >= 5) jobs = "Pilzsammler, Mechaniker, Gärtner (TL5)";
      else if (tl >= 4) jobs = "Forscher, Uransammler, Tierfänger (TL4)";
      else if (tl >= 3) jobs = "Werkzeugmacher, Glasschmelzer (TL3)";
      else if (tl >= 2) jobs = "Spion, Erzsammler (TL2)";
      log(`Techlevel ${tl} freigeschaltet! Berufe: ${jobs}. Ausbildung übersprungen (DESIGN).`, "good");
    }
  }

  function applyQuestRewards(q) {
    const r = q.reward || {};
    if (r.ep) state.ep += r.ep;
    if (r.cp) state.cp += r.cp;
    if (r.gold) state.gold += r.gold;
    if (r.inv) {
      Object.entries(r.inv).forEach(([k, v]) => addInv(state, k, v));
    }
  }

  function tryCompleteQuest(qid) {
    const q = QUESTS.find((x) => x.id === qid);
    if (!q || !state) return;
    const st = state.quests[qid];
    if (!st || st.claimed) return;
    if (!q.check(state)) {
      log(`Quest „${q.title}“: Bedingungen noch nicht erfüllt.`, "bad");
      return;
    }
    if (q.onComplete) q.onComplete(state);
    applyQuestRewards(q);
    st.status = "done";
    st.claimed = true;
    const bits = [];
    if (q.reward.ep) bits.push(`+${q.reward.ep} EP`);
    if (q.reward.cp) bits.push(`+${q.reward.cp} CP`);
    if (q.reward.gold) bits.push(`+${q.reward.gold} Gold`);
    if (q.reward.inv) bits.push(Object.entries(q.reward.inv).map(([k, v]) => `${v}× ${k}`).join(", "));
    log(`Quest abgeschlossen: ${q.title}! ${bits.join(", ")} (Belohnung DESIGN).`, "good");
    maybeUnlockTL();
    save({ quiet: true });
    renderAll();
  }

  // --- Combat ---
  function fightLog(msg, cls) {
    const el = document.getElementById("fight-log");
    if (!el) return;
    const line = document.createElement("div");
    line.className = "fline" + (cls ? " " + cls : "");
    line.textContent = msg;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }
  function updateFightUI() {
    if (!fight) return;
    document.getElementById("fight-you-hp").style.width = Math.max(0, (fight.youHP / fight.youMax) * 100) + "%";
    document.getElementById("fight-foe-hp").style.width = Math.max(0, (fight.foeHP / fight.foeMax) * 100) + "%";
    document.getElementById("fight-you-hp-text").textContent = `TP ${Math.max(0, fight.youHP)} / ${fight.youMax}`;
    document.getElementById("fight-foe-hp-text").textContent = `TP ${Math.max(0, fight.foeHP)} / ${fight.foeMax}`;
    document.getElementById("fight-round").textContent = fight.done
      ? (fight.won ? "Kampf beendet" : "Kampf beendet")
      : `Runde ${fight.round} / ${fight.roundsMax}`;
    const res = document.getElementById("fight-result");
    if (res) {
      if (fight.done) {
        res.classList.remove("hidden", "won", "lost");
        res.classList.add(fight.won ? "won" : "lost");
        res.textContent = fight.won
          ? ("Sieg gegen " + fight.enemy.name + "!")
          : ("Niederlage gegen " + fight.enemy.name);
      } else {
        res.classList.add("hidden");
        res.textContent = "";
      }
    }
  }
  function availableEnemiesAt(loc) {
    if (!loc || !loc.enemies || !loc.enemies.length) return [];
    if (loc.enemiesAfterCave && loc.caveKey && !state.cavesVisited[loc.caveKey]) return [];
    return loc.enemies.map((id) => ENEMIES[id]).filter(Boolean);
  }
  function startFight(enemyId, reason, tag) {
    const ambush = reason === "Zufallsbegegnung" || reason === "Überfall im Schlaf";
    if (!ambush && (!busy || sleepUi) && !fight && state && !state.dead && blockIfExhausted()) return;
    if (busy || state.dead || fight) return;
    const enemy = ENEMIES[enemyId];
    if (!enemy) return;
    if (ambush && (wornBelt(state) === "Gürtel der Erkenntnis" || (wornBelt(state) === "Gürtel der Tiere" && enemyId === "wild_dog"))) {
      const t = wornBelt(state) === "Gürtel der Tiere" ? "Gürtel der Tiere: " + enemy.name + " lässt dich in Ruhe (Wiki)." : "Gürtel der Erkenntnis: Du bemerkst " + enemy.name + " rechtzeitig und weichst aus (Wiki: warnt vor Angriffen).";
      log(t, "good"); showResult(t); renderAll(); return;
    }
    const sk = skillFightBonus(playerKP(state));
    const ammo = ammoNeed(state);
    if (ammo) {
      if (takeInv(state, ammo, 1)) log("Munition: −1 " + ammo + " (1 je Kampf, DESIGN).", "sys");
      else log("Ohne " + ammo + " zählt deine Waffe nicht (Wiki: benötigt Munition).", "bad");
    }
    const oneShot = einwegInHand(state); // WIKI: Einweg-Waffen
    const poison = poisonInHand(state);  // WIKI: Giftspritze in der linken Hand
    const pKP = sk.kp;
    if (sk.used.length) log("Fähigkeit hilft: " + sk.used.join(", ") + " (+10% KP je Fähigkeit, DESIGN).", "good");
    let foeHP = enemy.hp;
    let foeKP = enemy.kp;
    const k = ensureKarma(state);
    if (k.shadowNextFight) {
      foeHP = Math.max(1, Math.floor(foeHP / 2));
      foeKP = Math.max(1, Math.floor(foeKP * 0.75));
      k.shadowNextFight = false;
      log("Schattenspruch: Gegner geschwächt (DESIGN, Wiki: Feinde hungern/dursten).", "bad");
    }
    fight = {
      enemy, youHP: playerMaxHP(state), youMax: playerMaxHP(state), youKP: pKP,
      foeHP: foeHP, foeMax: enemy.hp, foeKP: foeKP,
      round: 0, roundsMax: enemy.roundsMax, done: false, won: false, tag: tag || null,
      poison: poison,
    };
    if (oneShot) { takeInv(state, oneShot, 1); log(oneShot + " verbraucht (Wiki: Einweg).", "sys"); }
    busy = true;
    document.getElementById("fight-overlay").classList.remove("hidden");
    document.getElementById("btn-fight-close").classList.add("hidden");
    document.getElementById("fight-log").innerHTML = "";
    const fr0 = document.getElementById("fight-result");
    if (fr0) { fr0.classList.add("hidden"); fr0.textContent = ""; }
    document.getElementById("fight-you-name").textContent = state.name;
    document.getElementById("fight-foe-name").textContent = enemy.name;
    document.getElementById("fight-foe-img").src = enemy.img;
    document.getElementById("fight-foe-img").alt = enemy.name;
    document.getElementById("fight-you-kp").textContent = `KP ${pKP}`;
    document.getElementById("fight-foe-kp").textContent = `KP ${foeKP}` + (foeKP !== enemy.kp ? " (geschwächt)" : "");
    document.getElementById("fight-weapon").textContent = `Waffe: ${weaponLabel(state)}`;
    updateFightUI();
    const hereFight = locById(state.locId);
    const scout = activePet(state);
    let eagle = "";
    if (scout && scout.type === "Adler") { // WIKI: Adler schätzt die gegnerische Kraft, max. 10% daneben
      const est = Math.max(1, Math.round(foeKP * (0.9 + Math.random() * 0.2)));
      eagle = " Dein Adler schätzt etwa " + est + " KP.";
      fightLog("Adler: Gegner hat etwa " + est + " KP.", "sys");
    }
    showResult("Kampf gegen " + enemy.name + (hereFight ? " in " + hereFight.name : "") + "." + eagle);
    log((reason || "Kampf") + ": " + enemy.name + "!", "sys");
    fightLog(`Kampf gegen ${enemy.name}. KP ${pKP} vs ${enemy.kp}. ${weaponLabel(state)}`, "sys");
    renderAll();
    setTimeout(fightRound, 700);
  }
  function fightRound() {
    if (!fight || fight.done) return;
    fight.round += 1;
    if (fight.round === 1 && fight.poison && poisonStrike()) return;
    const diff = fight.youKP - fight.foeKP;
    const youHitChance = clamp(0.4 + diff / 80, 0.2, 0.9);
    const foeHitChance = clamp(0.4 - diff / 80, 0.2, 0.9) * defenseFactor(state); // Schild: DESIGN
    const youDmgBase = 1 + Math.floor((state.attrs.Kraft || 1) / 3) + weaponDmgBonus(state);
    const foeDmgBase = 1 + Math.floor(fight.foeKP / 12);

    if (Math.random() < youHitChance) {
      const dmg = youDmgBase + (Math.random() < 0.2 ? 1 : 0);
      fight.foeHP -= dmg;
      fightLog(`Runde ${fight.round}: Du triffst (−${dmg} TP).`, "good");
    } else {
      fightLog(`Runde ${fight.round}: Du verfehlst.`, "sys");
    }
    if (fight.foeHP > 0) {
      if (Math.random() < foeHitChance) {
        const dmg = foeDmgBase + (Math.random() < 0.15 ? 1 : 0);
        fight.youHP -= dmg;
        fightLog(`  ${fight.enemy.name} trifft (−${dmg} TP).`, "bad");
      } else {
        fightLog(`  ${fight.enemy.name} verfehlt.`, "sys");
      }
    }
    updateFightUI();
    if (fight.foeHP <= 0) { endFight(true); return; }
    if (fight.youHP <= 0) { endFight(false); return; }
    if (fight.round >= fight.roundsMax) { endFight(fight.youHP >= fight.foeHP); return; }
    setTimeout(fightRound, p7FightDelay()); // Durchgang 7: Geschwindigkeit (Wiki)
  }
  function endFight(won) {
    if (!fight || fight.done) return;
    fight.done = true; fight.won = won; updateFightUI();
    const e = fight.enemy;
    if (won) {
      const r = e.reward;
      state.ep += r.ep; state.cp += r.cp; state.kep = (state.kep || 0) + r.kep;
      exert("fight");
      state.kills[e.id] = (state.kills[e.id] || 0) + 1;
      const drop = weighted(e.loot.map((l) => ({ item: l.item, n: rand(l.n[0], l.n[1]), w: l.w })));
      let lootMsg = `${drop.n}× ${drop.item}`;
      if (e.id === "rival_scout" && state.stamm) {
        const added = stammAdd(state.stamm, drop.item, drop.n);
        state.stamm.rivalWins = (state.stamm.rivalWins || 0) + 1;
        state.stamm.gold += 10;
        lootMsg = `${added}× ${drop.item} → Stammlager (+10 Stamm-Gold)`;
      } else {
        addInv(state, drop.item, drop.n);
      }
      lootMsg += p9FightFood(e); // Durchgang 9: Fleisch/Vorräte direkt in den Nahrungsvorrat
      lootMsg += tryNetCapture(e.id);
      if (fight.tag) { const qm = questFightWon(fight.tag); if (qm) lootMsg += ". " + qm.replace(/\.$/, ""); }
      const msg = "Sieg gegen " + e.name + ". +" + r.ep + " EP. " + lootMsg + ".";
      fightLog(msg, "good"); log(msg, "good");
      showResult(msg);
      setStatus("Bereit.");
      state.food -= 1; state.water -= 1;
      gainKarma(state, "dark", 1);
    } else {
      const goldLoss = Math.min(state.gold, Math.max(3, Math.floor(state.gold * 0.25)));
      state.gold -= goldLoss; state.food -= 3; state.water -= 3;
      state.ep += 1; state.cp += 1; state.kep = (state.kep || 0) + 1;
      const msg = "Niederlage gegen " + e.name + ". −" + goldLoss + " Gold."; p9FightLost(e);
      fightLog(msg, "bad"); log(msg, "bad");
      showResult(msg, true);
      setStatus("Bereit.");
    }
    document.getElementById("btn-fight-close").classList.remove("hidden");
    noteTutorial("kampf");
    maybeUnlockTL();
    checkDeath();
    save({ quiet: true });
    renderAll();
  }
  function closeFight() {
    document.getElementById("fight-overlay").classList.add("hidden");
    fight = null; busy = false; setProgress(0); setStatus("Bereit.");
    renderAll();
  }

  // --- Create / screens ---
  function initCreate() {
    createCp = 5; createAttrs = {}; ATTRS.forEach((a) => (createAttrs[a] = 1));
    selectedRace = "Mensch";
    document.querySelectorAll(".race-card").forEach((c) => {
      c.classList.toggle("selected", c.dataset.race === "Mensch");
    });
    renderAttrEditor();
    document.getElementById("btn-load").classList.toggle("hidden", !load());
  }
  function renderAttrEditor() {
    const grid = document.getElementById("attr-grid");
    grid.innerHTML = "";
    document.getElementById("cp-left").textContent = String(createCp);
    ATTRS.forEach((a) => {
      const row = document.createElement("div");
      row.className = "attr-row";
      row.innerHTML = `<span>${a}: <strong>${createAttrs[a]}</strong></span>`;
      const btns = document.createElement("div"); btns.className = "btns";
      const minus = document.createElement("button"); minus.textContent = "−"; minus.type = "button";
      minus.onclick = () => { if (createAttrs[a] > 1) { createAttrs[a]--; createCp++; renderAttrEditor(); } };
      const plus = document.createElement("button"); plus.textContent = "+"; plus.type = "button";
      plus.onclick = () => { if (createCp > 0) { createAttrs[a]++; createCp--; renderAttrEditor(); } };
      btns.append(minus, plus); row.append(btns); grid.append(row);
    });
  }
  let diedThisSession = false;
  function saveIsDead(s) {
    return !!(s && (s.dead || s.food <= -10 || s.water <= -10));
  }
  function bootDefault() {
    diedThisSession = false;
    try { const old = localStorage.getItem(STORAGE_KEY); if (old) localStorage.setItem(STORAGE_KEY + "_backup", old); } catch (e) { /* egal */ } // Hotfix 9.1: alten Stand sichern
    const attrs = {};
    ATTRS.forEach((a) => { attrs[a] = 1; });
    attrs.Wahrnehmung += 2;
    state = migrateState({
      name: "Wanderer", race: "Mensch", job: "Holzsammler", attrs,
      ep: 0, cp: 5, kep: 0, techlevel: 0, gold: 20,
      food: 40, water: 40, locId: "camp",
      inv: { Nahrung: 5, Wasser: 5 },
      cavesVisited: {}, visited: {}, kills: {},
      quests: {}, buildings: {}, flags: {}, chains: {}, activeVehicle: null, stamm: null,
      karma: null,
      lastNeedsAt: Date.now(), dead: false,
    });
    save({ quiet: true });
    showGame();
    log("Wanderer ist unterwegs.", "sys");
  }
  function enterGame() {
    LEGACY_STORAGE_KEYS.forEach((k) => { try { localStorage.removeItem(k); } catch (e) { /* egal */ } });
    const existing = load();
    if (existing && !saveIsDead(existing)) resumeGame(true);
    else if (existing && p91HasProgress(existing)) p91ShowDead(existing); // Hotfix 9.1: toter Stand mit Fortschritt wird nie still ersetzt
    else bootDefault();
  }
  function startGame() {
    const nameEl = document.getElementById("input-name");
    const name = (nameEl && nameEl.value || "Wanderer").trim().slice(0, 24);
    const jobEl = document.getElementById("input-job");
    const job = jobEl ? jobEl.value : "Holzsammler";
    const attrs = { ...createAttrs };
    if (selectedRace === "Mensch") attrs.Wahrnehmung += 2;
    if (selectedRace === "Mutant") attrs.Kraft += 2;
    state = migrateState({
      name, race: selectedRace, job, attrs,
      ep: 0, cp: createCp, kep: 0, techlevel: 0, gold: 20,
      food: 40, water: 40, locId: "camp",
      inv: { Nahrung: 5, Wasser: 5 },
      cavesVisited: {}, visited: {}, kills: {},
      quests: {}, buildings: {}, flags: {}, chains: {}, activeVehicle: null, stamm: null,
      karma: null,
      lastNeedsAt: Date.now(), dead: false,
    });
    save({ quiet: true });
    showGame();
    log(`Willkommen, ${name}. Die Einführung steht unter „Jetzt“ und bei den Quests.`, "sys");
  }
  function resumeGame(auto) {
    state = load();
    if (!state) return;
    showGame();
    log(auto ? "Spielstand automatisch geladen." : "Spielstand geladen.", "sys");
    p91AfterLoad();
  }
  function showLogin() { enterGame(); }
  function showCreate() { bootDefault(); }
  function showGame() {
    document.body.classList.add("ingame");
    const login = document.getElementById("screen-login");
    const create = document.getElementById("screen-create");
    const game = document.getElementById("screen-game");
    if (login) login.classList.add("hidden");
    if (create) create.classList.add("hidden");
    if (game) game.classList.remove("hidden");
    renderAll(); startNeeds();
  }
  const ROHSTOFFE = [
    ["Holz", "holz"], ["Stein", "stein"], ["Metall", "metall"], ["Kunststoff", "kunststoff"],
    ["Sand", "sand"], ["Öl", "oel"], ["Gas", "gas"], ["Benzin", "benzin"], ["Erz", "erz"],
    ["Kristall", "kristall"], ["Edelmetall", "edelmetall"], ["Holzkohle", "oel"],
    ["Kronkorken", "kronkorken"], ["Knochen", "erz"], ["Natururan", "uran"],
    ["YellowCake", "uran"], ["Uranhexfluorid", "uran"], ["Uranoxid", "uran"],
    ["Pilze", "sirup"], ["Kräuter", "nahrung"], ["Fell", "nahrung"],
    ["Diamant (weiß)", "diamantweiss"], ["Diamant (blau)", "diamantblau"],
    ["Diamant (grün)", "diamantgruen"], ["Diamant (rot)", "diamantrot"], ["Glas", "sand"],
    ["Schwefel", "sand"], ["Kalisalpeter", "stein"],
  ];
  function resIconClass(name) {
    const row = ROHSTOFFE.find((r) => r[0] === name);
    return row ? row[1] : null;
  }
  function renderResBar() {
    const el = document.getElementById("res-strip");
    if (!el || !state) return;
    const owned = [];
    const empty = [];
    ROHSTOFFE.forEach(([name, cls]) => {
      const n = state.inv[name] || 0;
      if (n > 0) owned.push('<span class="chip"><i class="res-' + cls + '"></i> ' + name + " " + n + "</span>");
      else empty.push(name);
    });
    const packN = state.inv.Nahrung || 0;
    const packW = state.inv.Wasser || 0;
    el.innerHTML = (owned.length ? owned.join("") : "<span class='hint'>noch keine Rohstoffe</span>")
      + "<p class='hint'>Rucksack: Nahrung " + packN + " · Wasser " + packW + "</p>"
      + (empty.length ? "<details class='leer'><summary>Leer (" + empty.length + ")</summary><p>" + empty.join(", ") + "</p></details>" : "");
  }
  function renderEquipped() {
    const el = document.getElementById("equipped-strip");
    if (!el || !state) return;
    const w = bestWeapon(state);
    const c = bestClothing(state);
    const pets = state.pet ? [state.pet.name] : [];
    const veh = getActiveVehicle(state);
    el.innerHTML = ""
      + "<div class='eq-slot'><span class='k'>Angelegt · Waffe</span><strong>" + (w ? w.name + " (+" + w.kp + " KP)" : "Fäuste") + "</strong></div>"
      + "<div class='eq-slot'><span class='k'>Kleidung</span><strong>" + (c ? c.name + " (+" + c.kp + " KP)" : "keine") + "</strong></div>"
      + "<div class='eq-slot'><span class='k'>Begleiter</span><strong>" + (pets.length ? pets.join(", ") : "keiner") + "</strong></div>"
      + "<div class='eq-slot'><span class='k'>Fahrzeug</span><strong id='eq-veh-label'>" + (veh ? veh.name : "zu Fuß") + "</strong><select id='vehicle-select'></select></div>"
      + "<div class='pack-row'>" + Object.keys(state.inv).sort().filter((k) => (state.inv[k] || 0) > 0).map((k) => {
          const src = ICONS[k] || ICONS.Holz;
          return "<span class='pack-chip'><img src='" + src + "' alt='' />" + state.inv[k] + "</span>";
        }).join("") + "</div>";
    const vsel = el.querySelector("#vehicle-select");
    const none = document.createElement("option");
    none.value = ""; none.textContent = "— zu Fuß —";
    vsel.appendChild(none);
    Object.keys(VEHICLES).filter((id) => (state.inv[id] || 0) > 0).forEach((id) => {
      const opt = document.createElement("option");
      opt.value = id; opt.textContent = VEHICLES[id].name;
      if (state.activeVehicle === id) opt.selected = true;
      vsel.appendChild(opt);
    });
    vsel.onchange = () => {
      state.activeVehicle = vsel.value || null;
      log(state.activeVehicle ? ("Fahrzeug aktiv: " + VEHICLES[state.activeVehicle].name) : "Zu Fuß.", "sys");
      save({ quiet: true });
      renderAll();
    };
  }


  let origPage = "land";
  let origLandId = null;
  const ORIG_MENUS = {
    left: [
      ["Nachrichten", [
        ["ereignisse", "Ereignisse"],
        ["postfach", "Postfach"],
        ["donnertafel", "Donnertafel"],
        ["modpin", "Mod Pinnwand"],
        ["modakt", "Mod Aktions"],
        ["radio", "Dein Radio"],
        ["notiz", "Notizblock"],
      ]],
      ["Dein Charakter", [
        ["status", "Status"],
        ["uebersicht", "Übersicht"],
        ["rucksack", "Rucksack"],
        ["ausruestung", "Ausrüstung"],
        ["laender", "Deine Länder"],
      ]],
      ["Aktionen", [
        ["arbeiten", "Arbeiten"],
        ["bauoptionen", "Bauoptionen"],
        ["erkunden", "Erkunden"],
        ["faehigkeiten", "Fähigkeiten"],
        ["graben", "Graben"],
        ["gebaeude", "Gebäude"],
        ["handeln", "Handeln"],
        ["haus", "Haus"],
        ["jagen", "Jagen"],
        ["kaempfen", "Kämpfen"],
        ["landkarte", "Landkarte"],
        ["nahrungssuche", "Nahrungssuche"],
        ["schlafen", "Schlafen"],
        ["uebertragen", "Übertragen"],
        ["wassersuche", "Wassersuche"],
        ["logout", "Logout"],
      ]],
      ["Community", [
        ["com", "Übersicht"],
        ["news", "News"],
        ["hof", "Hall of Fame"],
        ["umfrage", "Umfrage"],
        ["usersuche", "Usersuche"],
        ["sponsor", "Werde Sponsor"],
        ["hilfe", "Hilfe"],
        ["forum", "Forum"],
        ["galerie", "Galerie"],
        ["blogs", "Blogs"],
        ["stats", "Stats"],
      ]],
    ],
    right: [
      ["Stammlager", [
        ["lagerlogs", "Lagerlogs"],
        ["lagerres", "Ressourcen"],
        ["lageritems", "Gegenstände"],
        ["lagerrecht", "Lagerrechte"],
        ["garage", "Garage"],
      ]],
      ["Stamm", [
        ["stamm", "Übersicht"],
        ["mitglieder", "Mitglieder"],
        ["pinnwand", "Pinnwand"],
        ["tierstall", "Tierstall"],
        ["erzver", "Erzverarbeitung"],
        ["uranver", "Uranverarbeitung"],
        ["forschung", "Forschung"],
        ["stammgeb", "Stammgebäude"],
        ["waffenfabrik", "Waffenfabrik"],
        ["biolabor", "Biolabor"],
        ["werkstatt", "Werkstatt"],
        ["rakete", "Raketenbasis"],
        ["stammopt", "Optionen"],
        ["stammkampf", "Stammkämpfe"],
        ["verlassen", "Verlassen"],
      ]],
    ],
  };
  const STUBS = {
    modpin: "Mod Pinnwand", modakt: "Mod Aktions",
    umfrage: "Umfrage", blogs: "Blogs",
    sponsor: "Werde Sponsor",
  };
  function origEsc(s) { return escapeHtml(s); }
  function origLink(label, attrs) {
    return '<a href="#" ' + attrs + '>' + origEsc(label) + '</a>';
  }
  function origStub(title) {
    return '<h2>' + origEsc(title) + '</h2><p>Noch keine Einträge.</p>';
  }
  function photoRow(src, title, lines) {
    const pic = src
      ? '<img src="' + src + '" alt="">'
      : '<span class="slot-frame"></span>';
    const body = lines.map((l) => "<p>" + l + "</p>").join("");
    return '<div class="brow">' + pic + "<div><b>" + title + "</b>" + body + "</div></div>";
  }
  function itemBucket(name) {
    if (name === "Nahrung" || name === "Wasser" || name === "Gold") return "Ressourcen";
    if (ROHSTOFFE.some((r) => r[0] === name)) return "Ressourcen";
    const it = wikiByName(name);
    const kind = ((it && it.kind) || "").toLowerCase();
    const slot = (it && it.slot) || "";
    if (kind.includes("ressource")) return "Ressourcen";
    if (kind.includes("waffe") || kind.includes("schild") || slot === "rechts" || slot === "links") return "Waffen";
    if (kind.includes("kleid") || slot === "kopf" || slot === "koerper" || slot === "unterleib" || slot === "fuss") return "Kleidung";
    return "Sonstiges";
  }
  function dollSlot(label, name) {
    const shown = name && name !== "—" ? name : "";
    let pic = '<span class="slot-frame"></span>';
    if (shown && ICONS[shown]) pic = '<img class="slot-img" src="' + ICONS[shown] + '" alt="">';
    else if (shown && VEHICLES[shown]) pic = '<img class="slot-img" src="' + VEHICLES[shown].img + '" alt="">';
    return '<div class="slot"><b>' + label + "</b>" + pic + "<span>" + (shown ? origEsc(shown) : "—") + "</span></div>";
  }
  function origLive() {
    const st = document.getElementById("status-line");
    const bar = document.getElementById("progress-bar");
    const txt = st ? st.textContent : "";
    const w = bar ? bar.style.width : "";
    let html = "";
    if (w && w !== "0%" && w !== "0") html += '<div class="orig-prog"><i style="width:' + w + '"></i></div>';
    if (txt && txt !== "Bereit.") html += '<p class="orig-live">' + origEsc(txt) + '</p>';
    return html;
  }
  function origLogHtml() {
    const log = document.getElementById("log");
    if (!log || !log.children.length) return "<p class=\"muted\">Keine Ereignisse.</p>";
    return Array.from(log.children).slice(0, 40).map((n) => "<p>" + origEsc(n.textContent) + "</p>").join("");
  }
  function wikiItems() { return (window.EZS_WIKI && EZS_WIKI.items) || []; }
  function wikiByName(name) { return wikiItems().find((i) => i.name === name) || null; }
  function exert(kind) {
    if (!state) return;
    // DESIGN-Schritte. Wiki: Müdigkeit senkt KP, Energie kritisch ab 40%, Strahlung existiert, REP je 10 Felder.
    let fatAdd = kind === "fight" ? 8 : kind === "sleep" ? 0 : 3;
    if (state.race === "Mutant" && fatAdd > 0) fatAdd += 1; // WIKI: Mutanten werden schneller müde (Handbuch S.12); +1 DESIGN
    if (kind !== "sleep") state.fatigue = Math.min(100, (state.fatigue || 0) + fatAdd);
    if (kind === "sleep") {
      state.fatigue = Math.max(0, (state.fatigue || 0) - 40);
      state.energy = Math.min(200, (state.energy || 0) + 20);
    } else if (kind !== "travel") {
      state.energy = Math.max(0, (state.energy == null ? 100 : state.energy) - (kind === "fight" ? 6 : 2));
    }
    if (state.locId === "uranfeld" && kind !== "sleep") state.radiation = Math.min(100, (state.radiation || 0) + 2);
    // WIKI Handbuch S.3: "Bei einer zu hohen Strahlung oder zu hohen Müdigkeit wirst du stark verletzt." Grenze 100% DESIGN.
    if (kind !== "sleep" && !longSafe && ((state.fatigue || 0) >= 100 || (state.radiation || 0) >= 100) && !isInjured(state)) {
      state.injuredUntil = Date.now() + INJURY_MS;
      log("Zu hohe " + ((state.radiation || 0) >= 100 ? "Strahlung" : "Müdigkeit") + ": Du bist stark verletzt.", "bad");
    }
    if (kind === "travel") {
      state.repSteps = (state.repSteps || 0) + 1;
      if (state.repSteps % 10 === 0) state.rep = (state.rep || 0) + 1; // WIKI
    }
    if (kind === "craft" && ["Chemiker", "Schneider", "Waffentechniker"].includes(state.job)) {
      state.kreativ = (state.kreativ || 0) + 1; // WIKI: 1 Punkt pro AG dieser Berufe
    }
    if (kind === "trade") state.hep = (state.hep || 0) + 1; // DESIGN: Wiki gibt HEP erst ab 501 Einheiten
    if ((kind === "herb" || kind === "pilz") && ["Gärtner", "Pilzsammler"].includes(state.job)) state.nv = (state.nv || 0) + 1;
  }
  function maybeFindWiki() {
    const pool = wikiItems().filter((i) => i.find && !(state.inv[i.name] > 0));
    if (!pool.length || Math.random() > 0.12) return null;
    const it = pool[rand(0, pool.length - 1)];
    addInv(state, it.name, 1);
    return it.name;
  }
  function spendAttr(name) {
    if (!state || state.dead || !(state.cp > 0)) return;
    if (!ATTRS.includes(name)) return;
    state.cp -= 1;
    state.attrs[name] = (state.attrs[name] || 0) + 1;
    log(name + " +1.", "good");
    save({ quiet: true });
    renderAll();
  }
  function origAct(label, kind) {
    return "<p>" + origLink(label, 'data-act="' + kind + '"') + "</p>";
  }
  function origRep(label, aid, n) {
    return "<p>" + origLink(label, 'data-rep="' + aid + ":" + n + '"') + "</p>";
  }
  function costBits(obj) {
    return Object.entries(obj).map(([k, v]) => v + " " + (k === "gold" ? "Gold" : k)).join(" + ");
  }
  function landViewHtml() {
    const loc = locById(origLandId || state.locId) || locById(state.locId);
    if (!loc) return origStub("Land");
    const gate = placeGate(loc);
    const resMap = { holz: "Holz", stein: "Stein", metall: "Metall", kunststoff: "Kunststoff", wasser: "Wasser", sand: "Sand", oel: "Öl", gas: "Gas", erz: "Erz" };
    const seen = [];
    (loc.actions || []).forEach((a) => { if (resMap[a] && seen.indexOf(resMap[a]) < 0) seen.push(resMap[a]); });
    const resRows = landStockRows(loc);
    let acts = "";
    const hereOk = loc.id === state.locId || gate.open;
    if (loc.id !== state.locId && gate.open) acts += "<br>" + origLink("Zu diesem Land gehen", 'data-loc="' + loc.id + '"');
    if (hereOk) {
      (loc.actions || []).forEach((aid) => {
        const def = ACTIONS[aid];
        if (!def || aid === "visit") return;
        if (def.show && !def.show(state)) return;
        acts += "<br>" + origLink(def.label, 'data-here="' + loc.id + "|" + aid + '"');
      });
      if (loc.id !== "camp" && !(loc.actions || []).includes("graben")) acts += "<br>" + origLink("Graben", 'data-here="' + loc.id + '|graben"');
      if ((loc.enemies || []).length) acts += "<br>" + origLink("Kämpfen", 'data-here="' + loc.id + '|fight"');
    } else acts += "<br><span class=\"muted\">" + origEsc(gate.text) + "</span>";
    const who = loc.id === state.locId ? "<p>" + origEsc(state.name) + "(" + state.ep + ")</p>" : "";
    const standing = typeof state.px === "number" && loc.x === state.px && loc.y === state.py;
    if (standing && (loc.tags || []).includes("Höhle")) {
      const enterAid = (loc.actions || []).includes("cave") ? "cave" : ((loc.actions || []).includes("visit") ? "visit" : "");
      if (enterAid) acts += "<br>" + origLink("Betreten", 'data-here="' + loc.id + "|" + enterAid + '"');
    }
    return "<p><b>Position: (" + loc.x + " / " + loc.y + ")</b> " + origEsc(loc.name) + "</p>" + origLive() + questInfoHtml(loc) +
      (loc.trade ? "<p>" + origLink("Handeln", 'data-page="handeln"') + "</p>" : "") +
      '<div class="land"><div class="land-pic" title="' + origEsc(loc.name) + '"></div><div>' +
      '<p class="land-back">' + origLink("zurück", 'data-page="landkarte"') + "</p>" +
      "<table><tr><td>Besitzer:</td><td>Dieses Land ist noch frei.</td></tr>" + resRows + "</table>" +
      "<p>Mögliche Aktionen:" + (acts || "<br><span class=\"muted\">keine</span>") + "</p></div></div>" +
      "<p><b>Folgende Spieler stehen hier:</b> (in Klammern siehst du deren Erfahrungspunkte)</p>" + who;
  }
  const PAGE_FACTS = {
    forschung: ["Forschungsgrundstück steht vor dem Forschungsgebäude.", "Researchlevel steigt mit den Gebäuden.", "Die Kostenzahlen im Wiki haben keinen Rohstoffnamen."],
    erzver: ["Erz wird zu Edelmetall veredelt.", "Voraussetzung: Forschungsgebäude, Researchlevel 3.", "Mit allen Ausbauten: 75 Erz → 20 Edelmetall in 30 Minuten."],
    uranver: ["Natururan → Yellow Cake, Researchlevel 11.", "Yellow Cake → Uranhexafluorid, Researchlevel 12.", "Uranhexafluorid → Uranoxid, Researchlevel 13."],
    biolabor: ["Hier entstehen biologische Stoffe.", "Researchlevel 15, 750 Intelligenz, Beruf Biologe.", "Bauzeit 240 min."],
    werkstatt: ["Fahrzeuge und Fluggeräte. Nur Mechaniker.", "Researchlevel 10, 150 Intelligenz.", "Die Garage ist extra nötig. Lagerrecht 7."],
    rakete: ["Raketenbau ist eine Quelle von Bauerfahrung.", "Eine eigene Kostenliste steht im Wiki nicht."],
    lagerrecht: ["Lagerrecht 5: Stall.", "Lagerrecht 7: Garage.", "Lagerrecht 9: einen Stammkampf anfangen."],
    stammkampf: ["Lagerrecht mindestens 9.", "Höchstens 9 Angreifer und 10 Verteidiger.", "Kampf 60 Minuten. Sieg: 2 EP, 2 CP, 2 SKEP."],
    modpin: ["Pinnwand der Moderatoren.", "Ohne Server gibt es keine Moderationsnotizen."],
    modakt: ["Aktionen der Moderatoren.", "Ohne Server passiert hier nichts."],
    uebersicht: null,
    umfrage: ["Keine laufende Umfrage."],
    galerie: null,
    blogs: ["Keine Blogs auf diesem Rechner."],
    stats: null,
    sponsor: ["Es gibt keinen Shop und kein Sponsoring."],
    einstellungen: ["Kein Passwort. Der Charakter bleibt in diesem Browser."],
    signatur: null,
    beitreten: ["Es gibt keine anderen Stämme, denen du beitreten kannst.", "Einen eigenen Stamm gründest du unter Gründung."],
  };
  function factBlock(title, lines) {
    return "<h2>" + origEsc(title) + "</h2>" + lines.map((l) => "<p>" + l + "</p>").join("");
  }
  function wikiFill(page) {
    if (page === "tierstall" || page === "garage" || page === "haus" || page === "gebaeude") return null;
    const online = "<p class=\"muted\">Nur dieser Rechner.</p>";
    if (PAGE_FACTS[page]) return factBlock(STUBS[page] || page, PAGE_FACTS[page]) ;
    const b = (window.EZS_WIKI && EZS_WIKI.buildings || []).find((x) => x.page === page);
    if (b) {
      const bit = (b.text || "").split(". ")[0];
      return factBlock(b.title, [bit.endsWith(".") ? bit : bit + "."]);
    }
    if (page === "schlafen") {
      return "<h2>Schlafen</h2><p>Müdigkeit: " + (state.fatigue || 0) + "%. Energie: " + (state.energy == null ? 100 : state.energy) + "%.</p>" +
        "<p>" + origLink("schlafen", 'data-page="do-sleep"') + "</p>" +
        "<p class=\"muted\">Wiki: hohe Müdigkeit senkt die Kampfpunkte. Der Abzug beim Schlafen ist DESIGN (−40 Müdigkeit, +20 Energie).</p>";
    }
    if (page === "postfach" || page === "notiz" || page === "donnertafel" || page === "pinnwand" || page === "radio") {
      const key = { postfach: "post", notiz: "block", donnertafel: "board", pinnwand: "pin", radio: "board" }[page];
      const titles = { postfach: "Postfach", notiz: "Notizblock", donnertafel: "Donnertafel", pinnwand: "Pinnwand", radio: "Dein Radio" };
      const val = (state.notes && state.notes[key]) || "";
      return "<h2>" + titles[page] + "</h2>" + online +
        '<p><textarea id="orig-note" data-note="' + key + '" rows="6" style="width:95%;background:#111;color:#eee;border:1px solid #666">' + origEsc(val) + "</textarea></p>" +
        "<p>" + origLink("merken", 'data-page="save-note"') + "</p>";
    }
    if (page === "usersuche") return "<h2>Usersuche</h2>" + online + "<p>" + origEsc(state.name) + " (" + state.ep + " EP)</p>";
    if (page === "forum") return "<h2>Forum</h2>" + online + "<p>Kein lebendes Forum. Notizen stehen im Notizblock.</p>";
    if (page === "com" || page === "news" || page === "hof") {
      const h = { com: "Community", news: "News", hof: "Hall of Fame" }[page];
      return "<h2>" + h + "</h2>" + online + "<p>Eine Rangliste anderer Spieler gibt es ohne Server nicht.</p>";
    }
    if (page === "laender") {
      const been = Object.keys(state.visited || {});
      const lines = been.length ? been.map((id) => "<p>" + origLink(id, 'data-land="' + origEsc(id) + '"') + "</p>").join("") : "<p>Noch kein weiteres Land betreten.</p>";
      return "<h2>Deine Länder</h2><p>Landkauf gibt es hier nicht.</p>" + lines;
    }
    if (page === "mitglieder") {
      if (!state.stamm) return "<h2>Mitglieder</h2><p>Du bist in keinem Stamm.</p>";
      const rows = (state.stamm.members || []).map((m) => "<p>" + origEsc(m.name) + " — " + origEsc(m.flavor || "") + "</p>").join("");
      return "<h2>Mitglieder</h2><p>Oberhaupt: " + origEsc(state.name) + "</p>" + rows + online;
    }
    if (page === "lagerlogs") return "<h2>Lagerlogs</h2>" + origLogHtml();
    if (page === "lageritems") {
      if (!state.stamm) return "<h2>Gegenstände</h2><p>Du bist in keinem Stamm.</p>";
      const bag = state.stamm.storage || {};
      const lines = Object.keys(bag).map((k) => "<p>" + origEsc(k) + ": " + bag[k] + "</p>").join("");
      return "<h2>Gegenstände im Lager</h2>" + (lines || "<p class=\"muted\">Leer.</p>");
    }
    if (page === "stammopt") return "<h2>Optionen</h2><p>Oberhaupt: " + origEsc(state.name) + ".</p>" + (state.stamm ? "<p>" + origLink("Stamm verlassen", 'data-page="verlassen"') + "</p>" : "<p>Kein Stamm.</p>") + online;
    if (page === "hilfe") return null;
    return null;
  }
  function renderOrigPage() {
    const page = origPage;
    const extHtml = extPage(page);
    if (extHtml != null) return extHtml;
    if (page === "erkunden") {
      const here = (typeof state.px === "number" && placeAt(state.px, state.py)) || locById(state.locId);
      const dyn = (state.attrs && state.attrs.Dynamik) || 1;
      const name = here ? here.name : "Freies Land";
      const xy = (typeof state.px === "number") ? (state.px + " / " + state.py) : "—";
      return "<h2>Erkunden</h2>" +
        "<p>Du stehst in " + origEsc(name) + " (" + xy + ").</p>" +
        "<p>Dynamik: " + dyn + ". Bei 4000 etwa 50% Fundchance, bei 1 etwa 1%.</p>" +
        "<p>" + origLink("Erkunden", 'data-page="do-erkunden"') + "</p>";
    }
    if (page === "land") return landViewHtml();
    if (page === "schlafen") return sleepPageHtml();
    if (page === "tierstall") return tierPageHtml();
    if (page === "tierkampf") return pitPageHtml();
    if (page === "profil") return "<h2>Dein Profil</h2><p>" + origEsc(state.name) + "</p><p>Beruf: " + origEsc(state.job) + "</p>";
    if (page === "einstellungen") return factBlock("Einstellungen", PAGE_FACTS.einstellungen);
    if (page === "signatur") return factBlock("Deine Signatur", [origEsc(state.name) + " · " + origEsc(state.job) + " · " + state.ep + " EP"]);
    if (page === "logout") return "<h2>Logout</h2><p>" + origLink("Logout", 'data-page="do-logout"') + "</p>";
    const filled = wikiFill(page);
    if (filled) return filled;
    if (STUBS[page]) return origStub(STUBS[page]) + "<p class=\"muted\">Online-Spiel ist nicht zurück.</p>";
    if (page === "ereignisse") return "<h2>Ereignisse</h2>" + origLogHtml();
    if (page === "status") {
      const rows = ATTRS.map((a) => {
        const v = state.attrs[a] || 0;
        const w = Math.max(6, Math.min(100, Math.round((v / 20) * 100)));
        const go = state.cp > 0 ? '<input class="stat-in" value="1" size="2" disabled> ' + origLink("Go!", 'data-attr="' + a + '"') : "";
        return "<tr><td>" + origEsc(a) + ":</td><td><span class=\"ebar\"><i style=\"width:" + w + "%\"></i></span></td><td>" + v + "</td><td>" + go + "</td></tr>";
      }).join("");
      return "<h2>Dein Charakter</h2>" +
        "<p>Du hast noch " + state.cp + " Charakterpunkte zu verteilen.</p>" +
        "<p>Nickname: " + origEsc(state.name) + " &nbsp;&nbsp; " + origLink("Dein Profil", 'data-page="profil"') +
        "<br>Beruf: " + origEsc(state.job) + " &nbsp;&nbsp; " + origLink("Einstellungen", 'data-page="einstellungen"') +
        "<br>Techlevel: " + (state.techlevel || 0) + " &nbsp;&nbsp; " + origLink("Deine Signatur", 'data-page="signatur"') +
        "<br>Erfahrung: " + state.ep +
        "<br>Karma: " + origEsc(karmaLabel(state)) + "</p>" +
        "<h2>Eigenschaften</h2><table>" + rows + "</table>" +
        "<h2>Fähigkeiten-Werte</h2><p class=\"muted\">Wiki: das sind keine CP-Eigenschaften. Go! gibt es dafür nicht.</p><table>" +
        "<tr><td>Kampferfahrung:</td><td>" + (state.kep || 0) + "</td></tr>" +
        "<tr><td>Handelserfahrung:</td><td>" + (state.hep || 0) + "</td></tr>" +
        "<tr><td>Reiseerfahrung:</td><td>" + (state.rep || 0) + "</td></tr>" +
        "<tr><td>Naturverbundenheit:</td><td>" + (state.nv || 0) + "</td></tr>" +
        "<tr><td>Flexibilität:</td><td>" + (state.flex || 0) + "</td></tr>" +
        "<tr><td>Kreativität:</td><td>" + (state.kreativ || 0) + "</td></tr></table>" + resetHtml();
    }
    if (page === "rucksack") {
      const owned = Object.keys(state.inv).filter((k) => state.inv[k] > 0 && k !== "Nahrung" && k !== "Wasser"); // Durchgang 9: Vorrat steht oben extra
      const buckets = { Waffen: [], Kleidung: [], Ressourcen: [], Sonstiges: [] };
      owned.forEach((k) => buckets[itemBucket(k)].push(k));
      let body = "<p>Gold: " + state.gold + "</p>";
      Object.keys(buckets).forEach((title) => {
        const names = buckets[title].sort((a, b) => a.localeCompare(b, "de"));
        if (!names.length) return;
        body += '<div class="pack"><h3>' + title + "</h3>";
        names.forEach((k) => {
          const it = wikiByName(k);
          let eq = it && it.slot ? " " + origLink("anlegen", 'data-equip="' + origEsc(k) + '"') : "";
          if (k === "Wurfnetz" && !eq) eq = " " + origLink("anlegen", 'data-equip="Wurfnetz"');
          if (POTIONS[k]) eq += " " + origLink("nehmen", 'data-use="' + origEsc(k) + '"');
          eq += extInvLinks(k);
          const ico = ICONS[k] ? '<img src="' + ICONS[k] + '" alt="" style="width:14px;height:14px;vertical-align:-2px"> ' : "";
          const label = (k === "Nahrung" || k === "Wasser") ? k + " (Vorrat)" : k;
          body += "<p>" + ico + origEsc(label) + ": " + state.inv[k] + eq + "</p>";
        });
        body += "</div>";
      });
      if (!owned.length) body += "<p class=\"muted\">Der Rucksack ist leer.</p>";
      body += "<p>Rohstoffe: " + packLoad(state) + " / " + packCap(state) + " Einheiten (Größe DESIGN; ein Esel trägt laut Wiki ca. 7× so viel).</p>";
      if (state.pet) body += "<p>Tier: " + origEsc(state.pet.name) + " " + origLink("Tierstall", 'data-page="tierstall"') + "</p>";
      return "<h2>Rucksack</h2>" + body;
    }
    if (page === "ausruestung") {
      const eq = state.equip || {};
      const worn = (key, fallback) => {
        const n = eq[key];
        if (n && (state.inv[n] || 0) > 0) return n;
        return fallback || "";
      };
      const w = bestWeapon(state);
      const c = bestClothing(state);
      const v = getActiveVehicle(state);
      const vehPic = v ? '<img class="slot-img" src="' + v.img + '" alt="">' : '<span class="slot-frame"></span>';
      const vehLine = v
        ? origEsc(v.name) + " [" + origLink("in Garage", 'data-page="garage"') + "]"
        : "keins";
      const bonus = v && v.kpBonus ? "<p>Zusätzliche Kampfpunkte: " + v.kpBonus + "</p>" : "";
      const ownedEq = wikiItems().filter((i) => i.slot && (state.inv[i.name] || 0) > 0)
        .map((i) => "<p>" + origEsc(i.name) + " " + origLink("anlegen", 'data-equip="' + origEsc(i.name) + '"') + "</p>").join("");
      return "<h2>Ausrüstung</h2><p>Um etwas anzuziehen musst du es in die Rechte Hand nehmen.</p>" +
        '<div class="doll">' +
        '<div class="doll-top">' + dollSlot("Kopf:", worn("kopf")) + "</div>" +
        '<div class="doll-hands">' + dollSlot("In linker Hand:", worn("links")) + dollSlot("In rechter Hand:", worn("rechts") || (w ? w.name : "")) + "</div>" +
        '<div class="doll-body">' + dollSlot("Körper:", worn("koerper") || (c ? c.name : "")) + "</div>" +
        '<div class="doll-legs">' + dollSlot("Unterleib:", worn("unterleib")) + "</div>" +
        '<div class="doll-feet">' + dollSlot("linker Fuß:", worn("lfuss")) + dollSlot("rechter Fuß:", worn("rfuss")) + "</div>" +
        "<p>" + (function () {
          const bag = wikiItems().filter((i) => i.slot && (state.inv[i.name] || 0) > 0);
          if (!bag.length) return "Anlegen geht aus dem Rucksack, über die Rechte Hand. Im Rucksack liegt gerade nichts Anlegbares.";
          return "Anlegen geht aus dem Rucksack, über die Rechte Hand. Dabei: " + bag.slice(0, 6).map((i) => i.name).join(", ") + ".";
        })() + "</p>" +
        "<p><b>Fahrzeug</b></p><div class=\"doll-top\">" + vehPic + "<p>" + vehLine + "</p></div>" + bonus +
        "<p><b>Tier</b></p><p>" + (state.pet ? origEsc(state.pet.name) + " (" + state.pet.type + ")" : "keins") + " [" + origLink("Tierstall", 'data-page="tierstall"') + "]</p>" +
        "<p><b>Gürtel</b>: " + origEsc(wornBelt(state) || "keiner") + " · <b>Amulette</b>: " + origEsc((eq.amulette || []).join(", ") || "keine") + " [" + origLink("Artefaktschmiede", 'data-page="artefakte"') + "]</p>" +
        "<p><b>Schild</b>: " + (shieldOf(state) ? origEsc(shieldOf(state).name) + " (Verteidigung " + shieldOf(state).def + ")" : "keins") +
        (ammoNeed(state) ? " · <b>Munition</b>: " + origEsc(ammoNeed(state)) + " " + (state.inv[ammoNeed(state)] || 0) : "") + "</p>" +
        (ownedEq ? "<p><b>Im Rucksack</b></p>" + ownedEq : "") +
        "</div>";
    }
    if (page === "arbeiten") {
      const jobLine = {
        Holzsammler: "Der Holzsammler sammelt Holz, kann Holzkohle finden. Werkzeug: keins.",
        Geologe: "Ein Geologe sammelt Steine, kann Schwefel und Kalisalpeter finden.",
        Metallbauer: "Der Metallbauer sammelt Metall. Werkzeug: keins.",
        Kunststoffsammler: "Der Kunststoffsammler baut direkt Kunststoff ab, kann einzelne Erzstücke finden.",
        Sandsucher: "Der Sandsucher kann auf eigenen oder auf freien Ländern Sand abbauen.",
      };
      const blurb = jobLine[state.job] || "Die Zeilen unten sind die Arbeitsgänge dieses Prototyps.";
      const rows = [
        { aid: "holz", n: 1, label: "Holz sammeln", attr: 'data-act="holz"' },
        { aid: "holz", n: 5, label: "5× Holz sammeln", attr: 'data-rep="holz:5"' },
        { aid: "stein", n: 1, label: "Stein abbauen", attr: 'data-act="stein"' },
      ];
      const body = rows.map((r) => {
        const sec = Math.round(((ACTIONS[r.aid].duration || 4000) * r.n) / 1000);
        const active = workUi && !workUi.long && workUi.aid === r.aid && workUi.n === r.n;
        const pct = active ? Math.max(0, Math.min(100, workUi.pct || 0)) : 0;
        const bar = active ? '<div class="work-bar"><i style="width:' + pct + '%"></i></div>' : "";
        return '<div class="work-row"><p>' + origLink(r.label, r.attr) + ' <span class="muted">' + sec + " Sekunden</span></p>" + bar + "</div>";
      }).join("");
      return "<h2>Arbeiten</h2><p>Beruf: " + origEsc(state.job) + "</p><p>" + origEsc(blurb) + "</p>" +
        '<p class="muted">Im Wiki dauert ein Arbeitsgang 30 Minuten. Der Balken hier ist nur die kurze Prototyp-Zeit.</p>' + body + longWorkHtml();
    }
    if (page === "graben") {
      return "<h2>Graben</h2>" + origLive() +
        origAct("Graben", "graben") + origRep("5× Graben", "graben", 5) + origRep("10× Graben", "graben", 10);
    }
    if (page === "wassersuche") return "<h2>Wassersuche</h2>" + origLive() + origAct("Wasser suchen", "wasser");
    if (page === "jagen" || page === "kaempfen") {
      const loc = locById(state.locId);
      const foes = loc ? availableEnemiesAt(loc) : [];
      const title = page === "jagen" ? "Jagen" : "Kämpfen";
      let html = "<h2>" + title + "</h2>" + origLive();
      if (page === "jagen") {
        const net = state.equip && state.equip.rechts === "Wurfnetz";
        html += "<p class=\"muted\">Wiki: mit dem Wurfnetz in der Hand auf die Jagd gehen, dann kann man ein Tier fangen (ab 400 EP). " +
          (net ? "Das Wurfnetz ist in deiner rechten Hand." : "Wurfnetz im Rucksack anlegen.") + "</p>" + kleintiereHtml();
      }
      if (foes.length) {
        foes.forEach((f) => {
          const where = LOCATIONS.filter((l) => (l.enemies || []).includes(f.id)).map((l) => l.name);
          html += "<p>" + origEsc(f.name) + " — hier in " + origEsc(loc.name) + ".</p>";
          html += "<p class=\"muted\">Auch: " + origEsc(where.slice(0, 6).join(", ")) + "</p>";
          html += "<p>" + origLink("kämpfen", 'data-foe="' + f.id + '"') + "</p>";
        });
      } else {
        const dogs = LOCATIONS.filter((l) => (l.enemies || []).includes("wild_dog")).map((l) => l.name);
        html += "<p>Hier ist kein Tier.</p>";
        html += "<p>Wilder Hund steht in: " + origEsc(dogs.join(", ")) + ".</p>";
        html += "<p>" + origLink("zum nächsten Hund", 'data-act="kampf"') + "</p>";
      }
      return html;
    }
    if (page === "faehigkeiten") {
      const jobs = availableJobs(state);
      let html = "<h2>Fähigkeiten</h2><p>Beruf: " + origEsc(state.job) + "</p>";
      [JOBS_TL0, JOBS_TL1, JOBS_TL2, JOBS_TL3, JOBS_TL4, JOBS_TL5, JOBS_TL6, JOBS_TL7, JOBS_TL8, JOBS_TL9].forEach((group, tl) => {
        html += "<h3>TL " + tl + "</h3>";
        group.forEach((name) => {
          const on = state.job === name;
          const open = jobs.includes(name);
          const act = on ? " — aktuell" : (open ? " " + origLink("erlernen", 'data-job="' + origEsc(name) + '"') : "");
          html += "<p>" + origEsc(name) + act + "</p>";
        });
      });
      return html + skillTreeHtml();
    }
    if (page === "herstellen") {
      const rows = CRAFTS.map((c) => {
        const cost = c.cost ? " — " + origEsc(costBits(c.cost)) : "";
        return "<p>" + origEsc(c.label) + cost + " " + origLink("bauen", 'data-craft="' + c.id + '"') + "</p>";
      }).join("");
      return "<h2>Herstellen</h2><p>Beruf: " + origEsc(state.job) + "</p>" + rows;
    }
    if (page === "bauoptionen") {
      const owned = (id) => state.buildings && state.buildings[id];
      const bAct = (id) => {
        const b = BUILDINGS.find((x) => x.id === id);
        if (!b) return "";
        if (owned(id)) return "steht";
        const afford = canPay(state, b.cost);
        return afford ? origLink("aufbauen", 'data-build="' + id + '"') : '<span class="cant">aufbauen</span>';
      };
      const bCost = (id) => {
        const b = BUILDINGS.find((x) => x.id === id);
        return b ? "Benötigt: " + origEsc(costBits(b.cost)) : "";
      };
      const s = state.stamm;
      const mensch = s && (s.wallMensch || (s.wall && state.race !== "Mutant" && !s.wallMutant));
      const mutant = s && (s.wallMutant || (s.wall && state.race === "Mutant" && !s.wallMensch));
      const wallRow = (src, label, flag, pageId) => {
        if (!s) return photoRow(src, label, ['<span class="cant">erst einen Stamm gründen</span>', "Benötigt: " + origEsc(costBits(STAMM_WALL_COST))]);
        const act = flag ? "100% steht" : "0% " + origLink("aufbauen", 'data-page="' + pageId + '"');
        return photoRow(src, label, [act, "Benötigt: " + origEsc(costBits(STAMM_WALL_COST))]);
      };
      return "<h2>Bauoptionen</h2>" +
        "<p>Herstellen von Werkzeugen und Waffen ist eine eigene Zeile.</p>" +
        "<p>" + origLink("Herstellen", 'data-page="herstellen"') + " · " + origLink("Chemieküche", 'data-page="chemie"') + " · " + origLink("Ideenschmiede", 'data-page="ideenschmiede"') +
        " · " + origLink("Stammgebäude", 'data-page="stammgeb"') + " · " + origLink("Waffenfabrik", 'data-page="waffenfabrik"') + "</p>" +
        wallRow("assets/gfx/buildings/menschenwall2.jpg", "Menschenwall", mensch, "wall-mensch") +
        wallRow("assets/gfx/buildings/mutantenwall2.jpg", "Mutantenwall", mutant, "wall-mutant") +
        photoRow("assets/gfx/buildings/lagerfeuer_aus2.jpg", "Feuerstelle", [bAct("lagerfeuer"), bCost("lagerfeuer")]) +
        photoRow("assets/gfx/buildings/brunnen2.jpg", "Brunnen", [bAct("brunnen"), bCost("brunnen")]) +
        photoRow("assets/gfx/buildings/farm2.jpg", "Farm", [bAct("farm"), bCost("farm")]) +
        photoRow("assets/gfx/buildings/stall.jpg", "Tierstall", ["Maximal 25 Tiere.", "Ab Lagerrecht 5 und 650 EP.", origLink("öffnen", 'data-page="tierstall"')]);
    }
    if (page === "gebaeude" || page === "haus") {
      const rows = BUILDINGS.map((b) => {
        const owned = state.buildings && state.buildings[b.id];
        let act = "steht";
        if (!owned) {
          const afford = canPay(state, b.cost);
          act = afford ? origLink("aufbauen", 'data-build="' + b.id + '"') : '<span class="cant">aufbauen</span>';
        }
        return photoRow(b.img, origEsc(b.name), [act, "Benötigt: " + origEsc(costBits(b.cost))]);
      }).join("");
      const title = page === "haus" ? "Haus" : "Gebäude";
      return "<h2>" + title + "</h2><p>Bauen geht im Ruinencamp.</p>" + rows;
    }
    if (page === "handeln") {
      const loc = locById(state.locId);
      if (!loc || !loc.trade) return "<h2>Handeln</h2><p>Kein Händler hier.</p>";
      const rows = TRADE.filter((t) => tradeHere(t, loc)).map((t) => {
        const cur = t.payItem ? " " + t.payItem : " G";
        const bulk = (t.item === "Wasser" || t.item === "Nahrung") ? " " + origLink("50×", 'data-buy="' + origEsc(t.item) + '|50"') : t.payItem ? "" : " " + origLink("151×", 'data-buy="' + origEsc(t.item) + '|151"');
        const sellPart = t.sell ? " · Verkauf " + sellPrice(t) + " G " + origLink("verkaufen", 'data-sell="' + origEsc(t.item) + '"') : "";
        return "<p>" + origEsc(t.item) + " — Kauf " + buyPrice(t) + cur + " " + origLink("kaufen", 'data-buy="' + origEsc(t.item) + '"') + " " + origLink("10×", 'data-buy="' + origEsc(t.item) + '|10"') + bulk + sellPart + "</p>";
      }).join("");
      const offer = state.petOffer ? "<p>Der Händler bietet dir ein Tier an: " + origEsc(state.petOffer.type) + " für " + state.petOffer.price + " Gold. " + origLink("zum Tierstall", 'data-page="tierstall"') + "</p>" : "";
      return "<h2>Handeln</h2><p>Gold: " + state.gold + "</p>" + offer +
        "<p class=\"muted\">Wiki: Wer mindestens 151 Einheiten auf einmal kauft (kein Wasser, keine Nahrung), bekommt manchmal ein Tier angeboten. Mehr Ausstrahlung, mehr Angebote. Ab 400 EP.</p>" + rows;
    }
    if (page === "landkarte") {
      if (typeof state.px !== "number") {
        const boot = locById(state.locId);
        state.px = boot ? boot.x : 50;
        state.py = boot ? boot.y : 100;
      }
      const COLS = 15, ROWS = 12;
      const x0 = state.px - 7;
      const y0 = state.py - 5;
      let cells = "";
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const x = x0 + col;
          const y = y0 + row;
          const place = placeAt(x, y);
          const you = x === state.px && y === state.py;
          const cave = place && (place.tags || []).includes("Höhle");
          let cls = "field-cell";
          if (cave) cls += " cave";
          else if (place) cls += " place";
          if (you) cls += " you";
          const label = you ? '<span class="arr">▲</span><span class="du">Du</span>' : '<span class="xy">' + x + '</span><span class="xy">' + y + '</span>';
          const title = (place ? place.name + " " : "") + "(" + x + " / " + y + ")" + (you ? " Du" : "");
          let bg = "#2a2a2a", fg = "#c8c8c8", edge = "#111";
          if (cave) { bg = "#3a3420"; fg = "#e6c35c"; }
          else if (place) { bg = "#243028"; fg = "#d5e6df"; }
          if (you) { bg = "#4a1515"; fg = "#ff4040"; edge = "#ff4040"; }
          const cellStyle = "display:flex;flex-direction:column;align-items:center;justify-content:center;width:40px;height:40px;box-sizing:border-box;border:1px solid " + edge + ";background:" + bg + ";color:" + fg + ";font-size:9px;line-height:1.05;text-decoration:none;padding:0;overflow:hidden;";
          cells += '<a href="#" class="' + cls + '" style="' + cellStyle + '" data-cell="' + x + "," + y + '" title="' + origEsc(title) + '">' + label + "</a>";
        }
      }
      const here = placeAt(state.px, state.py);
      const hereName = here ? here.name : "Freies Land";
      const speed = (state.attrs && state.attrs.Geschwindigkeit) || 1;
      const goal = state.mapTarget ? "<p>Ziel: (" + state.mapTarget.x + " / " + state.mapTarget.y + ")</p>" : "";
      return "<h2>Landkarte</h2>" +
        '<div class="field-wrap" style="display:block;max-width:100%;overflow:auto;">' +
        '<div class="field-grid" style="display:grid;grid-template-columns:repeat(15,40px);gap:2px;width:max-content;max-width:100%;">' + cells + "</div></div>" +
        "<p>Du bist hier: " + origEsc(hereName) + " (" + state.px + " / " + state.py + ")</p>" +
        goal +
        teleportHtml() +
        "<p class=\"muted\">Geschwindigkeit " + speed + ". Zehn Felder geben 1 Reiseerfahrung. Nachbarfeld: ein Schritt. Weiter weg: ein Schritt auf das Ziel zu. Dein Feld: Landansicht.</p>";
    }
    if (page === "uebertragen" || page === "lagerres") {
      if (!state.stamm) return "<h2>" + (page === "lagerres" ? "Ressourcen" : "Übertragen") + "</h2><p>Du bist in keinem Stamm.</p>";
      const bag = state.stamm.storage || {}; const lines = Object.keys(bag).map((k) => "<p>" + origEsc(k) + ": " + bag[k] + "</p>").join("");
      return "<h2>" + origEsc(state.stamm.name) + "</h2>" + (lines || "<p class=\"muted\">Lager leer.</p>");
    }
    if (page === "beitreten") return factBlock("Beitreten", PAGE_FACTS.beitreten);
    if (page === "gruendung" || page === "stamm") {
      if (!state.stamm) {
        return "<h2>Stamm</h2><p>Gründung</p><p><input id=\"orig-stamm-name\" maxlength=\"24\" value=\"Wüstenfüchse\"></p>" +
          "<p>" + origLink("gründen", 'data-page="stamm-found"') + "</p><p>Benötigt: " + origEsc(costBits(STAMM_FOUND_COST)) + "</p>" +
          "<p>" + origLink("Beitreten", 'data-page="beitreten"') + "</p>";
      }
      const s = state.stamm;
      if (s.wall && !s.wallMensch && !s.wallMutant) {
        if (state.race === "Mutant") s.wallMutant = true;
        else s.wallMensch = true;
      }
      const lvl = Math.min(20, s.lagerLevel || 0);
      const pct = Math.round((lvl / 20) * 100);
      const wallLine = (flag, pageId) => (flag ? "100% steht" : "0% " + origLink("aufbauen", 'data-page="' + pageId + '"'));
      const built = (id) => state.buildings && state.buildings[id];
      const bAct = (id) => built(id) ? "steht" : origLink("aufbauen", 'data-build="' + id + '"');
      const bCost = (id) => {
        const b = BUILDINGS.find((x) => x.id === id);
        return b ? "Benötigt: " + origEsc(costBits(b.cost)) : "";
      };
      return "<h2>" + origEsc(s.name) + "</h2>" +
        "<p>Oberhaupt: " + origEsc(state.name) + "</p>" +
        photoRow(null, "Stammlager:", [lvl + "/20 " + origLink("vergrössern", 'data-page="lager-up"'), pct + "%", "Benötigt: " + origEsc(costBits(STAMM_UPGRADE_COST))]) +
        photoRow("assets/gfx/buildings/menschenwall2.jpg", "Menschenwall:", [wallLine(s.wallMensch, "wall-mensch"), "Schützt das Lager vor Menschen.", "Benötigt: " + origEsc(costBits(STAMM_WALL_COST))]) +
        photoRow("assets/gfx/buildings/mutantenwall2.jpg", "Mutantenwall:", [wallLine(s.wallMutant, "wall-mutant"), "Schützt das Lager vor Mutanten.", "Benötigt: " + origEsc(costBits(STAMM_WALL_COST))]) +
        photoRow("assets/gfx/buildings/lagerfeuer_aus2.jpg", "Feuerstelle:", [bAct("lagerfeuer"), bCost("lagerfeuer")]) +
        photoRow("assets/gfx/buildings/brunnen2.jpg", "Brunnen:", [bAct("brunnen"), bCost("brunnen")]) +
        photoRow("assets/gfx/buildings/farm2.jpg", "Farm:", [bAct("farm"), bCost("farm")]) +
        photoRow("assets/gfx/buildings/stall.jpg", "Tierstall:", [origLink("öffnen", 'data-page="tierstall"'), "Maximal 25 Tiere. Ab Lagerrecht 5."]) +
        "<p>Löschvorrichtung: kein Bild vorhanden.</p><p>Wiki nennt 3000 / 500, ohne Rohstoffnamen.</p>";
    }
    if (page === "tierstall") {
      const pets = ["Hund", "Esel", "Pferd"].map((n) => {
        const nHave = state.inv[n] || 0;
        const img = ICONS[n] ? '<img class="slot-img" src="' + ICONS[n] + '" alt="">' : "";
        return photoRow(ICONS[n] || null, n + ":", [String(nHave)]);
      }).join("");
      return "<h2>Tierstall</h2>" + photoRow("assets/gfx/buildings/stall.jpg", "Stall", ["Maximal 25 Tiere.", "Ab Lagerrecht 5 und 650 EP."]) + pets;
    }
    if (page === "garage") {
      const rows = Object.keys(VEHICLES).map((id) => {
        const v = VEHICLES[id];
        const have = (state.inv[id] || 0) > 0;
        const on = state.activeVehicle === id;
        const act = !have ? "nicht im Rucksack" : (on ? "unterwegs" : origLink("nehmen", 'data-veh="' + id + '"'));
        return photoRow(v.img, origEsc(v.name), [act, "Kampfpunkte: " + v.kpBonus]);
      }).join("");
      return "<h2>Garage</h2><p>Lagerrecht 7, nur vom Mechaniker.</p>" + rows;
    }
    if (page === "uebersicht") {
      const loc = locById(state.locId);
      return factBlock("Übersicht", [
        "Name: " + origEsc(state.name),
        "Beruf: " + origEsc(state.job),
        "Techlevel: " + (state.techlevel || 0),
        "Erfahrung: " + state.ep,
        "Ort: " + (loc ? loc.name + " (" + loc.x + ", " + loc.y + ")" : "—"),
        origLink("Status", 'data-page="status"') + " · " + origLink("Rucksack", 'data-page="rucksack"') + " · " + origLink("Ausrüstung", 'data-page="ausruestung"'),
      ]) + resetHtml();
    }
    if (page === "stats") {
      return factBlock("Stats", [
        "Erfahrung: " + state.ep,
        "Charakterpunkte: " + state.cp,
        "Kampferfahrung: " + (state.kep || 0),
        "Nahrung: " + state.food,
        "Wasser: " + state.water,
        "Gold: " + state.gold,
      ]);
    }
    if (page === "galerie") {
      const shots = [
        ["assets/gfx/buildings/brunnen2.jpg", "Brunnen"],
        ["assets/gfx/buildings/farm2.jpg", "Farm"],
        ["assets/gfx/buildings/lagerfeuer_aus2.jpg", "Lagerfeuer"],
        ["assets/gfx/buildings/menschenwall2.jpg", "Menschenwall"],
        ["assets/gfx/buildings/mutantenwall2.jpg", "Mutantenwall"],
        ["assets/gfx/buildings/stall.jpg", "Tierstall"],
        ["assets/gfx/vehicles/fahr1.gif", "Motorrad"],
        ["assets/gfx/vehicles/fahr2.gif", "Hoverbike"],
        ["assets/gfx/animals/hund.gif", "Hund"],
        ["assets/gfx/animals/esel.gif", "Esel"],
        ["assets/gfx/animals/pferd.gif", "Pferd"],
        ["assets/map/karte-welt.jpg", "Landkarte"],
      ];
      return "<h2>Galerie</h2>" + shots.map(([src, name]) => photoRow(src, name, [])).join("");
    }
    if (page === "verlassen") {
      return "<h2>Verlassen</h2><p>" + (state.stamm ? origLink("Stamm verlassen", 'data-page="stamm-leave"') : "Du bist in keinem Stamm.") + "</p>";
    }
    if (page === "hilfe") {
      return "<h2>Hilfe</h2><p>Nahrung und Wasser sinken mit der Zeit. Unter −10 ist der Charakter tot.</p>" +
        "<p>Arbeiten, Graben, Wassersuche, Jagen und Kämpfen stehen links unter Aktionen.</p>" +
        "<p>Die Landkarte listet Orte. Gesperrte Orte nennen die Bedingung.</p>" +
        "<p>Techlevel schaltet Berufe unter Fähigkeiten frei.</p>";
    }
    return origStub("Seite");
  }
  function renderOriginal() {
    const left = document.getElementById("orig-left");
    const right = document.getElementById("orig-right");
    const sheet = document.getElementById("orig-sheet");
    if (!left || !right || !sheet || !state) return;
    function boxes(groups) {
      return groups.map(([title, items]) => {
        const links = items.map(([id, label]) => {
          const cls = id === "logout" ? ' class="logout"' : "";
          return '<a href="#"' + cls + ' data-page="' + id + '">' + label + "</a>";
        }).join("");
        return '<div class="mbox"><h3>' + title + "</h3>" + links + "</div>";
      }).join("");
    }
    if (!p10RightOnly) left.innerHTML = boxes(ORIG_MENUS.left); // Durchgang 10: Optimus frischt nur die rechte Spalte auf
    const res = [
      ["wasser.gif", "Wasser", state.water, p9LowCls(state.water)],
      ["nahrung.gif", "Nahrung", state.food, p9LowCls(state.food)],
      ["gold.gif", "Gold", state.gold],
      ["holz.gif", "Holz", state.inv.Holz || 0],
      ["stein.gif", "Stein", state.inv.Stein || 0],
      ["metall.gif", "Metall", state.inv.Metall || 0],
      ["kunststoff.gif", "Kunststoff", state.inv.Kunststoff || 0],
      ["sand.gif", "Sand", state.inv.Sand || 0],
      ["kristall.gif", "Kristall", state.inv.Kristall || 0],
      ["erz.gif", "Erz", state.inv.Erz || 0],
      ["edelmetall.gif", "Edelmetall", state.inv.Edelmetall || 0],
      ["kronkorken.gif", "Kronkorken", state.inv.Kronkorken || 0],
    ].map(([ico, name, n, cls]) => '<div class="resline' + (cls ? " " + cls : "") + '"><span><img src="assets/rohstoffe/' + ico + '" alt="" />' + name + ":</span><span>" + n + "</span></div>").join("");
    const parts0 = new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const g0 = (k) => (parts0.find((x) => x.type === k) || {}).value || "00";
    const hh = g0("hour");
    const mm = g0("minute");
    const headClock = document.getElementById("orig-head-clock");
    if (headClock) headClock.textContent = hh + ":" + mm + ":" + g0("second") + " UHR";
    right.innerHTML =
      '<div class="mbox"><h3>Spielerinfo</h3>' +
      p7HudLocHtml() +
      '<div class="infoline"><span>Erfahrung:</span><span>' + state.ep + "</span></div>" +
      '<div class="infoline"><span>Müdigkeit:</span><span>' + (state.fatigue || 0) + '%</span></div>' +
      '<div class="infoline"><span>Strahlenlast:</span><span>' + (state.radiation || 0) + '%</span></div>' +
      '<div class="infoline"><span>Energie:</span><span>' + (state.energy == null ? 100 : state.energy) + '%</span></div>' +
      (isInjured(state) ? '<div class="infoline"><span>Zustand:</span><span>verletzt</span></div>' : "") +
      (sleepUi ? '<div class="infoline"><span>Zustand:</span><span>schläft</span></div>' : "") +
      '<div class="infoline"><span>Zeit:</span><span id="orig-clock">' + hh + ":" + mm + " Uhr</span></div>" +
      '<a class="cp-link" href="#" data-page="status">' + state.cp + " CPs verfügbar Klicke hier.</a></div>" +
      p7GuideBoxHtml() +
      p10BoxHtml() + // Durchgang 10: Optimus über den Ressourcen
      '<div class="mbox"><h3>Ressourcen</h3>' + res + "</div>" +
      boxes(state.stamm ? ORIG_MENUS.right : [["Stamm", [["gruendung", "Gründung"], ["beitreten", "Beitreten"]]]]);
    const note = (resultLines.length && resultPage === origPage) ? resultLines[resultLines.length - 1] : null;
    const noteHtml = note ? '<p class="orig-result' + (note.bad ? " bad" : "") + '">' + p8ResultAnimal(note.text) + p8Coords(origEsc(note.text), origPage) + "</p>" : ""; // Durchgang 8
    if (p10RightOnly) return;
    sheet.innerHTML = (origPage !== "aufgaben" ? p7GuideMiniHtml() : "") + noteHtml + renderOrigPage();
  }

  // --- Render ---
  function renderAll() {
    if (!state) return;
    maybeUnlockTL();
    document.getElementById("char-name").textContent = state.name;
    document.getElementById("stat-race").textContent = state.race;
    document.getElementById("stat-tl").textContent = String(state.techlevel || 0);
    document.getElementById("stat-job").textContent = state.job;
    const loc = locById(state.locId);
    document.getElementById("stat-loc").textContent = loc ? loc.name : "—";
    document.getElementById("stat-coords").textContent = loc ? `${loc.x} / ${loc.y}` : "—";
    document.getElementById("stat-ep").textContent = `${state.ep} / ${state.cp}`;
    document.getElementById("stat-kep").textContent = String(state.kep || 0);
    document.getElementById("stat-gold").textContent = String(state.gold);
    let wlab = weaponLabel(state);
    const cb = companionBonus(state);
    if (cb > 0) wlab += ` · Tier +${cb} KP`;
    const veh = getActiveVehicle(state);
    if (veh) wlab += ` · ${veh.name} +${veh.kpBonus} KP`;
    const cloth = bestClothing(state);
    if (cloth) wlab += ` · ${cloth.name} +${cloth.kp} KP`;
    const weaponEl = document.getElementById("stat-weapon");
    if (weaponEl) weaponEl.textContent = wlab;
    const karmaEl = document.getElementById("stat-karma");
    if (karmaEl) karmaEl.textContent = karmaLabel(state);
    const foodEl = document.getElementById("stat-food");
    const waterEl = document.getElementById("stat-water");
    foodEl.textContent = String(state.food);
    waterEl.textContent = String(state.water);
    foodEl.className = needClass(state.food);
    waterEl.className = needClass(state.water);

    const alist = document.getElementById("attr-list");
    alist.innerHTML = "";
    ATTRS.forEach((a) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="label">${a}</span><span class="stat-value">${state.attrs[a]}</span>`;
      alist.append(li);
    });

    renderJobPanel();
    renderMap();
    renderTutorial();
    renderResultBanner();
    renderActions();
    renderInv();
    renderCraft();
    renderTrade();
    renderQuests();
    renderBuildings();
    renderStamm();
    renderKarma();
    renderResBar();
    renderEquipped();
    const deadOv = document.getElementById("dead-overlay");
    if (deadOv) deadOv.classList.toggle("hidden", !(state.dead && diedThisSession));
    renderOriginal();
  }

  function jobTl(name) {
    const groups = [JOBS_TL0, JOBS_TL1, JOBS_TL2, JOBS_TL3, JOBS_TL4, JOBS_TL5, JOBS_TL6, JOBS_TL7, JOBS_TL8, JOBS_TL9];
    for (let i = 0; i < groups.length; i++) if (groups[i].includes(name)) return i;
    return 0;
  }
  function tlUnlockText(tl) {
    const gates = {
      0: "ab Start",
      1: "EP ≥ 100 oder 2 Anfängerhöhlen",
      2: "TL1 und (EP ≥ 250 oder Greifer-Einweisung oder ≥ 3 Quests)",
      3: "TL2 und (EP ≥ 400 oder Railgun-Ausbildung/Railgun oder Greifer plus ≥ 5 Quests)",
      4: "TL3 und (EP ≥ 550 oder Railgun oder ≥ 6 Quests)",
      5: "TL4 und (EP ≥ 700 oder Uranoxid oder ≥ 7 Quests)",
      6: "TL5 und (EP ≥ 850 oder Hoverbike oder ≥ 8 Quests)",
      7: "TL6 und (EP ≥ 1000 oder Diamant (rot) oder ≥ 9 Quests)",
      8: "TL7 und (EP ≥ 1200 oder Öl-/Gasturm oder ≥ 10 Quests)",
      9: "TL8 und (EP ≥ 1500 oder Erfindung oder ≥ 11 Quests)",
    };
    return gates[tl] || ("Techlevel " + tl);
  }
  function learnJob(name) {
    if (!availableJobs(state).includes(name)) {
      log("Noch nicht erlernbar: " + name + " — " + tlUnlockText(jobTl(name)) + ".", "bad");
      return;
    }
    if (state.job !== name) state.flex = (state.flex || 0) + 50; // DESIGN: Flexibilität wächst mit Umschulungen (Wiki: Fähigkeit verkürzt Umschulungen)
    state.job = name;
    log("Beruf gewechselt: " + name + " (Ausbildung übersprungen — DESIGN).", "sys");
    save({ quiet: true });
    renderAll();
  }
  function renderJobPanel() {
    const list = document.getElementById("job-list");
    const cur = document.getElementById("job-current");
    const home = document.getElementById("home-job");
    if (cur) cur.textContent = state.job;
    if (home) home.textContent = state.job;
    if (!list) return;
    const open = availableJobs(state);
    const all = [].concat(JOBS_TL0, JOBS_TL1, JOBS_TL2, JOBS_TL3, JOBS_TL4, JOBS_TL5, JOBS_TL6, JOBS_TL7, JOBS_TL8, JOBS_TL9);
    list.innerHTML = "";
    all.forEach((name) => {
      const tl = jobTl(name);
      const row = document.createElement("div");
      const isCurrent = state.job === name;
      const can = open.includes(name);
      row.className = "job-row" + (isCurrent ? " current" : "");
      const status = isCurrent ? "aktueller Beruf" : (can ? "jetzt erlernbar" : tlUnlockText(tl));
      row.innerHTML = "<div><strong>" + name + "</strong> <span class='meta'>TL" + tl + " · " + status + "</span></div>";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = can && !isCurrent ? "btn btn-warning" : "btn";
      btn.textContent = isCurrent ? "aktiv" : (can ? "Erlernen" : "gesperrt");
      btn.disabled = !can || isCurrent || busy || state.dead;
      btn.onclick = () => learnJob(name);
      row.append(btn);
      list.append(row);
    });
  }

  /** DESIGN: frühe Karte klein. EP oder einfaches Flag, nicht Techlevel. */
  const PLACE_EP = {
    camp: 0, wald: 0, bruch: 0, oase: 0,
    schrott: 30,
    sandwueste: 40, cave_w: 40,
    oelfeld: 80, gasfeld: 80,
    cave_n: 100, cave_e: 100, cave_s: 100, haendler: 100,
    chemiker_cave: 120,
    erzfeld: 150, blumen: 150,
    pilzhain: 180, kraeuterfeld: 180, trauung: 180,
    tiergebiet: 200, werkzeug: 200,
    krieger_greifer: 220, haendler2: 220,
    glasschmelze: 250, rival_camp: 250,
    edelmetallfeld: 300,
    ring: 350,
    forscher: 400, masken: 400, maedchen1: 400, krieger_rail_train: 400,
    uranfeld: 450,
    diamantfeld: 500, mechaniker: 500, maedchen2: 500, krieger_rail_buy: 500,
    licht: 600, schatten: 600,
    biolabor: 800,
  };
  function placeGate(loc, s) {
    s = s || state;
    const ep = (s && s.ep) || 0;
    const id = loc.id;
    if (id === "rival_camp" && s && s.stamm) return { open: true, text: "sofort erreichbar (Stamm)" };
    if (id === "licht" && s && s.karma && s.karma.helleGefestigt) return { open: true, text: "sofort erreichbar (Helle Macht)" };
    if (id === "schatten" && s && s.karma && s.karma.dunkleGefestigt) return { open: true, text: "sofort erreichbar (Dunkle Macht)" };
    if (id === "schrott" && s && (s.flags && s.flags.tutorial_done || chainStep(s, "tutorial") >= 5)) {
      return { open: true, text: "sofort erreichbar (Einführung)" };
    }
    const min = PLACE_EP[id] == null ? 100 : PLACE_EP[id];
    if (ep >= min) return { open: true, text: min === 0 ? "sofort erreichbar" : "sofort erreichbar" };
    let extra = "";
    if (id === "rival_camp") extra = " oder Stamm gegründet";
    if (id === "licht") extra = " oder Helle Macht gefestigt";
    if (id === "schatten") extra = " oder Dunkle Macht gefestigt";
    if (id === "schrott") extra = " oder Einführung abschließen";
    return { open: false, text: "noch gesperrt · ab " + min + " EP" + extra, min: min };
  }
  function placeOpen(loc, s) { return placeGate(loc, s).open; }
  function travelPlan(from, to) {
    const dist = from && to ? manhattan(from, to) : 0;
    let ms = Math.min(8000, 800 + 120 * dist);
    let note = "zu Fuß";
    const veh = state ? getActiveVehicle(state) : null;
    if (veh && vehUsable(state, veh)) {
      ms = Math.max(400, Math.floor(ms * veh.speedFactor)) + (veh.prepMs || 0); // WIKI: Fluggeräte haben Vorbereitungszeit
      note = veh.name;
    }
    return { dist, ms, note, sec: Math.max(1, Math.round(ms / 1000)) };
  }
  function placeActivities(loc) {
    const labels = [];
    (loc.actions || []).forEach((aid) => {
      const def = ACTIONS[aid];
      if (!def) return;
      if (aid === "visit") return;
      labels.push(def.label);
    });
    if (loc.id !== "camp" && !(loc.actions || []).includes("graben")) labels.push("Graben");
    const foes = (loc.enemies || []).length > 0;
    const after = loc.enemiesAfterCave && !(state.cavesVisited && state.cavesVisited[loc.caveKey]);
    if (foes && !after) labels.push("Kämpfen");
    else if (foes && after) labels.push("Kämpfen nach der Höhle");
    if (loc.trade) labels.push("Handel");
    return labels;
  }
  function poiIcon(loc) {
    const a = loc.actions || [];
    if (a.includes("holz")) return "assets/rohstoffe/holz.gif";
    if (a.includes("stein")) return "assets/rohstoffe/stein.gif";
    if (a.includes("metall") || a.includes("kunststoff")) return "assets/rohstoffe/metall.gif";
    if (a.includes("wasser")) return "assets/rohstoffe/wasser.gif";
    if (a.includes("cave") || (loc.tags || []).indexOf("Höhle") >= 0) return "assets/rohstoffe/kristall.gif";
    if ((loc.enemies || []).length) return "assets/gfx/animals/hund.gif";
    if (loc.trade) return "assets/rohstoffe/gold.gif";
    return "assets/rohstoffe/sand.gif";
  }
  function poiTipText(loc, here) {
    const gate = placeGate(loc);
    const dist = here ? manhattan(here, loc) : 0;
    const acts = placeActivities(loc);
    const hereTxt = loc.id === state.locId ? "Du bist hier" : gate.text;
    return loc.name + " · " + dist + " Felder\n" + (acts.length ? acts.join(", ") : "nichts zu tun") + "\n" + hereTxt;
  }
  function showMapTip(text, x, y) {
    let tip = document.getElementById("map-tip");
    if (!tip) {
      tip = document.createElement("div");
      tip.id = "map-tip";
      tip.className = "map-tip";
      document.body.appendChild(tip);
    }
    tip.textContent = text;
    tip.style.left = Math.min(window.innerWidth - 260, x + 12) + "px";
    tip.style.top = (y + 14) + "px";
    tip.classList.remove("hidden");
  }
  function hideMapTip() {
    const tip = document.getElementById("map-tip");
    if (tip) tip.classList.add("hidden");
  }
  // Prozent auf karte-welt.jpg, nach Biom (nicht nach den alten Spielkoordinaten).
  const MAP_POS = {
    schrott: [16, 26], biolabor: [8, 34], masken: [24, 14], werkzeug: [8, 16],
    camp: [22, 48], rival_camp: [31, 40], kraeuterfeld: [32, 56],
    wald: [47, 22], pilzhain: [38, 32], tiergebiet: [56, 30], glasschmelze: [60, 16], maedchen1: [38, 14],
    oase: [51, 55],
    bruch: [76, 22], diamantfeld: [68, 12], uranfeld: [84, 12], licht: [92, 12],
    schatten: [68, 22], chemiker_cave: [84, 22], cave_n: [92, 22], cave_e: [68, 32],
    cave_w: [76, 32], blumen: [84, 32], ring: [92, 32], krieger_greifer: [76, 42],
    krieger_rail_train: [84, 42], haendler2: [92, 42],
    sandwueste: [36, 82], cave_s: [48, 74], erzfeld: [60, 70], forscher: [24, 78],
    mechaniker: [14, 86], trauung: [48, 66], edelmetallfeld: [60, 86], krieger_rail_buy: [36, 90],
    haendler: [24, 70], maedchen2: [12, 68],
    oelfeld: [74, 78], gasfeld: [84, 70],
  };
  function mapClusters() {
    const out = [];
    LOCATIONS.forEach((loc) => {
      const xy = MAP_POS[loc.id] || [50, 50];
      const hit = out.find((o) => Math.hypot(o.x - xy[0], o.y - xy[1]) < 5);
      if (!hit) out.push({ locs: [loc], x: xy[0], y: xy[1] });
      else {
        const n = hit.locs.length;
        hit.x = (hit.x * n + xy[0]) / (n + 1);
        hit.y = (hit.y * n + xy[1]) / (n + 1);
        hit.locs.push(loc);
      }
    });
    return out;
  }
  function clusterTip(locs, here) {
    return locs.map((loc) => poiTipText(loc, here)).join("\n—\n");
  }
  function mountWorldMap(el, compact) {
    if (!el) return;
    const focus = focusKind();
    el.className = "world-map" + (compact ? " compact" : "") + (focus === "reise" ? " step-focus" : "");
    el.innerHTML = "";
    const here = locById(state.locId);
    mapClusters().forEach((group) => {
      const anyOpen = group.locs.some((loc) => loc.id === state.locId || placeGate(loc).open);
      const isHere = group.locs.some((loc) => loc.id === state.locId);
      const iconLoc = group.locs.find((loc) => loc.id === state.locId) || group.locs.find((loc) => placeGate(loc).open) || group.locs[0];
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = "poi-pin" + (isHere ? " here" : "") + (anyOpen ? " open-pin" : " silhouette");
      pin.style.left = group.x + "%";
      pin.style.top = group.y + "%";
      pin.innerHTML = '<img src="' + poiIcon(iconLoc) + '" alt="" />';
      const tip = clusterTip(group.locs, here);
      pin.addEventListener("mouseenter", (e) => showMapTip(tip, e.clientX, e.clientY));
      pin.addEventListener("mousemove", (e) => showMapTip(tip, e.clientX, e.clientY));
      pin.addEventListener("mouseleave", hideMapTip);
      if (anyOpen) {
        pin.addEventListener("click", () => {
          hideMapTip();
          const openOnes = group.locs.filter((loc) => loc.id !== state.locId && placeGate(loc).open);
          if (group.locs.length === 1) {
            if (openOnes.length) travelTo(openOnes[0].id);
            return;
          }
          let box = el.querySelector(".map-pick");
          if (!box) {
            box = document.createElement("div");
            box.className = "map-pick";
            el.appendChild(box);
          }
          box.innerHTML = "<p>Orte hier</p>";
          group.locs.forEach((loc) => {
            const gate = placeGate(loc);
            const b = document.createElement("button");
            b.type = "button";
            const acts = placeActivities(loc).slice(0, 3).join(", ");
            b.textContent = loc.name + (acts ? " (" + acts + ")" : "") + " — " + (loc.id === state.locId ? "du bist hier" : gate.text);
            b.disabled = loc.id === state.locId || !gate.open;
            if (!b.disabled) b.addEventListener("click", () => travelTo(loc.id));
            box.appendChild(b);
          });
          box.style.left = Math.min(group.x, 62) + "%";
          box.style.top = Math.min(group.y, 55) + "%";
        });
      }
      el.appendChild(pin);
    });
    if (here) {
      const xy = MAP_POS[here.id] || [50, 50];
      const mark = document.createElement("div");
      mark.className = "player-marker";
      mark.style.left = xy[0] + "%";
      mark.style.top = xy[1] + "%";
      mark.innerHTML = "<i></i>Du";
      el.appendChild(mark);
    }
  }
  function renderMap() {
    mountWorldMap(document.getElementById("map-grid"), false);
    mountWorldMap(document.getElementById("home-travel"), true);
    styleCoreButtons();
  }
  function styleCoreButtons() {
    const focus = focusKind();
    const jobK = jobMainKind();
    const meta = {
      "btn-core-holz": { label: "Holz sammeln", kind: "holz", n: 1, aid: "holz" },
      "btn-core-holz5": { label: "5× Holz sammeln", kind: "holz", n: 5, aid: "holz" },
      "btn-core-stein": { label: "Stein abbauen", kind: "stein", n: 1, aid: "stein" },
      "btn-core-wasser": { label: "Wasser suchen", kind: "wasser", n: 1, aid: "wasser" },
      "btn-core-graben": { label: "Graben", kind: "graben", n: 1, aid: "graben" },
      "btn-core-graben5": { label: "5× Graben", kind: "graben", n: 5, aid: "graben" },
      "btn-core-graben10": { label: "10× Graben", kind: "graben", n: 10, aid: "graben" },
      "btn-core-kampf": { label: "Jagen / Kämpfen", kind: "kampf", n: 1, aid: null },
    };
    Object.entries(meta).forEach(([id, m]) => {
      const b = document.getElementById(id);
      if (!b || !state) return;
      const pred = m.kind === "kampf"
        ? (loc) => availableEnemiesAt(loc).length > 0
        : (m.kind === "graben" ? (loc) => loc.id !== "camp" : (loc) => (loc.actions || []).includes(m.aid));
      const dest = nearestOpenPlace(pred);
      const travel = !!(dest && dest.id !== state.locId);
      const cost = stackCost(m.n, travel);
      const hero = focus ? (focus === m.kind && m.n === 1) : (jobK === m.kind && m.n === 1);
      b.className = "act-btn" + (m.kind === "kampf" ? " fight" : "") + (hero ? " hero" : " minor") + (needsDanger(cost) ? " warn" : "");
      let note = costLabel(cost);
      if (travel) note += " inkl. Reise";
      const def = m.aid && ACTIONS[m.aid];
      if (def && def.softJob && def.needJob && state.job !== def.needJob) note += " · auch ohne Beruf, Ertrag gleich";
      if (needsDanger(cost)) note += " · Warnung: Needs nahe −10";
      b.disabled = !!(busy || state.dead);
      b.innerHTML = m.label + "<small>" + note + "</small>";
    });
  }
  const TUTORIAL_STEPS = [
    { ev: "holz", label: "Holz einmal sammeln" },
    { ev: "wasser", label: "Wasser suchen" },
    { ev: "graben", label: "Einmal graben" },
    { ev: "reise", label: "Zu einem zweiten Ort reisen" },
    { ev: "kampf", label: "Einen Kampf abschließen" },
  ];
  function noteTutorial(ev) {
    if (!state || state.dead) return;
    if (state.flags && state.flags.tutorial_done) return;
    const step = chainStep(state, "tutorial");
    if (step >= 5 || !TUTORIAL_STEPS[step] || TUTORIAL_STEPS[step].ev !== ev) return;
    if (step === 0) { state.ep += 3; addInv(state, "Holz", 2); }
    else if (step === 1) { state.ep += 3; addInv(state, "Wasser", 16); }
    else if (step === 2) { state.ep += 4; state.gold += 5; }
    else if (step === 3) { state.ep += 4; }
    else if (step === 4) { state.ep += 8; state.cp += 2; state.gold += 10; state.flags.tutorial_done = true; }
    setChain(state, "tutorial", step + 1);
    log("Einführung " + (step + 1) + "/5 erledigt: " + TUTORIAL_STEPS[step].label + ". Belohnung DESIGN.", "good");
    if (step + 1 >= 5) {
      state.flags.tutorial_done = true;
      log("Schrottfeld ist jetzt erreichbar (Einführung).", "good");
      if (state.quests && state.quests.einfuehrung) {
        state.quests.einfuehrung.status = "done";
        state.quests.einfuehrung.claimed = true;
      }
    }
  }
  function renderTutorial() {
    const box = document.getElementById("tutorial-box");
    if (!box || !state) return;
    const step = chainStep(state, "tutorial");
    if (step >= 5 || (state.flags && state.flags.tutorial_done)) {
      box.innerHTML = "<strong>Einführung</strong> abgeschlossen. Schrottfeld ist frei.";
      return;
    }
    const items = TUTORIAL_STEPS.map((s, i) => {
      const cls = i < step ? "done" : (i === step ? "current" : "wait");
      return '<li class="' + cls + '">' + (i + 1) + ". " + s.label + "</li>";
    }).join("");
    box.innerHTML = "<strong>Einführung</strong> — Schritt " + (step + 1) + " von 5<ol>" + items + "</ol>";
  }

  function renderActions() {
    const loc = locById(state.locId);
    document.getElementById("loc-title").textContent = loc ? loc.name : "—";
    const list = document.getElementById("action-list");
    list.innerHTML = "";
    if (!loc) return;
    const acts = [...loc.actions];
    if (!acts.includes("graben") && loc.id !== "camp") acts.push("graben");
    if (state.job === "Spion" && (state.techlevel || 0) >= 2 && loc.id !== "camp" && !acts.includes("spy")) {
      acts.push("spy");
    }
    if (state.job === "Forscher" && (state.techlevel || 0) >= 4 && loc.id === "camp" && !acts.includes("forschen")) {
      acts.push("forschen");
    }
    if (state.job === "Pilzsammler" && (state.techlevel || 0) >= 5 && state.buildings && state.buildings.pilzhaus && loc.id === "camp" && !acts.includes("pilze")) {
      acts.push("pilze");
    }
    if (state.job === "Gärtner" && (state.techlevel || 0) >= 5 && state.buildings && state.buildings.kraeutergarten && loc.id === "camp" && !acts.includes("kraeuter")) {
      acts.push("kraeuter");
    }
    if (state.job === "Mechaniker" && (state.techlevel || 0) >= 5 && loc.id === "camp" && bHas(state, "werkstatt") && !acts.includes("repair_vehicle")) {
      acts.push("repair_vehicle");
    }
    if (state.job === "Schneider" && (state.techlevel || 0) >= 6 && !acts.includes("jagen_fell")) {
      if (loc.id === "wald" || loc.id === "tiergebiet" || (loc.id === "camp" && state.buildings && state.buildings.schneiderei)) {
        acts.push("jagen_fell");
      }
    }

    const coords = document.getElementById("loc-coords");
    if (coords) coords.textContent = "(" + loc.x + "/" + loc.y + ")";

    const fights = [];
    availableEnemiesAt(loc).forEach((enemy) => {
      fights.push({ label: "Kämpfen: " + enemy.name, hint: "PvE · KP " + enemy.kp, fight: enemy.id, reason: "Du greifst an" });
    });
    if (loc.id === "rival_camp" && state.stamm) {
      fights.push({ label: "Kämpfen: Rivalen-Späher", hint: "Stammkampf · Beute ins Stammlager", fight: "rival_scout", reason: "Stammkampf light" });
    }
    const focus = focusKind();
    fights.forEach((f) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const cost = stackCost(1, false);
      const hero = focus === "kampf";
      btn.className = "act-btn fight" + (hero ? " hero" : " minor") + (needsDanger(cost) ? " warn" : "");
      btn.disabled = busy || state.dead;
      btn.innerHTML = f.label + "<small>" + f.hint + " · " + costLabel(cost) + (needsDanger(cost) ? " · Warnung: Needs nahe −10" : "") + "</small>";
      btn.onclick = () => startFight(f.fight, f.reason);
      list.append(btn);
    });

    acts.forEach((aid) => {
      const def = ACTIONS[aid];
      if (!def) return;
      let hint = (def.duration / 1000).toFixed(0) + " s";
      if (def.needJob) hint += " · Beruf: " + def.needJob;
      if (def.needTL) hint += " · TL" + def.needTL + "+";
      const tlLocked = def.needTL && (state.techlevel || 0) < def.needTL;
      const jobLocked = def.needJob && state.job !== def.needJob && !def.softJob;
      const locked = tlLocked || jobLocked;
      if (def.needJob && state.job !== def.needJob && def.softJob) hint += " · auch ohne Beruf, Ertrag gleich";
      if (locked && tlLocked) hint += " · noch gesperrt";
      const pays = aid !== "rest" && aid !== "cave" && aid !== "visit";
      const cost = pays ? stackCost(1, false) : { f: 0, w: 0 };
      if (pays) hint += " · " + costLabel(cost);
      if (pays && needsDanger(cost)) hint += " · Warnung: Needs nahe −10";
      const btn = document.createElement("button");
      btn.type = "button";
      const hero = (focus && focus === aid) || (!focus && jobMainKind() === aid);
      btn.className = "act-btn" + (hero ? " hero" : " minor") + (pays && needsDanger(cost) ? " warn" : "");
      btn.disabled = busy || state.dead || locked;
      btn.innerHTML = (locked ? "Gesperrt: " : "") + def.label + "<small>" + hint + "</small>";
      btn.onclick = () => startAction(aid);
      list.append(btn);
    });
    if (!list.children.length) {
      list.innerHTML = "<p class='hint'>Hier gibt es gerade keine Arbeitsgänge. Reise zu einem anderen Ort.</p>";
    }
  }

  function invCell(item, qty, consumeBtn) {
    const div = document.createElement("div");
    div.className = "inv-item";
    const icon = ICONS[item] || ICONS.Holz;
    div.innerHTML = `<img src="${icon}" alt="${item}" /><div>${item}</div><div class="qty">×${qty}</div>`;
    if (consumeBtn) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Konsumieren";
      btn.disabled = busy || state.dead;
      btn.onclick = () => consume(item);
      div.append(btn);
    }
    return div;
  }
  function renderInv() {
    const grid = document.getElementById("inv-grid");
    if (!grid) return;
    grid.innerHTML = "";
    const rohNames = new Set(ROHSTOFFE.map((r) => r[0]));
    const needs = ["Nahrung", "Wasser"];
    const consumables = ["Heiltrank", "Antivirus", "Bio-Serum"];
    const block = (title, html) => {
      const wrap = document.createElement("div");
      wrap.className = "inv-block";
      wrap.innerHTML = "<h4>" + title + "</h4>";
      const g = document.createElement("div");
      g.className = "inv-grid";
      wrap.append(g);
      html(g);
      return wrap;
    };
    const needWrap = block("Bedürfnisse (Rucksack)", (g) => {
      needs.forEach((item) => {
        const q = state.inv[item] || 0;
        if (q > 0) g.append(invCell(item, q, true));
      });
      if (!g.children.length) g.innerHTML = "<p class='hint'>Nichts zu essen oder zu trinken im Rucksack.</p>";
    });
    const goldWrap = document.createElement("div");
    goldWrap.className = "inv-block";
    goldWrap.innerHTML = "<h4>Gold</h4><p class='gold-line'>" + state.gold + "</p>";
    const rohWrap = block("Rohstoffe", (g) => {
      const empty = [];
      ROHSTOFFE.forEach(([name]) => {
        const q = state.inv[name] || 0;
        if (q > 0) g.append(invCell(name, q, false));
        else empty.push(name);
      });
      if (!g.children.length) g.innerHTML = "<p class='hint'>Keine Rohstoffe.</p>";
      if (empty.length) {
        const det = document.createElement("details");
        det.className = "leer";
        det.innerHTML = "<summary>Leer (" + empty.length + ")</summary><p>" + empty.join(", ") + "</p>";
        g.parentElement.append(det);
      }
    });
    const gearWrap = block("Ausrüstung & Sonstiges", (g) => {
      Object.keys(state.inv).sort().forEach((item) => {
        if (needs.includes(item) || rohNames.has(item)) return;
        const q = state.inv[item] || 0;
        if (q <= 0) return;
        g.append(invCell(item, q, consumables.includes(item)));
      });
      if (!g.children.length) g.innerHTML = "<p class='hint'>Keine weitere Ausrüstung.</p>";
    });
    grid.append(needWrap, goldWrap, rohWrap, gearWrap);
  }

  function canCraft(c) {
    if ((state.techlevel || 0) < (c.minTL || 0)) return false;
    if (c.needJob && state.job !== c.needJob) return false;
    if (c.needBuilding && !bHas(state, c.needBuilding)) return false;
    if (c.needChemie && !(state.house && state.house.chemie)) return false; // WIKI: Chemieküche
    if (c.needInt && (state.attrs.Intelligenz || 0) < c.needInt) return false; // WIKI-Intelligenz ÷100
    if (c.needStammB && !stammHas(state, c.needStammB)) return false; // Stammgebäude (z. B. Waffenfabrik)
    return true;
  }

  function renderCraft() {
    const list = document.getElementById("craft-list");
    list.innerHTML = "";
    document.getElementById("craft-hint").textContent =
      `Beruf: ${state.job} · TL ${state.techlevel || 0}. Beste Waffe zählt im Kampf.`;
    CRAFTS.forEach((c) => {
      const row = document.createElement("div");
      row.className = "action-row";
      const costStr = Object.entries(c.cost).map(([k, v]) => `${v} ${k}`).join(", ");
      const ok = canCraft(c);
      row.innerHTML = `<div class="info"><strong>${c.label}</strong><small>${c.desc}<br/>Kosten: ${costStr}${ok ? "" : " · gesperrt"}</small></div>`;
      const btn = document.createElement("button");
      btn.textContent = "Craft";
      btn.disabled = busy || state.dead || !ok;
      btn.onclick = () => doCraft(c);
      row.append(btn); list.append(row);
    });
  }

  function renderTrade() {
    const list = document.getElementById("trade-list");
    list.innerHTML = "";
    const loc = locById(state.locId);
    if (!loc || !loc.trade) {
      list.innerHTML = "<p class='hint'>Kein Händler hier. Ruinencamp oder Händlerhöhle.</p>";
      return;
    }
    TRADE.forEach((t) => {
      const row = document.createElement("div");
      row.className = "action-row";
      const icon = ICONS[t.item] || ICONS.Holz;
      row.innerHTML = `<img src="${icon}" alt="" /><div class="info">${t.item}<small>Kauf ${t.buy} G · Verkauf ${t.sell} G</small></div>`;
      const buy = document.createElement("button");
      buy.textContent = "Kauf";
      buy.disabled = busy || state.dead || state.gold < t.buy;
      buy.onclick = () => {
        if (state.gold < t.buy) return;
        state.gold -= t.buy; addInv(state, t.item, 1);
        log(`Gekauft: 1× ${t.item}.`, "good"); save({ quiet: true }); renderAll();
      };
      const sell = document.createElement("button");
      sell.textContent = "Verkauf";
      sell.disabled = busy || state.dead || !(state.inv[t.item] > 0);
      sell.onclick = () => {
        if (!takeInv(state, t.item, 1)) return;
        state.gold += t.sell;
        log(`Verkauft: 1× ${t.item}.`, "good"); save({ quiet: true }); renderAll();
      };
      row.append(buy, sell); list.append(row);
    });
  }

  function renderQuests() {
    const list = document.getElementById("quest-list");
    list.innerHTML = "";
    QUESTS.forEach((q) => {
      const st = state.quests[q.id] || { status: "active", claimed: false };
      const card = document.createElement("div");
      card.className = "quest-card " + (st.claimed ? "done" : "active");
      const ready = !st.claimed && q.check(state);
      const r = q.reward;
      const rewardStr = [
        r.ep && `+${r.ep} EP`, r.cp && `+${r.cp} CP`, r.gold && `+${r.gold} Gold`,
        r.inv && Object.entries(r.inv).map(([k, v]) => `${v} ${k}`).join(", "),
      ].filter(Boolean).join(" · ");
      let stepsHtml = "";
      if (q.chain && q.steps) {
        const cid = q.chainId || "greifer";
        const step = chainStep(state, cid);
        const locked = q.requiresGreifer && (!(state.inv.Greifer > 0) || !(state.flags && state.flags.greifer_trained));
        stepsHtml = "<ol class=\"q-steps\">" + q.steps.map((txt, i) => {
          let c = "";
          if (!locked) {
            if (step > i) c = "done";
            else if (step === i) c = "current";
          }
          return `<li class="${c}">${txt}</li>`;
        }).join("") + "</ol>";
        if (locked) stepsHtml = "<p class=\"hint\">Zuerst Greifer-Quest abschließen.</p>" + stepsHtml;
      }
      card.innerHTML = `
        <h4>${q.title}</h4>
        <div class="q-status">${st.claimed ? "Abgeschlossen" : "Aktiv"} · ${q.progress(state)}</div>
        <div>${q.desc}</div>
        ${stepsHtml}
        <div class="q-reward">${q.autoClaim ? "Belohnung beim letzten Schritt / Kauf" : "Belohnung (DESIGN): " + rewardStr}</div>
      `;
      if (!st.claimed && !q.autoClaim) {
        const btn = document.createElement("button");
        btn.className = ready ? "primary" : "";
        btn.textContent = ready ? "Abschließen" : "Noch nicht erfüllbar";
        btn.disabled = !ready || busy || state.dead;
        btn.onclick = () => tryCompleteQuest(q.id);
        card.append(btn);
      }
      list.append(card);
    });
  }

  function renderKarma() {
    const panel = document.getElementById("karma-panel");
    if (!panel) return;
    const k = ensureKarma(state);
    panel.className = "karma-box";
    panel.innerHTML = `
      <p class="hint">Wiki: <strong>Helle Macht</strong> durch friedliche AGs, <strong>Dunkle Macht</strong> durch Jagen/Kämpfen. Vor Nutzung festigen. Schwellen DESIGN (${KARMA_POWER}+${KARMA_FEST}).</p>
      <div class="karma-bar">
        <div class="karma-pill light"><span>Helle Macht</span><strong>${k.light}</strong>
          ${k.helleGefestigt ? "gefestigt ✓" : (k.helleMacht ? "festigen " + k.lichtFest + "/" + KARMA_FEST : "noch nicht")}</div>
        <div class="karma-pill dark"><span>Dunkle Macht</span><strong>${k.dark}</strong>
          ${k.dunkleGefestigt ? "gefestigt ✓" : (k.dunkleMacht ? "festigen " + k.dunkelFest + "/" + KARMA_FEST : "noch nicht")}</div>
      </div>
      <h4>Lichtsprüche (Wiki)</h4>
      <p class="hint">Nur mit gefestigter Heller Macht. Verdoppelt Nahrung/Wasser im Inventar (Wiki max 500 vorher — DESIGN Cap 80).</p>
      <div class="stamm-actions">
        <button type="button" id="btn-licht-wasser">mani sani tokabani vetrani (Wasser×2)</button>
        <button type="button" id="btn-licht-nahrung">moni kabroni sofloni tobleroni (Nahrung×2)</button>
      </div>
      <h4>Schattensprüche (Wiki)</h4>
      <p class="hint">Gefestigte Dunkle Macht. DESIGN: nächster Kampf Gegner geschwächt (Wiki: Feinde hungern/dursten).</p>
      <div class="stamm-actions">
        <button type="button" id="btn-schatten">vrosi kabrosi terrorski mafiunie (Kampf-Fluch)</button>
      </div>
      <h4>Kelch / Pokal</h4>
      <p class="hint">Kelch: Lichthöhle 195/4 · Pokal: Schattenhöhle 198/8 · je einmal (Wiki).</p>
      <div class="stamm-actions">
        <button type="button" id="btn-kelch-use">„Trinke aus diesem Kelch“ (Needs heilen)</button>
        <button type="button" id="btn-pokal-use">„verderbe“ (Kampf-Fluch + Pokal)</button>
      </div>
    `;
    const canLight = k.helleMacht && k.helleGefestigt;
    const canDark = k.dunkleMacht && k.dunkleGefestigt;
    panel.querySelector("#btn-licht-wasser").disabled = !canLight || busy || state.dead;
    panel.querySelector("#btn-licht-nahrung").disabled = !canLight || busy || state.dead;
    panel.querySelector("#btn-schatten").disabled = !canDark || busy || state.dead;
    panel.querySelector("#btn-kelch-use").disabled = busy || state.dead || !(state.inv["Kelch des Lichts"] > 0);
    panel.querySelector("#btn-pokal-use").disabled = busy || state.dead || !(state.inv["Pokal des Verderbens"] > 0) || !canDark;

    panel.querySelector("#btn-licht-wasser").onclick = () => castLicht("Wasser");
    panel.querySelector("#btn-licht-nahrung").onclick = () => castLicht("Nahrung");
    panel.querySelector("#btn-schatten").onclick = () => {
      ensureKarma(state).shadowNextFight = true;
      log("Schattenspruch gesprochen — nächster Gegner wird leiden.", "bad");
      flashStatus("Schatten-Fluch aktiv (nächster Kampf)", "bad");
      save({ quiet: true });
      renderAll();
    };
    panel.querySelector("#btn-kelch-use").onclick = () => useKelch();
    panel.querySelector("#btn-pokal-use").onclick = () => {
      ensureKarma(state).shadowNextFight = true;
      log("„verderbe“ — Pokal des Verderbens (Wiki-Spruch). Nächster Kampf geschwächt.", "bad");
      flashStatus("Pokal: verderbe (nächster Kampf)", "bad");
      save({ quiet: true });
      renderAll();
    };
  }

  function castLicht(item) {
    const k = ensureKarma(state);
    if (!k.helleMacht || !k.helleGefestigt) return;
    const have = state.inv[item] || 0;
    if (have < 1) { log("Keine " + item + " im Inventar.", "bad"); return; }
    if (have > 80) { log("DESIGN: zu viel " + item + " (>80) — Wiki-Grenze 500.", "bad"); return; }
    const add = have; // double
    addInv(state, item, add);
    log("Lichtspruch: " + item + " verdoppelt (+" + add + "). Wiki-Spruch.", "good");
    flashStatus(item + " verdoppelt (+" + add + ")", "good");
    save({ quiet: true });
    renderAll();
  }

  function useKelch() {
    if ((state.inv["Kelch des Lichts"] || 0) < 1) return;
    if ((state.inv.Wasser || 0) < 1) { log("Kelch braucht Wasser zum Füllen (Wiki).", "bad"); return; }
    takeInv(state, "Wasser", 1);
    // SP: heilt eigene Needs (Wiki: Wiederbelebung anderer)
    state.food = Math.max(state.food, 40);
    state.water = Math.max(state.water, 40);
    log("„Trinke aus diesem Kelch“ — Nahrung/Wasser auf mind. 40 (DESIGN-Self-Heal; Wiki: Wiederbelebung).", "good");
    flashStatus("Kelch: Needs geheilt (≥40)", "good");
    // zerbrechlich DESIGN 25%
    if (Math.random() < 0.25) {
      takeInv(state, "Kelch des Lichts", 1);
      log("Der Kelch zerbricht! (Wiki: zerbrechlich)", "bad");
    }
    save({ quiet: true });
    renderAll();
  }

  function renderStamm() {
    const panel = document.getElementById("stamm-panel");
    if (!panel) return;
    panel.innerHTML = "";
    panel.className = "stamm-box";

    if (!state.stamm) {
      const box = document.createElement("div");
      box.innerHTML = `
        <p class="hint">Ab <strong>25 EP</strong> (Wiki Stammbeitritt) kannst du einen Stamm gründen — SP-Ersatz für Multiplayer-Stämme.</p>
        <p class="hint">Kosten (DESIGN): 50 Holz, 30 Stein, 20 Metall, 100 Gold. Stammlager + 3 NPC-Mitglieder inklusive.</p>
        <label>Stammname <input id="stamm-name-input" maxlength="24" placeholder="Wüstenfüchse" value="Wüstenfüchse" /></label>
      `;
      const btn = document.createElement("button");
      btn.className = "primary";
      btn.textContent = "Stamm gründen";
      btn.disabled = busy || state.dead || state.ep < 25;
      btn.onclick = () => foundStamm();
      box.appendChild(document.createElement("br"));
      box.appendChild(btn);
      if (state.ep < 25) {
        const note = document.createElement("p");
        note.className = "hint";
        note.textContent = `Noch ${25 - state.ep} EP bis zur Gründung.`;
        box.appendChild(note);
      }
      panel.appendChild(box);
      return;
    }

    const s = state.stamm;
    const used = stammUsed(s);
    const cap = stammCapacity(s);
    const wallImg = state.race === "Mutant"
      ? "assets/gfx/buildings/mutantenwall2.jpg"
      : "assets/gfx/buildings/menschenwall2.jpg";

    const head = document.createElement("div");
    head.innerHTML = `
      <h3 style="margin:0;color:var(--accent)">${s.name}</h3>
      <div class="stamm-meta">Lager Stufe ${s.lagerLevel} · ${used}/${cap} Kapazität · Stamm-Gold ${s.gold || 0} · Rivalen-Siege ${s.rivalWins || 0}</div>
      ${s.wall ? `<img class="stamm-wall-img" src="${wallImg}" alt="Wall" /><div class="hint">Wall aktiv (${state.race})</div>` : "<div class=\"hint\">Kein Wall</div>"}
    `;
    panel.appendChild(head);

    // Members
    const mh = document.createElement("h4");
    mh.textContent = "Mitglieder (NPC, DESIGN)";
    panel.appendChild(mh);
    s.members.forEach((m) => {
      const row = document.createElement("div");
      row.className = "npc-row";
      const lab = document.createElement("span");
      lab.innerHTML = `<strong>${m.name}</strong> <small style="color:var(--muted)">${m.flavor}</small>`;
      const sel = document.createElement("select");
      STAMM_ASSIGNMENTS.forEach((a) => {
        const o = document.createElement("option");
        o.value = a.id; o.textContent = a.label;
        if (m.assignment === a.id) o.selected = true;
        sel.appendChild(o);
      });
      sel.onchange = () => {
        m.assignment = sel.value;
        log(`${m.name}: Auftrag „${STAMM_ASSIGNMENTS.find((x) => x.id === sel.value).label}“.`, "sys");
        save({ quiet: true });
      };
      row.append(lab, sel);
      panel.appendChild(row);
    });

    // Storage
    const sh = document.createElement("h4");
    sh.textContent = "Stammlager";
    panel.appendChild(sh);
    const grid = document.createElement("div");
    grid.className = "stamm-storage";
    const keys = Object.keys(s.storage || {}).filter((k) => s.storage[k] > 0).sort();
    if (!keys.length) grid.innerHTML = "<p class='hint'>Leer.</p>";
    keys.forEach((item) => {
      const div = document.createElement("div");
      div.className = "stamm-item";
      const icon = ICONS[item] || ICONS.Holz;
      div.innerHTML = `<img src="${icon}" alt="" /><div>${item}</div><div class="qty">×${s.storage[item]}</div>`;
      grid.appendChild(div);
    });
    panel.appendChild(grid);

    // Deposit / withdraw
    const act = document.createElement("div");
    act.className = "stamm-actions";
    act.innerHTML = `
      <div class="row">
        <select id="stamm-res-sel"></select>
        <input id="stamm-res-qty" type="number" min="1" value="5" />
        <button id="stamm-dep" type="button">Einlagern</button>
        <button id="stamm-wd" type="button">Entnehmen</button>
      </div>
    `;
    panel.appendChild(act);
    const resSel = act.querySelector("#stamm-res-sel");
    const depositables = Object.keys(state.inv).filter((k) => !CLOTHING[k] && !VEHICLES[k] && k !== "Hund" && k !== "Esel" && k !== "Pferd");
    const opts = new Set([...depositables, ...Object.keys(s.storage || {})]);
    [...opts].sort().forEach((item) => {
      const o = document.createElement("option");
      o.value = item; o.textContent = item;
      resSel.appendChild(o);
    });
    act.querySelector("#stamm-dep").onclick = () => stammTransfer(true);
    act.querySelector("#stamm-wd").onclick = () => stammTransfer(false);

    // Upgrades
    const uh = document.createElement("h4");
    uh.textContent = "Ausbau";
    panel.appendChild(uh);
    const up = document.createElement("div");
    up.className = "stamm-actions";
    const btnLager = document.createElement("button");
    btnLager.textContent = `Lager +1 (Kap. ${cap + STAMM_LAGER_PER_LEVEL}) — 40 Holz/30 Stein/20 Metall/50 Gold`;
    btnLager.disabled = busy || state.dead;
    btnLager.onclick = () => upgradeStammLager();
    up.appendChild(btnLager);
    if (!s.wall) {
      const btnWall = document.createElement("button");
      btnWall.textContent = "Wall bauen — 40 Stein/25 Metall/40 Gold (DESIGN)";
      btnWall.disabled = busy || state.dead;
      btnWall.onclick = () => buildStammWall();
      up.appendChild(btnWall);
    }
    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = "Rivalenlager (110/110): Stammkampf light — Beute geht ins Stammlager.";
    up.appendChild(hint);
    panel.appendChild(up);
  }

  function foundStamm() {
    if (state.stamm) return;
    const missing = [];
    if (state.ep < 25) missing.push("Erfahrung");
    if (!hasHouse(state)) missing.push("eigenes Haus (Wiki: für Stammesgründung notwendig)");
    Object.entries(STAMM_FOUND_COST).forEach(([k, v]) => {
      if (k === "gold") { if (state.gold < v) missing.push("Gold"); }
      else if ((state.inv[k] || 0) < v) missing.push(k);
    });
    if (missing.length) {
      const msg = "Nicht genug: " + missing.join(", ") + ".";
      log(msg, "bad");
      showResult(msg, true);
      renderAll();
      return;
    }
    Object.entries(STAMM_FOUND_COST).forEach(([k, v]) => {
      if (k === "gold") state.gold -= v;
      else takeInv(state, k, v);
    });
    const vis = document.getElementById("orig-stamm-name");
    const hid = document.getElementById("stamm-name-input");
    const name = (((vis && vis.value) || (hid && hid.value) || "Wüstenfüchse")).trim().slice(0, 24) || "Wüstenfüchse";
    state.stamm = createStamm(name);
    gain(state, 5, 5);
    const msg = "Stamm „" + name + "“ gegründet.";
    log(msg, "good");
    showResult(msg);
    save({ quiet: true });
    renderAll();
  }

  function stammTransfer(deposit) {
    if (!state.stamm) return;
    const item = document.getElementById("stamm-res-sel").value;
    const qty = Math.max(1, parseInt(document.getElementById("stamm-res-qty").value, 10) || 1);
    if (deposit) {
      if ((state.inv[item] || 0) < qty) { log("Nicht genug im Inventar.", "bad"); return; }
      const added = stammAdd(state.stamm, item, qty);
      if (added <= 0) { log("Stammlager voll.", "bad"); return; }
      takeInv(state, item, added);
      log(`Eingelagert: ${added}× ${item}.`, "good");
    } else {
      const have = (state.stamm.storage[item] || 0);
      if (have < 1) { log("Nicht im Lager.", "bad"); return; }
      const take = Math.min(qty, have);
      state.stamm.storage[item] -= take;
      if (state.stamm.storage[item] <= 0) delete state.stamm.storage[item];
      addInv(state, item, take);
      log(`Entnommen: ${take}× ${item}.`, "good");
    }
    save({ quiet: true });
    renderAll();
  }

  function payStammCost(cost) {
    for (const [k, v] of Object.entries(cost)) {
      if (k === "gold") {
        if (state.gold < v) return false;
      } else if ((state.inv[k] || 0) < v) return false;
    }
    for (const [k, v] of Object.entries(cost)) {
      if (k === "gold") state.gold -= v;
      else takeInv(state, k, v);
    }
    return true;
  }

  function upgradeStammLager() {
    if (!state.stamm) return;
    if (!payStammCost(STAMM_UPGRADE_COST)) { log("Ressourcen für Lager-Ausbau fehlen.", "bad"); return; }
    state.stamm.lagerLevel = (state.stamm.lagerLevel || 0) + 1;
    gain(state, 3, 2);
    log(`Stammlager Stufe ${state.stamm.lagerLevel}. Kapazität ${stammCapacity(state.stamm)}.`, "good");
    save({ quiet: true });
    renderAll();
  }

  function buildStammWall(kind) {
    if (!state.stamm) return;
    const key = kind === "mutant" ? "wallMutant" : "wallMensch";
    if (state.stamm[key]) return;
    if (!payStammCost(STAMM_WALL_COST)) { log("Ressourcen für Wall fehlen.", "bad"); return; }
    state.stamm[key] = true;
    state.stamm.wall = true;
    gain(state, 5, 3);
    log((kind === "mutant" ? "Mutantenwall" : "Menschenwall") + " errichtet.", "good");
    save({ quiet: true });
    renderAll();
  }

  function renderBuildings() {
    const list = document.getElementById("build-list");
    if (!list) return;
    list.innerHTML = "";
    const atCamp = state.locId === "camp";
    BUILDINGS.forEach((b) => {
      const owned = !!(state.buildings && state.buildings[b.id]);
      const card = document.createElement("div");
      card.className = "build-card" + (owned ? " owned" : "");
      const costParts = Object.entries(b.cost).map(([k, v]) => {
        if (k === "gold") return `${v} Gold`;
        return `${v} ${k}`;
      }).join(", ");
      card.innerHTML = `
        <img class="build-img" src="${b.img}" alt="${b.name}" />
        <h4>${b.name}${owned ? " ✓" : ""}</h4>
        <div>${b.desc}</div>
        <div class="b-effect">${b.effect}</div>
        <div class="q-reward">Kosten (DESIGN): ${costParts}</div>
      `;
      if (!owned) {
        const btn = document.createElement("button");
        btn.textContent = atCamp ? "Bauen" : "Nur im Camp";
        btn.disabled = busy || state.dead || !atCamp;
        btn.onclick = () => buildBuilding(b);
        card.append(btn);
      }
      list.append(card);
    });
  }

  function buildBuilding(b) {
    if (!state) return;
    if (state.locId !== "camp") {
      showResult("Bauen geht nur im Ruinencamp.", true);
      renderAll();
      return;
    }
    if (state.buildings[b.id]) return;
    if (!canPay(state, b.cost)) {
      const msg = "Es fehlt: " + missingText(state, b.cost) + "."; // Privatlager zählt mit (DESIGN, wie Haus)
      log(msg, "bad");
      showResult(msg, true);
      renderAll();
      return;
    }
    payCost(state, b.cost);
    state.buildings[b.id] = true;
    gain(state, 5, 3);
    const builtMsg = b.name + " steht.";
    log(builtMsg, "good");
    showResult(builtMsg);
    save({ quiet: true });
    renderAll();
  }

  function consume(item) {
    if (item === "Nahrung" || item === "Wasser") { log("Nahrung und Wasser sind dein Vorrat und werden automatisch verbraucht.", "sys"); return; } // Durchgang 9
    if (!takeInv(state, item, 1)) return;
    if (item === "Heiltrank") {
      state.food += 15; state.water += 15;
      log("Heiltrank: Nahrung +15, Wasser +15 (DESIGN).", "good");
    } else if (item === "Antivirus" || item === "Bio-Serum") {
      state.food += 10; state.water += 10;
      log(`${item}: +10 Nahrung/Wasser (DESIGN-Heilung).`, "good");
    }
    save({ quiet: true }); renderAll();
  }

  function doCraft(c) {
    if (!canCraft(c)) {
      const why = craftLockReason(c);
      log("Gesperrt: " + c.label + ". " + why, "bad"); showResult("Gesperrt: " + c.label + ". " + why, true); renderAll(); return;
    }
    if (c.goldCost && state.gold < c.goldCost) { log("Nicht genug Gold.", "bad"); return; }
    // DESIGN: im Ruinencamp zählt das Privatlager mit
    if (!canPay(state, c.cost)) { const m = "Es fehlt: " + missingText(state, c.cost) + "."; log(m, "bad"); showResult(m, true); renderAll(); return; }
    payCost(state, c.cost);
    if (c.goldCost) state.gold -= c.goldCost;
    for (const [k, v] of Object.entries(c.result)) addInv(state, k, v);
    exert("craft");
    log(`Hergestellt: ${Object.entries(c.result).map(([k, v]) => v + "× " + k).join(", ")}.`, "good");
    save({ quiet: true }); renderAll();
  }

  function travelTo(locId, opts) {
    opts = opts || {};
    if (busy || state.dead) return;
    if (locId === state.locId || p8SameSpot(locId)) {
      if (opts.after) opts.after();
      return;
    }
    const from = locById(state.locId);
    const to = p8Dest(locId); // Durchgang 8: auch "xy:X,Y" (freies Feld)
    if (!from || !to) return;
    const gate = to.free ? { open: true, text: "" } : placeGate(to);
    if (!gate.open) {
      const msg = to.name + ": " + gate.text + ".";
      log(msg, "bad");
      showResult(msg, true);
      renderAll();
      return;
    }
    const plan = travelPlan(from, to);
    const dist = plan.dist;
    let ms = plan.ms;
    let travelNote = plan.note;
    let fuelUsed = 0;
    const veh = getActiveVehicle(state);
    log("Reise nach " + to.name + ": " + dist + " Felder (" + travelNote + ").", "sys");
    if (veh && travelNote === veh.name) {
      if (tankSaves(state, veh)) log("Großer Tank: diese Fahrt ohne Nachtanken (DESIGN).", "sys");
      else { takeInv(state, vehFuelItem(veh), veh.fuelPerTrip); fuelUsed = veh.fuelPerTrip; }
    }
    const usedVehicle = travelNote !== "zu Fuß";
    busy = true;
    setStatus("Unterwegs nach " + to.name + "…");
    const finishTravel = () => {
      state.locId = to.id;
      if (to) { state.px = to.x; state.py = to.y; }
      exert("travel");
      noteTutorial("reise");
      if (usedVehicle) {
        const need = veh.needsCost || 0;
        state.food -= need;
        state.water -= need;
        log("Du stehst jetzt in " + to.name + " (" + travelNote + ").", "good");
        showResult("Du stehst jetzt in " + p8ToName(to) + ".");
      } else {
        state.food -= 1; state.water -= 1;
        log("Du stehst jetzt in " + to.name + ".", "good");
        showResult("Du stehst jetzt in " + p8ToName(to) + ".");
      }
      const rep = Math.floor(dist / 10);
      if (rep > 0) { state.ep += rep; log(`Reise-EP (REP): +${rep}.`, "sys"); }
      let encounter = null;
      const encChance = usedVehicle ? 0.08 : 0.18;
      if (!opts.noEncounter && to.id !== "camp" && !to.trade && Math.random() < encChance) {
        const pool = ["wild_dog", "scavenger"];
        if (dist >= 40) pool.push("raider");
        encounter = pool[rand(0, pool.length - 1)];
      }
      busy = false; setProgress(0); setStatus("Bereit.");
      maybeUnlockTL(); checkDeath(); save({ quiet: true }); renderAll();
      if (encounter && !state.dead) {
        log("Unterwegs lauert etwas…", "sys");
        setTimeout(() => startFight(encounter, "Zufallsbegegnung"), 400);
      } else if (opts.after && !state.dead) {
        opts.after();
      }
    };
    p8TravelRun(to, dist, ms, finishTravel); // Durchgang 8: Reisezeit mit Fortschrittsbalken
  }

  function nearestOpenPlace(pred) {
    const here = locById(state.locId);
    const list = LOCATIONS.filter((loc) => placeOpen(loc) && pred(loc));
    list.sort((a, b) => manhattan(here, a) - manhattan(here, b));
    return list[0] || null;
  }
  function goCore(kind) {
    if (state && !state.dead && (!busy || sleepUi) && blockIfExhausted()) return;
    if (busy || state.dead) return;
    clearResults();
    const specs = {
      holz: { aid: "holz", pred: (loc) => (loc.actions || []).includes("holz") },
      stein: { aid: "stein", pred: (loc) => (loc.actions || []).includes("stein") },
      wasser: { aid: "wasser", pred: (loc) => (loc.actions || []).includes("wasser") },
      graben: { aid: "graben", pred: (loc) => loc.id !== "camp" },
      kampf: { fight: true, pred: (loc) => availableEnemiesAt(loc).length > 0 },
    };
    const spec = specs[kind];
    if (!spec) return;
    const dest = nearestOpenPlace(spec.pred);
    if (!dest) {
      const msg = "Kein erreichbarer Ort dafür.";
      log(msg, "bad");
      showResult(msg, true);
      renderAll();
      return;
    }
    const begin = () => {
      if (spec.fight) {
        const foe = availableEnemiesAt(locById(state.locId))[0];
        if (foe) startFight(foe.id, "Jagen / Kämpfen");
      } else startAction(spec.aid);
    };
    if (dest.id === state.locId) begin();
    else travelTo(dest.id, { after: begin, noEncounter: true });
  }
  function paintWorkBar(pct) {
    const el = document.querySelector("#orig-sheet .work-bar i");
    if (el) el.style.width = Math.max(0, Math.min(100, pct)) + "%";
  }
  function finishGatherBatch(aid, n) {
    const def = ACTIONS[aid];
    const loc = locById(state.locId);
    const lines = [];
    for (let i = 0; i < n; i++) {
      if (!state || state.dead) break;
      if (state.food <= -9 || state.water <= -9) {
        const msg = "Abbruch nach " + i + "×: Nahrung oder Wasser zu niedrig.";
        log(msg, "bad");
        lines.push({ text: msg, bad: true });
        break;
      }
      if (isExhausted(state)) {
        lines.push({ text: "Abbruch nach " + i + "×: " + EXHAUST_MSG, bad: true });
        break;
      }
      state.food -= 1; state.water -= 1;
      const before = invSnapshot(state);
      const res = def.run(state, loc);
      if (res.ok) res.msg += afterWork(before);
      if (res.ok) {
        log((i + 1) + "/" + n + " " + def.label + ": " + res.msg, "good");
        lines.push({ text: n > 1 ? ((i + 1) + ". " + res.msg) : res.msg, bad: false });
        if (aid === "holz") noteTutorial(aid);
        gainKarma(state, "light", 1);
        exert("work");
      } else {
        log(res.msg, "bad");
        lines.push({ text: res.msg || "fehlgeschlagen", bad: true });
      }
      maybeUnlockTL(); checkDeath();
      if (state.dead) break;
    }
    workUi = null;
    resultLines = lines;
    resultPage = origPage;
    busy = false; setProgress(0); setStatus("Bereit.");
    save({ quiet: true }); renderAll();
  }
  function runSequence(aid, n) {
    const def = ACTIONS[aid];
    if (!def) return;
    if (blockIfExhausted()) return;
    if (aid === "holz" || aid === "stein") {
      origPage = "arbeiten";
      workUi = { aid: aid, n: n, pct: 0 };
      clearResults();
      busy = true;
      setStatus(def.label + "…");
      renderAll();
      runProgress((def.duration || 4000) * n, () => finishGatherBatch(aid, n));
      return;
    }
    let i = 0;
    clearResults();
    function step() {
      if (!state || state.dead || i >= n) {
        busy = false; setProgress(0); setStatus("Bereit.");
        save({ quiet: true }); renderAll();
        return;
      }
      if (state.food <= -9 || state.water <= -9) {
        log("Abbruch nach " + i + "×: Nahrung oder Wasser zu niedrig. Keine Aktionspunkte — nur die Needs begrenzen.", "bad");
        busy = false; setProgress(0); setStatus("Bereit.");
        save({ quiet: true }); renderAll();
        return;
      }
      const loc = locById(state.locId);
      busy = true;
      setStatus(def.label + " " + (i + 1) + "/" + n + "…");
      if (aid === "graben") { workUi = { aid: "graben", n: n, i: i, pct: 0 }; origPage = "graben"; renderAll(); }
      runProgress(def.duration, () => {
        if (aid === "graben") workUi = null;
        if (isExhausted(state)) {
          pushResult("Abbruch nach " + i + "×: " + EXHAUST_MSG, true);
          busy = false; setProgress(0); setStatus("Bereit.");
          save({ quiet: true }); renderAll();
          return;
        }
        state.food -= 1; state.water -= 1;
        const before = invSnapshot(state);
        const res = def.run(state, loc);
        if (res.ok) { res.msg += afterWork(before); exert(aid === "graben" ? "dig" : "work"); }
        const head = (i + 1) + "/" + n + " " + def.label + ": ";
        if (res.ok) {
          log(head + res.msg, "good");
          pushResult((i + 1) + ". " + resultLine(res));
          if (aid === "holz" || aid === "graben") noteTutorial(aid);
          gainKarma(state, "light", 1);
        } else {
          log(head + res.msg, "bad");
          pushResult((i + 1) + ". " + (res.msg || "fehlgeschlagen"), true);
        }
        i += 1;
        maybeUnlockTL(); checkDeath();
        if (state.dead) { save({ quiet: true }); renderAll(); return; }
        step();
      });
    }
    step();
  }
  function goRepeat(aid, n) {
    if (state && !state.dead && (!busy || sleepUi) && blockIfExhausted()) return;
    if (busy || state.dead) return;
    const pred = aid === "graben"
      ? (loc) => loc.id !== "camp"
      : (loc) => (loc.actions || []).includes(aid);
    const dest = nearestOpenPlace(pred);
    if (!dest) {
      log("Kein erreichbarer Ort dafür.", "bad");
      return;
    }
    const begin = () => runSequence(aid, n);
    if (dest.id === state.locId) begin();
    else travelTo(dest.id, { after: begin, noEncounter: true });
  }

  const NO_EXHAUST_CHECK = ["rest", "visit", "kelch_holen", "pokal_holen"];
  function startAction(aid) {
    if (!state || state.dead) return;
    if (!NO_EXHAUST_CHECK.includes(aid) && (!busy || sleepUi) && blockIfExhausted()) return;
    if (busy) return;
    const def = ACTIONS[aid];
    const loc = locById(state.locId);
    if (!def || !loc) return;
    if (def.needTL && (state.techlevel || 0) < def.needTL) {
      const msg = "Benötigt Techlevel " + def.needTL + ".";
      log(msg, "bad"); showResult(msg, true); renderAll(); return;
    }
    if (def.needJob && state.job !== def.needJob && !def.softJob) {
      const msg = "Benötigt Beruf " + def.needJob + ".";
      log(msg, "bad"); showResult(msg, true); renderAll(); return;
    }
    busy = true; setStatus(`${def.label}…`);
    clearResults();
    const finishNow = () => {
      if (aid !== "rest" && aid !== "cave" && aid !== "visit") {
        state.food -= 1; state.water -= 1;
      }
      const before = invSnapshot(state);
      const res = def.run(state, loc);
      if (res.ok && aid === "wasser") petWaterBonus(before); // WIKI: Affe bringt mehr Wasser, nicht extra gelistet
      if (res.ok && !NO_EXHAUST_CHECK.includes(aid)) res.msg += afterWork(before);
      if (res.ok) {
        log(res.msg, "good");
        showResult(res.msg);
        if (aid === "holz" || aid === "wasser" || aid === "graben") noteTutorial(aid);
        if (aid === "rest") { /* Müdigkeit und Energie setzt die Aktion selbst */ }
        else exert(aid === "graben" ? "dig" : "work");
        if (aid === "graben") {
          const found = maybeFindWiki();
          if (found) log("Beim Graben gefunden: " + found + " (Wiki: kann gefunden werden).", "good");
        }
        // Karma: friedliche AGs → hell (Wiki); Jagen → dunkel
        const darkActs = ["jagen_fell", "fang_hund", "fang_esel", "fang_pferd", "stammkampf", "psi_tier"];
        const skip = ["kelch_holen", "pokal_holen", "rest", "visit", "cave"];
        if (darkActs.includes(aid)) gainKarma(state, "dark", 1);
        else if (!skip.includes(aid)) gainKarma(state, "light", 1);
      } else { log(res.msg, "bad"); showResult(res.msg || "nicht möglich", true); }
      busy = false; setProgress(0); setStatus("Bereit.");
      maybeUnlockTL(); checkDeath(); save({ quiet: true }); renderAll();
    };
    if ((aid === "holz" || aid === "stein" || aid === "graben") && (def.duration || 0) >= 2000) {
      workUi = { aid: aid, n: 1, i: 0, pct: 0 };
      origPage = aid === "graben" ? "graben" : "arbeiten";
      renderAll();
      runProgress(def.duration, () => { workUi = null; finishNow(); });
      return;
    }
    finishNow();
  }

  function runProgress(ms, done) {
    const start = Date.now();
    if (workUi) workUi.pct = 0;
    paintWorkBar(0);
    setProgress(0);
    if (progressTimer) clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / ms) * 100);
      if (workUi) workUi.pct = p;
      paintWorkBar(p);
      setProgress(p);
      if (p >= 100) { clearInterval(progressTimer); progressTimer = null; done(); }
    }, 50);
  }

  function startNeeds() {
    stopNeeds();
    needsTimer = setInterval(() => {
      p91Heartbeat(); // Hotfix 9.1: Seite war eingefroren/zu → Nachholen deckeln
      if (state && !state.dead && (tickPendingMix() | tickBoosts())) { save({ quiet: true }); renderAll(); }
      if (!state || state.dead || busy) return;
      const now = Date.now();
      const ticks = Math.floor((now - (state.lastNeedsAt || now)) / 60000);
      if (ticks >= 1) {
        state.food -= ticks; state.water -= ticks;
        // Gebäude-Passive (DESIGN / Wiki-Erträge vereinfacht)
        let foodBonus = 0, waterBonus = 0;
        if (state.buildings) {
          if (state.buildings.brunnen) waterBonus += 2 * ticks;
          if (state.buildings.farm) foodBonus += 2 * ticks;
          if (state.buildings.lagerfeuer) foodBonus += 1 * ticks;
          if (state.buildings.kraeutergarten) foodBonus += 1 * ticks;
          if (state.buildings.pilzhaus) foodBonus += 1 * ticks;
        }
        // Stamm-NPCs passiv (DESIGN)
        if (state.stamm && state.stamm.members) {
          let guard = 0;
          state.stamm.members.forEach((m) => {
            const asg = STAMM_ASSIGNMENTS.find((a) => a.id === m.assignment);
            if (!asg || asg.id === "none") return;
            if (asg.id === "wachen") { guard++; return; }
            if (asg.item) {
              const n = ticks * (1 + (Math.random() < 0.3 ? 1 : 0));
              stammAdd(state.stamm, asg.item, n);
            }
          });
          if (state.stamm.wall && guard > 0 && Math.random() < 0.05) {
            log(`Stammwache (${guard}): Rivalen abgeschreckt.`, "sys");
          }
        }
        state.food += foodBonus;
        state.water += waterBonus;
        state.lastNeedsAt = state.lastNeedsAt + ticks * 60000;
        const radUp = restRadiation(ticks);
        const stallMsg = tickStall(ticks);
        if (stallMsg) log(stallMsg, "bad");
        const petMsg = tickPet(ticks);
        if (petMsg) { log(petMsg, state.pet ? "sys" : "bad"); if (!state.pet) showResult(petMsg, true); }
        let msg = `Vorrat: −${ticks} Nahrung/Wasser`;
        if (foodBonus || waterBonus) msg += ` · Gebäude +${foodBonus} N / +${waterBonus} W`;
        if (radUp) msg += ` · Strahlung +${radUp} (in Ruhe, DESIGN)`;
        log(msg + ".", "sys");
        checkDeath(); save({ quiet: true }); renderAll();
      }
    }, 5000);
  }
  function stopNeeds() {
    if (needsTimer) { clearInterval(needsTimer); needsTimer = null; }
  }
  function checkDeath() {
    if (!state || state.dead) return;
    if (state.food <= -10 || state.water <= -10) {
      state.dead = true; state.deathCause = "spiel"; state.deathAt = Date.now();
      diedThisSession = true;
      log("Du bist verhungert oder verdurstet (−10).", "bad");
      const deadOv = document.getElementById("dead-overlay");
      if (deadOv) deadOv.classList.remove("hidden");
      save({ quiet: true });
    }
  }


  // --- Hilfe / Tutorial ---
  function helpDismissed() {
    try { return localStorage.getItem(HELP_DISMISS_KEY) === "1"; } catch { return false; }
  }
  function setHelpDismissed(v) {
    try {
      if (v) localStorage.setItem(HELP_DISMISS_KEY, "1");
      else localStorage.removeItem(HELP_DISMISS_KEY);
    } catch { /* ignore */ }
  }
  function openHelp(opts) {
    const ov = document.getElementById("help-overlay");
    if (!ov) return;
    const cb = document.getElementById("help-dont-show");
    if (cb) {
      // Erststart: Haken gesetzt → ein Mal schließen genügt (localStorage).
      // Manuell: vorherigen Wunsch spiegeln.
      cb.checked = (opts && opts.firstLaunch) ? true : helpDismissed();
    }
    ov.classList.remove("hidden");
  }
  function closeHelp() {
    const ov = document.getElementById("help-overlay");
    if (!ov) return;
    const cb = document.getElementById("help-dont-show");
    if (cb) setHelpDismissed(!!cb.checked);
    ov.classList.add("hidden");
  }
  function maybeShowFirstHelp() {
    if (!helpDismissed()) openHelp({ firstLaunch: true });
  }

  function updateBanner() {
    const h = new Date().getHours();
    const night = h < 6 || h >= 20;
    const src = night ? "assets/header/title_night.jpg" : "assets/header/title_day.jpg";
    const img = document.getElementById("banner-img");
    if (img && img.getAttribute("src") !== src) img.setAttribute("src", src);
  }
  setInterval(() => {
    const el = document.getElementById("header-clock");
    if (el) el.textContent = "Serverzeit " + new Date().toLocaleString("de-AT");
    const parts = new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const gv = (k) => (parts.find((x) => x.type === k) || {}).value || "00";
    const hms = gv("hour") + ":" + gv("minute") + ":" + gv("second");
    const oc = document.getElementById("orig-clock");
    if (oc) oc.textContent = gv("hour") + ":" + gv("minute") + " Uhr";
    const hc = document.getElementById("orig-head-clock");
    if (hc) hc.textContent = hms + " UHR";
    updateBanner();
  }, 1000);
  updateBanner();

  document.querySelectorAll(".race-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedRace = card.dataset.race;
      document.querySelectorAll(".race-card").forEach((c) => c.classList.toggle("selected", c === card));
    });
  });
  const btnStart = document.getElementById("btn-start");
  if (btnStart) btnStart.addEventListener("click", startGame);
  const origGame = document.getElementById("orig-game");
  if (origGame) origGame.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const page = a.getAttribute("data-page");
    const act = a.getAttribute("data-act");
    const rep = a.getAttribute("data-rep");
    const attr = a.getAttribute("data-attr");
    const job = a.getAttribute("data-job");
    const loc = a.getAttribute("data-loc");
    const craft = a.getAttribute("data-craft");
    const build = a.getAttribute("data-build");
    const buy = a.getAttribute("data-buy");
    const sell = a.getAttribute("data-sell");
    const foe = a.getAttribute("data-foe");
    const quest = a.getAttribute("data-quest");
    const landId = a.getAttribute("data-land");
    const hereAct = a.getAttribute("data-here");
    const equip = a.getAttribute("data-equip");
    const vehPick = a.getAttribute("data-veh");
    const cell = a.getAttribute("data-cell");
    const useIt = a.getAttribute("data-use");
    const petCmd = a.getAttribute("data-pet");
    const xcmd = a.getAttribute("data-x");
    if (xcmd) { e.preventDefault(); extCmd(xcmd); return; }
    if (useIt || petCmd) {
      e.preventDefault();
      if (useIt) { usePotion(useIt); return; }
      if (petCmd === "rename") { petRename(); return; }
      if (petCmd === "fight") { petFight(); return; }
      if (petCmd === "buy" || petCmd === "decline") {
        const off = state.petOffer;
        if (!off) return;
        if (petCmd === "decline") { state.petOffer = null; showResult("Angebot abgelehnt."); }
        else if (state.gold < off.price) showResult("Zu wenig Gold.", true);
        else { state.gold -= off.price; state.petOffer = null; const r = giveAnimal(off.type, "gekauft"); showResult(r.msg, !r.ok); }
        origPage = "tierstall"; save({ quiet: true }); renderAll(); return;
      }
      petAct(petCmd); return;
    }
    if (page || act || rep || attr || job || loc || craft || build || buy || sell || foe || quest || landId || hereAct || equip || vehPick || cell) e.preventDefault();
    if (cell) {
      const bits = cell.split(",");
      const tx = parseInt(bits[0], 10);
      const ty = parseInt(bits[1], 10);
      if (!isNaN(tx) && !isNaN(ty)) clickField(tx, ty);
      return;
    }
    if (vehPick && VEHICLES[vehPick]) {
      if (!(state.inv[vehPick] > 0)) { log("Das Fahrzeug ist nicht im Rucksack.", "bad"); return; }
      state.activeVehicle = vehPick;
      log(VEHICLES[vehPick].name + " genommen.", "good");
      save({ quiet: true }); renderAll();
      return;
    }
    if (equip) {
      const it = wikiByName(equip);
      if (!it || !(state.inv[equip] > 0)) { log("Nicht im Rucksack.", "bad"); return; }
      if (!state.equip) state.equip = {};
      if (it.slot === "fuss") { state.equip.lfuss = equip; state.equip.rfuss = equip; }
      else if (it.slot === "fahrzeug" && VEHICLES[equip]) state.activeVehicle = equip;
      else if (it.slot) state.equip[it.slot] = equip;
      else { log("Dafür nennt das Wiki keinen Anlegeplatz.", "bad"); return; }
      log(equip + " angelegt." + p5EquipNote(equip), "good");
      save({ quiet: true }); renderAll();
      return;
    }
    if (landId) { origPage = "land"; origLandId = landId; renderOriginal(); return; }
    if (hereAct) {
      const bits = hereAct.split("|");
      const locId = bits[0];
      const aid = bits[1];
      const go = () => {
        if (aid === "fight") {
          const foeNow = availableEnemiesAt(locById(state.locId))[0];
          if (foeNow) startFight(foeNow.id, "Kämpfen");
        } else startAction(aid);
      };
      origPage = "land"; origLandId = locId;
      if (state.locId === locId) go();
      else travelTo(locId, { after: go, noEncounter: true });
      return;
    }
    if (page === "do-logout") { const b = document.getElementById("btn-logout"); if (b) b.click(); return; }
    if (page === "logout") { const b = document.getElementById("btn-logout"); if (b) b.click(); return; }
    if (page === "stamm-leave") {
      if (state) { state.stamm = null; log("Stamm verlassen.", "info"); save({ quiet: true }); origPage = "stamm"; renderAll(); }
      return;
    }
    if (page === "stamm-found") {
      const vis = document.getElementById("orig-stamm-name");
      const hid = document.getElementById("stamm-name-input");
      if (hid && vis) hid.value = vis.value;
      foundStamm();
      origPage = "stamm";
      return;
    }
    if (page === "lager-up") { upgradeStammLager(); origPage = "stamm"; return; }
    if (page === "wall-build" || page === "wall-mensch" || page === "wall-mutant") {
      buildStammWall(page === "wall-mutant" ? "mutant" : "mensch");
      origPage = "stamm";
      return;
    }
    if (page === "do-sleep") { startSleep(); return; }
    if (page === "wake") { endSleep("Du bist aufgewacht."); return; }
    if (page === "save-note") {
      const box = document.getElementById("orig-note");
      if (box && state.notes) state.notes[box.getAttribute("data-note")] = box.value.slice(0, 2000);
      log("Notiz gemerkt.", "sys"); save({ quiet: true }); showResult("Notiz gemerkt."); renderOriginal(); return;
    }
    if (page === "do-erkunden") { origPage = "erkunden"; doErkunden(); return; }
    if (page === "land") {
      origPage = "land";
      if (!origLandId) origLandId = state.locId;
      renderOriginal();
      return;
    }
    if (page) {
      if (resultPage !== page) resultLines = [];
      origPage = page;
      renderOriginal();
      return;
    }
    if (act) { goCore(act); return; }
    if (rep) { const parts = rep.split(":"); goRepeat(parts[0], parseInt(parts[1], 10) || 1); return; }
    if (attr) { spendAttr(attr); return; }
    if (job) { learnJob(job); return; }
    if (loc) { travelTo(loc); return; }
    if (craft) { const c = CRAFTS.find((x) => x.id === craft); if (c) doCraft(c); return; }
    if (build) { const b = BUILDINGS.find((x) => x.id === build); if (b) buildBuilding(b); return; }
    if (foe) { startFight(foe, "Kämpfen"); return; }
    if (quest) { tryCompleteQuest(quest); return; }
    if (buy) {
      const bits = buy.split("|");
      const t = TRADE.find((x) => x.item === bits[0] && tradeHere(x, locById(state.locId)));
      const n = Math.max(1, parseInt(bits[1], 10) || 1);
      if (!t) return;
      const price = buyPrice(t);
      const payItem = t.payItem || null; // z.B. Kristall (WIKI: Mutanten Energie Pillen, Einkauf 50 Kristalle)
      const have = payItem ? (state.inv[payItem] || 0) : state.gold;
      if (have < price * n) { showResult("Zu wenig " + (payItem || "Gold") + " für " + n + "× " + t.item + ".", true); renderAll(); return; }
      if (payItem) takeInv(state, payItem, price * n); else state.gold -= price * n;
      addInv(state, t.item, n); exert("trade");
      const msg = "Gekauft: " + n + "× " + t.item + "." + tradeUnits(t.item, n);
      log(msg, "good"); showResult(msg); save({ quiet: true }); renderAll();
      return;
    }
    if (sell) {
      const t = TRADE.find((x) => x.item === sell && tradeHere(x, locById(state.locId)));
      if (t && takeInv(state, t.item, 1)) { state.gold += sellPrice(t); exert("trade"); log("Verkauft: 1× " + t.item + ".", "good"); save({ quiet: true }); renderAll(); }
    }
  });
  const btnLoad = document.getElementById("btn-load");
  if (btnLoad) btnLoad.addEventListener("click", () => resumeGame(false));
  document.getElementById("btn-save").addEventListener("click", (e) => { e.preventDefault(); save(); });
  document.getElementById("btn-fight-close").addEventListener("click", closeFight);
  const btnOpenMap = document.getElementById("btn-open-map");
  if (btnOpenMap) btnOpenMap.addEventListener("click", (e) => { e.preventDefault(); showTab("map"); });
  [["btn-core-holz", "holz"], ["btn-core-stein", "stein"], ["btn-core-wasser", "wasser"], ["btn-core-graben", "graben"], ["btn-core-kampf", "kampf"]].forEach(([id, kind]) => {
    const b = document.getElementById(id);
    if (b) b.addEventListener("click", () => goCore(kind));
  });
  [["btn-core-holz5", "holz", 5], ["btn-core-graben5", "graben", 5], ["btn-core-graben10", "graben", 10]].forEach(([id, aid, n]) => {
    const b = document.getElementById(id);
    if (b) b.addEventListener("click", () => goRepeat(aid, n));
  });
  const btnOpenJobs = document.getElementById("btn-open-jobs");
  if (btnOpenJobs) btnOpenJobs.addEventListener("click", (e) => { e.preventDefault(); showTab("jobs"); });
  const btnReset = document.getElementById("btn-reset");
  if (btnReset) btnReset.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Wirklich neuen Charakter? Stand wird gelöscht.")) {
      clearSave(); state = null; bootDefault();
    }
  });
  const btnRevive = document.getElementById("btn-dead-revive");
  if (btnRevive) btnRevive.addEventListener("click", (e) => { e.preventDefault(); p91Revive(); });
  const btnDead = document.getElementById("btn-dead-restart");
  if (btnDead) btnDead.addEventListener("click", (e) => {
    e.preventDefault();
    if (state && p91HasProgress(state) && !confirm("Wirklich neu anfangen? Der alte Charakter (" + (state.name || "") + ", " + (state.ep || 0) + " EP) wird gelöscht. Eine Sicherung bleibt unter „" + STORAGE_KEY + "_backup“.")) return;
    clearSave();
    state = null;
    diedThisSession = false;
    const deadOv = document.getElementById("dead-overlay");
    if (deadOv) deadOv.classList.add("hidden");
    bootDefault();
  });
  const GAME_TABS = ["map", "ag", "jobs", "inv", "craft", "trade", "quests", "build", "stamm", "karma"];
  function showTab(tab) {
    GAME_TABS.forEach((name) => {
      const el = document.getElementById("tab-" + name);
      if (el) el.classList.toggle("hidden", name !== tab);
    });
    document.querySelectorAll("#game-nav a[data-tab]").forEach((a) => {
      if (a.parentElement) a.parentElement.classList.toggle("active", a.dataset.tab === tab);
    });
  }
  document.querySelectorAll("#game-nav a[data-tab]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      showTab(a.dataset.tab);
    });
  });
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) btnLogout.addEventListener("click", (e) => {
    e.preventDefault();
    log("Kein Login. Du bleibst im Spiel.", "sys");
    if (state) { save({ quiet: true }); showResult("Kein Login im Einzelspieler-Prototyp. Dein Stand ist gespeichert; du bleibst im Spiel."); renderAll(); } // Durchgang 6: sichtbare Rückmeldung
  });
  const brand = document.getElementById("brand-home");
  if (brand) brand.addEventListener("click", (e) => { e.preventDefault(); });
  ["nav-help-login", "btn-help-create"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", (e) => { e.preventDefault(); openHelp(); });
  });


  const btnHelp = document.getElementById("btn-help");
  if (btnHelp) btnHelp.addEventListener("click", (e) => { e.preventDefault(); openHelp(); });
  const btnHelpHud = document.getElementById("btn-help-hud");
  if (btnHelpHud) btnHelpHud.addEventListener("click", (e) => { e.preventDefault(); openHelp(); });
  const btnHelpClose = document.getElementById("btn-help-close");
  if (btnHelpClose) btnHelpClose.addEventListener("click", closeHelp);
  const helpOv = document.getElementById("help-overlay");
  if (helpOv) helpOv.addEventListener("click", (e) => { if (e.target === helpOv) closeHelp(); });

  function clickField(tx, ty) {
    if (state && sleepUi) { showResult(SLEEP_MSG, true); renderAll(); return; }
    if (!state || state.dead || busy) return;
    if (typeof state.px !== "number") {
      const boot = locById(state.locId);
      state.px = boot ? boot.x : 50;
      state.py = boot ? boot.y : 100;
    }
    if (tx === state.px && ty === state.py) {
      const here = placeAt(tx, ty);
      origLandId = here ? here.id : "field";
      origPage = "land";
      renderAll();
      return;
    }
    state.mapTarget = { x: tx, y: ty };
    const horse = activePet(state);
    // DESIGN: mit Pferd 2 Felder pro Schritt (Wiki: 10 Felder in 30 Minuten, PSI 20 Minuten)
    const reach = horse && horse.type === "Pferd" ? 2 : 1;
    const dx = Math.sign(tx - state.px) * Math.min(reach, Math.abs(tx - state.px));
    const dy = Math.sign(ty - state.py) * Math.min(reach, Math.abs(ty - state.py));
    const nx = state.px + dx;
    const ny = state.py + dy;
    state.px = nx;
    state.py = ny;
    const here = placeAt(nx, ny);
    state.locId = here ? here.id : "field";
    state.repSteps = (state.repSteps || 0) + 1;
    let msg = here
      ? "Du stehst jetzt in " + here.name + " (" + nx + " / " + ny + ")."
      : "Du gehst auf (" + nx + " / " + ny + ").";
    if (state.repSteps % 10 === 0) {
      state.rep = (state.rep || 0) + 1;
      msg += " Reiseerfahrung +1.";
    }
    origPage = "landkarte";
    showResult(msg);
    save({ quiet: true });
    renderAll();
  }
  function doErkunden() {
    if (!state || state.dead) return;
    if (busy && !sleepUi) return;
    if (blockIfExhausted()) return;
    const dyn = (state.attrs && state.attrs.Dynamik) || 1;
    let chance = 0.01 + (0.50 - 0.01) * ((dyn - 1) / (4000 - 1));
    const horse = activePet(state);
    if (horse && horse.type === "Pferd") chance = Math.min(0.75, chance * 1.5); // WIKI: Pferd "optimal um Länder zu erkunden"; ×1.5 DESIGN
    const before = invSnapshot(state);
    exert("work");
    if (Math.random() < chance) {
      const pool = [["Holz", 2], ["Stein", 1], ["Kronkorken", 1], ["Knochen", 1], ["Sand", 1]];
      const pick = pool[rand(0, pool.length - 1)];
      addInv(state, pick[0], pick[1]);
      const msg = "Du hast " + pick[1] + " " + pick[0] + " gefunden." + afterWork(before);
      log(msg, "good");
      showResult(msg);
    } else {
      const msg = "Nichts gefunden." + afterWork(before);
      log(msg, "bad");
      showResult(msg, true);
    }
    save({ quiet: true });
    renderAll();
  }
  // =====================================================================
  // Müdigkeit / Energie / Verletzung / Schlafen / Tränke / Tiere
  // Quellen: Wiki 2015 (charakter/tiere, tranke-pillen-pilzmixe), Handbuch 2006
  // (endzeit.pdf S.3, S.73, S.84), MoinMoin 2006 (Strahlung, StartHilfe).
  // Jede Zahl ist als WIKI oder DESIGN markiert. DESIGN ist NICHT original.
  // =====================================================================
  const EXHAUST_MSG = "Du bist zu erschöpft. Leg dich schlafen.";
  const SLEEP_MSG = "Du schläfst gerade. Erst aufwachen.";
  // DESIGN: Sperre bei 100% Müdigkeit oder Energie unter 10%. Wiki: zu hohe Müdigkeit → "stark verletzt" (Handbuch S.3).
  const EXHAUST_FATIGUE = 100;
  const EXHAUST_ENERGY = 10;
  const TIRED_FROM = 80; // DESIGN: ab 80% Müdigkeit weniger Ertrag + Verletzungsrisiko
  const INJURY_MS = 180000; // DESIGN: Verletzung dauert im Prototyp 3 Minuten (Wiki nennt keine Dauer)

  function curEnergy(s) { return s.energy == null ? 100 : s.energy; }
  function isExhausted(s) { return (s.fatigue || 0) >= EXHAUST_FATIGUE || curEnergy(s) < EXHAUST_ENERGY; }
  function isInjured(s) { return !!(s.injuredUntil && s.injuredUntil > Date.now()); }
  /** DESIGN: 80% Müdigkeit → Faktor 1.0, 100% → 0.5. Verletzt zusätzlich ×0.75. */
  function workFactor(s) {
    const f = s.fatigue || 0;
    let k = f < TIRED_FROM ? 1 : Math.max(0.5, 1 - (f - TIRED_FROM) / 40);
    if (isInjured(s)) k *= 0.75;
    return k;
  }
  /** true = blockiert (Meldung schon gezeigt). Wird vor Arbeiten, Graben, Jagen, Kämpfen, Erkunden, Wassersuche geprüft. */
  function blockIfExhausted() {
    if (!state) return true;
    if (sleepUi) { showResult(SLEEP_MSG, true); renderAll(); return true; }
    if (isExhausted(state)) { log(EXHAUST_MSG, "bad"); showResult(EXHAUST_MSG, true); renderAll(); return true; }
    return false;
  }
  function invSnapshot(s) { return Object.assign({}, s.inv); }
  function gainedSince(s, before) {
    const out = {};
    Object.keys(s.inv).forEach((k) => {
      const d = (s.inv[k] || 0) - (before[k] || 0);
      if (d > 0) out[k] = d;
    });
    return out;
  }
  // --- Rucksack-Größe ---
  // WIKI: Esel erhöht die Rucksack-Größe "um das ca. 7-fache", PSI-Esel Rucksackfaktor +3.
  // DESIGN: Grundgröße 600 Einheiten Rohstoffe (Wiki nennt keine Zahl). Gezählt werden nur Rohstoffe.
  const PACK_BASE = 600;
  function packLoad(s) {
    let n = 0;
    ROHSTOFFE.forEach(([name]) => { n += Math.max(0, s.inv[name] || 0); });
    return n;
  }
  function packCap(s) {
    const p = activePet(s);
    const base = p && p.type === "Esel" ? PACK_BASE * (p.psi ? 10 : 7) : PACK_BASE;
    return Math.round(base * vehPackMult(s)); // Transporter/Ladekapazität: DESIGN-Faktor
  }
  /**
   * Nach einem Arbeitsgang: Müdigkeits-Malus (DESIGN), Rucksack-Grenze (DESIGN-Größe, WIKI-Esel),
   * Verletzungsrisiko ab 80% Müdigkeit (WIKI-Idee "stark verletzt", Chance DESIGN). Gibt Text-Anhang zurück.
   */
  function afterWork(before) {
    const s = state;
    const notes = [];
    const got = gainedSince(s, before);
    const extNote = applyExtensions(s, got);
    if (extNote) notes.push(extNote);
    const k = workFactor(s);
    if (k < 1) {
      let lost = 0;
      Object.keys(got).forEach((item) => {
        const cut = Math.floor(got[item] * (1 - k));
        if (cut > 0) { s.inv[item] -= cut; got[item] -= cut; lost += cut; }
      });
      notes.push((isInjured(s) ? "Verletzt/müde" : "Müde") + ": Ertrag −" + Math.round((1 - k) * 100) + "%" + (lost ? " (" + lost + " weniger)" : "") + ".");
    }
    const rohNames = new Set(ROHSTOFFE.map((r) => r[0]));
    let over = packLoad(s) - packCap(s);
    if (over > 0) {
      Object.keys(got).forEach((item) => {
        if (over <= 0 || !rohNames.has(item)) return;
        const cut = Math.min(over, got[item]);
        s.inv[item] -= cut; over -= cut;
      });
      notes.push("Rucksack voll (" + packLoad(s) + " von " + packCap(s) + "). Ein Esel trägt ca. 7× so viel.");
    }
    const f = s.fatigue || 0;
    if (f >= TIRED_FROM && !longSafe && !isInjured(s) && Math.random() < (f - TIRED_FROM + 5) / 100) { // DESIGN 5–25%; lange Arbeit (Mensch/Pilzmix) ohne Verletzung (WIKI)
      s.injuredUntil = Date.now() + INJURY_MS;
      notes.push("Du hast dich vor Müdigkeit verletzt.");
    }
    return notes.length ? " " + notes.join(" ") : "";
  }

  // --- Tränke, Pillen, Kräuter, Pilzmixe (Wirkung WIKI, Prozent = Punkte) ---
  const POTIONS = {
    "schwacher Heiltrank": { energy: 20, heal: 60000, desc: "Energie +20%, Verletzung kürzer (WIKI)" },
    "starker Heiltrank": { energy: 80, heal: 240000, minAusdauer: 10, desc: "Energie +80%, Verletzung viel kürzer (WIKI)" },
    "schwacher Wachtrank": { fatigue: -20, desc: "Müdigkeit −20% (WIKI)" },
    "starker Wachtrank": { fatigue: -80, minAusdauer: 20, desc: "Müdigkeit −80% (WIKI)" },
    "Wachpillen": { fatigue: -150, desc: "Müdigkeit −150% (WIKI)" },
    "Kräutermix": { fatigue: -10, rad: -10, desc: "Müdigkeit und Strahlung −10% (WIKI)" },
    "schwacher Strahlentrank": { rad: -20, desc: "Strahlung −20% (WIKI)" },
    "starker Strahlentrank": { rad: -80, minAusdauer: 30, desc: "Strahlung −80% (WIKI)" },
    "Strahlenpillen": { rad: -150, desc: "Strahlung −150% (WIKI)" },
    "Pilzmix-M": { delay: true, fatigue: -80, rad: 20, desc: "wirkt später: Müdigkeit −80%, Strahlung +20% (WIKI)" },
    "Pilzmix-S": { delay: true, rad: -80, fatigue: 20, desc: "wirkt später: Strahlung −80%, Müdigkeit +20% (WIKI)" },
    "Mutanten Energie Pillen": { setEnergy: 180, mutantOnly: true, desc: "Energie auf 180%, nur Mutanten (WIKI)" },
  };
  // WIKI: Pilzmixe wirken "ungefähr 120 Minuten nach der Einnahme". DESIGN: im Prototyp 60 Sekunden.
  const PILZ_DELAY_MS = 60000;
  function usePotion(name) {
    const p = POTIONS[name];
    if (!p || !state) return;
    if (!(state.inv[name] > 0)) { showResult("Nicht im Rucksack.", true); renderAll(); return; }
    if (p.special) {
      const m = useSpecialPotion(name) || "";
      const bad = /^(Wiki|Die letzte)/.test(m);
      log(m, bad ? "bad" : "good"); showResult(m, bad); save({ quiet: true }); renderAll(); return;
    }
    if (p.mutantOnly && state.race !== "Mutant") { showResult("Nur Mutanten können diese Pillen nehmen (Wiki).", true); renderAll(); return; }
    if (p.minAusdauer && (state.attrs.Ausdauer || 0) < p.minAusdauer) {
      showResult("Wiki: mindestens " + p.minAusdauer + " Ausdauer nötig.", true); renderAll(); return;
    }
    takeInv(state, name, 1);
    let msg = name + ": ";
    if (p.delay) {
      if (!state.pendingMix) state.pendingMix = [];
      state.pendingMix.push({ name, at: Date.now() + PILZ_DELAY_MS });
      state.mixLongUntil = Date.now() + MIX_LONG_MS; // WIKI: mit Pilzmix längere Arbeiten ohne Verletzung
      msg += "eingenommen. Wirkt in etwa 60 Sekunden (Wiki: ~120 Minuten).";
    } else {
      msg += applyPotion(p);
    }
    log(msg, "good"); showResult(msg); save({ quiet: true }); renderAll();
  }
  function applyPotion(p) {
    const s = state;
    const bits = [];
    if (p.fatigue) { const b = s.fatigue || 0; s.fatigue = clamp(b + p.fatigue, 0, 100); bits.push("Müdigkeit " + b + "→" + s.fatigue + "%"); }
    if (p.rad) { const b = s.radiation || 0; s.radiation = clamp(b + p.rad, 0, 100); bits.push("Strahlung " + b + "→" + s.radiation + "%"); }
    if (p.energy) { const b = curEnergy(s); s.energy = Math.min(200, b + p.energy); bits.push("Energie " + b + "→" + s.energy + "%"); }
    if (p.setEnergy) { const b = curEnergy(s); s.energy = Math.max(b, p.setEnergy); bits.push("Energie " + b + "→" + s.energy + "%"); }
    if (p.heal && isInjured(s)) {
      if (hasSkill(s, "Erste Hilfe")) { s.injuredUntil -= p.heal; bits.push(isInjured(s) ? "Verletzung kürzer" : "Verletzung geheilt"); }
      else bits.push("gegen die Verletzung hilft er erst mit Erste Hilfe (Wiki, 240 Naturverbundenheit)");
    }
    return bits.join(", ") + ".";
  }
  function tickPendingMix() {
    if (!state || !state.pendingMix || !state.pendingMix.length) return false;
    const now = Date.now();
    const due = state.pendingMix.filter((m) => m.at <= now);
    if (!due.length) return false;
    state.pendingMix = state.pendingMix.filter((m) => m.at > now);
    due.forEach((m) => { const txt = m.name + " wirkt: " + applyPotion(POTIONS[m.name]); log(txt, "good"); showResult(txt); });
    return true;
  }

  // --- Schlafen ---
  // WIKI: Schlafen ist eine Aktion (Strahlung-Seite 2006). "Nur wenn dein Charakter schläft kann er sich von
  // Strahlenbelastung und Müdigkeit erholen." (Handbuch S.3). Ort, Dauer, Energie-Gewinn und Überfall: DESIGN.
  let sleepUi = null;
  let sleepTimer = null;
  const SLEEP_MS = 20000; // DESIGN: voller Schlaf = 20 Sekunden im Prototyp
  function viennaHour() {
    const parts = new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", hour: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    return parseInt((parts.find((x) => x.type === "hour") || {}).value || "12", 10);
  }
  function hasOwnHouse(s) { return hasHouse(s); } // jetzt echtes Privathaus (WIKI Privatgebäude)
  /** DESIGN-Schlafplatz. Wiki nennt keine Ortsregel. */
  function sleepSpot(s) {
    const atCamp = s.locId === "camp";
    if (atCamp && s.stamm) return { id: "stamm", name: "Stammlager", mult: 1.25, risk: 0 };
    if (atCamp && hasOwnHouse(s)) {
      const h = houseDef(s);
      return { id: "haus", name: "eigenes Haus (" + h.name + ")", mult: 1.1 + 0.05 * HOUSES.indexOf(h), risk: 0, fire: !!(s.buildings && s.buildings.lagerfeuer) }; // Faktor DESIGN
    }
    const night = viennaHour() < 6 || viennaHour() >= 20;
    let risk = night ? 0.2 : 0.1; // DESIGN; Wiki: "nachts von einem Rudel wilder Hunde überfallen"
    if ((s.ep || 0) < 30) risk = 0; // WIKI Handbuch S.73: bis 30 EP keine Angriffe wilder/mutierter Tiere
    const fire = atCamp && !!(s.buildings && s.buildings.lagerfeuer);
    if (fire) risk = 0; // WIKI: Lagerfeuer hält Tiere fern
    if (wornBelt(s) === "Gürtel der Tiere") risk = 0; // WIKI: kein Tier greift den Träger an
    return { id: "draussen", name: atCamp ? (fire ? "Ruinencamp, am Lagerfeuer" : "Ruinencamp, unter freiem Himmel") : "unter freiem Himmel", mult: 0.75, risk, night, fire };
  }
  function sleepDuration(s) {
    let ms = SLEEP_MS;
    if ((s.ep || 0) < 200) ms *= 0.75; // WIKI S.73: bis 200 EP schnellere Erholung; Faktor DESIGN
    return Math.round(ms);
  }
  function startSleep() {
    if (!state || state.dead || sleepUi) return;
    if (busy) { showResult("Erst die laufende Aktion beenden.", true); renderAll(); return; }
    const spot = sleepSpot(state);
    const ms = sleepDuration(state);
    sleepUi = { start: Date.now(), ms, spot, pct: 0, applied: 0, attackAt: Math.random() < spot.risk ? 0.3 + Math.random() * 0.5 : null };
    busy = true;
    origPage = "schlafen";
    clearResults();
    setStatus("Du schläfst…");
    renderAll();
    if (sleepTimer) clearInterval(sleepTimer);
    sleepTimer = setInterval(sleepTick, 100);
  }
  /** Erholung anteilig. Voller Schlaf (DESIGN): Müdigkeit −100×Ort, Energie +100×Ort (max 100, Pillen können höher), Strahlung −30×Ort (WIKI: sinkt nur im Schlaf). */
  function applySleep(frac) {
    const m = sleepUi.spot.mult;
    const s = state;
    s.fatigue = clamp(Math.round((s.fatigue || 0) - 100 * m * frac), 0, 100);
    const e = curEnergy(s);
    if (e < 100) s.energy = Math.min(100, Math.round(e + 100 * m * frac));
    s.radiation = clamp(Math.round((s.radiation || 0) - 30 * m * frac), 0, 100);
  }
  function sleepTick() {
    if (!sleepUi || !state) { if (sleepTimer) clearInterval(sleepTimer); sleepTimer = null; return; }
    const p = Math.min(1, (Date.now() - sleepUi.start) / sleepUi.ms);
    const step = p - sleepUi.applied;
    if (step >= 0.05 || p >= 1) { applySleep(step); sleepUi.applied = p; }
    sleepUi.pct = p * 100;
    const el = document.querySelector("#orig-sheet .sleep-bar i");
    if (el) el.style.width = sleepUi.pct + "%";
    setProgress(sleepUi.pct);
    if (sleepUi.attackAt != null && p >= sleepUi.attackAt) {
      const pet = activePet(state);
      if ((pet && pet.type === "Adler") || wornBelt(state) === "Gürtel der Erkenntnis") {
        sleepUi.attackAt = null;
        endSleep((pet && pet.type === "Adler" ? "Dein Adler" : "Der Gürtel der Erkenntnis") + " warnt dich: wilde Hunde schleichen heran. Du wachst rechtzeitig auf.", true);
        return;
      }
      endSleep("Wilde Hunde überfallen dich im Schlaf!", true);
      setTimeout(() => startFight("wild_dog", "Überfall im Schlaf"), 300);
      return;
    }
    if (p >= 1) { endSleep("Ausgeschlafen."); }
  }
  function endSleep(reason, bad) {
    if (!sleepUi) return;
    if (sleepTimer) { clearInterval(sleepTimer); sleepTimer = null; }
    const healed = sleepUi.applied >= 1 && isInjured(state);
    if (healed) state.injuredUntil = 0; // DESIGN: ganzer Schlaf heilt die Verletzung
    const msg = reason + " Müdigkeit " + (state.fatigue || 0) + "%, Energie " + curEnergy(state) + "%, Strahlung " + (state.radiation || 0) + "%." + (healed ? " Verletzung ausgeheilt." : "");
    sleepUi = null;
    busy = false; setProgress(0); setStatus("Bereit.");
    origPage = "schlafen";
    log(msg, bad ? "bad" : "good");
    showResult(msg, !!bad);
    save({ quiet: true }); renderAll();
  }
  function sleepPageHtml() {
    const s = state;
    const spot = sleepUi ? sleepUi.spot : sleepSpot(s);
    let h = "<h2>Schlafen</h2>";
    h += "<p>Müdigkeit: " + (s.fatigue || 0) + "%. Energie: " + curEnergy(s) + "%. Strahlenlast: " + (s.radiation || 0) + "%.</p>";
    if (isInjured(s)) h += "<p class=\"bad\">Du bist verletzt (noch " + Math.ceil((s.injuredUntil - Date.now()) / 1000) + " Sekunden). Ganzer Schlaf oder Heiltrank hilft.</p>";
    h += "<p>Schlafplatz: " + origEsc(spot.name) + ".</p>";
    if (sleepUi) {
      h += '<div class="work-row"><p>Du schläfst… ' + origLink("aufwachen", 'data-page="wake"') + '</p><div class="work-bar sleep-bar"><i style="width:' + Math.round(sleepUi.pct) + '%"></i></div></div>';
      h += "<p class=\"muted\">Solange du schläfst, gehen keine anderen Aktionen.</p>";
    } else {
      h += "<p>" + origLink("schlafen legen", 'data-page="do-sleep"') + ' <span class="muted">' + Math.round(sleepDuration(s) / 1000) + " Sekunden</span></p>";
    }
    h += "<h3>Wo schläft man?</h3>" +
      "<p>Das Wiki nennt keinen Ort. Hier gilt (DESIGN, nicht original): Schlafen geht überall.</p>" +
      "<p>Stammlager im Ruinencamp: beste Erholung, sicher.</p>" +
      "<p>Eigenes Haus (ein Privatgebäude im Ruinencamp): gute Erholung, sicher.</p>" +
      "<p>Unter freiem Himmel: weniger Erholung. Wilde Hunde können angreifen, nachts öfter. Ein Adler weckt dich vorher.</p>";
    const owned = Object.keys(POTIONS).filter((n) => (s.inv[n] || 0) > 0);
    h += "<h3>Aus dem Rucksack</h3>";
    if (owned.length) {
      owned.forEach((n) => { h += "<p>" + origEsc(n) + " (" + s.inv[n] + "): " + origEsc(POTIONS[n].desc) + " " + origLink("nehmen", 'data-use="' + origEsc(n) + '"') + "</p>"; });
    } else {
      h += "<p class=\"muted\">Keine Tränke, Pillen oder Kräuter dabei. Chemiker stellen sie her (Herstellen), Wachtrank und Heiltrank gibt es auch beim Händler.</p>";
    }
    if (s.pendingMix && s.pendingMix.length) h += "<p>Wirkt bald: " + s.pendingMix.map((m) => origEsc(m.name)).join(", ") + ".</p>";
    h += "<h3>Aus dem Wiki</h3>" +
      "<p class=\"muted\">„Nur wenn dein Charakter schläft kann er sich von Strahlenbelastung und Müdigkeit erholen.“ (Handbuch 2006)</p>" +
      "<p class=\"muted\">„Bei einer zu hohen Strahlung oder zu hohen Müdigkeit wirst du stark verletzt.“ (Handbuch 2006)</p>" +
      "<p class=\"muted\">Im Original schlief man über Nacht. Die 20 Sekunden hier sind Prototyp-Zeit. Ab 100% Müdigkeit oder unter 10% Energie sperrt der Prototyp die Arbeit (DESIGN).</p>";
    return h;
  }

  // --- Tiere ---
  // WIKI: ab 400 EP, Wurfnetz oder Händler-Angebot (Ausstrahlung), Größe bis 200% (PSI 400%), Einstellung,
  // schläft von selbst, Energie nur im Schlaf, Pilzmix-X weckt, krank unter 10% Energie, Heilung 5 Kristall,
  // läuft weg bei 100% Hunger oder Durst, Taufe 100 Wasser, Stall ab 650 EP, Tierkämpfe ab 600 EP.
  const PET_TYPES = {
    Hund: { img: "assets/gfx/animals/hund.gif", skill: "Kampfpunkte in Einzelkämpfen: 12 × Größe (WIKI; Prototyp-KP-Skala 1/100, wie Fahrzeuge)." },
    Esel: { img: "assets/gfx/animals/esel.gif", skill: "Rucksack ca. 7× so groß (WIKI). Im Kampf eher nachteilig (WIKI)." },
    Pferd: { img: "assets/gfx/animals/pferd.gif", skill: "Schneller unterwegs: 2 Felder pro Schritt (DESIGN; Wiki: 10 Felder in 30 Minuten). Gut zum Erkunden." },
    Affe: { img: "assets/gfx/animals/affe.png", /* DESIGN-Bild (Wiki hat keins) */ skill: "Findet mehr Wasser bei der Wassersuche (WIKI; Menge DESIGN)." },
    Wolf: { img: "assets/gfx/animals/wolf.png", /* DESIGN-Bild */ skill: "Bis zu doppelt so viel Fleisch bei der Jagd (WIKI)." },
    Adler: { img: "assets/gfx/animals/adler.png", /* DESIGN-Bild */ skill: "Warnt vor Angriffen und schätzt die gegnerische Kraft auf 10% genau (WIKI)." },
  };
  const PET_STALL_EP = 650;   // WIKI
  const PET_MIN_EP = 400;     // WIKI (Handbuch 2006: 600 EP)
  const PET_FIGHT_EP = 600;   // WIKI
  const PET_TAUFE_WASSER = 100; // WIKI (Icon im Wiki-HTML)
  const PET_HEAL_KRISTALL = 5;  // WIKI (Icon im Wiki-HTML)
  function newPet(type) {
    // DESIGN-Startwerte
    return { type, name: type, kraft: 10, gesch: 10, energie: 100, hunger: 20, durst: 20, groesse: 100, einst: 0, sleeping: false, sick: false, inStall: false, psi: false, tickAt: Date.now() };
  }
  function activePet(s) {
    const p = s && s.pet;
    if (!p || p.inStall || p.sick || p.sleeping) return null;
    return p;
  }
  function petMaxSize(p) { return p.psi ? 400 : 200; } // WIKI
  function einstLabel(v) {
    if (v >= 60) return "zu gutwillig (meidet Konflikte)";
    if (v >= 20) return "gutwillig";
    if (v > -20) return "ausgeglichen";
    if (v > -60) return "böswillig";
    return "zu böswillig (respektiert dich nicht)";
  }
  /** Hund-KP: WIKI 12×Größe (PSI 14×), max 2400/5600. Prototyp-KP sind 1/100 (DESIGN, wie Motorrad 500→5). */
  function petKP(s) {
    const p = activePet(s);
    if (!p) return 0;
    if (p.type === "Esel") return -2; // WIKI "eher nachteilig", Wert DESIGN
    if (p.type !== "Hund") return 0;
    let kp = Math.round(((p.psi ? 14 : 12) * p.groesse) / 100);
    if (p.einst >= 60) kp = Math.round(kp / 2); // WIKI-Idee "meidet Konflikte", Halbierung DESIGN
    if (p.einst <= -60) kp = 0;                  // WIKI-Idee "respektiert dich nicht", DESIGN
    return kp;
  }
  function giveAnimal(type, how) {
    const s = state;
    if (!s.pet) { s.pet = newPet(type); noteAnimal(); return { ok: true, msg: type + " " + how + "! Es wartet im Tierstall." }; }
    // WIKI: Stall bis 25 Tiere. Mehrere Tiere nur mit Stamm (Tierstall ist ein Stammgebäude).
    if (!s.stamm) return { ok: false, msg: "Du hast schon ein Tier (" + s.pet.name + "). Weitere Tiere passen nur in den Stall eines Stammes." };
    if (allPets(s).length >= STALL_MAX) return { ok: false, msg: "Der Stall ist voll (25 Tiere, Wiki)." };
    const np = newPet(type); np.inStall = true;
    if (!s.stallPets) s.stallPets = [];
    s.stallPets.push(np); noteAnimal();
    return { ok: true, msg: type + " " + how + "! Es steht im Stall (" + allPets(s).length + "/25)." };
  }
  function noteAnimal() { state.flags = state.flags || {}; state.flags.hadPet = true; }
  /** Jagen mit Wurfnetz in der rechten Hand (WIKI Moin 2006). Fangchance DESIGN. */
  function tryNetCapture(enemyId) {
    if (!state || !canTakeAnimal(state)) return "";
    if ((state.ep || 0) < PET_MIN_EP) return "";
    const eq = state.equip && state.equip.rechts;
    if (eq !== "Wurfnetz" || !(state.inv.Wurfnetz > 0)) return "";
    if (enemyId !== "wild_dog") return "";
    if (Math.random() < 0.35) { takeInv(state, "Wurfnetz", 1); if (!(state.inv.Wurfnetz > 0)) state.equip.rechts = null; } // DESIGN Verbrauch
    const aus = state.attrs.Ausstrahlung || 1;
    if (Math.random() > Math.min(0.7, 0.25 + aus * 0.02)) return " Das Wurfnetz verfehlt.";
    const type = Math.random() < 0.7 ? "Hund" : "Wolf"; // DESIGN: aus einem Rudel wilder Hunde
    const r = giveAnimal(type, "mit dem Wurfnetz gefangen");
    return " " + r.msg;
  }
  /** Händler-Angebot: WIKI ab 151 Einheiten (kein Wasser/Nahrung), öfter mit hoher Ausstrahlung. Chance/Preis DESIGN. */
  const PET_OFFER_PRICE = 60; // DESIGN Gold
  function tradeUnits(item, n) {
    if (item === "Wasser" || item === "Nahrung") return "";
    state.tradeUnits = (state.tradeUnits || 0) + n;
    if (state.tradeUnits < 151) return "";
    state.tradeUnits = 0;
    if (!canTakeAnimal(state) || state.petOffer || (state.ep || 0) < PET_MIN_EP) return "";
    const aus = state.attrs.Ausstrahlung || 1;
    if (Math.random() > Math.min(0.6, 0.05 + aus * 0.03)) return "";
    const types = Object.keys(PET_TYPES);
    state.petOffer = { type: types[rand(0, types.length - 1)], price: PET_OFFER_PRICE };
    return " Der Händler bietet dir ein Tier an: " + state.petOffer.type + " für " + PET_OFFER_PRICE + " Gold.";
  }
  /** Tier-Takt, aus dem Bedürfnis-Takt (1× pro Minute). Raten DESIGN, Regeln WIKI. */
  function tickPet(ticks) {
    const p = state && state.pet;
    if (!p || ticks < 1) return null;
    const sizeK = p.groesse / 100; // WIKI: größer = mehr Wasser und Nahrung; Faktor DESIGN
    const stallK = p.inStall ? 0.5 : 1;
    let msg = null;
    for (let i = 0; i < ticks; i++) {
      p.hunger = Math.min(100, p.hunger + Math.round(4 * sizeK * stallK));
      p.durst = Math.min(100, p.durst + Math.round(5 * sizeK * stallK));
      if (p.sleeping) {
        p.energie = Math.min(100, p.energie + 15); // WIKI: Energie nur im Schlaf; Menge DESIGN
        if (p.energie >= 100) { p.sleeping = false; msg = p.name + " ist aufgewacht."; }
      } else {
        p.energie = Math.max(0, p.energie - 6);
        if (p.energie <= 25 && !p.sick) { p.sleeping = true; msg = p.name + " ist eingeschlafen."; } // DESIGN-Schwelle
      }
      if (p.energie < 10 && !p.sick) { p.sick = true; msg = p.name + " ist krank geworden (Energie unter 10%)."; } // WIKI
      if (p.hunger >= 100 || p.durst >= 100) { // WIKI
        msg = p.name + " ist weggelaufen. Es war zu hungrig oder zu durstig.";
        state.pet = null;
        break;
      }
    }
    return msg;
  }
  function petAct(kind) {
    const p = state.pet;
    if (!p) { showResult("Du hast kein Tier.", true); renderAll(); return; }
    if (sleepUi) { showResult(SLEEP_MSG, true); renderAll(); return; }
    let msg = "", bad = false;
    const need = 5 * Math.max(1, Math.round(p.groesse / 100)); // DESIGN: größere Tiere fressen mehr (WIKI-Idee); Durchgang 9: Vorrat-Einheiten
    if (kind === "feed" || kind === "feedx") {
      if ((state.inv.Nahrung || 0) < need) { msg = "Du brauchst " + need + " Nahrung im Vorrat."; bad = true; }
      else if (kind === "feedx" && !(state.inv["Pilzmix-X"] > 0)) { msg = "Kein Pilzmix-X im Rucksack."; bad = true; }
      else {
        takeInv(state, "Nahrung", need);
        p.hunger = Math.max(0, p.hunger - 40);
        p.einst = clamp(p.einst - 1, -100, 100); // WIKI: nur füttern mögen Tiere nicht
        msg = p.name + " frisst. Hunger " + p.hunger + "%.";
        if (kind === "feedx") {
          takeInv(state, "Pilzmix-X", 1);
          p.sleeping = false;
          p.energie = Math.min(100, p.energie + 30); // DESIGN
          msg += " Der Pilzmix-X weckt es auf (WIKI).";
        }
      }
    } else if (kind === "water") {
      if ((state.inv.Wasser || 0) < need) { msg = "Du brauchst " + need + " Wasser im Vorrat."; bad = true; }
      else { takeInv(state, "Wasser", need); p.durst = Math.max(0, p.durst - 40); p.einst = clamp(p.einst - 1, -100, 100); msg = p.name + " trinkt. Durst " + p.durst + "%."; }
    } else if (kind === "play") {
      if (p.sleeping) { msg = p.name + " schläft. Wecken geht nur mit Pilzmix-X."; bad = true; }
      else { p.einst = clamp(p.einst + 6, -100, 100); p.energie = Math.max(0, p.energie - 5); msg = "Du spielst mit " + p.name + ". Einstellung: " + einstLabel(p.einst) + "."; } // WIKI Richtung, DESIGN Werte
    } else if (kind === "train_kraft" || kind === "train_gesch") {
      if (p.sleeping) { msg = p.name + " schläft. Wecken geht nur mit Pilzmix-X."; bad = true; }
      else if (p.sick) { msg = "Kranke Tiere kann man nicht trainieren (Wiki)."; bad = true; }
      else if (p.inStall) { msg = "Erst aus dem Stall holen."; bad = true; }
      else {
        const inc = wornBelt(state) === "Gürtel der Tiere" ? 2 : 1; // WIKI: Gürtel der Tiere, Training +2
        if (kind === "train_kraft") p.kraft += inc; else p.gesch += inc;
        p.groesse = Math.min(petMaxSize(p), p.groesse + 2); // WIKI bis 200%; +2 DESIGN
        p.energie = Math.max(0, p.energie - 10);
        p.hunger = Math.min(100, p.hunger + 5);
        p.einst = clamp(p.einst - 3, -100, 100); // WIKI: nur trainieren mögen Tiere nicht
        state.te = (state.te || 0) + 1; // WIKI: 1 TE pro Trainingseinheit
        msg = (kind === "train_kraft" ? "Krafttraining" : "Geschwindigkeitstraining") + ". Größe " + p.groesse + "%. Tiererfahrung +1.";
        if (p.energie < 10 && !p.sick) { p.sick = true; msg += " Zu wenig Energie: " + p.name + " ist krank."; bad = true; }
      }
    } else if (kind === "heal") {
      if (!p.sick) { msg = p.name + " ist gesund."; }
      else if ((state.inv.Kristall || 0) < PET_HEAL_KRISTALL) { msg = "Heilung beim Psioniker kostet " + PET_HEAL_KRISTALL + " Kristall (Wiki)."; bad = true; }
      else { takeInv(state, "Kristall", PET_HEAL_KRISTALL); p.sick = false; p.energie = Math.max(p.energie, 30); msg = "Ein Psioniker heilt " + p.name + ". −" + PET_HEAL_KRISTALL + " Kristall."; }
    } else if (kind === "stall_in" || kind === "stall_out") {
      if (!state.stamm) { msg = "Der Tierstall ist ein Stammgebäude. Erst einen Stamm gründen."; bad = true; }
      else if (kind === "stall_out" && (state.ep || 0) < PET_STALL_EP) { msg = "Aus dem Stall nehmen geht ab " + PET_STALL_EP + " EP (Wiki)."; bad = true; }
      else { p.inStall = kind === "stall_in"; msg = p.name + (p.inStall ? " steht jetzt im Stall." : " ist wieder an deiner Seite."); }
    } else if (kind === "release") {
      msg = p.name + " läuft davon. Du kümmerst dich nicht mehr darum."; state.pet = null;
    }
    log(msg, bad ? "bad" : "good");
    origPage = "tierstall";
    showResult(msg, bad); save({ quiet: true }); renderAll();
  }
  function petRename() {
    const p = state.pet;
    if (!p) return;
    const box = document.getElementById("orig-pet-name");
    const name = box && box.value ? String(box.value).trim().slice(0, 20) : "";
    if (!name) { showResult("Erst einen Namen eintragen.", true); renderAll(); return; }
    if ((state.inv.Wasser || 0) < PET_TAUFE_WASSER) { showResult("Die Taufe kostet " + PET_TAUFE_WASSER + " Wasser (Wiki).", true); renderAll(); return; }
    takeInv(state, "Wasser", PET_TAUFE_WASSER);
    p.name = name;
    const msg = "Dein " + p.type + " heißt jetzt " + name + ". −" + PET_TAUFE_WASSER + " Wasser.";
    log(msg, "good"); origPage = "tierstall"; showResult(msg); save({ quiet: true }); renderAll();
  }
  // Tierkämpfe: WIKI Gebühr = halbe EP in Kupfer, ab 600 EP, 3 Runden, Belohnung 3/2/1/0 Siege.
  // DESIGN: Kupfer gibt es im Prototyp nicht → 100 Kupfer = 1 Gold. NPC-Gegner statt anderer Spieler. Jede Uhrzeit (Original: 0–3 Uhr).
  const PIT_REWARD = { 3: { kupfer: 8000, ep: 4, cp: 4 }, 2: { kupfer: 1000, ep: 3, cp: 3 }, 1: { kupfer: 250, ep: 2, cp: 2 }, 0: { kupfer: 0, ep: 1, cp: 1 } };
  function pitFee(s) { return Math.ceil(Math.floor((s.ep || 0) / 2) / 100); }
  function petFight() {
    const p = state.pet;
    const fail = (m) => { origPage = "tierkampf"; showResult(m, true); renderAll(); };
    if (!p) return fail("Du hast kein Tier.");
    if ((state.ep || 0) < PET_FIGHT_EP) return fail("Tierkämpfe ab " + PET_FIGHT_EP + " EP (Wiki).");
    if (p.inStall) return fail("Erst aus dem Stall holen.");
    if (p.sick) return fail("Kranke Tiere dürfen nicht kämpfen (Wiki). Erst heilen.");
    if (p.sleeping) return fail(p.name + " schläft. Pilzmix-X weckt es.");
    const day = new Date().toDateString();
    if (state.flags && state.flags.pitDay === day) return fail("Heute hast du schon gekämpft. Eine Kampfnacht pro Tag (DESIGN).");
    const fee = pitFee(state);
    if (state.gold < fee) return fail("Gebühr: " + fee + " Gold (Wiki: halbe EP in Kupfer).");
    state.gold -= fee;
    state.flags = state.flags || {}; state.flags.pitDay = day;
    const power = (p.kraft + p.gesch) * (p.groesse / 100) * (p.einst >= 60 ? 0.6 : 1); // DESIGN; Wiki: braves Tier taugt nicht für Kämpfe
    const rounds = [];
    let wins = 0;
    for (let r = 1; r <= 3; r++) {
      const foe = rand(14, 22) + r * 4 + Math.floor((state.ep || 0) / 200); // DESIGN NPC-Gegner
      const won = Math.random() < clamp(0.5 + (power - foe) / 40, 0.1, 0.9);
      if (won) wins++;
      rounds.push("Runde " + r + ": " + (won ? "Sieg" : "Niederlage"));
      p.energie = Math.max(0, p.energie - 12); // WIKI: Energie fällt fast nur bei Tierkämpfen unter 10%
    }
    const rw = PIT_REWARD[wins];
    const gold = Math.floor(rw.kupfer / 100);
    state.gold += gold; state.ep += rw.ep; state.cp += rw.cp;
    let msg = rounds.join(", ") + ". " + wins + (wins === 1 ? " Sieg: +" : " Siege: +") + gold + " Gold (" + rw.kupfer + " Kupfer), +" + rw.ep + " EP, +" + rw.cp + " CP.";
    if (p.energie < 10) { p.sick = true; msg += " " + p.name + " ist erschöpft und krank."; }
    log(msg, wins >= 2 ? "good" : "bad");
    origPage = "tierkampf"; showResult(msg, wins < 2); maybeUnlockTL(); save({ quiet: true }); renderAll();
  }
  /** WIKI: Affe erhöht die Wassermenge, PSI-Affe doppelt so viel. DESIGN: +25% bei 100% Größe, +50% bei 200%. Nicht extra gelistet (WIKI). */
  function petWaterBonus(before) {
    const p = activePet(state);
    if (!p || p.type !== "Affe") return;
    const got = (state.inv.Wasser || 0) - (before.Wasser || 0);
    if (got <= 0) return;
    const extra = p.psi ? got : Math.ceil(got * p.groesse / 400);
    addInv(state, "Wasser", extra);
  }
  // --- Fähigkeiten-Baum (WIKI charakter/fahigkeiten: Namen und Schwellen) ---
  // Zähler, die der Prototyp nicht führt (Bau-, Spionage-, Diamantenerfahrung, Casino), stehen als "fehlt".
  const SKILLS = [
    ["Ortskunde", "rep", 50, "Für Pilzsammler und Uransammler (Wiki)."],
    ["Ort der Schattenhöhle", "rep", 200, "Um die Schattenhöhle zu finden (Wiki)."],
    ["Ort der Lichthöhle", "rep", 300, "Um die Lichthöhle zu finden (Wiki)."],
    ["Verhandeln", "hep", 500, "Kein Effekt im Spiel (Wiki)."],
    ["Rhetorik", "hep", 1500, "Für den Beruf Spion (Wiki)."],
    ["Politik", "hep", 3000, "Kein Effekt im Spiel (Wiki)."],
    ["Verbergen", "kep", 200, "Manchmal Bonus im Einzelkampf (Wiki). Hier: 25% Chance auf +10% KP (DESIGN)."],
    ["Taktik", "kep", 400, "Manchmal Bonus im Einzelkampf (Wiki). Hier: 25% Chance auf +10% KP (DESIGN)."],
    ["Nahkampf", "kep", 600, "Manchmal Bonus im Einzelkampf (Wiki). Hier: 25% Chance auf +10% KP (DESIGN)."],
    ["Militärtaktik", "kep", 800, "Manchmal Bonus im Einzelkampf (Wiki). Hier: 25% Chance auf +10% KP (DESIGN)."],
    ["Heilkunde", "nv", 60, "Für den Beruf Pilzsammler (Wiki)."],
    ["Erste Hilfe", "nv", 240, "Heiltränke wirken gegen Verletzungen (Wiki). Im Prototyp aktiv."],
    ["Kleine Wiederbelebung", "nv", 320, "Kein Effekt im Spiel (Wiki)."],
    ["Grosse Wiederbelebung", "nv", 400, "Um den Kelch des Lichts zu benutzen (Wiki)."],
    ["Artefaktkunde", "nv", 125, "Um Licht- oder Schattenartefakt zu finden (Wiki)."],
    ["Zoologie", "te", 500, "Tiererfahrung 500 (Wiki)."],
    ["Insektenkunde", "te", 1000, "Tiererfahrung 1000 (Wiki)."],
    ["Basteln", "kreativ", 65, "Kreativität 65 (Wiki)."],
    ["Technik", "kreativ", 130, "Kreativität 130 (Wiki)."],
    ["Feuerwaffen", "kreativ", 170, "Kreativität 170 (Wiki)."],
    ["Fahrzeuge", "kreativ", 212, "Kreativität 212 (Wiki)."],
    ["Fluggeräte", "kreativ", 290, "Kreativität 290 (Wiki)."],
    ["Flexibilität", "flex", 500, "Umschulung 60 statt 90 min (Wiki). Hilft beim Graben (Wiki)."],
    ["Genauigkeit", "flex", 1000, "Kein Effekt im Spiel (Wiki). Hier: etwas bessere Grabchance (DESIGN)."],
    ["Perfektion", "flex", 1500, "Umschulung 30 min (Wiki). Mit 3000 Wahrnehmung 100% Grabchance (Wiki)."],
    ["Architektur", null, 400, "Bauerfahrung 400 (Wiki). Zähler fehlt im Prototyp."],
    ["Spionage", null, 100, "Spionageerfahrung 100 (Wiki). Zähler fehlt im Prototyp."],
  ];
  const SKILL_STAT_LABEL = { rep: "Reiseerfahrung", hep: "Handelserfahrung", kep: "Kampferfahrung", nv: "Naturverbundenheit", te: "Tiererfahrung", kreativ: "Kreativität", flex: "Flexibilität" };
  function hasSkill(s, name) {
    const sk = SKILLS.find((x) => x[0] === name);
    return !!(sk && sk[1] && (s[sk[1]] || 0) >= sk[2]);
  }
  function skillTreeHtml() {
    const rows = SKILLS.map(([name, stat, need, eff]) => {
      const have = stat ? (state[stat] || 0) : null;
      const okk = stat && have >= need;
      const req = stat ? SKILL_STAT_LABEL[stat] + " " + have + "/" + need : "fehlt";
      return "<tr><td>" + (okk ? "✔ " : "") + origEsc(name) + "</td><td>" + origEsc(req) + "</td><td class=\"muted\">" + origEsc(eff) + "</td></tr>";
    }).join("");
    return "<h3>Fähigkeiten aus Erfahrung</h3><p class=\"muted\">Schwellen aus dem Wiki. Sie kommen von selbst, man lernt sie nicht.</p><table>" + rows + "</table>";
  }
  /** WIKI: Verbergen/Taktik/Nahkampf/Militärtaktik geben "nicht immer" einen Bonus. Chance und Höhe DESIGN. */
  function skillFightBonus(kp) {
    let k = kp;
    const used = [];
    ["Verbergen", "Taktik", "Nahkampf", "Militärtaktik"].forEach((n) => {
      if (hasSkill(state, n) && Math.random() < 0.25) { k = Math.round(k * 1.1); used.push(n); }
    });
    return { kp: k, used };
  }
  function bar(v, max) {
    const w = Math.max(0, Math.min(100, Math.round((v / (max || 100)) * 100)));
    return '<span class="ebar"><i style="width:' + w + '%"></i></span>';
  }
  function tierPageHtml() {
    const s = state;
    let h = "<h2>Tierstall</h2>" + photoRow("assets/gfx/buildings/stall.jpg", "Stall", ["Maximal 25 Tiere (Wiki). Eins an deiner Seite, weitere im Stall (nur mit Stamm).", "Aus dem Stall nehmen ab " + PET_STALL_EP + " EP."]);
    if (s.petOffer) {
      h += "<p>Angebot vom Händler: " + origEsc(s.petOffer.type) + " für " + s.petOffer.price + " Gold. " +
        origLink("kaufen", 'data-pet="buy"') + " · " + origLink("ablehnen", 'data-pet="decline"') + "</p>";
    }
    const p = s.pet;
    if (!p) {
      h += "<p>Du hast kein Tier.</p>";
      h += (s.ep || 0) < PET_MIN_EP
        ? "<p>Ein Tier gibt es erst ab " + PET_MIN_EP + " Erfahrung (Wiki). Du hast " + s.ep + ".</p>"
        : "<p>So bekommst du eins (Wiki): Wurfnetz in die rechte Hand nehmen und auf die Jagd gehen. Oder bei einem freien Händler mindestens 151 Einheiten kaufen, kein Wasser und keine Nahrung. Je höher die Ausstrahlung, desto öfter kommt ein Angebot.</p>";
      return h + "<p class=\"muted\">Es gibt Hund, Esel, Pferd, Affe, Wolf und Adler. Bilder gibt es nur für Hund, Esel und Pferd.</p>" + stallListHtml();
    }
    const T = PET_TYPES[p.type] || {};
    const state1 = p.sick ? "krank" : (p.sleeping ? "schläft" : (p.inStall ? "im Stall" : "wach, an deiner Seite"));
    h += photoRow(T.img || null, origEsc(p.name) + (p.name !== p.type ? " (" + p.type + ")" : "") + (p.psi ? " · PSI" : ""), [state1, origEsc(T.skill || "")]);
    h += "<table>" +
      "<tr><td>Kraft:</td><td>" + p.kraft + "</td></tr>" +
      "<tr><td>Geschwindigkeit:</td><td>" + p.gesch + "</td></tr>" +
      "<tr><td>Energie:</td><td>" + bar(p.energie) + "</td><td>" + p.energie + "%</td></tr>" +
      "<tr><td>Hunger:</td><td>" + bar(p.hunger) + "</td><td>" + p.hunger + "%</td></tr>" +
      "<tr><td>Durst:</td><td>" + bar(p.durst) + "</td><td>" + p.durst + "%</td></tr>" +
      "<tr><td>Größe:</td><td>" + bar(p.groesse, petMaxSize(p)) + "</td><td>" + p.groesse + "%</td></tr>" +
      "<tr><td>Einstellung:</td><td colspan=\"2\">" + origEsc(einstLabel(p.einst)) + " (" + p.einst + ")</td></tr>" +
      "</table>";
    const need = Math.max(1, Math.round(p.groesse / 100));
    h += "<p>" + origLink("füttern", 'data-pet="feed"') + " (" + need + " Nahrung) · " +
      origLink("tränken", 'data-pet="water"') + " (" + need + " Wasser) · " +
      origLink("spielen", 'data-pet="play"') + "</p>";
    h += "<p>Trainieren: " + origLink("Kraft", 'data-pet="train_kraft"') + " · " + origLink("Geschwindigkeit", 'data-pet="train_gesch"') + "</p>";
    if ((s.inv["Pilzmix-X"] || 0) > 0) h += "<p>" + origLink("mit Pilzmix-X füttern", 'data-pet="feedx"') + " (weckt das Tier, Wiki)</p>";
    if (p.sick) h += "<p>" + origLink("vom Psioniker heilen lassen", 'data-pet="heal"') + " (" + PET_HEAL_KRISTALL + " Kristall)</p>";
    h += "<p>" + (p.inStall ? origLink("aus dem Stall nehmen", 'data-pet="stall_out"') : origLink("in den Stall bringen", 'data-pet="stall_in"')) + "</p>";
    h += '<p>Taufen: <input id="orig-pet-name" maxlength="20" value="' + origEsc(p.name) + '" style="background:#111;color:#eee;border:1px solid #666"> ' +
      origLink("taufen", 'data-pet="rename"') + " (" + PET_TAUFE_WASSER + " Wasser)</p>";
    h += "<p>" + origLink("Tierkämpfe", 'data-page="tierkampf"') + " · " + origLink("Tier freilassen", 'data-pet="release"') + "</p>";
    h += stallListHtml();
    h += "<p class=\"muted\">Das Tier schläft, wann es will, und tankt nur im Schlaf Energie. Schlafende, kranke oder eingestallte Tiere helfen dir nicht. Bei 100% Hunger oder Durst läuft es weg. Ohne Stamm kann es sich nicht im Lager bedienen (Wiki).</p>";
    return h;
  }
  function pitPageHtml() {
    const s = state;
    const fee = pitFee(s);
    let h = "<h2>Tierkämpfe</h2>";
    h += "<p>Illegale Tierkämpfe, ab " + PET_FIGHT_EP + " Erfahrung (Wiki). Gebühr: halbe EP in Kupfer, hier " + fee + " Gold.</p>";
    h += "<table><tr><td>3 Siege:</td><td>8000 Kupfer, 4 EP, 4 CP</td></tr><tr><td>2 Siege:</td><td>1000 Kupfer, 3 EP, 3 CP</td></tr><tr><td>1 Sieg:</td><td>250 Kupfer, 2 EP, 2 CP</td></tr><tr><td>0 Siege:</td><td>1 EP, 1 CP</td></tr></table>";
    h += "<p>" + (s.pet ? origLink("Tier anmelden und kämpfen", 'data-pet="fight"') : "Du hast kein Tier.") + "</p>";
    h += "<p class=\"muted\">Im Original liefen die Kämpfe nachts zwischen 0 und 3 Uhr gegen Tiere anderer Spieler, in drei Runden. Hier kämpft dein Tier sofort gegen Tiere von Computer-Gegnern, einmal pro Tag. 100 Kupfer = 1 Gold. Beides ist DESIGN.</p>";
    h += "<p>" + origLink("zurück zum Tierstall", 'data-page="tierstall"') + "</p>";
    return h;
  }


  // =====================================================================
  // Pass 3 (Okt 2026): Häuser + Privatlager, Erweiterungen, Graben nach Wiki,
  // Questketten (Teleporter, Doppelläufiger Seelenbrenner, Mechaniker Junge, Ring),
  // Gürtel/Amulette, Schilde/Munition, Fahrzeuge + Pimpen, Pillen/Tränke,
  // mehrere Tiere, Strahlung in Ruhe, Lagerfeuer.
  // Regel: WIKI = steht so im Wiki. DESIGN = Prototyp-Annahme, nicht Original.
  // =====================================================================
  function xLink(label, cmd) { return origLink(label, 'data-x="' + origEsc(cmd) + '"'); }
  function qf(s) { if (!s.q) s.q = {}; return s.q; }
  function has(s, item, n) { return (s.inv[item] || 0) >= (n || 1); }
  /** DESIGN: Wiki-Mengen ÷ 10, aufgerundet, mindestens 1 (für Artefakte und Fahrzeuge). */
  function div10(cost) { const o = {}; Object.keys(cost).forEach((k) => { o[k] = Math.max(1, Math.ceil(cost[k] / 10)); }); return o; }

  // ---------- Häuser + Privatlager (WIKI Privatgebäude) ----------
  // WIKI: Kosten, TL und Lagergröße je Rohstoff. "Kein Upgrade möglich, aber einreißen und ein Neues bauen.
  // Lager muss dann erneut gebaut werden." "Für Stammesgründung notwendig."
  const HOUSES = [
    { id: "holzhuette", name: "Holzhütte", tl: 0, cost: { Holz: 25, Kunststoff: 15, Metall: 20, Nahrung: 20, Wasser: 5 }, lager: 1000 },
    { id: "steinhaus_k", name: "kleines Steinhaus", tl: 1, cost: { Holz: 120, Kunststoff: 25, Stein: 100, Metall: 45, Nahrung: 40, Wasser: 5 }, lager: 10000 },
    { id: "steinhaus_g", name: "großes Steinhaus", tl: 2, cost: { Holz: 500, Kunststoff: 100, Stein: 200, Metall: 80, Nahrung: 100, Wasser: 20 }, lager: 50000 },
    { id: "steinhaus_m", name: "großes metallverstärktes Steinhaus", tl: 3, cost: { Holz: 800, Kunststoff: 500, Stein: 900, Metall: 850, Nahrung: 200, Wasser: 50 }, lager: 500000 },
    { id: "bunker", name: "großer Bunker", tl: 4, cost: { Holz: 2000, Kunststoff: 5000, Stein: 8000, Metall: 8500, Nahrung: 500, Wasser: 200 }, lager: 1000000 },
  ];
  const LAGER_COST = { Holz: 50, Stein: 50 }; // WIKI zeigt "50, 50" ohne lesbare Rohstoffnamen → Holz/Stein DESIGN
  const CHEMIE_COST = { Holz: 500, Metall: 500, Edelmetall: 200, Kristall: 50 }; // WIKI Chemieküche
  const GOLDBUNKER_COST = { Holz: 20, Metall: 30 }; // WIKI
  const GOLDBUNKER_MAX = 128000; // WIKI 12,8 Mio. Kupfer; 100 Kupfer = 1 Gold (DESIGN-Umrechnung)
  const LAGER_ITEMS = ["Holz", "Stein", "Metall", "Kunststoff", "Sand", "Öl", "Gas", "Benzin", "Erz", "Kristall", "Edelmetall", "Glas", "Nahrung", "Wasser", "Kräuter", "Pilze", "Fell", "Kronkorken", "Schwefel", "Kalisalpeter", "Diamant (weiß)", "Diamant (blau)", "Diamant (grün)", "Diamant (rot)", "Uranoxid"];
  function houseDef(s) { return s.house ? HOUSES.find((h) => h.id === s.house.type) || null : null; }
  function hasHouse(s) { return !!houseDef(s); }
  // Durchgang 8 (DESIGN): Beim Neubau eines Hauses zählt der Inhalt des alten Lagers mit, der noch am Bauplatz liegt.
  // Sonst passt das große Steinhaus (1000 Rohstoffe) nach dem Einreißen nicht in den Rucksack (600).
  let houseBuildPay = false;
  function lagerOn(s) { return !!(s.house && (s.house.lagerBuilt || houseBuildPay) && s.locId === "camp"); }
  function lagerN(s, k) { return (s.house && s.house.lager && s.house.lager[k]) || 0; }
  /** DESIGN: Im Ruinencamp zahlt man aus Rucksack + Privatlager. */
  function haveRes(s, k) { return (s.inv[k] || 0) + (lagerOn(s) ? lagerN(s, k) : 0); }
  function canPay(s, cost) { return Object.keys(cost).every((k) => (k === "gold" ? s.gold : haveRes(s, k)) >= cost[k]); }
  function missingText(s, cost) {
    return Object.keys(cost).filter((k) => (k === "gold" ? s.gold : haveRes(s, k)) < cost[k])
      .map((k) => (cost[k] - (k === "gold" ? s.gold : haveRes(s, k))) + " " + (k === "gold" ? "Gold" : k)).join(", ");
  }
  function payCost(s, cost) {
    if (!canPay(s, cost)) return false;
    Object.keys(cost).forEach((k) => {
      let need = cost[k];
      if (k === "gold") { s.gold -= need; return; }
      const fromInv = Math.min(need, s.inv[k] || 0);
      if (fromInv) takeInv(s, k, fromInv);
      need -= fromInv;
      if (need > 0) s.house.lager[k] -= need;
    });
    return true;
  }
  function buildHouse(id) {
    const s = state; const h = HOUSES.find((x) => x.id === id);
    if (!h) return "Unbekanntes Haus.";
    if (s.locId !== "camp") return "Bauen geht im Ruinencamp.";
    if (hasHouse(s)) return "Du hast schon ein Haus. Wiki: kein Upgrade, erst einreißen.";
    if ((s.techlevel || 0) < h.tl) return h.name + " braucht Techlevel " + h.tl + " (Wiki).";
    houseBuildPay = true;
    try { if (!payCost(s, h.cost)) return "Es fehlt: " + missingText(s, h.cost) + "."; } finally { houseBuildPay = false; }
    const old = s.house || {};
    s.house = { type: h.id, lager: old.lager || {}, lagerBuilt: false, chemie: false };
    exert("craft"); gain(s, 2, 1);
    return h.name + " gebaut. Das Privatlager musst du noch bauen.";
  }
  function tearDownHouse() {
    const s = state; const h = houseDef(s);
    if (!h) return "Du hast kein Haus.";
    if (s.locId !== "camp") return "Einreißen geht im Ruinencamp.";
    s.house = { type: null, lager: s.house.lager || {}, lagerBuilt: false, chemie: false };
    return h.name + " eingerissen. Lager und Chemieküche sind weg (Wiki). Der Inhalt bleibt liegen: Er zählt beim Bau des neuen Hauses mit und ist wieder zugänglich, wenn du ein neues Lager baust (DESIGN).";
  }
  function buildLager() {
    const s = state;
    if (!hasHouse(s)) return "Erst ein Haus bauen.";
    if (s.house.lagerBuilt) return "Das Privatlager steht schon.";
    if (s.locId !== "camp") return "Bauen geht im Ruinencamp.";
    if (!payCost(s, LAGER_COST)) return "Es fehlt: " + missingText(s, LAGER_COST) + ".";
    s.house.lagerBuilt = true;
    const cap = houseDef(s).lager;
    let cut = 0;
    Object.keys(s.house.lager).forEach((k) => { if (s.house.lager[k] > cap) { cut += s.house.lager[k] - cap; s.house.lager[k] = cap; } });
    return "Privatlager gebaut. Platz: " + cap.toLocaleString("de-AT") + " je Rohstoff (Wiki)." + (cut ? " " + cut + " Einheiten passten nicht mehr hinein." : "");
  }
  function buildChemie() {
    const s = state;
    if (s.job !== "Chemiker") return "Die Chemieküche ist nur für Chemiker (Wiki).";
    if (!hasHouse(s) || !s.house.lagerBuilt) return "Wiki: Chemieküche braucht ein eigenes Haus mit Lagerausbau.";
    if (s.house.chemie) return "Die Chemieküche steht schon.";
    if (s.locId !== "camp") return "Bauen geht im Ruinencamp.";
    if (!payCost(s, CHEMIE_COST)) return "Es fehlt: " + missingText(s, CHEMIE_COST) + ".";
    s.house.chemie = true;
    return "Chemieküche gebaut. Jetzt kannst du Tränke und Pillen brauen.";
  }
  function buildGoldbunker() {
    const s = state;
    if (s.goldbunker) return "Der Goldbunker steht schon.";
    if (s.locId !== "camp") return "Bauen geht im Ruinencamp.";
    if (!payCost(s, GOLDBUNKER_COST)) return "Es fehlt: " + missingText(s, GOLDBUNKER_COST) + ".";
    s.goldbunker = { gold: 0 };
    return "Goldbunker gebaut. Gold darin verlierst du bei Niederlagen nicht (DESIGN-Folgerung).";
  }
  function lagerMove(item, n, dir) {
    const s = state;
    if (!lagerOn(s)) return "Ans Privatlager kommst du nur im Ruinencamp, mit gebautem Lager.";
    const cap = houseDef(s).lager;
    if (dir === "in") {
      const room = cap - lagerN(s, item);
      const k = Math.min(n === "all" ? (s.inv[item] || 0) : n, s.inv[item] || 0, room);
      if (k <= 0) return room <= 0 ? "Lager für " + item + " ist voll (" + cap + ")." : "Nichts davon im Rucksack.";
      takeInv(s, item, k); s.house.lager[item] = lagerN(s, item) + k;
      return k + "× " + item + " eingelagert.";
    }
    const k = Math.min(n === "all" ? lagerN(s, item) : n, lagerN(s, item));
    if (k <= 0) return "Nichts davon im Lager.";
    s.house.lager[item] -= k; addInv(s, item, k);
    const over = packLoad(s) - packCap(s);
    return k + "× " + item + " ausgelagert." + (over > 0 ? " Achtung: Rucksack über der Grenze." : "");
  }
  function bunkerMove(n, dir) {
    const s = state;
    if (!s.goldbunker) return "Kein Goldbunker.";
    if (s.locId !== "camp") return "Der Goldbunker steht im Ruinencamp.";
    if (dir === "in") {
      const k = Math.min(n === "all" ? s.gold : n, s.gold, GOLDBUNKER_MAX - s.goldbunker.gold);
      if (k <= 0) return "Nichts einzulagern.";
      s.gold -= k; s.goldbunker.gold += k; return k + " Gold in den Bunker.";
    }
    const k = Math.min(n === "all" ? s.goldbunker.gold : n, s.goldbunker.gold);
    if (k <= 0) return "Der Bunker ist leer.";
    s.goldbunker.gold -= k; s.gold += k; return k + " Gold aus dem Bunker.";
  }

  // ---------- Erweiterungen (WIKI: 4 Ausbaustufen, 90 min) ----------
  const EXTENSIONS = {
    Holz: { name: "Holzerweiterung", cost: { Holz: 20, Kunststoff: 20, Stein: 80 } },
    Metall: { name: "Metallerweiterung", cost: { Holz: 20, Kunststoff: 60, Stein: 50 } },
    Stein: { name: "Steinerweiterung", cost: { Kunststoff: 40, Stein: 30, Metall: 50 } },
    Kunststoff: { name: "Kunststofferweiterung", cost: { Holz: 10, Stein: 20, Metall: 80 } },
  };
  const EXT_BONUS = 0.25; // DESIGN: +25% Ertrag je Stufe (Wiki nennt keine Zahl)
  function extCost(res, tier) { const b = EXTENSIONS[res].cost; const o = {}; Object.keys(b).forEach((k) => { o[k] = b[k] * tier; }); return o; } // Stufe 1 WIKI, ×Stufe DESIGN
  function extTier(s, res) { return (s.ext && s.ext[res]) || 0; }
  function buildExtension(res) {
    const s = state;
    if (!EXTENSIONS[res]) return "Unbekannt.";
    if (s.locId !== "camp") return "Bauen geht im Ruinencamp.";
    const t = extTier(s, res);
    if (t >= 4) return EXTENSIONS[res].name + " hat schon Stufe 4 (Wiki: 4 Ausbaustufen).";
    const cost = extCost(res, t + 1);
    if (!payCost(s, cost)) return "Es fehlt: " + missingText(s, cost) + ".";
    if (!s.ext) s.ext = {};
    s.ext[res] = t + 1; exert("craft");
    return EXTENSIONS[res].name + " Stufe " + (t + 1) + " gebaut. +" + Math.round(EXT_BONUS * 100 * (t + 1)) + "% " + res + " beim Sammeln.";
  }
  /** Aus afterWork(): Zusatzertrag. Gilt überall (DESIGN; Wiki: auf dem eigenen Land). */
  function applyExtensions(s, got) {
    const bits = [];
    Object.keys(EXTENSIONS).forEach((res) => {
      const t = extTier(s, res);
      if (!t || !got[res]) return;
      const extra = Math.floor(got[res] * EXT_BONUS * t + 0.5);
      if (extra > 0) { addInv(s, res, extra); got[res] += extra; bits.push("+" + extra + " " + res); }
    });
    return bits.length ? "Erweiterung: " + bits.join(", ") + "." : "";
  }

  // ---------- Graben (WIKI-Regel, Skala DESIGN) ----------
  // WIKI: Fundchance hängt von Wahrnehmung und Fähigkeit Flexibilität ab. 100% bei 3000 Wahrnehmung + Perfektion.
  // WIKI: 90 min bei 0 Geschwindigkeit, 30 min ab 970 (mit Schaufel), nie unter 30. Abbrechen geht.
  // DESIGN: Prototyp-Eigenschaft × 100 ≈ Wiki-Punkte; 30 Wiki-Minuten = 4 Sekunden.
  const ATTR_SCALE = 100;
  function digTool(s) {
    const eq = s.equip || {};
    if ((eq.links === "Greifer" || eq.links === "Schaufel") && has(s, eq.links)) return eq.links; // WIKI: linke Hand
    if (has(s, "Schaufel")) return "Schaufel";
    return null;
  }
  function digMs(s) {
    const g = (s.attrs.Geschwindigkeit || 0) * ATTR_SCALE;
    let ms = 12000 - 8000 * Math.min(1, g / 970);
    if (!digTool(s)) ms *= 1.5; // DESIGN: Wiki nennt die Zeiten "mit Schaufel"
    return Math.round(Math.max(4000, ms));
  }
  function digFlexFactor(s) {
    if (hasSkill(s, "Perfektion")) return 1;
    if (hasSkill(s, "Genauigkeit")) return 0.9;
    if (hasSkill(s, "Flexibilität")) return 0.8;
    return 0.65; // DESIGN
  }
  function digChance(s) {
    let w = s.attrs.Wahrnehmung || 1;
    const cloth = bestClothing(s);
    if (cloth) w += cloth.wahrBonus || 0;
    const wp = Math.min(1, (w * ATTR_SCALE) / 3000);
    if (wp >= 1 && hasSkill(s, "Perfektion")) return 1; // WIKI-Anker
    return Math.min(0.99, 0.1 + 0.9 * wp * digFlexFactor(s));
  }
  /** WIKI: manche Böden brauchen Dynamit (Glas) oder Spitzhacke (harter Boden). Verteilung DESIGN, fest je Feld. */
  function groundAt(x, y) {
    if (placeAt(x, y)) return "normal"; // DESIGN: auf benannten Orten normaler Boden
    const h = ((x * 73856093) ^ (y * 19349663)) >>> 0;
    const r = h % 100;
    return r < 5 ? "glas" : (r < 20 ? "hart" : "normal");
  }
  const DIG_POOL = [
    { item: "Sand", n: [2, 6], w: 30 }, { item: "Kronkorken", n: [1, 3], w: 22 }, { item: "Knochen", n: [1, 1], w: 14 },
    { item: "Metall", n: [1, 2], w: 8 }, { item: "Edelmetall", n: [1, 1], w: 4 },
    // WIKI "Kann beim Graben gefunden werden":
    { item: "Eisenkette", n: [1, 1], w: 3 }, { item: "Schriftrolle", n: [1, 1], w: 3 }, { item: "Orangensaft", n: [1, 1], w: 2 }, { item: "Benzinkanister", n: [1, 1], w: 2 },
    { item: "U-P-S Päckchen", n: [1, 1], w: 2 }, // WIKI-Item; dass man es gräbt, ist DESIGN
    // DESIGN: Quest-Zutaten ohne Wiki-Fundort
    { item: "Totenkopf", n: [1, 1], w: 2 }, { item: "Lorbeerblatt", n: [1, 1], w: 2 }, { item: "Zimtstange", n: [1, 1], w: 2 },
    { item: "Verfaulte Bananenschale", n: [1, 1], w: 2 }, { item: "Verschimmelte Pilze", n: [1, 1], w: 2 }, { item: "Blaue Pilze", n: [1, 1], w: 2 },
    { item: "Rolle Bindfaden", n: [1, 1], w: 2 }, { item: "Kuchen", n: [1, 1], w: 1 }, { item: "Dose Spinat", n: [1, 1], w: 1 },
  ];
  function digRun(s) {
    const x = typeof s.px === "number" ? s.px : 0, y = typeof s.py === "number" ? s.py : 0;
    const g = groundAt(x, y);
    if (g === "glas" && !has(s, "Dynamit")) return { ok: false, msg: "Glasboden. Hier brauchst du Dynamit (Wiki)." };
    if (g === "hart" && !has(s, "Spitzhacke") && digTool(s) !== "Greifer") return { ok: false, msg: "Harter Boden. Hier brauchst du eine Spitzhacke (Wiki)." };
    let note = "";
    if (g === "glas") { takeInv(s, "Dynamit", 1); note = " Dynamit gezündet."; }
    gain(s, 1, 0);
    if (Math.random() > digChance(s)) return { ok: true, msg: "Du gräbst… nichts Brauchbares." + note };
    const pick = weighted(DIG_POOL.map((l) => ({ item: l.item, n: rand(l.n[0], l.n[1]), w: l.w })));
    let n = pick.n;
    if (digTool(s) && ["Sand", "Kronkorken"].includes(pick.item)) n += 1; // DESIGN
    addInv(s, pick.item, n);
    return { ok: true, msg: "Beim Graben: " + n + "× " + pick.item + "." + note };
  }
  function abortWork() {
    if (!workUi || sleepUi || fight) return "Nichts zum Abbrechen.";
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
    workUi = null; busy = false; setProgress(0); setStatus("Bereit.");
    return "Abgebrochen (Wiki: Graben kann abgebrochen werden).";
  }
  function openUps() {
    const s = state;
    if (!takeInv(s, "U-P-S Päckchen", 1)) return "Kein U-P-S Päckchen im Rucksack.";
    // WIKI: Gummistiefel "nur in einem U-P-S Päckchen", Schriftrolle "aus U-P-S Päckchen", Baseballmütze "im U-P-S Päckchen". Gewichte DESIGN.
    const it = weighted([{ item: "Gummistiefel", n: 1, w: 40 }, { item: "Schriftrolle", n: 1, w: 35 }, { item: "Baseballmütze", n: 1, w: 25 }]);
    addInv(s, it.item, 1);
    return "Im U-P-S Päckchen: " + it.item + ".";
  }

  // ---------- Schilde + Munition ----------
  // WIKI Stärke/Verteidigung/Kosten. Dritter Kostenposten "4/5 [?]" ohne Namen → weggelassen.
  const SHIELDS = {
    "Holzschild klein": { st: 5, def: 50, cost: { Holz: 250, Wasser: 4 }, tl: 2 },
    "Holzschild groß": { st: 10, def: 150, cost: { Holz: 500, Wasser: 4 }, tl: 2 },
    "Steinschild klein": { st: 15, def: 200, cost: { Stein: 400, Wasser: 4 }, tl: 2 },
    "Steinschild groß": { st: 20, def: 300, cost: { Stein: 600, Wasser: 4 }, tl: 3 },
    "Metallschild klein": { st: 25, def: 400, cost: { Metall: 400, Wasser: 5 }, tl: 3 },
    "Metallschild groß": { st: 30, def: 500, cost: { Metall: 800, Wasser: 5 }, tl: 4 },
    "Titanschild klein": { st: 50, def: 600, cost: { Edelmetall: 100, Wasser: 5 }, tl: 5 },
    "Titanschild groß": { st: 100, def: 700, cost: { Edelmetall: 200, Wasser: 5 }, tl: 6 },
  }; // TL ab Steinschild DESIGN (Wiki nennt TL2 nur für Holzschilde)
  // WIKI: diese Waffen "benötigen Munition".
  const AMMO_FOR = {
    "Pfeil und Bogen": "Pfeile", Armbrust: "Armbrustpfeile", Steinkatapult: "Steinkugeln", Metallkatapult: "Metallkugeln",
    Blasrohr: "Blasrohrpfeile", "Kleinmann SG6": "SG6 Magazin", "UHX Kleinmann": "Kleinmann UHX Magazin", Taser: "Taserspitzen",
    Sprengbogen: "Sprengpfeile", Klingenschleuder: "Teppichmesser", Nailgun: "Nägel", Napalmwerfer: "Napalm",
  };
  function shieldOf(s) { const n = s.equip && s.equip.links; return n && SHIELDS[n] && has(s, n) ? Object.assign({ name: n }, SHIELDS[n]) : null; }
  function ammoNeed(s) { const w = s.equip && s.equip.rechts; return w && AMMO_FOR[w] && has(s, w) ? AMMO_FOR[w] : null; }
  function ammoOk(s) { const a = ammoNeed(s); return !a || has(s, a); }
  /** DESIGN: Schild-Stärke zählt zu 1/10 als KP (Skala), Verteidigung senkt die Trefferchance des Gegners, höchstens um die Hälfte. */
  function shieldKP(s) { const sh = shieldOf(s); return sh ? Math.round(sh.st / 10) : 0; }
  function defenseFactor(s) { const sh = shieldOf(s); return sh ? 1 - Math.min(0.5, sh.def / 1500) : 1; }

  // ---------- Gürtel + Amulette (WIKI Artefakte) ----------
  // WIKI: Erforschen in der Artefaktschmiede mit Schriftrolle in der rechten Hand (45 min), 5 Artefakte erforschbar,
  // Anlegen über die rechte Hand, braucht Artefaktkunde, Ablegen nur am Gürtelportal. Mengen ÷10 = DESIGN.
  const BELTS = {
    "Gürtel der Stärke": { wiki: { "Diamant (grün)": 125, Eisenkette: 1 }, portal: [3, 23], portalItem: "Antivirus", eff: "+1000 Kraft in Einzelkämpfen (Wiki). Hier +10 KP (Skala 1/100)." },
    "Gürtel der Erkenntnis": { wiki: { "Diamant (blau)": 20, "Diamant (rot)": 20, Eisenkette: 1 }, portal: [7, 180], portalItem: "Feile", eff: "Warnt vor Angriffen (Wiki). Hier: Überfälle werden rechtzeitig bemerkt." },
    "Gürtel der Tiere": { wiki: { "Diamant (rot)": 15, "Diamant (blau)": 5, "Diamant (grün)": 100, Eisenkette: 1 }, portal: [45, 37], portalItem: "Kuchen", eff: "Kein Tier greift dich an, Training gibt +2 (Wiki)." },
    "Gürtel des Handels": { wiki: { "Diamant (rot)": 40, "Diamant (grün)": 10, Eisenkette: 1 }, portal: [145, 133], portalItem: "Bauplannotiz", eff: "Bessere Preise (Wiki). Hier: Kauf −10%, Verkauf +10% (DESIGN)." },
    "Gürtel des Oberhauptes": { wiki: { "Diamant (rot)": 15, "Diamant (blau)": 40, "Diamant (grün)": 3, Eisenkette: 1 }, portal: [195, 163], portalItem: "Dietrich", eff: "Bessere Lagerkontrolle (Wiki). Im Einzelspieler ohne Wirkung." },
  };
  // Wiki-Portal nennt "M3 Antivirus" und "Bauplan"; hier gelten Antivirus und Bauplannotiz (DESIGN-Zuordnung).
  const AMULETS = {
    "Amulett der Kreativität": { wiki: { "Rolle Bindfaden": 1, "Mutanten XTC": 5, "Diamant (rot)": 25, "Diamant (blau)": 25, "Diamant (grün)": 60 }, eff: "Kürzere Arbeitszeit für Kreativberufe (Wiki). Herstellen geht hier sofort, daher ohne Wirkung." },
    "Amulett des Angriffs": { wiki: { "Rolle Bindfaden": 1, "Mutanten XTC": 10, "Diamant (rot)": 60, "Diamant (blau)": 30, "Diamant (grün)": 20 }, eff: "Angriffsreichweite ±5000 (Wiki). Ohne andere Spieler ohne Wirkung." },
  };
  function wornBelt(s) { return (s && s.equip && s.equip.guertel) || null; }
  function researchArtifact() {
    const s = state;
    if (s.job !== "Artefaktjuwelier") return "Erforschen kann nur der Artefaktjuwelier (Wiki).";
    if (!(s.buildings && s.buildings.artefaktschmiede)) return "Dazu brauchst du die Artefaktschmiede (Wiki).";
    if (!(s.equip && s.equip.rechts === "Schriftrolle" && has(s, "Schriftrolle"))) return "Nimm eine Schriftrolle in die rechte Hand (Wiki).";
    const open = Object.keys(BELTS).filter((b) => !(s.research && s.research[b]));
    if (!open.length) return "Alle 5 Artefakte sind erforscht (Wiki: zur Zeit 5).";
    takeInv(s, "Schriftrolle", 1);
    if (!has(s, "Schriftrolle")) s.equip.rechts = null;
    exert("craft");
    if (Math.random() < 0.4) return "Die Schriftrolle ist unleserlich. Sie ist verbraucht (Chance DESIGN).";
    const b = open[rand(0, open.length - 1)];
    if (!s.research) s.research = {};
    s.research[b] = true;
    return "Erforscht: " + b + ". Bauplan in der Artefaktschmiede.";
  }
  function forgeArtifact(name) {
    const s = state;
    const def = BELTS[name] || AMULETS[name];
    if (!def) return "Unbekannt.";
    if (s.job !== "Artefaktjuwelier") return "Nur der Artefaktjuwelier schmiedet Artefakte (Wiki).";
    if (!(s.buildings && s.buildings.artefaktschmiede)) return "Dazu brauchst du die Artefaktschmiede (Wiki).";
    if (BELTS[name] && !(s.research && s.research[name])) return name + " ist noch nicht erforscht.";
    if (s.locId !== "camp") return "Die Artefaktschmiede steht im Ruinencamp.";
    const cost = div10(def.wiki);
    if (!payCost(s, cost)) return "Es fehlt: " + missingText(s, cost) + ".";
    addInv(s, name, 1); exert("craft");
    return name + " geschmiedet.";
  }
  function wearBelt(name) {
    const s = state;
    if (!BELTS[name] || !has(s, name)) return "Nicht im Rucksack.";
    if (!hasSkill(s, "Artefaktkunde")) return "Zum Tragen brauchst du die Fähigkeit Artefaktkunde (Wiki, 125 Naturverbundenheit).";
    if (wornBelt(s)) return "Du trägst schon " + wornBelt(s) + ". Ablegen geht nur am Gürtelportal (Wiki).";
    s.equip = s.equip || {}; s.equip.guertel = name; takeInv(s, name, 1);
    return name + " angelegt. " + BELTS[name].eff;
  }
  function wearAmulet(name) {
    const s = state;
    s.equip = s.equip || {};
    const list = s.equip.amulette || (s.equip.amulette = []);
    if (list.includes(name)) { s.equip.amulette = list.filter((x) => x !== name); addInv(s, name, 1); return name + " abgelegt."; }
    if (!AMULETS[name] || !has(s, name)) return "Nicht im Rucksack.";
    if (!hasSkill(s, "Artefaktkunde")) return "Zum Tragen brauchst du Artefaktkunde (Wiki).";
    if (list.length >= 2) return "Wiki: höchstens 2 Amulette.";
    list.push(name); takeInv(s, name, 1);
    return name + " angelegt. " + AMULETS[name].eff;
  }
  function beltPortalAt(s) {
    return Object.keys(BELTS).find((b) => BELTS[b].portal[0] === s.px && BELTS[b].portal[1] === s.py) || null;
  }

  // ---------- Fahrzeuge + Pimpen ----------
  // WIKI: KP, Tempo (10 Felder in X min), Benutzung ab EP, Kosten. KP ÷100, EP ÷5, Rohstoffe ÷10 = DESIGN (wie Motorrad).
  const NEW_VEHICLES = {
    Dreirad: { name: "3-Rad-Motorrad", kpBonus: 5, minEP: 160, speedFactor: 0.3, fuelPerTrip: 2, wiki: { Metall: 14000, Holz: 17000, "Öl": 1200, Gas: 900, Benzin: 20 }, sk: "Fahrzeuge" },
    Moerderschaukel: { name: "Mörderschaukel", kpBonus: 50, minEP: 400, speedFactor: 0.45, fuelPerTrip: 3, wiki: { Metall: 20000, Holz: 20000, "Öl": 12000, Gas: 2500, Benzin: 30 }, sk: "Fahrzeuge" },
    Transporter: { name: "Transporter", kpBonus: 30, minEP: 240, minKraft: 8, speedFactor: 0.6, fuelPerTrip: 4, packMult: 10, wiki: { Metall: 40000, Holz: 40000, "Öl": 15000, Gas: 5000, Benzin: 100 }, sk: "Fahrzeuge" },
    Flugsegler: { name: "Flugsegler", kpBonus: 70, minEP: 500, speedFactor: 0.15, prepMs: 2000, fuelPerTrip: 3, wiki: { Edelmetall: 1000, Metall: 50000, Holz: 10000, "Öl": 15000, Gas: 1000, Benzin: 50 }, parts: ["Impulssteuerung", "Implosionsantrieb", "aktive Kernfusionszelle"], sk: "Fluggeräte" },
    Flugballon: { name: "Flugballon", kpBonus: 90, minEP: 600, speedFactor: 0.15, prepMs: 1300, fuelPerTrip: 3, wiki: { Edelmetall: 1200, Metall: 60000, Holz: 10000, "Öl": 12000, Gas: 1000, Benzin: 50 }, parts: ["Tachyonengenerator", "Magnetfeldimpulsator", "aktive Kernfusionszelle"], sk: "Fluggeräte" },
    Doppeldecker: { name: "Doppeldecker", kpBonus: 110, minEP: 700, speedFactor: 0.15, prepMs: 700, fuelPerTrip: 3, wiki: { Edelmetall: 1500, Metall: 80000, Holz: 10000, "Öl": 15000, Gas: 1000, Benzin: 50 }, parts: ["Levitationsantrieb", "Magnetimpulssteuerung", "EMP Zelle", "aktive Kernfusionszelle"], sk: "Fluggeräte" },
    Zeitraffer: { name: "Zeitraffer", kpBonus: 150, minEP: 800, minWahr: 5, speedFactor: 0.15, fuelPerTrip: 1, fuelItem: "Uranoxid", wiki: { Edelmetall: 2000, Metall: 120000, Holz: 15000, "Öl": 18000, Gas: 1500 }, parts: ["Tachyonengenerator", "Magnetfeldimpulsator", "EMP Zelle", "aktive Kernfusionszelle"], sk: "Fluggeräte", buildKraft: 5 },
  };
  Object.keys(NEW_VEHICLES).forEach((id) => {
    const v = NEW_VEHICLES[id];
    VEHICLES[id] = { name: v.name, img: null, speedFactor: v.speedFactor, needsCost: 0, fuelPerTrip: v.fuelPerTrip, fuelItem: v.fuelItem, kpBonus: v.kpBonus, minEP: v.minEP, minKraft: v.minKraft || 0, minWahr: v.minWahr || 0, prepMs: v.prepMs || 0, packMult: v.packMult || 0 };
  });
  // DESIGN: Fluggeräte-Bauteile. Wiki listet sie, aber die Kostenzahlen haben keine Rohstoffnamen.
  const VEH_PARTS = {
    Impulssteuerung: { Edelmetall: 20, Kristall: 10, Metall: 100 }, Implosionsantrieb: { Edelmetall: 30, Kristall: 10, Metall: 150 },
    Tachyonengenerator: { Edelmetall: 35, Kristall: 15, Metall: 120 }, Magnetfeldimpulsator: { Edelmetall: 25, Kristall: 15, Metall: 120 },
    Levitationsantrieb: { Edelmetall: 30, Kristall: 20, Metall: 150 }, Magnetimpulssteuerung: { Edelmetall: 25, Kristall: 10, Metall: 100 },
    "EMP Zelle": { Edelmetall: 35, Kristall: 5, Metall: 80 }, "aktive Kernfusionszelle": { Edelmetall: 30, Uranoxid: 2, Kristall: 10 },
  };
  function vehCost(id) { return div10(NEW_VEHICLES[id].wiki); }
  function buildVehicle(id) {
    const s = state; const v = NEW_VEHICLES[id];
    if (!v) return "Unbekannt.";
    if (s.job !== "Mechaniker") return "Fahrzeuge baut der Mechaniker (Wiki).";
    if (!bHas(s, "werkstatt")) return "Dazu brauchst du die Werkstatt (Wiki).";
    if (!hasSkill(s, v.sk)) return "Wiki: Fähigkeit " + v.sk + " nötig.";
    if (v.buildKraft && (s.attrs.Kraft || 0) < v.buildKraft) return "Zum Bau " + v.buildKraft + " Kraft nötig (Wiki 500, Skala DESIGN).";
    if (s.locId !== "camp") return "Die Werkstatt steht im Ruinencamp.";
    const cost = Object.assign({}, vehCost(id));
    (v.parts || []).forEach((p) => { cost[p] = (cost[p] || 0) + 1; });
    if (!payCost(s, cost)) return "Es fehlt: " + missingText(s, cost) + ".";
    addInv(s, id, 1); exert("craft"); gain(s, 3, 1);
    return v.name + " gebaut.";
  }
  function buildPart(name) {
    const s = state;
    if (!VEH_PARTS[name]) return "Unbekannt.";
    if (s.job !== "Mechaniker" && s.job !== "Erfinder") return "Bauteile bauen Mechaniker oder Erfinder (DESIGN).";
    if (!payCost(s, VEH_PARTS[name])) return "Es fehlt: " + missingText(s, VEH_PARTS[name]) + ".";
    addInv(s, name, 1); exert("craft");
    return name + " gebaut.";
  }
  // WIKI Fahrzeug pimpen (Werkstatt, Mechaniker). Wiki-TL 10–13 gibt es im Prototyp nicht → TL 9 (DESIGN).
  const PIMP = {
    tank: { name: "Tankvolumen", max: 10, cost: (n) => ({ Edelmetall: 50 + 15 * (n - 1) }), eff: "+20% Tank je Stufe (Wiki). Hier: Chance auf eine Fahrt ohne Treibstoff (DESIGN)." },
    cargo: { name: "Ladekapazität", max: 10, cost: (n) => ({ Edelmetall: 75 * n, Metall: 125 * n }), eff: "+5% Ladung je Stufe (Wiki; Metall ÷10 und 10 Stufen DESIGN)." },
    armor: { name: "Panzerung", max: 10, cost: (n) => ({ Edelmetall: 125 + 55 * (n - 1) }), eff: "+10% KP je Stufe (Wiki)." },
  };
  function pimpOf(s, id) { if (!s.pimp) s.pimp = {}; if (!s.pimp[id]) s.pimp[id] = { plate: "", tank: 0, cargo: 0, armor: 0 }; return s.pimp[id]; }
  function pimpCheck(s) {
    if (s.job !== "Mechaniker") return "Pimpen kann nur der Mechaniker (Wiki).";
    if (!bHas(s, "werkstatt")) return "Dazu brauchst du die Werkstatt (Wiki).";
    if ((s.techlevel || 0) < 9) return "Wiki: Techlevel 10 bis 13. Im Prototyp ab TL 9 (DESIGN).";
    if (!s.activeVehicle || !has(s, s.activeVehicle)) return "Erst ein Fahrzeug nehmen.";
    return null;
  }
  function pimpUp(kind) {
    const s = state; const err = pimpCheck(s); if (err) return err;
    const d = PIMP[kind]; if (!d) return "Unbekannt.";
    const p = pimpOf(s, s.activeVehicle);
    if (p[kind] >= d.max) return d.name + " ist ausgebaut.";
    const cost = d.cost(p[kind] + 1);
    if (!payCost(s, cost)) return "Es fehlt: " + missingText(s, cost) + ".";
    p[kind] += 1;
    return d.name + " Stufe " + p[kind] + ".";
  }
  function setPlate(txt) {
    const s = state; const err = pimpCheck(s); if (err) return err;
    const t = String(txt || "").trim().slice(0, 6); // WIKI: max 6 Zeichen
    if (!t) return "Kennzeichen eingeben.";
    if (!payCost(s, { Edelmetall: 25 })) return "Es fehlt: " + missingText(s, { Edelmetall: 25 }) + "."; // WIKI 25 Edelmetall
    pimpOf(s, s.activeVehicle).plate = t;
    return "Kennzeichen: " + t + ".";
  }
  function vehFuelItem(v) { return (v && v.fuelItem) || "Benzin"; }
  function vehUsable(s, v) {
    if (!v || (s.ep || 0) < v.minEP) return false;
    if (v.minKraft && (s.attrs.Kraft || 0) < v.minKraft) return false;
    if (v.minWahr && (s.attrs.Wahrnehmung || 0) < v.minWahr) return false;
    return (s.inv[vehFuelItem(v)] || 0) >= v.fuelPerTrip;
  }
  function vehKpBonus(s, v) { if (!v) return 0; const p = s.pimp && s.pimp[v.id]; return Math.round(v.kpBonus * (1 + 0.1 * ((p && p.armor) || 0))); }
  /** DESIGN: größerer Tank = Chance, dass eine Fahrt keinen Treibstoff kostet. */
  function tankSaves(s, v) { const p = s.pimp && s.pimp[v.id]; const t = (p && p.tank) || 0; return t > 0 && Math.random() < 1 - 1 / (1 + 0.2 * t); }
  function vehPackMult(s) {
    const v = getActiveVehicle(s);
    if (!v) return 1;
    const p = s.pimp && s.pimp[v.id];
    return (v.packMult || 1) * (1 + 0.05 * ((p && p.cargo) || 0));
  }

  // ---------- Pillen + Tränke (WIKI Kosten/Wirkung) ----------
  // WIKI: +20 auf eine Eigenschaft, 90–130 min, danach Müdigkeit. DESIGN: +2 (Skala 1/10), 90–130 Sekunden, Müdigkeit +30.
  const BOOST_PILLS = { Hastpillen: "Geschwindigkeit", Kraftpillen: "Kraft", Wahrnehmungspillen: "Wahrnehmung" };
  const BOOST_N = 2;
  function takeBoostPill(name) {
    const s = state; const attr = BOOST_PILLS[name];
    if (!s.boosts) s.boosts = [];
    if (s.boosts.some((b) => b.attr === attr)) return "Die letzte Pille wirkt noch.";
    takeInv(s, name, 1);
    s.attrs[attr] = (s.attrs[attr] || 0) + BOOST_N;
    const ms = rand(90, 130) * 1000;
    s.boosts.push({ attr, n: BOOST_N, until: Date.now() + ms, name });
    return name + ": " + attr + " +" + BOOST_N + " für etwa " + Math.round(ms / 1000) + " Sekunden (Wiki: +20 für 90 bis 130 Minuten).";
  }
  function tickBoosts() {
    const s = state;
    if (!s || !s.boosts || !s.boosts.length) return false;
    const now = Date.now();
    const due = s.boosts.filter((b) => b.until <= now);
    if (!due.length) return false;
    s.boosts = s.boosts.filter((b) => b.until > now);
    due.forEach((b) => {
      s.attrs[b.attr] = Math.max(1, (s.attrs[b.attr] || 0) - b.n);
      if (b.noTired) { const t0 = b.name + ": " + b.attr + " wieder normal."; log(t0, "sys"); showResult(t0); return; }
      s.fatigue = Math.min(100, (s.fatigue || 0) + 30);
      const t = b.name + " lässt nach: " + b.attr + " wieder normal, Müdigkeit +30 (Wiki: Nebenwirkung Müdigkeit).";
      log(t, "bad"); showResult(t, true);
    });
    return true;
  }
  function useSpecialPotion(name) {
    const s = state;
    const p4 = useP4Potion(name);
    if (p4 != null) return p4;
    if (BOOST_PILLS[name]) return takeBoostPill(name);
    if (name === "Berufswahltrank") {
      takeInv(s, name, 1);
      const old = s.job; s.job = "ohne Beruf";
      return "Berufswahltrank: Beruf " + old + " gelöscht (Wiki). Wähle unter Fähigkeiten einen neuen.";
    }
    if (name === "Karmatrank") {
      if ((s.attrs.Ausdauer || 0) < 10) return "Wiki: 100 Ausdauer nötig. Im Prototyp 10 (Skala DESIGN).";
      takeInv(s, name, 1);
      const k = ensureKarma(s); k.light = 0; k.dark = 0;
      return "Karmatrank: Dein Karma ist neutral (Wiki).";
    }
    return null;
  }

  // ---------- Neue Rezepte ----------
  // payLager: aus Rucksack + Privatlager zahlen. needChemie: Chemieküche (WIKI).
  [
    { id: "hastpillen", label: "Hastpillen", desc: "WIKI: Geschwindigkeit +20, danach Müdigkeit. Rote Kräuter → Kräuter (DESIGN).", cost: { Holz: 100, Wasser: 100, Kräuter: 5 }, result: { Hastpillen: 1 }, minTL: 5, needJob: "Chemiker", needChemie: true, payLager: true },
    { id: "kraftpillen", label: "Kraftpillen", desc: "WIKI: Kraft +20.", cost: { Holz: 100, Wasser: 200, Kräuter: 10 }, result: { Kraftpillen: 1 }, minTL: 5, needJob: "Chemiker", needChemie: true, payLager: true },
    { id: "wahrpillen", label: "Wahrnehmungspillen", desc: "WIKI: Wahrnehmung +20.", cost: { Holz: 100, Wasser: 500, Kräuter: 5 }, result: { Wahrnehmungspillen: 1 }, minTL: 5, needJob: "Chemiker", needChemie: true, payLager: true },
    { id: "berufswahltrank", label: "Berufswahltrank", desc: "WIKI: löscht den Beruf.", cost: { Holz: 250, Kunststoff: 250, Metall: 250, Stein: 250, Wasser: 50 }, result: { Berufswahltrank: 1 }, minTL: 4, needJob: "Chemiker", needChemie: true, payLager: true },
    { id: "karmatrank", label: "Karmatrank", desc: "WIKI: neutralisiert Karma. Grüne Pilze → Pilze (DESIGN).", cost: { Wasser: 300, Pilze: 3, "Dose Spinat": 1 }, result: { Karmatrank: 1 }, minTL: 4, needJob: "Chemiker", needChemie: true, payLager: true },
    { id: "antibiotikum", label: "Antibiotikum", desc: "WIKI: Chemiker stellen es in der Chemieküche her. Kosten DESIGN.", cost: { Pilze: 5, Kräuter: 5, Wasser: 20 }, result: { Antibiotikum: 1 }, minTL: 1, needJob: "Chemiker", needChemie: true, payLager: true },
    { id: "schwarzpulver", label: "Schwarzpulver", desc: "WIKI: Chemieküche. Kosten DESIGN.", cost: { Holzkohle: 2, Schwefel: 1, Kalisalpeter: 2 }, result: { Schwarzpulver: 1 }, minTL: 1, needJob: "Chemiker", needChemie: true, payLager: true },
    { id: "pfeile", label: "Pfeile", desc: "WIKI-Kosten. Munition für Pfeil und Bogen, 1 je Kampf (DESIGN).", cost: { Holz: 10 }, result: { Pfeile: 1 }, minTL: 1, needJob: "Waffentechniker", payLager: true },
    { id: "armbrustpfeile", label: "Armbrustpfeile", desc: "WIKI-Kosten.", cost: { Kunststoff: 50, Holz: 300 }, result: { Armbrustpfeile: 1 }, minTL: 2, needJob: "Waffentechniker", payLager: true },
    { id: "steinkugeln", label: "Steinkugeln", desc: "WIKI-Kosten.", cost: { Stein: 500 }, result: { Steinkugeln: 1 }, minTL: 2, needJob: "Waffentechniker", payLager: true },
    { id: "metallkugeln", label: "Metallkugeln", desc: "WIKI-Kosten.", cost: { Metall: 1000 }, result: { Metallkugeln: 1 }, minTL: 3, needJob: "Waffentechniker", payLager: true },
    { id: "blasrohrpfeile", label: "Blasrohrpfeile", desc: "WIKI-Kosten.", cost: { Kunststoff: 200, Metall: 100 }, result: { Blasrohrpfeile: 1 }, minTL: 3, needJob: "Waffentechniker", payLager: true },
    { id: "sg6", label: "SG6 Magazin", desc: "WIKI-Kosten (Erdgas/Erdöl = Gas/Öl).", cost: { Gas: 200, Metall: 500, "Öl": 50, Schwarzpulver: 1 }, result: { "SG6 Magazin": 1 }, minTL: 5, needJob: "Waffentechniker", payLager: true },
    { id: "napalm", label: "Napalm", desc: "WIKI: vergammelter Orangensaft + Benzinkanister.", cost: { Orangensaft: 1, Benzinkanister: 1 }, result: { Napalm: 1 }, minTL: 5, needJob: "Waffentechniker", payLager: true },
    { id: "wallbrecher", label: "Wallbrecher", desc: "WIKI: zerstört jede Art von Wall. Wiki-Kosten ohne Rohstoffnamen, Waffenfabrik fehlt → Kosten DESIGN.", cost: { Holz: 90, Stein: 60, Metall: 80, Edelmetall: 5 }, result: { Wallbrecher: 1 }, minTL: 3, needJob: "Waffentechniker", payLager: true },
    { id: "machete_wiki", label: "Machete (Erfinder)", desc: "WIKI-Rezept: 2 kleine Sense, Holzspeer, Rolle Bindfaden, 5 Edelmetall.", cost: { "kleine Sense": 2, Holzspeer: 1, "Rolle Bindfaden": 1, Edelmetall: 5 }, result: { Machete: 1 }, minTL: 8, needJob: "Erfinder", payLager: true },
    { id: "dietrich", label: "Dietrich", desc: "Wiki-Werkzeug ohne Kosten. Kosten DESIGN.", cost: { Metall: 15, Edelmetall: 2 }, result: { Dietrich: 1 }, minTL: 3, needJob: "Werkzeugmacher", payLager: true },
    { id: "feile", label: "Feile", desc: "Wiki-Werkzeug ohne Kosten. Kosten DESIGN.", cost: { Metall: 10, Stein: 5 }, result: { Feile: 1 }, minTL: 3, needJob: "Werkzeugmacher", payLager: true },
    { id: "diamant_gruen_wiki", label: "grüner Diamant", desc: "WIKI: 10 weiße Diamanten + 10 Schwefel.", cost: { "Diamant (weiß)": 10, Schwefel: 10 }, result: { "Diamant (grün)": 1 }, minTL: 9, needJob: "Artefaktjuwelier", payLager: true },
    { id: "diamant_blau_wiki", label: "blauer Diamant", desc: "WIKI: 25 weiße Diamanten + 10 Kaliumnitrat (= Kalisalpeter).", cost: { "Diamant (weiß)": 25, Kalisalpeter: 10 }, result: { "Diamant (blau)": 1 }, minTL: 9, needJob: "Artefaktjuwelier", payLager: true },
    { id: "diamant_rot_wiki", label: "roter Diamant", desc: "WIKI: 50 weiße Diamanten + 5 Holzkohle.", cost: { "Diamant (weiß)": 50, Holzkohle: 5 }, result: { "Diamant (rot)": 1 }, minTL: 9, needJob: "Artefaktjuwelier", payLager: true },
  ].concat(Object.keys(SHIELDS).map((n) => ({
    id: "schild_" + n.replace(/\W+/g, "_"), label: n, desc: "WIKI: Stärke " + SHIELDS[n].st + ", Verteidigung " + SHIELDS[n].def + ".",
    cost: SHIELDS[n].cost, result: { [n]: 1 }, minTL: SHIELDS[n].tl, needJob: "Waffentechniker", payLager: true,
  }))).forEach((c) => CRAFTS.push(c));
  // WIKI: Tränke und Pillen braut man in der Chemieküche. Alte Chemiker-Rezepte mit Trank-Ergebnis bekommen die Pflicht auch.
  CRAFTS.forEach((c) => { if (c.needJob === "Chemiker" && Object.keys(c.result || {}).some((k) => POTIONS[k] || BOOST_PILLS[k])) c.needChemie = true; });
  // Die alten DESIGN-Färberezepte (1 weiß + Kristall/Edelmetall) widersprechen dem Wiki-Rezept → entfernt.
  for (let i = CRAFTS.length - 1; i >= 0; i--) if (CRAFTS[i].id === "diamant_faerben_blau" || CRAFTS[i].id === "diamant_faerben_rot") CRAFTS.splice(i, 1);
  Object.keys(BOOST_PILLS).concat(["Berufswahltrank", "Karmatrank"]).forEach((n) => { POTIONS[n] = { special: true, desc: "WIKI" }; });
  // Händler: Sortiment und Preise DESIGN, nur in bestimmten Höhlen
  const MUTANT_CAVES = ["w16x1", "w153x3", "w195x165", "w120x170", "w2x200"];
  const HUMAN_CAVES = ["w6x55", "w198x196"];
  [
    { item: "Machete", buy: 30, sell: 10, where: ["w40x58", "haendler"] },
    { item: "Dietrich", buy: 40, sell: 12, where: ["w40x58", "haendler2"] },
    { item: "Feile", buy: 25, sell: 8, where: ["w40x58", "haendler2"] },
    { item: "Kuchen", buy: 10, sell: 3, where: ["w40x58"] },
    { item: "Lorbeerblatt", buy: 8, sell: 2, where: ["haendler"] },
    { item: "Zimtstange", buy: 8, sell: 2, where: ["haendler"] },
    { item: "Mutanten XTC", buy: 20, sell: 6, where: ["w38x52", "w160x170", "w141x28"] },
    { item: "Napalm", buy: 60, sell: 15, where: MUTANT_CAVES }, // WIKI: Napalm auch "in einer Mutantenhändlerhöhle"; Preis DESIGN
    { item: "Dynamit", buy: 25, sell: 6, where: MUTANT_CAVES.concat(HUMAN_CAVES) },
    { item: "Pfeile", buy: 3, sell: 1, where: HUMAN_CAVES },
    { item: "Schwefel", buy: 4, sell: 1, where: HUMAN_CAVES },
    { item: "Kalisalpeter", buy: 4, sell: 1, where: HUMAN_CAVES },
  ].forEach((t) => TRADE.push(t));
  function tradeHere(t, loc) { return !t.where || !!(loc && t.where.includes(loc.id)); }
  function buyPrice(t) { return wornBelt(state) === "Gürtel des Handels" && !t.payItem ? Math.max(1, Math.ceil(t.buy * 0.9)) : t.buy; }
  function sellPrice(t) { return wornBelt(state) === "Gürtel des Handels" ? Math.ceil(t.sell * 1.1) : t.sell; }

  // ---------- Orte: Koordinaten-Korrektur + Questhöhlen ----------
  (function fixPlaces() {
    // Fix: Rivalenlager (DESIGN) lag auf 110/110 und verdeckte die Wiki-Jungenhöhle → 112/114 (frei).
    const rc = LOCATIONS.find((l) => l.id === "rival_camp");
    if (rc) { rc.x = 112; rc.y = 114; }
    // Wiki-Tabelle: Hinweistext steckte im Namen; Tippfehler im Wiki ("Tarvene der Informaten").
    const NAMES = {
      "110,110": "Jungenhöhle", "2,183": "Kranker Mann", "108,108": "Höhle des Vergessens", "10,15": "Anti-Smoker e.V.",
      "70,200": "Taverne der Informanten", "7,180": "Gürtelportal der Erkenntnis", "145,133": "Gürtelportal des Handels",
      "195,163": "Gürtelportal des Oberhauptes", "45,37": "Gürtelportal der Tiere", "3,23": "Gürtelportal der Stärke",
      "100,91": "Eitles Händlermädchen",
    };
    const RENAME = { masken: "Verschüttete Höhle (Masken)", maedchen1: "Trauriges Mädchen (Blumen)", maedchen2: "Trauriges Mädchen (Ente)", trauung: "Mutantentrauungshöhle" };
    if (!placeAt(110, 110)) LOCATIONS.push({ id: "w110x110", name: "Jungenhöhle", x: 110, y: 110, tags: ["Höhle", "Wiki"], actions: ["visit"], enemies: [] });
    LOCATIONS.forEach((l) => {
      const k = l.x + "," + l.y;
      if (NAMES[k] && /^w\d+x\d+$/.test(l.id)) l.name = NAMES[k];
      if (RENAME[l.id]) l.name = RENAME[l.id];
    });
    const add = (id, acts, extra) => { const l = LOCATIONS.find((x) => x.id === id); if (!l) return; acts.forEach((a) => { if (!l.actions.includes(a)) l.actions.push(a); }); Object.assign(l, extra || {}); };
    const TP = { tags: ["Höhle", "Quest", "Teleporter"] };
    add("w2x10", ["zug_einbrechen", "zug_kampf"], TP);
    add("w70x200", ["taverne_pw"], TP);
    add("w100x91", ["spiegel_tausch"], TP);
    add("w193x10", ["bew_kampf1", "bew_pw", "bew_kampf2", "bew_laser"], TP);
    add("w30x195", ["priester_puppe", "priester_diamant"], TP);
    add("w2x183", ["kranker_antibiotikum"], TP);
    add("w195x18", ["sohn_macheten"], TP);
    add("w188x196", ["seelen_pw", "seelen_kampf"], TP);
    add("forscher", ["tele_notiz", "tele_stein"]);
    add("w194x188", ["seelenbrenner_kauf", "medaillon_ritual"], { tags: ["Höhle", "Quest", "Seelenbrenner"] });
    add("chemiker_cave", ["seil_tausch"]);
    add("w191x62", ["saeure_betreten", "seelenbrenner_tausch"], { tags: ["Höhle", "Quest", "Seelenbrenner"] });
    add("mechaniker", ["junge_auftrag", "junge_abgeben"]);
    add("w110x110", ["junge_befreien"], { tags: ["Höhle", "Quest"] });
    add("ring", ["eheringe"]);
    add("w108x108", ["vergessen"]);
    ["w7x180", "w145x133", "w195x163", "w45x37", "w3x23"].forEach((id) => add(id, ["guertel_ablegen"], { tags: ["Höhle", "Gürtelportal"] }));
    ["w40x58", "w38x52", "w160x170", "w141x28"].concat(MUTANT_CAVES, HUMAN_CAVES).forEach((id) => add(id, [], { trade: true }));
    ["w100x107", "w104x195", "w155x7", "w27x72"].forEach((id) => add(id, ["roulette"]));
    ["w155x153", "w50x51"].forEach((id) => add(id, ["wuerfel"]));
  })();

  // ---------- Quest-Gegner (KP/TP DESIGN) ----------
  ENEMIES.zug_mutant = { id: "zug_mutant", name: "Mutant (Zugemauerte Höhle)", img: ENEMIES.raider.img, kp: 32, hp: 16, roundsMax: 7, reward: { ep: 4, cp: 2, kep: 3 }, loot: [{ item: "Kronkorken", n: [1, 3], w: 1 }] };
  ENEMIES.hoehlenwache = { id: "hoehlenwache", name: "Wache der Bewachten Höhle", img: ENEMIES.raider.img, kp: 36, hp: 16, roundsMax: 7, reward: { ep: 4, cp: 2, kep: 3 }, loot: [{ item: "Kronkorken", n: [1, 3], w: 1 }] };
  ENEMIES.seelenwache = { id: "seelenwache", name: "Wache der Seelenhöhle", img: ENEMIES.raider.img, kp: 45, hp: 18, roundsMax: 7, reward: { ep: 5, cp: 2, kep: 4 }, loot: [{ item: "Kronkorken", n: [2, 4], w: 1 }] };
  function questFight(enemy, tag) { setTimeout(() => startFight(enemy, "Questkampf", tag), 60); }
  function questFightWon(tag) {
    const s = state; const q = qf(s); let msg = "";
    if (tag === "zug") { q.zugMutant = true; addInv(s, "Ei der CP", 1); msg = "Der Mutant lässt das Ei der CP fallen."; }
    if (tag === "bew1") { q.bew1 = true; msg = "Erste Wache besiegt. Jetzt das Passwort."; }
    if (tag === "bew2") { q.bew3 = true; msg = "Zweite Wache besiegt. Vor dir sind Laser."; }
    if (tag === "seele") {
      q.seelenWins = (q.seelenWins || 0) + 1;
      if (q.seelenWins >= 2) { q.seelenDone = true; addInv(s, "Stein der Seelen", 1); msg = "Beide Wachen besiegt. Du nimmst den Stein der Seelen."; }
      else msg = "Eine Wache liegt. Die zweite wartet.";
    }
    if (msg) log(msg, "good");
    return msg;
  }

  // ---------- Quest-Aktionen (Ablauf WIKI; Mengen/Chancen wo markiert DESIGN) ----------
  const ACID_BOOTS = ["Gummistiefel"]; // DESIGN-Lesart von "säurebeständige Stiefel"
  const GOOD_BOOTS = ["Gummistiefel", "Stahlstiefel", "Kampfstiefel", "Titanstiefel"]; // DESIGN-Lesart von "gute Stiefel"
  function bootsOn(s, list) { const f = (s.equip && (s.equip.lfuss || s.equip.rfuss)) || ""; return list.includes(f) && has(s, f); }
  function QA(label, show, run) { return { label, icon: "Kronkorken", duration: 1500, show, run }; }
  Object.assign(ACTIONS, {
    // --- Teleporter ---
    zug_einbrechen: QA("Mauer mit dem Wallbrecher einreißen", (s) => !qf(s).zugOpen, (s) => {
      if (!has(s, "Wallbrecher")) return { ok: false, msg: "Die Höhle ist zugemauert. Wiki: Wallbrecher nötig." };
      qf(s).zugOpen = true; gain(s, 2, 1);
      return { ok: true, msg: "Die Mauer bricht. Drinnen steht Säure am Boden." };
    }),
    zug_kampf: QA("Durch die Säure gehen und kämpfen", (s) => qf(s).zugOpen && !qf(s).zugMutant, (s) => {
      if (!bootsOn(s, ACID_BOOTS)) return { ok: false, msg: "Wiki: säurebeständige Stiefel nötig. Hier: Gummistiefel an den Füßen." };
      questFight("zug_mutant", "zug");
      return { ok: true, msg: "Ein Mutant stellt sich dir in den Weg." };
    }),
    taverne_pw: QA("Den Informanten das Ei der CP geben", (s) => !qf(s).pw193, (s) => {
      if (s.job !== "Spion") return { ok: false, msg: "Wiki: Hier reden sie nur mit Spionen." };
      if (s.gold < 50) return { ok: false, msg: "Wiki: 50 Gold nötig." };
      if (!has(s, "Ei der CP")) return { ok: false, msg: "Die Informanten wollen das Ei der CP." };
      s.gold -= 50; takeInv(s, "Ei der CP", 1); qf(s).pw193 = true; gain(s, 2, 1);
      return { ok: true, msg: "Passwort für die Bewachte Höhle (193/10) erhalten." };
    }),
    spiegel_tausch: QA("Dem Mädchen einen blauen Diamanten geben", (s) => !qf(s).spiegel, (s) => {
      if (!takeInv(s, "Diamant (blau)", 1)) return { ok: false, msg: "Sie will einen blauen Diamanten (Wiki)." };
      qf(s).spiegel = true; addInv(s, "Spiegel", 1);
      return { ok: true, msg: "Sie gibt dir ihren Spiegel." };
    }),
    bew_kampf1: QA("Gegen die Wache kämpfen", (s) => !qf(s).bew1, () => { questFight("hoehlenwache", "bew1"); return { ok: true, msg: "Die Wache greift an." }; }),
    bew_pw: QA("Passwort nennen", (s) => qf(s).bew1 && !qf(s).bew2, (s) => {
      if (!qf(s).pw193) return { ok: false, msg: "Du kennst das Passwort nicht. Die Taverne der Informanten (70/200) weiß es." };
      qf(s).bew2 = true; return { ok: true, msg: "Das Tor geht auf. Dahinter steht eine zweite Wache." };
    }),
    bew_kampf2: QA("Gegen die zweite Wache kämpfen", (s) => qf(s).bew2 && !qf(s).bew3, () => { questFight("hoehlenwache", "bew2"); return { ok: true, msg: "Die zweite Wache greift an." }; }),
    bew_laser: QA("Mit dem Spiegel durch die Laser", (s) => qf(s).bew3 && !qf(s).puppe, (s) => {
      if (!(s.equip && s.equip.rechts === "Spiegel" && has(s, "Spiegel"))) return { ok: false, msg: "Wiki: Spiegel in die rechte Hand nehmen." };
      takeInv(s, "Spiegel", 1); s.equip.rechts = null; qf(s).puppe = true; addInv(s, "Puppe des Schicksals", 1); gain(s, 3, 1);
      return { ok: true, msg: "Der Spiegel lenkt die Laser ab und ist danach weg. Du nimmst die Puppe des Schicksals." };
    }),
    priester_puppe: QA("Dem Priester die Puppe geben", (s) => !qf(s).priester1, (s) => {
      if (!takeInv(s, "Puppe des Schicksals", 1)) return { ok: false, msg: "Der Priester will die Puppe des Schicksals." };
      qf(s).priester1 = true;
      return { ok: true, msg: "Er hatte eine Vision. Für seine Notiz will er 20 weiße Diamanten (Wiki: 2000)." };
    }),
    priester_diamant: QA("20 weiße Diamanten geben", (s) => qf(s).priester1 && !qf(s).notiz, (s) => {
      if (!takeInv(s, "Diamant (weiß)", 20)) return { ok: false, msg: "20 weiße Diamanten nötig (Wiki 2000, DESIGN ÷100)." };
      qf(s).notiz = true; addInv(s, "Bauplannotiz für Teleporter", 1);
      return { ok: true, msg: "Du erhältst die Notiz seiner Vision: Bauplannotiz für Teleporter." };
    }),
    kranker_antibiotikum: QA("Dem kranken Mann Antibiotikum geben", (s) => !qf(s).nachricht, (s) => {
      if (!takeInv(s, "Antibiotikum", 1)) return { ok: false, msg: "Er braucht Antibiotikum (Wiki). Chemiker machen es in der Chemieküche." };
      qf(s).nachricht = true; addInv(s, "Nachricht für den Sohn", 1);
      return { ok: true, msg: "Er gibt dir eine Nachricht für seinen Sohn (195/18)." };
    }),
    sohn_macheten: QA("Dem Sohn Nachricht und 5 Macheten geben", (s) => !qf(s).pw188, (s) => {
      if (!has(s, "Nachricht für den Sohn")) return { ok: false, msg: "Erst die Nachricht vom kranken Mann (2/183)." };
      if (!has(s, "Machete", 5)) return { ok: false, msg: "5 Macheten nötig (Wiki 75, DESIGN)." };
      takeInv(s, "Nachricht für den Sohn", 1); takeInv(s, "Machete", 5); qf(s).pw188 = true;
      return { ok: true, msg: "Passwort für die Seelenhöhle (188/196) erhalten." };
    }),
    seelen_pw: QA("Passwort nennen", (s) => !qf(s).seelenIn, (s) => {
      if (!qf(s).pw188) return { ok: false, msg: "Du kennst das Passwort nicht. Der Sohn des Kranken (195/18) weiß es." };
      qf(s).seelenIn = true; return { ok: true, msg: "Zwei Wachen bewachen den Stein der Seelen." };
    }),
    seelen_kampf: QA("Gegen eine Wache kämpfen", (s) => qf(s).seelenIn && !qf(s).seelenDone, () => { questFight("seelenwache", "seele"); return { ok: true, msg: "Eine Wache greift an." }; }),
    tele_notiz: QA("Dem Forscher die letzte Seite geben", (s) => !qf(s).forscherNotiz, (s) => {
      if (s.job !== "Forscher") return { ok: false, msg: "Wiki: Umschulung zum Forscher notwendig." };
      if (!takeInv(s, "Bauplannotiz für Teleporter", 1)) return { ok: false, msg: "Er braucht die letzte Seite der Anleitung (die Notiz vom Psionikerpriester, 30/195)." };
      qf(s).forscherNotiz = true; return { ok: true, msg: "Jetzt fehlt ihm der Stein der Seelen." };
    }),
    tele_stein: QA("Dem Forscher den Stein der Seelen geben", (s) => qf(s).forscherNotiz && !qf(s).teleporter, (s) => {
      if (s.job !== "Forscher") return { ok: false, msg: "Wiki: Umschulung zum Forscher notwendig." };
      if (!takeInv(s, "Stein der Seelen", 1)) return { ok: false, msg: "Er braucht den Stein der Seelen (188/196)." };
      qf(s).teleporter = true; addInv(s, "Teleporter", 1); gain(s, 10, 3);
      return { ok: true, msg: "Du erhältst den Teleporter. In der rechten Hand bringt er dich zu jeder Koordinate (Landkarte)." };
    }),
    // --- Doppelläufiger Seelenbrenner ---
    seelenbrenner_kauf: QA("Seelenbrenner beschaffen", (s) => !has(s, "Seelenbrenner") && !qf(s).doppel, (s) => {
      const cost = div10({ "Öl": 2000, Gas: 300, Stein: 2000, Metall: 2500 }); // WIKI-Beschaffung ÷10; Ort DESIGN
      if (!payCost(s, cost)) return { ok: false, msg: "Wiki-Beschaffung (÷10): " + costBits(cost) + ". Es fehlt: " + missingText(s, cost) + "." };
      addInv(s, "Seelenbrenner", 1); return { ok: true, msg: "Du erhältst einen Seelenbrenner." };
    }),
    medaillon_ritual: QA("Totenkopf, Lorbeerblatt und Zimtstange geben", (s) => !has(s, "Medaillon des Verderbens") && !qf(s).doppel, (s) => {
      if (!(has(s, "Totenkopf") && has(s, "Lorbeerblatt") && has(s, "Zimtstange"))) return { ok: false, msg: "Der Psioniker braucht Totenkopf, Lorbeerblatt und Zimtstange (Wiki)." };
      ["Totenkopf", "Lorbeerblatt", "Zimtstange"].forEach((k) => takeInv(s, k, 1));
      if (Math.random() < 0.25) return { ok: true, msg: "Das Ritual misslingt. Die Zutaten sind verloren (Wiki: kann fehlschlagen; Chance DESIGN)." };
      addInv(s, "Medaillon des Verderbens", 1); return { ok: true, msg: "Du erhältst das Medaillon des Verderbens." };
    }),
    seil_tausch: QA("Pilze und Bananenschale gegen ein Seil", (s) => !has(s, "Seil") && !qf(s).saeureIn, (s) => {
      const need = ["Verschimmelte Pilze", "Blaue Pilze", "Verfaulte Bananenschale"];
      if (!need.every((k) => has(s, k))) return { ok: false, msg: "Der Chemiker will: " + need.join(", ") + " (Wiki)." };
      need.forEach((k) => takeInv(s, k, 1)); addInv(s, "Seil", 1);
      return { ok: true, msg: "Der Chemiker gibt dir ein Seil." };
    }),
    saeure_betreten: QA("Mit dem Seil in die Säurehöhle", (s) => !qf(s).saeureIn, (s) => {
      if (!bootsOn(s, GOOD_BOOTS)) return { ok: false, msg: "Wiki: gute Stiefel nötig (hier: Gummi-, Stahl-, Kampf- oder Titanstiefel an den Füßen)." };
      if (!takeInv(s, "Seil", 1)) return { ok: false, msg: "Wiki: Ohne Seil kommst du nicht hinunter." };
      qf(s).saeureIn = true; return { ok: true, msg: "Du seilst dich ab. Das Seil bleibt hängen. Unten wartet ein Psioniker." };
    }),
    seelenbrenner_tausch: QA("Seelenbrenner umbauen lassen", (s) => qf(s).saeureIn && !qf(s).doppel, (s) => {
      if (!(has(s, "Kronkorken", 5) && has(s, "Seelenbrenner") && has(s, "Medaillon des Verderbens"))) return { ok: false, msg: "Er will 5 Kronkorken, einen Seelenbrenner und das Medaillon des Verderbens (Wiki)." };
      takeInv(s, "Kronkorken", 5); takeInv(s, "Seelenbrenner", 1); takeInv(s, "Medaillon des Verderbens", 1);
      if (s.equip && s.equip.rechts === "Seelenbrenner") s.equip.rechts = null;
      qf(s).doppel = true; addInv(s, "Doppelläufiger Seelenbrenner", 1); gain(s, 8, 3);
      return { ok: true, msg: "Du erhältst den Doppelläufigen Seelenbrenner." };
    }),
    // --- Mechaniker Junge ---
    junge_auftrag: QA("Mit dem Mechaniker reden", (s) => !qf(s).mjAsk, (s) => { qf(s).mjAsk = true; return { ok: true, msg: "Sein Sohn ist in der Jungenhöhle (110/110) eingesperrt. Er bittet dich, ihn zu befreien." }; }),
    junge_befreien: QA("Den Jungen mit dem Dietrich befreien", (s) => qf(s).mjAsk && !qf(s).mjBoy && !qf(s).mjDone, (s) => {
      if (!has(s, "Dietrich")) return { ok: false, msg: "Das Schloss ist zu. Wiki: Dietrich nötig." };
      qf(s).mjBoy = true; return { ok: true, msg: "Der Junge ist frei und bleibt an deiner Seite." };
    }),
    junge_abgeben: QA("Den Jungen zum Vater bringen", (s) => qf(s).mjBoy && !qf(s).mjDone, (s) => {
      qf(s).mjBoy = false; qf(s).mjDone = true; addInv(s, "Draht", 1); gain(s, 5, 2);
      return { ok: true, msg: "Der Mechaniker dankt dir und gibt dir Draht." };
    }),
    // --- Ringhöhle (WIKI: 10.000 Kupfer + Blumen → Eheringe, Karma neutral) ---
    eheringe: QA("Eheringe kaufen (100 Gold und Blumen)", (s) => !has(s, "Eheringe"), (s) => {
      if (s.gold < 100 || !has(s, "Blumen")) return { ok: false, msg: "Wiki: 10.000 Kupfer (= 100 Gold) und Blumen." };
      s.gold -= 100; takeInv(s, "Blumen", 1); addInv(s, "Eheringe", 1);
      const k = ensureKarma(s); k.light = 0; k.dark = 0;
      return { ok: true, msg: "Du erhältst Eheringe. Dein Karma ist neutral (Wiki)." };
    }),
    vergessen: QA("Vergessene Passwörter abfragen", null, (s) => {
      const q = qf(s); const pw = [];
      if (q.pw193) pw.push("Bewachte Höhle (193/10)");
      if (q.pw188) pw.push("Seelenhöhle (188/196)");
      return { ok: true, msg: pw.length ? "Du kennst Passwörter für: " + pw.join(", ") + "." : "Du kennst noch kein Passwort aus der Teleporter-Kette." };
    }),
    guertel_ablegen: QA("Gürtel ablegen", null, (s) => {
      const b = beltPortalAt(s);
      if (!b) return { ok: false, msg: "Hier ist kein Gürtelportal." };
      if (wornBelt(s) !== b) return { ok: false, msg: "Hier legt man nur den " + b + " ab (Wiki)." };
      const it = BELTS[b].portalItem;
      if (!takeInv(s, it, 1)) return { ok: false, msg: "Wiki: Zum Ablegen brauchst du " + it + "." };
      s.equip.guertel = null; addInv(s, b, 1);
      return { ok: true, msg: b + " abgelegt (−1 " + it + ")." };
    }),
    // --- Casino (Wiki nennt Roulette- und Würfelhöhlen; Regeln und Quoten DESIGN) ---
    roulette: QA("Roulette: 10 Gold auf Rot", null, (s) => {
      if (s.gold < 10) return { ok: false, msg: "Einsatz 10 Gold." };
      s.gold -= 10; s.casino = (s.casino || 0) + 1;
      if (Math.random() < 18 / 37) { s.gold += 20; return { ok: true, msg: "Rot! +20 Gold." }; }
      return { ok: true, msg: "Schwarz oder Null. Der Einsatz ist weg." };
    }),
    wuerfel: QA("Würfeln: 10 Gold auf die Sechs", null, (s) => {
      if (s.gold < 10) return { ok: false, msg: "Einsatz 10 Gold." };
      s.gold -= 10; s.casino = (s.casino || 0) + 1;
      const w = rand(1, 6);
      if (w === 6) { s.gold += 50; return { ok: true, msg: "Eine Sechs! +50 Gold." }; }
      return { ok: true, msg: "Eine " + w + ". Der Einsatz ist weg." };
    }),
  });
  const QUEST_NO_NEEDS = ["roulette", "wuerfel", "vergessen", "guertel_ablegen", "junge_auftrag", "seelen_pw", "bew_pw", "tele_notiz", "tele_stein"];
  QUEST_NO_NEEDS.forEach((a) => NO_EXHAUST_CHECK.push(a));
  ACTIONS.graben.run = function (s) { return digRun(s); };

  // Quest-Hinweise auf der Höhlenseite (WIKI-Text verkürzt)
  const QUEST_INFO = {
    w2x10: "Teleporter 1: Mit einem Wallbrecher einbrechen, mit säurebeständigen Stiefeln durch die Säure, einen Mutanten besiegen → Ei der CP.",
    w70x200: "Teleporter 2: Nur für Spione. 50 Gold und das Ei der CP → Passwort für 193/10.",
    w100x91: "Teleporter 3: Das eitle Händlermädchen gibt ihren Spiegel für einen blauen Diamanten.",
    w193x10: "Teleporter 4: Wache, Passwort, zweite Wache. Mit dem Spiegel in der rechten Hand kommst du an den Lasern vorbei → Puppe des Schicksals.",
    w30x195: "Teleporter 5: Puppe geben, dann weiße Diamanten → Notiz seiner Vision.",
    w2x183: "Teleporter 6: Antibiotikum → Nachricht für seinen Sohn.",
    w195x18: "Teleporter 7: Nachricht und Macheten → Passwort für 188/196.",
    w188x196: "Teleporter 8: Passwort, zwei Wachen → Stein der Seelen.",
    forscher: "Teleporter 9: Umschulung zum Forscher nötig. Letzte Seite der Anleitung und Stein der Seelen → Teleporter.",
    w194x188: "Seelenbrenner 1: Totenkopf, Lorbeerblatt, Zimtstange → Medaillon des Verderbens (kann misslingen).",
    chemiker_cave: "Seelenbrenner 2: Verschimmelte Pilze, Blaue Pilze, Verfaulte Bananenschale → Seil.",
    w191x62: "Seelenbrenner 3: Gute Stiefel und Seil. Der Psioniker tauscht 5 Kronkorken, Seelenbrenner und Medaillon gegen den Doppelläufigen Seelenbrenner.",
    mechaniker: "Mechaniker Junge: Der Vater bittet dich, seinen Sohn aus der Jungenhöhle (110/110) zu befreien.",
    w110x110: "Mechaniker Junge: Mit einem Dietrich befreist du den Jungen. Er bleibt an deiner Seite.",
    ring: "Ringhöhle: 10.000 Kupfer und Blumen → Eheringe. Dein Karma wird neutral.",
    w108x108: "Höhle des Vergessens: Vergessene Passwörter wiedererlangen.",
  };
  function questInfoHtml(loc) {
    let h = "";
    if (QUEST_INFO[loc.id]) h += "<p class=\"muted\">" + origEsc(QUEST_INFO[loc.id]) + "</p>";
    const b = Object.keys(BELTS).find((k) => BELTS[k].portal[0] === loc.x && BELTS[k].portal[1] === loc.y);
    if (b) h += "<p class=\"muted\">Hier legt man den " + origEsc(b) + " ab. Wiki: Dazu brauchst du " + origEsc(BELTS[b].portalItem) + ".</p>";
    return h;
  }
  Object.defineProperty(ACTIONS.graben, "duration", { get() { return state ? digMs(state) : 8000; }, configurable: true });

  // ---------- Teleporter (WIKI: rechte Hand, zu jeder Koordinate) ----------
  function teleportTo(x, y) {
    const s = state;
    if (!(s.equip && s.equip.rechts === "Teleporter" && has(s, "Teleporter"))) return "Nimm den Teleporter in die rechte Hand.";
    if (busy) return "Erst die laufende Aktion beenden.";
    x = parseInt(x, 10); y = parseInt(y, 10);
    if (!(x >= 1 && x <= 200 && y >= 1 && y <= 200)) return "Koordinaten 1 bis 200.";
    const place = placeAt(x, y);
    if (place) { const g = placeGate(place); if (!g.open) return place.name + ": " + g.text + "."; }
    s.px = x; s.py = y; s.locId = place ? place.id : "field";
    exert("travel");
    return "Teleportiert nach (" + x + " / " + y + ")" + (place ? ": " + place.name : "") + ".";
  }

  // ---------- Mehrere Tiere (WIKI: Stall bis 25 Tiere) ----------
  const STALL_MAX = 25; // WIKI
  function allPets(s) { return (s.pet ? [s.pet] : []).concat(s.stallPets || []); }
  function canTakeAnimal(s) { return !s.pet || (!!s.stamm && allPets(s).length < STALL_MAX); }
  /** Stalltiere: WIKI "Im Stamm bedienen sich Tiere im Lager". Raten DESIGN (halb so viel wie unterwegs). */
  function tickStall(ticks) {
    const s = state;
    if (!s || !s.stallPets || !s.stallPets.length || ticks < 1) return null;
    const gone = [];
    s.stallPets.forEach((p) => {
      const k = p.groesse / 100;
      p.hunger = Math.min(100, p.hunger + Math.round(2 * k * ticks));
      p.durst = Math.min(100, p.durst + Math.round(3 * k * ticks));
      p.energie = Math.min(100, p.energie + 5 * ticks);
      const lg = s.stamm && s.stamm.lager;
      if (lg) {
        if (p.hunger >= 50 && (lg.Nahrung || 0) > 0) { lg.Nahrung -= 1; p.hunger = Math.max(0, p.hunger - 40); }
        if (p.durst >= 50 && (lg.Wasser || 0) > 0) { lg.Wasser -= 1; p.durst = Math.max(0, p.durst - 40); }
      }
      if (p.hunger >= 100 || p.durst >= 100) gone.push(p);
    });
    if (!gone.length) return null;
    s.stallPets = s.stallPets.filter((p) => !gone.includes(p));
    return gone.map((p) => p.name).join(", ") + " ist aus dem Stall weggelaufen (Hunger oder Durst).";
  }
  function petSwap(i) {
    const s = state; const list = s.stallPets || [];
    const p = list[i];
    if (!p) return "Kein Tier.";
    if ((s.ep || 0) < PET_STALL_EP) return "Aus dem Stall nehmen geht ab " + PET_STALL_EP + " EP (Wiki).";
    list.splice(i, 1);
    if (s.pet) { s.pet.inStall = true; list.push(s.pet); }
    p.inStall = false; s.pet = p;
    return p.name + " ist jetzt an deiner Seite.";
  }
  function petStallFeed(i) {
    const s = state; const p = (s.stallPets || [])[i];
    if (!p) return "Kein Tier.";
    const need = 5 * Math.max(1, Math.round(p.groesse / 100));
    if (!has(s, "Nahrung", need) || !has(s, "Wasser", need)) return "Du brauchst " + need + " Nahrung und " + need + " Wasser.";
    takeInv(s, "Nahrung", need); takeInv(s, "Wasser", need);
    p.hunger = Math.max(0, p.hunger - 40); p.durst = Math.max(0, p.durst - 40);
    return p.name + " ist versorgt.";
  }
  function petStallRelease(i) {
    const s = state; const p = (s.stallPets || [])[i];
    if (!p) return "Kein Tier.";
    s.stallPets.splice(i, 1);
    return p.name + " freigelassen.";
  }
  function stallListHtml() {
    const s = state; const list = s.stallPets || [];
    let h = "<h3>Im Stall (" + allPets(s).length + " von " + STALL_MAX + ")</h3>";
    if (!s.stamm) return h + "<p class=\"muted\">Mehrere Tiere gehen nur mit Stamm. Der Tierstall ist ein Stammgebäude (Wiki).</p>";
    if (!list.length) return h + "<p class=\"muted\">Kein weiteres Tier im Stall.</p>";
    list.forEach((p, i) => {
      h += '<p class="p8-stall">' + p8AniImg(p.type, "s") + origEsc(p.name) + " (" + p.type + (p.psi ? ", PSI" : "") + ") · Hunger " + p.hunger + "% · Durst " + p.durst + "% · " +
        xLink("versorgen", "stallfeed|" + i) + " · " + xLink("an deine Seite holen", "petswap|" + i) + " · " + xLink("freilassen", "stallfree|" + i) + "</p>";
    });
    return h;
  }

  // ---------- Strahlung in Ruhe ----------
  const REST_RAD_PER_MIN = 1; // DESIGN: langsam, +1 je Minute ohne Aktion
  const REST_RAD_CAP = 50;    // DESIGN: in Ruhe nicht über 50
  function restRadiation(ticks) {
    const s = state;
    if (!s || sleepUi || (s.radiation || 0) >= REST_RAD_CAP) return 0;
    const add = Math.min(REST_RAD_CAP - (s.radiation || 0), ticks * REST_RAD_PER_MIN);
    s.radiation = (s.radiation || 0) + add;
    return add;
  }

  // ---------- Seiten ----------
  function costLine(cost) { return origEsc(costBits(cost)); }
  function hausPageHtml() {
    const s = state; const h = houseDef(s);
    const atCamp = s.locId === "camp";
    let out = "<h2>Haus</h2>";
    if (!atCamp) out += "<p class=\"muted\">Bauen, Lager und Bunker gehen nur im Ruinencamp. " + origLink("zum Ruinencamp", 'data-loc="camp"') + "</p>";
    if (h) {
      out += "<p>Dein Haus: <b>" + origEsc(h.name) + "</b>. Lager: " + (s.house.lagerBuilt ? h.lager.toLocaleString("de-AT") + " je Rohstoff" : "noch nicht gebaut") +
        (s.house.chemie ? " · Chemieküche" : "") + "</p>";
      out += "<p>Im eigenen Haus schläfst du besser als draußen. " + xLink("Haus einreißen", "teardown") + " <span class=\"muted\">(Wiki: kein Upgrade; einreißen und neu bauen)</span></p>";
      if (!s.house.lagerBuilt) out += "<p>Privatlager bauen — " + costLine(LAGER_COST) + " " + xLink("bauen", "lager") + "</p>";
      if (s.house.lagerBuilt && !s.house.chemie) out += "<p>Chemieküche (nur Chemiker) — " + costLine(CHEMIE_COST) + " " + xLink("bauen", "chemie") + "</p>";
    } else {
      out += "<p>Du hast kein Haus. Wiki: Ein Haus ist für die Stammesgründung nötig.</p>";
      HOUSES.forEach((x) => {
        houseBuildPay = true; const ok = (s.techlevel || 0) >= x.tl && canPay(s, x.cost); const miss = missingText(s, x.cost); houseBuildPay = false;
        out += "<p><b>" + origEsc(x.name) + "</b> (TL " + x.tl + ", Lager " + x.lager.toLocaleString("de-AT") + " je Rohstoff) — " + costLine(x.cost) + " " +
          (ok ? xLink("bauen", "house|" + x.id) : '<span class="cant">bauen</span>' + ((s.techlevel || 0) >= x.tl && miss ? ' <span class="muted">(es fehlt: ' + origEsc(miss) + ")</span>" : "")) + "</p>";
      });
      const left = s.house && s.house.lager ? Object.keys(s.house.lager).filter((k) => s.house.lager[k] > 0) : [];
      if (left.length) out += "<p class=\"muted\">Dein altes Lager liegt noch am Bauplatz (" + origEsc(left.map((k) => s.house.lager[k] + " " + k).join(", ")) + "). Beim Bau des neuen Hauses zählt es mit (DESIGN).</p>";
    }
    if (lagerOn(s)) {
      out += "<h3>Privatlager</h3><table>";
      LAGER_ITEMS.forEach((k) => {
        const a = s.inv[k] || 0, b = lagerN(s, k);
        if (!a && !b) return;
        out += "<tr><td>" + origEsc(k) + "</td><td>Rucksack " + a + "</td><td>Lager " + b + "</td><td>" +
          (a ? xLink("10 rein", "lin|" + k + "|10") + " " + xLink("alles rein", "lin|" + k + "|all") : "") + " " +
          (b ? xLink("10 raus", "lout|" + k + "|10") + " " + xLink("alles raus", "lout|" + k + "|all") : "") + "</td></tr>";
      });
      out += "</table><p class=\"muted\">Beim Bauen und Herstellen im Ruinencamp zählt das Privatlager mit (DESIGN).</p>";
    }
    out += "<h3>Goldbunker</h3>";
    out += s.goldbunker
      ? "<p>Im Bunker: " + s.goldbunker.gold + " Gold (max. " + GOLDBUNKER_MAX.toLocaleString("de-AT") + "). " + xLink("100 rein", "bin|100") + " · " + xLink("alles rein", "bin|all") + " · " + xLink("100 raus", "bout|100") + " · " + xLink("alles raus", "bout|all") + "</p>"
      : "<p>Goldbunker — " + costLine(GOLDBUNKER_COST) + " " + xLink("bauen", "goldbunker") + " <span class=\"muted\">Wiki: bis 12,8 Mio. Kupfer.</span></p>";
    out += "<h3>Erweiterungen</h3><p class=\"muted\">Wiki: 4 Ausbaustufen, Kosten Stufe 1. Bonus +25% je Stufe und Kosten ×Stufe sind DESIGN.</p>";
    Object.keys(EXTENSIONS).forEach((res) => {
      const t = extTier(s, res);
      out += "<p>" + EXTENSIONS[res].name + ": Stufe " + t + "/4" + (t < 4 ? " — " + costLine(extCost(res, t + 1)) + " " + xLink("ausbauen", "ext|" + res) : "") + "</p>";
    });
    out += "<p>" + origLink("weitere Gebäude", 'data-page="gebaeude"') + " · " + origLink("Chemieküche", 'data-page="chemie"') + " · " + origLink("Ideenschmiede", 'data-page="ideenschmiede"') + " · " + origLink("Kräuter & Pilze", 'data-page="kraeuterpilze"') + " · " + origLink("Artefaktschmiede", 'data-page="artefakte"') + " · " + origLink("Garage", 'data-page="garage"') + "</p>";
    return out;
  }
  function artefaktPageHtml() {
    const s = state;
    let h = "<h2>Artefaktschmiede</h2><p class=\"muted\">Wiki: Erforschen mit einer Schriftrolle in der rechten Hand. 5 Artefakte erforschbar. Tragen braucht Artefaktkunde. Gürtel legt man nur am Gürtelportal ab. Mengen hier ÷10 (DESIGN).</p>";
    h += "<p>Schriftrolle: " + (s.inv.Schriftrolle || 0) + (has(s, "Schriftrolle") && !(s.equip && s.equip.rechts === "Schriftrolle") ? " " + xLink("in die rechte Hand", "hold|Schriftrolle") : "") + " · " + xLink("Artefakt erforschen", "research") + "</p>";
    h += "<p>Getragen: " + origEsc(wornBelt(s) || "kein Gürtel") + " · Amulette: " + origEsc(((s.equip && s.equip.amulette) || []).join(", ") || "keine") + "</p>";
    Object.keys(BELTS).forEach((b) => {
      const known = s.research && s.research[b];
      h += "<p><b>" + origEsc(b) + "</b> — " + (known ? costLine(div10(BELTS[b].wiki)) + " " + xLink("schmieden", "forge|" + b) : "noch nicht erforscht") +
        (has(s, b) ? " · " + xLink("anlegen", "belt|" + b) : "") + "<br><span class=\"muted\">" + origEsc(BELTS[b].eff) + " Portal " + BELTS[b].portal.join("/") + ", zum Ablegen: " + origEsc(BELTS[b].portalItem) + ".</span></p>";
    });
    Object.keys(AMULETS).forEach((a) => {
      const worn = ((s.equip && s.equip.amulette) || []).includes(a);
      h += "<p><b>" + origEsc(a) + "</b> — " + costLine(div10(AMULETS[a].wiki)) + " " + xLink("schmieden", "forge|" + a) +
        (has(s, a) || worn ? " · " + xLink(worn ? "ablegen" : "anlegen", "amu|" + a) : "") + "<br><span class=\"muted\">" + origEsc(AMULETS[a].eff) + "</span></p>";
    });
    return h;
  }
  function garagePageHtml() {
    const s = state;
    let h = "<h2>Garage</h2>";
    const owned = Object.keys(VEHICLES).filter((id) => has(s, id));
    h += owned.length ? owned.map((id) => {
      const v = Object.assign({ id }, VEHICLES[id]); const p = (s.pimp && s.pimp[id]) || {};
      return "<p>" + (v.img ? '<img class="slot-img" src="' + v.img + '" alt=""> ' : "") + origEsc(v.name) + (p.plate ? " [" + origEsc(p.plate) + "]" : "") + " · KP +" + vehKpBonus(s, v) + " · ab " + v.minEP + " EP · " + v.fuelPerTrip + " " + vehFuelItem(v) + " je Fahrt " +
        (s.activeVehicle === id ? "— aktiv" : origLink("nehmen", 'data-veh="' + id + '"')) + "</p>";
    }).join("") : "<p>Kein Fahrzeug im Rucksack.</p>";
    h += "<h3>Bauen (Mechaniker, Werkstatt)</h3><p class=\"muted\">Wiki-Kosten ÷10, KP ÷100, EP ÷5 (DESIGN). Fähigkeit Fahrzeuge oder Fluggeräte (Wiki).</p>";
    Object.keys(NEW_VEHICLES).forEach((id) => {
      const v = NEW_VEHICLES[id];
      h += "<p><b>" + origEsc(v.name) + "</b> — " + costLine(vehCost(id)) + (v.parts ? " + " + origEsc(v.parts.join(", ")) : "") + " · " + v.sk + " " + xLink("bauen", "veh|" + id) + "</p>";
    });
    h += "<p>Bauteile (DESIGN-Kosten): " + Object.keys(VEH_PARTS).map((p) => origEsc(p) + " " + xLink("bauen", "part|" + p)).join(" · ") + "</p>";
    h += "<h3>Fahrzeug pimpen</h3>";
    const err = pimpCheck(s);
    if (err) h += "<p class=\"muted\">" + origEsc(err) + "</p>";
    else {
      const p = pimpOf(s, s.activeVehicle);
      h += '<p>Kennzeichen (25 Edelmetall, max. 6 Zeichen): <input id="orig-plate" maxlength="6" value="' + origEsc(p.plate) + '" style="background:#111;color:#eee;border:1px solid #666"> ' + xLink("setzen", "plate") + "</p>";
      Object.keys(PIMP).forEach((k) => {
        const d = PIMP[k];
        h += "<p>" + d.name + ": Stufe " + p[k] + "/" + d.max + (p[k] < d.max ? " — " + costLine(d.cost(p[k] + 1)) + " " + xLink("ausbauen", "pimp|" + k) : "") + " <span class=\"muted\">" + origEsc(d.eff) + "</span></p>";
      });
    }
    return h;
  }
  function teleportHtml() {
    const s = state;
    if (!has(s, "Teleporter")) return "";
    if (!(s.equip && s.equip.rechts === "Teleporter")) return "<p>" + xLink("Teleporter in die rechte Hand", "hold|Teleporter") + "</p>";
    return '<p>Teleporter: x <input id="orig-tx" size="3" style="background:#111;color:#eee;border:1px solid #666"> y <input id="orig-ty" size="3" style="background:#111;color:#eee;border:1px solid #666"> ' + xLink("teleportieren", "teleport") + "</p>";
  }
  function grabenPageHtml() {
    const s = state;
    const g = typeof s.px === "number" ? groundAt(s.px, s.py) : "normal";
    const active = workUi && workUi.aid === "graben";
    const sec = Math.round(digMs(s) / 1000);
    let h = "<h2>Graben</h2>" + origLive();
    h += "<p>Fundchance: " + Math.round(digChance(s) * 100) + "% · Dauer: " + sec + " Sekunden · Werkzeug: " + origEsc(digTool(s) || "keins") +
      " · Boden hier: " + (g === "glas" ? "Glas (Dynamit nötig)" : g === "hart" ? "hart (Spitzhacke nötig)" : "normal") + "</p>";
    h += "<p class=\"muted\">Wiki: Fundchance aus Wahrnehmung und Flexibilität, 100% bei 3000 Wahrnehmung und Perfektion. 90 Minuten bei 0 Geschwindigkeit, nie unter 30 (mit Schaufel). Schaufel oder Greifer kann man in die linke Hand nehmen. Prototyp: Eigenschaft ×100 = Wiki-Punkte, 30 Minuten = 4 Sekunden (DESIGN).</p>";
    if (active) h += '<div class="work-row"><p>Graben ' + ((workUi.i || 0) + 1) + "/" + workUi.n + " " + xLink("abbrechen", "abort") + '</p><div class="work-bar"><i style="width:' + Math.round(workUi.pct || 0) + '%"></i></div></div>';
    else h += origAct("Graben", "graben") + origRep("5× Graben", "graben", 5) + origRep("10× Graben", "graben", 10);
    ["Schaufel", "Greifer"].forEach((t) => { if (has(s, t) && !(s.equip && s.equip.links === t)) h += "<p>" + xLink(t + " in die linke Hand", "left|" + t) + "</p>"; });
    if (has(s, "U-P-S Päckchen")) h += "<p>" + xLink("U-P-S Päckchen öffnen", "ups") + "</p>";
    return h;
  }
  function extPage(page) {
    if (page === "haus") return hausPageHtml();
    if (page === "artefakte") return artefaktPageHtml();
    if (page === "garage") return garagePageHtml();
    if (page === "graben") return grabenPageHtml();
    const p4 = p4Page(page);
    if (p4 != null) return p4;
    return null;
  }
  /** Zusätzliche Links in der Rucksack-Liste. */
  function extInvLinks(k) {
    const s = state; let h = "";
    if (SHIELDS[k]) h += " " + xLink(s.equip && s.equip.links === k ? "abnehmen" : "in die linke Hand", "shield|" + k);
    if (BELTS[k]) h += " " + xLink("anlegen", "belt|" + k);
    if (AMULETS[k]) h += " " + xLink("anlegen", "amu|" + k);
    if (k === "U-P-S Päckchen") h += " " + xLink("öffnen", "ups");
    if (["Spiegel", "Teleporter", "Schriftrolle"].includes(k)) h += " " + xLink("in die rechte Hand", "hold|" + k);
    if (k === "Schaufel" || k === "Greifer") h += " " + xLink("in die linke Hand", "left|" + k);
    if (AMMO_FOR[k]) h += " <span class=\"muted\">braucht " + origEsc(AMMO_FOR[k]) + "</span>";
    return h;
  }
  const BAD_MSG = /^(Es fehlt|Nicht|Erst|Kein|Du hast|Du trägst|Dazu|Wiki|Nur|Unbekannt|Bauen geht|Einreißen geht|Ans|Zum|Die Schriftrolle ist|Hier|Koordinaten|Nimm|Die letzte|Der Goldbunker steht schon|Das Privatlager steht|Die Chemieküche (ist|steht)|Lager für|Fahrzeuge baut|Bauteile|Pimpen|Erforschen|Alle 5)/;
  function extCmd(cmd) {
    const parts = cmd.split("|");
    const c = parts[0], a = parts[1], b = parts[2];
    const s = state;
    if (c === "reset") { resetCharacter(); return; }
    if (!s || s.dead) return;
    if (sleepUi) { showResult(SLEEP_MSG, true); renderAll(); return; }
    if (busy && c !== "abort") { showResult("Erst die laufende Aktion beenden.", true); renderAll(); return; }
    let msg = null;
    const num = (v) => (v === "all" ? "all" : parseInt(v, 10) || 1);
    if (c === "house") msg = buildHouse(a);
    else if (c === "teardown") msg = tearDownHouse();
    else if (c === "lager") msg = buildLager();
    else if (c === "chemie") msg = buildChemie();
    else if (c === "goldbunker") msg = buildGoldbunker();
    else if (c === "lin") msg = lagerMove(a, num(b), "in");
    else if (c === "lout") msg = lagerMove(a, num(b), "out");
    else if (c === "bin") msg = bunkerMove(num(a), "in");
    else if (c === "bout") msg = bunkerMove(num(a), "out");
    else if (c === "ext") msg = buildExtension(a);
    else if (c === "abort") msg = workUi && workUi.long ? abortLongWork() : abortWork();
    else if (c === "ups") msg = openUps();
    else if (c === "shield") {
      if (!SHIELDS[a] || !has(s, a)) msg = "Nicht im Rucksack.";
      else { s.equip = s.equip || {}; if (s.equip.links === a) { s.equip.links = null; msg = a + " abgenommen."; } else { s.equip.links = a; msg = a + " in der linken Hand."; } }
    } else if (c === "left") { msg = has(s, a) ? ((s.equip = s.equip || {}), (s.equip.links = a), a + " in der linken Hand.") : "Nicht im Rucksack."; }
    else if (c === "hold") { msg = has(s, a) ? ((s.equip = s.equip || {}), (s.equip.rechts = a), a + " in der rechten Hand.") : "Nicht im Rucksack."; }
    else if (c === "research") msg = researchArtifact();
    else if (c === "forge") msg = forgeArtifact(a);
    else if (c === "belt") msg = wearBelt(a);
    else if (c === "amu") msg = wearAmulet(a);
    else if (c === "veh") msg = buildVehicle(a);
    else if (c === "part") msg = buildPart(a);
    else if (c === "pimp") msg = pimpUp(a);
    else if (c === "plate") { const el = document.getElementById("orig-plate"); msg = setPlate(el ? el.value : ""); }
    else if (c === "teleport") {
      const ex = document.getElementById("orig-tx"), ey = document.getElementById("orig-ty");
      msg = teleportTo(ex ? ex.value : "", ey ? ey.value : "");
      if (/^Teleportiert/.test(msg)) origPage = "landkarte";
    } else if (c === "petswap") msg = petSwap(parseInt(a, 10));
    else if (c === "stallfeed") msg = petStallFeed(parseInt(a, 10));
    else if (c === "stallfree") msg = petStallRelease(parseInt(a, 10));
    else msg = p4Cmd(c, a, b);
    if (msg == null) return;
    const bad = BAD_MSG.test(msg) || /nötig\.|braucht |brauchst /.test(msg);
    log(msg, bad ? "bad" : "good");
    showResult(msg, bad);
    save({ quiet: true }); renderAll();
  }

  // =====================================================================
  // ---------- Durchgang 4 (Okt 2026) ----------
  // Quellen: Wiki-Spiegel 2015 (Rohstoffnamen aus den Icon-Titeln im HTML), Handbuch 2006 S.12 (lange Arbeit).
  // Skala (DESIGN, siehe STATUS.md):
  //  - Stammgebäude-Kosten und Erztrank ÷100 (wie Teleporter: 2000 Diamanten → 20)
  //  - Waffenfabrik-Waffen ÷10 (wie Fahrzeuge und Gürtel in Durchgang 3)
  //  - Eigenschafts-Anforderungen ÷100 (ATTR_SCALE: Prototyp-Eigenschaft ×100 = Wiki-Punkte)
  //  - EP-Anforderungen ÷5 (wie Fahrzeuge)
  //  - Erdöl/Erdgas = Öl/Gas, Kaliumnitrat = Kalisalpeter, Yellocake = YellowCake (wie Durchgang 3)
  //  - 30 Wiki-Minuten = 4 Sekunden
  // =====================================================================
  var longSafe = false; // während langer Arbeit (Mensch oder Pilzmix): keine Verletzung (WIKI)
  function div100(cost) { const o = {}; Object.keys(cost).forEach((k) => { o[k] = Math.max(1, Math.ceil(cost[k] / 100)); }); return o; }
  function attrReq(wiki) { return Math.ceil(wiki / ATTR_SCALE); }
  function epReq(wiki) { return Math.ceil(wiki / 5); }
  function slug(t) { return t.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "_"); }
  function p4Bar(id) { return workUi && workUi.aid === id ? '<div class="work-row"><p>' + origEsc(workUi.label || "läuft") + " " + xLink("abbrechen", "abort") + '</p><div class="work-bar"><i style="width:' + Math.round(workUi.pct || 0) + '%"></i></div></div>' : ""; }
  /** Zeitbalken für eine Aktion ohne eigenen Arbeitsgang (Bad, Kaserne). Abbrechen über abortWork(). */
  function timedJob(id, label, ms, page, done) {
    workUi = { aid: id, n: 1, i: 0, pct: 0, label };
    busy = true; clearResults(); origPage = page; setStatus(label + "…"); renderAll();
    runProgress(ms, () => {
      workUi = null; busy = false; setProgress(0); setStatus("Bereit.");
      const m = done();
      const bad = BAD_MSG.test(m);
      log(m, bad ? "bad" : "good"); showResult(m, bad); save({ quiet: true }); renderAll();
    });
    return null;
  }

  // ---------- Wiki-Gegenstände, die im Katalog fehlen (Stärke/Slot WIKI aus wiki-items-full.js) ----------
  const P4_WIKI_ITEMS = [
    { name: "Wurfsterne", kind: "fortschrittliche Waffen", staerke: 700, slot: "rechts" },
    { name: "Gasgranate", kind: "fortschrittliche Waffen", staerke: 800, slot: "rechts" },
    { name: "Taser", kind: "fortschrittliche Waffen", staerke: 177, slot: "rechts" },
    { name: "Granatwerfer", kind: "fortschrittliche Waffen", staerke: 245, slot: "rechts" },
    { name: "Fangnetz", kind: "Erfindung", staerke: 0, slot: "rechts" },
    { name: "Insektengiftspritze", kind: "Bio", staerke: 0, slot: "links" },
    { name: "Amphibiengiftspritze", kind: "Bio", staerke: 0, slot: "links" },
  ];
  if (window.EZS_WIKI && EZS_WIKI.items) P4_WIKI_ITEMS.forEach((i) => { if (!EZS_WIKI.items.some((x) => x.name === i.name)) EZS_WIKI.items.push(Object.assign({ find: false, src: "pass4" }, i)); });
  const EINWEG = ["Molotow Cocktail", "Wurfsterne", "Gasgranate", "Kristallsplitterbombe"]; // WIKI: "Einweg"
  function einwegInHand(s) { const w = s.equip && s.equip.rechts; return w && EINWEG.includes(w) && has(s, w) ? w : null; }

  // =====================================================================
  // A1  Lange Arbeit (Menschen bis 480 Minuten)
  // WIKI Handbuch S.12: Menschen können längere Arbeiten (480 min) ohne Pilzmix verrichten.
  // WIKI Pilzmix-S/-M: "Mit diesem Mix kann man auch längere Arbeiten verrichten ohne dabei verletzt zu werden".
  // DESIGN: Mutanten nur mit wirkendem Pilzmix über 30 Minuten; Stufen 30/60/120/240/480; Ertrag = Anzahl 30-min-Gänge.
  // =====================================================================
  const LONG_MIN = [30, 60, 120, 240, 480];
  const LONG_BLOCK_MS = 4000; // DESIGN: 30 Wiki-Minuten = 4 Sekunden (wie ein Arbeitsgang)
  const MIX_LONG_MS = 15 * 60000; // DESIGN: Pilzmix erlaubt 15 Minuten lang lange Arbeit
  const LONG_AIDS = ["holz", "stein", "metall", "kunststoff", "sand", "oel", "gas", "erz", "uran", "edelmetall", "diamanten", "wasser", "pilze", "kraeuter", "forschung_stamm"];
  function mixActive(s) { return !!(s.mixLongUntil && s.mixLongUntil > Date.now()); }
  function longWorkMax(s) { return s.race !== "Mutant" || mixActive(s) ? 480 : 30; }
  function hereAids(s) {
    const loc = locById(s.locId);
    if (!loc) return [];
    const list = (loc.actions || []).filter((a) => LONG_AIDS.includes(a));
    if (s.locId === "camp") {
      if (s.buildings && s.buildings.pilzhaus && !list.includes("pilze")) list.push("pilze");
      if (s.buildings && s.buildings.kraeutergarten && !list.includes("kraeuter")) list.push("kraeuter");
      if (stammHas(s, "forschungsgeb")) list.push("forschung_stamm");
    }
    return list.filter((a) => {
      const d = ACTIONS[a];
      if (!d) return false;
      if (d.needJob && !d.softJob && s.job !== d.needJob) return false;
      if (d.needTL && (s.techlevel || 0) < d.needTL) return false;
      return !d.show || d.show(s);
    });
  }
  function startLongWork(aid, minRaw) {
    const s = state; const def = ACTIONS[aid]; const min = parseInt(minRaw, 10);
    if (!def || !LONG_AIDS.includes(aid)) return "Unbekannte Arbeit.";
    if (!hereAids(s).includes(aid)) return "Hier geht diese Arbeit nicht (Ort, Beruf oder Techlevel).";
    if (!LONG_MIN.includes(min)) return "Unbekannte Dauer.";
    if (min > longWorkMax(s)) return "Nur Menschen arbeiten länger als 30 Minuten (Wiki). Mutanten brauchen einen Pilzmix-S oder -M.";
    if (isExhausted(s)) return EXHAUST_MSG;
    const blocks = min / 30;
    if (s.food - blocks < -8 || s.water - blocks < -8) return "Nicht genug Nahrung und Wasser für " + min + " Minuten (1 je 30 Minuten).";
    workUi = { aid, n: blocks, i: 0, pct: 0, long: true, min, t0: Date.now(), ms: blocks * LONG_BLOCK_MS, label: def.label + " " + min + " Minuten" };
    busy = true; clearResults(); origPage = "arbeiten"; setStatus(workUi.label + "…"); renderAll();
    runProgress(workUi.ms, () => finishLongWork(aid, blocks, min, false));
    return null;
  }
  function finishLongWork(aid, blocks, min, aborted) {
    const def = ACTIONS[aid]; const loc = locById(state.locId);
    const start = invSnapshot(state);
    let done = 0, stop = null;
    longSafe = state.race !== "Mutant" || mixActive(state);
    const notes = [];
    for (let i = 0; i < blocks; i++) {
      if (!state || state.dead) break;
      if (state.food <= -9 || state.water <= -9) { stop = "Nahrung oder Wasser zu niedrig."; break; }
      if (isExhausted(state)) { stop = EXHAUST_MSG; break; }
      state.food -= 1; state.water -= 1;
      const before = invSnapshot(state);
      const res = def.run(state, loc);
      if (!res.ok) { stop = res.msg; break; }
      const extra = afterWork(before);
      if (extra && i === blocks - 1) notes.push(extra.trim());
      exert(aid === "forschung_stamm" ? "craft" : "work");
      gainKarma(state, "light", 1);
      done += 1;
      maybeUnlockTL(); checkDeath();
    }
    longSafe = false;
    workUi = null; busy = false; setProgress(0); setStatus("Bereit.");
    const got = gainedSince(state, start);
    const gotTxt = Object.keys(got).map((k) => got[k] + " " + k).join(", ") || "nichts";
    const mins = done * 30;
    let msg = (aborted ? "Abgebrochen nach " + mins + " von " + min + " Minuten. " : def.label + ": " + mins + " Minuten gearbeitet. ") + "Ertrag: " + gotTxt + ".";
    if (stop && done < blocks && !aborted) msg += " Abbruch: " + stop;
    if (notes.length) msg += " " + notes.join(" ");
    const bad = done === 0;
    log(msg, bad ? "bad" : "good");
    resultLines = [{ text: msg, bad }]; resultPage = origPage; renderResultBanner();
    save({ quiet: true }); renderAll();
    return msg;
  }
  function abortLongWork() {
    if (!workUi || !workUi.long) return abortWork();
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
    const w = workUi;
    const blocksDone = Math.min(w.n, Math.floor((Date.now() - w.t0) / LONG_BLOCK_MS)); // Ertrag nur für fertige 30-min-Gänge
    finishLongWork(w.aid, blocksDone, w.min, true);
    return null;
  }
  function longWorkHtml() {
    const s = state; const aids = hereAids(s); const max = longWorkMax(s);
    let h = "<h3>Arbeiten hier (auch lange Arbeit)</h3>";
    h += "<p class=\"muted\">Wiki (Handbuch S.12): Menschen können lange Arbeiten bis 480 Minuten verrichten, ohne verletzt zu werden. Mutanten nur mit Pilzmix-S oder -M (Wiki). " +
      "Du bist " + origEsc(s.race) + ": bis " + max + " Minuten" + (s.race === "Mutant" && max > 30 ? " (Pilzmix wirkt)" : "") + ". Prototyp: 30 Minuten = 4 Sekunden, Ertrag je 30 Minuten wie ein Arbeitsgang, Abbrechen gibt den Ertrag der fertigen halben Stunden (DESIGN).</p>";
    if (workUi && workUi.long) {
      h += '<div class="work-row"><p>' + origEsc(workUi.label) + " " + xLink("abbrechen", "abort") + '</p><div class="work-bar"><i style="width:' + Math.round(workUi.pct || 0) + '%"></i></div></div>';
      return h;
    }
    if (!aids.length) return h + "<p>Hier gibt es für deinen Beruf nichts zu arbeiten. Geh zu einem passenden Ort (Landkarte) oder bau Kräutergarten/Pilzhaus.</p>" + "<p>" + origLink("Kräuter & Pilze", 'data-page="kraeuterpilze"') + "</p>";
    aids.forEach((aid) => {
      const d = ACTIONS[aid];
      const links = LONG_MIN.map((m) => (m <= max ? xLink(m + " min", "long|" + aid + "|" + m) : '<span class="cant" title="Mutanten: nur mit Pilzmix">' + m + " min</span>")).join(" · ");
      h += "<p><b>" + origEsc(d.label) + "</b> — " + xLink("einmal", "work|" + aid) + " · " + links + "</p>";
    });
    return h + "<p>" + origLink("Kräuter & Pilze", 'data-page="kraeuterpilze"') + "</p>";
  }

  // =====================================================================
  // A2a Rohstoffbestand auf dem Land + Rohstofftränke
  // WIKI: Holz-/Stein-/Metall-/Kunststofftrank "Regeneriert den …bestand auf dem Land des Anwenders".
  // WIKI Erztrank: Land braucht einen Mindestwert an Erz, pro Trank 1000–19000 Erz, max. ca. 90.000 je Land.
  // DESIGN: Bestand in % (100 = voll), −2% je Arbeitsgang, +1% je 10 Minuten von selbst; Ertrag ×(0,4 + 0,6 × Bestand).
  // =====================================================================
  const STOCK_RES = { holz: "Holz", stein: "Stein", metall: "Metall", kunststoff: "Kunststoff", erz: "Erz" };
  const RES_POTION = { Holztrank: "Holz", Steintrank: "Stein", Metalltrank: "Metall", Kunststofftrank: "Kunststoff", Erztrank: "Erz" };
  const STOCK_DROP = 2;          // DESIGN
  const STOCK_REGEN_MIN = 10;    // DESIGN
  const ERZ_LAND_MAX = 90000;    // WIKI
  const ERZ_MIN_PCT = 10;        // DESIGN: "Mindestwert an Erz"
  function landKey(s, loc) { return loc && loc.id !== "field" ? loc.id : s.px + "/" + s.py; }
  function landStock(s, key, res) {
    if (!s.landStock) s.landStock = {};
    const L = s.landStock[key] || (s.landStock[key] = {});
    const e = L[res] || (L[res] = { v: 100, t: Date.now() });
    if (e.v >= 100) { e.t = Date.now(); return e; }
    const steps = Math.floor((Date.now() - e.t) / (STOCK_REGEN_MIN * 60000));
    if (steps > 0) { e.v = Math.min(100, e.v + steps); e.t += steps * STOCK_REGEN_MIN * 60000; }
    return e;
  }
  function stockFactor(v) { return 0.4 + 0.6 * Math.max(0, Math.min(100, v)) / 100; }
  Object.keys(STOCK_RES).forEach((aid) => {
    const d = ACTIONS[aid]; if (!d) return;
    const orig = d.run; const res = STOCK_RES[aid];
    d.run = function (s, loc) {
      const b = s.inv[res] || 0;
      const r = orig.call(this, s, loc);
      if (!r || !r.ok) return r;
      const got = (s.inv[res] || 0) - b;
      if (got <= 0) return r;
      const e = landStock(s, landKey(s, loc || locById(s.locId)), res);
      const keep = Math.max(1, Math.round(got * stockFactor(e.v)));
      if (keep < got) { s.inv[res] -= got - keep; r.msg += " Bestand " + e.v + "%: −" + (got - keep) + " " + res + "."; }
      e.v = Math.max(0, e.v - STOCK_DROP);
      return r;
    };
  });
  function landResList(loc) { return Object.keys(STOCK_RES).filter((aid) => loc && (loc.actions || []).includes(aid)).map((aid) => STOCK_RES[aid]); }
  function landStockRows(loc) {
    const s = state;
    const here = loc && loc.id === s.locId;
    return landResList(loc).map((res) => {
      const e = landStock(s, landKey(s, loc), res);
      const pot = Object.keys(RES_POTION).find((p) => RES_POTION[p] === res);
      const use = here && has(s, pot) ? " " + xLink(pot + " anwenden", "respot|" + pot) : "";
      return "<tr><td>" + origEsc(res) + "bestand:</td><td>" + e.v + "%" + use + "</td></tr>";
    }).join("");
  }
  function useResPotion(name) {
    const s = state; const res = RES_POTION[name];
    const loc = locById(s.locId);
    if (!res) return "Unbekannter Trank.";
    if (!has(s, name)) return "Nicht im Rucksack.";
    if (!landResList(loc).includes(res)) return "Wiki: Der Trank wirkt auf dem Land des Anwenders. Hier gibt es kein " + res + ".";
    const e = landStock(s, landKey(s, loc), res);
    if (res === "Erz") {
      if (e.v < ERZ_MIN_PCT) return "Wiki: Das Land muss einen Mindestwert an Erz haben (hier " + e.v + "%, nötig " + ERZ_MIN_PCT + "%).";
      takeInv(s, name, 1);
      const units = rand(1000, 19000); // WIKI
      const add = Math.max(1, Math.round((units / ERZ_LAND_MAX) * 100));
      const b = e.v; e.v = Math.min(100, e.v + add);
      return "Erztrank: " + units.toLocaleString("de-AT") + " Erz bereitgestellt (Wiki), Erzbestand " + b + "% → " + e.v + "% (Wiki-Höchstwert 90.000 = 100%).";
    }
    takeInv(s, name, 1);
    const b = e.v; e.v = 100;
    return name + ": " + res + "bestand auf " + loc.name + " " + b + "% → 100% (Wiki: regeneriert den Bestand).";
  }

  // =====================================================================
  // A5  Kräuter- und Pilzsorten
  // WIKI Gärtner: baut im Kräutergarten rote, helle, braune Kräuter und Kräutermix an, braucht immer eine Schaufel, TL5.
  //   Kräuter dienen zur Weiterverarbeitung und zur Direkteinnahme.
  // WIKI Pilzsammler: sammelt diverse Pilzsorten im Pilzhaus, braucht immer eine Schaufel, TL5; Chemiker verarbeitet sie.
  // WIKI Sortennamen aus den Rezepten: Fliegenpilze, Strahlenpilze, Schimmelpilze, Blaue Pilze, grüne Pilze.
  // WIKI Kosten Kräutergarten 1000 Holz/500 Stein/200 Sand, Pilzhaus 2000 Holz/900 Stein/100 Sand.
  // DESIGN: Mengen, Sorten-Zufall, wilde Fundorte Kräuterfeld/Pilzhain (weniger Ertrag), Direktwirkung der Kräuter.
  // =====================================================================
  const KRAEUTER_TYPES = ["rote Kräuter", "helle Kräuter", "braune Kräuter"];
  const PILZ_TYPES = ["Fliegenpilze", "Strahlenpilze", "Schimmelpilze", "Blaue Pilze", "grüne Pilze"];
  const HERB_INFO = {
    "Kräuter": { eat: null, note: "Allgemeine Kräuter (Wiki: Ressource)." },
    "rote Kräuter": { eat: { energy: 5 }, note: "Direkt: Energie +5% (DESIGN)." },
    "helle Kräuter": { eat: { fatigue: -5 }, note: "Direkt: Müdigkeit −5% (DESIGN)." },
    "braune Kräuter": { eat: { rad: -5 }, note: "Direkt: Strahlung −5% (DESIGN)." },
    "Kräutermix": { eat: null, note: "Müdigkeit und Strahlung −10% (Wiki)." },
    "Pilze": { eat: null, note: "Allgemeine Pilze (Wiki: Ressource)." },
    "Fliegenpilze": { eat: null, note: "Giftig, nicht essbar (DESIGN)." },
    "Strahlenpilze": { eat: null, note: "Nur für den Chemiker (Wiki)." },
    "Schimmelpilze": { eat: null, note: "Nur für den Chemiker (Wiki)." },
    "Blaue Pilze": { eat: null, note: "Nur für den Chemiker (Wiki), auch Quest-Zutat (Seelenbrenner)." },
    "grüne Pilze": { eat: null, note: "Nur für den Chemiker (Wiki)." },
  };
  Object.keys(HERB_INFO).forEach((n) => { const e = HERB_INFO[n].eat; if (e && !POTIONS[n]) POTIONS[n] = Object.assign({ desc: HERB_INFO[n].note }, e); });
  ["rote Kräuter", "helle Kräuter", "braune Kräuter", "Kräutermix", "Fliegenpilze", "Strahlenpilze", "Schimmelpilze", "Blaue Pilze", "grüne Pilze", "Reagenzgläser"].forEach((n) => { if (!LAGER_ITEMS.includes(n)) LAGER_ITEMS.push(n); });
  BUILDINGS.forEach((b) => {
    if (b.id === "kraeutergarten") { b.cost = { Holz: 1000, Stein: 500, Sand: 200 }; b.desc = "WIKI: Gärtner bauen hier Kräuter an. Kosten WIKI."; b.effect = "rote, helle, braune Kräuter und Kräutermix (Gärtner + Schaufel)"; }
    if (b.id === "pilzhaus") { b.cost = { Holz: 2000, Stein: 900, Sand: 100 }; b.desc = "WIKI: Pilzsammler bauen hier Pilzsorten an. Kosten WIKI."; b.effect = "Fliegen-, Strahlen-, Schimmel-, blaue und grüne Pilze (Pilzsammler + Schaufel)"; }
  });
  function herbGather(s, loc, kind) {
    const k = kind === "kraeuter";
    if (!has(s, "Schaufel")) return { ok: false, msg: (k ? "Der Gärtner" : "Der Pilzsammler") + " braucht immer eine Schaufel (Wiki)." };
    const home = s.locId === "camp" && s.buildings && s.buildings[k ? "kraeutergarten" : "pilzhaus"];
    const wild = loc && (loc.actions || []).includes(kind);
    if (!home && !wild) return { ok: false, msg: k ? "Hier wachsen keine Kräuter. Wiki: Kräutergarten im Ruinencamp (oder das wilde Kräuterfeld, DESIGN)." : "Hier wachsen keine Pilze. Wiki: Pilzhaus im Ruinencamp (oder der wilde Pilzhain, DESIGN)." };
    const types = k ? KRAEUTER_TYPES : PILZ_TYPES; const base = k ? "Kräuter" : "Pilze";
    const got = {};
    const add = (it, n) => { if (n > 0) { addInv(s, it, n); got[it] = (got[it] || 0) + n; } };
    if (home) {
      add(base, rand(1, 3));
      add(types[rand(0, types.length - 1)], rand(2, 4));
      add(types[rand(0, types.length - 1)], rand(1, 2));
      if (k && Math.random() < 0.15) add("Kräutermix", 1);
    } else {
      add(base, rand(2, 5));
      if (Math.random() < 0.3) add(types[rand(0, types.length - 1)], 1);
    }
    gain(s, 2, 1);
    if (["Gärtner", "Pilzsammler"].includes(s.job)) s.nv = (s.nv || 0) + 1; // wie exert("herb"/"pilz"), ohne doppelte Müdigkeit
    const where = home ? (k ? "Kräutergarten" : "Pilzhaus") : (k ? "Kräuterfeld" : "Pilzhain");
    return { ok: true, msg: where + ": " + Object.keys(got).map((x) => got[x] + " " + x).join(", ") + "." };
  }
  ACTIONS.kraeuter.run = function (s, loc) { return herbGather(s, loc, "kraeuter"); };
  ACTIONS.pilze.run = function (s, loc) { return herbGather(s, loc, "pilze"); };
  // Händler (Preise DESIGN): Sorten auch kaufbar, damit Chemiker nicht vom eigenen Gärtner abhängen
  [
    { item: "rote Kräuter", buy: 4, sell: 1 }, { item: "helle Kräuter", buy: 4, sell: 1 }, { item: "braune Kräuter", buy: 4, sell: 1 },
    { item: "Fliegenpilze", buy: 5, sell: 1, where: ["haendler", "haendler2"] }, { item: "Strahlenpilze", buy: 5, sell: 1, where: ["haendler", "haendler2"] },
    { item: "Schimmelpilze", buy: 4, sell: 1, where: ["haendler", "haendler2"] }, { item: "Blaue Pilze", buy: 5, sell: 1, where: ["haendler", "haendler2"] },
    { item: "grüne Pilze", buy: 5, sell: 1, where: ["haendler", "haendler2"] },
  ].forEach((t) => TRADE.push(t));
  function herbUses(name) { return CRAFTS.filter((c) => c.cost && c.cost[name]).map((c) => c.label + " (" + c.cost[name] + ")"); }
  function kraeuterPilzeHtml() {
    const s = state;
    let h = "<h2>Kräuter &amp; Pilze</h2>";
    h += "<p class=\"muted\">Wiki: Der Gärtner (TL5) baut im Kräutergarten rote, helle und braune Kräuter und Kräutermix an, der Pilzsammler (TL5) diverse Pilzsorten im Pilzhaus. Beide brauchen immer eine Schaufel. Kräuter kann man verarbeiten oder direkt nehmen, Pilze verarbeitet der Chemiker. Mengen, Direktwirkung und die wilden Fundorte Kräuterfeld (48/112) und Pilzhain (62/108) sind DESIGN.</p>";
    h += "<p>Kräutergarten: " + (s.buildings && s.buildings.kraeutergarten ? "steht" : origLink("bauen (Gebäude)", 'data-page="gebaeude"')) + " · Pilzhaus: " + (s.buildings && s.buildings.pilzhaus ? "steht" : origLink("bauen (Gebäude)", 'data-page="gebaeude"')) + " · Schaufel: " + (has(s, "Schaufel") ? "ja" : "nein") + " · " + origLink("Arbeiten", 'data-page="arbeiten"') + "</p>";
    const rows = (list, title, where) => {
      let t = "<h3>" + title + "</h3><table>";
      list.forEach((n) => {
        const uses = herbUses(n);
        t += "<tr><td><b>" + origEsc(n) + "</b> (" + (s.inv[n] || 0) + ")" + (POTIONS[n] && has(s, n) ? " " + origLink("nehmen", 'data-use="' + origEsc(n) + '"') : "") + "</td><td>" + origEsc(where(n)) +
          "</td><td>" + origEsc(HERB_INFO[n].note) + (uses.length ? " Für: " + origEsc(uses.join(", ")) + "." : "") + "</td></tr>";
      });
      return t + "</table>";
    };
    h += rows(["Kräuter"].concat(KRAEUTER_TYPES, ["Kräutermix"]), "Kräuter", (n) => n === "Kräuter" ? "Kräutergarten, Kräuterfeld, Händler" : n === "Kräutermix" ? "Kräutergarten (selten), Chemiker" : "Kräutergarten (Gärtner), Händler; selten im Kräuterfeld");
    h += rows(["Pilze"].concat(PILZ_TYPES), "Pilze", (n) => n === "Pilze" ? "Pilzhaus, Pilzhain, Händler" : "Pilzhaus (Pilzsammler), Händlerhöhlen; selten im Pilzhain");
    return h;
  }

  // =====================================================================
  // A2b Gifte (Chemieküche) + Rohstofftränke als Rezepte
  // WIKI: alle Rezepte und Mengen aus "Tränke/Pillen/Pilzmixe" (Icon-Titel im HTML).
  // WIKI Insektengiftspritze: "kann einen Angreifer umhauen und für 1 Stunde außer Gefecht setzen", Benutzen 3000 EP.
  // WIKI Amphibiengiftspritze: "besteht die Möglichkeit …", 4000 EP. Spinnengiftspritze: Gegengift, 3000 EP.
  // DESIGN: Chancen 80% / 50%, Spritze verbraucht, Gegner sofort besiegt; EP ÷5.
  // =====================================================================
  const POISON_SYR = {
    Insektengiftspritze: { ep: epReq(3000), chance: 0.8 }, // DESIGN-Chance
    Amphibiengiftspritze: { ep: epReq(4000), chance: 0.5 }, // DESIGN-Chance
  };
  function poisonInHand(s) {
    const n = s.equip && s.equip.links;
    return n && POISON_SYR[n] && has(s, n) && (s.ep || 0) >= POISON_SYR[n].ep ? n : null;
  }
  /** Runde 1: Giftspritze. true = Kampf damit entschieden. */
  function poisonStrike() {
    const n = fight.poison; const p = POISON_SYR[n];
    takeInv(state, n, 1);
    if (!has(state, n) && state.equip && state.equip.links === n) state.equip.links = null;
    if (Math.random() < p.chance) {
      fightLog("Runde 1: " + n + " — " + fight.enemy.name + " ist für 1 Stunde außer Gefecht (Wiki).", "good");
      fight.foeHP = 0; updateFightUI(); endFight(true); return true;
    }
    fightLog("Runde 1: " + n + " — das Gift wirkt nicht.", "sys");
    return false;
  }
  POTIONS.Spinnengiftspritze = { special: true, desc: "Gegengift (WIKI). Prototyp: heilt eine Verletzung (DESIGN)." };
  Object.keys(RES_POTION).forEach((n) => { POTIONS[n] = { special: true, desc: "Regeneriert den " + RES_POTION[n] + "bestand auf dem Land (WIKI)." }; });
  function useP4Potion(name) {
    const s = state;
    if (RES_POTION[name]) return useResPotion(name);
    if (name === "Spinnengiftspritze") {
      if ((s.ep || 0) < epReq(3000)) return "Wiki: Benutzen ab 3000 EP (Prototyp " + epReq(3000) + " EP).";
      takeInv(s, name, 1);
      const was = isInjured(s); s.injuredUntil = 0;
      return "Spinnengiftspritze: Gegengift gespritzt" + (was ? ", Verletzung geheilt (DESIGN)." : " (keine Vergiftung, DESIGN: heilt Verletzungen).");
    }
    return null;
  }
  const CHEM = (o) => Object.assign({ needJob: "Chemiker", needChemie: true, payLager: true, chem: true }, o);
  const P4_CHEM = [
    CHEM({ id: "holztrank", label: "Holztrank", desc: "WIKI: regeneriert den Holzbestand des Landes. TL2.", cost: { Holz: 250, Wasser: 30 }, result: { Holztrank: 1 }, minTL: 2 }),
    CHEM({ id: "steintrank", label: "Steintrank", desc: "WIKI: regeneriert den Steinbestand. TL2.", cost: { Stein: 250, Wasser: 30 }, result: { Steintrank: 1 }, minTL: 2 }),
    CHEM({ id: "metalltrank", label: "Metalltrank", desc: "WIKI: regeneriert den Metallbestand. TL3.", cost: { Metall: 250, Wasser: 30 }, result: { Metalltrank: 1 }, minTL: 3 }),
    CHEM({ id: "kunststofftrank", label: "Kunststofftrank", desc: "WIKI: regeneriert den Kunststoffbestand. TL3.", cost: { Kunststoff: 250, Wasser: 30 }, result: { Kunststofftrank: 1 }, minTL: 3 }),
    CHEM({ id: "erztrank", label: "Erztrank", desc: "WIKI: 500 schw. Wachtrank, 1000 schw. Strahlentrank, 100 Holzkohle, 750 Wasser, TL9. Prototyp ÷100.", cost: div100({ "schwacher Wachtrank": 500, "schwacher Strahlentrank": 1000, Holzkohle: 100, Wasser: 750 }), result: { Erztrank: 1 }, minTL: 9 }),
    CHEM({ id: "giftstab_i", label: "Giftstabilisator I", desc: "WIKI: nötig für Insektengift. Kaliumnitrat = Kalisalpeter.", cost: { Wasser: 200, Kalisalpeter: 2, "rote Kräuter": 25, Fliegenpilze: 25, Reagenzgläser: 1 }, result: { "Giftstabilisator I": 1 } }),
    CHEM({ id: "giftstab_a", label: "Giftstabilisator A", desc: "WIKI: nötig für Amphibiengift.", cost: { Wasser: 200, YellowCake: 1, Strahlenpilze: 25, Schimmelpilze: 25, Reagenzgläser: 1 }, result: { "Giftstabilisator A": 1 } }),
    CHEM({ id: "giftstab_s", label: "Giftstabilisator S", desc: "WIKI: nötig für Spinnengift.", cost: { Wasser: 200, Uranhexfluorid: 1, Kräuter: 25, "Blaue Pilze": 25, Reagenzgläser: 1 }, result: { "Giftstabilisator S": 1 } }),
    CHEM({ id: "spinnengift", label: "Spinnengift", desc: "WIKI: aus Spinnen, für ein Gegengift.", cost: { Spinnenstachel: 1, "Giftstabilisator S": 1, Kaugummi: 1 }, result: { Spinnengift: 1 } }),
    CHEM({ id: "insektengift", label: "Insektengift", desc: "WIKI: starkes Gift aus Insekten.", cost: { Insekt: 3, "Giftstabilisator I": 1, Kaugummi: 1 }, result: { Insektengift: 1 } }),
    CHEM({ id: "amphibiengift", label: "Amphibiengift", desc: "WIKI: fieses Gift aus Amphibien.", cost: { Amphibiendrüse: 3, "Giftstabilisator A": 1, Kaugummi: 1 }, result: { Amphibiengift: 1 } }),
    CHEM({ id: "insektengiftspritze", label: "Insektengiftspritze", desc: "WIKI: linke Hand, haut einen Angreifer um. Benutzen 3000 EP (Prototyp 600).", cost: { Insektengift: 1, "A-Virus": 1, "leere Spritze": 1 }, result: { Insektengiftspritze: 1 } }),
    CHEM({ id: "amphibiengiftspritze", label: "Amphibiengiftspritze", desc: "WIKI: linke Hand, Chance auf K.o. Benutzen 4000 EP (Prototyp 800).", cost: { Amphibiengift: 1, "T-Virus": 1, "leere Spritze": 1 }, result: { Amphibiengiftspritze: 1 } }),
    CHEM({ id: "spinnengiftspritze", label: "Spinnengiftspritze", desc: "WIKI: Gegengift zu Insekten- und Amphibiengift. Benutzen 3000 EP (Prototyp 600).", cost: { Spinnengift: 1, "N-Virus": 1, "leere Spritze": 1 }, result: { Spinnengiftspritze: 1 } }),
  ];
  // Viren: im Wiki nur als Zutat genannt, ohne Rezept → DESIGN beim Biologen (Biolabor) und beim Drogendealer
  const P4_VIRUS = ["A-Virus", "T-Virus", "N-Virus"].map((v, i) => ({ id: "virus_" + v[0].toLowerCase(), label: v, desc: "DESIGN: Wiki nennt " + v + " nur als Zutat. Biologe im Biolabor.", cost: { "Bio-Serum": 1, Wasser: 20, [["rote Kräuter", "Schimmelpilze", "Blaue Pilze"][i]]: 3 }, result: { [v]: 1 }, minTL: 9, needJob: "Biologe", needBuilding: "biolabor_geb", payLager: true }));
  const P4_TYPED = { // WIKI-Sorten statt der alten DESIGN-Vereinfachung "Kräuter"/"Pilze"/"Glas"
    hastpillen: { cost: { Holz: 100, Wasser: 100, "rote Kräuter": 5 }, desc: "WIKI: Geschwindigkeit +20, danach Müdigkeit. 5 rote Kräuter." },
    wachpillen: { cost: { Holz: 250, Wasser: 100, "helle Kräuter": 5 }, desc: "WIKI: Müdigkeit −150%. 5 helle Kräuter." },
    strahlenpillen: { cost: { Holz: 300, Wasser: 100, "braune Kräuter": 5 }, desc: "WIKI: Strahlung −150%. 5 braune Kräuter." },
    kraeutermix: { cost: { "braune Kräuter": 1, "helle Kräuter": 1, "rote Kräuter": 1 }, desc: "WIKI: je 1 braune, helle, rote Kräuter." },
    pilzmix_s: { cost: { Wasser: 100, Reagenzgläser: 1, Strahlenpilze: 5 }, desc: "WIKI: wirkt später, Strahlung −80%, Müdigkeit +20%, lange Arbeit ohne Verletzung." },
    pilzmix_m: { cost: { Wasser: 150, Reagenzgläser: 1, "Blaue Pilze": 3, "grüne Pilze": 1 }, desc: "WIKI: wirkt später, Müdigkeit −80%, Strahlung +20%, lange Arbeit ohne Verletzung." },
    pilzmix_x: { cost: { Wasser: 300, Reagenzgläser: 1, Fliegenpilze: 3 }, desc: "WIKI: weckt das Tier beim Füttern." },
    karmatrank: { cost: { Wasser: 300, "grüne Pilze": 3, "Dose Spinat": 1 }, desc: "WIKI: neutralisiert Karma. 3 grüne Pilze." },
    holzkohle: { cost: { Kräuter: 5 }, desc: "WIKI (Ressourcen): Holzkohle aus 5 Kräutern. Chemiker." },
  };
  CRAFTS.forEach((c) => { const t = P4_TYPED[c.id]; if (t) { c.cost = t.cost; c.desc = t.desc; c.needChemie = c.id !== "holzkohle" ? true : c.needChemie; c.payLager = true; c.chem = true; } });
  CRAFTS.forEach((c) => { if (c.needJob === "Chemiker") c.chem = true; });
  P4_CHEM.concat(P4_VIRUS).forEach((c) => CRAFTS.push(c));
  ["Holztrank", "Steintrank", "Metalltrank", "Kunststofftrank", "Erztrank", "Giftstabilisator I", "Giftstabilisator A", "Giftstabilisator S", "Spinnengift", "Insektengift", "Amphibiengift", "Insekt", "Amphibiendrüse", "Spinnenstachel"].forEach((n) => { if (!LAGER_ITEMS.includes(n)) LAGER_ITEMS.push(n); });
  // Kleintiere (WIKI Fangnetz "Erfindung"; Insekt/Drüse/Stachel ohne Fundort im Wiki → DESIGN: mit Fangnetz jagen)
  ACTIONS.kleintiere = {
    label: "Kleintiere fangen", icon: "Fell", duration: 4000,
    run(s, loc) {
      if (!(s.equip && s.equip.rechts === "Fangnetz" && has(s, "Fangnetz"))) return { ok: false, msg: "Nimm ein Fangnetz in die rechte Hand (DESIGN: Fangnetz ist eine Erfindung)." };
      const pick = weighted([{ item: "Insekt", n: rand(1, 3), w: 50 }, { item: "Amphibiendrüse", n: 1, w: 30 }, { item: "Spinnenstachel", n: 1, w: 20 }]);
      addInv(s, pick.item, pick.n); gain(s, 1, 1);
      return { ok: true, msg: "Im Fangnetz: " + pick.n + "× " + pick.item + "." };
    },
  };
  function kleintiereHtml() {
    const s = state;
    return "<h3>Kleintiere (Giftzutaten)</h3><p class=\"muted\">DESIGN: Insekten, Amphibiendrüsen und Spinnenstachel (Wiki-Zutaten der Gifte) fängt man mit dem Fangnetz (Wiki-Erfindung) in der rechten Hand, oder man kauft sie beim Drogendealer.</p><p>" +
      (s.equip && s.equip.rechts === "Fangnetz" ? xLink("Kleintiere fangen", "work|kleintiere") : "Fangnetz: " + (s.inv.Fangnetz || 0) + " (rechte Hand nötig)") + "</p>";
  }
  // Händler (DESIGN-Preise): Drogendealerhöhlen für Giftzutaten und Viren, Reagenzgläser im Camp
  const DEALERS = ["w38x52", "w160x170", "w141x28"];
  [
    { item: "Insekt", buy: 6, sell: 2, where: DEALERS }, { item: "Amphibiendrüse", buy: 12, sell: 4, where: DEALERS }, { item: "Spinnenstachel", buy: 15, sell: 5, where: DEALERS },
    { item: "A-Virus", buy: 60, sell: 20, where: DEALERS }, { item: "T-Virus", buy: 70, sell: 25, where: DEALERS }, { item: "N-Virus", buy: 60, sell: 20, where: DEALERS },
    { item: "Kaugummi", buy: 5, sell: 1, where: DEALERS.concat(["haendler"]) },
    { item: "Reagenzgläser", buy: 15, sell: 5, where: ["camp", "haendler", "haendler2"] },
  ].forEach((t) => TRADE.push(t));

  // =====================================================================
  // A4  Erfindungen (Ideenschmiede, Erfinder TL8) — alle Rezepte aus "Sonstiges > Erfindungen" (WIKI).
  // Intelligenz-Anforderung ÷100 (ATTR_SCALE). Namen angeglichen (Liste ERF_NAME).
  // =====================================================================
  const ERF_NAME = { // Wiki-Schreibweise → Prototyp-Name
    Kristalle: "Kristall", "weisse Diamanten": "Diamant (weiß)", "rote Diamanten": "Diamant (rot)", "grüne Diamanten": "Diamant (grün)", "blaue Diamanten": "Diamant (blau)",
    Urandetector: "Urandetektor", Spinat: "Dose Spinat", "SG6 Munition": "SG6 Magazin", "vergammelter Orangensaft": "Orangensaft",
    "Munition für den Diamantsplitterwerfer": "Diamantmunition", "Brauchbares Glas": "Glas", Diamantdetektor: "Diamantendetektor",
  };
  const ERF_RAW = [ // [Name, Wiki-Intelligenz, Kosten]
    ["Morgenstern", 0, { Nägel: 1, Eisenkugel: 1, Eisenkette: 1 }],
    ["Brauchbares Glas", 0, { "zerbrochenes Glas": 1, Schwarzpulver: 1 }],
    ["Seil", 0, { Gartenschlauch: 1, "Beatles Tape": 10 }],
    ["Sprengpfeile", 600, { Pfeile: 1, Dynamit: 1, Nägel: 1 }],
    ["Fernglas", 600, { Glas: 1, "Dose Spinat": 2 }],
    ["Flammenwerfer", 650, { Hochdruckreiniger: 1, Benzintank: 1, Feuerzeug: 1, Gartenschlauch: 2, Trichter: 1 }],
    ["leere Spritze", 650, { Kugelschreiber: 3, Reagenzgläser: 1 }],
    ["Radio", 700, { Batterien: 1, "FM Empfänger": 1, Draht: 1, Kabel: 1, Drehkondensatoren: 2, Lautsprecher: 2 }],
    ["Mikroskop", 700, { Glas: 1, Fernglas: 1, Edelmetallplättchen: 1 }],
    ["Reagenzgläser", 750, { Glas: 1, Schwefel: 1 }],
    ["Erzdetektor", 750, { Radio: 1, Trichter: 1, Batterien: 2, Kampfstab: 1, Draht: 1 }],
    ["Machete", 0, { "kleine Sense": 2, Holzspeer: 1, "Rolle Bindfaden": 1, Edelmetall: 5 }],
    ["Kristallsplitterbombe", 800, { Gasgranate: 1, Metallkugeln: 3, Kristall: 5 }],
    ["Laser", 850, { Seelenbrenner: 1, Kabel: 1, Kristall: 5, Batterien: 5 }],
    ["Ultraschallwerfer", 900, { Lautsprecher: 2, Trichter: 1, Kabel: 1, "Dose Spinat": 2, "Beatles Tape": 1, Gartenschlauch: 2, Batterien: 5 }],
    ["Napalm", 950, { "vergammelter Orangensaft": 5, Schmierseife: 1, Benzinkanister: 1, Kleber: 2 }],
    ["Fangnetz", 950, { Wurfnetz: 3, "Rolle Bindfaden": 1, Kampfstab: 1, Kleber: 2 }],
    ["Scheinwerfer", 1000, { Taschenlampe: 1, Batterien: 1, Feuerzeug: 1, "Dose Spinat": 2, Kleber: 1 }],
    ["Granatwerfer", 1050, { Kugelschreiber: 5, Rasierschaum: 3, Gartenschlauch: 1, Feuerzeug: 1, Kleber: 1 }],
    ["Säurewerfer", 1100, { Hochdruckreiniger: 1, Benzintank: 1, Batterien: 3, Kleber: 5 }],
    ["Taser", 1150, { Hochdruckreiniger: 1, Batterien: 2, Draht: 1, Nägel: 1 }],
    ["Sprengfalle", 1200, { "Dose Spinat": 1, Nägel: 2, Metallkugeln: 2, Dynamit: 1 }],
    ["Stolperfalle", 1200, { Dynamit: 1, Kaugummi: 1, Nägel: 5, "Rolle Bindfaden": 1, Metallkugeln: 5 }],
    ["Mobiler Tiefenbohrer", 1250, { Förderrohre: 1, Bohrspitze: 1, "Dose Spinat": 4, Eisenkette: 4, Kampfstab: 1 }],
    ["Impulssteuerung", 1300, { Edelmetall: 500, Kabel: 1, Kristall: 5, Eisenkugel: 1, Batterien: 1 }],
    ["Levitationsantrieb", 1650, { Edelmetall: 750, Kabel: 1, Kristall: 10, Batterien: 3 }],
    ["Kernfusionszelle", 1350, { Edelmetall: 700, Kabel: 1, Drehkondensatoren: 2 }],
    ["Implosionsantrieb", 1400, { Edelmetall: 250, Kabel: 1, Kristall: 35, Drehkondensatoren: 5, Eisenkugel: 1 }],
    ["Tachyonengenerator", 1450, { Edelmetall: 600, Kabel: 1, Kristall: 25, Drehkondensatoren: 3 }],
    ["Magnetfeldimpulsator", 1500, { Edelmetall: 500, Implosionsantrieb: 1, Kristall: 25 }],
    ["Magnetimpulssteuerung", 1700, { Edelmetall: 200, Magnetfeldimpulsator: 1, Kristall: 35, Drehkondensatoren: 5 }],
    ["EMP Zelle", 1550, { Edelmetall: 300, Kabel: 1, Kristall: 20, Eisenkugel: 1, Batterien: 2 }],
    ["EMP Vehicle Destructor", 1600, { "EMP Zelle": 1, Edelmetall: 500, Kugelschreiber: 4, Kabel: 1, Kristall: 50, Kleber: 2 }],
    ["Urandetektor", 1750, { Radio: 1, Trichter: 1, Batterien: 2, Kabel: 1, Taschenlampe: 1 }],
    ["aktive Kernfusionszelle", 1800, { Kernfusionszelle: 1, "Dose Spinat": 1, Uranoxid: 1, Metallkugeln: 2 }],
    ["EMP Streuer", 1850, { "EMP Zelle": 1, Satellitenschüssel: 1, Draht: 1, Kabel: 1, Batterien: 5 }],
    ["EMP Verteidiger", 1900, { "EMP Zelle": 1, Kabel: 2, Batterien: 1, "Beatles Tape": 1 }],
    ["EMP Verteidigungsanlage", 2000, { "EMP Streuer": 1, "EMP Verteidiger": 1, "aktive Kernfusionszelle": 1, Nägel: 5 }],
    ["Diamantdetektor", 1950, { Urandetector: 1, Kleber: 1, Kristall: 300, Kampfstab: 1 }],
    ["E-Tech Napalmwerfer", 2050, { Trichter: 1, Napalm: 2, Flammenwerfer: 1, "aktive Kernfusionszelle": 1 }],
    ["Mineralbohrer", 2150, { Bohrspitze: 1, Förderrohre: 1, Kristalle: 500, "Dose Spinat": 4, Eisenkette: 4, Kampfstab: 1 }],
    ["Kraftstrahlenkanone", 2100, { Edelmetall: 225, Laser: 1, "aktive Kernfusionszelle": 2, Kristall: 25 }],
    ["Diamantbohrer", 2200, { Bohrspitze: 1, Förderrohre: 1, "weisse Diamanten": 500, "Dose Spinat": 4, Eisenkette: 4, Kampfstab: 1 }],
    ["Diamantsplitterwerfer", 2300, { Klingenschleuder: 1, Kleber: 2, Rasierschaum: 4, Spinat: 2, Granatwerfer: 1, "rote Diamanten": 25, "grüne Diamanten": 25, "blaue Diamanten": 25 }],
    ["Diamantmunition", 2300, { Kaugummi: 1, "SG6 Munition": 1, "weisse Diamanten": 5 }],
    ["Leere Quadronika", 5000, { Diamantsplitterwerfer: 4, Drehkondensatoren: 4, Edelmetallplättchen: 10, "aktive Kernfusionszelle": 1, Draht: 1, Batterien: 4 }],
    ["Quadronika Munition", 5000, { "grüne Diamanten": 4, Kaugummi: 4, "Munition für den Diamantsplitterwerfer": 4, Uranoxid: 1 }],
  ];
  function erfName(n) { return ERF_NAME[n] || n; }
  const P4_ERF = ERF_RAW.map(([name, int, cost]) => {
    const res = erfName(name); const c = {};
    Object.keys(cost).forEach((k) => { c[erfName(k)] = (c[erfName(k)] || 0) + cost[k]; });
    return { id: "erf_" + slug(res), label: res, desc: "WIKI-Rezept (Erfindungen)" + (int ? ", Bauen ab " + int + " Intelligenz (Prototyp " + attrReq(int) + ")" : "") + ".", cost: c, result: { [res]: 1 }, minTL: 8, needJob: "Erfinder", needBuilding: "ideenschmiede", needInt: int ? attrReq(int) : 0, payLager: true, erf: true };
  });
  // alte Erfinder-Rezepte mit gleichem Ergebnis (DESIGN) durch die Wiki-Rezepte ersetzen
  for (let i = CRAFTS.length - 1; i >= 0; i--) {
    const c = CRAFTS[i];
    if (c.needJob === "Erfinder" && P4_ERF.some((e) => Object.keys(e.result)[0] === Object.keys(c.result || {})[0])) CRAFTS.splice(i, 1);
  }
  P4_ERF.forEach((c) => CRAFTS.push(c));
  // Werkzeugmacher-Teile für Erfindungen (WIKI-Kosten aus "Werkzeuge"; "Gold" im Bohrspitzen-Rezept = Gold)
  [
    { id: "wz_bohrspitze", label: "Bohrspitze", desc: "WIKI: nur für den Erfinder.", cost: { Kristall: 5, Edelmetall: 50, gold: 1 }, result: { Bohrspitze: 1 }, minTL: 3, needJob: "Werkzeugmacher", payLager: true },
    { id: "wz_foerderrohre", label: "Förderrohre", desc: "WIKI: nur für den Erfinder.", cost: { Metall: 500 }, result: { Förderrohre: 1 }, minTL: 3, needJob: "Werkzeugmacher", payLager: true },
    { id: "wz_plaettchen", label: "Edelmetallplättchen", desc: "WIKI-Kosten.", cost: { Edelmetall: 5 }, result: { Edelmetallplättchen: 1 }, minTL: 3, needJob: "Werkzeugmacher", payLager: true },
    { id: "wz_moerser", label: "Mörser und Stössel", desc: "WIKI-Kosten.", cost: { Edelmetall: 2, Metall: 100 }, result: { "Mörser und Stössel": 1 }, minTL: 3, needJob: "Werkzeugmacher", payLager: true },
  ].forEach((c) => { if (!CRAFTS.some((x) => x.id === c.id || (x.needJob === "Werkzeugmacher" && x.result && x.result[c.label]))) CRAFTS.push(c); });
  // Zutaten, die sonst nirgends herkommen: beim Händler (DESIGN-Preis 25 Gold)
  (function erfParts() {
    const findable = new Set(((window.EZS_WIKI && EZS_WIKI.items) || []).filter((i) => i.find).map((i) => i.name));
    const made = new Set(); CRAFTS.forEach((c) => Object.keys(c.result || {}).forEach((k) => made.add(k)));
    const sold = new Set(TRADE.map((t) => t.item));
    const raw = new Set(LAGER_ITEMS.concat(["gold", "Bio-Serum", "Forschungspunkt", "Natururan"]));
    const need = new Set(); P4_ERF.forEach((c) => Object.keys(c.cost).forEach((k) => need.add(k)));
    need.forEach((k) => { if (!findable.has(k) && !made.has(k) && !sold.has(k) && !raw.has(k)) TRADE.push({ item: k, buy: 25, sell: 8, where: ["haendler", "haendler2"] }); });
  })();
  function craftLockReason(c) {
    const s = state; const why = [];
    if ((s.techlevel || 0) < (c.minTL || 0)) why.push("Techlevel " + c.minTL);
    if (c.needJob && s.job !== c.needJob) why.push("Beruf " + c.needJob);
    if (c.needBuilding && !bHas(s, c.needBuilding)) { const b = BUILDINGS.find((x) => x.id === c.needBuilding); why.push(b ? b.name : c.needBuilding); }
    if (c.needChemie && !(s.house && s.house.chemie)) why.push("Chemieküche im Privathaus");
    if (c.needInt && (s.attrs.Intelligenz || 0) < c.needInt) why.push("Intelligenz " + c.needInt);
    if (c.needStammB && !stammHas(s, c.needStammB)) { const g = STAMM_GEB.find((x) => x.id === c.needStammB); why.push("Stammgebäude " + (g ? g.name : c.needStammB)); }
    return why.length ? "Nötig: " + why.join(", ") + "." : "";
  }
  function craftRowHtml(c) {
    const ok = canCraft(c); const pay = ok && canPay(state, c.cost);
    const lock = ok ? "" : ' <span class="cant">(' + origEsc(craftLockReason(c)) + ")</span>";
    return "<tr><td><b>" + origEsc(c.label) + "</b><br><span class=\"muted\">" + origEsc(c.desc || "") + "</span></td><td>" + origEsc(costBits(c.cost)) + "</td><td>" +
      (ok ? (pay ? origLink("herstellen", 'data-craft="' + c.id + '"') : '<span class="cant">' + origEsc("es fehlt: " + missingText(state, c.cost)) + "</span>") : "gesperrt") + lock + "</td></tr>";
  }
  function chemiePageHtml() {
    const s = state; const has1 = s.house && s.house.chemie;
    let h = "<h2>Chemieküche</h2><p class=\"muted\">Wiki: Tränke, Pillen, Pilzmixe und Gifte braut der Chemiker in der Chemieküche (Privathaus). Rezepte und Mengen WIKI, außer wo DESIGN steht. Im Ruinencamp zählt das Privatlager mit.</p>";
    h += "<p>Chemieküche: " + (has1 ? "steht" : "fehlt — " + origLink("Haus", 'data-page="haus"')) + " · Beruf: " + origEsc(s.job) + " · " + origLink("Kräuter & Pilze", 'data-page="kraeuterpilze"') + "</p>";
    const groups = [
      ["Rohstofftränke", (c) => RES_POTION[Object.keys(c.result)[0]]],
      ["Gifte und Spritzen", (c) => /gift|Giftstab|spritze/i.test(Object.keys(c.result)[0])],
      ["Tränke, Pillen, Mixe", (c) => c.chem && !RES_POTION[Object.keys(c.result)[0]] && !/gift|Giftstab|spritze/i.test(Object.keys(c.result)[0])],
    ];
    groups.forEach(([t, f]) => { h += "<h3>" + t + "</h3><table>" + CRAFTS.filter(f).map(craftRowHtml).join("") + "</table>"; });
    h += "<h3>Gifte benutzen</h3><p class=\"muted\">Insekten- oder Amphibiengiftspritze in die linke Hand (Ausrüstung): Im Kampf wirkt sie in Runde 1 (Chance 80% / 50%, DESIGN) und ist dann verbraucht. Spinnengiftspritze: Rucksack → benutzen.</p>";
    return h;
  }
  function ideenschmiedePageHtml() {
    const s = state;
    let h = "<h2>Ideenschmiede</h2><p class=\"muted\">Wiki: Der Erfinder (TL8) baut in der Ideenschmiede Erfindungen. Alle " + P4_ERF.length + " Rezepte aus dem Wiki. Intelligenz-Anforderung ÷100 (Prototyp-Skala). Teile wie Bohrspitze und Förderrohre macht der Werkzeugmacher.</p>";
    h += "<p>Ideenschmiede: " + (s.buildings && s.buildings.ideenschmiede ? "steht" : origLink("bauen (Gebäude)", 'data-page="gebaeude"')) + " · Intelligenz " + (s.attrs.Intelligenz || 0) + " · Beruf " + origEsc(s.job) + "</p>";
    h += "<table>" + CRAFTS.filter((c) => c.erf || c.needJob === "Erfinder").map(craftRowHtml).join("") + "</table>";
    h += "<h3>Teile (Werkzeugmacher)</h3><table>" + CRAFTS.filter((c) => /^wz_/.test(c.id)).map(craftRowHtml).join("") + "</table>";
    return h;
  }

  // =====================================================================
  // A3/A4 Stammgebäude + Forschung (Researchlevel)
  // WIKI: Kosten, Anforderungen und Researchlevel aus "Stammgebäude" und "Forschungseinrichtungen".
  // Skala: Kosten ÷100, Intelligenz/Kraft ÷100, Tanks 100.000 → 400 je Stufe (÷250 wie das Stammlager 50.000 → 200).
  // DESIGN: Researchlevel-Punkte (15 × Level je Stufe, je Forschungsarbeit 3 + Intelligenz). Bauzeit seit Durchgang 5 (siehe unten).
  // =====================================================================
  const TANK_PER_LEVEL = 400; // WIKI 100.000 je Stufe ÷250
  const TANK_MAX_LEVEL = 20;  // WIKI
  const RL_MAX = 15;          // WIKI: höchste genannte Stufe (Biolabor RL15)
  const ALL_REACTORS = ["reaktor1", "reaktor2", "reaktor3"];
  const STAMM_GEB = [
    { id: "forschungsgrund", name: "Forschungsgrundstück", cost: div100({ Stein: 5000, Sand: 1000 }), kraft: attrReq(300), setRL: 1, info: "WIKI: nötig für das Forschungsgebäude, Stamm steigt auf Researchlevel 1." },
    { id: "forschungsgeb", name: "Forschungsgebäude", cost: div100({ Holz: 5000, Kunststoff: 2000, Stein: 3000, Sand: 200 }), int: attrReq(200), needs: ["forschungsgrund"], setRL: 2, info: "WIKI: Forscher steigern hier den Researchlevel. Stamm steigt auf Researchlevel 2." },
    { id: "kunststoffschmelze", name: "Kunststoffschmelze", cost: div100({ Holz: 3000, Stein: 4000, Metall: 8000, Sand: 100 }), rl: 3, int: attrReq(220), info: "WIKI: flüssiger Kunststoff (Voraussetzung Polymeresplitter)." },
    { id: "erzverarbeitung", name: "Erzverarbeitung", cost: div100({ Holz: 4000, Stein: 2000, Metall: 9000, Sand: 400 }), rl: 3, needs: ["forschungsgeb"], info: "WIKI: Forscher veredeln Erz zu Edelmetall, 3 Upgrades, mit allen 75 Erz → 20 Edelmetall." },
    { id: "polymeresplitter", name: "Polymeresplitter", cost: div100({ Holz: 3000, Stein: 4000, Metall: 8000, Sand: 50 }), rl: 4, int: attrReq(350), needs: ["kunststoffschmelze"], info: "WIKI: von den Raffinerien benötigt." },
    { id: "reaktor1", name: "Reaktor I", cost: div100({ Holz: 1000, Metall: 3000, Wasser: 4000 }), rl: 5, int: attrReq(150), info: "WIKI: Strom für Kaserne, Waffenfabrik, Raffinerien. Ab dem ersten Reaktor kein Lagerfeuer mehr nötig." },
    { id: "reaktor2", name: "Reaktor II", cost: div100({ Holz: 1000, Metall: 2500, Wasser: 3000 }), rl: 5, int: attrReq(120), needs: ["reaktor1"], info: "WIKI." },
    { id: "reaktor3", name: "Reaktor III", cost: div100({ Metall: 3000, Stein: 4000 }), rl: 5, int: attrReq(150), needs: ["reaktor1", "reaktor2"], info: "WIKI." },
    { id: "benzincracker", name: "Benzincracker", cost: div100({ Metall: 12000, Stein: 10000, Holz: 50000, Sand: 3500 }), rl: 5, int: attrReq(150), info: "WIKI: Ölwerker gewinnen hier Benzin aus Erdöl." },
    { id: "erdoelraffinerie", name: "Erdölraffinerie", cost: div100({ Holz: 8000, Metall: 8000, Wasser: 5000, Sand: 500 }), rl: 6, needs: ["polymeresplitter"].concat(ALL_REACTORS), info: "WIKI: Stufe 1: 20 Holz + 60 Kunststoff → 12 Erdöl." },
    { id: "erdgasraffinerie", name: "Erdgasraffinerie", cost: div100({ Holz: 7000, Metall: 9000, Wasser: 6000, Sand: 300 }), rl: 7, needs: ["polymeresplitter"].concat(ALL_REACTORS), info: "WIKI: Stufe 1: 20 Holz + 60 Kunststoff → 3 Erdgas." },
    { id: "kaserne", name: "Kaserne", cost: div100({ Stein: 2000, Metall: 6000, Öl: 5000, Sand: 50 }), rl: 8, int: attrReq(150), needs: ["erdoelraffinerie"], info: "WIKI: Techlevel erhöhen/verringern, Energie aufladen, Müdigkeit und Strahlung senken." },
    { id: "waffenfabrik", name: "Waffenfabrik", cost: div100({ Stein: 4000, Metall: 3000, Öl: 2000, Gas: 500, Sand: 1000 }), rl: 9, int: attrReq(150), needs: ["reaktor1"], info: "WIKI: neue Waffen, nur Waffentechniker arbeiten hier." },
    { id: "baeder", name: "Bäder", cost: div100({ Stein: 500000, Holz: 150000, "Diamant (weiß)": 1000, Wasser: 200000 }), info: "WIKI: Bad 70 Minuten, Energie auf Maximum, Ausstrahlung +2. Wasserqualität sinkt." },
    { id: "oeltank", name: "Öltank", tank: "Öl", job: "Ölwerker", unit: { Metall: 6000 }, info: "WIKI: +100.000 Öl-Lager je Stufe, 20 Stufen, nur Ölwerker bauen aus. Prototyp +" + TANK_PER_LEVEL + " je Stufe." },
    { id: "gastank", name: "Gastank", tank: "Gas", job: "Gaswerker", unit: { Kunststoff: 8000 }, info: "WIKI: +100.000 Gas-Lager je Stufe, 20 Stufen, nur Gaswerker bauen aus. Prototyp +" + TANK_PER_LEVEL + " je Stufe." },
  ];
  const STAMM_INFO_ONLY = [ // im Wiki beschrieben, im Prototyp noch nicht spielbar
    ["Werkstatt", "RL10, Mechaniker (Fahrzeuge baut die private Garage)"], ["Uranerzaufbereitung", "RL11"], ["Konversionsanlage", "RL12"], ["Anreicherungsanlage", "RL13"], ["EMP-Turm", "RL14"], ["Biolabor (Stamm)", "RL15, 750 Intelligenz"], ["Glasschmelze", "ohne RL-Angabe"],
  ];
  function stammOf(s) {
    const st = s.stamm; if (!st) return null;
    if (!st.geb) st.geb = {};
    if (!st.tank) st.tank = { Öl: 0, Gas: 0 };
    if (st.rl == null) st.rl = 0;
    if (st.rp == null) st.rp = 0;
    if (st.erzUp == null) st.erzUp = 0;
    if (st.bathQ == null) st.bathQ = 100;
    return st;
  }
  function stammHas(s, id) { const st = s && s.stamm; return !!(st && st.geb && st.geb[id]); }
  function rlNeed(rl) { return 15 * (rl + 1); } // DESIGN: Punkte bis zur nächsten Stufe
  function tankCap(s, res) { const st = stammOf(s); return st ? (st.geb[res === "Öl" ? "oeltank" : "gastank"] || 0) * TANK_PER_LEVEL : 0; }
  function sgCost(g, st) { if (!g.tank) return g.cost; const lv = (st.geb[g.id] || 0) + 1; const o = {}; Object.keys(g.unit).forEach((k) => { o[k] = Math.ceil((g.unit[k] * lv) / 100); }); return o; }
  /** Stammbau zahlt aus Rucksack, Privatlager (im Camp), Stammlager und Tanks (DESIGN). */
  function stammHave(s, k) { const st = stammOf(s); return haveRes(s, k) + ((st && st.storage && st.storage[k]) || 0) + ((st && st.tank[k]) || 0); }
  function stammMissing(s, cost) { return Object.keys(cost).filter((k) => stammHave(s, k) < cost[k]).map((k) => (cost[k] - stammHave(s, k)) + " " + k).join(", "); }
  function stammPay(s, cost) {
    if (stammMissing(s, cost)) return false;
    const st = stammOf(s);
    Object.keys(cost).forEach((k) => {
      let need = cost[k];
      const a = Math.min(need, haveRes(s, k)); if (a) { payCost(s, { [k]: a }); need -= a; }
      const b = Math.min(need, (st.storage && st.storage[k]) || 0); if (b) { st.storage[k] -= b; need -= b; }
      if (need > 0) st.tank[k] -= need;
    });
    return true;
  }
  function sgLock(s, g) {
    const st = stammOf(s);
    if (!st) return "Du bist in keinem Stamm.";
    if (g.tank) {
      if ((st.geb[g.id] || 0) >= TANK_MAX_LEVEL) return "Höchste Stufe (20) erreicht.";
      if (s.job !== g.job) return "Nur " + g.job + " können den Ausbau vornehmen (Wiki).";
      return "";
    }
    if (st.geb[g.id]) return "steht";
    if (g.rl && st.rl < g.rl) return "Erst Researchlevel " + g.rl + ".";
    const miss = (g.needs || []).filter((n) => !st.geb[n]).map((n) => STAMM_GEB.find((x) => x.id === n).name);
    if (miss.length) return "Erst " + miss.join(", ") + ".";
    if (g.int && (s.attrs.Intelligenz || 0) < g.int) return "Nötig: Intelligenz " + g.int + " (Wiki ×100).";
    if (g.kraft && (s.attrs.Kraft || 0) < g.kraft) return "Nötig: Kraft " + g.kraft + " (Wiki ×100).";
    return "";
  }
  function buildStammGeb(id) {
    const s = state; const g = STAMM_GEB.find((x) => x.id === id);
    if (!g) return "Unbekanntes Stammgebäude.";
    const lock = sgLock(s, g);
    if (lock === "steht") return "Das Gebäude steht schon.";
    if (lock) return lock;
    const st = stammOf(s); const cost = sgCost(g, st);
    if (!stammPay(s, cost)) return "Es fehlt: " + stammMissing(s, cost) + ".";
    st.geb[g.id] = (st.geb[g.id] || 0) + 1;
    let msg = g.name + (g.tank ? " Stufe " + st.geb[g.id] + ": Lager für " + g.tank + " jetzt " + tankCap(s, g.tank) + "." : " gebaut.");
    if (g.setRL && st.rl < g.setRL) { st.rl = g.setRL; st.rp = 0; msg += " Researchlevel " + st.rl + " (Wiki)."; }
    exert("craft"); gain(s, 3, 2);
    return msg;
  }
  // Forschen im Forschungsgebäude (WIKI: Forscher steigern den Researchlevel durch Arbeiten im Gebäude)
  ACTIONS.forschung_stamm = {
    label: "Im Forschungsgebäude forschen", icon: "Kristall", duration: 4500, needJob: "Forscher", needTL: 4,
    show: (s) => stammHas(s, "forschungsgeb"),
    run(s) {
      const st = stammOf(s);
      if (!st || !st.geb.forschungsgeb) return { ok: false, msg: "Erst ein Forschungsgebäude im Stamm (Wiki)." };
      if (s.job !== "Forscher") return { ok: false, msg: "Nur Forscher arbeiten im Forschungsgebäude (Wiki)." };
      if (st.rl >= RL_MAX) return { ok: false, msg: "Höchster Researchlevel " + RL_MAX + " erreicht." };
      const pts = 3 + (s.attrs.Intelligenz || 0); // DESIGN
      st.rp += pts; gain(s, 2, 2);
      let msg = "Forschung: +" + pts + " Researchpunkte (" + st.rp + " von " + rlNeed(st.rl) + ").";
      while (st.rp >= rlNeed(st.rl) && st.rl < RL_MAX) { st.rp -= rlNeed(st.rl); st.rl += 1; msg += " Researchlevel " + st.rl + "!"; }
      return { ok: true, msg };
    },
  };
  function researchPointsIn(nRaw) {
    const s = state; const st = stammOf(s); const n = Math.max(1, parseInt(nRaw, 10) || 1);
    if (!st || !st.geb.forschungsgeb) return "Erst ein Forschungsgebäude im Stamm (Wiki).";
    if ((s.inv.Forschungspunkt || 0) < n) return "Du hast nur " + (s.inv.Forschungspunkt || 0) + " Forschungspunkt(e).";
    takeInv(s, "Forschungspunkt", n); st.rp += n; // DESIGN 1:1
    let msg = n + " Forschungspunkt(e) eingebracht (" + st.rp + " von " + rlNeed(st.rl) + ").";
    while (st.rp >= rlNeed(st.rl) && st.rl < RL_MAX) { st.rp -= rlNeed(st.rl); st.rl += 1; msg += " Researchlevel " + st.rl + "!"; }
    return msg;
  }
  // Umwandlungen in Stammgebäuden
  const CONVERSIONS = {
    erdoel: { geb: "erdoelraffinerie", label: "Erdöl gewinnen", cost: { Holz: 20, Kunststoff: 60 }, out: { Öl: 12 }, note: "WIKI Stufe 1" },
    erdgas: { geb: "erdgasraffinerie", label: "Erdgas gewinnen", cost: { Holz: 20, Kunststoff: 60 }, out: { Gas: 3 }, note: "WIKI Stufe 1" },
    benzin: { geb: "benzincracker", label: "Benzin cracken", cost: { Öl: 10 }, out: { Benzin: 2 }, job: "Ölwerker", note: "DESIGN-Menge, Wiki: Ölwerker" },
    erz: { geb: "erzverarbeitung", label: "Erz veredeln", cost: { Erz: 75 }, out: null, job: "Forscher", note: "WIKI: 75 Erz → 5 Edelmetall (+5 je Upgrade, mit 3 Upgrades 20)" },
  };
  const ERZ_UP_COST = { Metall: 30, Edelmetall: 10 }; // DESIGN (Wiki nennt nur 60 min je Upgrade)
  function doConversion(id) {
    const s = state; const c = CONVERSIONS[id]; const st = stammOf(s);
    if (!c) return "Unbekannte Umwandlung.";
    if (!st || !st.geb[c.geb]) return "Erst das Stammgebäude bauen.";
    if (c.job && s.job !== c.job) return "Nur " + c.job + " arbeiten hier (Wiki).";
    if (!stammPay(s, c.cost)) return "Es fehlt: " + stammMissing(s, c.cost) + ".";
    const out = c.out || { Edelmetall: 5 + 5 * st.erzUp };
    const bits = [];
    Object.keys(out).forEach((k) => {
      let n = out[k];
      if (k === "Öl" || k === "Gas") { // WIKI: Erdöl/Erdgas nicht im Rucksack → zuerst in den Tank
        const room = Math.max(0, tankCap(s, k) - (st.tank[k] || 0)); const t = Math.min(room, n);
        if (t) { st.tank[k] += t; bits.push(t + " " + k + " → Tank"); n -= t; }
      }
      if (n) { addInv(s, k, n); bits.push(n + " " + k); }
    });
    exert("work"); gain(s, 1, 1);
    return c.label + ": " + bits.join(", ") + ".";
  }
  function erzUpgrade() {
    const s = state; const st = stammOf(s);
    if (!st || !st.geb.erzverarbeitung) return "Erst die Erzverarbeitung bauen.";
    if (st.erzUp >= 3) return "Alle 3 Upgrades sind gebaut (Wiki).";
    if (!stammPay(s, ERZ_UP_COST)) return "Es fehlt: " + stammMissing(s, ERZ_UP_COST) + ".";
    st.erzUp += 1;
    return "Erzverarbeitung Upgrade " + st.erzUp + "/3: jetzt 75 Erz → " + (5 + 5 * st.erzUp) + " Edelmetall.";
  }
  function tankMove(dir, res, nRaw) {
    const s = state; const st = stammOf(s); const n = Math.max(1, parseInt(nRaw, 10) || 0);
    if (res !== "Öl" && res !== "Gas") return "Nur Öl und Gas.";
    if (!st || !tankCap(s, res)) return "Erst einen " + (res === "Öl" ? "Öltank" : "Gastank") + " bauen.";
    if (s.locId !== "camp") return "Zum Tank geht es nur im Ruinencamp.";
    if (dir === "in") {
      const room = tankCap(s, res) - st.tank[res];
      const k = Math.min(n, s.inv[res] || 0, room);
      if (k <= 0) return room <= 0 ? "Der Tank ist voll." : "Kein " + res + " im Rucksack.";
      takeInv(s, res, k); st.tank[res] += k;
      return k + " " + res + " in den Tank (" + st.tank[res] + " von " + tankCap(s, res) + ").";
    }
    const k = Math.min(n, st.tank[res]);
    if (k <= 0) return "Der Tank ist leer.";
    st.tank[res] -= k; addInv(s, res, k);
    return k + " " + res + " aus dem Tank genommen.";
  }
  // Kaserne (WIKI-Funktionen, Mengen DESIGN)
  const KASERNE_MS = 8000;
  function kaserneCmd(what) {
    const s = state;
    if (!stammHas(s, "kaserne")) return "Erst eine Kaserne im Stamm bauen.";
    if (s.locId !== "camp") return "Die Kaserne steht im Ruinencamp.";
    if (what === "rest") {
      return timedJob("kaserne", "Kaserne: ausruhen", KASERNE_MS, "stammgeb", () => {
        const b = [s.energy || 0, s.fatigue || 0, s.radiation || 0];
        s.energy = Math.min(200, (s.energy || 0) + 40); s.fatigue = Math.max(0, (s.fatigue || 0) - 40); s.radiation = Math.max(0, (s.radiation || 0) - 40);
        return "Kaserne: Energie " + b[0] + "→" + s.energy + "%, Müdigkeit " + b[1] + "→" + s.fatigue + "%, Strahlung " + b[2] + "→" + s.radiation + "% (Wiki-Funktion, Mengen DESIGN).";
      });
    }
    if (what === "tldown") {
      if ((s.techlevel || 0) <= 0) return "Techlevel ist schon 0.";
      s.techlevel -= 1; s.tlCap = s.techlevel;
      return "Kaserne: Techlevel auf " + s.techlevel + " gesenkt (Wiki). Es steigt erst wieder, wenn du es hier erhöhst.";
    }
    if (what === "tlup") {
      if (typeof s.tlCap !== "number") return "Dein Techlevel ist nicht gesenkt. Es steigt wie gewohnt mit EP.";
      s.tlCap = s.tlCap + 1;
      const tl = Math.min(evaluateTechlevel(s), s.tlCap);
      if (tl >= evaluateTechlevel(s)) delete s.tlCap;
      const b = s.techlevel; s.techlevel = Math.max(b, tl);
      return "Kaserne: Techlevel " + b + " → " + s.techlevel + (s.tlCap == null ? " (wieder frei)." : ".");
    }
    return "Unbekannt.";
  }
  // Bäder (WIKI: 70 Minuten, Energie auf Maximum, Ausstrahlung +2, Wasserqualität sinkt)
  const BAD_MS = Math.round((70 / 30) * 4000); // 70 Wiki-Minuten
  const BAD_ENERGY_MAX = 200; // Energie-Maximum im Prototyp
  const BAD_BOOST_MS = 10 * 60000; // DESIGN: Ausstrahlung +2 für 10 Minuten
  const BAD_Q_DROP = 25, BAD_Q_MIN = 25, BAD_SWAP = { Wasser: 50 }; // DESIGN
  function badCmd() {
    const s = state; const st = stammOf(s);
    if (!stammHas(s, "baeder")) return "Erst die Bäder im Stamm bauen.";
    if (s.locId !== "camp") return "Die Bäder stehen im Ruinencamp.";
    if (st.bathQ < BAD_Q_MIN) return "Die Wasserqualität ist zu schlecht (" + st.bathQ + "%). Erst Wasser austauschen (Wiki).";
    return timedJob("bad", "Im Bad entspannen (70 Minuten)", BAD_MS, "stammgeb", () => {
      const b = s.energy || 0; s.energy = BAD_ENERGY_MAX;
      st.bathQ = Math.max(0, st.bathQ - BAD_Q_DROP);
      if (!s.boosts) s.boosts = [];
      let boost = " Ausstrahlung wirkt schon.";
      if (!s.boosts.some((x) => x.name === "Bad")) { s.attrs.Ausstrahlung = (s.attrs.Ausstrahlung || 0) + 2; s.boosts.push({ attr: "Ausstrahlung", n: 2, until: Date.now() + BAD_BOOST_MS, name: "Bad", noTired: true }); boost = " Ausstrahlung +2 (Wiki) für 10 Minuten (DESIGN)."; }
      return "Bad: Energie " + b + "→" + s.energy + "% (Wiki: Maximum)." + boost + " Wasserqualität " + st.bathQ + "%.";
    });
  }
  function badWasser() {
    const s = state; const st = stammOf(s);
    if (!stammHas(s, "baeder")) return "Erst die Bäder im Stamm bauen.";
    if (st.bathQ >= 100) return "Das Wasser ist sauber.";
    if (!stammPay(s, BAD_SWAP)) return "Es fehlt: " + stammMissing(s, BAD_SWAP) + ".";
    st.bathQ = Math.min(100, st.bathQ + 50);
    return "Wasser ausgetauscht: Qualität " + st.bathQ + "%.";
  }
  function stammGebPageHtml() {
    const s = state; const st = stammOf(s);
    if (!st) return "<h2>Stammgebäude</h2><p>Du bist in keinem Stamm. " + origLink("Gründung", 'data-page="gruendung"') + "</p>";
    let h = "<h2>Stammgebäude</h2><p class=\"muted\">Wiki-Kosten ÷100 (Prototyp-Skala, wie Teleporter), Intelligenz/Kraft ÷100. Bezahlt wird aus Rucksack, Privatlager (im Camp), Stammlager und Tanks. Bauzeit im Wiki 60–480 min, im Prototyp sofort (DESIGN).</p>";
    h += "<p>Researchlevel <b>" + st.rl + "</b> · " + origLink("Forschung", 'data-page="forschung"') + " · " + origLink("Waffenfabrik", 'data-page="waffenfabrik"') + "</p><table>";
    STAMM_GEB.forEach((g) => {
      const lock = sgLock(s, g); const lv = st.geb[g.id] || 0; const cost = sgCost(g, st);
      let act;
      if (g.tank) act = "Stufe " + lv + "/" + TANK_MAX_LEVEL + (lock ? ' <span class="cant">' + origEsc(lock) + "</span>" : " " + xLink("ausbauen", "sgeb|" + g.id));
      else if (lock === "steht") act = "steht";
      else act = lock ? '<span class="cant">' + origEsc(lock) + "</span>" : (stammMissing(s, cost) ? '<span class="cant">' + origEsc("es fehlt: " + stammMissing(s, cost)) + "</span>" : xLink("bauen", "sgeb|" + g.id));
      h += "<tr><td><b>" + origEsc(g.name) + "</b><br><span class=\"muted\">" + origEsc(g.info) + "</span></td><td>" + origEsc(costBits(cost)) + (g.tank && lv < TANK_MAX_LEVEL ? " (Stufe " + (lv + 1) + ")" : "") + "</td><td>" + act + "</td></tr>";
    });
    h += "</table>";
    // Benutzen
    const use = [];
    ["Öl", "Gas"].forEach((r) => { if (tankCap(s, r)) use.push("<p><b>" + (r === "Öl" ? "Öltank" : "Gastank") + "</b>: " + st.tank[r] + "/" + tankCap(s, r) + " " + r + " · " + xLink("10 einlagern", "tin|" + r + "|10") + " · " + xLink("alles einlagern", "tin|" + r + "|99999") + " · " + xLink("10 entnehmen", "tout|" + r + "|10") + "</p>"); });
    Object.keys(CONVERSIONS).forEach((k) => { const c = CONVERSIONS[k]; if (st.geb[c.geb]) use.push("<p><b>" + origEsc(c.label) + "</b> (" + origEsc(costBits(c.cost)) + " → " + origEsc(c.out ? costBits(c.out) : (5 + 5 * st.erzUp) + " Edelmetall") + ", " + origEsc(c.note) + ") " + xLink("umwandeln", "conv|" + k) + (k === "erz" && st.erzUp < 3 ? " · " + xLink("Upgrade (" + costBits(ERZ_UP_COST) + ", DESIGN)", "erzup") : "") + "</p>"); });
    if (st.geb.kaserne) use.push("<p><b>Kaserne</b>: " + xLink("ausruhen (Energie +40, Müdigkeit −40, Strahlung −40, DESIGN)", "kaserne|rest") + " · " + xLink("Techlevel senken", "kaserne|tldown") + " · " + xLink("Techlevel erhöhen", "kaserne|tlup") + (typeof s.tlCap === "number" ? " (gesenkt auf " + s.tlCap + ")" : "") + "</p>" + p4Bar("kaserne"));
    if (st.geb.baeder) use.push("<p><b>Bäder</b>: Wasserqualität " + st.bathQ + "% · " + xLink("baden (70 min)", "bad") + " · " + xLink("Wasser austauschen (" + costBits(BAD_SWAP) + ", DESIGN)", "badwasser") + "</p>" + p4Bar("bad"));
    if (ALL_REACTORS.some((r) => st.geb[r])) use.push("<p class=\"muted\">Reaktor: Wiki — ab dem ersten Reaktor kein Lagerfeuer mehr nötig. Im Prototyp ist das Stammlager ohnehin ein sicherer Schlafplatz.</p>");
    if (use.length) h += "<h3>Benutzen</h3>" + use.join("");
    h += "<h3>Noch nicht spielbar</h3><p class=\"muted\">" + STAMM_INFO_ONLY.map((x) => origEsc(x[0] + " (" + x[1] + ")")).join(", ") + ".</p>";
    return h;
  }
  function forschungPageHtml() {
    const s = state; const st = stammOf(s);
    if (!st) return "<h2>Forschung</h2><p>Du bist in keinem Stamm.</p>";
    let h = "<h2>Forschung</h2><p class=\"muted\">Wiki: Forschungsgrundstück → Researchlevel 1, Forschungsgebäude → 2, danach steigern Forscher den Researchlevel durch Arbeit im Gebäude. Punkte je Stufe (15 × nächste Stufe) und je Arbeit (3 + Intelligenz) sind DESIGN. Forschungspunkte aus dem Rucksack zählen 1:1 (DESIGN).</p>";
    h += "<table><tr><td>Researchlevel:</td><td><b>" + st.rl + "</b> / " + RL_MAX + "</td></tr><tr><td>Punkte:</td><td>" + st.rp + " / " + rlNeed(st.rl) + "</td></tr></table>";
    if (st.geb.forschungsgeb) {
      h += "<p>" + (s.job === "Forscher" && s.locId !== "camp" ? "Das Forschungsgebäude steht im Ruinencamp. Erst " + origLink("ins Ruinencamp reisen", 'data-loc="camp"') + ", dann forschen." : s.job === "Forscher" ? xLink("forschen (ein Arbeitsgang)", "work|forschung_stamm") + " · lange Arbeit unter " + origLink("Arbeiten", 'data-page="arbeiten"') : "Nur Forscher arbeiten im Forschungsgebäude.") + "</p>";
      if (s.inv.Forschungspunkt) h += "<p>Forschungspunkte im Rucksack: " + s.inv.Forschungspunkt + " " + xLink("1 einbringen", "rpin|1") + " · " + xLink("alle einbringen", "rpin|" + s.inv.Forschungspunkt) + "</p>";
    } else h += "<p>Erst Forschungsgrundstück und Forschungsgebäude bauen: " + origLink("Stammgebäude", 'data-page="stammgeb"') + "</p>";
    h += "<h3>Was schaltet welcher Level frei?</h3><table>";
    STAMM_GEB.filter((g) => g.rl || g.setRL).sort((a, b) => (a.rl || a.setRL) - (b.rl || b.setRL)).forEach((g) => { h += "<tr><td>RL " + (g.rl || g.setRL) + "</td><td>" + origEsc(g.name) + (st.geb[g.id] ? " (steht)" : "") + "</td></tr>"; });
    STAMM_INFO_ONLY.forEach((x) => { h += "<tr><td class=\"muted\">" + origEsc(x[1]) + "</td><td class=\"muted\">" + origEsc(x[0]) + " (noch nicht spielbar)</td></tr>"; });
    return h + "</table>";
  }

  // =====================================================================
  // A6  Waffenfabrik (WIKI: nur Waffentechniker; Kosten aus "fortschrittliche/barbarische Waffen", ÷10; Erdöl/Erdgas = Öl/Gas)
  // =====================================================================
  const WF_ITEMS = [
    ["Wallbrecher", { Holz: 9000, Öl: 6000, Metall: 8000, Gas: 500 }, "zerstört bei einem Angriff einen kompletten Wall"],
    ["Bola", { Gas: 120, Öl: 800, Metall: 3000 }, "Benutzen 900 EP, 200 Kraft, 100 Intelligenz"],
    ["Kleinmann SG6", { Gas: 200, Stein: 200, Metall: 3000, Öl: 1000 }, "Benutzen 700 EP, braucht SG6 Magazin"],
    ["Molotow Cocktail", { Öl: 500, Metall: 500 }, "Einweg. Benutzen 2000 EP, 500 Intelligenz, 200 Ausdauer"],
    ["Wurfsterne", { Öl: 800, Metall: 1000 }, "Einweg. Benutzen 2500 EP, 800 Intelligenz"],
    ["Gasgranate", { Gas: 100, Metall: 600 }, "Einweg. Benutzen 2500 EP, 1000 Intelligenz"],
  ];
  function div10(cost) { const o = {}; Object.keys(cost).forEach((k) => { o[k] = Math.max(1, Math.ceil(cost[k] / 10)); }); return o; }
  for (let i = CRAFTS.length - 1; i >= 0; i--) if (CRAFTS[i].id === "wallbrecher") CRAFTS.splice(i, 1); // alte DESIGN-Kosten
  WF_ITEMS.forEach(([n, cost, note]) => CRAFTS.push({ id: "wf_" + slug(n), label: n, desc: "WIKI: " + note + ". Kosten ÷10.", cost: div10(cost), result: { [n]: 1 }, minTL: 1, needJob: "Waffentechniker", needStammB: "waffenfabrik", payLager: true, wf: true }));
  CRAFTS.push({ id: "wf_seelenbrenner", label: "Seelenbrenner", desc: "WIKI: Waffenfabrik nennt Seelenbrenner für den Nahkampf; Kosten fehlen im Wiki → DESIGN.", cost: { Metall: 300, Edelmetall: 50, Kristall: 5 }, result: { Seelenbrenner: 1 }, minTL: 1, needJob: "Waffentechniker", needStammB: "waffenfabrik", payLager: true, wf: true });
  CRAFTS.push({ id: "taserspitzen", label: "Taserspitzen", desc: "Munition für den Taser. Kosten DESIGN.", cost: { Metall: 20, Batterien: 1 }, result: { Taserspitzen: 3 }, minTL: 3, needJob: "Waffentechniker", needStammB: "waffenfabrik", payLager: true, wf: true });
  CRAFTS.forEach((c) => { if (c.id === "steinkugeln" || c.id === "metallkugeln") { c.needStammB = "waffenfabrik"; c.wf = true; c.desc += " Wiki: nur in der Waffenfabrik."; } });
  function waffenfabrikPageHtml() {
    const s = state;
    let h = "<h2>Waffenfabrik</h2><p class=\"muted\">Wiki: Stammgebäude ab Researchlevel 9. Hier entstehen Wurfsterne, Molotow Cocktails, Wallbrecher, Seelenbrenner und andere. Nur Waffentechniker arbeiten hier. Kosten ÷10 (Prototyp-Skala wie Fahrzeuge). Einweg-Waffen werden zu Kampfbeginn verbraucht.</p>";
    h += "<p>Waffenfabrik: " + (stammHas(s, "waffenfabrik") ? "steht" : "fehlt — " + origLink("Stammgebäude", 'data-page="stammgeb"')) + " · Beruf: " + origEsc(s.job) + "</p>";
    return h + "<table>" + CRAFTS.filter((c) => c.wf).map(craftRowHtml).join("") + "</table>";
  }

  // =====================================================================
  // B  Charakter zurücksetzen
  // =====================================================================
  function resetHtml() {
    return "<h3>Charakter zurücksetzen</h3><p class=\"muted\">Löscht den Spielstand in diesem Browser und startet einen neuen Standard-Charakter.</p><p>" + xLink("Charakter zurücksetzen", "reset") + "</p>";
  }
  function resetCharacter() {
    if (!confirm("Charakter wirklich zurücksetzen? Der Spielstand wird gelöscht.")) return false;
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
    workUi = null; busy = false; fight = null; longSafe = false;
    if (typeof sleepUi !== "undefined") sleepUi = null;
    const ov = document.getElementById("fight-overlay"); if (ov) ov.classList.add("hidden");
    clearSave();
    LEGACY_STORAGE_KEYS.forEach((k) => { try { localStorage.removeItem(k); } catch (e) { /* egal */ } });
    bootDefault();
    origPage = "status";
    clearResults(); showResult("Neuer Charakter: Wanderer."); setProgress(0); setStatus("Bereit."); renderAll();
    return true;
  }

  // ---------- Verteiler ----------
  function p4Page(page) {
    if (page === "chemie") return chemiePageHtml();
    if (page === "ideenschmiede") return ideenschmiedePageHtml();
    if (page === "kraeuterpilze") return kraeuterPilzeHtml();
    if (page === "stammgeb") return stammGebPageHtml();
    if (page === "forschung") return forschungPageHtml();
    if (page === "waffenfabrik") return waffenfabrikPageHtml();
    return null;
  }
  function p4Cmd(c, a, b) {
    if (c === "long") return startLongWork(a, b);
    if (c === "work") {
      if (!ACTIONS[a]) return "Unbekannte Arbeit.";
      if (a !== "kleintiere" && !hereAids(state).includes(a)) return "Hier geht diese Arbeit nicht (Ort, Beruf oder Techlevel).";
      startAction(a); return null;
    }
    if (c === "respot") return useResPotion(a);
    if (c === "sgeb") return buildStammGeb(a);
    if (c === "rpin") return researchPointsIn(a);
    if (c === "conv") return doConversion(a);
    if (c === "erzup") return erzUpgrade();
    if (c === "tin") return tankMove("in", a, b);
    if (c === "tout") return tankMove("out", a, b);
    if (c === "kaserne") return kaserneCmd(a);
    if (c === "bad") return badCmd();
    if (c === "badwasser") return badWasser();
    return "Unbekannter Befehl.";
  }

  // =====================================================================
  // Durchgang 5 (Okt 2026): Bauzeiten, Stammgebäude ab RL10, Uran-Kette, Glasschmelze, Raffinerie Stufe 2,
  // Wirkung der Erfindungen, Waffen-Anforderungen, KP-Skala, Reaktor, Überfälle, Erfahrungszähler, Berufs-Voraussetzungen.
  // WIKI = aus dem Wiki-Spiegel, DESIGN = erfunden/skaliert.
  // =====================================================================
  const P5_MIN_MS = 4000 / 30; // 30 Wiki-Minuten = 4 s (Skala wie Durchgang 4)
  function wikiMinMs(min) { return Math.round(min * P5_MIN_MS); }

  // ---------- 3. Benutzen-Anforderungen der Waffen (WIKI "Benutzen: … EP, … Intelligenz"; Skala EP ÷5, Eigenschaften ÷100) ----------
  const P5_WREQ = Object.assign({"Bajonett":{"EP":125},"Blasrohr":{"EP":180},"Baseballschläger":{"EP":150},"Machete":{"EP":200},"Kampfstab":{"EP":250},"Dreschflegel":{"EP":300},"Keule":{"EP":200},"Morgenstern":{"EP":300},"Körperspalter":{"Kraft":150},"Nagelkeule":{"EP":200},"Harpune":{"EP":200},"Steinkatapult":{"Kraft":200},"Metallkatapult":{"Kraft":200},"Kurzschwert":{"EP":600},"Schwert":{"EP":700,"Kraft":100,"Geschwindigkeit":100},"Bola":{"EP":900,"Kraft":200,"Intelligenz":100,"Geschwindigkeit":20},"Armbrust":{"EP":1000,"Intelligenz":200,"Ausdauer":200},"Sprengbogen":{"EP":600,"Intelligenz":100},"Klingenschleuder":{"EP":700},"Nailgun":{"EP":400},"Granatwerfer":{"EP":1500,"Intelligenz":200,"Geschwindigkeit":200},"Säurewerfer":{"EP":1800,"Intelligenz":200,"Geschwindigkeit":200},"Wurfsterne":{"EP":2500,"Intelligenz":800},"Gasgranate":{"EP":2500,"Intelligenz":1000},"leerer Kreischer":{"EP":2000,"Intelligenz":500,"Geschwindigkeit":300,"Wahrnehmung":100,"Ausdauer":100},"leerer Napalmwerfer":{"EP":2000,"Kraft":500},"Ultraschallwerfer":{"EP":1250,"Intelligenz":300,"Geschwindigkeit":100},"Laser":{"EP":2500,"Intelligenz":600,"Geschwindigkeit":400},"EMP Vehicle Destructor":{"EP":2000,"Intelligenz":800,"Geschwindigkeit":200},"E-Tech Napalmwerfer":{"EP":2000,"Kraft":500},"Kraftstrahlenkanone":{"EP":3000,"Kraft":500,"Intelligenz":1000,"Geschwindigkeit":300,"Ausdauer":200},"Kristallsplitterbombe":{"EP":3000,"Intelligenz":500,"Geschwindigkeit":300},"Railgun":{"EP":4000,"Kraft":1000,"Ausdauer":1000},"Diamantsplitterwerfer":{"Ausstrahlung":500},"Quadronica":{"EP":15000},"Kreischer":{"EP":2000,"Kraft":500,"Intelligenz":1000,"Geschwindigkeit":300,"Wahrnehmung":100,"Ausdauer":100},"XB-5000 Granate":{"EP":4000,"Kraft":250,"Intelligenz":200,"Geschwindigkeit":500,"Ausdauer":200},"Dornenpeitsche":{"EP":800,"Wahrnehmung":70},"Greifer":{"EP":500,"Ausdauer":500},"Flammenwerfer":{"EP":1000},"Scheinwerfer":{"EP":400},"Taser":{"EP":1000},"Leere Quadronika":{"EP":15000}}, {
    "Molotow Cocktail": { EP: 2000, Intelligenz: 500, Ausdauer: 200 }, // WIKI fortschrittliche Waffen
    "Kleinmann SG6": { EP: 700 },                                      // WIKI
    "Edelmetall Schaufel": { EP: 150 }, "Edelmetall Spitzhacke": { EP: 300 }, // WIKI Werkzeuge
  });
  function p5Req(name) {
    const r = P5_WREQ[name]; if (!r) return null;
    const o = {}; Object.keys(r).forEach((k) => { o[k] = k === "EP" ? epReq(r[k]) : attrReq(r[k]); });
    return o;
  }
  function p5ReqMissing(s, name) {
    const r = p5Req(name); if (!r) return "";
    return Object.keys(r).filter((k) => (k === "EP" ? (s.ep || 0) : (s.attrs[k] || 0)) < r[k]).map((k) => r[k] + " " + k).join(", ");
  }
  function p5ReqText(name) { const r = p5Req(name); return r ? Object.keys(r).map((k) => r[k] + " " + k).join(", ") : ""; }
  // Wiki-Waffen, die im Katalog fehlen (Stärke WIKI aus wiki-items-full.js)
  [["Kampfstab", 50], ["Körperspalter", 80], ["Armbrust", 250], ["Sprengbogen", 200], ["Klingenschleuder", 200], ["Nailgun", 220], ["Diamantsplitterwerfer", 2000], ["Dornenpeitsche", 130], ["Leere Quadronika", 3000]].forEach(([n, st]) => {
    if (window.EZS_WIKI && EZS_WIKI.items && !EZS_WIKI.items.some((x) => x.name === n)) EZS_WIKI.items.push({ name: n, kind: "Waffe", staerke: st, slot: "rechts", find: false, src: "pass5" });
  });
  if (window.EZS_WIKI && EZS_WIKI.items) EZS_WIKI.items.forEach((i) => { if (i.name === "Scheinwerfer") i.slot = "links"; }); // WIKI: linke Hand, Waffe rechts
  Object.assign(AMMO_FOR, { "E-Tech Napalmwerfer": "Napalm", Diamantsplitterwerfer: "Diamantmunition", "Leere Quadronika": "Quadronika Munition" }); // WIKI-Rezepte nennen die Munition
  if (!EINWEG.includes("XB-5000 Granate")) EINWEG.push("XB-5000 Granate"); // DESIGN: Granate = Einweg

  // ---------- 6. KP-Skala für Wiki-Stärke (DESIGN) ----------
  // Wiki-Stärken reichen von 2 (Stock) bis 4000 (XB-5000). Linear wären Einweg-Waffen +600 KP.
  // DESIGN: KP = 2,5 × Wurzel(Wiki-Stärke). Molotow 600 → 61, Railgun 1500 → 97, Holzspeer 16 → 10, Bogen 50 → 18.
  const P5_KP_FACTOR = 2.5;
  function p5StrengthKP(st) { return st > 0 ? Math.max(1, Math.round(P5_KP_FACTOR * Math.sqrt(st))) : 0; }
  function wikiWeaponKP(s, name, st) {
    if (WEAPONS[name]) return 0;              // Grundwaffen zählen schon über die Rucksack-Tabelle
    if (p5ReqMissing(s, name)) return 0;      // WIKI: Benutzen-Anforderung nicht erfüllt
    return p5StrengthKP(st);
  }
  bestWeapon = function (s) {
    let best = null;
    for (const [name, w] of Object.entries(WEAPONS)) {
      if ((s.inv[name] || 0) > 0 && !p5ReqMissing(s, name) && (!best || w.kp > best.kp)) best = Object.assign({ name }, w);
    }
    return best;
  };
  const p5WeaponLabel0 = weaponLabel;
  weaponLabel = function (s) {
    let t = p5WeaponLabel0(s);
    const eq = s.equip && s.equip.rechts;
    const it = eq && !WEAPONS[eq] ? wikiByName(eq) : null;
    if (it && it.staerke && has(s, eq)) {
      const miss = p5ReqMissing(s, eq);
      t += " · Hand: " + eq + " (Wiki-Stärke " + it.staerke + (miss ? ", Anforderung fehlt: " + miss + " → 0 KP" : ammoOk(s) ? " → +" + p5StrengthKP(it.staerke) + " KP" : ", ohne Munition → 0 KP") + ")";
    }
    return t;
  };
  const p5Einweg0 = einwegInHand;
  einwegInHand = function (s) { const w = p5Einweg0(s); return w && !p5ReqMissing(s, w) ? w : null; };
  function p5EquipNote(name) {
    const miss = p5ReqMissing(state, name);
    return miss ? " Achtung: Wiki-Anforderung fehlt (" + miss + "), im Kampf zählt die Waffe nicht." : "";
  }

  // ---------- 1./4. Stammgebäude ab RL10 + Bauzeit ----------
  const P5_BUILD_MIN = { // WIKI Bauzeiten in Minuten
    forschungsgrund: 180, forschungsgeb: 180, kunststoffschmelze: 120, polymeresplitter: 120, erzverarbeitung: 120,
    reaktor1: 120, reaktor2: 120, reaktor3: 120, benzincracker: 240, erdoelraffinerie: 180, erdgasraffinerie: 180,
    kaserne: 240, waffenfabrik: 240, baeder: 480, oeltank: 60, gastank: 60,
  };
  [
    { id: "werkstatt_st", name: "Werkstatt", cost: div100({ Stein: 1000, Metall: 8000, Öl: 9000, Gas: 700, Sand: 500 }), rl: 10, int: attrReq(150), job: "Mechaniker", min: 240, info: "WIKI: RL10, 150 Intelligenz, baut nur der Mechaniker. Zählt als Werkstatt für Fahrzeugbau, Reparatur und Pimpen." },
    { id: "uranerz", name: "Uranerzaufbereitung", cost: div100({ Metall: 8000, Stein: 8000, Edelmetall: 1000, Sand: 100 }), rl: 11, int: attrReq(250), needs: ALL_REACTORS, min: 240, info: "WIKI: RL11, alle Reaktoren. Forscher machen aus Natururan Yellow Cake." },
    { id: "konversion", name: "Konversionsanlage", cost: div100({ Metall: 5000, Stein: 4000, Edelmetall: 800, Sand: 100 }), rl: 12, int: attrReq(250), needs: ALL_REACTORS, min: 240, info: "WIKI: RL12. Yellow Cake → Uranhexafluorid." },
    { id: "anreicherung", name: "Anreicherungsanlage", cost: div100({ Metall: 11000, Stein: 21000, Kristall: 100, Sand: 50 }), rl: 13, int: attrReq(250), needs: ALL_REACTORS, min: 240, info: "WIKI: RL13. Uranhexafluorid → Uranoxid." },
    { id: "empturm", name: "EMP Verteidigungsturm", cost: div100({ Stein: 20000, Edelmetall: 700, Gas: 2000 }), rl: 14, needItem: "EMP Verteidigungsanlage", min: 240, info: "WIKI: RL14, EMP Verteidigungsanlage im Rucksack. Schwächt Angriffe mit Fahrzeugen: Überfälle verlieren den Fahrzeug-Bonus." },
    { id: "biolabor_st", name: "Biolabor", cost: div100({ Stein: 30000, Edelmetall: 1000, Gas: 5000, Öl: 2000, Sand: 500 }), rl: 15, int: attrReq(750), min: 240, info: "WIKI: RL15, 750 Intelligenz, nur Biologen arbeiten hier. Biolevel wie Researchlevel, Erfolg je nach Intelligenz bis 80%. Ziele: Antivirus, M4 Virus, XB-5000." },
    { id: "glasschmelze", name: "Glasschmelze", cost: div100({ Metall: 50000, Holz: 50000, Edelmetall: 500, Sand: 150 }), min: 240, info: "WIKI: Glasschmelzer machen je Glas aus 1 Uranhexafluorid + 50 Sand." },
    { id: "erdoelraffinerie2", name: "Erdölraffinerie Stufe 2", cost: div100({ Holz: 8000, Metall: 8000, Wasser: 5000, Sand: 500 }), rl: 6, needs: ["erdoelraffinerie"], min: 180, info: "WIKI Stufe 2: 400 Holz + 1200 Kunststoff → 120 Erdöl. Ausbaukosten nennt das Wiki nicht → wie der Bau (DESIGN)." },
    { id: "erdgasraffinerie2", name: "Erdgasraffinerie Stufe 2", cost: div100({ Holz: 7000, Metall: 9000, Wasser: 6000, Sand: 300 }), rl: 7, needs: ["erdgasraffinerie"], min: 180, info: "WIKI Stufe 2: 400 Holz + 1200 Kunststoff → 30 Erdgas. Ausbaukosten wie der Bau (DESIGN)." },
    { id: "kampfarena", name: "Kampfarena", cost: div100({ Holz: 9000, Stein: 3000, Sand: 200 }), needs: ["kaserne"], min: 120, info: "WIKI: risikolose Testkämpfe, Kampferfahrung ohne Verlust (1 KEP je Training)." },
    { id: "radiostation", name: "Radiostation", cost: div100({ Holz: 5000, Stein: 5000, Metall: 5000, Sand: 100 }), int: attrReq(150), needs: ["reaktor1"], min: 120, info: "WIKI: braucht Reaktor I. DESIGN: Mit Radio im Rucksack rufst du bei Überfällen Hilfe (+10 Verteidigung), Funkmeldungen landen im Radio." },
    { id: "loeschvorrichtung", name: "Löschvorrichtung", cost: div100({ Wasser: 3000, Metall: 500 }), int: attrReq(300), min: 60, info: "WIKI: löscht Brände im Stammlager. Brände entstehen bei Überfällen (DESIGN)." },
    { id: "brunnen_st", name: "Brunnen (Stamm)", cost: div100({ Stein: 900, Metall: 500 }), int: attrReq(100), min: 60, info: "WIKI: 50 Wasser alle 3 Stunden ins Stammlager, trocknet irgendwann aus. DESIGN: alle 18 Minuten, nach 8 Füllungen trocken." },
    { id: "farm_st", name: "Farm (Stamm)", cost: div100({ Holz: 400, Kunststoff: 2000 }), dyn: attrReq(100), kraft: attrReq(100), min: 120, info: "WIKI: 50 Nahrung alle 180 Minuten ins Stammlager. DESIGN: alle 18 Minuten (Zeit ÷10)." },
    { id: "wachturm", name: "Wachturm", cost: div100({ Holz: 10000, Metall: 80000 }), min: 120, minDesign: true, info: "WIKI: zeigt Angreifer im Stammkampf. DESIGN: Überfälle zeigen Gegner und Stärke, +10 Verteidigung. Bauzeit DESIGN." },
    { id: "feuerstelle", name: "Feuerstelle ohne Holz", cost: div100({ Holz: 50, Stein: 50 }), kraft: attrReq(75), min: 30, minDesign: true, info: "WIKI. DESIGN: hält im Stammlager wie ein Lagerfeuer Tiere fern (wichtig, solange kein Reaktor steht). Bauzeit DESIGN." },
    { id: "garage_st", name: "Garage (Stamm)", cost: div100({ Stein: 8000, Metall: 10000, Gas: 1000 }), kraft: attrReq(500), int: attrReq(300), job: "Mechaniker", min: 240, info: "WIKI: Kraft 500 + Intelligenz 300, Mechaniker. DESIGN: Überfälle mit Fahrzeugen stehlen kein Benzin aus dem Stammlager." },
    { id: "raketenbasis", name: "Raketenbasis", cost: { Metall: 300, Edelmetall: 50, Stein: 200 }, needs: ["werkstatt_st"], min: 240, minDesign: true, info: "DESIGN: Das Wiki nennt Raketenbau nur als Quelle von Bauerfahrung, ohne Kosten. Hier: Raketen bauen gibt Bauerfahrung." },
  ].forEach((g) => { if (!STAMM_GEB.some((x) => x.id === g.id)) STAMM_GEB.push(g); });
  STAMM_INFO_ONLY.length = 0; // alles aus der Info-Liste ist jetzt baubar
  const P5_ALIAS = { werkstatt: "werkstatt_st", biolabor_geb: "biolabor_st" };
  /** Privatgebäude oder gleichwertiges Stammgebäude (DESIGN: Stamm-Werkstatt/-Biolabor zählen wie die privaten). */
  function bHas(s, id) { return !!((s.buildings && s.buildings[id]) || (P5_ALIAS[id] && stammHas(s, P5_ALIAS[id]))); }
  function p5ArchFactor(s) { // DESIGN: Wiki nennt Architektur-Fähigkeiten, aber keine Wirkung
    if (hasSkill(s, "Denkmalästhetik")) return 0.7;
    if (hasSkill(s, "Erweiterte Architektur")) return 0.8;
    if (hasSkill(s, "Architektur")) return 0.9;
    return 1;
  }
  function p5BuildMin(g) { return g.min || P5_BUILD_MIN[g.id] || 120; }
  function p5BuildLeft(st) { return st && st.build ? Math.max(0, Math.ceil((st.build.until - Date.now()) / 1000)) : 0; }
  function p5ExtraLock(s, g) {
    if (!g.tank && g.job && s.job !== g.job) return "Nur " + g.job + " können das bauen (Wiki).";
    if (g.needItem && !has(s, g.needItem)) return "Wiki: " + g.needItem + " muss im Rucksack sein.";
    if (g.dyn && (s.attrs.Dynamik || 0) < g.dyn) return "Nötig: Dynamik " + g.dyn + " (Wiki ×100).";
    return "";
  }
  function p5Lock(s, g) { const l = sgLock(s, g); return l || p5ExtraLock(s, g); }
  buildStammGeb = function (id) {
    const s = state; const g = STAMM_GEB.find((x) => x.id === id);
    if (!g) return "Unbekanntes Stammgebäude.";
    const st0 = s.stamm ? stammOf(s) : null;
    if (st0 && st0.build) {
      const b = STAMM_GEB.find((x) => x.id === st0.build.id);
      return "Es wird schon gebaut: " + (b ? b.name : st0.build.id) + " (noch " + p5BuildLeft(st0) + " s). Immer nur ein Bau (DESIGN).";
    }
    const lock = p5Lock(s, g);
    if (lock === "steht") return "Das Gebäude steht schon.";
    if (lock) return lock;
    const st = stammOf(s); const cost = sgCost(g, st);
    if (!stammPay(s, cost)) return "Es fehlt: " + stammMissing(s, cost) + ".";
    const min = p5BuildMin(g);
    const ms = Math.max(1000, Math.round(wikiMinMs(min) * p5ArchFactor(s)));
    st.build = { id: g.id, start: Date.now(), until: Date.now() + ms, min };
    exert("craft");
    return "Bau begonnen: " + g.name + (g.tank ? " Stufe " + ((st.geb[g.id] || 0) + 1) : "") + ". Bauzeit " + (g.minDesign ? "DESIGN " : "Wiki ") + min + " min, hier " + Math.round(ms / 1000) + " s. Du kannst weiterspielen.";
  };
  function p5FinishBuild(force) {
    const s = state; const st = s && s.stamm ? stammOf(s) : null;
    if (!st || !st.build) return "";
    if (!force && Date.now() < st.build.until) return "";
    const g = STAMM_GEB.find((x) => x.id === st.build.id); const min = st.build.min || 120;
    st.build = null;
    if (!g) return "";
    st.geb[g.id] = (st.geb[g.id] || 0) + 1;
    let msg = g.name + (g.tank ? " Stufe " + st.geb[g.id] + ": Lager für " + g.tank + " jetzt " + tankCap(s, g.tank) + "." : " fertig gebaut.");
    if (g.setRL && st.rl < g.setRL) { st.rl = g.setRL; st.rp = 0; msg += " Researchlevel " + st.rl + " (Wiki)."; }
    const be = Math.max(1, Math.round(min / 10)); // DESIGN: Wiki "BE beim Bau von Stammgebäuden", Menge erfunden
    s.bep = (s.bep || 0) + be; msg += " Bauerfahrung +" + be + ".";
    gain(s, 3, 2);
    p5Radio(msg);
    return msg;
  }
  function p5BuildRow(s, st) {
    if (!st.build) return "";
    const g = STAMM_GEB.find((x) => x.id === st.build.id);
    const tot = Math.max(1, st.build.until - st.build.start);
    const pct = Math.min(100, Math.round(((Date.now() - st.build.start) / tot) * 100));
    return '<div class="work-row"><p>Im Bau: <b>' + origEsc(g ? g.name : st.build.id) + "</b> · " + pct + "% · noch " + p5BuildLeft(st) + " s</p><div class=\"work-bar\"><i style=\"width:" + pct + '%"></i></div></div>';
  }

  // ---------- Umwandlungen: Uran-Kette, Glasschmelze, Raffinerie Stufe 2 ----------
  Object.assign(CONVERSIONS, {
    erdoel2: { geb: "erdoelraffinerie2", label: "Erdöl gewinnen (Stufe 2)", cost: { Holz: 400, Kunststoff: 1200 }, out: { Öl: 120 }, note: "WIKI Stufe 2" },
    erdgas2: { geb: "erdgasraffinerie2", label: "Erdgas gewinnen (Stufe 2)", cost: { Holz: 400, Kunststoff: 1200 }, out: { Gas: 30 }, note: "WIKI Stufe 2" },
    yellowcake: { geb: "uranerz", label: "Yellow Cake herstellen", cost: { Natururan: 5 }, out: { YellowCake: 1 }, job: "Forscher", note: "WIKI: Forscher, Uranerzaufbereitung; Menge DESIGN" },
    uranhex: { geb: "konversion", label: "Uranhexafluorid herstellen", cost: { YellowCake: 2, Gas: 1 }, out: { Uranhexfluorid: 1 }, job: "Forscher", note: "WIKI: Konversionsanlage; Menge DESIGN" },
    uranoxid: { geb: "anreicherung", label: "Uranoxid anreichern", cost: { Uranhexfluorid: 2 }, out: { Uranoxid: 1 }, job: "Forscher", note: "WIKI: Anreicherungsanlage; Menge DESIGN" },
    glas: { geb: "glasschmelze", label: "Glas schmelzen", cost: { Uranhexfluorid: 1, Sand: 50 }, out: { Glas: 1 }, job: "Glasschmelzer", note: "WIKI: je Glas 1 Uranhexfluorid + 50 Sand" },
    kanister: { geb: "benzincracker", label: "Benzinkanister füllen", cost: { Öl: 10, "leerer Benzinkanister": 1 }, out: { Benzinkanister: 1 }, job: "Ölwerker", note: "WIKI: nur der Ölwerker füllt ihn im Benzincracker; Menge DESIGN" },
  });
  // Die alten Forscher-Rezepte der Uran-Kette (DESIGN, ohne Gebäude) entfallen: jetzt nur in den Stammgebäuden (WIKI).
  for (let i = CRAFTS.length - 1; i >= 0; i--) if (["yellowcake", "uranhex", "uranoxid"].includes(CRAFTS[i].id)) CRAFTS.splice(i, 1);

  // ---------- 2. Wirkung der Erfindungen und Werkzeuge ----------
  // Händler verkaufen Werkzeuge, die im Original andere Spieler herstellen (DESIGN-Preise, Einzelspieler-Ersatz).
  [["Fernglas", 120], ["Mobiler Tiefenbohrer", 250], ["Erzdetektor", 200], ["Urandetektor", 300], ["Mikroskop", 250], ["Diamantendetektor", 600], ["Mineralbohrer", 500], ["Schere", 40]].forEach(([item, buy]) => {
    if (!TRADE.some((t) => t.item === item)) TRADE.push({ item, buy, sell: Math.round(buy / 3), where: ["haendler", "haendler2"] });
  });
  const p5EnergyPill = TRADE.find((t) => t.item === "Mutanten Energie Pillen");
  if (!TRADE.some((t) => t.item === "Mutanten Spezial Pillen")) TRADE.push(Object.assign({}, p5EnergyPill || {}, { item: "Mutanten Spezial Pillen", buy: 100, sell: 0, payItem: "Kristall" })); // WIKI: 100 Kristall
  function p5Wrap(aid, pre, post) {
    const d = ACTIONS[aid]; if (!d) return;
    const orig = d.run;
    d.run = function (s, loc) {
      if (pre) { const e = pre(s, loc); if (e) return { ok: false, msg: e }; }
      const r = orig.call(this, s, loc);
      return post && r && r.ok ? (post(s, loc, r) || r) : r;
    };
  }
  // Vorkommen je Land (DESIGN 30–100%, fest je Land). Detektoren zeigen sie an (WIKI: "zeigt Vorkommen auf Ländern").
  function p5Deposit(key, res) { let h = 7; const t = key + "|" + res; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return 30 + (h % 71); }
  function p5DepKey(s, loc) { return landKey(s, loc || locById(s.locId)); }
  const P5_DETECT = [["Erz", "Erzdetektor", "erz"], ["Natururan", "Urandetektor", "uran"], ["Diamanten", "Diamantendetektor", "diamanten"]];
  function p5Scale(s, item, before, dep) { const got = (s.inv[item] || 0) - before; if (got <= 0) return 0; const want = Math.max(1, Math.round(got * (0.5 + dep / 100))); s.inv[item] = before + want; return want; }
  // Erzsammler: WIKI "braucht immer eine Spitzhacke"; Erzmenge nach Vorkommen (DESIGN)
  (function () {
    const d = ACTIONS.erz; if (!d) return; const orig = d.run;
    d.run = function (s, loc) {
      const edel = !has(s, "Spitzhacke") && has(s, "Edelmetall Spitzhacke") && !p5ReqMissing(s, "Edelmetall Spitzhacke");
      if (!has(s, "Spitzhacke") && !edel) return { ok: false, msg: "Wiki: Der Erzsammler braucht immer eine Spitzhacke (Werkzeugmacher oder Händler)." };
      if (edel) s.inv.Spitzhacke = 1;
      const b = s.inv.Erz || 0;
      const r = orig.call(this, s, loc);
      if (edel) delete s.inv.Spitzhacke;
      if (r && r.ok) {
        const dep = p5Deposit(p5DepKey(s, loc), "Erz"); const n = p5Scale(s, "Erz", b, dep);
        if (n) r.msg += " Vorkommen " + (has(s, "Erzdetektor") ? dep + "% (Erzdetektor)" : "unbekannt") + ": " + n + " Erz.";
      }
      return r;
    };
  })();
  p5Wrap("uran", null, (s, loc, r) => {
    const dep = p5Deposit(p5DepKey(s, loc), "Natururan");
    if (has(s, "Urandetektor")) r.msg += " Uranvorkommen hier " + dep + "% (Urandetektor, Wiki).";
    return r;
  });
  ["oel", "gas"].forEach((aid) => p5Wrap(aid, (s) => (has(s, "Mobiler Tiefenbohrer") ? "" : "Wiki: Öl- und Gaswerker brauchen immer einen Mobilen Tiefenbohrer im Rucksack (Erfinder oder Händler).")));
  p5Wrap("spy", (s) => (has(s, "Fernglas") ? "" : "Wiki: Der Spion braucht immer ein Fernglas (Erfinder oder Händler)."), (s, loc, r) => {
    s.sep = (s.sep || 0) + 1; r.msg += " Spionageerfahrung +1 (Wiki).";
    if (hasSkill(s, "Spionage") && /nichts/.test(r.msg) && Math.random() < 0.25) { addInv(s, "Kronkorken", 2); r.msg += " Mit Spionage entdeckst du doch noch 2 Kronkorken (DESIGN)."; }
    return r;
  });
  p5Wrap("bio_forschen", (s) => (has(s, "Mikroskop") ? "" : "Wiki: Der Biologe braucht ein Mikroskop."));
  ACTIONS.diamanten.run = function (s, loc) {
    if (!has(s, "Diamantendetektor")) return { ok: false, msg: "Wiki: Der Diamantsucher braucht einen Diamantendetektor im Rucksack." };
    const drill = has(s, "Diamantbohrer") ? "Diamantbohrer" : has(s, "Mineralbohrer") ? "Mineralbohrer" : null;
    if (!drill) return { ok: false, msg: "Wiki: Dazu brauchst du einen Mineral- oder Diamantbohrer." };
    const dep = p5Deposit(p5DepKey(s, loc), "Diamanten");
    const rolls = drill === "Diamantbohrer" ? 2 : 1; // DESIGN
    const got = []; let white = 0;
    for (let i = 0; i < rolls; i++) {
      const c = weighted([{ item: "Diamant (weiß)", w: 55 }, { item: "Diamant (blau)", w: 20 }, { item: "Diamant (grün)", w: 15 }, { item: "Diamant (rot)", w: 10 }]).item; // DESIGN
      const n = Math.max(1, Math.round(rand(1, 2) * (0.5 + dep / 100)));
      addInv(s, c, n); got.push(n + "× " + c); if (c === "Diamant (weiß)") white += n;
    }
    s.dep = (s.dep || 0) + white; // WIKI: 1 Diamantenerfahrung je weißem Diamant
    gain(s, 3, 2);
    return { ok: true, msg: "Fund mit " + drill + ": " + got.join(", ") + ". Vorkommen " + dep + "% (Diamantendetektor)." + (white ? " Diamantenerfahrung +" + white + "." : "") };
  };
  const p5LandRows0 = landStockRows;
  landStockRows = function (loc) {
    let h = p5LandRows0(loc);
    if (!loc || !state) return h;
    const key = landKey(state, loc);
    P5_DETECT.forEach(([res, det, aid]) => {
      if (has(state, det) && (loc.actions || []).includes(aid)) h += "<tr><td>" + res + "vorkommen:</td><td>" + p5Deposit(key, res) + "% (" + det + ") " + xLink("beste Fundorte", "detect|" + aid) + "</td></tr>";
    });
    return h;
  };
  function p5Detect(aid) {
    const s = state; const d = P5_DETECT.find((x) => x[2] === aid);
    if (!d) return "Unbekannt.";
    if (!has(s, d[1])) return "Wiki: Dazu brauchst du einen " + d[1] + " im Rucksack.";
    const list = LOCATIONS.filter((l) => (l.actions || []).includes(aid)).map((l) => [l, p5Deposit(landKey(s, l), d[0])]).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (!list.length) return "Der " + d[1] + " findet kein Vorkommen.";
    return d[1] + ": beste " + d[0] + "vorkommen — " + list.map(([l, v]) => l.name + " (" + l.x + "/" + l.y + ") " + v + "%").join(", ") + ".";
  }
  // Graben: Schaufel/Spitzhacke Einweg (WIKI: höchstens 2 Einsätze), Edelmetall-Werkzeuge Mehrweg (WIKI)
  const P5_WEAR_MAX = 2;
  function p5Wear(s, item, r) {
    if (!s.wear) s.wear = {};
    s.wear[item] = (s.wear[item] || 0) + 1;
    if (s.wear[item] >= P5_WEAR_MAX) { takeInv(s, item, 1); s.wear[item] = 0; r.msg += " " + item + " ist verbraucht (Wiki: höchstens 2 Einsätze)."; }
    else r.msg += " (" + item + ": Einsatz " + s.wear[item] + " von " + P5_WEAR_MAX + ")";
  }
  const p5DigTool0 = digTool;
  digTool = function (s) {
    const t = p5DigTool0(s); if (t) return t;
    return has(s, "Edelmetall Schaufel") && !p5ReqMissing(s, "Edelmetall Schaufel") ? "Edelmetall Schaufel" : null;
  };
  const p5DigRun0 = digRun;
  digRun = function (s) {
    const hard = groundAt(typeof s.px === "number" ? s.px : 0, typeof s.py === "number" ? s.py : 0) === "hart";
    const edel = hard && !has(s, "Spitzhacke") && has(s, "Edelmetall Spitzhacke") && !p5ReqMissing(s, "Edelmetall Spitzhacke");
    if (edel) s.inv.Spitzhacke = 1;
    const tool = digTool(s);
    const r = p5DigRun0(s);
    if (edel) delete s.inv.Spitzhacke;
    if (r && r.ok) {
      if (tool === "Schaufel") p5Wear(s, "Schaufel", r);
      if (hard && !edel && tool !== "Greifer" && has(s, "Spitzhacke")) p5Wear(s, "Spitzhacke", r);
    }
    return r;
  };
  // Scheinwerfer: WIKI linke Hand, Waffe rechts, hohe Verteidigung, hält mutierte Tiere fern
  function p5Light(s) { return !!(s && s.equip && s.equip.links === "Scheinwerfer" && has(s, "Scheinwerfer") && s.equip.rechts && has(s, s.equip.rechts)); }
  const p5Def0 = defenseFactor;
  defenseFactor = function (s) { return p5Def0(s) * (p5Light(s) ? 0.8 : 1); }; // DESIGN: −20% Treffer
  const p5StartFight0 = startFight;
  startFight = function (enemyId, reason, tag) {
    const ambush = reason === "Zufallsbegegnung" || reason === "Überfall im Schlaf";
    if (ambush && enemyId === "wild_dog" && state && !fight && p5Light(state)) {
      const t = "Scheinwerfer: Der Wilde Hund scheut das Licht und zieht ab (Wiki: hält mutierte Tiere fern).";
      log(t, "good"); showResult(t); renderAll(); return;
    }
    return p5StartFight0(enemyId, reason, tag);
  };
  // EMP Vehicle Destructor: WIKI "zerstört mit Glück bei einem Sieg gegnerische Fahrzeuge; kann überladen, kaputtgehen und verletzen"
  const P5_EMP_HIT = 0.4, P5_EMP_OVERLOAD = 0.15; // DESIGN
  const P5_VEH_FOES = ["Marodeur", "Rivalen-Späher"]; // DESIGN: Gegner mit Fahrzeug
  const p5EndFight0 = endFight;
  endFight = function (won) {
    const f = fight;
    const r = p5EndFight0(won);
    const s = state;
    if (f && s && s.equip && s.equip.rechts === "EMP Vehicle Destructor" && has(s, "EMP Vehicle Destructor") && !p5ReqMissing(s, "EMP Vehicle Destructor") && !f.p5emp) {
      f.p5emp = true;
      if (won && P5_VEH_FOES.includes(f.enemy.name) && Math.random() < P5_EMP_HIT) {
        addInv(s, "Metall", 20); addInv(s, "Edelmetall", 3);
        log("EMP Vehicle Destructor: Das Fahrzeug von " + f.enemy.name + " ist zerstört (Wiki). Schrott: 20 Metall, 3 Edelmetall (DESIGN).", "good");
      }
      if (Math.random() < P5_EMP_OVERLOAD) {
        takeInv(s, "EMP Vehicle Destructor", 1); s.injuredUntil = Date.now() + INJURY_MS;
        log("Der EMP Vehicle Destructor überlädt, geht kaputt und verletzt dich (Wiki).", "bad");
      }
    }
    return r;
  };
  // Schneider: WIKI "braucht immer eine Schere". Stamm-Werkstatt/-Biolabor zählen wie die privaten (bHas).
  function p5CraftItem(c) { return c.needItem || (c.needJob === "Schneider" ? "Schere" : null); }
  const p5CanCraft0 = canCraft;
  canCraft = function (c) { if (!p5CanCraft0(c)) return false; const it = p5CraftItem(c); return !it || has(state, it); };
  const p5CraftLock0 = craftLockReason;
  craftLockReason = function (c) {
    const r = p5CraftLock0(c); const it = p5CraftItem(c);
    if (!it || has(state, it)) return r;
    return r ? r.replace(/\.$/, ", " + it + " (Wiki).") : "Nötig: " + it + " (Wiki).";
  };
  // Neue Rezepte (WIKI-Kosten aus wiki-items-full.js)
  [
    { id: "steinspeer", label: "Steinspeer", desc: "WIKI-Kosten, Wiki-Stärke 32.", cost: { Holz: 100, Stein: 25, Wasser: 1, Nahrung: 1 }, result: { Steinspeer: 1 }, minTL: 1, needJob: "Waffentechniker", payLager: true },
    { id: "metallspeer", label: "Metallspeer", desc: "WIKI-Kosten, Wiki-Stärke 39.", cost: { Metall: 250, Wasser: 1, Nahrung: 1 }, result: { Metallspeer: 1 }, minTL: 1, needJob: "Waffentechniker", payLager: true },
    { id: "pfeil_bogen", label: "Pfeil und Bogen", desc: "WIKI-Kosten, Wiki-Stärke 50, braucht Pfeile. TL DESIGN.", cost: { Holz: 100, Stein: 50, Metall: 250, Wasser: 1, Nahrung: 1 }, result: { "Pfeil und Bogen": 1 }, minTL: 1, needJob: "Waffentechniker", payLager: true },
    { id: "steinkatapult", label: "Steinkatapult", desc: "WIKI-Kosten, Benutzen 200 Kraft (÷100 = 2), braucht Steinkugeln. TL DESIGN.", cost: { Holz: 2000, Metall: 500, Wasser: 2, Nahrung: 2 }, result: { Steinkatapult: 1 }, minTL: 2, needJob: "Waffentechniker", payLager: true },
    { id: "metallkatapult", label: "Metallkatapult", desc: "WIKI-Kosten, Benutzen 200 Kraft, braucht Metallkugeln. TL DESIGN.", cost: { Holz: 2000, Metall: 2000, Wasser: 2, Nahrung: 2 }, result: { Metallkatapult: 1 }, minTL: 3, needJob: "Waffentechniker", payLager: true },
    { id: "edel_schaufel", label: "Edelmetall Schaufel", desc: "WIKI: Mehrweg, Benutzen 150 EP (÷5 = 30).", cost: { Holz: 10, Metall: 70, Edelmetall: 30 }, result: { "Edelmetall Schaufel": 1 }, minTL: 3, needJob: "Werkzeugmacher", payLager: true },
    { id: "edel_spitzhacke", label: "Edelmetall Spitzhacke", desc: "WIKI: Mehrweg, Benutzen 300 EP (÷5 = 60).", cost: { Holz: 10, Metall: 70, Edelmetall: 30 }, result: { "Edelmetall Spitzhacke": 1 }, minTL: 3, needJob: "Werkzeugmacher", payLager: true },
    { id: "mech_werkzeuge", label: "Mechaniker Werkzeuge", desc: "WIKI-Kosten. DESIGN: Mechaniker repariert damit beim Pimpen 10% günstiger.", cost: { Edelmetall: 70, Metall: 400 }, result: { "Mechaniker Werkzeuge": 1 }, minTL: 3, needJob: "Werkzeugmacher", payLager: true },
    { id: "benzinkanister_leer", label: "leerer Benzinkanister", desc: "WIKI-Kosten (Benzinkanister, Werkzeugmacher TL4). Füllen: Ölwerker im Benzincracker (Wiki).", cost: { Metall: 150, Edelmetall: 75 }, result: { "leerer Benzinkanister": 1 }, minTL: 4, needJob: "Werkzeugmacher", payLager: true },
  ].forEach((c) => { if (!CRAFTS.some((x) => x.id === c.id)) CRAFTS.push(c); });

  // Verbrauchbare Gegenstände (Benutzen im Rucksack)
  Object.assign(POTIONS, {
    "Mutanten Spezial Pillen": { special: true, desc: "Kraft und Geschwindigkeit +5 (Wiki), nur Mutanten" },
    "Mutanten XTC": { special: true, desc: "nur Mutanten. DESIGN: Energie +50%, Müdigkeit −30%, Strahlung +10%" },
    "M4 Virus": { special: true, desc: "Mutation (Wiki). DESIGN: +1 auf eine zufällige Eigenschaft, Strahlung +30%" },
    Sprengfalle: { special: true, desc: "im Stammlager aufstellen: stoppt einen Überfall (Wiki: Einweg-Falle)" },
    Stolperfalle: { special: true, desc: "nur Spione (Wiki): fängt den Späher vor einem Überfall" },
    "EMP Streuer": { special: true, desc: "zünden: 60 Minuten verlieren Überfälle ihren Fahrzeug-Bonus (DESIGN)" },
    Benzinkanister: { special: true, desc: "umfüllen: +10 Benzin, der leere Kanister bleibt (DESIGN)" },
    Radio: { special: true, desc: "Funkmeldungen lesen (Wiki: speichert bis zu 30 Nachrichten)" },
  });
  const P5_SPECIAL_MS = 10 * 60000; // DESIGN: Dauer der Spezial Pillen
  function useP5Item(name) {
    const s = state; const st = s.stamm ? stammOf(s) : null;
    if ((name === "Mutanten Spezial Pillen" || name === "Mutanten XTC") && s.race !== "Mutant") return "Wiki: Nur Mutanten können das nehmen.";
    if (name === "Mutanten Spezial Pillen") {
      takeInv(s, name, 1); if (!s.boosts) s.boosts = [];
      ["Kraft", "Geschwindigkeit"].forEach((a) => { s.attrs[a] = (s.attrs[a] || 0) + 1; s.boosts.push({ attr: a, n: 1, until: Date.now() + P5_SPECIAL_MS, name: "Mutanten Spezial Pillen" }); });
      return "Mutanten Spezial Pillen: Kraft +1, Geschwindigkeit +1 für 10 Minuten (Wiki +5, Skala und Dauer DESIGN).";
    }
    if (name === "Mutanten XTC") {
      takeInv(s, name, 1);
      s.energy = Math.min(200, curEnergy(s) + 50); s.fatigue = Math.max(0, (s.fatigue || 0) - 30); s.radiation = Math.min(100, (s.radiation || 0) + 10);
      return "Mutanten XTC: Energie " + s.energy + "%, Müdigkeit " + s.fatigue + "%, Strahlung " + s.radiation + "% (DESIGN).";
    }
    if (name === "M4 Virus") {
      takeInv(s, name, 1);
      const a = ["Kraft", "Intelligenz", "Geschwindigkeit", "Ausdauer", "Wahrnehmung", "Ausstrahlung", "Dynamik"][rand(0, 6)];
      s.attrs[a] = (s.attrs[a] || 0) + 1; s.radiation = Math.min(100, (s.radiation || 0) + 30);
      return "M4 Virus: Mutation! " + a + " +1, Strahlung " + s.radiation + "% (Wiki: Mutation; Wirkung DESIGN).";
    }
    if (name === "Sprengfalle" || name === "Stolperfalle") {
      if (!st) return "Wiki: Fallen stellst du im Stammlager auf. Du bist in keinem Stamm.";
      if (name === "Stolperfalle" && s.job !== "Spion") return "Wiki: Die Stolperfalle ist nur für Spione geeignet.";
      if (s.locId !== "camp") return "Wiki: Fallen stellst du im Stammlager (Ruinencamp) auf.";
      takeInv(s, name, 1); if (!st.traps) st.traps = { spreng: 0, stolper: 0 };
      st.traps[name === "Sprengfalle" ? "spreng" : "stolper"] += 1;
      return name + " im Stammlager aufgestellt. Sie wirkt beim nächsten Überfall (Wiki: Einweg).";
    }
    if (name === "EMP Streuer") {
      if (!st) return "Wiki: Der EMP Streuer schützt ein Stammlager. Du bist in keinem Stamm.";
      takeInv(s, name, 1); st.empUntil = Date.now() + 60 * 60000;
      return "EMP Streuer gezündet: 60 Minuten lang bleiben die Fahrzeuge der Angreifer liegen (DESIGN).";
    }
    if (name === "Benzinkanister") {
      takeInv(s, name, 1); addInv(s, "Benzin", 10); addInv(s, "leerer Benzinkanister", 1);
      return "Benzinkanister umgefüllt: +10 Benzin (DESIGN). Der leere Kanister bleibt.";
    }
    if (name === "Radio") return p5RadioText(5);
    return null;
  }
  const p5P4Potion0 = useP4Potion;
  useP4Potion = function (name) { const r = useP5Item(name); return r != null ? r : p5P4Potion0(name); };
  // Radio: WIKI "speichert bis zu 30 Nachrichten"
  function p5Radio(msg) { const s = state; if (!s) return; if (!s.radio) s.radio = []; s.radio.unshift({ t: Date.now(), m: msg }); if (s.radio.length > 30) s.radio.length = 30; }
  function p5RadioText(n) {
    const s = state; const list = (s.radio || []).slice(0, n || 30);
    if (!list.length) return "Radio: keine Funkmeldungen.";
    return "Radio (" + (s.radio || []).length + "/30): " + list.map((x) => new Date(x.t).toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" }) + " " + x.m).join(" | ");
  }

  // Mechaniker Werkzeuge: DESIGN-Wirkung beim Pimpen (Wiki nennt nur "Diverse Werkzeuge")
  const p5Pimp0 = pimpUp;
  pimpUp = function (kind) {
    const s = state; let cost = null, before = null;
    if (has(s, "Mechaniker Werkzeuge") && PIMP[kind] && !pimpCheck(s)) { const p = pimpOf(s, s.activeVehicle); before = p[kind]; cost = PIMP[kind].cost(before + 1); }
    const r = p5Pimp0(kind);
    if (cost && pimpOf(s, s.activeVehicle)[kind] > before) {
      Object.keys(cost).forEach((k) => { const n = Math.floor(cost[k] / 10); if (n) addInv(s, k, n); });
      return r + " Mechaniker Werkzeuge: 10% zurück (DESIGN).";
    }
    return r;
  };
  [["Spitzhacke", 40], ["Schaufel", 30]].forEach(([item, buy]) => { if (!TRADE.some((t) => t.item === item)) TRADE.push({ item, buy, sell: Math.round(buy / 3), where: ["haendler", "haendler2"] }); });

  // ---------- 5. Reaktor: "ab dem ersten Reaktor kein Lagerfeuer mehr nötig" (WIKI) ----------
  // DESIGN: Ohne Reaktor und ohne Feuer ist das Stammlager nachts nicht ganz sicher (5%). Mit Reaktor: sicher, besserer Schlaf,
  // und sicherer Schlaf draußen im Stammland (bis 3 Felder ums Ruinencamp).
  const P5_STAMM_RISK = 0.05, P5_REACTOR_MULT = 1.4, P5_STAMMLAND = 3;
  function p5Reactor(s) { const st = s && s.stamm ? stammOf(s) : null; return !!(st && ALL_REACTORS.some((r) => st.geb[r])); }
  function p5InStammland(s) { const here = locById(s.locId); const camp = locById("camp"); return !!(here && camp && manhattan(here, camp) <= P5_STAMMLAND); }
  const p5Sleep0 = sleepSpot;
  sleepSpot = function (s) {
    const sp = p5Sleep0(s);
    const reactor = p5Reactor(s);
    if (sp.id === "stamm") {
      if (reactor) return Object.assign(sp, { name: "Stammlager (Reaktor: Licht und Strom, kein Feuer nötig)", mult: P5_REACTOR_MULT, risk: 0, reactor: true });
      const st = stammOf(s);
      const fire = !!((s.buildings && s.buildings.lagerfeuer) || st.geb.feuerstelle);
      if (fire) return Object.assign(sp, { name: "Stammlager, am Feuer", fire: true });
      const night = viennaHour() < 6 || viennaHour() >= 20;
      if (night && (s.ep || 0) >= 30 && wornBelt(s) !== "Gürtel der Tiere" && !p5Light(s)) return Object.assign(sp, { name: "Stammlager (ohne Feuer und Reaktor)", risk: P5_STAMM_RISK, night: true });
      return sp;
    }
    if (sp.id === "draussen" && reactor && p5InStammland(s)) return Object.assign(sp, { name: "Stammland (der Reaktor hält Tiere fern)", risk: 0, mult: 0.9, reactor: true });
    if (sp.id === "draussen" && sp.risk > 0 && p5Light(s)) return Object.assign(sp, { name: sp.name + ", Scheinwerfer an", risk: 0 });
    return sp;
  };

  // ---------- Überfälle der Rivalen auf das Stammlager (DESIGN-Ersatz für Stammkämpfe; nutzt Wälle, Wachturm, EMP, Fallen, Löschvorrichtung) ----------
  const P5_RAID_EVERY = 30 * 60000, P5_RAID_CHANCE = 0.3, P5_RAID_LOOT = 0.2, P5_FIRE = 0.3; // DESIGN
  function p5Raid(s, st) {
    const now = Date.now();
    if (!st.traps) st.traps = { spreng: 0, stolper: 0 };
    if (st.traps.stolper > 0) {
      st.traps.stolper -= 1; s.sep = (s.sep || 0) + 5;
      return { won: true, text: "Überfall abgewendet: Ein Späher der Rivalen tritt in deine Stolperfalle (Wiki: Falle für Spione). Spionageerfahrung +5." };
    }
    if (st.traps.spreng > 0) { st.traps.spreng -= 1; return { won: true, text: "Überfall auf das Stammlager: Die Sprengfalle zündet, die Angreifer fliehen (Wiki: Einweg-Falle)." }; }
    const race = Math.random() < 0.5 ? "Menschen" : "Mutanten";
    const base = 20 + 4 * (st.rl || 0) + rand(0, 20);
    let veh = Math.random() < 0.5 ? Math.round(base * 0.3) : 0;
    const notes = [];
    if (veh) {
      if (stammHas(s, "empturm")) { veh = 0; notes.push("EMP-Turm legt die Fahrzeuge lahm (Wiki)"); }
      else if ((st.empUntil || 0) > now) { veh = 0; notes.push("EMP Streuer wirkt"); }
      else if ((st.sabotUntil || 0) > now) { veh = 0; notes.push("Fahrzeuge sabotiert"); }
      else if (has(s, "EMP Verteidiger")) { veh = Math.round(veh / 2); notes.push("EMP Verteidiger halbiert den Fahrzeug-Bonus"); }
    }
    const atk = base + veh;
    const home = s.locId === "camp";
    let def = 0;
    if (home) { def += playerKP(s); if (hasSkill(s, "Nahkampf") && Math.random() < 0.25) { def += playerKP(s); notes.push("Nahkampf: gute Position, KP doppelt (Wiki)"); } }
    if (race === "Menschen" ? st.wallMensch : st.wallMutant) { def += 25; notes.push((race === "Menschen" ? "Menschenwall" : "Mutantenwall") + " hält"); }
    def += 5 * ((st.members || []).length);
    if (st.geb.wachturm) def += 10;
    if (st.geb.radiostation && has(s, "Radio")) { def += 10; notes.push("Hilferuf über die Radiostation"); }
    if (hasSkill(s, "Stammkampftaktik") && Math.random() < 0.25) { def += 10; notes.push("Stammkampftaktik (Wiki +1000 KP, Skala 1/100)"); }
    const who = st.geb.wachturm ? race + ", Stärke " + atk + (veh ? " (davon Fahrzeuge " + veh + ")" : "") + " gegen deine Verteidigung " + def : "unbekannte Angreifer";
    let text = "Überfall auf das Stammlager: " + who + ". ";
    if (notes.length) text += notes.join(", ") + ". ";
    if (def >= atk) { s.kep = (s.kep || 0) + 2; return { won: true, text: text + "Abgewehrt! Kampferfahrung +2." }; }
    const store = st.storage || {};
    const keys = Object.keys(store).filter((k) => store[k] > 0).sort((a, b) => store[b] - store[a]);
    const bits = [];
    if (keys.length) { const k = keys[0]; const n = Math.max(1, Math.floor(store[k] * P5_RAID_LOOT)); store[k] -= n; bits.push(n + " " + k + " geraubt"); }
    if (veh && !st.geb.garage_st && store.Benzin > 0) { const n = Math.min(store.Benzin, 5); store.Benzin -= n; bits.push(n + " Benzin abgezapft (keine Garage)"); }
    if (Math.random() < P5_FIRE) {
      if (st.geb.loeschvorrichtung) bits.push("ein Brand wird von der Löschvorrichtung gelöscht (Wiki)");
      else if (keys[1]) { const k = keys[1]; const n = Math.max(1, Math.floor(store[k] * 0.1)); store[k] -= n; bits.push("Feuer im Lager: " + n + " " + k + " verbrannt"); }
    }
    return { won: false, text: text + "Nicht abgewehrt: " + (bits.join(", ") || "das Lager war leer") + "." };
  }
  function p5RaidTick(s, st) {
    const now = Date.now();
    if (!st.raidAt) { st.raidAt = now + P5_RAID_EVERY; return false; }
    if (now < st.raidAt) return false;
    st.raidAt = now + P5_RAID_EVERY;
    if (Math.random() >= P5_RAID_CHANCE) return false;
    const r = p5Raid(s, st);
    log(r.text, r.won ? "good" : "bad"); showResult(r.text, !r.won); p5Radio(r.text);
    st.raids = (st.raids || 0) + 1;
    return true;
  }
  // Stamm-Brunnen und -Farm (WIKI 50 je 3 h; DESIGN Zeit ÷10)
  const P5_PROD_MS = 18 * 60000, P5_WELL_FILLS = 8;
  function p5Production(s, st) {
    const now = Date.now(); let ch = false;
    if (!st.prod) st.prod = {};
    [["farm_st", "Nahrung"], ["brunnen_st", "Wasser"]].forEach(([id, res]) => {
      if (!st.geb[id]) return;
      if (!st.prod[id]) { st.prod[id] = now; return; }
      let n = Math.floor((now - st.prod[id]) / P5_PROD_MS);
      if (n <= 0) return;
      st.prod[id] += n * P5_PROD_MS;
      if (id === "brunnen_st") n = Math.min(n, P5_WELL_FILLS - (st.prod.fills || 0));
      const add = stammAdd(st, res, 50 * n);
      const t = (id === "farm_st" ? "Farm" : "Brunnen") + ": +" + add + " " + res + " ins Stammlager" + (add < 50 * n ? " (Lager voll)" : "") + ".";
      log(t, "good"); p5Radio(t); ch = true;
      if (id === "brunnen_st") {
        st.prod.fills = (st.prod.fills || 0) + n;
        if (st.prod.fills >= P5_WELL_FILLS) { st.geb.brunnen_st = 0; st.prod.fills = 0; delete st.prod.brunnen_st; const d = "Der Brunnen ist ausgetrocknet (Wiki). Du kannst ihn neu bauen."; log(d, "bad"); p5Radio(d); }
      }
    });
    return ch;
  }
  // Takt: läuft im 5-Sekunden-Bedürfnis-Takt mit (auch während Arbeit), die Spielzeit läuft weiter
  function p5Tick() {
    const s = state; if (!s || s.dead || !s.stamm) return false;
    const st = stammOf(s); let ch = false;
    const m = p5FinishBuild(false);
    if (m) { log(m, "good"); showResult(m); ch = true; }
    else if (st.build && origPage === "stammgeb" && !busy) ch = true;
    if (p5Production(s, st)) ch = true;
    if (p5RaidTick(s, st)) ch = true;
    return ch;
  }
  const p5TickBoosts0 = tickBoosts;
  tickBoosts = function () { const a = p5TickBoosts0(); const b = p5Tick(); return a || b; };

  // ---------- Stamm-Biolabor (WIKI: Biolevel wie Researchlevel, Erfolg je nach Intelligenz bis 80%) ----------
  const BL_MAX = 5; // DESIGN
  function p5BioChance(s) { return Math.min(0.8, 0.2 + 0.04 * (s.attrs.Intelligenz || 0)); } // WIKI höchstens 80%, Kurve DESIGN
  ACTIONS.bio_stamm = {
    label: "Im Biolabor forschen", icon: "Bio-Serum", duration: 5000, needJob: "Biologe", needTL: 9,
    show: (s) => stammHas(s, "biolabor_st"),
    run(s) {
      const st = s.stamm ? stammOf(s) : null;
      if (!st || !st.geb.biolabor_st) return { ok: false, msg: "Erst das Biolabor im Stamm bauen (Wiki: RL15)." };
      if (!has(s, "Mikroskop")) return { ok: false, msg: "Wiki: Der Biologe braucht ein Mikroskop." };
      if (st.bl == null) { st.bl = 0; st.bp = 0; }
      gain(s, 2, 2);
      if (Math.random() >= p5BioChance(s)) return { ok: true, msg: "Biolabor: Versuch misslungen (Erfolgschance " + Math.round(p5BioChance(s) * 100) + "%, Wiki höchstens 80%)." };
      const pts = 3 + (s.attrs.Intelligenz || 0); st.bp += pts; addInv(s, "Bio-Serum", 1);
      let msg = "Biolabor: Erfolg! +" + pts + " Biopunkte (" + st.bp + " von " + rlNeed(st.bl) + "), +1 Bio-Serum.";
      while (st.bl < BL_MAX && st.bp >= rlNeed(st.bl)) { st.bp -= rlNeed(st.bl); st.bl += 1; msg += " Biolevel " + st.bl + "!"; }
      return { ok: true, msg };
    },
  };
  const P5_BIO = { // Ziele WIKI, Rezepte und Stufen DESIGN
    antivirus: { bl: 1, label: "Antivirus", cost: { "Bio-Serum": 1, Wasser: 10 }, out: "Antivirus" },
    m4: { bl: 2, label: "M4 Virus", cost: { "Bio-Serum": 3, Natururan: 1 }, out: "M4 Virus" },
    xb: { bl: 3, label: "XB-5000 Granate", cost: { "Bio-Serum": 5, Edelmetall: 20, Kristall: 10, Uranoxid: 1 }, out: "XB-5000 Granate" },
  };
  function p5BioMake(id) {
    const s = state; const st = s.stamm ? stammOf(s) : null; const r = P5_BIO[id];
    if (!r) return "Unbekannt.";
    if (!st || !st.geb.biolabor_st) return "Erst das Biolabor im Stamm bauen.";
    if (s.job !== "Biologe") return "Nur Biologen arbeiten im Biolabor (Wiki).";
    if ((st.bl || 0) < r.bl) return "Erst Biolevel " + r.bl + ".";
    if (!stammPay(s, r.cost)) return "Es fehlt: " + stammMissing(s, r.cost) + ".";
    addInv(s, r.out, 1); exert("craft"); gain(s, 2, 1);
    return r.label + " hergestellt (Biolabor, Rezept DESIGN).";
  }
  function biolaborPageHtml() {
    const s = state; const st = s.stamm ? stammOf(s) : null;
    let h = "<h2>Biolabor</h2><p class=\"muted\">Wiki: Stammgebäude ab Researchlevel 15 und 750 Intelligenz, nur Biologen. Biolevel steigen wie Researchlevel, der Erfolg hängt von der Intelligenz ab (höchstens 80%). Ziele: XB-5000-Produktion, M4 Virus (Mutation), Antivirus. Punkte, Stufen und Rezepte DESIGN.</p>";
    if (!st) return h + "<p>Du bist in keinem Stamm.</p>";
    if (!st.geb.biolabor_st) return h + "<p>Das Biolabor steht noch nicht. " + origLink("Stammgebäude", 'data-page="stammgeb"') + "</p>";
    h += "<p>Biolevel <b>" + (st.bl || 0) + "</b>/" + BL_MAX + " · Punkte " + (st.bp || 0) + "/" + rlNeed(st.bl || 0) + " · Erfolgschance " + Math.round(p5BioChance(s) * 100) + "% · Mikroskop " + (has(s, "Mikroskop") ? "ja" : "fehlt") + "</p>";
    h += "<p>" + (s.job === "Biologe" ? xLink("forschen (ein Arbeitsgang)", "biowork") : "Nur Biologen arbeiten hier.") + "</p><table>";
    Object.keys(P5_BIO).forEach((k) => { const r = P5_BIO[k]; h += "<tr><td><b>" + origEsc(r.label) + "</b> (ab Biolevel " + r.bl + ")</td><td>" + origEsc(costBits(r.cost)) + "</td><td>" + ((st.bl || 0) >= r.bl && s.job === "Biologe" ? xLink("herstellen", "bio|" + k) : '<span class="cant">gesperrt</span>') + "</td></tr>"; });
    return h + "</table>";
  }
  // ---------- Kampfarena: risikolose Testkämpfe (WIKI), 1 KEP je Training (WIKI) ----------
  function p5SimFight(enemyId, n) {
    const s = state; const e = ENEMIES[enemyId]; if (!e) return 0;
    const kp = playerKP(s); const diff = kp - e.kp;
    const yh = clamp(0.4 + diff / 80, 0.2, 0.9), fh = clamp(0.4 - diff / 80, 0.2, 0.9) * defenseFactor(s);
    const yd = 1 + Math.floor((s.attrs.Kraft || 1) / 3) + weaponDmgBonus(s), fd = 1 + Math.floor(e.kp / 12);
    let wins = 0;
    for (let i = 0; i < n; i++) {
      let you = playerMaxHP(s), foe = e.hp;
      for (let r = 0; r < e.roundsMax; r++) { if (Math.random() < yh) foe -= yd; if (foe <= 0) { wins++; break; } if (Math.random() < fh) you -= fd; if (you <= 0) break; }
    }
    return Math.round((wins / n) * 100);
  }
  const P5_ARENA_FOES = ["wild_dog", "scavenger", "raider", "rival_scout"];
  function p5Arena(enemyId) {
    const s = state;
    if (!stammHas(s, "kampfarena")) return "Erst die Kampfarena im Stamm bauen.";
    if (s.locId !== "camp") return "Die Kampfarena steht im Ruinencamp.";
    if (!ENEMIES[enemyId]) return "Unbekannter Gegner.";
    return timedJob("arena", "Testkampf in der Kampfarena", wikiMinMs(30), "stammgeb", () => {
      const pct = p5SimFight(enemyId, 300);
      s.kep = (s.kep || 0) + 1; s.fatigue = Math.min(100, (s.fatigue || 0) + 5);
      return "Kampfarena: Testkampf gegen " + ENEMIES[enemyId].name + " ohne Risiko (Wiki). Deine Siegchance im echten Kampf: etwa " + pct + "%. Kampferfahrung +1 (Wiki), Müdigkeit +5 (DESIGN).";
    });
  }
  // ---------- Raketenbasis (DESIGN; Wiki: Raketenbau gibt Bauerfahrung) ----------
  const P5_ROCKET = { Metall: 100, Edelmetall: 20, Benzin: 10 };
  function p5Rocket() {
    const s = state; const st = s.stamm ? stammOf(s) : null;
    if (!stammHas(s, "raketenbasis")) return "Erst die Raketenbasis im Stamm bauen.";
    if (s.locId !== "camp") return "Die Raketenbasis steht im Ruinencamp.";
    if (!stammPay(s, P5_ROCKET)) return "Es fehlt: " + stammMissing(s, P5_ROCKET) + ".";
    return timedJob("rakete", "Rakete bauen", wikiMinMs(60), "rakete", () => {
      st.rockets = (st.rockets || 0) + 1; s.bep = (s.bep || 0) + 20;
      return "Rakete Nr. " + st.rockets + " gebaut und gestartet. Bauerfahrung +20 (Wiki: Raketenbau gibt BE; Menge DESIGN).";
    });
  }
  function raketePageHtml() {
    const s = state; const st = s.stamm ? stammOf(s) : null;
    let h = "<h2>Raketenbasis</h2><p class=\"muted\">Wiki: Raketenbau ist eine Quelle von Bauerfahrung. Kosten und Wirkung nennt das Wiki nicht → DESIGN: " + origEsc(costBits(P5_ROCKET)) + " je Rakete, +20 Bauerfahrung.</p>";
    if (!st) return h + "<p>Du bist in keinem Stamm.</p>";
    if (!st.geb.raketenbasis) return h + "<p>Die Raketenbasis steht noch nicht (braucht die Stamm-Werkstatt). " + origLink("Stammgebäude", 'data-page="stammgeb"') + "</p>";
    return h + "<p>Gebaute Raketen: " + (st.rockets || 0) + " · Bauerfahrung " + (s.bep || 0) + "</p><p>" + xLink("Rakete bauen", "rakete") + "</p>" + p4Bar("rakete");
  }
  // ---------- Kleine Sabotage (WIKI: Fahrzeuge sabotieren, auf dem gleichen Feld; braucht auch die Fähigkeit Fahrzeuge) ----------
  function p5Sabotage() {
    const s = state; const st = s.stamm ? stammOf(s) : null;
    if (!st) return "Du bist in keinem Stamm.";
    if (s.job !== "Spion") return "Sabotieren kann nur der Spion.";
    if (!hasSkill(s, "Kleine Sabotage")) return "Wiki: Fähigkeit Kleine Sabotage nötig (500 Spionageerfahrung).";
    if (!hasSkill(s, "Fahrzeuge")) return "Wiki: Fähigkeit Fahrzeuge nötig.";
    if (s.locId !== "rival_camp") return "Wiki: Du musst auf dem gleichen Feld stehen (Rivalenlager).";
    st.sabotUntil = Date.now() + 2 * 3600000; s.sep = (s.sep || 0) + 2;
    return "Fahrzeuge der Rivalen sabotiert: 2 Stunden lang greifen sie ohne Fahrzeuge an (DESIGN). Spionageerfahrung +2.";
  }
  // ---------- Zoologie (WIKI: besondere Arten auf einem Wasserfeld suchen; Insekten-/Amphibien-/Spinnenkunde zum Fangen) ----------
  function p5ZooRun(s, loc) {
    if (!hasSkill(s, "Zoologie")) return { ok: false, msg: "Wiki: Fähigkeit Zoologie nötig (500 Tiererfahrung)." };
    if (!loc || !(loc.actions || []).includes("wasser")) return { ok: false, msg: "Wiki: Dazu musst du auf einem Wasserfeld stehen." };
    const pick = weighted([{ item: "Insekt", sk: "Insektenkunde", w: 50 }, { item: "Amphibiendrüse", sk: "Amphibienkunde", w: 30 }, { item: "Spinnenstachel", sk: "Spinnenkunde", w: 20 }]);
    s.te = (s.te || 0) + 1;
    if (!hasSkill(s, pick.sk)) return { ok: true, msg: "Du entdeckst eine besondere Art (" + pick.item + "), kannst sie aber ohne " + pick.sk + " nicht fangen (Wiki). Tiererfahrung +1." };
    const keep = Math.min(0.9, 0.4 + (s.te || 0) / 10000); // WIKI: höherer Skill → eher behalten; Zahlen DESIGN
    if (Math.random() >= keep) return { ok: true, msg: "Die besondere Art entwischt dir (Chance " + Math.round(keep * 100) + "%). Tiererfahrung +1." };
    addInv(s, pick.item, 1);
    return { ok: true, msg: "Zoologie: 1× " + pick.item + " gefangen (" + pick.sk + "). Tiererfahrung +1." };
  }
  ACTIONS.p5_zoo = { label: "Besondere Arten suchen (Zoologie)", icon: "Wasser", duration: 4000, show: (s) => hasSkill(s, "Zoologie"), run(s, loc) { return p5ZooRun(s, loc); } };
  LOCATIONS.forEach((l) => { if ((l.actions || []).includes("wasser") && !l.actions.includes("p5_zoo")) l.actions.push("p5_zoo"); });
  // ---------- Mutanten XTC (WIKI: Chemiker-Experiment mit 10 zufälligen Gegenständen) ----------
  const P5_XTC_CHANCE = 0.5; // DESIGN
  function p5Xtc() {
    const s = state;
    if (s.job !== "Chemiker") return "Das Experiment macht nur der Chemiker (Wiki).";
    const keep = new Set(Object.values(s.equip || {}).filter(Boolean));
    const erfOut = new Set(P4_ERF.map((c) => Object.keys(c.result)[0]));
    const isGear = (k) => VEHICLES[k] || NEW_VEHICLES[k] || erfOut.has(k) || TRADE.some((t) => t.item === k && t.buy >= 100) || (wikiByName(k) && wikiByName(k).slot);
    const pool = Object.keys(s.inv).filter((k) => s.inv[k] > 0 && !keep.has(k) && !LAGER_ITEMS.includes(k) && !isGear(k)); // DESIGN: Fahrzeuge, Ausrüstung und Erfindungen bleiben verschont
    const total = pool.reduce((a, k) => a + s.inv[k], 0);
    if (total < 10) return "Wiki: Für das Experiment brauchst du 10 Gegenstände im Rucksack (Rohstoffe, Ausrüstung, Fahrzeuge und Erfindungen zählen nicht, DESIGN). Du hast " + total + ".";
    const used = {};
    for (let i = 0; i < 10; i++) { const opts = pool.filter((k) => s.inv[k] > 0); const k = opts[rand(0, opts.length - 1)]; takeInv(s, k, 1); used[k] = (used[k] || 0) + 1; }
    exert("craft"); s.kreativ = (s.kreativ || 0) + 1;
    const usedTxt = Object.keys(used).map((k) => used[k] + "× " + k).join(", ");
    if (Math.random() < P5_XTC_CHANCE) { addInv(s, "Mutanten XTC", 1); return "Experiment gelungen: 1 Mutanten XTC (verbraucht: " + usedTxt + "). Verkauf bei Drogendealern (Wiki)."; }
    return "Experiment misslungen (verbraucht: " + usedTxt + "). Chance " + Math.round(P5_XTC_CHANCE * 100) + "% (DESIGN).";
  }

  // ---------- 7. Fähigkeiten und Erfahrungszähler (WIKI charakter/fahigkeiten) ----------
  // Zähler: bep (Bauerfahrung: Stammgebäude, Raketen), sep (Spionageerfahrung: Spion), dep (Diamantenerfahrung: weiße Diamanten), casino (Spiele).
  SKILLS.forEach((x) => {
    if (x[0] === "Architektur") { x[1] = "bep"; x[3] = "Bauerfahrung 400 (Wiki). Wirkung nennt das Wiki nicht; hier Stammgebäude 10% schneller (DESIGN)."; }
    if (x[0] === "Spionage") { x[1] = "sep"; x[3] = "Bessere Spionageberichte (Wiki). Hier: Ausspähen findet öfter etwas (DESIGN)."; }
  });
  [
    ["Glauben", "nv", 195, "Um das Lichtartefakt zu nutzen (Wiki): nötig für den Kelch des Lichts."],
    ["Sehen", "nv", 500, "Um das Schattenartefakt zu nutzen (Wiki): nötig für den Pokal des Verderbens."],
    ["Amphibienkunde", "te", 2000, "Amphibien tatsächlich fangen (Wiki): Zoologie-Suche am Wasser."],
    ["Spinnenkunde", "te", 3000, "Spinnen tatsächlich fangen (Wiki): Zoologie-Suche am Wasser."],
    ["Erweiterte Architektur", "bep", 800, "Bauerfahrung 800 (Wiki). Hier Stammgebäude 20% schneller (DESIGN)."],
    ["Denkmalästhetik", "bep", 1600, "Bauerfahrung 1600 (Wiki). Hier Stammgebäude 30% schneller (DESIGN)."],
    ["Diamantenverarbeitung", "dep", 1000, "Für den Beruf Artefaktjuwelier (Wiki)."],
    ["Zahlenkunde", "rep", 60, "Kein Effekt im Spiel (Wiki). Braucht auch 50 Kreativität."],
    ["Mathematik", "rep", 100, "Für den Beruf Erfinder (Wiki). Braucht auch 100 Kreativität."],
    ["Physik", "rep", 150, "Für den Beruf Erfinder (Wiki). Braucht auch 160 Kreativität."],
    ["Informatik", "rep", 230, "Kein Effekt im Spiel (Wiki). Braucht auch 260 Kreativität."],
    ["Stammkampftaktik", "kep", 1000, "Manchmal +1000 KP im Stammkampf (Wiki). Hier bei Überfällen 25%: +10 Verteidigung. Braucht auch 4000 Handelserfahrung."],
    ["Kleine Sabotage", "sep", 500, "Fahrzeuge sabotieren (Wiki). Hier: die Fahrzeuge der Rivalen im Rivalenlager."],
    ["Fernspionage", "sep", 1000, "Spionageberichte über Spieler aus der Ferne (Wiki). Ohne Mitspieler ohne Wirkung."],
    ["Große Sabotage", "sep", 2000, "Kein Effekt im Spiel (Wiki)."],
    ["Erste Anzeichen einer Casino Spielsucht", "casino", 500, "Kein Effekt im Spiel (Wiki)."],
    ["Casino Spielsucht", "casino", 1000, "Kein Effekt im Spiel (Wiki)."],
    ["Casino VIP", "casino", 1500, "Bewaffnet ins Casino (Wiki). Ohne VIP nur ohne Waffe in der rechten Hand."],
  ].forEach((x) => { if (!SKILLS.some((y) => y[0] === x[0])) SKILLS.push(x); });
  const P5_SKILL2 = { Zahlenkunde: ["kreativ", 50], Mathematik: ["kreativ", 100], Physik: ["kreativ", 160], Informatik: ["kreativ", 260], Stammkampftaktik: ["hep", 4000] }; // WIKI: zweite Schwelle
  const p5HasSkill0 = hasSkill;
  hasSkill = function (s, name) { if (!p5HasSkill0(s, name)) return false; const t = P5_SKILL2[name]; return !t || (s[t[0]] || 0) >= t[1]; };
  Object.assign(SKILL_STAT_LABEL, { bep: "Bauerfahrung", sep: "Spionageerfahrung", dep: "Diamantenerfahrung", casino: "Casino-Spiele" });
  skillTreeHtml = function () {
    const rows = SKILLS.map(([name, stat, need, eff]) => {
      const have = stat ? (state[stat] || 0) : 0; const two = P5_SKILL2[name];
      const req = SKILL_STAT_LABEL[stat] + " " + have + "/" + need + (two ? ", " + SKILL_STAT_LABEL[two[0]] + " " + (state[two[0]] || 0) + "/" + two[1] : "");
      return "<tr><td>" + (hasSkill(state, name) ? "✔ " : "") + origEsc(name) + "</td><td>" + origEsc(req) + "</td><td class=\"muted\">" + origEsc(eff) + "</td></tr>";
    }).join("");
    return "<h3>Fähigkeiten aus Erfahrung</h3><p class=\"muted\">Schwellen aus dem Wiki. Sie kommen von selbst, man lernt sie nicht. Bauerfahrung: Stammgebäude und Raketen. Spionageerfahrung: als Spion. Diamantenerfahrung: weiße Diamanten. Casino: Spiele.</p><table>" + rows + "</table>";
  };
  // Casino VIP (WIKI: erlaubt auch Bewaffneten den Eintritt)
  ["roulette", "wuerfel"].forEach((aid) => p5Wrap(aid, (s) => (s.equip && s.equip.rechts && has(s, s.equip.rechts) && !hasSkill(s, "Casino VIP") ? "Wiki: Bewaffnet kommst du nur als Casino VIP ins Casino. Lege die Waffe in der rechten Hand ab." : "")));
  // Glauben / Sehen (WIKI) für Licht- und Schattenartefakt
  p5Wrap("kelch_holen", (s) => (has(s, "Lichtartefakt") && !hasSkill(s, "Glauben") ? "Wiki: Um das Lichtartefakt zu nutzen, brauchst du die Fähigkeit Glauben (195 Naturverbundenheit)." : ""));
  p5Wrap("pokal_holen", (s) => (has(s, "Schattenartefakt") && !hasSkill(s, "Sehen") ? "Wiki: Um das Schattenartefakt zu nutzen, brauchst du die Fähigkeit Sehen (500 Naturverbundenheit)." : ""));
  // Ort der Licht-/Schattenhöhle (WIKI: nötig, um die Höhle zu finden)
  const p5Gate0 = placeGate;
  placeGate = function (loc, s) {
    const g = p5Gate0(loc, s); const ss = s || state;
    if (g.open && ss && (loc.id === "licht" || loc.id === "schatten") && !/Macht/.test(g.text)) {
      const sk = loc.id === "licht" ? "Ort der Lichthöhle" : "Ort der Schattenhöhle";
      if (!hasSkill(ss, sk)) return { open: false, text: "noch gesperrt · Fähigkeit " + sk + " fehlt (Wiki)", min: g.min };
    }
    return g;
  };
  // Berufs-Voraussetzungen (WIKI berufe) und Umschulungszeit (WIKI 90 min, Flexibilität 60, Perfektion 30)
  const P5_JOBREQ = {
    Spion: { skills: ["Rhetorik", "Taktik"], attrs: { Geschwindigkeit: 600 } },
    Uransammler: { items: ["Urandetektor"], skills: ["Ortskunde", "Verbergen"] },
    Pilzsammler: { skills: ["Ortskunde", "Heilkunde"], build: ["pilzhaus"] },
    Gärtner: { build: ["kraeutergarten"] },
    Erfinder: { attrs: { Intelligenz: 600 }, skills: ["Mathematik", "Physik"], build: ["ideenschmiede"] },
    Mechaniker: { attrs: { Intelligenz: 300 }, build: ["werkstatt"] },
    Schneider: { attrs: { Intelligenz: 300, Geschwindigkeit: 100 }, build: ["schneiderei"] },
    Psioniker: { attrs: { Wahrnehmung: 500 }, build: ["psi_tempel"] },
    Artefaktjuwelier: { skills: ["Diamantenverarbeitung"], attrs: { Ausstrahlung: 2000 }, build: ["artefaktschmiede"] },
    Diamantsucher: { attrs: { Ausstrahlung: 1000 } },
    Tierfänger: { skills: ["Taktik", "Verbergen"] },
    Erzsammler: { items: ["Erzdetektor"] },
    Biologe: { items: ["Mikroskop"], attrs: { Intelligenz: 1000 } },
  };
  function p5JobMissing(s, job) {
    const r = P5_JOBREQ[job]; if (!r) return "";
    const m = [];
    (r.skills || []).forEach((k) => { if (!hasSkill(s, k)) m.push("Fähigkeit " + k); });
    Object.keys(r.attrs || {}).forEach((k) => { const n = attrReq(r.attrs[k]); if ((s.attrs[k] || 0) < n) m.push(n + " " + k); });
    (r.items || []).forEach((k) => { if (!has(s, k)) m.push(k + " im Rucksack"); });
    (r.build || []).forEach((k) => { if (!bHas(s, k)) { const b = BUILDINGS.find((x) => x.id === k); m.push(b ? b.name : k); } });
    return m.join(", ");
  }
  function p5JobReqText(job) {
    const r = P5_JOBREQ[job]; if (!r) return "";
    return [].concat((r.skills || []).map((k) => "Fähigkeit " + k), Object.keys(r.attrs || {}).map((k) => attrReq(r.attrs[k]) + " " + k), (r.items || []), (r.build || []).map((k) => { const b = BUILDINGS.find((x) => x.id === k); return b ? b.name : k; })).join(", ");
  }
  const p5LearnJob0 = learnJob;
  learnJob = function (name) {
    const s = state;
    if (!s || s.job === name || !availableJobs(s).includes(name)) return p5LearnJob0(name);
    const miss = p5JobMissing(s, name);
    if (miss) { const t = "Wiki-Voraussetzung für " + name + " fehlt: " + miss + "."; log(t, "bad"); showResult(t, true); renderAll(); return; }
    if (busy) { showResult("Erst die laufende Aktion beenden.", true); renderAll(); return; }
    const min = hasSkill(s, "Perfektion") ? 30 : hasSkill(s, "Flexibilität") ? 60 : 90;
    timedJob("ausbildung", "Ausbildung: " + name + " (" + min + " Wiki-Minuten)", wikiMinMs(min), origPage, () => {
      if (s.job !== name) s.flex = (s.flex || 0) + 50; // DESIGN wie bisher
      s.job = name;
      return "Ausbildung fertig: Beruf " + name + " (Wiki " + min + " min, hier " + Math.round(wikiMinMs(min) / 1000) + " s).";
    });
  };
  // Tiere: WIKI 2006 "Tier verletzt den Halter" und "Tiere jagen und essen" (Quelle laut Audit Moin 2006; Werte DESIGN)
  const p5TickPet0 = tickPet;
  tickPet = function (ticks) {
    const r = p5TickPet0(ticks);
    const s = state; const p = s && s.pet;
    if (p && !p.inStall && !p.sleeping && ticks > 0) {
      if ((p.einst || 0) <= -80 && Math.random() < 0.05 * ticks) { s.injuredUntil = Date.now() + 60000; log(p.name + " beißt dich: Es respektiert dich nicht (Einstellung " + p.einst + "). Verletzt für 1 Minute (DESIGN).", "bad"); }
      if ((p.hunger || 0) >= 70 && ["Hund", "Wolf", "Adler"].includes(p.type) && Math.random() < 0.2) { p.hunger = Math.max(0, p.hunger - 30); log(p.name + " jagt sich selbst etwas zu fressen. Hunger " + p.hunger + "% (DESIGN).", "sys"); }
    }
    return r;
  };

  // ---------- Seiten ----------
  stammGebPageHtml = function () {
    const s = state; const st = s.stamm ? stammOf(s) : null;
    if (!st) return "<h2>Stammgebäude</h2><p>Du bist in keinem Stamm. " + origLink("Gründung", 'data-page="gruendung"') + "</p>";
    let h = "<h2>Stammgebäude</h2><p class=\"muted\">Wiki-Kosten ÷100 (Prototyp-Skala), Intelligenz/Kraft/Dynamik ÷100. Bezahlt wird aus Rucksack, Privatlager (im Camp), Stammlager und Tanks. Bauzeit nach Wiki (30 Wiki-Minuten = 4 s), immer nur ein Bau; die Spielzeit läuft weiter.</p>";
    h += "<p>Researchlevel <b>" + st.rl + "</b> · Bauerfahrung " + (s.bep || 0) + " · " + origLink("Forschung", 'data-page="forschung"') + " · " + origLink("Waffenfabrik", 'data-page="waffenfabrik"') + " · " + origLink("Biolabor", 'data-page="biolabor"') + " · " + origLink("Uranverarbeitung", 'data-page="uranver"') + " · " + origLink("Raketenbasis", 'data-page="rakete"') + "</p>";
    h += p5BuildRow(s, st) + "<table>";
    STAMM_GEB.forEach((g) => {
      const lock = p5Lock(s, g); const lv = st.geb[g.id] || 0; const cost = sgCost(g, st);
      const building = st.build && st.build.id === g.id;
      let act;
      if (building) act = 'im Bau (noch <span class="p6-build-left">' + p5BuildLeft(st) + "</span> s)"; // läuft live mit (p6BuildTick)
      else if (g.tank) act = "Stufe " + lv + "/" + TANK_MAX_LEVEL + (lock ? ' <span class="cant">' + origEsc(lock) + "</span>" : " " + xLink("ausbauen", "sgeb|" + g.id));
      else if (lock === "steht") act = "steht";
      else act = lock ? '<span class="cant">' + origEsc(lock) + "</span>" : (stammMissing(s, cost) ? '<span class="cant">' + origEsc("es fehlt: " + stammMissing(s, cost)) + "</span>" : xLink("bauen", "sgeb|" + g.id));
      h += "<tr><td><b>" + origEsc(g.name) + "</b><br><span class=\"muted\">" + origEsc(g.info) + " Bauzeit " + (g.minDesign ? "DESIGN " : "Wiki ") + p5BuildMin(g) + " min.</span></td><td>" + origEsc(costBits(cost)) + (g.tank && lv < TANK_MAX_LEVEL ? " (Stufe " + (lv + 1) + ")" : "") + "</td><td>" + act + "</td></tr>";
    });
    h += "</table>";
    const use = [];
    ["Öl", "Gas"].forEach((r) => { if (tankCap(s, r)) use.push("<p><b>" + (r === "Öl" ? "Öltank" : "Gastank") + "</b>: " + st.tank[r] + "/" + tankCap(s, r) + " " + r + " · " + xLink("10 einlagern", "tin|" + r + "|10") + " · " + xLink("alles einlagern", "tin|" + r + "|99999") + " · " + xLink("10 entnehmen", "tout|" + r + "|10") + "</p>"); });
    Object.keys(CONVERSIONS).forEach((k) => { const c = CONVERSIONS[k]; if (st.geb[c.geb]) use.push("<p><b>" + origEsc(c.label) + "</b> (" + origEsc(costBits(c.cost)) + " → " + origEsc(c.out ? costBits(c.out) : (5 + 5 * st.erzUp) + " Edelmetall") + (c.job ? ", " + c.job : "") + ", " + origEsc(c.note) + ") " + xLink("umwandeln", "conv|" + k) + (k === "erz" && st.erzUp < 3 ? " · " + xLink("Upgrade (" + costBits(ERZ_UP_COST) + ", DESIGN)", "erzup") : "") + "</p>"); });
    if (st.geb.kaserne) use.push("<p><b>Kaserne</b>: " + xLink("ausruhen (Energie +40, Müdigkeit −40, Strahlung −40, DESIGN)", "kaserne|rest") + " · " + xLink("Techlevel senken", "kaserne|tldown") + " · " + xLink("Techlevel erhöhen", "kaserne|tlup") + (typeof s.tlCap === "number" ? " (gesenkt auf " + s.tlCap + ")" : "") + "</p>" + p4Bar("kaserne"));
    if (st.geb.baeder) use.push("<p><b>Bäder</b>: Wasserqualität " + st.bathQ + "% · " + xLink("baden (70 min)", "bad") + " · " + xLink("Wasser austauschen (" + costBits(BAD_SWAP) + ", DESIGN)", "badwasser") + "</p>" + p4Bar("bad"));
    if (st.geb.kampfarena) use.push("<p><b>Kampfarena</b> (Testkampf ohne Risiko, +1 KEP): " + P5_ARENA_FOES.map((id) => xLink(ENEMIES[id].name, "arena|" + id)).join(" · ") + "</p>" + p4Bar("arena"));
    if (st.geb.werkstatt_st) use.push("<p><b>Werkstatt</b>: zählt als Werkstatt für Fahrzeuge (" + origLink("Garage", 'data-page="garage"') + ").</p>");
    if (st.geb.biolabor_st) use.push("<p><b>Biolabor</b>: Biolevel " + (st.bl || 0) + " · " + origLink("öffnen", 'data-page="biolabor"') + "</p>");
    if (st.geb.raketenbasis) use.push("<p><b>Raketenbasis</b>: " + origLink("öffnen", 'data-page="rakete"') + "</p>");
    if (st.geb.radiostation || has(s, "Radio")) use.push("<p><b>Funk</b>: " + origLink("Funkmeldungen", 'data-page="radio"') + (st.geb.radiostation ? " · Radiostation steht" : "") + "</p>");
    if (st.geb.farm_st || st.geb.brunnen_st) use.push("<p><b>Erträge</b>: " + (st.geb.farm_st ? "Farm 50 Nahrung" : "") + (st.geb.farm_st && st.geb.brunnen_st ? ", " : "") + (st.geb.brunnen_st ? "Brunnen 50 Wasser (" + (P5_WELL_FILLS - ((st.prod && st.prod.fills) || 0)) + " Füllungen übrig)" : "") + " alle 18 Minuten ins Stammlager (DESIGN-Zeit).</p>");
    const traps = st.traps || {};
    use.push("<p><b>Verteidigung</b>: " + [st.wallMensch ? "Menschenwall" : "", st.wallMutant ? "Mutantenwall" : "", st.geb.wachturm ? "Wachturm" : "", st.geb.empturm ? "EMP-Turm" : "", st.geb.loeschvorrichtung ? "Löschvorrichtung" : "", traps.spreng ? traps.spreng + " Sprengfalle(n)" : "", traps.stolper ? traps.stolper + " Stolperfalle(n)" : "", (st.empUntil || 0) > Date.now() ? "EMP Streuer aktiv" : "", (st.sabotUntil || 0) > Date.now() ? "Rivalen-Fahrzeuge sabotiert" : ""].filter(Boolean).join(", ") + ". Überfälle der Rivalen: höchstens alle 30 Minuten (30%, DESIGN), bisher " + (st.raids || 0) + ".</p>");
    if (p5Reactor(s)) use.push("<p class=\"muted\">Reaktor: Wiki — kein Lagerfeuer mehr nötig. Prototyp: sicherer, besserer Schlaf im Stammlager und sicherer Schlaf draußen im Stammland (bis " + P5_STAMMLAND + " Felder ums Camp).</p>");
    else use.push("<p class=\"muted\">Ohne Reaktor und ohne Feuer (Lagerfeuer oder Feuerstelle) ist das Stammlager nachts nicht ganz sicher (DESIGN 5%).</p>");
    h += "<h3>Benutzen</h3>" + use.join("");
    return h;
  };
  function uranverPageHtml() {
    const s = state; const st = s.stamm ? stammOf(s) : null;
    let h = "<h2>Uranverarbeitung</h2><p class=\"muted\">Wiki: Natururan → Yellow Cake (Uranerzaufbereitung, RL11) → Uranhexafluorid (Konversionsanlage, RL12) → Uranoxid (Anreicherungsanlage, RL13). Forscher arbeiten hier. Mengen DESIGN. Glasschmelze: je Glas 1 Uranhexafluorid + 50 Sand (Wiki).</p>";
    if (!st) return h + "<p>Du bist in keinem Stamm.</p>";
    h += "<p>Im Rucksack: Natururan " + (s.inv.Natururan || 0) + " · Yellow Cake " + (s.inv.YellowCake || 0) + " · Uranhexafluorid " + (s.inv.Uranhexfluorid || 0) + " · Uranoxid " + (s.inv.Uranoxid || 0) + "</p><table>";
    ["yellowcake", "uranhex", "uranoxid", "glas"].forEach((k) => {
      const c = CONVERSIONS[k]; const g = STAMM_GEB.find((x) => x.id === c.geb);
      h += "<tr><td><b>" + origEsc(c.label) + "</b><br><span class=\"muted\">" + origEsc(g.name + ", " + c.job) + "</span></td><td>" + origEsc(costBits(c.cost) + " → " + costBits(c.out)) + "</td><td>" + (st.geb[c.geb] ? xLink("umwandeln", "conv|" + k) : '<span class="cant">' + origEsc(g.name + " fehlt") + "</span>") + "</td></tr>";
    });
    return h + "</table><p>" + origLink("Stammgebäude", 'data-page="stammgeb"') + "</p>";
  }
  function erzverPageHtml() {
    const s = state; const st = s.stamm ? stammOf(s) : null;
    let h = "<h2>Erzverarbeitung</h2><p class=\"muted\">Wiki: Forscher veredeln Erz zu Edelmetall, 3 Upgrades, mit allen 75 Erz → 20 Edelmetall.</p>";
    if (!st) return h + "<p>Du bist in keinem Stamm.</p>";
    if (!st.geb.erzverarbeitung) return h + "<p>Die Erzverarbeitung steht noch nicht. " + origLink("Stammgebäude", 'data-page="stammgeb"') + "</p>";
    return h + "<p>75 Erz → " + (5 + 5 * st.erzUp) + " Edelmetall · Upgrades " + st.erzUp + "/3 · Erz im Rucksack " + (s.inv.Erz || 0) + "</p><p>" + xLink("Erz veredeln", "conv|erz") + (st.erzUp < 3 ? " · " + xLink("Upgrade (" + costBits(ERZ_UP_COST) + ", DESIGN)", "erzup") : "") + "</p>";
  }
  function werkstattStPageHtml() {
    const s = state; const st = s.stamm ? stammOf(s) : null;
    let h = "<h2>Werkstatt</h2><p class=\"muted\">Wiki: Stammgebäude ab Researchlevel 10, 150 Intelligenz, nur der Mechaniker baut sie. Im Prototyp zählt sie wie die private Werkstatt: Fahrzeuge bauen, reparieren und pimpen.</p>";
    if (!st) return h + "<p>Du bist in keinem Stamm.</p>";
    h += "<p>Stamm-Werkstatt: " + (st.geb.werkstatt_st ? "steht" : "fehlt") + " · private Werkstatt: " + (s.buildings && s.buildings.werkstatt ? "steht" : "fehlt") + "</p>";
    return h + "<p>" + origLink("Garage (Fahrzeuge)", 'data-page="garage"') + " · " + origLink("Stammgebäude", 'data-page="stammgeb"') + "</p>";
  }
  function radioPageHtml() {
    const s = state;
    let h = "<h2>Funk</h2><p class=\"muted\">Wiki: Das Radio speichert bis zu 30 Nachrichten. Hier landen Bau-, Ertrags- und Überfallmeldungen. Mit Radiostation und Radio rufst du bei Überfällen Hilfe (DESIGN).</p>";
    if (!has(s, "Radio")) return h + "<p>Du hast kein Radio im Rucksack (Erfinder, Wiki-Rezept).</p>";
    const list = s.radio || [];
    if (!list.length) return h + "<p>Keine Meldungen.</p>";
    return h + "<table>" + list.map((x) => "<tr><td>" + origEsc(new Date(x.t).toLocaleString("de-AT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })) + "</td><td>" + origEsc(x.m) + "</td></tr>").join("") + "</table>";
  }
  function p5Page(page) {
    if (page === "biolabor") return biolaborPageHtml();
    if (page === "uranver") return uranverPageHtml();
    if (page === "erzver") return erzverPageHtml();
    if (page === "werkstatt") return werkstattStPageHtml();
    if (page === "rakete") return raketePageHtml();
    if (page === "radio") return radioPageHtml();
    if (page === "stammgeb") { const s = state; if (s && s.stamm) { const m = p5FinishBuild(false); if (m) log(m, "good"); } return null; }
    return null;
  }
  const p5P4Page0 = p4Page;
  p4Page = function (page) { const h = p5Page(page); return h != null ? h : p5P4Page0(page); };
  function p5Cmd(c, a, b) {
    if (c === "arena") return p5Arena(a);
    if (c === "bio") return p5BioMake(a);
    if (c === "biowork") {
      const s = state;
      if (!stammHas(s, "biolabor_st")) return "Erst das Biolabor im Stamm bauen.";
      if (s.locId !== "camp") return "Das Biolabor steht im Ruinencamp.";
      startAction("bio_stamm"); return null;
    }
    if (c === "rakete") return p5Rocket();
    if (c === "sabot") return p5Sabotage();
    if (c === "zoo") { startAction("p5_zoo"); return null; }
    if (c === "xtc") return p5Xtc();
    if (c === "detect") return p5Detect(a);
    if (c === "radio") return p5RadioText(30);
    return undefined;
  }
  const p5P4Cmd0 = p4Cmd;
  p4Cmd = function (c, a, b) { const r = p5Cmd(c, a, b); return r === undefined ? p5P4Cmd0(c, a, b) : r; };
  // Kleine Sabotage, Zoologie und XTC-Experiment als Aktionen an passenden Orten
  ACTIONS.p5_sabot = { label: "Fahrzeuge der Rivalen sabotieren", icon: "Metall", duration: 800, needJob: "Spion", show: (s) => !!s.stamm && hasSkill(s, "Kleine Sabotage"), run() { const m = p5Sabotage(); return { ok: !/^(Wiki|Du|Sabotieren|Nur)/.test(m), msg: m }; } };
  const p5Rival = LOCATIONS.find((l) => l.id === "rival_camp"); if (p5Rival && !p5Rival.actions.includes("p5_sabot")) p5Rival.actions.push("p5_sabot");
  // Speicherstand: nur neue Felder (Schlüssel bleibt v2). Alter Name "Diamantdetektor" (Wiki-Erfindungsliste) → "Diamantendetektor".
  const p5Migrate0 = migrateState;
  migrateState = function (s) {
    s = p5Migrate0(s);
    if (s && s.inv && s.inv.Diamantdetektor) { s.inv.Diamantendetektor = (s.inv.Diamantendetektor || 0) + s.inv.Diamantdetektor; delete s.inv.Diamantdetektor; }
    if (s) ["bep", "sep", "dep"].forEach((k) => { if (typeof s[k] !== "number") s[k] = 0; });
    return s;
  };
  const p5Chemie0 = chemiePageHtml;
  chemiePageHtml = function () {
    return p5Chemie0() + "<h3>Experiment: Mutanten XTC</h3><p class=\"muted\">Wiki: Der Chemiker experimentiert mit 10 zufälligen Gegenständen aus dem Rucksack, dabei kann Mutanten XTC entstehen (Verkauf bei Drogendealern). Rohstoffe, Ausrüstung, Fahrzeuge und Erfindungen zählen nicht, Chance 50% (DESIGN).</p><p>" + (state.job === "Chemiker" ? xLink("experimentieren", "xtc") : "Nur der Chemiker.") + "</p>";
  };

  // =====================================================================
  // Durchgang 6 (Okt 2026): Fehler aus dem Browser-Playtest
  // =====================================================================
  // 1) Essen und Trinken aus dem Rucksack (vorher nur im versteckten Alt-Inventar erreichbar).
  //    WIKI: Nahrung und Wasser sind Bedürfnisse; +8 je Einheit ist der bisherige Prototyp-Wert (DESIGN).
  function p6Consume(item, n) {
    const s = state;
    if (!s || s.dead) return "";
    if (item !== "Nahrung" && item !== "Wasser") return "";
    { const m = "Nahrung und Wasser sind dein Vorrat und werden automatisch verbraucht – kein Essen oder Trinken nötig."; showResult(m); renderAll(); return m; } // Durchgang 9
    const have = s.inv[item] || 0;
    const k = Math.min(have, Math.max(1, n || 1));
    if (k <= 0) { showResult("Kein " + item + " im Rucksack.", true); renderAll(); return ""; }
    takeInv(s, item, k);
    const plus = 8 * k; // DESIGN
    if (item === "Nahrung") s.food += plus; else s.water += plus;
    const msg = (item === "Nahrung" ? "Du isst " + k + "× Nahrung. Bedarf Nahrung +" + plus + " → " + s.food : "Du trinkst " + k + "× Wasser. Bedarf Wasser +" + plus + " → " + s.water) + ".";
    log(msg, "good"); showResult(msg); save({ quiet: true }); renderAll();
    return msg;
  }
  function p6EatHtml() {
    const s = state; const f = s.inv.Nahrung || 0; const w = s.inv.Wasser || 0;
    const row = (item, have, verb) => have > 0
      ? xLink("1× " + verb, "p6eat|" + item + "|1") + (have >= 5 ? " · " + xLink("5× " + verb, "p6eat|" + item + "|5") : "") + " · " + xLink("alles " + verb, "p6eat|" + item + "|" + have)
      : '<span class="muted">kein ' + item + " dabei</span>";
    return '<div class="pack p6-eat"><h3>Essen und Trinken</h3>' +
      "<p>Bedarf jetzt: Nahrung " + s.food + ", Wasser " + s.water + ". Je Einheit +8 (DESIGN).</p>" +
      "<p>Nahrung (Vorrat " + f + "): " + row("Nahrung", f, "essen") + "</p>" +
      "<p>Wasser (Vorrat " + w + "): " + row("Wasser", w, "trinken") + "</p></div>";
  }
  const p6ExtCmd = extCmd;
  extCmd = function (cmd) {
    const bits = String(cmd || "").split("|");
    if (bits[0] === "p6eat") { p6Consume(bits[1], parseInt(bits[2], 10) || 1); origPage = "rucksack"; renderAll(); return; }
    return p6ExtCmd(cmd);
  };

  // 2) Seiten-Nachbearbeitung: Essen/Trinken im Rucksack, Landbild-Platzhalter mit Text statt leerem schwarzen Kasten.
  const p6RenderOrigPage = renderOrigPage;
  renderOrigPage = function () {
    let h = p6RenderOrigPage();
    if (origPage === "rucksack" && state) h = h.replace("</h2>", "</h2>" + p9SupplyHtml()); // Durchgang 9: Vorrat statt „Essen und Trinken“
    if (origPage === "handeln" && state && h.indexOf("Kein Händler hier.") >= 0) h = h.replace("Kein Händler hier.</p>", "Kein Händler hier.</p>" + p6TradeHint());
    if (origPage === "landkarte" && state) h += p6NearbyHtml();
    if (origPage === "landkarte" && state && state.locId !== "camp") h += '<p>Schnellreise (DESIGN): ' + origLink("zum Ruinencamp", 'data-loc="camp"') + " · reist über die Felder, kostet Zeit und Bedarf wie jede Reise.</p>";
    h = h.replace(/<div class="land-pic" title="([^"]*)"><\/div>/, (m, t) => '<div class="land-pic p6-landpic" title="' + t + '"><span>' + t + "</span><small>kein Bild im Wiki-Spiegel</small></div>");
    return h;
  };

  /** Landkarte: die meisten Orte liegen außerhalb des 15×12-Ausschnitts. Liste der nächsten Orte mit Richtung und Reise-Link (DESIGN). */
  function p6NearbyHtml() {
    const s = state; const x0 = typeof s.px === "number" ? s.px : 50; const y0 = typeof s.py === "number" ? s.py : 100;
    const dir = (dx, dy) => (dy < 0 ? "N" : dy > 0 ? "S" : "") + (dx > 0 ? "O" : dx < 0 ? "W" : "");
    const all = LOCATIONS.filter((l) => !(l.x === x0 && l.y === y0)).map((l) => ({ l, d: Math.max(Math.abs(l.x - x0), Math.abs(l.y - y0)), g: placeGate(l) }));
    const open = all.filter((o) => o.g.open).sort((a, b) => a.d - b.d).slice(0, 8);
    const locked = all.filter((o) => !o.g.open).length;
    if (!open.length) return "";
    return '<div class="p6-near"><h3>Orte in der Nähe</h3><p>' + open.map((o) => origLink(o.l.name, 'data-loc="' + o.l.id + '"') + " <span class=\"muted\">" + o.d + " Felder " + dir(o.l.x - x0, o.l.y - y0) + "</span>").join(" · ") + "</p>" +
      (locked ? '<p class="muted">' + locked + " weitere Orte sind noch gesperrt (EP, Karma oder Fähigkeit). Reisen kostet Zeit und Bedarf (DESIGN-Liste).</p>" : "") + "</div>";
  }
  /** Handeln ohne Händler: nächste erreichbare Händler-Orte mit Reise-Link (DESIGN, vorher Sackgasse). */
  function p6TradeHint() {
    const s = state; const x0 = typeof s.px === "number" ? s.px : 50; const y0 = typeof s.py === "number" ? s.py : 100;
    const near = LOCATIONS.filter((l) => l.trade && placeGate(l).open)
      .map((l) => ({ l, d: Math.max(Math.abs(l.x - x0), Math.abs(l.y - y0)) }))
      .sort((a, b) => a.d - b.d).slice(0, 3);
    if (!near.length) return "";
    return "<p>Nächste Händler: " + near.map((o) => origLink(o.l.name, 'data-loc="' + o.l.id + '"') + " (" + o.d + " Felder)").join(" · ") + "</p>";
  }
  // 3) Rückmeldung: Klicks, die nur ins (versteckte) Protokoll schreiben, zeigen die Meldung jetzt auch auf der Seite.
  let p6LogSeq = 0; let p6LastLog = null;
  const p6Log = log;
  log = function (msg, cls) { p6LogSeq++; p6LastLog = { msg: String(msg), bad: cls === "bad" }; return p6Log(msg, cls); };
  let p6ClickMark = null;
  document.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("#orig-game a") : null;
    p6ClickMark = a ? { seq: p6LogSeq, rl: resultLines, n: resultLines.length, page: origPage, a } : null;
  }, true);
  if (origGame) origGame.addEventListener("click", () => {
    const m = p6ClickMark; p6ClickMark = null;
    if (!m || !state) return;
    const a = m.a;
    if (a.hasAttribute("data-page") || a.hasAttribute("data-cell") || a.hasAttribute("data-land")) return;
    if (p6LogSeq === m.seq || !p6LastLog) return;
    if (resultLines !== m.rl || resultLines.length !== m.n) return; // Aktion hat selbst eine Meldung gezeigt
    showResult(p6LastLog.msg, p6LastLog.bad);
    renderOriginal();
  });

  // 4) Bau-Balken der Stammgebäude läuft flüssig (vorher nur alle 5 s neu gezeichnet).
  p5BuildRow = function (s, st) {
    if (!st.build) return "";
    const g = STAMM_GEB.find((x) => x.id === st.build.id);
    const tot = Math.max(1, st.build.until - st.build.start);
    const pct = Math.min(100, Math.round(((Date.now() - st.build.start) / tot) * 100));
    return '<div class="work-row p6-build"><p>Im Bau: <b>' + origEsc(g ? g.name : st.build.id) + '</b> · <span class="p6-build-pct">' + pct + '%</span> · noch <span class="p6-build-left">' + p5BuildLeft(st) + '</span> s</p><div class="work-bar build-bar"><i style="width:' + pct + '%"></i></div></div>';
  };
  function p6BuildTick() {
    if (!state || !state.stamm) return;
    const st = stammOf(state);
    if (!st || !st.build) return;
    const bar = document.querySelector("#orig-sheet .build-bar i");
    if (Date.now() >= st.build.until) {
      const msg = p5FinishBuild(false);
      if (msg) { log(msg, "good"); if (bar || origPage === "stammgeb") showResult(msg); save({ quiet: true }); renderAll(); }
      return;
    }
    if (!bar) return;
    const tot = Math.max(1, st.build.until - st.build.start);
    const pct = Math.min(100, ((Date.now() - st.build.start) / tot) * 100);
    bar.style.width = pct.toFixed(1) + "%";
    const p = document.querySelector("#orig-sheet .p6-build-pct"); if (p) p.textContent = Math.round(pct) + "%";
    document.querySelectorAll("#orig-sheet .p6-build-left").forEach((l) => { l.textContent = String(p5BuildLeft(st)); }); // Balkenzeile und Tabellenzeile
  }
  setInterval(p6BuildTick, 250);

  // =====================================================================
  // Durchgang 7: Aufgaben (Leitfaden in Kapiteln), Ort im HUD, Erkunden und Graben neu,
  // Herstellen mit Bildern, Status-Erklärungen, Kosten an allen Aktionsknöpfen,
  // fehlende Eigenschafts-Wirkungen. Alles hier ist DESIGN, außer wo WIKI steht.
  // =====================================================================
  const P7_HIST_MAX = 20; // DESIGN: so viele Einträge im Verlauf
  const P7_ERK_MS = 2000; // DESIGN: ein Erkundungsgang dauert 2 s (≙ 15 Minuten)
  function p7(s) {
    s = s || state;
    if (!s.p7) s.p7 = {};
    const p = s.p7;
    ["acts", "crafted", "found", "visited", "cnt"].forEach((k) => { if (!p[k] || typeof p[k] !== "object") p[k] = {}; });
    ["erkHist", "digHist"].forEach((k) => { if (!Array.isArray(p[k])) p[k] = []; });
    if (!p.trade) p.trade = { since: 0, units: 0 };
    return p;
  }
  function p7Count(k, n) { const p = p7(); p.cnt[k] = (p.cnt[k] || 0) + (n || 1); }
  function p7Time(ts) {
    const parts = new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(ts));
    const g = (k) => (parts.find((x) => x.type === k) || {}).value || "00";
    return g("hour") + ":" + g("minute");
  }
  function p7Pos(s) {
    s = s || state;
    if (typeof s.px === "number" && typeof s.py === "number") return { x: s.px, y: s.py };
    const l = LOCATIONS.find((x) => x.id === s.locId);
    return l ? { x: l.x, y: l.y } : { x: 50, y: 100 };
  }
  const P7_TERRAIN = ["Ödland", "Steppe", "Geröllfeld", "Ruinenfeld", "Dünen", "Trockenwiese"]; // DESIGN: Namen freier Felder
  function p7FieldName(x, y) {
    const pl = placeAt(x, y);
    if (pl) return pl.name;
    const g = groundAt(x, y);
    if (g === "glas") return "Glasfläche";
    if (g === "hart") return "Felsboden";
    return P7_TERRAIN[(((x * 31) ^ (y * 17)) >>> 0) % P7_TERRAIN.length];
  }
  function p7GroundText(g) { return g === "glas" ? "Glasboden (Dynamit nötig)" : g === "hart" ? "harter Boden (Spitzhacke oder Greifer nötig)" : "normaler Boden"; }
  function p7LocText(s) { const p = p7Pos(s); return p7FieldName(p.x, p.y) + " " + p.x + "/" + p.y; }
  function p7Dir(dx, dy) {
    if (Math.abs(dx) > 2 * Math.abs(dy)) return dx > 0 ? "östlich" : "westlich";
    if (Math.abs(dy) > 2 * Math.abs(dx)) return dy > 0 ? "südlich" : "nördlich";
    return (dy < 0 ? "nord" : "süd") + (dx > 0 ? "östlich" : "westlich");
  }

  // ---------- Kosten-Anzeige für jede Aktion ----------
  function p7FatAdd(kind) { let f = kind === "fight" ? 8 : 3; if (state.race === "Mutant") f += 1; return f; } // wie exert()
  function p7WorkSec(aid) {
    if (aid === "graben") return Math.round(digMs(state) / 1000);
    const d = ACTIONS[aid]; return Math.max(1, Math.round(((d && d.duration) || 4000) / 1000));
  }
  /** Kurzer Kostentext. kind: work | fight | sleep | craft | erkunden | move */
  function p7CostText(kind, aid, n) {
    n = n || 1;
    if (kind === "fight") return "Sieg: Müdigkeit +" + p7FatAdd("fight") + " · Energie −6 · Nahrung −1 · Wasser −1 · Niederlage: Gold −25 % (mind. 3), Nahrung −3, Wasser −3";
    if (kind === "move") return "1 Feld · keine Energie · sofort";
    if (kind === "sleep") {
      const m = sleepSpot(state).mult;
      return "Müdigkeit −" + Math.round(100 * m) + " · Energie +" + Math.round(100 * m) + " (bis 100 %) · Strahlung −" + Math.round(30 * m) + " · Dauer " + Math.round(sleepDuration(state) / 1000) + " s";
    }
    if (kind === "craft") return "Müdigkeit +" + p7FatAdd("craft") + " · Energie −2 · sofort";
    if (kind === "erkunden") return "Energie −2 · Müdigkeit +" + p7FatAdd("work") + " · Dauer " + Math.round(P7_ERK_MS / 1000) + " s (≙ 15 Min.)";
    if (aid === "rest") return "Müdigkeit −15 · Energie +10 · 1 s";
    const needs = (aid === "cave" || aid === "visit") ? "" : " · Nahrung −" + n + " · Wasser −" + n;
    return "Energie −" + (2 * n) + " · Müdigkeit +" + (p7FatAdd("work") * n) + needs + " · Dauer " + (p7WorkSec(aid) * n) + " s";
  }
  function p7CostSpan(txt) { return ' <span class="p7-cost">' + origEsc(txt) + "</span>"; }
  function p7TravelText(locId) {
    const to = LOCATIONS.find((l) => l.id === locId);
    const from = locById(state.locId);
    if (!to || !from || to.id === state.locId) return null;
    const plan = travelPlan(from, to);
    return plan.dist + " Felder · " + plan.sec + " s · Nahrung −1 · Wasser −1 · Müdigkeit +" + p7FatAdd("travel");
  }
  /** Hängt an Aktionslinks im Seiten-HTML die Kosten an. */
  function p7DecorateCosts(h, page) {
    const workAid = { holz: "holz", stein: "stein", wasser: "wasser", graben: "graben" };
    return h.replace(/(<a href="#" ([^>]*)>[^<]*<\/a>)(?!\s*<span class="p7-cost")/g, (m, a, attrs) => {
      let t = null, g;
      if ((g = attrs.match(/data-act="([a-z_]+)"/))) t = g[1] === "kampf" ? p7CostText("fight") : workAid[g[1]] ? p7CostText("work", workAid[g[1]]) : null;
      else if ((g = attrs.match(/data-rep="([a-z_]+):(\d+)"/))) t = ACTIONS[g[1]] ? p7CostText("work", g[1], parseInt(g[2], 10)) : null;
      else if ((g = attrs.match(/data-x="work\|([a-z_0-9]+)"/))) t = ACTIONS[g[1]] ? p7CostText("work", g[1]) : null;
      else if ((g = attrs.match(/data-here="([a-z_0-9]+)\|([a-z_0-9]+)"/))) {
        t = g[2] === "fight" ? p7CostText("fight") : ACTIONS[g[2]] ? p7CostText("work", g[2]) : null;
        const tr = g[1] !== state.locId ? p7TravelText(g[1]) : null;
        if (t && tr) t = "erst Reise " + tr + " · dann " + t;
      } else if (/data-foe="/.test(attrs)) t = p7CostText("fight");
      else if (/data-page="do-sleep"/.test(attrs)) t = p7CostText("sleep");
      else if ((g = attrs.match(/data-loc="([a-z_0-9]+)"/)) && page !== "aufgaben") t = p7TravelText(g[1]);
      else if (/data-craft="/.test(attrs) && page !== "herstellen") t = p7CostText("craft");
      return t ? a + p7CostSpan(t) : a;
    });
  }
  // Ergebnis-Zeile: tatsächliche Änderung von Müdigkeit/Energie anhängen (exert läuft je nach Aktion vor oder nach showResult).
  let p7ShowAt = 0, p7Pending = null;
  const p7ShowResultBase = showResult;
  showResult = function (line, bad) {
    let txt = String(line == null ? "" : line);
    if (p7Pending && Date.now() - p7Pending.at < 40) { txt += p7Pending.text; p7Pending = null; }
    p7ShowAt = Date.now();
    return p7ShowResultBase(txt, bad);
  };
  const p7ExertBase = exert;
  exert = function (kind) {
    if (!state) return p7ExertBase(kind);
    if (kind === "trade") p7Count("trade"); // Durchgang 8: Aufgabe „Handeln“
    const f0 = state.fatigue || 0, e0 = curEnergy(state);
    const r = p7ExertBase(kind);
    const f1 = state.fatigue || 0, e1 = curEnergy(state);
    const bits = [];
    if (f1 !== f0) bits.push("Müdigkeit " + (f1 > f0 ? "+" : "−") + Math.abs(f1 - f0) + " (jetzt " + f1 + " %)");
    if (e1 !== e0) bits.push("Energie " + (e1 > e0 ? "+" : "−") + Math.abs(e1 - e0) + " (jetzt " + e1 + " %)");
    if (bits.length && kind !== "sleep") {
      const text = " \u200b· " + bits.join(", "); // \u200b markiert den angehängten Teil (nie doppelt)
      if (Date.now() - p7ShowAt < 40 && resultLines.length) {
        const l = resultLines[resultLines.length - 1]; l.text = String(l.text).replace(/ \u200b·.*$/, "") + text; p7Pending = null; renderResultBanner();
      } else p7Pending = { text, at: Date.now() };
    }
    return r;
  };

  // ---------- Zähler für die Aufgaben ----------
  Object.keys(ACTIONS).forEach((aid) => {
    const def = ACTIONS[aid];
    if (!def || typeof def.run !== "function" || def.run.p7) return;
    const base = def.run;
    def.run = function (s, loc) {
      const g = aid === "graben" && typeof s.px === "number" ? groundAt(s.px, s.py) : null;
      const res = base.apply(this, arguments);
      if (res && res.ok) {
        const p = p7(s); const where = (loc && loc.id) || s.locId;
        p.acts[aid] = (p.acts[aid] || 0) + 1;
        p.acts[aid + "@" + where] = (p.acts[aid + "@" + where] || 0) + 1;
        if (aid === "graben" && g === "hart") p7Count("digHart");
      }
      if (aid === "graben") p7DigHist(s, res, g);
      return res;
    };
    def.run.p7 = true;
  });
  function p7DigHist(s, res, g) {
    const p = p7(s); const pos = p7Pos(s);
    p.digHist.unshift({ t: Date.now(), x: pos.x, y: pos.y, f: p7FieldName(pos.x, pos.y), g: g || groundAt(pos.x, pos.y),
      r: (res && res.msg) || "—", ok: !!(res && res.ok),
      c: res && res.ok ? "Energie −2 · Müdigkeit +" + p7FatAdd("work") + " · Nahrung/Wasser −1 · " + p7WorkSec("graben") + " s" : "keine Kosten (nicht gegraben)" });
    p.digHist.length = Math.min(p.digHist.length, P7_HIST_MAX);
  }
  const p7DoCraftBase = doCraft;
  doCraft = function (c) {
    const before = c && c.result ? Object.keys(c.result).map((k) => state.inv[k] || 0) : [];
    const r = p7DoCraftBase(c);
    if (c && c.result && Object.keys(c.result).some((k, i) => (state.inv[k] || 0) > before[i])) { const p = p7(); p.crafted[c.id] = (p.crafted[c.id] || 0) + 1; }
    return r;
  };
  const p7ConsumeBase = p6Consume;
  p6Consume = function (item, n) { const b = state ? (state.inv[item] || 0) : 0; const r = p7ConsumeBase(item, n); if (state && (state.inv[item] || 0) < b) p7Count("eat"); return r; };
  const p7EndSleepBase = endSleep;
  endSleep = function (reason, bad) { const was = !!sleepUi; if (was && state) p7Count("sleep"); return p7EndSleepBase(reason, bad); };

  // ---------- Aufgaben: 10 Kapitel × 5 Aufgaben ----------
  // Zieltypen: inv, craft, house, lager, lagerN, act, kill, quest, cave, visit, tl, gold, cpSpent, attr, job, cnt, stamm, sgeb, rl, cost, rep
  const GUIDE = [
    { t: "Erste Schritte im Ruinencamp", tasks: [
      { id: "k1_holz", l: "Sammle 40 Holz", g: { t: "inv", k: "Holz", n: 40 }, h: "Im Waldstück (70/90) unter Arbeiten „Holz sammeln“. Jeder Gang bringt Holz.", loc: "wald", page: "arbeiten" },
      { id: "k1_stein", l: "Sammle 30 Stein", g: { t: "inv", k: "Stein", n: 30 }, h: "Im Steinbruch (85/110) unter Arbeiten „Stein abbauen“.", loc: "bruch", page: "arbeiten" },
      { id: "k1_waffen", l: "Stelle einen Stock und einen Stock mit Stein her", g: { t: "crafts", ids: ["stock", "stock_stein"] }, h: "Herstellen → Stock (10 Holz, +8 Kampfpunkte), danach Stock mit Stein (10 Holz, 10 Stein, +16 Kampfpunkte). Danach öffnet sich das Schrottfeld.", page: "herstellen" },
      // Durchgang 8: Die Holzhütte braucht Kunststoff, Metall, Nahrung und Wasser. Vorher lernte Kapitel 1 nur Holz und Stein → Spieler steckten fest.
      { id: "k1_vorrat", l: "Besorge Kunststoff, Metall und Vorräte für die Hütte", g: { t: "need", cost: { Kunststoff: 15, Metall: 20, Nahrung: 20, Wasser: 5 } }, h: "Kunststoff und Metall gibt es nicht im Wald oder Steinbruch, sondern auf dem Schrottfeld (60/120): dort unter Arbeiten „Kunststoff sammeln“ und „Metall sammeln“ (je 4–10 pro Gang). Das Schrottfeld öffnet sich, sobald die Aufgaben 1–3 erledigt sind. Nahrung und Wasser zählen aus deinem Vorrat (rechts). Wird er knapp: Nahrungssuche im Waldstück (70/90), Wilde Hunde jagen, Wassersuche an der Oase (40/95) oder beim Händler im Ruinencamp (1 Gold je Einheit). Kunststoff gibt es dort für 2 Gold.", loc: "schrott", page: "arbeiten" },
      { id: "k1_huette", l: "Baue eine Holzhütte", g: { t: "house", id: "holzhuette" }, h: "Im Ruinencamp (50/100): Haus → Holzhütte „bauen“. Kosten 25 Holz, 15 Kunststoff, 20 Metall, 20 Nahrung, 5 Wasser. Nahrung und Wasser kommen aus deinem Vorrat (rechts) – behalte danach genug übrig.", loc: "camp", page: "haus", cost: { Holz: 25, Kunststoff: 15, Metall: 20, Nahrung: 20, Wasser: 5 } },
    ] },
    { t: "Versorgung und erster Kampf", tasks: [
      { id: "k2_handel", l: "Handle einmal beim Händler im Ruinencamp", g: { t: "cnt", k: "trade", n: 1 }, h: "Im Ruinencamp (50/100) unter Handeln etwas kaufen oder verkaufen. Der Händler kauft Rohstoffe an und verkauft Nahrung, Wasser, Kunststoff und Metall.", loc: "camp", page: "handeln" },
      // Durchgang 9: Essen/Trinken gibt es nicht mehr (Vorrat wird automatisch verbraucht) → Nahrungssuche
      { id: "k2_nahrung", l: "Suche einmal Nahrung", g: { t: "cnt", k: "forage", n: 1 }, h: "Aktionen → Nahrungssuche → „Nahrung sammeln“. Im Waldstück (70/90) und an der Oase (40/95) findest du am meisten, in Wüste und Ruinen wenig. Alles geht direkt in deinen Vorrat (rechts).", loc: "wald", page: "nahrungssuche" },
      { id: "k2_hund", l: "Besiege einen Wilden Hund", g: { t: "kill", e: "wild_dog", n: 1 }, h: "Jagen oder Kämpfen. Wilde Hunde gibt es z. B. im Waldstück. Mit Stock mit Stein kämpfst du besser.", page: "jagen" },
      { id: "k2_schlaf", l: "Schlafe dich einmal aus", g: { t: "cnt", k: "sleep", n: 1 }, h: "Schlafen senkt Müdigkeit und füllt Energie. Im eigenen Haus schläfst du am sichersten.", page: "schlafen" },
      { id: "k2_hundejagd", l: "Löse die Quest „Hundejagd“ ein", g: { t: "quest", q: "hundejagd" }, h: "Besiege 2 Wilde Hunde und löse die Quest auf der Aufgaben-Seite unter „Nebenquests“ ein.", page: "aufgaben" },
    ] },
    { t: "Graben und Erkunden", tasks: [
      { id: "k3_graben", l: "Grabe 3×", g: { t: "act", a: "graben", n: 3 }, h: "Graben geht überall außer im Ruinencamp. Wahrnehmung erhöht die Fundchance.", page: "graben" },
      { id: "k3_erkunden", l: "Erkunde 5×", g: { t: "cnt", k: "erk", n: 5 }, h: "Erkunden findet Kleinigkeiten, Spuren und neue Orte in der Nähe.", page: "erkunden" },
      { id: "k3_cp", l: "Verteile 3 Charakterpunkte", g: { t: "cpSpent", n: 3 }, h: "Status → bei einer Eigenschaft „Go!“. Was jede Eigenschaft bewirkt, steht dort.", page: "status" },
      { id: "k3_pluenderer", l: "Besiege einen Mutierten Plünderer", g: { t: "kill", e: "scavenger", n: 1 }, h: "Plünderer streifen über das Schrottfeld (60/120): dort Kämpfen. Sie sind stärker als Hunde (22 KP) – mit Stock mit Stein und ausgeschlafen klappt es meist.", loc: "schrott", page: "kaempfen" },
      { id: "k3_tl1", l: "Erreiche Techlevel 1 (100 EP)", g: { t: "tl", n: 1 }, h: "EP gibt es für Arbeit, Kämpfe, Quests und Aufgaben. Ab 100 EP öffnen sich Höhlen, Sandwüste, Öl- und Gasfeld.", page: "status" },
    ] },
    { t: "Die Anfängerhöhlen", tasks: [
      { id: "k4_west", l: "Reise zur Anfängerhöhle West und erkunde sie", g: { t: "cave", key: "West" }, h: "Anfängerhöhle West (25/118): „Höhle erkunden“ gibt einmalig +75 EP und +75 CP (Wiki).", loc: "cave_w" },
      { id: "k4_erstehoehle", l: "Löse die Quest „Erste Höhle“ ein", g: { t: "quest", q: "erste_hoehle" }, h: "Nach dem ersten Höhlenbesuch unten bei den Nebenquests einlösen.", page: "aufgaben" },
      { id: "k4_holzlief", l: "Liefere 20 Holz im Ruinencamp", g: { t: "quest", q: "holz_lieferung" }, h: "Mit 20 Holz ins Ruinencamp (50/100) und die Quest „Holzlieferung“ bei den Nebenquests einlösen.", loc: "camp", page: "aufgaben" },
      { id: "k4_sand", l: "Reise in die Sandwüste und sammle 20 Sand", g: { t: "inv", k: "Sand", n: 20 }, h: "Sandwüste (55/130). Sand findest du beim Graben; Sandsucher bauen ihn direkt ab.", loc: "sandwueste", page: "graben" },
      { id: "k4_zweite", l: "Erkunde eine zweite Anfängerhöhle", g: { t: "cave", n: 2 }, h: "Nord (101/10), Ost (192/103) oder Süd (99/191). Weite Wege – Nahrung und Wasser mitnehmen.", loc: "cave_s" },
    ] },
    { t: "Ein Beruf: Waffentechniker", tasks: [
      { id: "k5_job", l: "Lerne den Beruf Waffentechniker", g: { t: "job", list: ["Waffentechniker"] }, h: "Fähigkeiten → TL 1 → Waffentechniker „erlernen“. Er stellt Messer und Speere her.", page: "faehigkeiten" },
      { id: "k5_messer", l: "Stelle ein Messer her", g: { t: "craft", id: "messer" }, h: "Herstellen → Messer: 10 Holz, 10 Stein, 20 Metall. +32 Kampfpunkte.", page: "herstellen" },
      { id: "k5_siege", l: "Gewinne insgesamt 6 Kämpfe", g: { t: "kill", n: 6 }, h: "Wilde Hunde, Plünderer vor den Höhlen. Kämpfen kostet Energie – vorher ausschlafen.", page: "kaempfen" },
      { id: "k5_gold", l: "Spare 100 Gold", g: { t: "gold", n: 100 }, h: "Gold gibt es für Quests, Aufgaben und Kämpfe; Händler kaufen Rohstoffe an. Du brauchst es für den Stamm.", page: "handeln" },
      { id: "k5_steinspeer", l: "Stelle einen Steinspeer her", g: { t: "craft", id: "steinspeer" }, h: "Herstellen → Steinspeer: 100 Holz, 25 Stein, 1 Wasser, 1 Nahrung.", page: "herstellen" },
    ] },
    { t: "Vorräte und ein Steinhaus", tasks: [
      { id: "k6_lager", l: "Baue das Privatlager", g: { t: "lager" }, h: "Haus → Privatlager bauen (50 Holz, 50 Stein). Nur im Ruinencamp.", loc: "camp", page: "haus" },
      { id: "k6_einlagern", l: "Lagere 50 Holz im Privatlager ein", g: { t: "lagerN", k: "Holz", n: 50 }, h: "Haus → Lager → Holz einlagern. Was im Lager liegt, zählt im Ruinencamp beim Bauen mit.", loc: "camp", page: "haus" },
      { id: "k6_notverpf", l: "Stelle eine Notverpflegung her", g: { t: "craft", id: "notverpflegung" }, h: "Herstellen → Notverpflegung (3 Holz, 2 Wasser) gibt 10 Nahrung für den Vorrat.", page: "herstellen" },
      { id: "k6_tl2", l: "Erreiche Techlevel 2 (250 EP)", g: { t: "tl", n: 2 }, h: "Ab TL2: Erzader, Glasschmelze, Kräuterfeld und die Spitzhacke.", page: "status" },
      { id: "k6_steinhaus", l: "Baue ein kleines Steinhaus", g: { t: "house", id: "steinhaus_k" }, h: "Haus → kleines Steinhaus: 120 Holz, 25 Kunststoff, 100 Stein, 45 Metall, 40 Nahrung, 5 Wasser. Lager 10.000 je Rohstoff. Wiki: kein Upgrade — sammle zuerst alles (gern im Privatlager), dann Haus → „Haus einreißen“ und neu bauen. Der Lagerinhalt zählt beim Neubau mit, das Lager selbst baust du danach neu.", cost: { Holz: 120, Kunststoff: 25, Stein: 100, Metall: 45, Nahrung: 40, Wasser: 5 }, loc: "camp", page: "haus" },
    ] },
    { t: "Werkzeug und Bodenschätze", tasks: [
      { id: "k7_hacke", l: "Stelle eine Spitzhacke her", g: { t: "craft", id: "spitzhacke" }, h: "Herstellen → Spitzhacke (10 Holz, 15 Metall, TL2). Damit gräbst du auf hartem Boden.", page: "herstellen" },
      { id: "k7_hart", l: "Grabe auf hartem Boden", g: { t: "cnt", k: "digHart", n: 1 }, h: "Felsboden-Felder (Graben zeigt den Boden an) brauchen die Spitzhacke. Mit N/O/S/W ein passendes Feld suchen.", page: "graben" },
      { id: "k7_erz", l: "Reise zur Erzader", g: { t: "visit", loc: "erzfeld" }, h: "Erzader (95/125). Erzsammler bauen dort Erz ab.", loc: "erzfeld" },
      { id: "k7_glas", l: "Reise zur Glasschmelze", g: { t: "visit", loc: "glasschmelze" }, h: "Glasschmelze (75/75). Glasschmelzer machen aus Sand Glas.", loc: "glasschmelze" },
      { id: "k7_tl3", l: "Erreiche Techlevel 3 (400 EP)", g: { t: "tl", n: 3 }, h: "Ab TL3: Werkzeugmacher (Schaufel), Ringhöhle, Edelmetall-Schacht.", page: "status" },
    ] },
    { t: "Einen Stamm gründen", tasks: [
      { id: "k8_kosten", l: "Lege die Gründungskosten bereit", g: { t: "cost", cost: STAMM_FOUND_COST }, h: "50 Holz, 30 Stein, 20 Metall, 100 Gold (dazu ein eigenes Haus und 25 EP).", page: "rucksack" },
      { id: "k8_kraft", l: "Steigere Kraft auf 3", g: { t: "attr", k: "Kraft", n: 3 }, h: "Status → Kraft „Go!“. Das Forschungsgrundstück braucht Kraft 3.", page: "status" },
      { id: "k8_int", l: "Steigere Intelligenz auf 2", g: { t: "attr", k: "Intelligenz", n: 2 }, h: "Status → Intelligenz „Go!“. Das Forschungsgebäude braucht Intelligenz 2.", page: "status" },
      { id: "k8_gruenden", l: "Gründe einen Stamm", g: { t: "stamm" }, h: "Rechts unter Stamm → Gründung. Name eingeben, „gründen“.", page: "gruendung" },
      { id: "k8_grund", l: "Baue das Forschungsgrundstück", g: { t: "sgeb", id: "forschungsgrund" }, h: "Bauoptionen → Stammgebäude → Forschungsgrundstück (50 Stein, 10 Sand). Bauzeit 3 Minuten. Researchlevel 1.", page: "stammgeb" },
    ] },
    { t: "Forschung im Stamm", tasks: [
      { id: "k9_geb", l: "Baue das Forschungsgebäude", g: { t: "sgeb", id: "forschungsgeb" }, h: "Stammgebäude → Forschungsgebäude (50 Holz, 20 Kunststoff, 30 Stein, 2 Sand). Researchlevel 2.", page: "stammgeb" },
      { id: "k9_tl4", l: "Erreiche Techlevel 4 (550 EP)", g: { t: "tl", n: 4 }, h: "Ab TL4: Forscher, Uransammler, Tierfänger.", page: "status" },
      { id: "k9_forscher", l: "Lerne den Beruf Forscher", g: { t: "job", list: ["Forscher"] }, h: "Fähigkeiten → TL 4 → Forscher. Nur Forscher arbeiten im Forschungsgebäude (Wiki).", page: "faehigkeiten" },
      { id: "k9_forschen", l: "Forsche 3× im Forschungsgebäude", g: { t: "act", a: "forschung_stamm", n: 3 }, loc: "camp", h: "Im Ruinencamp (dort steht das Forschungsgebäude): Stamm → Forschung → „forschen“. Jeder Gang: 3 + Intelligenz Researchpunkte.", page: "forschung" },
      { id: "k9_rl3", l: "Bringe den Stamm auf Researchlevel 3", g: { t: "rl", n: 3 }, h: "Weiter forschen. Researchlevel 3 öffnet Kunststoffschmelze und Erzverarbeitung.", page: "forschung" },
    ] },
    { t: "Veteran der Endzeit", tasks: [
      { id: "k10_rep", l: "Sammle 10 Reiseerfahrung", g: { t: "rep", n: 10 }, h: "Je 10 gereiste Felder gibt es 1 Reiseerfahrung (Wiki). Landkarte oder N/O/S/W.", page: "landkarte" },
      { id: "k10_siege", l: "Gewinne insgesamt 20 Kämpfe", g: { t: "kill", n: 20 }, h: "Rivalenlager, Höhlen, Tiergebiet.", page: "kaempfen" },
      { id: "k10_schmelze", l: "Baue die Kunststoffschmelze", g: { t: "sgeb", id: "kunststoffschmelze" }, h: "Stammgebäude → Kunststoffschmelze (30 Holz, 40 Stein, 80 Metall, 1 Sand; Researchlevel 3, Intelligenz 3).", page: "stammgeb" },
      { id: "k10_tl5", l: "Erreiche Techlevel 5 (700 EP)", g: { t: "tl", n: 5 }, h: "Ab TL5: Pilzsammler, Gärtner, Mechaniker.", page: "status" },
      { id: "k10_grosshaus", l: "Baue ein großes Steinhaus", g: { t: "house", id: "steinhaus_g" }, h: "Haus → großes Steinhaus: 500 Holz, 100 Kunststoff, 200 Stein, 80 Metall, 100 Nahrung, 20 Wasser. Das sind mehr als in den Rucksack passen: erst im Privatlager sammeln, dann Haus → „Haus einreißen“ und neu bauen (Lagerinhalt zählt mit).", cost: { Holz: 500, Kunststoff: 100, Stein: 200, Metall: 80, Nahrung: 100, Wasser: 20 }, loc: "camp", page: "haus" },
    ] },
  ];
  // Belohnungen (DESIGN): je Aufgabe EP und Gold, je Kapitel zusätzlich CP.
  function p7TaskReward(ci) { return { ep: 2 + ci, gold: 3 * (ci + 1) }; }
  function p7ChapterReward(ci) { return { ep: 10 + 5 * (ci + 1), cp: 5, gold: 20 * (ci + 1) }; }
  function p7AttrSum(s) { return ATTRS.reduce((n, a) => n + (s.attrs[a] || 0), 0); }
  function p7HouseRank(s) { const d = houseDef(s); return d ? HOUSES.indexOf(d) : -1; }
  /** [aktuell, Ziel] eines Aufgabenziels */
  function p7Progress(s, g) {
    const p = p7(s); const gd = s.guide || {};
    switch (g.t) {
      case "inv": return [Math.max(0, s.inv[g.k] || 0), g.n];
      case "crafts": return [g.ids.filter((id) => p7Progress(s, { t: "craft", id })[0] >= 1).length, g.ids.length];
      case "need": { const ks = Object.keys(g.cost); return [ks.filter((k) => (s.inv[k] || 0) >= g.cost[k]).length, ks.length]; }
      case "craft": { const c = CRAFTS.find((x) => x.id === g.id); const made = p.crafted[g.id] || 0; const owns = g.id !== "notverpflegung" && c && Object.keys(c.result).some((k) => (s.inv[k] || 0) > 0); return [made > 0 || owns ? 1 : 0, 1]; }
      case "house": return [p7HouseRank(s) >= HOUSES.findIndex((h) => h.id === g.id) ? 1 : 0, 1];
      case "lager": return [s.house && s.house.lagerBuilt ? 1 : 0, 1];
      case "lagerN": return [Math.min(g.n, (s.house && s.house.lager && s.house.lager[g.k]) || 0), g.n];
      case "act": return [p.acts[g.a + (g.at ? "@" + g.at : "")] || 0, g.n];
      case "kill": return [g.e ? (s.kills[g.e] || 0) : Object.keys(s.kills || {}).reduce((n, k) => n + (s.kills[k] || 0), 0), g.n];
      case "quest": return [s.quests[g.q] && s.quests[g.q].claimed ? 1 : 0, 1];
      case "cave": return g.key ? [s.cavesVisited && s.cavesVisited[g.key] ? 1 : 0, 1] : [Object.keys(s.cavesVisited || {}).length, g.n];
      case "visit": return [p.visited[g.loc] || s.locId === g.loc ? 1 : 0, 1];
      case "tl": return [Math.min(g.n, s.techlevel || 0), g.n];
      case "gold": return [s.gold, g.n];
      case "cpSpent": return [Math.max(0, p7AttrSum(s) - (gd.attrBase || 0)), g.n];
      case "attr": return [s.attrs[g.k] || 0, g.n];
      case "job": return [g.list.includes(s.job) ? 1 : 0, 1];
      case "cnt": return [p.cnt[g.k] || 0, g.n];
      case "stamm": return [s.stamm ? 1 : 0, 1];
      case "sgeb": return [stammHas(s, g.id) ? 1 : 0, 1];
      case "rl": { const st = stammOf(s); return [st ? Math.min(g.n, st.rl || 0) : 0, g.n]; }
      case "cost": { const ks = Object.keys(g.cost); return [ks.filter((k) => (k === "gold" ? s.gold : s.inv[k] || 0) >= g.cost[k]).length, ks.length]; }
      case "rep": return [s.rep || 0, g.n];
    }
    return [0, 1];
  }
  function p7Met(s, g) { const pr = p7Progress(s, g); return pr[0] >= pr[1]; }
  function p7ProgText(s, task) {
    const g = task.g; const pr = p7Progress(s, g);
    if (g.t === "need") { const miss = Object.keys(g.cost).filter((k) => (s.inv[k] || 0) < g.cost[k]).map((k) => k + " " + (s.inv[k] || 0) + "/" + g.cost[k]); return miss.length ? miss.join(" · ") : "alles beisammen"; }
    if (g.t === "crafts") return pr[0] + "/" + pr[1] + " hergestellt";
    if (pr[1] <= 1) return pr[0] >= 1 ? "erledigt" : "offen";
    const unit = g.t === "inv" || g.t === "lagerN" ? " " + g.k : g.t === "gold" ? " Gold" : g.t === "kill" ? " Siege" : g.t === "cost" ? " Posten" : g.t === "rep" ? " REP" : g.t === "tl" ? " TL" : g.t === "rl" ? " RL" : "";
    return Math.min(pr[0], pr[1]) + "/" + pr[1] + unit;
  }
  function p7GuideInit(s) {
    if (s.guide && typeof s.guide.ch === "number") return false;
    const fresh = (s.ep || 0) === 0 && !s.house && !Object.keys(s.inv || {}).some((k) => k !== "Nahrung" && k !== "Wasser" && s.inv[k] > 0);
    s.guide = { ch: 0, done: {}, chDone: {}, attrBase: p7AttrSum(s), migrated: !fresh };
    if (!fresh) {
      // Bestehender Spielstand: bereits Erfülltes still abhaken (ohne Belohnung), damit niemand doppelt belohnt wird.
      for (let ci = 0; ci < GUIDE.length; ci++) {
        let all = true;
        GUIDE[ci].tasks.forEach((t) => { if (p7Met(s, t.g)) s.guide.done[t.id] = 1; else all = false; });
        if (all) { s.guide.chDone[ci] = 1; s.guide.ch = ci + 1; } else break;
      }
    }
    // Die alte Einführung ist jetzt Teil des Leitfadens.
    if (s.quests && s.quests.einfuehrung && s.flags && s.flags.tutorial_done) { s.quests.einfuehrung.status = "done"; s.quests.einfuehrung.claimed = true; }
    return true;
  }
  function p7UnlockSchrott(s) {
    if (s.flags.tutorial_done) return;
    s.flags.tutorial_done = true; setChain(s, "tutorial", 5);
    if (s.quests && s.quests.einfuehrung) { s.quests.einfuehrung.status = "done"; s.quests.einfuehrung.claimed = true; }
    p6Log("Das Schrottfeld (60/120) ist jetzt erreichbar: dort gibt es Metall und Kunststoff.", "good");
  }
  /** Prüft die Aufgaben, hakt ab, vergibt Belohnungen. true = etwas hat sich geändert. */
  function p7GuideTick() {
    const s = state;
    if (!s || s.dead || !s.attrs) return false;
    p7(s);
    let changed = p7GuideInit(s);
    const g = s.guide;
    let guard = 0;
    while (g.ch < GUIDE.length && guard++ <= GUIDE.length) {
      const ci = g.ch; const ch = GUIDE[ci];
      const firstFour = ch.tasks.slice(0, 4);
      firstFour.forEach((t) => {
        if (!g.done[t.id] && p7Met(s, t.g)) {
          g.done[t.id] = 1; changed = true;
          const r = p7TaskReward(ci); s.ep += r.ep; s.gold += r.gold;
          const msg = "Aufgabe erledigt: " + t.l + ". +" + r.ep + " EP, +" + r.gold + " Gold.";
          p6Log(msg, "good"); g.last = { text: msg, at: Date.now() }; // am Ergebnis vorbei: steht im Aufgaben-Kasten
        }
      });
      const ready = firstFour.every((t) => g.done[t.id]);
      if (ci === 0 && ch.tasks.slice(0, 3).every((t) => g.done[t.id])) p7UnlockSchrott(s); // Durchgang 8: schon nach Aufgabe 1–3
      const fin = ch.tasks[4];
      if (ready && !g.done[fin.id] && p7Met(s, fin.g)) {
        g.done[fin.id] = 1; g.chDone[ci] = 1; g.ch = ci + 1; changed = true;
        const r = p7TaskReward(ci); const cr = p7ChapterReward(ci);
        s.ep += r.ep + cr.ep; s.gold += r.gold + cr.gold; s.cp += cr.cp;
        const msg = "Kapitel " + (ci + 1) + " abgeschlossen: „" + ch.t + "“. +" + (r.ep + cr.ep) + " EP, +" + (r.gold + cr.gold) + " Gold, +" + cr.cp + " CP.";
        p6Log(msg, "good"); g.last = { text: msg, at: Date.now() }; // am Ergebnis vorbei: steht im Aufgaben-Kasten
        continue;
      }
      break;
    }
    if (changed) save({ quiet: true });
    return changed;
  }
  const P7_PAGE_NAMES = { arbeiten: "Arbeiten", herstellen: "Herstellen", haus: "Haus", wassersuche: "Wassersuche", nahrungssuche: "Nahrungssuche", rucksack: "Rucksack", jagen: "Jagen", schlafen: "Schlafen",
    graben: "Graben", erkunden: "Erkunden", status: "Status", faehigkeiten: "Fähigkeiten", kaempfen: "Kämpfen", handeln: "Handeln", gruendung: "Stamm gründen",
    stammgeb: "Stammgebäude", forschung: "Forschung", landkarte: "Landkarte" };
  function p7TaskLinks(t) {
    const bits = [];
    if (t.loc && state.locId !== t.loc) { const l = LOCATIONS.find((x) => x.id === t.loc); if (l) bits.push(origLink("hin: " + l.name + " (" + l.x + "/" + l.y + ")", 'data-loc="' + t.loc + '"')); }
    if (t.page && t.page !== "aufgaben") bits.push(origLink(P7_PAGE_NAMES[t.page] || t.page, 'data-page="' + t.page + '"'));
    return bits.length ? '<span class="p7-links">' + bits.join(" · ") + "</span>" : "";
  }
  function p7Current(s) {
    const g = s.guide; if (!g || g.ch >= GUIDE.length) return null;
    const ch = GUIDE[g.ch];
    const open = ch.tasks.slice(0, 4).filter((t) => !g.done[t.id]);
    return { ci: g.ch, ch, task: open[0] || ch.tasks[4], open };
  }
  function p7GuideBoxHtml() {
    const s = state; const cur = p7Current(s);
    let h = '<div class="mbox p7-guide"><h3>Aufgaben</h3>';
    if (!cur) return h + '<p class="p7-small">Alle ' + GUIDE.length + " Kapitel geschafft.</p>" + '<a class="p7-all" href="#" data-page="aufgaben">Übersicht</a></div>';
    const g = s.guide; const ready = cur.ch.tasks.slice(0, 4).every((t) => g.done[t.id]);
    h += '<p class="p7-chap">Kapitel ' + (cur.ci + 1) + "/" + GUIDE.length + ": " + origEsc(cur.ch.t) + "</p><ul>";
    cur.ch.tasks.forEach((t, i) => {
      const done = !!g.done[t.id]; const cls = done ? "done" : (i === 4 && !ready) ? "locked" : t === cur.task ? "now" : "";
      h += '<li class="p7-task ' + cls + '"><span class="p7-mark">' + (done ? "✔" : i === 4 ? "★" : "•") + "</span> " + origEsc(t.l) +
        (done ? "" : ' <span class="p7-prog">' + origEsc(p7ProgText(s, t)) + "</span>") + "</li>";
    });
    h += "</ul>";
    if (g.last && Date.now() - g.last.at < 15000) h += '<p class="p7-new">' + origEsc(g.last.text) + "</p>";
    h += '<p class="p7-hint">' + origEsc(p8HintText(cur.task)) + "</p>" + p7TaskLinks(cur.task) + '<a class="p7-all" href="#" data-page="aufgaben">Alle Aufgaben</a></div>';
    return h;
  }
  function p7GuideMiniHtml() {
    const s = state; const cur = p7Current(s);
    if (!cur) return "";
    const g = s.guide;
    const nDone = cur.ch.tasks.filter((t) => g.done[t.id]).length;
    return '<div class="p7-mini m-only"><a href="#" data-page="aufgaben"><b>Aufgabe:</b> ' + origEsc(cur.task.l) + ' <span class="p7-prog">' + origEsc(p7ProgText(s, cur.task)) + "</span>" +
      ' <span class="p7-small">Kapitel ' + (cur.ci + 1) + " · " + nDone + "/5 ›</span></a>" +
      (g.last && Date.now() - g.last.at < 15000 ? '<p class="p7-new">' + origEsc(g.last.text) + "</p>" : "") + "</div>";
  }
  function p7AufgabenPage() {
    const s = state; p7GuideTick();
    const g = s.guide; const cur = p7Current(s);
    let h = "<h2>Aufgaben</h2><p>Der Leitfaden führt in " + GUIDE.length + " Kapiteln durch das Spiel. Die ersten vier Aufgaben eines Kapitels gehen in beliebiger Reihenfolge, die fünfte (★) schließt das Kapitel ab. " +
      "Belohnung je Aufgabe: EP und Gold, je Kapitel zusätzlich 5 CP (DESIGN). Der Fortschritt wird automatisch erkannt.</p>";
    if (g.migrated) h += '<p class="muted">Bestehender Spielstand: bereits Erfülltes wurde ohne Belohnung abgehakt.</p>';
    GUIDE.forEach((ch, ci) => {
      const isCur = cur && cur.ci === ci; const done = !!g.chDone[ci]; const future = !done && !isCur;
      const ready = ch.tasks.slice(0, 4).every((t) => g.done[t.id]);
      const r = p7ChapterReward(ci);
      h += '<details class="p7-ch' + (isCur ? " now" : done ? " done" : " future") + '"' + (isCur ? " open" : "") + "><summary>" + (done ? "✔ " : isCur ? "▶ " : "") +
        "Kapitel " + (ci + 1) + ": " + origEsc(ch.t) + ' <span class="p7-small">' + ch.tasks.filter((t) => g.done[t.id]).length + "/5</span></summary><ol>";
      ch.tasks.forEach((t, i) => {
        const td = !!g.done[t.id]; const tr = p7TaskReward(ci);
        h += '<li class="' + (td ? "done" : (i === 4 && !ready) || future ? "locked" : "") + '"><b>' + (td ? "✔ " : "") + origEsc(t.l) + "</b>" +
          (td ? "" : ' <span class="p7-prog">' + origEsc(p7ProgText(s, t)) + "</span>") +
          '<br><span class="muted">' + origEsc(td ? t.h : p8HintText(t)) + "</span>" + (!td && !future ? "<br>" + p7TaskLinks(t) : "") +
          ' <span class="p7-small">Belohnung: +' + tr.ep + " EP, +" + tr.gold + " Gold</span></li>";
      });
      h += '</ol><p class="p7-small">Kapitelbelohnung: +' + r.ep + " EP, +" + r.gold + " Gold, +" + r.cp + " CP</p></details>";
    });
    // Nebenquests: im Original-Layout gab es keinen Einlöse-Knopf → hier.
    h += "<h3>Nebenquests</h3>";
    QUESTS.filter((q) => !q.chain && !q.chainId && q.id !== "einfuehrung").forEach((q) => {
      const st = s.quests[q.id] || {};
      const ok = q.check(s);
      let prog = "offen";
      try { if (q.progress) prog = String(q.progress(s)); } catch (e) { prog = "offen"; }
      const act = st.claimed ? "eingelöst ✔" : ok ? origLink("einlösen", 'data-quest="' + q.id + '"') : '<span class="muted">' + origEsc(prog) + "</span>";
      h += "<p><b>" + origEsc(q.title) + "</b> — " + origEsc(q.desc || "") + " " + act + "</p>";
    });
    return h;
  }

  // ---------- Erkunden ----------
  function p7ErkChances(s) {
    const dyn = s.attrs.Dynamik || 1, wahr = s.attrs.Wahrnehmung || 1;
    let disc = 0.18 + 0.01 * (dyn - 1) + 0.005 * (wahr - 1); // DESIGN: früh ~18 %; WIKI: Dynamik beeinflusst die Erkunden-Chance
    const horse = activePet(s);
    if (horse && horse.type === "Pferd") disc *= 1.25; // WIKI: Pferd "optimal um Länder zu erkunden"; Faktor DESIGN
    disc = Math.min(0.45, disc);
    const find = Math.min(0.6, 0.4 + 0.01 * (wahr - 1) + 0.005 * (dyn - 1)); // DESIGN: kleine Funde
    return { disc, find, trace: 0.35 };
  }
  function p7DiscCandidates(s) {
    const pos = p7Pos(s); const p = p7(s);
    return LOCATIONS.filter((l) => l.id !== "camp" && !p.found[l.id] && !p.visited[l.id] && placeOpen(l))
      .map((l) => ({ l, d: Math.abs(l.x - pos.x) + Math.abs(l.y - pos.y) })).filter((o) => o.d > 0 && o.d <= 40)
      .sort((a, b) => a.d - b.d);
  }
  function p7FindPool(s) {
    const pos = p7Pos(s); const pl = placeAt(pos.x, pos.y) || (s.locId !== "field" ? LOCATIONS.find((l) => l.id === s.locId) : null);
    const acts = (pl && pl.actions) || [];
    if (acts.includes("holz")) return [["Holz", 1, 3, 5], ["Knochen", 1, 1, 1], ["Stein", 1, 1, 1]];
    if (acts.includes("stein")) return [["Stein", 1, 3, 5], ["Sand", 1, 2, 2], ["Kronkorken", 1, 1, 1]];
    if (acts.includes("metall") || acts.includes("kunststoff")) return [["Metall", 1, 2, 3], ["Kunststoff", 1, 2, 3], ["Kronkorken", 1, 3, 2]];
    if (acts.includes("wasser")) return [["Wasser", 5, 12, 4], ["Holz", 1, 2, 1], ["Nahrung", 3, 6, 1]];
    if (acts.includes("sand")) return [["Sand", 2, 4, 5], ["Knochen", 1, 1, 1], ["Kronkorken", 1, 2, 1]];
    const g = groundAt(pos.x, pos.y);
    if (g === "hart") return [["Stein", 1, 2, 4], ["Metall", 1, 1, 1], ["Kronkorken", 1, 2, 1]];
    if (g === "glas") return [["Sand", 1, 3, 3], ["Kristall", 1, 1, 1]];
    return [["Holz", 1, 2, 3], ["Stein", 1, 1, 2], ["Kronkorken", 1, 2, 2], ["Knochen", 1, 1, 1], ["Sand", 1, 2, 1], ["Nahrung", 3, 6, 1]];
  }
  function p7Erkunden() {
    if (!state || state.dead) return;
    if (sleepUi) { showResult(SLEEP_MSG, true); renderAll(); return; }
    if (busy) { showResult("Erst die laufende Aktion beenden.", true); renderAll(); return; }
    origPage = "erkunden";
    if (blockIfExhausted()) return;
    busy = true; workUi = { aid: "erkunden", n: 1, i: 0, pct: 0 };
    clearResults(); setStatus("Erkunden…"); renderAll();
    runProgress(P7_ERK_MS, () => { workUi = null; busy = false; setProgress(0); setStatus("Bereit."); p7ErkundenFinish(); });
  }
  function p7ErkundenFinish() {
    const s = state; if (!s || s.dead) return;
    const p = p7(s); const pos = p7Pos(s);
    const f0 = s.fatigue || 0, e0 = curEnergy(s);
    const before = invSnapshot(s);
    const ch = p7ErkChances(s);
    let msg, kind = "nichts";
    const cands = p7DiscCandidates(s);
    if (cands.length && Math.random() < ch.disc) {
      const pick = cands[rand(0, Math.min(2, cands.length - 1))].l;
      p.found[pick.id] = 1; s.ep += 3; kind = "entdeckt";
      msg = "Entdeckung! Spuren führen zu " + pick.name + ": " + (Math.abs(pick.x - pos.x) + Math.abs(pick.y - pos.y)) + " Felder " + p7Dir(pick.x - pos.x, pick.y - pos.y) + " (" + pick.x + "/" + pick.y + "). +3 EP.";
    } else if (Math.random() < ch.find) {
      const it = weighted(p7FindPool(s).map((r) => ({ item: r[0], n: rand(r[1], r[2]), w: r[3] })));
      addInv(s, it.item, it.n); kind = "fund";
      msg = "Fund: " + it.n + "× " + it.item + ".";
    } else if (Math.random() < ch.trace) {
      const near = LOCATIONS.filter((l) => l.id !== s.locId).map((l) => ({ l, d: Math.abs(l.x - pos.x) + Math.abs(l.y - pos.y) })).sort((a, b) => a.d - b.d)[rand(0, 2)];
      const cave = LOCATIONS.filter((l) => (l.tags || []).includes("Höhle") && l.id !== s.locId).map((l) => ({ l, d: Math.abs(l.x - pos.x) + Math.abs(l.y - pos.y) })).sort((a, b) => a.d - b.d)[0];
      const t = rand(0, 2);
      kind = "spur";
      if (t === 0 && cave) msg = "Spur: Alte Fußspuren führen " + p7Dir(cave.l.x - pos.x, cave.l.y - pos.y) + " Richtung " + cave.l.name + " (" + cave.l.x + "/" + cave.l.y + ").";
      else if (t === 1) msg = "Spur: Hundespuren im Sand. Wilde Hunde jagen hier in der Gegend (Jagen/Kämpfen).";
      else msg = "Spur: Ein verrostetes Schild zeigt " + p7Dir(near.l.x - pos.x, near.l.y - pos.y) + " nach " + near.l.name + " (" + near.d + " Felder).";
    } else msg = "Nichts gefunden.";
    p7ShowAt = 0; // eigene Kostenzeile unten
    exert("work"); p7Pending = null;
    msg += afterWork(before);
    const df = (s.fatigue || 0) - f0, de = curEnergy(s) - e0;
    const cost = "Energie " + (de >= 0 ? "+" : "−") + Math.abs(de) + " · Müdigkeit +" + df;
    p.erkHist.unshift({ t: Date.now(), x: pos.x, y: pos.y, f: p7FieldName(pos.x, pos.y), k: kind, r: msg, c: cost });
    p.erkHist.length = Math.min(p.erkHist.length, P7_HIST_MAX);
    p7Count("erk");
    log(msg, kind === "nichts" ? "bad" : "good");
    origPage = "erkunden";
    showResult(msg + " · Müdigkeit +" + df + " (jetzt " + (s.fatigue || 0) + " %), Energie " + (de >= 0 ? "+" : "−") + Math.abs(de) + " (jetzt " + curEnergy(s) + " %)", kind === "nichts");
    maybeUnlockTL(); save({ quiet: true }); renderAll();
  }
  function p7Move(dx, dy, back) {
    const s = state;
    if (!s || s.dead) return;
    if (sleepUi) { showResult(SLEEP_MSG, true); renderAll(); return; }
    if (busy) { showResult("Erst die laufende Aktion beenden.", true); renderAll(); return; }
    const pos = p7Pos(s); const tx = pos.x + dx, ty = pos.y + dy;
    const pl = placeAt(tx, ty);
    if (pl && !placeOpen(pl)) { origPage = back; showResult(pl.name + ": " + placeGate(pl).text + ".", true); renderAll(); return; }
    clickField(tx, ty);
    origPage = back;
    if (resultLines.length) resultPage = back;
    renderAll();
  }
  function p7NavHtml(back) {
    const b = (lbl, dx, dy, t) => '<a href="#" class="p7-nav-b" data-x="p7move|' + dx + "|" + dy + "|" + back + '" title="' + t + '" aria-label="' + t + '">' + lbl + "</a>";
    return '<div class="p7-nav"><span></span>' + b("N", 0, -1, "ein Feld nach Norden") + "<span></span>" + b("W", -1, 0, "ein Feld nach Westen") +
      '<a href="#" class="p7-nav-map" data-page="landkarte" title="Landkarte">Karte</a>' + b("O", 1, 0, "ein Feld nach Osten") + "<span></span>" + b("S", 0, 1, "ein Feld nach Süden") + "<span></span></div>";
  }
  function p7HereHtml(withGround) {
    const pos = p7Pos(state); const g = groundAt(pos.x, pos.y);
    return '<div class="p7-here"><div class="p7-here-t"><p><b>Standort:</b> ' + origEsc(p7FieldName(pos.x, pos.y)) + " " + pos.x + "/" + pos.y + "</p>" +
      (withGround ? "<p><b>Boden:</b> " + origEsc(p7GroundText(g)) + "</p>" : "") +
      '<p class="p7-small">N/O/S/W: ' + origEsc(p7CostText("move")) + "</p><p>" + origLink("Landkarte öffnen", 'data-page="landkarte"') + "</p></div>" + p7NavHtml(origPage) + "</div>";
  }
  function p7HistTable(list) {
    if (!list.length) return '<p class="muted">Noch keine Einträge.</p>';
    return '<table class="p7-hist"><tr><th>Zeit</th><th>Feld</th><th>Ergebnis</th><th>Kosten</th></tr>' + list.map((e) =>
      "<tr><td>" + p7Time(e.t) + "</td><td>" + origEsc(e.f) + " " + p8XYLink(e.x, e.y, origPage) + "</td><td>" + p8Coords(origEsc(e.r), origPage) + "</td><td>" + origEsc(e.c) + "</td></tr>").join("") + "</table>";
  }
  function p7ErkundenPage() {
    const s = state; const p = p7(s); const ch = p7ErkChances(s);
    const active = workUi && workUi.aid === "erkunden";
    const cands = p7DiscCandidates(s).length;
    let h = "<h2>Erkunden</h2>" + origLive() +
      '<div class="p7-pic"><a href="#" data-page="landkarte"><img src="assets/map/karte-welt.jpg" alt="Landkarte" class="p7-art"></a></div>' + p7HereHtml(false);
    h += active ? '<div class="work-row"><p>Erkunden…</p><div class="work-bar"><i style="width:' + Math.round(workUi.pct || 0) + '%"></i></div></div>'
      : '<p class="p7-btnrow"><a href="#" class="p7-btn" data-x="p7erk">Erkunden</a> <span class="p7-cost">' + origEsc(p7CostText("erkunden")) + "</span></p>";
    h += "<p>Chancen je Versuch: <b>Entdeckung " + Math.round(ch.disc * 100) + " %</b>" + (cands ? " (" + cands + " unentdeckte Orte in 40 Feldern)" : " (in der Nähe ist alles entdeckt)") +
      " · <b>kleiner Fund " + Math.round(ch.find * 100) + " %</b> · sonst Spuren oder nichts.</p>";
    h += '<p class="muted">Erkunden durchsucht dein Feld: Du entdeckst nahe Orte (einmalig +3 EP, mit Richtung und Koordinaten), findest Kleinigkeiten passend zum Gelände (Wald: Holz, Steinbruch: Stein, Schrottfeld: Metall/Kunststoff, Oase: Wasser, Felsboden: Stein) ' +
      "oder Spuren zu Höhlen und Orten. Dynamik erhöht die Entdeckungschance (Wiki: „beeinflusst die Erfolgschance beim Erkunden“), Wahrnehmung die Fundchance, ein Pferd ×1,25 (DESIGN). Entdeckt: " + Object.keys(p.found).length + " Orte.</p>";
    h += "<h3>Verlauf (letzte " + P7_HIST_MAX + ")</h3>" + p7HistTable(p.erkHist);
    return h;
  }

  // ---------- Graben ----------
  function p7Dig(n) {
    const s = state;
    if (!s || s.dead) return;
    if (sleepUi) { showResult(SLEEP_MSG, true); renderAll(); return; }
    if (busy) { showResult("Erst die laufende Aktion beenden.", true); renderAll(); return; }
    origPage = "graben";
    if (s.locId === "camp") { showResult("Im Ruinencamp kann man nicht graben. Geh ein Feld weiter (N/O/S/W).", true); renderAll(); return; }
    const pos = p7Pos(s); const g = groundAt(pos.x, pos.y);
    if (g === "glas" && !has(s, "Dynamit")) { p7DigHist(s, { ok: false, msg: "Glasboden: ohne Dynamit kein Graben." }, g); showResult("Glasboden. Hier brauchst du Dynamit (Wiki).", true); renderAll(); return; }
    if (g === "hart" && !has(s, "Spitzhacke") && digTool(s) !== "Greifer") { p7DigHist(s, { ok: false, msg: "Harter Boden: ohne Spitzhacke kein Graben." }, g); showResult("Harter Boden. Hier brauchst du eine Spitzhacke (Wiki).", true); renderAll(); return; }
    if (n > 1) runSequence("graben", n); else startAction("graben");
  }
  function p7GrabenPage() {
    const s = state; const p = p7(s);
    const pos = p7Pos(s); const g = groundAt(pos.x, pos.y);
    const active = workUi && workUi.aid === "graben";
    const tool = digTool(s);
    let h = "<h2>Graben</h2>" + origLive() + '<div class="p7-pic"><img src="assets/gfx/graben.jpg" alt="Grabloch mit Schaufel und Spitzhacke" class="p7-art"></div>' + p7HereHtml(true);
    const blocked = s.locId === "camp" ? "Im Ruinencamp kann man nicht graben – geh ein Feld weiter." : g === "glas" && !has(s, "Dynamit") ? "Glasboden: Dynamit nötig." : g === "hart" && !has(s, "Spitzhacke") && tool !== "Greifer" ? "Harter Boden: Spitzhacke nötig." : "";
    if (active) h += '<div class="work-row"><p>Graben ' + ((workUi.i || 0) + 1) + "/" + workUi.n + " " + xLink("abbrechen", "abort") + '</p><div class="work-bar"><i style="width:' + Math.round(workUi.pct || 0) + '%"></i></div></div>';
    else {
      [1, 5, 10].forEach((n) => { h += '<p class="p7-btnrow"><a href="#" class="p7-btn" data-x="p7dig|' + n + '">' + (n > 1 ? n + "× " : "") + "Graben</a> <span class=\"p7-cost\">" + origEsc(p7CostText("work", "graben", n)) + "</span></p>"; });
      if (blocked) h += '<p class="cant">' + origEsc(blocked) + "</p>";
    }
    h += "<p>Fundchance hier: <b>" + Math.round(digChance(s) * 100) + " %</b> · Dauer: <b>" + p7WorkSec("graben") + " s</b> · Werkzeug: <b>" + origEsc(tool || "keins") + "</b>" + (has(s, "Spitzhacke") ? " · Spitzhacke dabei" : "") + (has(s, "Dynamit") ? " · Dynamit " + s.inv.Dynamit : "") + "</p>";
    ["Schaufel", "Greifer"].forEach((t) => { if (has(s, t) && !(s.equip && s.equip.links === t)) h += "<p>" + xLink(t + " in die linke Hand", "left|" + t) + "</p>"; });
    if (has(s, "U-P-S Päckchen")) h += "<p>" + xLink("U-P-S Päckchen öffnen", "ups") + "</p>";
    h += '<h3>Was man findet</h3><p class="muted">Häufig Sand, Kronkorken und Knochen, seltener Metall und Edelmetall. Selten Wiki-Fundstücke: Eisenkette, Schriftrolle, Orangensaft, Benzinkanister, U-P-S Päckchen und Quest-Zutaten. Zusätzlich 12 % Chance auf einen Wiki-Gegenstand, den du noch nicht hast.</p>' +
      '<h3>Was wirkt</h3><ul class="p7-ul">' +
      "<li><b>Wahrnehmung</b> erhöht die Fundchance (Wiki: 70 % bei 3000 Wahrnehmung; Prototyp: 1 Punkt ≙ 100). Kleidung mit Wahrnehmungsbonus zählt mit.</li>" +
      "<li><b>Geschwindigkeit</b> verkürzt die Grabdauer (Wiki: 90 Minuten bei 0, nie unter 30 mit Schaufel).</li>" +
      "<li><b>Schaufel oder Greifer</b> in der linken Hand: schneller (ohne Werkzeug ×1,5 Dauer) und +1 bei Sand und Kronkorken.</li>" +
      "<li><b>Fähigkeiten</b> Flexibilität, Genauigkeit, Perfektion verbessern die Chance (Perfektion + 3000 Wahrnehmung = 100 %, Wiki).</li>" +
      "<li><b>Boden</b>: normaler Boden geht immer; <b>harter Boden</b> (Felsboden) braucht Spitzhacke oder Greifer; <b>Glasboden</b> (Glasfläche) braucht Dynamit, 1 Stück je Graben (Wiki). Benannte Orte haben normalen Boden. Im Ruinencamp wird nicht gegraben.</li>" +
      "<li><b>Kosten</b> je Graben: " + origEsc(p7CostText("work", "graben", 1)) + ". Ab 80 % Müdigkeit sinkt der Ertrag.</li></ul>";
    h += "<h3>Verlauf (letzte " + P7_HIST_MAX + ")</h3>" + p7HistTable(p.digHist);
    return h;
  }

  // ---------- Herstellen mit Bildern ----------
  const P7_WIKI_IMG = { Nahrung: "assets/rohstoffe/nahrung.gif", Benzin: "assets/rohstoffe/benzin.gif", Edelmetall: "assets/rohstoffe/edelmetall.gif",
    "Diamant (grün)": "assets/rohstoffe/diamantgruen.gif", "Diamant (blau)": "assets/rohstoffe/diamantblau.gif", "Diamant (rot)": "assets/rohstoffe/diamantrot.gif",
    Motorrad: "assets/gfx/vehicles/fahr1.gif", Hoverbike: "assets/gfx/vehicles/fahr2.gif" }; // WIKI-Grafiken aus dem Archiv
  function p7Slug(n) { return String(n).toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function p7ItemImg(name) { return P7_WIKI_IMG[name] || "assets/items/" + p7Slug(name) + ".png"; } // sonst: gezeichnetes Symbol (tools/gen_item_icons.py)
  const P7_USE = {
    Stock: "Erste Waffe, liegt automatisch in der Hand.", "Stock mit Stein": "Bessere Anfängerwaffe.", Messer: "Waffe mit Klinge.", Holzspeer: "Starke Holzwaffe.",
    Steinspeer: "Speer mit Steinspitze.", Metallspeer: "Speer mit Metallspitze.", Spitzhacke: "Graben auf hartem Boden (Wiki).", Schaufel: "Schneller graben, +1 Sand/Kronkorken (linke Hand).",
    "Edelmetall Schaufel": "Bessere Schaufel.", "Edelmetall Spitzhacke": "Bessere Spitzhacke.",
    Eimer: "Behälter (Sandbox).", Fernglas: "Spion-Werkzeug.", Papierentchen: "Quest-Gegenstand (Trauriges Mädchen).", Glas: "Rohstoff für Geräte und Bauten.",
    Wurfnetz: "Tiere fangen beim Jagen (rechte Hand).", Fangnetz: "Kleintiere fangen (rechte Hand).", Werkzeugkoffer: "Fahrzeuge bauen und reparieren.",
    Motorrad: "Fahrzeug: schneller reisen, Kampfbonus.", Hoverbike: "Fliegendes Fahrzeug.", Nahrung: "Füllt deinen Nahrungsbedarf (Rucksack → essen).",
    Heiltrank: "Heilt Verletzungen (mit Erste Hilfe).", Schere: "Schneider-Werkzeug.", Sandalen: "Kleidung für die Füße.", Fellhemd: "Kleidung für den Körper.",
    Ölbehälter: "Transport für Öl.", Gasbehälter: "Transport für Gas.", Urandetektor: "Findet Uran.", Diamantendetektor: "Findet Diamanten.", Erzdetektor: "Findet Erz.",
    Seil: "Quest- und Bauteil.", Dietrich: "Schlösser öffnen (Quests).", "leere Spritze": "Wird mit Gift gefüllt.", Radio: "Empfängt Nachrichten.", Holzkohle: "Zutat für Tränke.",
  };
  function p7UseText(c, name) {
    if (P7_USE[name]) return P7_USE[name] + (WEAPONS[name] ? " +" + WEAPONS[name].kp + " Kampfpunkte." : "");
    if (WEAPONS[name]) return "Waffe: +" + WEAPONS[name].kp + " Kampfpunkte.";
    if (POTIONS[name]) return POTIONS[name].desc + ".";
    if (CLOTHING[name]) return "Kleidung: +" + (CLOTHING[name].kp || 0) + " Kampfpunkte.";
    if (SHIELDS[name]) return "Schild: Verteidigung " + SHIELDS[name].def + " (linke Hand).";
    const ammoFor = Object.keys(AMMO_FOR).filter((w) => AMMO_FOR[w] === name);
    if (ammoFor.length) return "Munition für " + ammoFor.join(", ") + ".";
    const it = wikiByName(name);
    if (it && it.desc) return String(it.desc).slice(0, 160);
    return String(c.desc || "").replace(/\s*\((WIKI|DESIGN)[^)]*\)/g, "").replace(/^(WIKI|DESIGN)[^:]*:\s*/, "").slice(0, 160);
  }
  function p7CraftCard(c) {
    const s = state;
    const name = Object.keys(c.result)[0]; const nOut = c.result[name];
    const ok = canCraft(c); const pay = ok && canPay(s, c.cost) && (!c.goldCost || s.gold >= c.goldCost);
    const ing = Object.keys(c.cost).map((k) => {
      const have = k === "gold" ? s.gold : haveRes(s, k); const need = c.cost[k];
      return '<span class="p7-ing ' + (have >= need ? "ok" : "miss") + '">' + origEsc(k === "gold" ? "Gold" : k) + " " + have + "/" + need + "</span>";
    }).join(" ") + (c.goldCost ? ' <span class="p7-ing ' + (s.gold >= c.goldCost ? "ok" : "miss") + '">Gold ' + s.gold + "/" + c.goldCost + "</span>" : "");
    const btn = !ok ? '<span class="cant">' + origEsc(craftLockReason(c) || "gesperrt") + "</span>"
      : pay ? '<a href="#" class="p7-btn" data-craft="' + c.id + '">herstellen</a> <span class="p7-cost">' + origEsc(p7CostText("craft")) + "</span>" : '<span class="cant">es fehlt: ' + origEsc(missingText(s, c.cost)) + "</span>";
    return '<div class="p7-craft' + (pay ? " can" : ok ? "" : " lock") + '" data-recipe="' + c.id + '"><img src="' + p7ItemImg(name) + '" alt="' + origEsc(name) + '" width="40" height="40" loading="lazy"><div class="p7-craft-b">' +
      "<p><b>" + origEsc(c.label) + "</b>" + (nOut > 1 || name !== c.label ? ' <span class="p7-small">→ ' + nOut + "× " + origEsc(name) + "</span>" : "") + ' <span class="p7-small p7-own">im Rucksack: ' + (s.inv[name] || 0) + "</span></p>" +
      '<p class="p7-use">' + origEsc(p7UseText(c, name)) + "</p><p>" + ing + "</p><p>" + btn + "</p></div></div>";
  }
  function p7HerstellenPage() {
    const s = state; const tl = s.techlevel || 0;
    const main = CRAFTS.filter((c) => !c.chem && !c.erf && !c.wf && !c.needStammB);
    const now = main.filter((c) => canCraft(c));
    const later = main.filter((c) => !canCraft(c));
    let h = "<h2>Herstellen</h2><p>Beruf: " + origEsc(s.job) + " · Techlevel " + tl + ". Bei den Zutaten steht <b>hast/brauchst</b>" + (lagerOn(s) ? " (Privatlager zählt mit)" : "") + ".</p>";
    h += "<h3>Jetzt möglich (" + now.length + ")</h3>" + (now.map(p7CraftCard).join("") || '<p class="muted">Noch nichts.</p>');
    h += '<details class="p7-more"><summary>Gesperrt: Beruf oder Techlevel fehlt (' + later.length + ")</summary>" + later.map(p7CraftCard).join("") + "</details>";
    [["Chemieküche", "chemie", (c) => c.chem], ["Ideenschmiede", "ideenschmiede", (c) => c.erf], ["Waffenfabrik", "waffenfabrik", (c) => c.wf], ["Stammgebäude", "stammgeb", (c) => c.needStammB && !c.chem && !c.erf && !c.wf]].forEach(([title, page, f]) => {
      const list = CRAFTS.filter(f);
      if (list.length) h += '<details class="p7-more"><summary>' + title + " (" + list.length + ")</summary><p>" + origLink(title + " öffnen", 'data-page="' + page + '"') + "</p>" + list.map(p7CraftCard).join("") + "</details>";
    });
    h += '<p class="p7-small">Bilder: Rohstoffe und Fahrzeuge aus dem Wiki-Archiv; die übrigen Symbole sind für den Prototyp gezeichnet (DESIGN).</p>';
    return h;
  }
  // Bilder auch in den anderen Rezeptlisten (Chemieküche, Ideenschmiede, Waffenfabrik)
  const p7CraftRowBase = craftRowHtml;
  craftRowHtml = function (c) {
    const h = p7CraftRowBase(c);
    const name = c && c.result ? Object.keys(c.result)[0] : null;
    return name ? h.replace("<tr><td>", '<tr><td><img class="p7-ico" src="' + p7ItemImg(name) + '" alt="" width="32" height="32" loading="lazy"> ') : h;
  };

  // ---------- Eigenschaften: fehlende Wirkungen (Audit Durchgang 7) ----------
  // WIKI (Charakter/Eigenschaften): Kraft:Intelligenz sollte 3:1 sein, sonst "starke Einbußen bei Kämpfen". Faktor DESIGN.
  function p7RatioFactor(s) {
    const k = s.attrs.Kraft || 1, i = s.attrs.Intelligenz || 1;
    const need = k / 3;
    return i >= need ? 1 : Math.max(0.6, 0.6 + 0.4 * (i / need));
  }
  const p7PlayerKPBase = playerKP;
  playerKP = function (s) { const kp = p7PlayerKPBase(s); return Math.max(1, Math.floor(kp * p7RatioFactor(s))); };
  // WIKI: Wahrnehmung "Kleiderbonus" – voller Bonus ab 501 Wahrnehmung (Prototyp ×100 → 5,01). Untergrenze 50 % DESIGN.
  function p7ClothFactor(s) { return 0.5 + 0.5 * Math.min(1, ((s.attrs.Wahrnehmung || 1) * ATTR_SCALE) / 501); }
  const p7ClothingBonusBase = clothingBonus;
  clothingBonus = function (s) { return Math.round(p7ClothingBonusBase(s) * p7ClothFactor(s)); };
  // WIKI: Geschwindigkeit "beeinflusst wie schnell man ... sich auf der Karte bewegt". −3 % Reisezeit je Punkt über 1, höchstens −45 % (DESIGN).
  function p7TravelFactor(s) { return 1 - Math.min(0.45, 0.03 * Math.max(0, (s.attrs.Geschwindigkeit || 1) - 1)); }
  const p7TravelPlanBase = travelPlan;
  travelPlan = function (from, to) {
    const r = p7TravelPlanBase(from, to);
    if (state && r.note === "zu Fuß") { r.ms = Math.max(400, Math.round(r.ms * p7TravelFactor(state))); r.sec = Math.max(1, Math.round(r.ms / 1000)); }
    return r;
  };
  // WIKI: Geschwindigkeit "beeinflusst wie schnell man kämpft": Pause zwischen Kampfrunden 900 ms, −4 % je Punkt, mind. 450 ms (DESIGN).
  function p7FightDelay() { return state ? Math.max(450, Math.round(900 * (1 - 0.04 * Math.max(0, (state.attrs.Geschwindigkeit || 1) - 1)))) : 900; }
  // WIKI: Ausdauer "beeinflusst die Tränkeresistenz": Nebenwirkungen (Müdigkeit/Strahlung +) −3 % je Punkt über 1, höchstens −60 % (DESIGN).
  function p7PotionResist(s) { return Math.min(0.6, 0.03 * Math.max(0, (s.attrs.Ausdauer || 1) - 1)); }
  const p7ApplyPotionBase = applyPotion;
  applyPotion = function (pDef) {
    const r = state ? p7PotionResist(state) : 0;
    if (!r || !pDef || !(pDef.fatigue > 0 || pDef.rad > 0)) return p7ApplyPotionBase(pDef);
    const q = Object.assign({}, pDef);
    if (q.fatigue > 0) q.fatigue = Math.round(q.fatigue * (1 - r));
    if (q.rad > 0) q.rad = Math.round(q.rad * (1 - r));
    return p7ApplyPotionBase(q).replace(/\.$/, "") + " (Ausdauer mildert die Nebenwirkung um " + Math.round(r * 100) + " %).";
  };
  // WIKI: Ausstrahlung "beeinflusst das Handelskontingent": Einkauf je Stunde 300 + 100 je Punkt über 1 Einheiten (DESIGN).
  function p7TradeCap(s) { return 300 + 100 * Math.max(0, (s.attrs.Ausstrahlung || 1) - 1); }
  function p7TradeLeft(s) { const p = p7(s); if (Date.now() - (p.trade.since || 0) > 3600000) { p.trade.since = Date.now(); p.trade.units = 0; } return Math.max(0, p7TradeCap(s) - p.trade.units); }
  const p7Game = document.getElementById("orig-game");
  if (p7Game) p7Game.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[data-buy]");
    const buyAttr = a && a.getAttribute ? a.getAttribute("data-buy") : null;
    if (!buyAttr || !state || state.dead) return;
    const bits = buyAttr.split("|"); const n = Math.max(1, parseInt(bits[1], 10) || 1);
    const left = p7TradeLeft(state);
    if (n > left) {
      e.preventDefault(); e.stopImmediatePropagation();
      showResult("Handelskontingent erschöpft: noch " + left + " von " + p7TradeCap(state) + " Einheiten in dieser Stunde. Mehr Ausstrahlung = größeres Kontingent (Wiki).", true); renderAll();
      return;
    }
    const before = state.inv[bits[0]] || 0;
    setTimeout(() => { if (state && (state.inv[bits[0]] || 0) > before) { p7(state).trade.units += (state.inv[bits[0]] || 0) - before; save({ quiet: true }); } }, 0);
  }, true);

  // ---------- Status mit Erklärungen ----------
  function p7AttrInfo(s, a) {
    switch (a) {
      case "Kraft": return ["Kampfpunkte (×3 je Punkt), Schaden 1 + Kraft/3, nötig für Gebäude (Forschungsgrundstück: Kraft 3) und Fahrzeuge.", "Wiki: Kraft zu Intelligenz höchstens 3:1, sonst weniger Kampfkraft. Jetzt " + Math.round(p7RatioFactor(s) * 100) + " % Kampfkraft.", "+3 Kampfpunkte, alle 3 Punkte +1 Schaden."];
      case "Intelligenz": return ["Erfinden und Herstellen höherer Werkzeuge und Waffen, Kampfpunkte (×1), Forschung: 3 + Intelligenz Researchpunkte je Gang.", "Sollte mindestens ein Drittel der Kraft sein (jetzt nötig: " + Math.ceil((s.attrs.Kraft || 1) / 3) + ").", "+1 Kampfpunkt, +1 Researchpunkt je Forschungsgang, neue Rezepte."];
      case "Geschwindigkeit": return ["Kampfpunkte (×0,5), Grabdauer, Reisezeit zu Fuß, Tempo der Kampfrunden (Wiki).", "Reisezeit jetzt " + Math.round(p7TravelFactor(s) * 100) + " %, Grabdauer " + p7WorkSec("graben") + " s, Kampfrunde " + p7FightDelay() + " ms.", "−3 % Reisezeit, kürzere Grabdauer, schnellere Kampfrunden, +0,5 Kampfpunkte."];
      case "Wahrnehmung": return ["Fundchance beim Graben (Wiki), kleine Funde beim Erkunden, Kleiderbonus (Wiki).", "Graben jetzt " + Math.round(digChance(s) * 100) + " %, Kleiderbonus wirkt zu " + Math.round(p7ClothFactor(s) * 100) + " % (voll ab 5,01 ≙ Wiki 501).", "Höhere Grabchance, +1 % Fundchance beim Erkunden, mehr Kleiderbonus."];
      case "Dynamik": return ["Erfolgschance beim Erkunden (Wiki), Voraussetzung für manche Bauten.", "Entdeckungschance jetzt " + Math.round(p7ErkChances(s).disc * 100) + " %.", "+1 % Entdeckungschance beim Erkunden."];
      case "Ausstrahlung": return ["Handelskontingent (Wiki), Tierangebote beim Händler, Tiere fangen, Diamanten, Wurfnetz.", "Kontingent jetzt " + p7TradeCap(s) + " Einheiten je Stunde, noch " + p7TradeLeft(s) + " frei.", "+100 Einheiten Handelskontingent, bessere Fangchancen."];
      case "Ausdauer": return ["Lebenspunkte im Kampf (8 + 2 × Ausdauer), Tränkeresistenz (Wiki): starke Tränke brauchen Ausdauer 10/20/30, Nebenwirkungen werden milder.", "Lebenspunkte jetzt " + playerMaxHP(s) + ", Nebenwirkungen −" + Math.round(p7PotionResist(s) * 100) + " %.", "+2 Lebenspunkte, −3 % Nebenwirkungen."];
    }
    return ["", "", ""];
  }
  function p7StatusExtra() {
    const s = state;
    const rows = ATTRS.map((a) => { const i = p7AttrInfo(s, a); return "<tr><td><b>" + origEsc(a) + "</b><br>" + (s.attrs[a] || 0) + "</td><td>" + origEsc(i[0]) + '<br><span class="p7-small">' + origEsc(i[1]) + "</span></td><td>" + origEsc(i[2]) + "</td></tr>"; }).join("");
    const meters = [
      ["Kampfpunkte (KP)", playerKP(s), "Deine Kampfstärke: Kraft ×3 + Intelligenz + Geschwindigkeit ×0,5 + Waffe + Kleidung + Tier + Fahrzeug. Müdigkeit, Energie unter 40 % und Verletzung senken sie."],
      ["Lebenspunkte", playerMaxHP(s), "So viele Treffer hältst du im Kampf aus (8 + 2 × Ausdauer)."],
      ["Erfahrung (EP)", s.ep, "Für Arbeit, Kämpfe, Quests und Aufgaben. Schaltet Techlevel und Orte frei (TL1 ab 100, TL2 ab 250, TL3 ab 400 …)."],
      ["Charakterpunkte (CP)", s.cp, "Mit Go! in Eigenschaften stecken. Jeder Punkt +1."],
      ["Techlevel", s.techlevel || 0, "Öffnet Berufe, Rezepte und Orte."],
      ["Müdigkeit", (s.fatigue || 0) + " %", "Steigt mit jeder Aktion (+3, Kampf +8, Mutanten +1). Ab 80 % weniger Ertrag, bei 100 % keine Aktionen mehr. Schlafen senkt sie."],
      ["Energie", curEnergy(s) + " %", "Sinkt je Aktion (−2, Kampf −6). Unter 40 % weniger Kampfkraft, unter 10 % erschöpft. Schlafen und Tränke füllen sie."],
      ["Strahlenlast", (s.radiation || 0) + " %", "Steigt auf dem Uranfeld (+2 je Aktion). Bei 100 % schwer verletzt. Sinkt nur im Schlaf und mit Strahlentränken (Wiki)."],
      ["Nahrung / Wasser (Vorrat)", s.food + " / " + s.water, "Dein Vorrat. Sinkt automatisch je Minute und je Aktion um 1. Unter −10 stirbt der Charakter (Wiki). Nachschub: Nahrungssuche, Jagen, Wassersuche, Händler."],
      ["Kampferfahrung (KEP)", s.kep || 0, "Aus Kämpfen; schaltet Kampf-Fähigkeiten frei."],
      ["Handelserfahrung (HEP)", s.hep || 0, "+1 je Kauf oder Verkauf."],
      ["Reiseerfahrung (REP)", s.rep || 0, "+1 je 10 gereiste Felder (Wiki)."],
      ["Naturverbundenheit", s.nv || 0, "Gärtner und Pilzsammler; nötig für Fähigkeiten wie Erste Hilfe."],
      ["Flexibilität", s.flex || 0, "Verbessert die Grabchance (Fähigkeitenbaum)."],
      ["Kreativität", s.kreativ || 0, "Chemiker, Schneider, Waffentechniker: +1 je Herstellung (Wiki)."],
      ["Bauerfahrung", s.bep || 0, "Aus Stammgebäuden und Raketen."],
      ["Spionageerfahrung", s.sep || 0, "Aus Spion-Aufträgen (Wiki)."],
      ["Karma", karmaLabel(s), "Helle Taten (Arbeit) oder dunkle (Jagen, Kämpfen); öffnet Licht- oder Schattenhöhle."],
    ].map((r) => "<tr><td><b>" + origEsc(r[0]) + "</b></td><td>" + origEsc(String(r[1])) + "</td><td>" + origEsc(r[2]) + "</td></tr>").join("");
    return '<h2>Was die Werte bedeuten</h2><table class="p7-explain"><tr><th>Eigenschaft</th><th>Wirkung</th><th>Nächster Punkt</th></tr>' + rows + "</table>" +
      '<h3>Anzeigen und Erfahrungsarten</h3><table class="p7-explain p7-meters">' + meters + "</table>" +
      '<p class="p7-small">Prototyp-Maßstab: 1 Punkt hier ≙ 100 Wiki-Punkte. Wirkungen ohne Wiki-Zahl sind DESIGN.</p>';
  }

  // ---------- Seiten, HUD, Menü ----------
  const p7CharMenu = ORIG_MENUS.left.find((g) => g[0] === "Dein Charakter");
  if (p7CharMenu && !p7CharMenu[1].some((x) => x[0] === "aufgaben")) p7CharMenu[1].unshift(["aufgaben", "Aufgaben"]);
  const p7ActMenu = ORIG_MENUS.left.find((g) => g[0] === "Aktionen");
  if (p7ActMenu && !p7ActMenu[1].some((x) => x[0] === "herstellen")) { const i = p7ActMenu[1].findIndex((x) => x[0] === "haus"); p7ActMenu[1].splice(i + 1, 0, ["herstellen", "Herstellen"]); }
  const p7ExtPageBase = extPage;
  extPage = function (page) {
    if (!state) return p7ExtPageBase(page);
    if (page === "aufgaben") return p7AufgabenPage();
    if (page === "erkunden") return p7ErkundenPage();
    if (page === "graben") return p7GrabenPage();
    if (page === "herstellen") return p7HerstellenPage();
    return p7ExtPageBase(page);
  };
  const p7RenderOrigPageBase = renderOrigPage;
  renderOrigPage = function () {
    let h = p7RenderOrigPageBase();
    if (!state || typeof h !== "string") return h;
    if (origPage === "status") h = h.replace(/(<h2>Fähigkeiten-Werte<\/h2>)/, p7StatusExtra() + "$1");
    if (origPage === "arbeiten") h = h.replace(/ <span class="muted">\d+ Sekunden<\/span>/g, "");
    if (origPage === "handeln") h = h.replace(/(<h2>Handeln<\/h2>)/, '$1<p class="p7-cost">Jeder Kauf/Verkauf: Müdigkeit +' + p7FatAdd("trade") + " · Energie −2 · +1 Handelserfahrung. Handelskontingent: noch " + p7TradeLeft(state) + " von " + p7TradeCap(state) + " Einheiten in dieser Stunde (Ausstrahlung).</p>");
    return p7DecorateCosts(h, origPage);
  };
  const p7ExtCmdBase = extCmd;
  extCmd = function (cmd) {
    const bits = String(cmd || "").split("|");
    if (bits[0] === "p7erk") { p7Erkunden(); return; }
    if (bits[0] === "p7dig") { p7Dig(parseInt(bits[1], 10) || 1); return; }
    if (bits[0] === "p7move") { p7Move(parseInt(bits[1], 10) || 0, parseInt(bits[2], 10) || 0, bits[3] || "landkarte"); return; }
    return p7ExtCmdBase(cmd);
  };
  // Der alte Erkunden-Link läuft jetzt über die neue Logik.
  doErkunden = function () { p7Erkunden(); };
  // Die alte Einführung (5 Schritte) ist im Leitfaden aufgegangen: keine zweite Belohnungskette mehr.
  noteTutorial = function () {};
  // HUD-Ort, Aufgaben-Kasten und mobile Aufgabenzeile werden direkt in renderOriginal() eingesetzt (p7HudLocHtml, p7GuideBoxHtml, p7GuideMiniHtml).
  function p7HudLocHtml() { return '<a href="#" class="infoline loc-link" data-page="landkarte" title="Landkarte öffnen"><span>Ort:</span><span>' + origEsc(p7LocText(state)) + "</span></a>"; }
  const p7RenderAllBase = renderAll;
  renderAll = function () {
    if (state && !state.dead && state.attrs) {
      const p = p7(state);
      if (state.locId && state.locId !== "field") p.visited[state.locId] = 1;
      p7GuideTick();
    }
    return p7RenderAllBase.apply(this, arguments);
  };
  window.__p7 = { GUIDE, tick: () => p7GuideTick(), cur: () => state && p7Current(state), loc: () => state && p7LocText(state) };

  // =====================================================================
  // ---------- Durchgang 8 (Okt 2026) ----------
  // Reisezeit mit Balken, Koordinaten überall anklickbar (hinreisen), Landkarte X/Y-Eingabe,
  // Fähigkeiten als Karten mit Symbolen, Tierbilder, Kapitel-1-Hinweise.
  // =====================================================================
  let travelUi = null; let travelTimer = null;
  /** "xy:X,Y" → Ort auf dem Feld oder freies Feld */
  function p8Dest(id) {
    const m = /^xy:(\d+),(\d+)$/.exec(String(id || ""));
    if (!m) return locById(id);
    const x = +m[1], y = +m[2];
    return placeAt(x, y) || fieldLoc(x, y);
  }
  function p8SameSpot(id) {
    const m = /^xy:(\d+),(\d+)$/.exec(String(id || ""));
    return !!(m && state && +m[1] === state.px && +m[2] === state.py);
  }
  function p8ToName(to) { return to && to.free ? p7FieldName(to.x, to.y) + " (" + to.x + "/" + to.y + ")" : (to ? to.name : ""); }
  /** DESIGN: Reisen dauert die geplante Zeit (800 ms + 120 ms je Feld, max. 8 s; Geschwindigkeit/Fahrzeug kürzen) mit Balken.
   *  Vorher war die Reise sofort fertig, die angezeigten Sekunden galten nicht. Schalter EZS_FAST_TRAVEL nur für alte Node-Tests. */
  function p8TravelRun(to, dist, ms, finish) {
    if (window.EZS_FAST_TRAVEL || !(ms > 0)) { finish(); return; }
    travelUi = { to: p8ToName(to), dist, ms, start: Date.now(), pct: 0 };
    setStatus("Unterwegs nach " + travelUi.to + "…");
    renderAll();
    if (travelTimer) clearInterval(travelTimer);
    travelTimer = setInterval(() => {
      if (!travelUi) { clearInterval(travelTimer); travelTimer = null; return; }
      const p = Math.min(1, (Date.now() - travelUi.start) / travelUi.ms);
      travelUi.pct = p * 100;
      const el = document.querySelector("#orig-sheet .travel-bar i");
      if (el) el.style.width = travelUi.pct + "%";
      setProgress(travelUi.pct);
      if (p >= 1) { clearInterval(travelTimer); travelTimer = null; travelUi = null; finish(); }
    }, 100);
  }
  function p8TravelBoxHtml() {
    if (!travelUi) return "";
    return '<div class="work-row p8-travel"><p>Unterwegs nach <b>' + origEsc(travelUi.to) + "</b> · " + travelUi.dist + " Felder · " + Math.max(1, Math.round(travelUi.ms / 1000)) + ' s</p><div class="work-bar travel-bar"><i style="width:' + Math.round(travelUi.pct) + '%"></i></div></div>';
  }
  /** Kosten einer Reise zu x/y (wie travelTo: Plan + Bedarf + Müdigkeit) */
  function p8TravelCost(x, y) {
    if (!state) return "";
    const from = locById(state.locId) || { x: state.px, y: state.py };
    const plan = travelPlan(from, { x, y });
    return plan.dist + " Felder · " + plan.sec + " s · Nahrung −1 · Wasser −1 · Müdigkeit +" + p7FatAdd("travel");
  }
  /** Anklickbare Koordinate: Klick reist hin (normale Reise). Kosten im Tooltip. */
  function p8XYLink(x, y, back, label) {
    label = label || x + "/" + y;
    if (!state) return label;
    if (x === state.px && y === state.py) return '<span class="p8-here" title="Hier bist du">' + label + "</span>";
    const pl = placeAt(x, y); const g = pl ? placeGate(pl) : { open: true };
    if (!g.open) return '<span class="p8-lock" title="' + origEsc(pl.name + ": " + g.text) + '">' + label + " (gesperrt)</span>";
    return '<a href="#" class="p8-go" data-x="p8go|' + x + "|" + y + "|" + (back || origPage) + '" title="Hinreisen: ' + origEsc(p8TravelCost(x, y)) + '">' + label + "</a>";
  }
  /** Macht „(x/y)“ und „(x / y,“ im Text zu Reise-Links. Tags und bestehende Links bleiben unberührt. */
  function p8Coords(html, back) {
    if (!state || !html) return html;
    return String(html).split(/(<a\b[\s\S]*?<\/a>|<textarea\b[\s\S]*?<\/textarea>|<[^>]+>)/).map((part) => {
      if (!part || part[0] === "<") return part;
      return part.replace(/\((\d{1,3}) ?\/ ?(\d{1,3})(\)|,)/g, (m, xs, ys, end) => {
        const x = +xs, y = +ys;
        if (x < 1 || x > 200 || y < 1 || y > 200) return m;
        return "(" + p8XYLink(x, y, back) + end;
      });
    }).join("");
  }
  function p8Go(x, y, back) {
    const s = state;
    if (!s || s.dead) return;
    if (sleepUi) { showResult(SLEEP_MSG, true); renderAll(); return; }
    if (busy) { showResult("Erst die laufende Aktion beenden.", true); renderAll(); return; }
    if (!(x >= 1 && x <= 200 && y >= 1 && y <= 200)) { showResult("Die Karte reicht von 1 bis 200 (X und Y).", true); renderAll(); return; }
    if (x === s.px && y === s.py) { showResult("Du bist schon hier (" + x + " / " + y + ").", true); renderAll(); return; }
    const pl = placeAt(x, y);
    origPage = back || origPage; clearResults();
    travelTo(pl ? pl.id : "xy:" + x + "," + y, { after: () => { origPage = back || origPage; renderAll(); } });
  }
  // --- Landkarte: X/Y-Eingabe ---
  let p8Pending = null;
  function p8GotoHtml() {
    const s = state;
    const v = p8Pending || { x: s.px, y: s.py };
    const inp = (id, val, lbl) => '<label class="p8-xy">' + lbl + ' <input id="' + id + '" type="number" inputmode="numeric" pattern="[0-9]*" min="1" max="200" step="1" value="' + val + '" aria-label="' + lbl + '-Koordinate"></label>';
    let h = '<div class="p8-goto"><p class="p8-goto-t"><b>Zu Koordinaten reisen</b> <span class="p7-small">Karte 1–200</span></p><p class="p8-goto-f">' +
      inp("p8-gx", v.x, "X") + " " + inp("p8-gy", v.y, "Y") + ' <a href="#" class="p7-btn" data-x="p8goto">Reisen</a></p>';
    if (p8Pending) {
      const pl = placeAt(p8Pending.x, p8Pending.y);
      const nm = pl ? pl.name : p7FieldName(p8Pending.x, p8Pending.y);
      h += '<p class="p8-confirm">Ziel: <b>' + origEsc(nm) + "</b>, X " + p8Pending.x + " · Y " + p8Pending.y + '<br><span class="p7-cost">' + origEsc(p8TravelCost(p8Pending.x, p8Pending.y)) + "</span><br>" +
        '<a href="#" class="p7-btn" data-x="p8goconf">Reise bestätigen</a> <a href="#" class="p8-no" data-x="p8gono">abbrechen</a></p>';
    } else h += '<p class="p7-small">Erst „Reisen“ zeigt Entfernung, Dauer und Kosten, dann bestätigen. Danach steht die Karte auf dem Ziel.</p>';
    return h + "</div>";
  }
  function p8GotoCheck() {
    const ex = document.getElementById("p8-gx"), ey = document.getElementById("p8-gy");
    const rx = String(ex ? ex.value : "").trim(), ry = String(ey ? ey.value : "").trim();
    if (!/^\d{1,3}$/.test(rx) || !/^\d{1,3}$/.test(ry)) return { err: "Bitte X und Y als ganze Zahlen eingeben (1 bis 200)." };
    const x = +rx, y = +ry;
    if (x < 1 || x > 200 || y < 1 || y > 200) return { err: "Außerhalb der Karte: X und Y müssen zwischen 1 und 200 liegen." };
    if (state && x === state.px && y === state.py) return { err: "Da bist du schon (" + x + " / " + y + ")." };
    const pl = placeAt(x, y);
    if (pl && !placeOpen(pl)) return { err: pl.name + ": " + placeGate(pl).text + "." };
    return { x, y };
  }
  // WIKI (wiki/text/berufe/*.txt): Kurzbeschreibung, Anforderungen, Werkzeug je Beruf
  const P8_JOB_WIKI = {"Artefaktjuwelier": {"d": "Der Artefaktjuwelier stellt Artefakte her und färbt Diamanten.", "r": "Techlevel 9 + Diamantenverarbeitung + 2000 Austrahlung + Artefaktenschmiede", "w": "keins"}, "Biologe": {"d": "Der Biologe erforscht im Biolabor zunächst mehrere Level ähnlich den Researchlevels. Im Gegensatz zu den Researchlevels ist der Erfolg hierbei nicht garantiert sondern hängt von der Intelligenz ab. Durch mehr Intelligenz kann die Erfolgsquote auf bis zu 80% ge", "r": "1000 Intelligenz, Mikroskop, Biolabor + Techlevel 9", "w": ""}, "Chemiker": {"d": "kann Tränke, Pillen, Pilzmixe und anderes herstellen", "r": "Techlevel 1", "w": "Mörser und Stössel"}, "Diamantsucher": {"d": "Der Diamantensucher baut Diamanten ab.", "r": "Techlevel 6 + 1000 Austrahlung", "w": "Diamantendetektor und Mineral- oder Diamantenbohrer"}, "Erfinder": {"d": "Der Erfinder kann aus diversen Gegenständen neue Waffen/Gegenstände herstellen. Ein Erfinder kann nur in der Ideenschmiede arbeiten.", "r": "Techlevel 8, 600 Intelligenz + Mathematik + Physik + Ideenschmiede", "w": ""}, "Erzsammler": {"d": "Der Erzsammler baut direkt Erze und Kristalle ab. Durch Ausbau mit Steinerweiterungen lässt sich der Ertrag steigern.", "r": "Techlevel 2 + Erzdetector. Das \"Arbeiten\" kann abgebrochen werden.", "w": ""}, "Forscher": {"d": "Der Forscher kann im Forschungsgebäude nach neuen Technologien forschen und somit den Research Level deines Stammes erhöhen. Kann im Forschungsgebäude arbeiten und ausserdem können Forscher in der Erzverarbeitung Edelmetall sowie in der Uranverarbeitung Yellow", "r": "Techlevel 4", "w": ""}, "Gärtner": {"d": "Der Gärtner baut die verschiedensten Kräuter im Kräutergarten an. Sie dienen zum Einen für die Weiterverarbeitung aber auch zur Direkteinnahme. Es gibt rote, helle, braune Kräuter und einen Kräutermix. Beim Ausüben des Berufs bekommt man Naturverbundenheitspun", "r": "Techlevel 5 + Kräutergarten", "w": ""}, "Gas-Techniker": {"d": "Der Gastechniker kann durch Bohrungen Erdgas finden und bei erfolgreichem Graben errichtet er einen Gasturm damit Gaswerker arbeiten können.", "r": "Techlevel 7", "w": ""}, "Gaswerker": {"d": "Gaswerker können in Gasfördertürmen arbeiten. Sie füllen Gasbehälter ab und transportieren die ins Lager.", "r": "Techlevel 1 (+ Gasturm beim Bohren)", "w": ""}, "Geologe": {"d": "Ein Geologe sammelt Steine, kann Schwefel und Kalisalpeter finden", "r": "keine", "w": ""}, "Glasschmelzer": {"d": "Der Glasschmelzer kann in der Glasschmelze aus Sand brauchbares Glas herstellen.", "r": "Techlevel 3", "w": ""}, "Holzsammler": {"d": "Der Holzsammler sammelt Holz, kann Holzkohle finden", "r": "keine", "w": "keins"}, "Kunststoffsammler": {"d": "Der Kunststoffsammler baut direkt Kunststoff ab , kann einzelne Erzstücke finden", "r": "keine", "w": "keins"}, "Mechaniker": {"d": "Der Mechaniker kann in der Werkstatt Fahrzeuge und Fluggeräte produzieren. Kann nur in der Werkstatt arbeiten.", "r": "Techlevel 5, 300 Intelligenz + Werkstatt", "w": ""}, "Metallbauer": {"d": "Der Metallbauer sammelt Metall", "r": "keine", "w": "keins"}, "Öl-Techniker": {"d": "Der Erdöltechniker kann durch Bohrungen Erdölvorkommen finden und bei erfolgreichem Graben errichtet er einen Ölturm damit Ölwerker arbeiten können.", "r": "Techlevel 7", "w": ""}, "Ölwerker": {"d": "Ölwerker können in Erdölfördertürmen arbeiten. Sie füllen Ölbehälter ab und transportieren die ins Lager. Er kann im Benzincracker das gewonnene Erdöl in Benzin weiter verarbeiten.", "r": "Techlevel 1 (+ Ölturm beim Bohren)", "w": ""}, "Pilzsammler": {"d": "Der Pilzsammler sammelt diverse Pilzsorten in seinem Pilzhaus. Diese Pilze können vom Chemiker weiterverarbeitet werden.", "r": "Techlevel 5 + Ortskunde + Heilkunde + Pilzhaus", "w": ""}, "Psioniker": {"d": "Der Psioniker beeinflusst Fähigkeiten der Tiere.", "r": "500 Wahrnehmung + Psi Tempel + Techlevel 8", "w": ""}, "Sandsucher": {"d": "Der Sandsucher kann auf eigenen oder auf freien Ländern Sand abbauen. Je höher der Techlevel desto mehr Sand kann abgebaut werden. Das \"Arbeiten\" kann nicht abgebrochen werden.", "r": "eigenes Land, höherer Wasser/Nahrungsverbrauch", "w": "keins (ein Eimer sichert jedoch eine Mindestmenge von 4 Einheiten)"}, "Schneider": {"d": "Der Schneider kann jagen und aus den Häuten der Tiere eine neue Ressource: Fell - erzeugen. Aus diesen Fellen kann er Kleidung, Schuhe etc. herstellen. Schneider können nur in der Schneiderei arbeiten.", "r": "Techlevel 6, 300 Intelligenz & 100 Geschwindigkeit + Schneiderei", "w": ""}, "Spion": {"d": "Der Spion kann den Rucksack eines Spielers ausspionieren, Fahrzeuge beschädigen, gemeine Stolperfallen legen, nach ihnen suchen und entschärfen (dazu muss er auf dem Stammland stehen) und anonyme Sprengfallen platzieren.", "r": "Rhetorik, Taktik + 600 Geschwindigkeit + Techlevel 2", "w": ""}, "Tierfänger": {"d": "Der Tierfänger kann abgehauene Tiere und besondere Arten fangen", "r": "Techlevel 4 + Taktik + Verbergen", "w": ""}, "Uransammler": {"d": "Der Uransammler baut direkt Natururan ab.", "r": "Techlevel 4 + Urandetector + Ortskunde + Verbergen", "w": ""}, "Waffentechniker": {"d": "kann Waffen und Munition herstellen", "r": "Techlevel 1", "w": "keins"}, "Werkzeugmacher": {"d": "Der Werkzeugmacher stellt Schaufeln, Spitzhacken, Bohrspitzen, Förderröhre und Behälter für Öl und Gas her.", "r": "Techlevel 3", "w": ""}};
  // --- Fähigkeiten: Karten mit Symbolen (DESIGN-Darstellung, Inhalte WIKI) ---
  const P8_TL_EP = [0, 100, 250, 400, 550, 700, 850, 1000, 1200, 1500]; // aus tlUnlockText (EP-Weg)
  const P8_SKILL_CATS = [
    { k: "rep", t: "Reisen", how: "Reiseerfahrung: alle 10 Reisen oder Schritte auf der Karte +1 (Wiki: je 10 Felder)." },
    { k: "hep", t: "Handel", how: "Handelserfahrung: jeder Kauf oder Verkauf beim Händler +1 (DESIGN)." },
    { k: "kep", t: "Kampf", how: "Kampferfahrung: jeder Kampf gibt 1–3 (Wiki)." },
    { k: "nv", t: "Natur und Heilkunde", how: "Naturverbundenheit: Arbeit als Gärtner oder Pilzsammler +1 (Wiki)." },
    { k: "te", t: "Tiere", how: "Tiererfahrung: Tiertraining und Fänge als Tierfänger +1 (Wiki)." },
    { k: "kreativ", t: "Kreativität", how: "Kreativität: jeder Arbeitsgang als Chemiker, Schneider oder Waffentechniker +1 (Wiki)." },
    { k: "flex", t: "Flexibilität", how: "Flexibilität: jede Umschulung auf einen neuen Beruf +50 (DESIGN)." },
    { k: null, t: "Ohne Zähler", how: "Diese Erfahrungsart führt der Prototyp noch nicht." },
  ];
  function p8SkillImg(key, cls) { return '<img class="' + (cls || "p8-ico") + '" src="assets/skills/' + key + '.png" alt="" width="40" height="40" loading="lazy">'; }
  function p8JobImg(name) { if (![].concat(JOBS_TL0, JOBS_TL1, JOBS_TL2, JOBS_TL3, JOBS_TL4, JOBS_TL5, JOBS_TL6, JOBS_TL7, JOBS_TL8, JOBS_TL9).includes(name)) return p8SkillImg("cat-sonst"); return p8SkillImg("job-" + name.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }
  function p8Bar(v, max, cls) {
    const w = Math.max(0, Math.min(100, Math.round((v / (max || 1)) * 100)));
    return '<span class="p8-bar' + (cls ? " " + cls : "") + '"><i style="width:' + w + '%"></i></span>';
  }
  function p8FaehigkeitenPage() {
    const s = state; const tl = s.techlevel || 0; const jobs = availableJobs(s);
    const nextEp = P8_TL_EP[tl + 1];
    let h = "<h2>Fähigkeiten</h2>" + origLive();
    h += '<div class="p8-top"><div class="p8-top-job">' + p8JobImg(s.job) + "<div><b>" + origEsc(s.job) + '</b><br><span class="p7-small">dein Beruf</span></div></div>' +
      '<div class="p8-top-tl"><b>Techlevel ' + tl + "</b>" + (nextEp ? " → " + (tl + 1) + ": " + p8Bar(s.ep || 0, nextEp) + ' <span class="p7-small">' + (s.ep || 0) + "/" + nextEp + " EP</span>" : " (höchstes)") +
      '<br><span class="p7-small">' + (nextEp ? origEsc("Weg zu TL " + (tl + 1) + ": " + tlUnlockText(tl + 1)) : "") + "</span></div></div>";
    h += '<p class="p7-small">Legende: <span class="p8-chip on">dein Beruf</span> <span class="p8-chip can">erlernbar</span> <span class="p8-chip lock">gesperrt</span>. Ein Berufswechsel ist eine Ausbildung: 90 Wiki-Minuten (60 mit Flexibilität, 30 mit Perfektion), hier wenige Sekunden. Kosten: keine Rohstoffe, nur die Zeit.</p>';
    h += '<h3 class="p8-h">Berufe nach Techlevel</h3>';
    [JOBS_TL0, JOBS_TL1, JOBS_TL2, JOBS_TL3, JOBS_TL4, JOBS_TL5, JOBS_TL6, JOBS_TL7, JOBS_TL8, JOBS_TL9].forEach((group, gtl) => {
      const open = tl >= gtl;
      h += '<div class="p8-tl' + (open ? " open" : " locked") + '"><p class="p8-tl-h"><span class="p8-tl-n">TL ' + gtl + "</span> " + (open ? "freigeschaltet" : "gesperrt · " + origEsc(tlUnlockText(gtl))) + '</p><div class="p8-cards">';
      group.forEach((name) => {
        const on = s.job === name; const can = jobs.includes(name) && !on;
        const miss = can ? p5JobMissing(s, name) : "";
        const w = P8_JOB_WIKI[name] || {};
        const st = on ? "on" : can && !miss ? "can" : "lock";
        let foot;
        if (on) foot = '<span class="p8-state on">✔ dein Beruf</span>';
        else if (can && !miss) {
          const min = hasSkill(s, "Perfektion") ? 30 : hasSkill(s, "Flexibilität") ? 60 : 90;
          foot = '<a href="#" class="p7-btn p8-learn" data-job="' + origEsc(name) + '">erlernen</a> <span class="p7-cost">Ausbildung ' + min + " Wiki-min (hier " + Math.round(wikiMinMs(min) / 1000) + " s) · keine Rohstoffe</span>";
        } else if (can) foot = '<span class="p8-state lock">fehlt: ' + origEsc(miss) + "</span>";
        else foot = '<span class="p8-state lock">ab TL ' + gtl + (P5_JOBREQ[name] ? " + " + origEsc(p5JobReqText(name)) : "") + "</span>";
        h += '<div class="p8-card ' + st + '">' + p8JobImg(name) + '<div class="p8-card-b"><p class="p8-card-t">' + origEsc(name) + "</p>" +
          '<p class="p8-card-d">' + origEsc(w.d || "") + "</p>" +
          (w.r || w.w ? '<p class="p8-card-r">' + (w.r ? "Wiki-Anforderung: " + origEsc(w.r) : "") + (w.w && w.w !== "keins" ? " · Werkzeug: " + origEsc(w.w) : "") + "</p>" : "") +
          '<p class="p8-card-f">' + foot + "</p></div></div>";
      });
      h += "</div></div>";
    });
    h += '<h3 class="p8-h">Fähigkeiten aus Erfahrung</h3><p class="p7-small">Fähigkeiten lernt man nicht, sie kommen von selbst, sobald der Erfahrungswert die Schwelle erreicht (Schwellen aus dem Wiki).</p><div class="p8-cards p8-skills">';
    P8_SKILL_CATS.forEach((cat) => {
      const list = SKILLS.filter((x) => x[1] === cat.k).sort((a, b) => a[2] - b[2]);
      if (!list.length) return;
      const have = cat.k ? (s[cat.k] || 0) : 0;
      const got = list.filter((x) => cat.k && have >= x[2]).length;
      const next = list.find((x) => !(cat.k && have >= x[2]));
      h += '<div class="p8-card p8-skill' + (got === list.length ? " on" : got ? " part" : " lock") + '">' + p8SkillImg("cat-" + (cat.k || "sonst")) + '<div class="p8-card-b"><p class="p8-card-t">' + origEsc(cat.t) +
        ' <span class="p8-lvl">Stufe ' + got + "/" + list.length + "</span></p>" +
        (cat.k ? '<p class="p8-card-d">' + origEsc(SKILL_STAT_LABEL[cat.k]) + ": <b>" + have + "</b>" + (next ? " · nächste: " + origEsc(next[0]) + " bei " + next[2] + " " + p8Bar(have, next[2]) : " · alles erreicht") + "</p>" : "") +
        '<ul class="p8-sk">' + list.map((x) => {
          const ok = cat.k && have >= x[2];
          return '<li class="' + (ok ? "on" : "lock") + '"><span class="p8-sk-m">' + (ok ? "✔" : "🔒") + "</span> <b>" + origEsc(x[0]) + "</b> " + (cat.k ? '<span class="p7-small">' + (ok ? "gelernt" : "ab " + x[2] + " (noch " + (x[2] - have) + ")") + "</span>" : "") +
            '<br><span class="p8-sk-e">' + origEsc(x[3]) + "</span></li>";
        }).join("") + '</ul><p class="p8-card-r">' + origEsc(cat.how) + "</p></div></div>";
    });
    return h + "</div>";
  }
  // --- Tierbilder (Wiki: Hund, Esel, Pferd; Affe, Wolf, Adler als DESIGN-Bild) ---
  const P8_ANIMALS = ["Hund", "Esel", "Pferd", "Affe", "Wolf", "Adler"];
  function p8AniSrc(type) { const T = PET_TYPES[type]; return T && T.img ? T.img : null; }
  function p8AniImg(type, size) {
    const src = p8AniSrc(type); if (!src) return "";
    return '<img class="p8-ani' + (size ? " " + size : "") + '" src="' + src + '" alt="' + origEsc(type) + '" title="' + origEsc(type) + '">';
  }
  function p8AnimalGallery() {
    return '<h3>Alle Tierarten</h3><div class="p8-anis">' + P8_ANIMALS.map((t) => '<div class="p8-ani-card">' + p8AniImg(t) + "<p><b>" + t + '</b></p><p class="p7-small">' + origEsc((PET_TYPES[t] || {}).skill || "") + "</p></div>").join("") +
      '</div><p class="p7-small">Bilder von Hund, Esel und Pferd aus dem Wiki-Archiv; Affe, Wolf und Adler nachgezeichnet (DESIGN).</p>';
  }
  /** Bild zum Ergebnis, wenn ein Tier gefangen, gekauft oder angeboten wird */
  function p8ResultAnimal(text) {
    const m = /\b(Hund|Esel|Pferd|Affe|Wolf|Adler)\b[^.]*\b(gefangen|gekauft|bietet|Angebot|anmelden)|bietet dir ein Tier an: (Hund|Esel|Pferd|Affe|Wolf|Adler)/.exec(text || "");
    return m ? p8AniImg(m[1] || m[3], "res") : "";
  }
  // --- Aufgaben-Hinweis mit aktuellem Fehlbestand ---
  function p8HintText(t) {
    const s = state; let h = t.h;
    if (!s || !t) return h;
    if (t.cost && !p7Met(s, t.g)) {
      const have = (k) => (s.inv[k] || 0) + lagerN(s, k); // Rucksack + Privatlager (auch das alte am Bauplatz)
      const miss = Object.keys(t.cost).filter((k) => have(k) < t.cost[k]).map((k) => (t.cost[k] - have(k)) + " " + k);
      h += miss.length ? " Es fehlt noch (Rucksack + Lager): " + miss.join(", ") + "." : " Alles beisammen.";
    }
    if (t.g && t.g.t === "need") {
      const miss = Object.keys(t.g.cost).filter((k) => (s.inv[k] || 0) < t.g.cost[k]).map((k) => (t.g.cost[k] - (s.inv[k] || 0)) + " " + k);
      if (miss.length) h += " Es fehlt noch: " + miss.join(", ") + ".";
      if (!placeOpen(locById("schrott"))) h += " Schrottfeld noch gesperrt: erst Aufgaben 1–3.";
    }
    return h;
  }

  // --- Seiten-Nachbearbeitung ---
  const p8RenderOrigPage = renderOrigPage;
  renderOrigPage = function () {
    if (state && origPage === "faehigkeiten") return p8TravelBoxHtml() + p8FaehigkeitenPage();
    let h = p8RenderOrigPage();
    if (!state) return h;
    if (origPage === "landkarte") h = h.replace("<h2>Landkarte</h2>", "<h2>Landkarte</h2>" + p8GotoHtml());
    if (origPage === "tierstall") {
      h = h.replace("Bilder gibt es nur für Hund, Esel und Pferd.", "");
      if (state.petOffer) h = h.replace("<p>Angebot vom Händler: ", '<p class="p8-offer">' + p8AniImg(state.petOffer.type, "s") + "Angebot vom Händler: ");
      h += p8AnimalGallery();
    }
    if (origPage === "tierkampf" && state.pet) {
      const foes = P8_ANIMALS.filter((t) => t !== state.pet.type).slice(0, 3);
      h = h.replace("<h2>Tierkämpfe</h2>", '<h2>Tierkämpfe</h2><div class="p8-pit">' + p8AniImg(state.pet.type) + '<span class="p8-vs">gegen</span>' + foes.map((t) => p8AniImg(t, "s")).join("") + "</div>");
    }
    // Nur Seiten mit Orten werden ganz verlinkt; Ergebnis-Zeilen und Aufgaben-Kasten überall (Zähler wie „(1 von 25)“ bleiben Text)
    return p8TravelBoxHtml() + (P8_COORD_PAGES.includes(origPage) ? p8Coords(h, origPage) : h);
  };
  const P8_COORD_PAGES = ["erkunden", "graben", "aufgaben", "ereignisse", "postfach", "uebersicht", "laender", "land", "landkarte", "arbeiten", "jagen", "kaempfen", "wassersuche", "nahrungssuche", "gebaeude", "bauoptionen", "stamm"];
  const p8GuideBox = p7GuideBoxHtml;
  p7GuideBoxHtml = function () { return p8Coords(p8GuideBox(), "aufgaben"); };
  const p8ExtCmd = extCmd;
  extCmd = function (cmd) {
    const bits = String(cmd || "").split("|");
    if (bits[0] === "p8go") { p8Go(parseInt(bits[1], 10), parseInt(bits[2], 10), bits[3] || origPage); return; }
    if (bits[0] === "p8goto") {
      const r = p8GotoCheck(); origPage = "landkarte";
      if (r.err) { p8Pending = null; showResult(r.err, true); renderAll(); return; }
      p8Pending = { x: r.x, y: r.y }; clearResults(); renderAll(); return;
    }
    if (bits[0] === "p8goconf") {
      const p = p8Pending; const r = p8GotoCheck(); origPage = "landkarte";
      if (p && !r.err && (r.x !== p.x || r.y !== p.y)) { p8Pending = { x: r.x, y: r.y }; showResult("Neues Ziel – bitte noch einmal bestätigen.", true); renderAll(); return; }
      p8Pending = null; if (p) p8Go(p.x, p.y, "landkarte"); else renderAll(); return;
    }
    if (bits[0] === "p8gono") { p8Pending = null; origPage = "landkarte"; renderAll(); return; }
    return p8ExtCmd(cmd);
  };
  // Eingabe live: Kosten beim Tippen anzeigen (Bestätigen bleibt ein eigener Schritt)
  document.addEventListener("input", (e) => {
    const t = e && e.target; if (!t || (t.id !== "p8-gx" && t.id !== "p8-gy")) return;
    const box = document.querySelector ? document.querySelector("#orig-sheet .p8-goto .p7-small:last-child") : null;
    const r = p8GotoCheck();
    if (box) box.textContent = r.err ? r.err : "Ziel X " + r.x + " · Y " + r.y + ": " + p8TravelCost(r.x, r.y) + ". „Reisen“ zum Prüfen und Bestätigen.";
  });
  window.__p8 = { p8Coords, p8XYLink, p8Go, p8GotoCheck, p8TravelCost, p8FaehigkeitenPage, p8AnimalGallery, get travelUi() { return travelUi; }, get pending() { return p8Pending; } };

  // =====================================================================
  // Durchgang 9: Nahrung und Wasser sind der Vorrat (automatisch verbraucht), neue Nahrungssuche, mehr Fleisch.
  // WIKI (Archiv moin/Nahrung.html und moin/Wasser.html, EzWiki 2006): „Hat man weniger als −10 Einheiten Nahrung
  //   bei sich, so stirbt man.“ Nahrung: Jagd, freie Händler, Farm. Wasser: Wassersuche, freie Händler, Brunnen.
  //   Moin StartHilfe: „Sterben: nur bei −10 Wasser oder −10 Nahrung.“ Es gab also keinen Essen-Knopf: der Bestand
  //   an Nahrung/Wasser (rechte Spalte) IST der Bedarf. Das Sammeln von Beeren/Pilzen ist DESIGN (Wunsch aus dem Test).
  // =====================================================================
  const P9_ITEM = 8;  // alte Nahrung-/Wasser-Stücke → 8 Vorrat-Einheiten (bisheriger Essen-Wert, DESIGN)
  const P9_LOW = 20;  // DESIGN: ab hier Warnung
  const P9_FORAGE_MS = 3000, P9_HUNT_MS = 2500; // DESIGN: ≙ 30 Wiki-Minuten
  function p9LowCls(v) { return v <= 0 ? "p9-crit" : v <= P9_LOW ? "p9-low" : ""; }
  /** Spielstand: state.food/state.water werden zu Zugriffen auf inv.Nahrung/inv.Wasser (eine einzige Zahl). */
  function p9Supply(s) {
    if (!s || typeof s !== "object") return s;
    if (!s.inv) s.inv = {};
    const d = Object.getOwnPropertyDescriptor(s, "food");
    if (d && d.get) return s;
    if (!s.p9food) {
      const f = typeof s.food === "number" ? s.food : 40, w = typeof s.water === "number" ? s.water : 40;
      const nf = Math.max(0, s.inv.Nahrung || 0), nw = Math.max(0, s.inv.Wasser || 0);
      s.inv.Nahrung = f + P9_ITEM * nf; s.inv.Wasser = w + P9_ITEM * nw;
      const conv = (o) => { if (!o) return; ["Nahrung", "Wasser"].forEach((k) => { if (o[k] > 0) o[k] *= P9_ITEM; }); };
      if (s.house) conv(s.house.lager);
      if (s.stamm) conv(s.stamm.storage);
      s.p9food = { at: Date.now(), food: [f, nf], water: [w, nw] }; // Nachweis der Umrechnung
    }
    delete s.food; delete s.water;
    Object.defineProperty(s, "food", { get() { return this.inv.Nahrung || 0; }, set(v) { this.inv.Nahrung = v; }, enumerable: true, configurable: true });
    Object.defineProperty(s, "water", { get() { return this.inv.Wasser || 0; }, set(v) { this.inv.Wasser = v; }, enumerable: true, configurable: true });
    return s;
  }
  const p9MigrateBase = migrateState;
  migrateState = function (s) { const r = p9MigrateBase(s); p9Supply(r || s); return r; };
  function p9(s) { s = s || state; if (!s.p9) s.p9 = {}; if (!Array.isArray(s.p9.hist)) s.p9.hist = []; return s.p9; }

  // --- Neue Beutetiere (DESIGN, Bilder tools/gen_animal_art.py) ---
  ENEMIES.ratte = { id: "ratte", name: "Mutierte Ratte", img: "assets/gfx/animals/ratte.png", kp: 8, hp: 6, roundsMax: 4, reward: { ep: 1, cp: 1, kep: 1 }, food: [5, 9], animal: true,
    loot: [{ item: "Knochen", n: [1, 1], w: 60 }, { item: "Kronkorken", n: [1, 2], w: 40 }] };
  ENEMIES.echse = { id: "echse", name: "Wüstenechse", img: "assets/gfx/animals/echse.png", kp: 11, hp: 8, roundsMax: 5, reward: { ep: 2, cp: 1, kep: 1 }, food: [6, 11], animal: true,
    loot: [{ item: "Knochen", n: [1, 2], w: 60 }, { item: "Sand", n: [1, 3], w: 40 }] };
  ENEMIES.wildschwein = { id: "wildschwein", name: "Wildschwein", img: "assets/gfx/animals/wildschwein.png", kp: 24, hp: 16, roundsMax: 6, reward: { ep: 4, cp: 2, kep: 3 }, food: [26, 40], animal: true,
    loot: [{ item: "Fell", n: [1, 2], w: 50 }, { item: "Knochen", n: [1, 3], w: 50 }] };

  // --- Gelände: was ein Feld zum Essen bietet (alles DESIGN) ---
  // food = Nahrung je erfolgreichem Sammeln, ok = Erfolgschance, extra = Beifunde [Name, min, max, Gewicht], prey = Wild für die Jagd,
  // foe/danger = wer beim Sammeln angreifen kann und wie oft, hunt = Chance, Wild aufzuspüren.
  const P9_TERRAIN = {
    wald: { n: "Wald", what: "Beeren, Wurzeln, Pilze und Kräuter", food: [6, 14], ok: 0.85, extra: [["Kräuter", 1, 2, 3], ["Holz", 2, 4, 3], ["Pilze", 1, 2, 2], ["Knochen", 1, 1, 1]], prey: ["wild_dog", "wildschwein"], foe: "wild_dog", danger: 0.1, hunt: 0.75 },
    oase: { n: "Oase", what: "Datteln, Schilfwurzeln und Wasserkresse", food: [5, 12], ok: 0.85, extra: [["Wasser", 4, 10, 4], ["Kräuter", 1, 2, 2], ["Holz", 1, 2, 1]], prey: ["wild_dog"], foe: "wild_dog", danger: 0.08, hunt: 0.6 },
    steppe: { n: "Steppe / Trockenwiese", what: "Wurzeln, Grassamen und Heuschrecken", food: [3, 8], ok: 0.7, extra: [["Knochen", 1, 2, 2], ["Kräuter", 1, 1, 1], ["Holz", 1, 2, 1]], prey: ["wild_dog", "ratte"], foe: "wild_dog", danger: 0.07, hunt: 0.55 },
    oedland: { n: "Ödland", what: "zähe Wurzeln und Käfer", food: [2, 6], ok: 0.6, extra: [["Knochen", 1, 2, 2], ["Kronkorken", 1, 2, 2]], prey: ["ratte"], foe: "ratte", danger: 0.06, hunt: 0.45 },
    ruinen: { n: "Ruinen / Schrott", what: "alte Konserven und Vorratsreste", food: [1, 5], ok: 0.5, extra: [["Kronkorken", 1, 3, 3], ["Metall", 1, 2, 2], ["Kunststoff", 1, 2, 2]], prey: ["ratte"], foe: "scavenger", danger: 0.08, hunt: 0.5 },
    fels: { n: "Fels / Geröll", what: "Flechten, Moos und Vogeleier", food: [1, 4], ok: 0.45, extra: [["Stein", 1, 3, 3], ["Kronkorken", 1, 1, 1]], prey: ["echse"], foe: "echse", danger: 0.05, hunt: 0.4 },
    wueste: { n: "Wüste / Dünen", what: "Kaktusfrüchte und Echseneier", food: [0, 3], ok: 0.35, extra: [["Sand", 1, 3, 3], ["Knochen", 1, 1, 1]], prey: ["echse"], foe: "echse", danger: 0.05, hunt: 0.4 },
    hoehle: { n: "Höhle", what: "Pilze an feuchten Wänden", food: [1, 4], ok: 0.45, extra: [["Pilze", 1, 2, 3], ["Knochen", 1, 2, 1]], prey: ["ratte"], foe: "ratte", danger: 0.08, hunt: 0.4 },
    glas: { n: "Glasfläche", what: "fast nichts – der Boden ist verbrannt", food: [0, 1], ok: 0.15, extra: [["Kristall", 1, 1, 1], ["Sand", 1, 2, 2]], prey: [], foe: null, danger: 0, hunt: 0 },
    camp: { n: "Ruinencamp", what: "nichts zu sammeln – der Händler verkauft Nahrung und Wasser", food: [0, 0], ok: 0, extra: [], prey: [], foe: null, danger: 0, hunt: 0 },
  };
  const P9_RARE = [["Orangensaft", 1], ["Seife", 1]]; // seltene Gegenstände (2 %)
  function p9TerrainKey(s) {
    s = s || state;
    const pos = p7Pos(s);
    const pl = placeAt(pos.x, pos.y) || (s.locId && s.locId !== "field" ? locById(s.locId) : null);
    if (pl) {
      if (pl.id === "camp") return "camp";
      const a = pl.actions || [], tags = pl.tags || [];
      if (a.includes("holz")) return "wald";
      if (a.includes("wasser")) return "oase";
      if (a.includes("sand")) return "wueste";
      if (a.includes("stein")) return "fels";
      if (tags.includes("Höhle")) return "hoehle";
      return "ruinen";
    }
    const g = groundAt(pos.x, pos.y);
    if (g === "glas") return "glas";
    if (g === "hart") return "fels";
    const n = p7FieldName(pos.x, pos.y);
    return { Steppe: "steppe", Trockenwiese: "steppe", "Ödland": "oedland", "Geröllfeld": "fels", Ruinenfeld: "ruinen", "Dünen": "wueste" }[n] || "oedland";
  }
  function p9Mult(s) {
    let m = 1 + Math.min(0.5, (s.nv || 0) / 200); // DESIGN: Naturverbundenheit hilft (max +50 %)
    const pet = activePet(s);
    if (pet && pet.type === "Wolf" && pet.psi) m *= 2; // WIKI tiere: PSI-Wolf „findet doppelt so viel Nahrung“
    return m;
  }
  function p9Range(s, t) { const m = p9Mult(s); return [Math.floor(t.food[0] * m), Math.floor(t.food[1] * m)]; }
  function p9ForageCost() { return "Energie −2 · Müdigkeit +" + p7FatAdd("work") + " · Nahrung −1 · Wasser −1 · Dauer " + Math.round(P9_FORAGE_MS / 1000) + " s (≙ 30 Min.)"; }
  function p9HuntCost() { return "Spurensuche: Energie −2 · Müdigkeit +" + p7FatAdd("work") + " · " + Math.round(P9_HUNT_MS / 1000) + " s · dann Kampf (" + p7CostText("fight").split(" · Niederlage")[0] + ")"; }
  function p9Start(aid, ms, label, done) {
    const s = state;
    if (!s || s.dead) return false;
    if (sleepUi) { showResult(SLEEP_MSG, true); renderAll(); return false; }
    if (busy || fight) { showResult("Erst die laufende Aktion beenden.", true); renderAll(); return false; }
    origPage = "nahrungssuche";
    if (blockIfExhausted()) return false;
    busy = true; workUi = { aid, n: 1, i: 0, pct: 0 };
    clearResults(); setStatus(label + "…"); renderAll();
    runProgress(ms, () => { workUi = null; busy = false; setProgress(0); setStatus("Bereit."); done(); });
    return true;
  }
  let p9FightRef = null; // Verlaufseintrag, dessen Kampf gerade läuft
  function p9AddHist(s, e) { const p = p9(s); p.hist.unshift(e); p.hist.length = Math.min(p.hist.length, P7_HIST_MAX); return e; }
  function p9Forage() {
    const s = state; const key = p9TerrainKey(s);
    if (key === "camp") { origPage = "nahrungssuche"; showResult("Im Ruinencamp gibt es nichts zu sammeln. Geh ein Feld weiter (N/O/S/W) oder kauf beim Händler.", true); renderAll(); return; }
    p9Start("p9forage", P9_FORAGE_MS, "Nahrung sammeln", p9ForageFinish);
  }
  function p9ForageFinish() {
    const s = state; if (!s || s.dead) return;
    const key = p9TerrainKey(s); const t = P9_TERRAIN[key]; const pos = p7Pos(s);
    const f0 = s.fatigue || 0, e0 = curEnergy(s), food0 = s.food, before = invSnapshot(s);
    let msg; let got = 0;
    if (Math.random() < t.ok) {
      const r = p9Range(s, t); got = rand(r[0], r[1]);
      if (got > 0) { addInv(s, "Nahrung", got); msg = "Gesammelt: " + got + " Nahrung (" + t.what + ")."; }
      else msg = "Kaum etwas Essbares (" + t.what + ").";
      s.nv = (s.nv || 0) + 1; // DESIGN: Naturverbundenheit (WIKI-Wert) wächst beim Sammeln
    } else msg = "Nichts Essbares gefunden.";
    if (t.extra.length && Math.random() < 0.15) {
      const it = weighted(t.extra.map((x) => ({ item: x[0], n: rand(x[1], x[2]), w: x[3] })));
      addInv(s, it.item, it.n); msg += " Beifund: " + it.n + "× " + it.item + ".";
    } else if (key !== "glas" && Math.random() < 0.02) {
      const it = P9_RARE[rand(0, P9_RARE.length - 1)]; addInv(s, it[0], it[1]); msg += " Seltener Fund: " + it[0] + "!";
    }
    gain(s, 1, 0); p7Count("forage");
    s.food -= 1; s.water -= 1;
    p7ShowAt = 0; exert("work"); p7Pending = null;
    msg += afterWork(before);
    const df = (s.fatigue || 0) - f0, de = curEnergy(s) - e0;
    const entry = p9AddHist(s, { t: Date.now(), x: pos.x, y: pos.y, f: p7FieldName(pos.x, pos.y), r: msg, c: "Nahrung " + (s.food - food0 >= 0 ? "+" : "−") + Math.abs(s.food - food0) + " netto · Energie " + (de >= 0 ? "+" : "−") + Math.abs(de) + " · Müdigkeit +" + df });
    let foe = null;
    if (t.foe && ENEMIES[t.foe] && Math.random() < t.danger) { foe = ENEMIES[t.foe]; msg += " Achtung: " + foe.name + " greift an!"; entry.r = msg; p9FightRef = { entry, foe: foe.id }; }
    log(msg, got > 0 ? "good" : "bad");
    origPage = "nahrungssuche";
    showResult(msg + " · Vorrat Nahrung " + s.food + " · Müdigkeit +" + df + " (jetzt " + (s.fatigue || 0) + " %), Energie " + (de >= 0 ? "+" : "−") + Math.abs(de) + " (jetzt " + curEnergy(s) + " %)", got <= 0);
    checkDeath(); maybeUnlockTL(); save({ quiet: true }); renderAll();
    if (foe) setTimeout(() => { if (state && !state.dead && !busy && !fight) startFight(foe.id, "Zufallsbegegnung"); }, 400);
  }
  function p9Hunt() {
    const s = state; const t = P9_TERRAIN[p9TerrainKey(s)];
    if (!t.prey.length) { origPage = "nahrungssuche"; showResult("Hier gibt es kein Wild. Im Wald, an der Oase und in der Steppe findest du eher etwas.", true); renderAll(); return; }
    p9Start("p9hunt", P9_HUNT_MS, "Spurensuche", p9HuntFinish);
  }
  function p9HuntFinish() {
    const s = state; if (!s || s.dead) return;
    const t = P9_TERRAIN[p9TerrainKey(s)]; const pos = p7Pos(s);
    const f0 = s.fatigue || 0;
    p7ShowAt = 0; exert("work"); p7Pending = null;
    const df = (s.fatigue || 0) - f0;
    if (Math.random() >= t.hunt) {
      const msg = "Jagd: keine frische Spur gefunden.";
      p9AddHist(s, { t: Date.now(), x: pos.x, y: pos.y, f: p7FieldName(pos.x, pos.y), r: msg, c: "Energie −2 · Müdigkeit +" + df });
      log(msg, "bad"); origPage = "nahrungssuche"; showResult(msg + " · Müdigkeit +" + df + " (jetzt " + (s.fatigue || 0) + " %)", true); save({ quiet: true }); renderAll(); return;
    }
    const id = weighted(t.prey.map((p, i) => ({ item: p, n: 1, w: i === 0 ? 3 : 1 }))).item; // DESIGN: das erste Tier ist häufiger
    const e = ENEMIES[id];
    const msg = "Jagd: Du spürst " + (e.name === "Wildschwein" || e.name === "Wüstenechse" || e.name === "Mutierte Ratte" ? "eine " + (e.name === "Wildschwein" ? "Wildsau" : e.name) : "einen " + e.name) + " auf – Kampf!";
    const entry = p9AddHist(s, { t: Date.now(), x: pos.x, y: pos.y, f: p7FieldName(pos.x, pos.y), r: msg, c: "Energie −2 · Müdigkeit +" + df + " · dann Kampf" });
    p9FightRef = { entry, foe: id };
    log(msg, "sys"); origPage = "nahrungssuche"; showResult(msg); save({ quiet: true }); renderAll();
    startFight(id, "Jagd");
  }
  /** Aus dem Kampf-Sieg aufgerufen: Fleisch/Vorräte in den Vorrat. */
  function p9FightFood(e) {
    if (!state || !e || !e.food) return "";
    const n = rand(e.food[0], e.food[1]); let extra = 0;
    const pet = activePet(state);
    if (e.animal && pet && pet.type === "Wolf") extra = pet.psi ? n : Math.floor(n * Math.min(1, pet.groesse / 200) + 0.5); // WIKI: Wolf bis zur doppelten Menge Fleisch
    addInv(state, "Nahrung", n + extra);
    if (p9FightRef && p9FightRef.foe === e.id) { p9FightRef.entry.r += " → Sieg: +" + (n + extra) + " Nahrung."; p9FightRef = null; }
    return " · +" + n + " Nahrung " + (e.animal ? "(Fleisch)" : "(Vorräte)") + (extra ? " + " + extra + " vom Wolf" : "") + " → Vorrat " + state.food;
  }
  function p9FightLost(e) { if (p9FightRef && e && p9FightRef.foe === e.id) { p9FightRef.entry.r += " → Niederlage."; p9FightRef = null; } }

  // --- Seiten ---
  function p9EnemyImg(id) { const e = ENEMIES[id]; return e && e.img ? '<img class="p8-ani s" src="' + e.img + '" alt="' + origEsc(e.name) + '" title="' + origEsc(e.name) + '">' : ""; }
  function p9Nearest(kind) {
    const pos = p7Pos(state);
    const ids = kind === "wald" ? ["wald"] : ["oase"];
    return LOCATIONS.filter((l) => ids.includes(l.id) && placeOpen(l)).map((l) => ({ l, d: Math.abs(l.x - pos.x) + Math.abs(l.y - pos.y) })).sort((a, b) => a.d - b.d)[0];
  }
  function p9SupplyLine() {
    const s = state;
    return '<p class="p9-vorrat"><b>Vorrat:</b> <span class="' + p9LowCls(s.food) + '">Nahrung ' + s.food + '</span> · <span class="' + p9LowCls(s.water) + '">Wasser ' + s.water + "</span> " +
      '<span class="p7-small">(sinkt automatisch je Minute und je Aktion um 1; bei −10 stirbst du)</span></p>';
  }
  function p9Page() {
    const s = state; const key = p9TerrainKey(s); const t = P9_TERRAIN[key]; const p = p9(s);
    const busyHere = workUi && (workUi.aid === "p9forage" || workUi.aid === "p9hunt");
    let h = "<h2>Nahrungssuche</h2>" + origLive() +
      '<div class="p7-pic"><img src="assets/gfx/animals/nahrungssuche.png" alt="Korb mit Beeren, Pilzen und Wurzeln" class="p7-art p9-art"></div>' + p7HereHtml(false) + p9SupplyLine();
    if (busyHere) h += '<div class="work-row"><p>' + (workUi.aid === "p9hunt" ? "Spurensuche…" : "Nahrung sammeln…") + '</p><div class="work-bar"><i style="width:' + Math.round(workUi.pct || 0) + '%"></i></div></div>';
    else if (key === "camp") h += '<p class="cant">Im Ruinencamp gibt es nichts zu sammeln oder zu jagen. Geh ein Feld weiter (N/O/S/W) oder kauf beim ' + origLink("Händler", 'data-page="handeln"') + " (1 Gold je Einheit).</p>";
    else {
      h += '<p class="p7-btnrow"><a href="#" class="p7-btn" data-x="p9forage">Nahrung sammeln</a> <span class="p7-cost">' + origEsc(p9ForageCost()) + "</span></p>";
      h += t.prey.length ? '<p class="p7-btnrow"><a href="#" class="p7-btn" data-x="p9hunt">Auf die Jagd gehen</a> <span class="p7-cost">' + origEsc(p9HuntCost()) + "</span></p>"
        : '<p class="cant">Hier gibt es kein Wild zum Jagen.</p>';
    }
    const r = p9Range(s, t);
    h += '<h3>Was dieses Feld bietet</h3><table class="p7-explain p9-offer"><tr><th>Gelände</th><td><b>' + origEsc(t.n) + "</b></td></tr>";
    if (key !== "camp") {
      h += "<tr><th>Sammeln</th><td>" + origEsc(t.what) + ": <b>" + r[0] + "–" + r[1] + " Nahrung</b>, Erfolg " + Math.round(t.ok * 100) + " %" + (p9Mult(s) > 1 ? ' <span class="p7-small">(inkl. Bonus ×' + p9Mult(s).toFixed(2).replace(".", ",") + ")</span>" : "") + "</td></tr>";
      h += "<tr><th>Beifunde</th><td>" + (t.extra.length ? "15 %: " + origEsc(t.extra.map((x) => x[0]).join(", ")) + " · selten (2 %): Orangensaft, Seife" : "–") + "</td></tr>";
      h += "<tr><th>Wild</th><td>" + (t.prey.length ? "Spur finden " + Math.round(t.hunt * 100) + " %<br>" + t.prey.map((id) => { const e = ENEMIES[id]; return '<span class="p9-prey">' + p9EnemyImg(id) + "<b>" + origEsc(e.name) + "</b> KP " + e.kp + " · " + e.food[0] + "–" + e.food[1] + " Nahrung</span>"; }).join("") + '<br><span class="p7-small">Deine Kampfkraft: ' + playerKP(s) + " KP</span>" : "keins") + "</td></tr>";
      h += "<tr><th>Gefahr</th><td>" + (t.foe ? Math.round(t.danger * 100) + " % je Sammeln: " + origEsc(ENEMIES[t.foe].name) + " greift an" : "keine") + "</td></tr>";
    }
    h += "</table>";
    const better = ["wald", "oase"].filter((k) => k !== key).map((k) => p9Nearest(k)).filter(Boolean);
    if (better.length && key !== "wald") h += "<p>Mehr zu essen: " + better.map((o) => origEsc(o.l.name) + " " + p8XYLink(o.l.x, o.l.y, "nahrungssuche") + ' <span class="p7-small">(' + o.d + " Felder)</span>").join(" · ") + "</p>";
    h += '<p class="muted">Im Original (EzWiki-Archiv 2006) waren Nahrung und Wasser Ressourcen in der rechten Spalte: Man stirbt unter −10 Einheiten, Nahrung kam von der Jagd, von freien Händlern und der Farm. ' +
      "Hier geht alles direkt in deinen Vorrat. Sammeln (Beeren, Wurzeln, Pilze) ist DESIGN: Wald und Oase geben viel, Steppe mittel, Ruinen, Fels und Wüste wenig. Naturverbundenheit erhöht die Menge (max. +50 %), ein PSI-Wolf verdoppelt sie (Wiki). " +
      "Fleisch von Tieren: Wilder Hund 14–22, Wildschwein 26–40, Wüstenechse 6–11, Mutierte Ratte 5–9 (ein Wolf an deiner Seite bringt bis zu doppelt so viel, Wiki).</p>";
    h += "<h3>Verlauf (letzte " + P7_HIST_MAX + ")</h3>" + p7HistTable(p.hist);
    return h;
  }
  function p9SupplyHtml() {
    const s = state;
    const left = (v) => v + 10 > 0 ? "reicht ohne Aktionen noch ca. " + (v + 10) + " Minuten bis −10" : "kritisch";
    return '<div class="pack p9-supply"><h3>Vorrat</h3>' +
      '<p class="p9-sup-row"><img src="assets/rohstoffe/nahrung.gif" alt=""> Nahrung <b class="' + p9LowCls(s.food) + '">' + s.food + '</b> <span class="p7-small">' + left(s.food) + "</span></p>" +
      '<p class="p9-sup-row"><img src="assets/rohstoffe/wasser.gif" alt=""> Wasser <b class="' + p9LowCls(s.water) + '">' + s.water + '</b> <span class="p7-small">' + left(s.water) + "</span></p>" +
      '<p class="muted">Nahrung und Wasser werden automatisch verbraucht: je Minute und je Aktion (Arbeiten, Reisen, Kämpfen) 1 Einheit. Essen oder Trinken musst du nicht. Bei −10 stirbt der Charakter (Wiki). ' +
      "Tränke, Pillen und Kräuter mit Wirkung nimmst du weiter selbst (unten bei den Gegenständen).</p>" +
      "<p>Nachschub: " + origLink("Nahrungssuche", 'data-page="nahrungssuche"') + " · " + origLink("Wassersuche", 'data-page="wassersuche"') + " · " + origLink("Jagen", 'data-page="jagen"') + " · " + origLink("Handeln", 'data-page="handeln"') + "</p></div>";
  }
  function p9WarnHtml() {
    const s = state; if (!s || s.dead) return "";
    const low = [];
    if (s.food <= P9_LOW) low.push("Nahrung " + s.food);
    if (s.water <= P9_LOW) low.push("Wasser " + s.water);
    if (!low.length) return "";
    const crit = s.food <= 0 || s.water <= 0;
    return '<div class="p9-warn' + (crit ? " crit" : "") + '" role="alert"><b>' + (crit ? "Vorrat leer!" : "Vorrat knapp:") + "</b> " + low.join(" · ") + ". Bei −10 stirbst du. " +
      (s.food <= P9_LOW ? origLink("Nahrungssuche", 'data-page="nahrungssuche"') + " · " : "") + (s.water <= P9_LOW ? origLink("Wassersuche", 'data-page="wassersuche"') + " · " : "") + origLink("Handeln", 'data-page="handeln"') + "</div>";
  }
  function p9WarnLog() {
    const s = state; if (!s || s.dead) return;
    const p = p9(s);
    ["food", "water"].forEach((k) => {
      const v = s[k]; const lvl = v <= 0 ? 2 : v <= P9_LOW ? 1 : 0;
      const was = (p.warn && p.warn[k]) || 0;
      if (lvl > was) log((k === "food" ? "Nahrung" : "Wasser") + "-Vorrat " + (lvl === 2 ? "leer" : "knapp") + ": " + v + ". Bei −10 stirbst du.", "bad");
      p.warn = p.warn || {}; p.warn[k] = lvl;
    });
  }
  const p9RenderOrigPage = renderOrigPage;
  renderOrigPage = function () {
    if (!state) return p9RenderOrigPage();
    p9WarnLog();
    let h;
    if (origPage === "nahrungssuche") h = p8TravelBoxHtml() + p8Coords(p9Page(), origPage);
    else {
      h = p9RenderOrigPage();
      if (origPage === "jagen") h = h.replace("</h2>", "</h2>" + p9SupplyLine() + '<p>Fleisch geht direkt in den Vorrat: Wilder Hund 14–22 Nahrung je Sieg. Mehr Wild (Wildschwein, Echse, Ratte) und Sammeln unter ' + origLink("Nahrungssuche", 'data-page="nahrungssuche"') + ".</p>");
      if (origPage === "wassersuche") h = h.replace("</h2>", "</h2>" + p9SupplyLine() + "<p>Gefundenes Wasser (12–30 Einheiten je Suche) geht direkt in den Vorrat.</p>");
    }
    return p9WarnHtml() + h;
  };
  const p9ExtCmd = extCmd;
  extCmd = function (cmd) {
    const c = String(cmd || "").split("|")[0];
    if (c === "p9forage") { p9Forage(); return; }
    if (c === "p9hunt") { p9Hunt(); return; }
    return p9ExtCmd(cmd);
  };
  window.__p9 = { P9_TERRAIN, p9TerrainKey, p9Supply };

  // =====================================================================
  // Hotfix 9.1 (18.10.2026): Nachholen nach Abwesenheit gedeckelt, tote Stände durch diesen Fehler wiederbelebt.
  // Fehler: lastNeedsAt holte beim Öffnen ALLE verpassten Minuten nach (26 h zu → −1572 Nahrung → tot), und enterGame()
  // ersetzte tote Stände still durch einen neuen Wanderer.
  // =====================================================================
  const P91_OFFLINE_MAX = 30 * 60000; // DESIGN: höchstens 30 Minuten Bedarf/Strahlung/Tier-Drift nach Abwesenheit
  let p91Beat = 0;
  /** Beim Laden: Drift auf 30 Minuten deckeln (lange Aktionen/Bauten laufen weiter nach echter Zeit). */
  function p91CapLoad(s, now) {
    if (!s || typeof s.lastNeedsAt !== "number") return 0;
    const floor = now - P91_OFFLINE_MAX;
    if (s.lastNeedsAt >= floor) return 0;
    const skipped = Math.floor((floor - s.lastNeedsAt) / 60000);
    s.lastNeedsAt = floor;
    return skipped;
  }
  /** Läuft bei jedem Bedarf-Takt: lag eine Lücke dazwischen (Handy im Hintergrund, Tab eingefroren), wird sie gedeckelt. */
  function p91Heartbeat() {
    const now = Date.now();
    if (state && p91Beat && typeof state.lastNeedsAt === "number" && now - p91Beat > 2 * 60000) {
      const excess = now - p91Beat - P91_OFFLINE_MAX;
      if (excess > 0) {
        state.lastNeedsAt = Math.min(now, state.lastNeedsAt + excess);
        log("Lange weg gewesen: nur die letzten 30 Minuten zählen für Nahrung und Wasser.", "sys");
      }
    }
    p91Beat = now;
  }
  function p91HasProgress(s) {
    return !!(s && ((s.ep || 0) > 0 || (s.techlevel || 0) > 0 || s.house || s.stamm || Object.keys(s.kills || {}).length));
  }
  /** Tot durch das Nachholen? Alte Stände kennen keine Todesursache; im Spiel endet der Tod bei −10 bis −12. */
  function p91OfflineDeath(s) {
    if (!s) return false;
    const low = Math.min(s.food, s.water);
    if (!(s.dead || low <= -10)) return false;
    if (s.deathCause === "spiel") return false;
    return low < -10 || s.deathCause === "nachholen";
  }
  function p91ReviveState(s, why) {
    s.food = Math.max(s.food, 30); s.water = Math.max(s.water, 30);
    s.dead = false; delete s.deathCause; delete s.deathAt;
    s.lastNeedsAt = Date.now();
    s.p91note = why;
    s.p91revived = (s.p91revived || 0) + 1;
  }
  const p91MigrateBase = migrateState;
  migrateState = function (s) {
    const r = p91MigrateBase(s) || s;
    const now = Date.now();
    const skipped = p91CapLoad(r, now);
    if (skipped > 0) r.p91skipped = skipped;
    if (p91OfflineDeath(r)) p91ReviveState(r, "abwesenheit");
    return r;
  };
  function p91AfterLoad() {
    const s = state; if (!s) return;
    p91Beat = Date.now();
    if (s.p91skipped && !s.p91note) { const m = "Willkommen zurück. Für die Abwesenheit zählen nur 30 Minuten Nahrung und Wasser (statt " + (s.p91skipped + 30) + ")."; log(m, "sys"); showResult(m); }
    delete s.p91skipped;
    if (s.p91note) {
      const msg = s.p91note === "abwesenheit" ? "Dein Charakter wurde nach langer Abwesenheit wiederbelebt. Nahrung " + s.food + ", Wasser " + s.water + " – EP, Gegenstände und alles andere sind erhalten." : "Dein Charakter wurde wiederbelebt. Nahrung " + s.food + ", Wasser " + s.water + ".";
      delete s.p91note;
      log(msg, "good"); showResult(msg);
    }
    save({ quiet: true }); renderAll();
  }
  /** Wirklich toter Stand mit Fortschritt: laden und das Todesfenster mit Auswahl zeigen (nichts löschen). */
  function p91ShowDead(s) {
    state = s; diedThisSession = true;
    showGame();
    log("Dein Charakter ist tot (Nahrung oder Wasser bei −10). Du kannst ihn wiederbeleben oder neu anfangen.", "bad");
    renderAll();
    const ov = document.getElementById("dead-overlay"); if (ov) ov.classList.remove("hidden");
  }
  /** DESIGN: Wiederbeleben kostet die Hälfte des Golds; EP und Gegenstände bleiben. */
  function p91Revive() {
    const s = state; if (!s || !s.dead) return;
    const lost = Math.floor((s.gold || 0) / 2); s.gold = (s.gold || 0) - lost;
    p91ReviveState(s, "spiel");
    diedThisSession = false;
    const ov = document.getElementById("dead-overlay"); if (ov) ov.classList.add("hidden");
    p91AfterLoad();
    if (lost) log("Wiederbelebung: −" + lost + " Gold.", "bad");
  }

  // =====================================================================
  // Fix „Höhle“ (18.10.2026): Ort-Aktionen (Höhle erkunden, Betreten, Quest-Schritte, Handeln) waren nur in der Land-Ansicht
  // (Landkarte → eigenes Feld) zu finden. Jetzt: Kasten „Hier ist …“ auf Erkunden/Graben/Nahrungssuche, Aufgaben mit
  // „Jetzt …“-Knopf am Zielort, Link „Aktionen an diesem Ort“ unter dem Ort rechts.
  // =====================================================================
  const FH_RES = ["holz", "stein", "metall", "kunststoff", "wasser", "sand", "oel", "gas", "erz", "graben"];
  function fhHereLoc() {
    const s = state; if (!s || !s.locId || s.locId === "field") return null;
    const l = locById(s.locId);
    if (!l) return null;
    if (typeof s.px === "number" && (l.x !== s.px || l.y !== s.py)) return null;
    return l;
  }
  /** Ort-Aktionen wie in der Land-Ansicht (gleiche ACTIONS, gleiche show-Regeln), ohne Rohstoff-Arbeiten. */
  function fhActs(loc) {
    const s = state; const out = [];
    (loc.actions || []).forEach((aid) => {
      if (FH_RES.includes(aid)) return;
      const def = ACTIONS[aid]; if (!def) return;
      if (def.show && !def.show(s)) return;
      if (aid === "cave") {
        if (s.cavesVisited && s.cavesVisited[loc.caveKey]) out.push({ done: "Höhlen-Bonus hier schon geholt ✔" });
        else out.push({ aid, label: "Höhle erkunden (Bonus)", cost: "einmalig +75 EP und +75 CP (Wiki) · keine Nahrung/Wasser · " + Math.max(1, Math.round((def.duration || 500) / 1000)) + " s" });
        return;
      }
      if (aid === "visit") { out.push({ aid, label: (loc.tags || []).includes("Höhle") ? "Höhle betreten" : "Betreten", cost: p7CostText("work", "visit") }); return; }
      out.push({ aid, label: def.label, cost: aid === "rest" ? p7CostText("work", "rest") : p7CostText("work", aid) });
    });
    if (loc.trade) out.push({ page: "handeln", label: "Handeln", cost: "Händler hier" });
    if (availableEnemiesAt(loc).length) out.push({ page: "kaempfen", label: "Kämpfen", cost: availableEnemiesAt(loc).map((e) => e.name).join(", ") });
    return out;
  }
  function fhBoxHtml() {
    const loc = fhHereLoc(); if (!loc) return "";
    const acts = fhActs(loc);
    if (!acts.some((a) => a.aid || a.page && a.page !== "kaempfen") && !acts.some((a) => a.done)) return "";
    const cave = (loc.tags || []).includes("Höhle");
    let h = '<div class="fh-box"><p class="fh-t">' + (cave ? "Hier ist eine Höhle: " : "Hier: ") + "<b>" + origEsc(loc.name) + "</b> (" + loc.x + "/" + loc.y + ")</p>";
    acts.forEach((a) => {
      if (a.done) { h += '<p class="fh-done">' + origEsc(a.done) + "</p>"; return; }
      const attr = a.aid ? 'data-x="fhdo|' + a.aid + '"' : 'data-page="' + a.page + '"';
      h += '<p class="p7-btnrow"><a href="#" class="p7-btn fh-btn" ' + attr + ">" + origEsc(a.label) + '</a> <span class="p7-cost">' + origEsc(a.cost || "") + "</span></p>";
    });
    h += '<p class="fh-more">' + origLink("Aktionen an diesem Ort", 'data-land="' + loc.id + '"') + "</p></div>";
    return h;
  }
  /** Ort-Aktion ausführen, ohne die Seite zu wechseln (gleiche Logik wie data-here in der Land-Ansicht). */
  function fhDo(aid) {
    const loc = fhHereLoc();
    if (!loc || !(loc.actions || []).includes(aid)) { showResult("Diese Aktion gibt es nur direkt am Ort.", true); renderAll(); return; }
    startAction(aid);
  }
  const fhHereBase = p7HereHtml;
  p7HereHtml = function (withGround) {
    const base = fhHereBase(withGround);
    const loc = fhHereLoc();
    const more = loc ? '<p class="fh-here-link">' + origLink("Aktionen an diesem Ort", 'data-land="' + loc.id + '"') + "</p>" : "";
    return base + (fhBoxHtml() || more);
  };
  /** Aufgabe → Ort-Aktion, falls man gerade dort steht. */
  function fhTaskDo(t) {
    const loc = fhHereLoc(); if (!loc || !t || !t.g) return null;
    const g = t.g; const has = (aid) => (loc.actions || []).includes(aid);
    if (g.t === "cave" && has("cave") && !(state.cavesVisited || {})[loc.caveKey] && (!g.key || g.key === loc.caveKey)) return { attr: 'data-x="fhdo|cave"', label: "Jetzt Höhle erkunden" };
    if (g.t === "act" && g.a && !FH_RES.includes(g.a) && has(g.a) && ACTIONS[g.a]) return { attr: 'data-x="fhdo|' + g.a + '"', label: "Jetzt: " + ACTIONS[g.a].label };
    if (g.t === "act" && g.a && FH_RES.includes(g.a) && g.a !== "graben" && has(g.a)) return { attr: 'data-here="' + loc.id + "|" + g.a + '"', label: "Jetzt: " + ACTIONS[g.a].label };
    if (g.t === "kill" && g.e && availableEnemiesAt(loc).some((e) => e.id === g.e)) return { attr: 'data-foe="' + g.e + '"', label: "Jetzt kämpfen: " + ENEMIES[g.e].name };
    return null;
  }
  const fhTaskLinksBase = p7TaskLinks;
  p7TaskLinks = function (t) {
    const d = fhTaskDo(t);
    const base = fhTaskLinksBase(t);
    if (!d) return base;
    return '<span class="p7-links fh-task"><a href="#" class="p7-btn fh-btn" ' + d.attr + ">" + origEsc(d.label) + "</a></span>" + base;
  };
  const fhHudBase = p7HudLocHtml;
  p7HudLocHtml = function () {
    const loc = fhHereLoc();
    return fhHudBase() + (loc ? '<a href="#" class="fh-hud" data-land="' + loc.id + '" title="Land-Ansicht dieses Feldes">Aktionen an diesem Ort&nbsp;›</a>' : "");
  };
  const fhExtCmd = extCmd;
  extCmd = function (cmd) {
    const b = String(cmd || "").split("|");
    if (b[0] === "fhdo") { fhDo(b[1]); return; }
    return fhExtCmd(cmd);
  };

  // ===================================================================================================
  // Durchgang 10 – Begleitroboter „Optimus“. ALLES DESIGN: nicht aus dem Original-Endzeitspiel
  // (Anspielung auf Teslas Optimus). Eigener Begleiter-Platz neben den Tieren, die Tiere bleiben unverändert.
  // ===================================================================================================
  var p10RightOnly = false;
  let OPTIMUS_TEST_GRANT = true; // DESIGN: Testmodus – jeder Charakter bekommt Optimus sofort voll repariert (ohne Kauf)
  let OPTIMUS_BATTERY = false;   // DESIGN: Akku-System eingebaut, für den Test abgeschaltet
  const P10_IMG = "assets/gfx/optimus/";
  const P10_PARTS = ["Servomotor", "Akkuzelle", "Platine", "Sensorkopf", "KI-Kern"]; // DESIGN
  const P10_PART_INFO = { // DESIGN
    Servomotor: { img: "servomotor", d: "Gelenkmotor für Arme und Beine. Häufigstes Ersatzteil." },
    Akkuzelle: { img: "akkuzelle", d: "Energiezelle für längere Arbeit draußen." },
    Platine: { img: "platine", d: "Steuerplatine. Ohne sie kann Optimus nicht graben." },
    Sensorkopf: { img: "sensorkopf", d: "Kamera- und Sensorkopf zum Erkunden." },
    "KI-Kern": { img: "kikern", d: "Seltener Rechenkern. Erst damit denkt Optimus mit." },
  };
  const P10_PART_W = { Servomotor: 35, Akkuzelle: 25, Platine: 20, Sensorkopf: 13, "KI-Kern": 7 }; // DESIGN
  const P10_STAGES = [ // DESIGN: Mengen steigen von Stufe zu Stufe
    null,
    { need: { Servomotor: 3 }, l: "Sammeln", d: "sammelt Holz, Stein, Metall, Kunststoff, Sand und Erz" },
    { need: { Akkuzelle: 3, Servomotor: 2 }, l: "Wasser + Nahrung", d: "sucht Wasser und Nahrung für deinen Vorrat" },
    { need: { Platine: 4, Servomotor: 3 }, l: "Graben", d: "gräbt auf freien Feldern" },
    { need: { Sensorkopf: 3, Platine: 3, Akkuzelle: 3 }, l: "Erkunden", d: "erkundet Felder und findet Kleinkram und Ersatzteile" },
    { need: { "KI-Kern": 2, Sensorkopf: 2, Platine: 4, Akkuzelle: 4 }, l: "Mitdenken", d: "plant für Aufgaben und Gebäude und fragt, ob er bauen oder herstellen soll" },
  ];
  const P10_LVL = [0, 20, 60, 120, 200, 320, 480, 700, 1000, 1400]; // DESIGN: Optimus-EP je Stufe
  const P10_MODS = [ // DESIGN
    { id: "rucksack", n: "Größerer Rucksack", lvl: 2, img: "mod-rucksack", e: "+50 % Menge je Gang beim Sammeln", jobs: ["sammeln"] },
    { id: "wassersensor", n: "Wassersensor", lvl: 3, img: "mod-wassersensor", e: "+60 % Wasser", jobs: ["wasser"] },
    { id: "bohrer", n: "Bohrer", lvl: 4, img: "mod-bohrer", e: "+50 % beim Graben, auch harter Boden", jobs: ["graben"] },
    { id: "spurensucher", n: "Spurensucher", lvl: 5, img: "mod-spurensucher", e: "+60 % Nahrung", jobs: ["nahrung"] },
    { id: "metalldetektor", n: "Metalldetektor", lvl: 6, img: "mod-metalldetektor", e: "doppelte Chance auf Ersatzteile, findet Erz", jobs: ["graben", "erkunden"] },
    { id: "solarpanel", n: "Solarpanel", lvl: 7, img: "mod-solarpanel", e: "lädt den Akku beim Arbeiten (+0,5 %/Min.)", jobs: ["laden"] },
  ];
  const P10_JOB = { // DESIGN: Dauer der Arbeit am Ziel (Laufzeit kommt dazu), Optimus-EP
    sammeln: { ms: 12000, ep: 2, st: "sammelt" }, wasser: { ms: 12000, ep: 2, st: "sucht Wasser" }, nahrung: { ms: 15000, ep: 2, st: "sucht Nahrung" },
    graben: { ms: 20000, ep: 3, st: "gräbt" }, erkunden: { ms: 30000, ep: 4, st: "erkundet" }, laden: { ms: 0, ep: 0, st: "lädt" }, ruhe: { ms: 30000, ep: 0, st: "wartet" },
  };
  const P10_STEP_MS = 500;              // DESIGN: Laufzeit je Feld
  const P10_OFFLINE_MAX = 4 * 3600000;  // DESIGN: höchstens 4 Std. Nachholen
  const P10_RES = { Holz: "holz", Stein: "stein", Metall: "metall", Kunststoff: "kunststoff", Sand: "sand", Erz: "erz", "Öl": "oel" };
  const P10_SCARCE = 60;   // DESIGN: „knapp“ unter 60
  const P10_VORRAT = 150;  // DESIGN: Ziel bei „Vorräte sichern“
  const P10_BAG = 60;      // DESIGN: eigene Tasche, wenn Rucksack und Lager voll sind
  const P10_DECLINE_MS = 10 * 60000; // DESIGN: abgelehnte Anfrage 10 Min. nicht wiederholen
  const P10_PRIOS = [["auto", "Automatisch"], ["vorrat", "Vorräte sichern"], ["aufgabe", "Aktuelle Aufgabe"], ["gebaeude", "Gebäude"], ["knapp", "Knappe Rohstoffe"]];
  const P10_FLEE_ENEMY = 0.06, P10_FLEE_ELSE = 0.02, P10_DMG = 0.002, P10_DMG_GLAS = 0.02; // DESIGN
  const P10_BAT_MS_PER_PCT = 72000; // DESIGN: 100 % reichen für 2 Std. Arbeit

  function p10Pause() { return typeof window !== "undefined" && !!window.__ezsOptimusPause; }
  function p10O(s) {
    s = s || state; if (!s) return null;
    let o = s.optimus;
    if (!o || typeof o !== "object") o = s.optimus = {};
    const d = { stage: 0, owned: null, found: false, oep: 0, x: 50, y: 100, job: null, prio: "auto", target: null, equip: [], why: "", log: [], req: null, declined: {},
      damaged: null, bat: 100, clock: Date.now(), bag: {}, stats: { jobs: 0, fled: 0, parts: 0, items: {} }, setup: false, away: null };
    Object.keys(d).forEach((k) => { if (o[k] === undefined || o[k] === null && (k === "log" || k === "bag" || k === "declined" || k === "equip" || k === "stats")) o[k] = d[k]; });
    if (OPTIMUS_TEST_GRANT && o.stage < 5) {
      o.stage = 5; o.found = true; o.owned = o.owned || "test"; o.clock = Date.now();
      p10Log(o, "Testmodus: Optimus ist voll repariert und gehört dir (ohne Kauf).", Date.now());
    }
    return o;
  }
  function p10Lvl(o) { let l = 1; for (let i = 1; i < P10_LVL.length; i++) if (o.oep >= P10_LVL[i]) l = i + 1; return l; }
  function p10Abil(o) { const st = o.stage || 0; return { sammeln: st >= 1, versorgen: st >= 2, graben: st >= 3, erkunden: st >= 4, mitdenken: st >= 5 }; }
  function p10Time(t) { return new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(t)); }
  function p10Log(o, m, t, main) {
    o.log = o.log || []; o.log.push({ t: t || Date.now(), m: m });
    if (o.log.length > 100) o.log.splice(0, o.log.length - 100);
    if (main && !p10Catching) log("Optimus: " + m, main);
  }
  let p10Catching = false;
  function p10PlaceName(x, y) { const p = placeAt(x, y); return (p ? p.name : "Freies Land") + " (" + x + "/" + y + ")"; }
  function p10Have(s, k) {
    const inLager = s.house && s.house.lager && (s.house.lagerBuilt || !s.house.type) ? (s.house.lager[k] || 0) : 0;
    return (s.inv[k] || 0) + inLager;
  }
  function p10Afford(s, cost) { return Object.keys(cost).every((k) => (k === "gold" ? s.gold : p10Have(s, k)) >= cost[k]); }
  function p10IsRoh(k) { return ROHSTOFFE.some((r) => r[0] === k); }
  function p10BagN(o) { return Object.keys(o.bag || {}).reduce((n, k) => n + (o.bag[k] || 0), 0); }
  function p10ModsUnlocked(o) { const l = p10Lvl(o); return P10_MODS.filter((m) => l >= m.lvl); }
  function p10Has(o, id) { return (o.equip || []).includes(id); }

  // ---- Wohin für welchen Rohstoff? ----
  function p10FieldFor(s, o, kind, res) {
    const tl = s.techlevel || 0; let aids;
    if (kind === "sammeln") aids = [P10_RES[res]];
    else if (kind === "wasser") aids = ["wasser"];
    else if (kind === "nahrung") aids = ["holz", "wasser"]; // Wald oder Oase
    else return null;
    const locs = LOCATIONS.filter((l) => (l.actions || []).some((a) => aids.includes(a)) && placeGate(l, s).open && aids.every((a) => !(l.actions || []).includes(a) || !ACTIONS[a] || (ACTIONS[a].needTL || 0) <= tl));
    if (!locs.length) return null;
    locs.sort((a, b) => manhattan(o, a) - manhattan(o, b));
    return locs[0];
  }
  function p10FreeField(s, o, r, hardOk) {
    for (let i = 0; i < 25; i++) {
      const x = clamp(o.x + rand(-r, r), 1, 200), y = clamp(o.y + rand(-r, r), 1, 200);
      if (placeAt(x, y)) continue;
      if (groundAt(x, y) === "hart" && !hardOk) continue;
      return { x, y };
    }
    return null;
  }
  // ---- Was wird gerade gebraucht? ----
  function p10TaskCost(s, t) {
    const g = t.g;
    switch (g.t) {
      case "inv": return { [g.k]: g.n };
      case "need": case "cost": return g.cost;
      case "house": { const h = HOUSES.find((x) => x.id === g.id); return h ? h.cost : null; }
      case "lager": return LAGER_COST;
      case "lagerN": return { [g.k]: g.n };
      case "craft": { const c = CRAFTS.find((x) => x.id === g.id); return c ? c.cost : null; }
      case "crafts": { const id = g.ids.find((x) => !p7Met(s, { t: "craft", id: x })); const c = id && CRAFTS.find((x) => x.id === id); return c ? c.cost : null; }
    }
    return null;
  }
  function p10Missing(s, cost, why, out, mode) {
    if (!cost) return;
    Object.keys(cost).forEach((k) => {
      if (k === "gold") return;
      const have = mode === "inv" ? (s.inv[k] || 0) : mode === "lager" ? ((s.house && s.house.lager && s.house.lager[k]) || 0) : p10Have(s, k);
      const miss = cost[k] - have;
      if (miss > 0 && (P10_RES[k] || k === "Wasser" || k === "Nahrung")) out.push({ k, miss, why });
    });
  }
  function p10TaskNeeds(s) {
    const out = []; const cur = p7Current(s); if (!cur) return out;
    const tasks = cur.open && cur.open.length ? cur.open : [cur.task];
    tasks.forEach((t) => { if (!p7Met(s, t.g)) p10Missing(s, p10TaskCost(s, t), "Aufgabe „" + t.l + "“", out, t.g.t === "inv" || t.g.t === "need" || t.g.t === "cost" ? "inv" : t.g.t === "lagerN" ? "lager" : null); });
    return out;
  }
  function p10TargetDef(id) {
    if (!id) return null;
    const [kind, k] = id.split(":");
    if (kind === "house") { const h = HOUSES.find((x) => x.id === k); return h && { kind, id: k, name: h.name, cost: h.cost }; }
    if (kind === "lager") return { kind: "lager", id: "lager", name: "Privatlager", cost: LAGER_COST };
    if (kind === "build") { const b = BUILDINGS.find((x) => x.id === k); return b && { kind, id: k, name: b.name, cost: b.cost }; }
    return null;
  }
  function p10TargetDone(s, td) {
    if (!td) return true;
    if (td.kind === "house") return !!(s.house && s.house.type === td.id);
    if (td.kind === "lager") return !!(s.house && s.house.lagerBuilt);
    if (td.kind === "build") return !!(s.buildings && s.buildings[td.id]);
    return true;
  }
  function p10TargetNeeds(s, o) {
    const out = []; const td = p10TargetDef(o.target);
    if (td && !p10TargetDone(s, td)) p10Missing(s, td.cost, "Gebäude „" + td.name + "“", out);
    return out;
  }
  function p10Scarce(s, o, ab) {
    const out = [];
    Object.keys(P10_RES).forEach((k) => { const h = p10Have(s, k); if (h < P10_SCARCE && p10FieldFor(s, o, "sammeln", k)) out.push({ k, miss: P10_SCARCE - h, why: "knapp (" + h + ")" }); });
    if (ab.versorgen) ["Wasser", "Nahrung"].forEach((k) => { const h = s.inv[k] || 0; if (h < P10_SCARCE) out.push({ k, miss: P10_SCARCE - h, why: "Vorrat knapp (" + h + ")" }); });
    out.sort((a, b) => b.miss - a.miss);
    return out;
  }

  // ---- Ausrüstung: wählt selbst das Beste für den Auftrag ----
  function p10Equip(s, o, job, t) {
    const un = p10ModsUnlocked(o); const slots = p10Lvl(o) >= 5 ? 2 : 1;
    const score = (m) => {
      if (m.jobs.includes(job.kind)) return m.id === "metalldetektor" && job.kind === "graben" ? 2 : 3;
      if (m.id === "solarpanel" && OPTIMUS_BATTERY && o.bat < 60) return 2.5;
      if (m.id === "metalldetektor" && o.stage < 5) return 1.5;
      if (m.id === "rucksack" && (job.kind === "graben" || job.kind === "erkunden")) return 1;
      return 0.5;
    };
    const pick = un.slice().sort((a, b) => score(b) - score(a) || b.lvl - a.lvl).slice(0, slots);
    const ids = pick.map((m) => m.id);
    const why = pick.map((m) => m.n + ": " + (m.jobs.includes(job.kind) ? "passt zu „" + P10_JOB[job.kind].st + "“ – " + m.e : m.id === "solarpanel" && OPTIMUS_BATTERY && o.bat < 60 ? "Akku unter 60 %" : "freier Platz – " + m.e)).join(" · ");
    const old = (o.equip || []).slice().sort().join(","), now = ids.slice().sort().join(",");
    if (old !== now && ids.length) p10Log(o, "wechselt Ausrüstung: " + pick.map((m) => m.n).join(" + ") + " (" + (pick[0].jobs.includes(job.kind) ? "beste für „" + P10_JOB[job.kind].st + "“" : "passt am besten") + ").", t);
    o.equip = ids; o.why = why || "";
  }

  // ---- Auftrag wählen ----
  function p10MkJob(s, o, kind, tx, ty, t, res, why) {
    const dist = Math.abs(o.x - tx) + Math.abs(o.y - ty);
    const j = { kind, res: res || null, tx, ty, fx: o.x, fy: o.y, t0: t, tr: dist * P10_STEP_MS, wk: P10_JOB[kind].ms, why: why || "", id: (o.stats.jobs || 0) + 1 };
    return j;
  }
  function p10ChargeRate(s) { // DESIGN %/Min.
    if (["reaktor1", "reaktor2", "reaktor3"].some((id) => stammHas(s, id))) return { r: 10, at: "camp", n: "Reaktor" };
    if (hasHouse(s) || s.stamm) return { r: 3, at: "camp", n: hasHouse(s) ? "Haus" : "Stammlager" };
    return { r: 1, at: null, n: "unterwegs" };
  }
  function p10Choose(s, o, t) {
    const ab = p10Abil(o); if (!ab.sammeln) return null;
    if (OPTIMUS_BATTERY && o.bat <= 8) {
      const cr = p10ChargeRate(s); const tx = cr.at ? 50 : o.x, ty = cr.at ? 100 : o.y;
      const j = p10MkJob(s, o, "laden", tx, ty, t, null, "Akku leer – lädt (" + cr.n + ", " + cr.r + " %/Min.)");
      j.wk = Math.ceil((100 - o.bat) / cr.r) * 60000; j.rate = cr.r;
      p10Equip(s, o, j, t); return j;
    }
    const packFull = packCap(s) - packLoad(s) < 10 && !(s.house && s.house.lagerBuilt) && p10BagN(o) >= P10_BAG;
    const tryNeed = (n) => {
      if (n.k === "Wasser") { if (!ab.versorgen) return null; const l = p10FieldFor(s, o, "wasser"); return l && p10MkJob(s, o, "wasser", l.x, l.y, t, "Wasser", n.why); }
      if (n.k === "Nahrung") { if (!ab.versorgen) return null; const l = p10FieldFor(s, o, "nahrung"); return l && p10MkJob(s, o, "nahrung", l.x, l.y, t, "Nahrung", n.why); }
      if (packFull) return null;
      const l = p10FieldFor(s, o, "sammeln", n.k); return l && p10MkJob(s, o, "sammeln", l.x, l.y, t, n.k, n.why);
    };
    const lists = [];
    const supply = [];
    if (ab.versorgen) {
      const lim = o.prio === "vorrat" ? P10_VORRAT : 30;
      const low = [["Nahrung", s.food], ["Wasser", s.water]].filter((x) => x[1] <= lim).sort((a, b) => a[1] - b[1]);
      low.forEach((x) => supply.push({ k: x[0], miss: lim - x[1], why: (o.prio === "vorrat" ? "Vorräte sichern" : "dein Vorrat ist niedrig") + " (" + x[0] + " " + x[1] + ")" }));
    }
    if (o.prio === "knapp") lists.push(p10Scarce(s, o, ab));
    else if (o.prio === "gebaeude") lists.push(p10TargetNeeds(s, o), p10TaskNeeds(s));
    else if (o.prio === "aufgabe") lists.push(p10TaskNeeds(s), p10TargetNeeds(s, o));
    else lists.push(p10TaskNeeds(s), p10TargetNeeds(s, o));
    if (o.prio !== "knapp") lists.unshift(supply);
    // ab und zu graben/erkunden (DESIGN: jeder 7. Gang), wenn nichts dringend ist
    const urgent = supply.length > 0;
    const side = () => {
      const opts = [];
      if (ab.graben) { const f = p10FreeField(s, o, 4, p10ModsUnlocked(o).some((m) => m.id === "bohrer")); if (f) opts.push(p10MkJob(s, o, "graben", f.x, f.y, t, null, "Graben nach Brauchbarem und Ersatzteilen")); }
      if (ab.erkunden) { const f = p10FreeField(s, o, 6, true); if (f) opts.push(p10MkJob(s, o, "erkunden", f.x, f.y, t, null, "Erkunden in der Nähe")); }
      return opts.length ? opts[rand(0, opts.length - 1)] : null;
    };
    let job = null;
    if (!urgent && (o.stats.jobs || 0) % 7 === 6) job = side();
    for (const list of lists) { if (job) break; for (const n of list) { job = tryNeed(n); if (job) break; } }
    if (!job && o.prio !== "knapp") for (const n of p10Scarce(s, o, ab)) { job = tryNeed(n); if (job) break; }
    if (!job) job = side();
    if (!job) { job = p10MkJob(s, o, "ruhe", o.x, o.y, t, null, packFull ? "Rucksack, Lager und Tasche voll – Ladung abholen" : "nichts zu tun"); }
    p10Equip(s, o, job, t);
    return job;
  }

  // ---- Abliefern ----
  function p10Deliver(s, o, k, n) {
    if (n <= 0) return "";
    if (k === "Nahrung" || k === "Wasser") { addInv(s, k, n); return "Vorrat"; }
    if (!p10IsRoh(k)) { addInv(s, k, n); return "Rucksack"; }
    const free = Math.max(0, packCap(s) - packLoad(s));
    const a = Math.min(n, free); if (a) addInv(s, k, a);
    let rest = n - a; let where = a ? "Rucksack" : "";
    if (rest > 0 && s.house && s.house.lagerBuilt) {
      const h = houseDef(s); const cap = h ? h.lager : 0; const put = Math.max(0, Math.min(rest, cap - (s.house.lager[k] || 0)));
      if (put) { s.house.lager[k] = (s.house.lager[k] || 0) + put; rest -= put; where = where ? where + " + Privatlager" : "Privatlager"; }
    }
    if (rest > 0) { const put = Math.max(0, Math.min(rest, P10_BAG - p10BagN(o))); if (put) { o.bag[k] = (o.bag[k] || 0) + put; where = where ? where + " + seine Tasche" : "seine Tasche"; } }
    return where || "nirgends (alles voll)";
  }
  function p10Unload(s, o) {
    const ks = Object.keys(o.bag || {}); if (!ks.length) return 0;
    let moved = 0;
    ks.forEach((k) => {
      const n = o.bag[k] || 0; let free = Math.max(0, packCap(s) - packLoad(s)); let a = Math.min(n, free);
      if (a) addInv(s, k, a);
      let rest = n - a;
      if (rest > 0 && s.house && s.house.lagerBuilt) { const h = houseDef(s); const put = Math.max(0, Math.min(rest, (h ? h.lager : 0) - (s.house.lager[k] || 0))); if (put) { s.house.lager[k] = (s.house.lager[k] || 0) + put; rest -= put; a += put; } }
      moved += a; if (rest > 0) o.bag[k] = rest; else delete o.bag[k];
    });
    return moved;
  }

  // ---- Ersatzteile ----
  function p10PickPart(s, o) {
    const st = P10_STAGES[(o.stage || 0) + 1];
    if (st && Math.random() < 0.7) {
      const miss = Object.keys(st.need).filter((k) => (s.inv[k] || 0) < st.need[k]);
      if (miss.length) return miss[rand(0, miss.length - 1)];
    }
    let r = Math.random() * 100;
    for (const k of P10_PARTS) { r -= P10_PART_W[k]; if (r < 0) return k; }
    return "Servomotor";
  }
  function p10SpareN(s) { return P10_PARTS.reduce((n, k) => n + (s.inv[k] || 0), 0); }
  const P10_FIND = { graben: 0.02, erkunden: 0.03, nahrungssuche: 0.015, cave: 0.25, visit: 0.08, metall: 0.04, kunststoff: 0.04 }; // DESIGN
  function p10PlayerFind(s, src) {
    if (!s || s.dead) return "";
    const o = p10O(s);
    if (o.stage >= 5 && p10SpareN(s) >= 3) return ""; // fertig repariert: nur noch ein paar Teile zum Flicken
    if (Math.random() >= (P10_FIND[src] || 0)) return "";
    const k = p10PickPart(s, o); addInv(s, k, 1); o.stats.parts = (o.stats.parts || 0) + 1;
    p10Log(o, "Du hast ein Ersatzteil gefunden: 1× " + k + ".", Date.now());
    return "Ersatzteil für Optimus gefunden: 1× " + k + "!";
  }
  function p10AppendResult(txt) {
    if (resultLines.length) resultLines[resultLines.length - 1].text += " " + txt; else showResult(txt);
    renderResultBanner(); log(txt, "good");
  }
  ["graben", "cave", "visit", "metall", "kunststoff"].forEach((aid) => {
    const d = ACTIONS[aid]; if (!d || typeof d.run !== "function") return;
    const base = d.run;
    d.run = function (s) {
      const r = base.apply(this, arguments);
      if (r && r.ok !== false) { const f = p10PlayerFind(s || state, aid); if (f) r.msg = (r.msg || "") + " " + f; }
      return r;
    };
  });
  const p10ErkBase = p7ErkundenFinish;
  p7ErkundenFinish = function () { const s = state; const dead0 = !s || s.dead; p10ErkBase(); if (!dead0 && state && !state.dead) { const f = p10PlayerFind(state, "erkunden"); if (f) { p10AppendResult(f); save({ quiet: true }); renderAll(); } } };
  const p10ForBase = p9ForageFinish;
  p9ForageFinish = function () { const s = state; const dead0 = !s || s.dead; p10ForBase(); if (!dead0 && state && !state.dead) { const f = p10PlayerFind(state, "nahrungssuche"); if (f) { p10AppendResult(f); save({ quiet: true }); renderAll(); } } };

  // ---- Auftrag abschließen ----
  function p10Add(sum, k, n) { if (sum && n > 0) sum.items[k] = (sum.items[k] || 0) + n; }
  function p10Finish(s, o, j, t, sum) {
    o.x = j.tx; o.y = j.ty;
    const where = p10PlaceName(j.tx, j.ty);
    if (OPTIMUS_BATTERY) {
      if (j.kind === "laden") { o.bat = 100; p10Log(o, "Akku voll geladen.", t); return; }
      o.bat = clamp(o.bat - (j.tr + j.wk) / P10_BAT_MS_PER_PCT + (p10Has(o, "solarpanel") ? (j.tr + j.wk) / 120000 : 0), 0, 100);
    }
    if (j.kind === "ruhe") return;
    // Flucht statt Kampf
    const pl = placeAt(j.tx, j.ty);
    const foes = pl && pl.enemies && pl.enemies.length ? pl.enemies : null;
    if (Math.random() < (foes ? P10_FLEE_ENEMY : P10_FLEE_ELSE)) {
      const fid = foes ? foes[rand(0, foes.length - 1)] : null;
      const fn = fid && ENEMIES[fid] ? ENEMIES[fid].name : (Math.random() < 0.5 ? "Plünderer" : "Wilder Hund");
      o.stats.fled = (o.stats.fled || 0) + 1; if (sum) sum.fled++;
      p10Log(o, "flieht vor " + fn + " bei " + where + " – kein Kampf, Auftrag abgebrochen.", t, "info");
      return;
    }
    const mul = (id, f) => (p10Has(o, id) ? f : 1);
    const got = [];
    const give = (k, n) => { n = Math.max(0, Math.round(n)); if (!n) return; const w = p10Deliver(s, o, k, n); got.push(n + " " + k + (w && w !== "Rucksack" && w !== "Vorrat" ? " (" + w + ")" : "")); o.stats.items[k] = (o.stats.items[k] || 0) + n; p10Add(sum, k, n); };
    let partCh = 0;
    if (j.kind === "sammeln") { give(j.res, rand(3, 6) * mul("rucksack", 1.5)); if (j.res === "Erz" && Math.random() < 0.2) give("Kristall", 1); }
    else if (j.kind === "wasser") give("Wasser", rand(5, 12) * mul("wassersensor", 1.6));
    else if (j.kind === "nahrung") give("Nahrung", rand(4, 9) * mul("spurensucher", 1.6));
    else if (j.kind === "graben") {
      const pool = [["Sand", 2, 4, 30], ["Stein", 1, 3, 20], ["Kronkorken", 1, 2, 20], ["Metall", 1, 2, 10], ["Knochen", 1, 1, 10]];
      if (p10Has(o, "metalldetektor")) pool.push(["Erz", 1, 2, 12]);
      let r = Math.random() * pool.reduce((n, p) => n + p[3], 0);
      for (const p of pool) { r -= p[3]; if (r < 0) { give(p[0], rand(p[1], p[2]) * mul("bohrer", 1.5)); break; } }
      partCh = 0.03;
    } else if (j.kind === "erkunden") {
      if (Math.random() < 0.6) { const pool = [["Kronkorken", 1, 3], ["Holz", 2, 4], ["Knochen", 1, 1], ["Kräuter", 1, 1], ["Metall", 1, 2]]; const p = pool[rand(0, pool.length - 1)]; give(p[0], rand(p[1], p[2])); }
      partCh = 0.06;
    }
    if (partCh && Math.random() < partCh * mul("metalldetektor", 2) && !(o.stage >= 5 && p10SpareN(s) >= 3)) {
      const k = p10PickPart(s, o); addInv(s, k, 1); o.stats.parts = (o.stats.parts || 0) + 1; if (sum) sum.parts++;
      got.push("Ersatzteil 1× " + k + "!");
    }
    const ep = P10_JOB[j.kind].ep; const l0 = p10Lvl(o); o.oep += ep; o.stats.jobs = (o.stats.jobs || 0) + 1; if (sum) sum.jobs++;
    const verb = { sammeln: "sammelt", wasser: "schöpft", nahrung: "findet", graben: "gräbt", erkunden: "erkundet" }[j.kind];
    p10Log(o, verb + " " + (got.length ? got.join(", ") : "nichts") + " – " + where + ".", t);
    const l1 = p10Lvl(o);
    if (l1 > l0) {
      const nm = P10_MODS.filter((m) => m.lvl === l1);
      p10Log(o, "erreicht Stufe " + l1 + "!" + (nm.length ? " Neues Modul: " + nm.map((m) => m.n).join(", ") + "." : ""), t, "good");
    }
    // Schaden (sehr selten)
    const glas = !pl && groundAt(j.tx, j.ty) === "glas";
    if (Math.random() < (glas ? P10_DMG_GLAS : P10_DMG)) {
      const cause = glas ? "Strahlung" : "Plünderer";
      const part = P10_PARTS.slice().sort((a, b) => (s.inv[b] || 0) - (s.inv[a] || 0)).find((k) => (s.inv[k] || 0) > 0);
      if (part) { takeInv(s, part, 1); p10Log(o, "wurde beschädigt (" + cause + ") und flickt sich selbst mit 1× " + part + " aus deinem Rucksack.", t, "info"); if (sum) sum.patched = (sum.patched || 0) + 1; }
      else { o.damaged = { cause, at: t }; o.job = null; p10Log(o, "ist beschädigt (" + cause + ") und wartet, bis du ihn mit einem Ersatzteil flickst.", t, "bad"); if (sum) sum.dmg = true; }
    }
    if (!o.damaged) p10CheckReq(s, o, t);
  }

  // ---- Anfragen (Stufe 5: Mitdenken) ----
  function p10ReqFor(s, kind, id) {
    if (kind === "house") { const h = HOUSES.find((x) => x.id === id); if (!h || hasHouse(s) || (s.techlevel || 0) < h.tl || !p10Afford(s, h.cost)) return null; return { kind, id, text: "Material für " + h.name + " komplett – jetzt bauen?", camp: true }; }
    if (kind === "lager") { if (!hasHouse(s) || s.house.lagerBuilt || !p10Afford(s, LAGER_COST)) return null; return { kind, id: "lager", text: "Material für das Privatlager komplett – jetzt bauen?", camp: true }; }
    if (kind === "build") { const b = BUILDINGS.find((x) => x.id === id); if (!b || (s.buildings && s.buildings[id]) || !p10Afford(s, b.cost)) return null; return { kind, id, text: "Material für " + b.name + " komplett – jetzt bauen?", camp: true }; }
    if (kind === "craft") {
      const c = CRAFTS.find((x) => x.id === id); if (!c || !canCraft(c) || (c.goldCost && s.gold < c.goldCost)) return null;
      const invOk = Object.keys(c.cost).every((k) => (k === "gold" ? s.gold : s.inv[k] || 0) >= c.cost[k]);
      if (!invOk && !p10Afford(s, c.cost)) return null;
      return { kind, id, text: "Material für " + c.label.replace(/ (fertigen|herstellen|bauen)$/, "") + " komplett – jetzt herstellen?", camp: !invOk };
    }
    if (kind === "quest") { const q = QUESTS.find((x) => x.id === id); const st = s.quests && s.quests[id]; if (!q || !st || st.claimed || q.chain || q.autoClaim || !q.check(s)) return null; return { kind, id, text: "Quest „" + q.title + "“ erfüllt – jetzt abschließen?" }; }
    return null;
  }
  function p10CheckReq(s, o, t) {
    if ((o.stage || 0) < 5 || o.req) return;
    const cands = [];
    const cur = p7Current(s);
    if (cur && o.prio !== "gebaeude" && o.prio !== "knapp") (cur.open && cur.open.length ? cur.open : [cur.task]).forEach((tk) => {
      const g = tk.g; if (p7Met(s, g)) return;
      if (g.t === "house") cands.push(["house", g.id]);
      else if (g.t === "lager") cands.push(["lager", "lager"]);
      else if (g.t === "craft") cands.push(["craft", g.id]);
      else if (g.t === "crafts") { const id = g.ids.find((x) => !p7Met(s, { t: "craft", id: x })); if (id) cands.push(["craft", id]); }
      else if (g.t === "quest") cands.push(["quest", g.q]);
    });
    const td = p10TargetDef(o.target);
    if (td && !p10TargetDone(s, td)) cands.push([td.kind, td.id]);
    QUESTS.forEach((q) => { const st = s.quests && s.quests[q.id]; if (st && !st.claimed && st.status !== "done") cands.push(["quest", q.id]); });
    for (const [kind, id] of cands) {
      const key = kind + ":" + id;
      if (o.declined[key] && t - o.declined[key] < P10_DECLINE_MS) continue;
      let r = null; try { r = p10ReqFor(s, kind, id); } catch (e) { r = null; }
      if (r) { r.key = key; r.at = t; o.req = r; p10Log(o, "fragt: " + r.text, t, "good"); return; }
    }
  }
  function p10ReqStillOk(s, o) { if (!o.req) return; const r = p10ReqFor(s, o.req.kind, o.req.id); if (!r) { o.req = null; } }
  function p10Confirm() {
    const s = state; const o = p10O(s); const r = o.req; if (!r) return;
    if (busy) { showResult("Erst die laufende Aktion beenden.", true); renderAll(); return; }
    const now = p10ReqFor(s, r.kind, r.id);
    if (!now) { o.req = null; showResult("Das geht gerade nicht mehr (Material fehlt oder schon erledigt).", true); save({ quiet: true }); renderAll(); return; }
    o.req = null; p10Log(o, "Bestätigt: " + r.text.replace(/ – jetzt.*$/, ""), Date.now());
    const run = () => {
      if (r.kind === "house") extCmd("house|" + r.id);
      else if (r.kind === "lager") extCmd("lager");
      else if (r.kind === "build") buildBuilding(BUILDINGS.find((x) => x.id === r.id));
      else if (r.kind === "craft") doCraft(CRAFTS.find((x) => x.id === r.id));
      else if (r.kind === "quest") tryCompleteQuest(r.id);
      save({ quiet: true }); renderAll();
    };
    if (now.camp && state.locId !== "camp") { log("Optimus: Für den Bau geht es zuerst ins Ruinencamp.", "sys"); travelTo("camp", { after: run }); return; }
    run();
  }
  function p10Decline() {
    const o = p10O(); const r = o.req; if (!r) return;
    o.declined[r.key] = Date.now(); o.req = null;
    p10Log(o, "Abgelehnt: " + r.text.replace(/ – jetzt.*$/, "") + ". Er fragt frühestens in 10 Minuten wieder.", Date.now());
    save({ quiet: true }); renderAll();
  }

  // ---- Reparatur, Kauf, Flicken ----
  function p10Repair() {
    const s = state; const o = p10O(s); const n = (o.stage || 0) + 1; const st = P10_STAGES[n];
    if (!st) return "Optimus ist schon voll repariert.";
    if (!o.found) return "Du hast Optimus noch nicht gefunden. Er liegt im Schrottfeld (60/120).";
    const miss = Object.keys(st.need).filter((k) => (s.inv[k] || 0) < st.need[k]).map((k) => (st.need[k] - (s.inv[k] || 0)) + "× " + k);
    if (miss.length) return "Für Stufe " + n + " fehlt noch: " + miss.join(", ") + ".";
    Object.keys(st.need).forEach((k) => takeInv(s, k, st.need[k]));
    o.stage = n; o.setup = o.setup || false;
    if (n === 1) { o.x = 60; o.y = 120; o.clock = Date.now(); o.job = null; }
    p10Log(o, "Reparatur Stufe " + n + " fertig: " + st.l + " – er " + st.d + ".", Date.now(), "good");
    return "Optimus Stufe " + n + " repariert: " + st.l + ".";
  }
  function p10Buy() {
    const s = state; const o = p10O(s);
    if (o.stage >= 5) return o.owned === "test" ? "Optimus ist bereits im Besitz (Testmodus)." : "Optimus ist bereits voll repariert.";
    let n = 0; P10_PARTS.forEach((k) => { const c = s.inv[k] || 0; if (c) { n += c; takeInv(s, k, c); } });
    const bonus = n * 25; // DESIGN: 25 Optimus-EP je gesammeltem Teil
    o.oep += bonus; o.stage = 5; o.found = true; o.owned = "kauf"; o.clock = Date.now(); o.job = null;
    if (o.x === 50 && o.y === 100) { /* bleibt im Camp */ }
    p10Log(o, "Testkauf – kein echtes Geld: sofort voll repariert." + (n ? " " + n + " gesammelte Ersatzteile → +" + bonus + " Optimus-EP." : ""), Date.now(), "good");
    return "Testkauf – kein echtes Geld: Optimus ist voll repariert." + (n ? " Deine " + n + " Ersatzteile wurden zu " + bonus + " Optimus-EP." : "");
  }
  function p10Patch() {
    const s = state; const o = p10O(s); if (!o.damaged) return "Optimus ist nicht beschädigt.";
    const part = P10_PARTS.slice().sort((a, b) => (s.inv[b] || 0) - (s.inv[a] || 0)).find((k) => (s.inv[k] || 0) > 0);
    let used;
    if (part) { takeInv(s, part, 1); used = "1× " + part; }
    else if ((s.inv.Metall || 0) >= 10) { takeInv(s, "Metall", 10); used = "10 Metall (Notflicken, DESIGN)"; }
    else return "Zum Flicken brauchst du 1 Ersatzteil oder 10 Metall.";
    o.damaged = null; o.clock = Date.now(); o.job = null;
    p10Log(o, "geflickt mit " + used + ". Er arbeitet weiter.", Date.now(), "good");
    return "Optimus geflickt mit " + used + ".";
  }
  function p10Pickup() {
    const s = state; const o = p10O(s); const before = p10BagN(o);
    if (!before) return "Seine Tasche ist leer.";
    const moved = p10Unload(s, o); const left = p10BagN(o);
    return moved ? "Ladung abgeholt: " + moved + " Einheiten." + (left ? " " + left + " passen nicht mehr in Rucksack/Lager." : "") : "Rucksack und Lager sind voll – nichts abgeholt.";
  }

  // ---- Zeitschleife ----
  function p10Advance(s, o, now, sum) {
    let guard = 0, changed = false;
    if (!o.clock || o.clock > now) o.clock = now;
    while (guard++ < 5000) {
      if ((o.stage || 0) < 1 || o.damaged) { o.clock = now; break; }
      if (p10BagN(o)) p10Unload(s, o);
      if (!o.job) { const j = p10Choose(s, o, o.clock); if (!j) { o.clock = now; break; } o.job = j; changed = true; }
      const j = o.job; const end = j.t0 + j.tr + j.wk;
      if (end > now) { o.clock = now; break; }
      o.job = null; o.clock = end; p10Finish(s, o, j, end, sum); changed = true;
    }
    return changed;
  }
  function p10FmtDur(ms) { const m = Math.round(ms / 60000); const h = Math.floor(m / 60); return (h ? h + " Std. " : "") + (m % 60) + " Min."; }
  function p10CatchUp(s, now) {
    const o = p10O(s); if (!o || (o.stage || 0) < 1) { if (o) o.clock = now; return null; }
    const gap = now - (o.clock || now);
    if (gap < 120000) return null;
    let capped = false;
    if (gap > P10_OFFLINE_MAX) { const shift = gap - P10_OFFLINE_MAX; o.clock += shift; if (o.job) o.job.t0 += shift; capped = true; }
    const sum = { jobs: 0, items: {}, fled: 0, parts: 0, dmg: false, patched: 0 };
    const lvl0 = p10Lvl(o); const ep0 = o.oep;
    p10Catching = true;
    try { p10Advance(s, o, now, sum); } finally { p10Catching = false; }
    const items = Object.keys(sum.items).map((k) => "+" + sum.items[k] + " " + k);
    let m = "Während du weg warst (" + p10FmtDur(gap) + (capped ? ", gezählt höchstens 4 Std." : "") + "): Optimus hat " + sum.jobs + " Aufträge erledigt" + (items.length ? ": " + items.join(", ") : "") + ".";
    if (o.oep > ep0) m += " +" + (o.oep - ep0) + " Optimus-EP" + (p10Lvl(o) > lvl0 ? ", jetzt Stufe " + p10Lvl(o) : "") + ".";
    if (sum.parts) m += " " + sum.parts + " Ersatzteil(e) gefunden.";
    if (sum.fled) m += " " + sum.fled + "× vor Gegnern geflohen.";
    if (sum.patched) m += " " + sum.patched + "× beschädigt und selbst geflickt.";
    if (sum.dmg) m += " Er ist beschädigt und wartet auf ein Ersatzteil.";
    if (o.req) m += " Er hat eine Anfrage für dich.";
    o.away = { at: now, text: m, gap, capped, sum };
    p10Log(o, m, now);
    return m;
  }
  const p10AfterBase = p91AfterLoad;
  p91AfterLoad = function () {
    const s = state;
    let m = null;
    if (s && !s.dead) { p10O(s); m = p10CatchUp(s, Date.now()); }
    p10AfterBase();
    if (m) { log(m, "good"); resultLines.push({ text: m, bad: false }); resultPage = origPage; renderResultBanner(); save({ quiet: true }); renderAll(); }
  };
  const p10MigBase = migrateState;
  migrateState = function (s) { const r = p10MigBase(s) || s; p10O(r); return r; };

  let p10Sig = "";
  function p10SigOf(o) { const j = o.job; const ph = j ? (Date.now() < j.t0 + j.tr ? "t" : "w") : "-"; return [o.stage, j ? j.id + j.kind + ph : "", o.req ? o.req.key : "", o.damaged ? 1 : 0, (o.log || []).length, o.log && o.log.length ? o.log[o.log.length - 1].t : 0, OPTIMUS_BATTERY ? Math.floor(o.bat) : 0].join("|"); }
  function p10Focused() { const a = typeof document !== "undefined" && document.activeElement; return !!(a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName || "")); }
  function p10Refresh(full) {
    // Nur auf der Optimus-Seite wird das Blatt neu gezeichnet; sonst nur die rechte Spalte (Kasten + Ressourcen),
    // damit Links und Eingaben im Blatt nicht unter dem Finger verschwinden.
    if (full && origPage === "optimus" && !p10Focused()) { renderAll(); return; }
    if (full) { p10RightOnly = true; try { renderOriginal(); } finally { p10RightOnly = false; } }
    const el = document.getElementById("p10-box");
    if (el && el.outerHTML !== undefined && typeof el.insertAdjacentHTML === "function") { el.insertAdjacentHTML("afterend", p10BoxHtml()); el.remove(); }
    // Handy-Karte im Blatt: nur die Statuszeile ändern – keine Höhenänderung, damit nichts unter dem Finger verrutscht.
    // Eine neue Anfrage erscheint dort beim nächsten Neuzeichnen; das Abzeichen am Reiter kommt sofort (rechte Spalte).
    const mb = document.getElementById("p10-mob");
    const sp = mb && mb.querySelector && mb.querySelector(".p10-mline span");
    if (sp && state && state.optimus) { const st = p10Status(state.optimus, Date.now()); sp.innerHTML = "<b>Optimus</b> " + origEsc(st.st) + " · " + origEsc(st.job); }
  }
  function p10Tick() {
    const s = state; if (!s || s.dead || p10Pause()) return;
    const o = p10O(s); const now = Date.now();
    if (!o.found && s.locId === "schrott") {
      o.found = true; o.x = 60; o.y = 120;
      const m = "Im Schrottfeld liegt ein kaputter Roboter: Optimus! Mit Ersatzteilen kannst du ihn reparieren (Seite Optimus).";
      p10Log(o, m, now); log(m, "good"); showResult(m); save({ quiet: true }); renderAll(); return;
    }
    if ((o.stage || 0) < 1) { o.clock = now; return; }
    if (now - (o.clock || now) > 10 * 60000) { const m = p10CatchUp(s, now); if (m) { log(m, "good"); showResult(m); } save({ quiet: true }); renderAll(); return; } // Seite war eingefroren
    const before = p10SigOf(o); const lg = o.log.length;
    p10Advance(s, o, now, null);
    if (o.req) p10ReqStillOk(s, o);
    const sig = p10SigOf(o);
    if (sig !== p10Sig || sig !== before) {
      const delivered = o.log.length !== lg;
      if (delivered) save({ quiet: true });
      p10Sig = sig;
      p10Refresh(delivered || origPage === "optimus");
    }
  }
  setInterval(p10Tick, 1000);
  function p10JobPct(o, now) { const j = o.job; if (!j) return 0; const tot = j.tr + j.wk; return tot ? clamp(Math.round((now - j.t0) / tot * 100), 0, 100) : 100; }
  setInterval(() => {
    if (!state || !state.optimus || typeof document === "undefined" || !document.querySelectorAll) return;
    const pct = p10JobPct(state.optimus, Date.now());
    document.querySelectorAll(".p10-bar > i").forEach((i) => { if (i.style) i.style.width = pct + "%"; });
  }, 500);

  // ---- Anzeige ----
  function p10Status(o, now) {
    if (!o.found && (o.stage || 0) < 1) return { st: "nicht gefunden", job: "Liegt irgendwo im Schrottfeld (60/120)." };
    if ((o.stage || 0) < 1) return { st: "Wrack", job: "Wartet auf Reparatur (Stufe 1: 3× Servomotor)." };
    if (o.damaged) return { st: "beschädigt", job: "Beschädigt durch " + o.damaged.cause + " – flicken mit 1 Ersatzteil." };
    const j = o.job;
    if (!j) return { st: "wartet", job: "sucht den nächsten Auftrag" };
    const tgt = p10PlaceName(j.tx, j.ty);
    if (j.kind === "laden") return { st: now < j.t0 + j.tr ? "läuft" : "lädt", job: "Akku laden – " + tgt };
    if (j.kind === "ruhe") return { st: "wartet", job: j.why };
    const what = j.kind === "sammeln" ? "sammelt " + j.res : P10_JOB[j.kind].st;
    if (now < j.t0 + j.tr) return { st: "läuft", job: "zu " + tgt + " – " + what };
    const obj = { sammeln: j.res, wasser: "Wasser", nahrung: "Nahrung" }[j.kind];
    return { st: P10_JOB[j.kind].st.split(" ")[0], job: (obj ? obj + " – " : "") + tgt };
  }
  function p10Pos(o, now) { // aktuelle Position, auch unterwegs (erst waagrecht, dann senkrecht)
    const j = o.job; if (!j || !j.tr) return j && now >= j.t0 ? { x: j.tx, y: j.ty } : { x: o.x, y: o.y };
    if (now >= j.t0 + j.tr) return { x: j.tx, y: j.ty };
    let steps = Math.max(0, Math.floor((now - j.t0) / P10_STEP_MS)); const dx = j.tx - j.fx, dy = j.ty - j.fy;
    const sx = Math.min(steps, Math.abs(dx)); steps -= sx; const sy = Math.min(steps, Math.abs(dy));
    return { x: j.fx + Math.sign(dx) * sx, y: j.fy + Math.sign(dy) * sy };
  }
  function p10BatText(o) { return OPTIMUS_BATTERY ? "Akku: " + Math.round(o.bat) + " %" : "Akku: deaktiviert (Testmodus)"; }
  function p10ReqHtml(o, cls) {
    if (!o.req) return "";
    return '<div class="p10-req' + (cls ? " " + cls : "") + '"><span>' + origEsc(o.req.text) + '</span> <a href="#" class="p10-btn p10-ok" data-x="p10ok">Bestätigen</a> <a href="#" class="p10-btn p10-no" data-x="p10no">Ablehnen</a></div>';
  }
  function p10BoxHtml() {
    const s = state; if (!s) return "";
    const o = p10O(s); const now = Date.now(); const st = p10Status(o, now);
    let h = '<div class="mbox p10-box" id="p10-box" data-req="' + (o.req ? 1 : 0) + '"><h3>Optimus</h3>';
    h += '<div class="p10-head"><img src="' + P10_IMG + (o.stage >= 5 ? "optimus-klein.png" : "optimus-wrack.png") + '" alt="Optimus" width="40" height="40" />' +
      '<div><b class="p10-st p10-st-' + origEsc(st.st.replace(/\s.*/, "")) + '">' + origEsc(st.st) + "</b>" + (o.stage >= 1 ? " · Stufe " + p10Lvl(o) : "") +
      '<div class="p10-job">' + origEsc(st.job) + "</div></div></div>";
    if (o.stage >= 1) {
      h += '<div class="p10-bar"><i style="width:' + p10JobPct(o, now) + '%"></i></div>';
      h += '<div class="p10-small">' + origEsc(p10BatText(o)) + (o.stage >= 1 ? " · Position " + p10Pos(o, now).x + "/" + p10Pos(o, now).y : "") + "</div>";
    }
    if (o.damaged) h += '<div class="p10-req bad"><span>Optimus ist beschädigt.</span> <a href="#" class="p10-btn" data-x="p10patch">Flicken</a></div>';
    h += p10ReqHtml(o);
    if (p10BagN(o)) h += '<div class="p10-small">Tasche: ' + p10BagN(o) + ' Einheiten <a href="#" data-x="p10pick">Ladung abholen</a></div>';
    const lines = (o.log || []).slice(-4).reverse();
    if (lines.length) h += '<ul class="p10-log">' + lines.map((l) => "<li><span>" + p10Time(l.t) + "</span> " + origEsc(l.m) + "</li>").join("") + "</ul>";
    h += '<a class="p10-open" href="#" data-page="optimus">Optimus öffnen&nbsp;›</a></div>';
    return h;
  }
  function p10MobHtml() {
    const s = state; if (!s) return "";
    const o = p10O(s); if (!o.found && o.stage < 1) return "";
    const st = p10Status(o, Date.now());
    return '<div class="p10-mob m-only" id="p10-mob" data-req="' + (o.req ? 1 : 0) + '"><div class="p10-mline"><img src="' + P10_IMG + "optimus-klein.png" + '" alt="" width="28" height="28" /><span><b>Optimus</b> ' + origEsc(st.st) + " · " + origEsc(st.job) + '</span><a href="#" data-page="optimus" aria-label="Optimus öffnen">›</a></div>' +
      (o.stage >= 1 ? '<div class="p10-bar"><i style="width:' + p10JobPct(o, Date.now()) + '%"></i></div>' : "") + p10ReqHtml(o, "p10-mreq") +
      (o.damaged ? '<div class="p10-req bad"><span>Beschädigt.</span> <a href="#" class="p10-btn" data-x="p10patch">Flicken</a></div>' : "") + "</div>";
  }
  function p10Icon(img, alt, sz) { return '<img class="p10-ico" src="' + P10_IMG + img + '.png" alt="' + origEsc(alt || "") + '" width="' + (sz || 32) + '" height="' + (sz || 32) + '" />'; }
  function p10PageHtml() {
    const s = state; const o = p10O(s); const now = Date.now(); const st = p10Status(o, now); const lvl = p10Lvl(o); const ab = p10Abil(o);
    let h = '<div class="p10-page"><h2>Optimus – dein Begleitroboter</h2>';
    h += '<p class="p10-design">DESIGN: Optimus gibt es im Original-Endzeitspiel nicht (Anspielung auf Teslas Optimus). Er ist ein Begleiter wie ein Tier, hat aber einen eigenen Platz – deine Tiere bleiben.</p>';
    if (OPTIMUS_TEST_GRANT) h += '<p class="p10-test">Testmodus: Jeder Charakter bekommt Optimus sofort voll repariert, ohne Kauf.</p>';
    if (o.away && now - o.away.at < 30 * 60000) h += '<div class="p10-away"><b>Während du weg warst</b><p>' + origEsc(o.away.text.replace(/^Während du weg warst /, "")) + '</p><a href="#" data-x="p10away">ok</a></div>';
    h += '<div class="p10-top"><img class="p10-big" src="' + P10_IMG + (o.stage >= 5 ? "optimus.png" : "optimus-wrack.png") + '" alt="Optimus" width="220" height="220" /><div class="p10-stats">';
    h += '<p class="p10-stline"><b>Status:</b> <span class="p10-st">' + origEsc(st.st) + "</span></p><p>" + origEsc(st.job) + "</p>";
    if (o.stage >= 1) h += '<div class="p10-bar big"><i style="width:' + p10JobPct(o, now) + '%"></i></div>';
    if (o.stage >= 1) h += "<p><b>Stufe " + lvl + "</b> · Optimus-EP " + o.oep + (P10_LVL[lvl] != null ? " / " + P10_LVL[lvl] + " bis Stufe " + (lvl + 1) : " (höchste Stufe)") + "</p>";
    h += "<p>Position: " + (o.stage >= 1 || o.found ? p10PlaceName(p10Pos(o, now).x, p10Pos(o, now).y) : "unbekannt") + " · Du bist bei " + origEsc(p10PlaceName(p7Pos(s).x, p7Pos(s).y)) + "</p>";
    h += "<p>" + origEsc(p10BatText(o)) + (OPTIMUS_BATTERY ? " · Laden: 1 %/Min. unterwegs, 3 %/Min. bei Haus oder Stammlager, 10 %/Min. mit Reaktor" : "") + "</p>";
    h += "<p>Erledigt: " + (o.stats.jobs || 0) + " Aufträge · " + (o.stats.fled || 0) + "× geflohen · " + (o.stats.parts || 0) + " Ersatzteile gefunden</p>";
    if (o.damaged) h += '<p class="p10-bad">Beschädigt (' + origEsc(o.damaged.cause) + '). ' + origLink("Flicken (1 Ersatzteil oder 10 Metall)", 'data-x="p10patch"') + "</p>";
    if (p10BagN(o)) h += "<p>In seiner Tasche: " + origEsc(Object.keys(o.bag).map((k) => o.bag[k] + " " + k).join(", ")) + " " + origLink("Ladung abholen", 'data-x="p10pick"') + "</p>";
    h += "</div></div>";
    // Anfrage
    h += "<h3>Anfragen</h3>" + (o.req ? p10ReqHtml(o, "big") : '<p class="p10-small">' + (ab.mitdenken ? "Keine offene Anfrage. Sobald alles Material für die aktuelle Aufgabe oder dein gewähltes Gebäude da ist, fragt er dich. Ohne deine Bestätigung baut er nichts." : "Anfragen gibt es ab Reparatur-Stufe 5 (Mitdenken).") + "</p>");
    // Fähigkeiten + Reparatur
    h += '<h3>Reparatur und Fähigkeiten</h3><table class="p10-tab"><tr><th>Stufe</th><th>Fähigkeit</th><th>Teile (hast / brauchst)</th><th></th></tr>';
    for (let n = 1; n <= 5; n++) {
      const sg = P10_STAGES[n]; const done = o.stage >= n;
      const parts = Object.keys(sg.need).map((k) => '<span class="p10-part">' + p10Icon(P10_PART_INFO[k].img, k, 20) + origEsc(k) + " " + (done ? sg.need[k] + "/" + sg.need[k] : Math.min(s.inv[k] || 0, 999) + "/" + sg.need[k]) + "</span>").join(" ");
      let act = done ? '<span class="p10-done">✔ erledigt</span>' : (n === o.stage + 1 ? origLink("Stufe " + n + " reparieren", 'data-x="p10rep"') : '<span class="p10-small">erst Stufe ' + (n - 1) + "</span>");
      h += '<tr class="' + (done ? "done" : "") + '"><td>' + n + "</td><td><b>" + origEsc(sg.l) + "</b><br><span class=\"p10-small\">" + origEsc(sg.d) + "</span></td><td>" + parts + "</td><td>" + act + "</td></tr>";
    }
    h += "</table>";
    if (!o.found && o.stage < 1) h += "<p>Optimus liegt als Wrack im Schrottfeld. " + origLink("hin: Schrottfeld (60/120)", 'data-loc="schrott"') + "</p>";
    h += '<p class="p10-small">Ersatzteile findest du selten beim Graben, Erkunden, bei der Nahrungssuche, in Höhlen und im Schrottfeld. Optimus findet beim Graben und Erkunden selbst welche (mit Metalldetektor doppelt so oft).</p>';
    // Kauf
    h += '<div class="p10-buy"><div><b>Sofort voll reparieren</b><br><span class="p10-small">Ein Klick, alle 5 Stufen fertig. Schon gesammelte Ersatzteile werden zu Optimus-EP (25 je Teil).</span></div>';
    h += o.stage >= 5 ? '<span class="p10-owned">bereits im Besitz' + (o.owned === "test" ? " (Testmodus)" : "") + "</span>" : '<a href="#" class="p10-btn p10-buybtn" data-x="p10buy">Für 20 € kaufen</a>';
    h += '<span class="p10-testkauf">Testkauf – kein echtes Geld</span></div>';
    // Prioritäten
    h += "<h3>Priorität</h3><p class=\"p10-prios\">" + P10_PRIOS.map(([id, l]) => (o.prio === id ? '<b class="p10-on">' + l + "</b>" : origLink(l, 'data-x="p10prio|' + id + '"'))).join(" · ") + "</p>";
    h += '<p class="p10-small">' + ({ auto: "Automatisch: zuerst Nahrung und Wasser, wenn dein Vorrat bei 30 oder weniger ist. Dann was die aktuelle Aufgabe und dein gewähltes Gebäude brauchen, dann knappe Rohstoffe.", vorrat: "Vorräte sichern: Nahrung und Wasser bis " + P10_VORRAT + ", danach wie Automatisch.", aufgabe: "Aktuelle Aufgabe: zuerst alles für die offenen Aufgaben.", gebaeude: "Gebäude: zuerst alles für das gewählte Gebäude.", knapp: "Knappe Rohstoffe: füllt, was am wenigsten da ist (Ziel " + P10_SCARCE + " je Rohstoff)." })[o.prio] + "</p>";
    const td = p10TargetDef(o.target);
    h += "<p><b>Gewähltes Gebäude:</b> " + (td ? origEsc(td.name) + (p10TargetDone(s, td) ? " (steht schon)" : " – fehlt: " + origEsc(p10MissText(s, td.cost))) + " " + origLink("keins", 'data-x="p10tgt|"') : "keins") + "</p>";
    const opts = [];
    HOUSES.forEach((x) => { if (!(s.house && s.house.type === x.id)) opts.push(["house:" + x.id, x.name + (x.tl > (s.techlevel || 0) ? " (TL " + x.tl + ")" : "")]); });
    if (hasHouse(s) && !s.house.lagerBuilt) opts.push(["lager", "Privatlager"]);
    BUILDINGS.forEach((b) => { if (!(s.buildings && s.buildings[b.id])) opts.push(["build:" + b.id, b.name]); });
    h += '<p class="p10-tgts">Wählen: ' + opts.map(([id, l]) => (o.target === id ? "<b>" + origEsc(l) + "</b>" : origLink(l, 'data-x="p10tgt|' + id + '"'))).join(" · ") + "</p>";
    // Module
    h += '<h3>Module und Ausrüstung</h3><p class="p10-small">Plätze: ' + (lvl >= 5 ? 2 : 1) + " (ab Stufe 5: 2). Er wählt selbst das beste Modul für den Auftrag.</p><table class=\"p10-tab\">";
    P10_MODS.forEach((m) => {
      const un = lvl >= m.lvl; const eq = p10Has(o, m.id);
      h += '<tr class="' + (eq ? "eq" : un ? "" : "locked") + '"><td>' + p10Icon(m.img, m.n, 32) + "</td><td><b>" + origEsc(m.n) + "</b><br><span class=\"p10-small\">" + origEsc(m.e) + "</span></td><td>" + (eq ? '<span class="p10-done">angelegt</span>' : un ? "frei" : "gesperrt · ab Stufe " + m.lvl) + "</td></tr>";
    });
    h += "</table>" + (o.why ? '<p class="p10-why"><b>Warum:</b> ' + origEsc(o.why) + "</p>" : "");
    // Log
    h += '<h3>Logbuch</h3><table class="p10-tab p10-logtab">' + (o.log || []).slice().reverse().map((l) => "<tr><td>" + p10Time(l.t) + "</td><td>" + origEsc(l.m) + "</td></tr>").join("") + "</table></div>";
    return h;
  }
  function p10MissText(s, cost) { const m = Object.keys(cost).filter((k) => (k === "gold" ? s.gold : p10Have(s, k)) < cost[k]).map((k) => (cost[k] - (k === "gold" ? s.gold : p10Have(s, k))) + " " + (k === "gold" ? "Gold" : k)); return m.length ? m.join(", ") : "nichts – alles da"; }
  function p10PartsHtml(full) {
    const s = state;
    let h = '<div class="p10-parts"><h3>Optimus-Ersatzteile (DESIGN)</h3><table class="p10-tab">';
    P10_PARTS.forEach((k) => { h += "<tr><td>" + p10Icon(P10_PART_INFO[k].img, k, 28) + "</td><td><b>" + origEsc(k) + "</b> × " + (s.inv[k] || 0) + "<br><span class=\"p10-small\">" + origEsc(P10_PART_INFO[k].d) + "</span></td></tr>"; });
    h += "</table><p class=\"p10-small\">" + (full ? "Kann man nicht herstellen. " : "") + "Fundorte: selten beim Graben, Erkunden, bei der Nahrungssuche, in Höhlen und im Schrottfeld. Wofür: Reparatur und Flicken auf der " + origLink("Optimus-Seite", 'data-page="optimus"') + ".</p></div>";
    return h;
  }
  function p10HintHtml() {
    const o = p10O(); const done = !!o.setup;
    return '<div class="p10-hint' + (done ? " done" : "") + '"><b>Nebenbei (freiwillig):</b> ' + (done ? "✔ " : "") + 'Optimus einrichten – wähle auf der ' + origLink("Optimus-Seite", 'data-page="optimus"') + " eine Priorität oder ein Gebäude. Zählt nicht für die Kapitel.</div>";
  }
  // Menü: „Optimus“ unter Aktionen
  (function () { const g = ORIG_MENUS.left.find((x) => x[0] === "Aktionen"); if (g && !g[1].some((x) => x[0] === "optimus")) { const i = g[1].findIndex((x) => x[0] === "nahrungssuche"); g[1].splice(i + 1, 0, ["optimus", "Optimus"]); } })();
  P7_PAGE_NAMES.optimus = "Optimus";
  const p10PageBase = renderOrigPage;
  renderOrigPage = function () {
    let h;
    if (origPage === "optimus" && state) h = p10PageHtml();
    else {
      h = p10PageBase();
      if (state && origPage === "rucksack") h += p10PartsHtml(false);
      else if (state && origPage === "herstellen") h += p10PartsHtml(true);
      else if (state && origPage === "aufgaben") h = h.replace("</h2>", "</h2>" + p10HintHtml());
    }
    return (state && origPage !== "optimus" ? p10MobHtml() : "") + h;
  };
  const p10ExtBase = extCmd;
  extCmd = function (cmd) {
    const bits = String(cmd).split("|"); const c = bits[0];
    if (/^p10/.test(c) && state && !state.dead) {
      const o = p10O(); let msg = null, bad = false;
      if (c === "p10ok") { p10Confirm(); return; }
      if (c === "p10no") { p10Decline(); return; }
      if (c === "p10prio") { if (P10_PRIOS.some((x) => x[0] === bits[1])) { o.prio = bits[1]; o.setup = true; if (o.job && o.job.kind !== "laden") { o.job = null; o.clock = Date.now(); } msg = "Optimus-Priorität: " + P10_PRIOS.find((x) => x[0] === bits[1])[1] + "."; p10Log(o, "neue Priorität: " + P10_PRIOS.find((x) => x[0] === bits[1])[1] + ".", Date.now()); } }
      else if (c === "p10tgt") { const td = p10TargetDef(bits[1]); o.target = td ? bits[1] : null; o.setup = true; if (td && o.prio === "auto") o.prio = "gebaeude"; msg = td ? "Optimus plant jetzt für: " + td.name + "." : "Kein Gebäude gewählt."; p10Log(o, msg, Date.now()); if (o.job && o.job.kind !== "laden") { o.job = null; o.clock = Date.now(); } }
      else if (c === "p10rep") { msg = p10Repair(); bad = !/repariert/.test(msg); }
      else if (c === "p10buy") { msg = p10Buy(); }
      else if (c === "p10patch") { msg = p10Patch(); bad = !/geflickt/.test(msg); }
      else if (c === "p10pick") { msg = p10Pickup(); }
      else if (c === "p10away") { o.away = null; }
      if (msg) { log(msg, bad ? "bad" : "good"); showResult(msg, bad); }
      save({ quiet: true }); renderAll(); return;
    }
    return p10ExtBase(cmd);
  };

  document.addEventListener("keydown", (e) => {
    if (!state || state.dead || busy) return;
    if (!document.body.classList.contains("ingame")) return;
    const tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    const dir = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
    if (!dir) return;
    e.preventDefault();
    if (typeof state.px !== "number") return;
    clickField(state.px + dir[0], state.py + dir[1]);
  });

  enterGame();
})();

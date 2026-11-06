// Shared loader for the marketing site's Clan Leaders / Monsters galleries.
// Reads from this site's own curated data snapshot (see data/README.md for
// provenance) so the marketing site has no runtime dependency on the game
// server or its APIs.
export async function loadCatalog() {
  const [catalog, provenance, lore] = await Promise.all([
    fetch("/data/catalog.json").then((r) => r.json()),
    fetch("/data/art-provenance.json").then((r) => r.json()),
    fetch("/data/lore.json").then((r) => r.json()),
  ]);
  const artByGroup = {};
  for (const asset of provenance.assets) {
    (artByGroup[asset.group] ??= {})[asset.name] = "/" + asset.file;
  }
  return { catalog, artByGroup, lore };
}

// Grid tiles show only the character portrait and name; only health, armor
// and magic are real stats, and neither they nor the printed full card are
// shown until the drawer opens, so nothing is repeated between the two.
export function renderHeroes(heroes, art, lore = {}) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  for (const hero of heroes) {
    const portrait = art.heroes?.[hero.name];
    const fullCard = art.heroCards?.[hero.name];
    const bio = lore.heroes?.[hero.name]?.bio;
    const card = document.createElement("article");
    card.className = "entity-card hero-card";
    card.dataset.race = hero.race;
    card.innerHTML = `
      ${portrait ? `<img src="${portrait}" alt="${hero.name}" loading="lazy">` : ""}
      <div class="meta"><h3>${hero.name}</h3></div>`;
    card.addEventListener("click", () => toggleDrawer(card, {
      title: hero.name,
      subtitle: `${hero.race} · ${hero.spellName}`,
      body: bio ? `${bio}\n\n${hero.spellDescription}` : hero.spellDescription,
      img: fullCard || portrait,
      wide: !!fullCard,
    }));
    grid.appendChild(card);
  }
}

const TIER_LABEL = { 1: "Tier I — Lesser Threat", 2: "Tier II — Greater Threat", 3: "Tier III — Ancient Terror", 4: "Tier IV — Apex" };

export function renderMonsters(monsters, art, lore = {}) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  const sorted = [...monsters].sort((a, b) => a.stars - b.stars || b.health - a.health);
  for (const m of sorted) {
    const img = art.monsters?.[m.name];
    const bio = lore.monsters?.[m.name];
    const card = document.createElement("article");
    card.className = "entity-card";
    card.dataset.tier = m.stars;
    card.innerHTML = `
      ${img ? `<img src="${img}" alt="${m.name} art" loading="lazy">` : `<div class="loading" style="aspect-ratio:2/3;display:grid;place-items:center">Art pending</div>`}
      <div class="meta">
        <p class="tag">${TIER_LABEL[m.stars] || `Tier ${m.stars}`}</p>
        <h3>${m.name}</h3>
      </div>`;
    card.addEventListener("click", () => toggleDrawer(card, {
      title: m.name,
      subtitle: TIER_LABEL[m.stars] || `Tier ${m.stars}`,
      body: bio ? `${bio}\n\n${m.specialDescription}` : m.specialDescription,
      img,
      wide: false,
    }));
    grid.appendChild(card);
  }
}

// A drop-down drawer inline in the grid, instead of a modal popup: click a
// card to open its full detail directly below it (spanning the full grid
// width); click the open card again, or Close, to collapse it. The drawer
// shows a different image than the grid tile (full printed card for heroes,
// a larger view of the same art for monsters, which have no separate card
// scan) so nothing reads as a repeat of what's already visible.
let openCard = null;
function toggleDrawer(card, { title, subtitle, body, img, wide }) {
  const existing = document.querySelector(".card-drawer");
  const reopening = openCard === card;
  existing?.remove();
  card.classList.remove("open");
  openCard = null;
  if (reopening) return;
  card.classList.add("open");
  openCard = card;
  const drawer = document.createElement("section");
  drawer.className = "card-drawer";
  drawer.innerHTML = `
    <button class="card-drawer-close" aria-label="Close">✕</button>
    <div class="card-drawer-body">
      ${img ? `<img src="${img}" alt="${title}" class="${wide ? "wide" : ""}">` : ""}
      <div class="card-drawer-text">
        <p class="eyebrow">${subtitle}</p>
        <h3>${title}</h3>
        <p class="card-drawer-copy">${body ?? ""}</p>
      </div>
    </div>`;
  drawer.querySelector(".card-drawer-close").addEventListener("click", (e) => {
    e.stopPropagation();
    drawer.remove();
    card.classList.remove("open");
    openCard = null;
  });
  card.insertAdjacentElement("afterend", drawer);
  drawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

export function wireFilters(selector = "[data-filter]") {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach((btn) => btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const value = btn.dataset.filter;
    document.querySelectorAll("#grid .entity-card").forEach((card) => {
      const key = card.dataset.race ?? card.dataset.tier;
      card.style.display = value === "all" || key === value ? "" : "none";
    });
    document.querySelector(".card-drawer")?.remove();
    openCard = null;
  }));
}

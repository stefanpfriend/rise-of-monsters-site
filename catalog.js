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

export function renderHeroes(heroes, art, lore = {}) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  for (const hero of heroes) {
    const img = art.heroCards?.[hero.name] || art.heroes?.[hero.name];
    const bio = lore.heroes?.[hero.name]?.bio;
    const card = document.createElement("article");
    card.className = "entity-card";
    card.dataset.race = hero.race;
    card.innerHTML = `
      ${img ? `<img src="${img}" alt="${hero.name} card art" loading="lazy">` : ""}
      <div class="meta">
        <p class="tag">${hero.race}</p>
        <h3>${hero.name}</h3>
        <div class="stats">
          <span>❤ ${hero.health}</span>
          <span>⚔ ${hero.attack}</span>
          <span>✨ ${hero.specialDamage}</span>
          <span>🛡 ${hero.armor}</span>
          <span>🔮 ${hero.magic}</span>
        </div>
      </div>`;
    card.addEventListener("click", () => openDetail({
      title: hero.name,
      subtitle: `${hero.race} · ${hero.spellName}`,
      body: bio ? `${bio}\n\n${hero.spellDescription}` : hero.spellDescription,
      stats: `Health ${hero.health} · Attack ${hero.attack} · Special ${hero.specialDamage} · Armor ${hero.armor} · Magic ${hero.magic}`,
      img,
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
      ${img ? `<img src="${img}" alt="${m.name} art" loading="lazy">` : `<div class="loading" style="aspect-ratio:3/4;display:grid;place-items:center">Art pending</div>`}
      <div class="meta">
        <p class="tag">${TIER_LABEL[m.stars] || `Tier ${m.stars}`}</p>
        <h3>${m.name}</h3>
        <div class="stats">
          <span>❤ ${m.health}</span>
          <span>⚔ ${m.basicDamage}</span>
          <span>✨ ${m.specialDamage}</span>
        </div>
      </div>`;
    card.addEventListener("click", () => openDetail({
      title: m.name,
      subtitle: TIER_LABEL[m.stars] || `Tier ${m.stars}`,
      body: bio ? `${bio}\n\n${m.specialDescription}` : m.specialDescription,
      stats: `Health ${m.health} · Basic attack ${m.basicDamage} · Special ${m.specialDamage}`,
      img,
    }));
    grid.appendChild(card);
  }
}

function openDetail({ title, subtitle, body, stats, img }) {
  const dialog = document.getElementById("detail");
  dialog.querySelector(".detail-img").outerHTML = img
    ? `<img class="detail-img" src="${img}" alt="${title}">`
    : `<div class="detail-img"></div>`;
  dialog.querySelector(".detail-title").textContent = title;
  dialog.querySelector(".detail-subtitle").textContent = subtitle;
  dialog.querySelector(".detail-stats").textContent = stats;
  dialog.querySelector(".detail-body-text").textContent = body;
  dialog.showModal();
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
  }));
}

document.getElementById("close-detail")?.addEventListener("click", () => {
  document.getElementById("detail").close();
});

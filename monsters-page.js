import { loadCatalog, renderMonsters, wireFilters } from "./catalog.js";
loadCatalog().then(({ catalog, artByGroup, lore }) => {
  renderMonsters(catalog.monsters, artByGroup, lore);
  wireFilters();
}).catch((err) => {
  document.getElementById("grid").innerHTML =
    `<p class="empty">Couldn't load the bestiary (${err.message}). Run this through the game server, not a plain file preview.</p>`;
});

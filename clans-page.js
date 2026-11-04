import { loadCatalog, renderHeroes, wireFilters } from "./catalog.js";
loadCatalog().then(({ catalog, artByGroup, lore }) => {
  renderHeroes(catalog.heroes, artByGroup, lore);
  wireFilters();
}).catch((err) => {
  document.getElementById("grid").innerHTML =
    `<p class="empty">Couldn't load the roster (${err.message}). Run this through the game server, not a plain file preview.</p>`;
});

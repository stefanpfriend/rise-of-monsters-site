# Marketing data snapshot

This directory is a curated, point-in-time snapshot taken from the game's
internal catalog and art-provenance manifests for use by the public
marketing site only. It intentionally excludes resources/environment art,
game mechanics internals, saved rooms, and any API/session data.

- `catalog.json` — hero and monster display stats only (name, race, health,
  attack, spell text, etc.), copied from the game's `game/data/catalog.json`.
- `art-provenance.json` — provenance for the 40 hero/monster images used on
  the Clan Leaders and Monsters pages, plus 2 AI-generated environment
  backgrounds (landscape rift, neutral crossroads) used on the home page,
  re-encoded from PNG to JPEG (quality 82-85) for web file size. Original
  PNG provenance (sha256, Drive slide IDs or imagegen prompt) lives in the
  game repo's own manifest; this file tracks the converted JPEG's own
  hash/size plus a pointer back to that original record.
- `lore.json` — one-line hero/monster bios, plus `world.stages`: the
  home-page scroll narrative, condensed from Stefan's own Story doc
  (`Rise-of-Monsters-Story.md`, shared via Hill 2026-11-03, Ando attachment
  eca670a3-a5d6-406c-9e6e-75a5b8d690e8). Not invented.

This snapshot does not update automatically when the game's data changes.
Refresh it deliberately when hero/monster stats or art change and the
marketing site should reflect that.

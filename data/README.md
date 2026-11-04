# Marketing data snapshot

This directory is a curated, point-in-time snapshot taken from the game's
internal catalog and art-provenance manifests for use by the public
marketing site only. It intentionally excludes resources/environment art,
game mechanics internals, saved rooms, and any API/session data.

- `catalog.json` — hero and monster display stats only (name, race, health,
  attack, spell text, etc.), copied from the game's `game/data/catalog.json`.
- `art-provenance.json` — provenance for the 40 hero/monster images used on
  the Clan Leaders and Monsters pages, re-encoded from PNG to JPEG (quality
  85) for web file size. Original PNG provenance (sha256, Drive slide IDs)
  lives in the game repo's own manifest; this file tracks the converted
  JPEG's own hash/size plus a pointer back to that original record.
- `lore.json` — one-line bios, written separately from game mechanics data.

This snapshot does not update automatically when the game's data changes.
Refresh it deliberately when hero/monster stats or art change and the
marketing site should reflect that.

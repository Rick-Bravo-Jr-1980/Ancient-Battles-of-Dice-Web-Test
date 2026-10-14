# Ancient Battles of Dice — 2D Proof of Concept

A playable browser proof of concept for a historical battle game, using 2D portrait artwork to explore battle rules, army presentation, deployment, and player interaction.

[Play the proof of concept](https://Rick-Bravo-Jr-1980.github.io/Ancient-Battles-of-Dice-Web-Test/)

## Development direction

- **2D portrait game — proof of concept:** the playable web release in this repository, used to test the core experience and gather feedback.
- **Isometric game — prototype:** ongoing local development exploring the strategic map, battlefield transitions, camera, terrain, and unit presentation. This work informs the eventual 3D game.
- **Full 3D game — long-term goal:** a historical battle game with fully 3D models, building on lessons from the proof of concept and isometric prototype.

The isometric prototype is not included in this web release. Features and presentation remain in development.

## Playing

Click inside the game to enable browser audio. Background music yields to narration and command sounds; fighting effects play during combat. Audio levels are available in the game's Audio menu.

This release includes the deployment-drag performance fix and packaged-resource loading for music and effects. Use a current desktop browser. The initial download is substantial; allow the loading screen to finish. Threaded audio uses Godot's service worker for cross-origin isolation on GitHub Pages.

## Release status and publishing

This is the October 13, 2026 weekly browser release. Publication is confirmed by the successful Pages workflow for the release commit. It includes the latest approved sprite integration, regular cavalry and first-pass light-horse action cycles, Lechaeum setup, campaign gates and Ps outcome changes.

The repository contains the exported browser game, not the development workspace. The game pack is split into files below GitHub's individual-file limit. The Pages workflow reassembles it, verifies its SHA-256 checksum, and publishes the complete site. In repository Settings → Pages, the source is GitHub Actions.

When replacing the web export, retain the **2D Proof of Concept** title in the browser page and web app manifest.

Godot runtime: 4.7.2 stable. Game artwork and audio remain subject to their respective rights; publication does not grant a separate reuse license.

## Player update

[Read the October 13 player update](web/player-update-2026-10-13.md). After deployment, the [readable web update](https://Rick-Bravo-Jr-1980.github.io/Ancient-Battles-of-Dice-Web-Test/player-update.html) accompanies the game.


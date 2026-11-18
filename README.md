# Ancient Battles of Dice — 2D Proof of Concept

[November 18 player update](web/player-update-2026-11-18-player-scope.md) — player-accessible Act I/II content and a smaller download.

Current web scope: tutorials, Act I and Act II battles, and their eight skirmish armies. Later army artwork remains in local development.

[November 10 weekly player update](web/player-update-2026-11-10-weekly.md) — approved tutorials, Game Information, Lechaeum and I/48 cavalry animations.

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

The November 10, 2026 scheduled release includes the approved five-lesson tutorial, recorded Miltiades guidance, searchable Game Information, restored Lechaeum access, and approved integrated I/48 cavalry animations. Other animation previews and 3D experiments are excluded. The Pages workflow for the release commit determines deployment status.

The resource pack is 951,913,556 bytes. Final assembled site size is recorded in the dated update and checked below the 1,000,000,000-byte limit. Diagnostics remain local. Automated desktop functional checks passed, but combat frame rates and long-tail stalls remain performance limitations; mobile play has not been validated. See the [November 10 validation report](docs/performance/2026-11-10-release.txt) and [measurements](docs/performance/2026-11-10-measurements.json). Browser changes make historical timing comparisons inconclusive.

The repository contains the exported browser game, not the development workspace. The game pack is split into files below GitHub's individual-file limit. The Pages workflow reassembles it, verifies its SHA-256 checksum, and publishes the complete site. In repository Settings → Pages, the source is GitHub Actions.

When replacing the web export, retain the **2D Proof of Concept** title in the browser page and web app manifest.

Godot runtime: 4.7.2 stable. Game artwork and audio remain subject to their respective rights; publication does not grant a separate reuse license.

## Player update

[Read the November 10 player update](web/player-update-2026-11-10-weekly.md). After deployment, the [readable web update](https://Rick-Bravo-Jr-1980.github.io/Ancient-Battles-of-Dice-Web-Test/player-update.html) accompanies the game. The [October 13 update](web/player-update-2026-10-13.md) is retained for history.

## Local diagnostics baseline — October 15

[Read the development baseline and acceptance report](docs/performance/2026-10-15-baseline.txt), with [structured results](docs/performance/2026-10-15-baseline.json) and [retained measurements](docs/performance/2026-10-15-measurements.json).

The October 13 release lacked phase instrumentation. October 15 is the first measured instrumented development baseline, not a claim about historical frame rates. Its functional checks passed and performance acceptance was conditional. Keep that baseline distinct from the October 21 results above; changed browser versions and the updated victory fixture limit direct timing comparisons. Reports stay on the player's device unless the player chooses to export and share them.



## October 27 update (published October 28)

[Lesson 3 changes, play instructions and validation limitations](web/player-update.html).

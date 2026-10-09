# Ancient Battles of Dice — Portrait Web Test

Browser release of the historical battle game.

[Play the game](https://Rick-Bravo-Jr-1980.github.io/Ancient-Battles-of-Dice-Web-Test/)

Click inside the game to enable browser audio. Background music yields to narration and command sounds; fighting effects play during combat. Audio levels are available in the game's Audio menu.

This release includes the deployment-drag performance fix and packaged-resource loading for music and effects. Use a current desktop browser. The initial download is substantial; allow the loading screen to finish. Threaded audio uses Godot's service worker for cross-origin isolation on GitHub Pages.

## Publishing

The repository contains the exported browser game, not the development workspace. The game pack is split into files below GitHub's individual-file limit. The Pages workflow reassembles it, verifies its SHA-256 checksum, and publishes the complete site. In repository Settings → Pages, the source is GitHub Actions.

Godot runtime: 4.7.2 stable. Game artwork and audio remain subject to their respective rights; publication does not grant a separate reuse license.

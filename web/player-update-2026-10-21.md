# Ancient Battles of Dice — October 21, 2026

## Approved-content browser build

This build packages the content used by the current player routes. It preserves approved portraits, animation sheets, terrain and narration while leaving superseded artwork, review alternatives and unused experiments out of the browser download. Local development files remain available for future work.

The game resource package is 958.4 MB, down from 1,171.4 MB in the unfiltered local build: a reduction of 212.9 MB (18.2%), without lowering the resolution of retained artwork. The complete website is approximately 998 MB. It is larger than the October 13 release because it includes the subsequent approved additions. The first download remains substantial.

## Lessons 1 and 2

Spear Line and Horse and Spear now use Miltiades' narrated movement demonstrations, with no command-PIP rolls for either side. Both default to Easy/Bronze. Plan your available friendly movements, then select Commit orders. The Argives advance after movement and narration finish. Horse and Spear teaches coordinating the spear front with a cavalry flank and lets both eligible friendly units declare charges before melee resolution.

The lessons include revised recorded narration, clearer combat prompts, camera framing, objective visibility and rectangular wax-seal buttons. Read the combat-factor cards and use Continue when ready. Lessons 3 and 4 have not been tested or updated in this revision.

## Battles, rules and figures

Lechaeum is available as a normal Historical Campaign battle with its recorded Xenophon briefing. Global charge reach is measured between the nearest base edges: 24 mm for solid foot, 28 mm for fast foot and Psiloi, and 40 mm for mounted troops. The preview uses a rounded rectangular boundary. Cavalry, light horse and knights retain their distinct flee, recoil and destruction outcomes.

Approved I/52 Athenian and Argive animations improve marching, grounded ready poses, facing, charges, attacks and recoils. Integrated II/7 and II/12 figure animations are included. The separate isometric game and Meshy/Blender models are not part of this browser release.

## Playing and troubleshooting

[Open the 2D Proof of Concept](https://Rick-Bravo-Jr-1980.github.io/Ancient-Battles-of-Dice-Web-Test/). Use a current desktop browser and allow the initial download to finish. Click inside the game to enable audio, choose your chronicle, and enter the campaign or tutorial. Existing access controls remain in place.

Diagnostics stay on your device. Main Menu > Settings > Local Diagnostic Report lets you export a report if you choose to share it for troubleshooting. Reports are not transmitted automatically. The October 13 release is the original reference build; October 15 supplied the first instrumented measurements because October 13 lacked phase instrumentation.

## Validation and performance

Twenty scripted lesson scenarios passed, along with animation, combat-rule, campaign and save checks. Twelve browser battle runs across Chrome, Edge and Firefox completed successfully. The normal game also passed both browser startup paths, and the split package passed checksum verification.

Performance remains provisional: dense formations are demanding on the tested Intel UHD 630, and repeated diagnostics-on/off tests leave movement/camera timing concerns unresolved. Reports remain local, but diagnostics are not yet claimed as fully performance-validated. The next corrective work is to profile reporting overhead and repeat longer matched tests. [Read the measurements, limitations and corrective actions](https://github.com/Rick-Bravo-Jr-1980/Ancient-Battles-of-Dice-Web-Test/blob/main/docs/performance/2026-10-21-release.txt).

## Feedback requested

Please report repeated or mistimed narration, camera framing problems, missed cavalry flank objectives, and unexpected flee/recoil/destruction results. Include the lesson or battle, troop types, terrain and combat totals. A locally exported diagnostic report can help, but sharing one is optional.

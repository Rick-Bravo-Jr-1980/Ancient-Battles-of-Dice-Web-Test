# October 31, 2026 — Lesson 3 approved update

This update packages the approved Lesson 3 revision for the 2D Proof of Concept, including the textured wax seal used by lesson controls.

## Changes since the October 28 release

Lesson 3 introduces the new light troops together, explains their movement and terrain use, and retains the light-horse and bow-specific guidance. Spears and cavalry already covered in earlier lessons do not repeat their unit introductions. Shooting prompts explain eligibility, range, arc, factors against mounted and foot, and the one-base-width movement restriction. Shooting units show the movement boundary while planning a move.

The compact papyrus keeps progression controls accessible. Objectives appear with Miltiades' narration. Movement cancellation, narration triggers, engagement objectives and lesson completion have additional regression coverage. Textured wax seal controls are included.

## Play instructions and feedback

Open the game and enter Lesson 3 through your tutorial progression. Click inside the game to enable audio. Move your units, use Cancel previous movement when replanning, and Commit Orders when ready. Select the bows when Miltiades identifies a shot. Please report repeated or missing narration, obscured targets, unavailable controls, and any failure to finish after defeating the Argives. Include the turn phase and unit involved.

## Scope and limitations

Existing profiles, progression, access controls and the 2D Proof of Concept title are retained. Personal saves are not included. The warrior, horse and isometric experiments are excluded; this is the portrait game only. Lesson 4 is not newly validated. Automated checks supplement player testing; they do not establish complete browser gameplay coverage.

Diagnostics remain local, with reports downloaded only at the player's request. No artwork downscaling or animation-frame removal was applied in this release.


## Validation and download size

Gameplay, saves, campaign unlocks, live assets, movement cancellation and shooting-preview checks passed. The 20-case movement and narration audits passed, along with 20 full lesson cases and 20 shooting-focused cases. Full cases cover victory and terminal defeat; a defeat is not counted as a completed lesson. An obsolete test expecting an ordinary spear move to earn the light-troop terrain objective was corrected and rerun successfully. The full audit exceeded its initial time limit; remaining cases passed with a longer allowance.

Chrome startup passed both with isolation headers and through the Pages-style service-worker fallback, with no captured runtime errors. Chrome and Edge diagnostics checks passed, including local report download and no automatic transmission. Firefox WebDriver timed out before a usable session, so Firefox remains unverified. New interleaved FPS, frame-time percentile and total-memory comparisons are unavailable; no performance improvement is claimed. Local startup measured 554,460 ms with headers and 294,842 ms through fallback under a memory-constrained, concurrent test workload; these timings are not a controlled comparison.

The game pack is 958,461,656 bytes, up 4,688 bytes from the previous release. The assembled site is about 997.8 MB, below the 1,000,000,000-byte hosting budget. Split-pack SHA-256 verification passed. No visual-quality reduction was needed.

One shooting scenario reached the automated player progress limit while repeatedly attempting a blocked route. Adding legal detours to the test driver completed the same scenario successfully, without a gameplay change.

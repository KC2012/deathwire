# Current state / v0.30 EVENT HORIZON

The offline playable artifact is `dist/DEATHWIRE.html`. Source is `source/game.js`, `source/circuit.js`, `source/shell.html`; `npm run build` generates the identical root/source/export HTML and checksum. v1 campaign saves remain compatible.

The campaign now assembles a finite authored sequence once per event. Its four new families are Megacity (vertical climbs and pitch-critical rooftop landings), Hammerfall (descent, large presses and a collapsing bridge with a lower escape ramp), Prism (hop-selected upper shortcut and lower glass route), and Singularity (large controlled loop, launch and a brake-sensitive catcher). Finale combines them, adds visible service pads shared by every rider, and gives Saint Prime an aggressive recurring-rival role. Endless retains its established generation style and forgiving landing rules.

Navigation checks compare held throttle+boost against a geometry-aware normal-input rider on isolated courses. Held inputs crash in Megacity and Singularity; controlled inputs clear all four. The Prism route test reaches two different physical surfaces depending on hop input, with over 300 units of vertical separation. New wheel contacts accept surfaces by swept height; the camera follows the actual rider vertically.

Combat uses a visible .14s windup, .68s cooldown and a single forward target. Bruisers guard, faster riders evade, and brake+forward guards the player. Riders have wider starting separation and persistent throttle rhythms. Damage occurs on new impacts, not repeated resting-contact frames. Press damage is once per rider per stroke, under identical collision rules. Glass shatters; explosive barrels still explode.

The recorded stock campaign cleared all 12 events in 14 attempts. In 18 sampled races, 54 of 72 AI starters finished and every sample had finishers. Five scripted-player DNFs occurred; AI beat the player in 17 samples when DNFs are included. These are challenge/survival statistics, not a human balance claim.

Validation and current field/campaign outcomes are recorded in `tests/*results.json` and `tests/racing-summary.json`, with details in TESTING.md. The full campaign is tested using bounded ordinary-input retries; failures remain in its attempt log. This is not a first-pass-perfect or human-playtested claim. Live browser mega-course captures are in `docs/screenshots/v030-live-*.png`.

The basic model remains arcade contact sampling with guided loops, not a full rigid-body motorcycle. Real mobile devices, other browser engines, subjective fun testing and exhaustive new-course/garage combinations remain unverified. See KNOWN_ISSUES.md. Publication of the cloud environment snapshot is separate from the GitHub playable distribution.

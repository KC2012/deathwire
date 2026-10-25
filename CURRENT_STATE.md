# Current state / v0.10 BLACK CIRCUIT

A playable offline campaign build is available at `dist/DEATHWIRE.html`; the checkout root and `source/index.html` contain identical generated copies. Development source and tests are included. No remote push, game deployment or publication occurred.

## Verified

- Browser keyboard throttle, hop, boost, pause and immediate same-seed retry run with real animation frames.
- Grounded leaning raises the front contact while the rear remains supported; releasing lean settles the bike.
- Loop engagement and forward upright release, jump/fuel behavior, melee direction, rival hazard damage, moving platform contact from above and rejection from below.
- Finite courses retain geometry behind the rider, choose supported finish positions and provide usable checkpoint recovery locations.
- Twelve campaign events clear sequentially with an automated rider using normal throttle, lean, hop and strike decisions. Stock bike, no god mode, health overrides, teleports or forced finishes in that traversal. Campaign completion persists through reload.
- First-clear/improved-medal rewards, garage purchase/equip, validated save input, preference persistence and storage failure fallback.
- 100 seeds audited through at least 22,000 course units each for deterministic geometry, bounded slopes, launch envelopes and gap lengths.
- Responsive landscape control bounds at 844 × 390; standalone export makes no external resource requests.

## Limits

Automated traversal is evidence of reachability, not a substitute for human fun/balance testing. Ghost Protocol was cleared with little integrity remaining. Guided loops and contact samples are arcade approximations. Finite race opponents can crash or be eliminated; the player is generally faster under sustained throttle. Real mobile hardware, Firefox/Safari, prolonged Endless soak testing and every garage build/seed combination remain unverified. See `KNOWN_ISSUES.md`.

## Environment

Node 24, Python 3.12 and system Chromium were available. `npm ci` and `npm run build` succeeded. The optional Python server is running on port 8000 in this instance; processes must restart in future tasks. Reusable install/start instructions were saved in an environment configuration draft. That draft does not itself execute scripts or publish a reusable snapshot; review/save and publication remain user actions in environment settings. Fresh-task restoration has not been tested.

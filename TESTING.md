# v0.30 verification

Run a static server on port 8000, then `npm test`, `npm run test:campaign`, `npm run test:racing`, `npm run test:navigation`, `npm run test:combat`, `npm run test:routes`, `npm run test:live`, `npm run test:export`, `npm run test:encounters`, and `node tests/objectives.cjs`.

- `v30-results.json`: held throttle+boost crashes in Megacity and Singularity; geometry-aware normal input clears all four new families. Stock bike, no god mode, health overrides, warps or recovery in traversal. Staged screenshots reposition only after a run and are not traversal evidence.
- `fork30-results.json`: an actual hop reaches the upper Prism surface; no-hop takes the lower tunnel. More than 300 units of vertical separation; both choices remain playable.
- `combat30-results.json`: immediate windup does not deal damage; the actual AI guards/evades; a second target is not hit; full braking stops; first physical impact still damages.
- `campaign-results.json`: all twelve events with ordinary-input policy retries, no upgrades, invincibility, health overrides, warps or forced completion. The final campaign record contains 14 attempts for 12 clears. `attempts` records failed runs and successful policies, including a delayed-start option. A first-pass-perfect claim would be false. Finale service pads are normal visible world objects usable by all riders.
- `racing-results.json`: 18 runs across six race courses and three seeds, real positions and finish times, eliminations, player DNF status and field rollout. `beatPlayer` counts finishers beating a DNF as well as faster valid finishers. The final recorded sample has 54/72 AI finishers, finishers in 18/18 runs, and 13/18 player completions. Summary is in `racing-summary.json`; these are scripted, not human, statistics.
- `live30-results.json`: real requestAnimationFrame runs using normal control state from a test controller. Four mega-course completions with live screenshots, not manual human playtests.
- Existing 17 browser checks, 100 extended seed construction audits, v1-save/objective tests and standalone smoke checks remain required. The old loop fixture was extended for the larger physical circumference; melee fixtures now wait for the windup, and the spike fixture constructs a spike encounter explicitly. Trial abyss fixtures use a height below the new terrain range.
- `encounter-results.json` remains 32 build/speed combinations for the retained v0.20 families; it does not cover every new course/build combination.

Iteration found genuine failures: narrow terrain bounds, upper floors catching bikes below them, inaccessible hopped rising surfaces, bridge recovery softlocks, relay targets placed on the lower escape route, explosive glass, repeated contact/stroke damage, an opening placed before its flat apron, and held inputs still bypassing early versions. These were corrected and the affected tests rerun. A stopping/catcher control policy and retry logs preserve failed outcomes rather than counting zero-input or zero-test runs as evidence.

Screenshots were inspected for the new vertical layouts and large loop readability. Real-device performance, other browser engines and human fun/balance evaluation remain unrun. The historical sections below describe previous releases, not current measured totals.

---

# v0.20 validation

Run the existing commands below plus `npm run test:racing`, `npm run test:encounters`, and `node tests/objectives.cjs` with the static server on port 8000.

Current evidence replaces the v0.10 result JSON files; the text below remains historical context. `tests/racing-results.json` contains 18 races, individual AI finish times, player times, real ranks and elimination reasons. `tests/racing-summary.json` summarizes outcomes. The racing threshold is regular competition (>=80% of sampled races with finishers and every course represented), not a guarantee that every rider survives. Two fields were eliminated. AI sometimes places ahead of the geometry-aware attacking player. Test-only field rollout measures actual later finishes through the shared simulation.

`tests/encounter-results.json`: four signature assemblies × four builds × cruise/throttle = 32 positive-integrity completions, zero crash/recovery, with valid geometry audits. No invincibility or health overrides. Isolated encounter setup selects the gear and constructs a clean test course; traversals use the game update and normal input policy. Showcase screenshots use deliberate developer repositioning and are not presented as traversal proof.

`tests/objectives.cjs`: validates existing v1 progress, equipment, credits and medals, and confirms missing all demolition relays fails without a medal. The full campaign traversal confirms the successful demolition path. The other 17 browser checks, 100 extended seeds, and real-frame standalone input smoke check also pass.

`node tests/live-encounters.cjs` additionally passed four real animation-frame, throttle-only signature traversals with zero browser exceptions. Its screenshots capture live riding rather than developer-warped positions.

New screenshots: `docs/screenshots/v020-*.png`. Chromium renders were inspected for rail/launch readability. This is not human playtesting. Hardware/mobile performance and other browser engines remain unrun.

The initial AI statistics failed. Logs exposed repeated resting-contact pileup damage and premature AI ramp jumps; both were corrected. An encounter assertion initially expected three unused recovery credits, but isolated courses intentionally start with zero; the final assertion requires zero credits and zero crashes. No assertion or collision was disabled to count a failing traversal as passing.

---

# Validation / v0.10

Run from the checkout root, with the development server running on port 8000:

```sh
npm ci
npm run build
npm start
# In another terminal:
npm test
npm run test:campaign
npm run test:export
```

The tests use Playwright with system Chromium at `/usr/bin/chromium`; override its path using `CHROMIUM`. The playable HTML needs neither Playwright nor Node. The browser policy in this environment blocks `file:` navigation by automation, so the standalone artifact was exercised through a local static server. Build inspection confirms it has no external scripts/styles/resources. Direct file-opening on the user's browser is still a separate host/browser policy check.

## Recorded evidence

- `tests/results.json`: 17 browser regression checks. Includes real DOM keyboard mapping and pause/resume; wheelie contact and release; jumping/fuel; 100 deterministic seeds extended to at least 22,000 units; safe finish and two checkpoint locations in each trial event; reward idempotence and reload; malformed saves; directional melee; guided loop entry/exit; fatal crash/recovery; moving surface contact/rejection; rival spike damage/rank; checkpoint advancement/retained road; garage/preferences UI; denied storage; mobile control bounds; browser exception collection.
- `tests/campaign-results.json`: 12 of 12 events completed sequentially by a scripted normal-input rider on the stock bike. No invincibility, health overrides, warps, forced finishes or garage parts in this test. The rider reads upcoming geometry, applies throttle/lean/hop/strike and runs the actual fixed-step simulation. All events retained positive integrity; campaign completion was verified after reload. Observed times were approximately 11–31 seconds per event, about four minutes of optimal riding in total.
- `tests/export-results.json`: generated `dist/DEATHWIRE.html` runs under actual browser animation frames. Keyboard throttle/hop/boost, pause and R retry verified; zero uncaught browser exceptions and no external requests. Root/export bytes checked identical.
- `docs/screenshots/`: title, campaign selection and gameplay captured from the generated distribution. Touch layout capture is generated at `/tmp/deathwire-mobile.png` during regression execution.

## Scope of the checks

Geometry audits enforce positive segment widths, maximum slope, bounded gaps, a preceding launch ramp, and a conservative ballistic launch envelope at 250 units/second. They reproduce the track after a seed reset. They do not prove survival at every braking speed or hazard phase. The campaign traversal is a stronger functional check for its selected stock-bike policy, but its geometry-aware automated rider is not a human playtest.

Individual regression checks deliberately use test hooks to isolate collisions, placement, saves and state transitions. Those isolated forced-state tests are distinct from the unmodified-health campaign traversal. Test hooks are exposed on `window.__deathwire.test`; ordinary play does not invoke them.

During development, tests caught and resolved an invalid jump-distance assertion, a loop fixture that tried to open a locked event, insufficient settling time in a moving-platform fixture, an exact-zero retry assertion that raced the resumed animation frame, and the reactor turbine's physically unreachable hop envelope. Early scripted Ghost Grid runs failed; earlier jump timing plus the corrected obstacle geometry allows the final stock-bike traversal. Remaining difficulty limits are described in `KNOWN_ISSUES.md`.

Cross-engine testing, hardware frame-time measurements, real-device touch/audio testing, exhaustive garage combinations, and prolonged Endless stress are **unrun**, not passed. No disabled or expected-failure checks are counted as passes. The distribution smoke test tests runtime operation; saving a cloud configuration draft does not validate restoration into a fresh cloud task.

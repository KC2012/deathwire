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

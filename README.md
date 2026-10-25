# DEATHWIRE v0.30 / EVENT HORIZON

A standalone, offline, side-view cyberpunk motorcycle combat racer. Twelve short campaign events across four industrial districts, plus seeded Endless, Death Race, Gauntlet and an optional practice run. Developed from v0.10 BLACK CIRCUIT. v0.20 adds freight cannons, foundry demolition, magnetic data rails, orbital launch assemblies, and competitive surviving rivals. Existing v1 saves are preserved.

**Play:** open `dist/DEATHWIRE.html` in a modern desktop browser. It contains everything: no downloads, accounts, backend, keys or assets to fetch. Landscape touch controls appear on touch devices. Browser policies can limit persistent storage for local files; use the local server for reliable save testing.

**Develop:** Node 24 and Python 3 are available in the prepared environment.

```sh
npm ci
npm run build
npm start
```

Open the served `index.html` in your local browser. `npm start` serves the checkout on port 8000. The cloud onboarding UI does not provide a loopback preview; the standalone export is the delivery artifact.

Edit `source/game.js` (simulation/rendering), `source/circuit.js` (campaign, garage, saves, preferences) and `source/shell.html` (menus/styles). `npm run build` validates JavaScript and generates identical `index.html`, `source/index.html`, and `dist/DEATHWIRE.html`, plus `dist/SHA256SUMS`. No bundler or runtime libraries are needed.

| Input | Action |
| --- | --- |
| Up / W | Throttle |
| Down / S | Brake |
| Left / A | Lean back / wheelie |
| Right / D | Lean forward |
| Z | Hop |
| X | Boost; cyan HUD bar shows fuel |
| Space | Strike forward |
| P / Escape | Pause |
| R | Immediately retry the same course |
| Ctrl + Shift + D | Engineering tools |

The bike cruises when throttle is released. Read the road, keep momentum, and land along its slope. Cyan strips add launch speed; circular rails guide a complete loop. A first event clear awards scrap and opens the next event, regardless of placement. Gold asks for a fast run and first place in races. Garage parts trade integrity against speed, boost recovery or striking strength. All events are traversable on the stock bike.

With the server running, run `npm test`, `npm run test:campaign`, and `npm run test:export`. Tests need Chromium (`/usr/bin/chromium`, or set `CHROMIUM`). See [TESTING.md](TESTING.md) for evidence and limitations, [CURRENT_STATE.md](CURRENT_STATE.md) for the current milestone, and [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for remaining work.

No deployment or remote push has been performed. Progress lives in this browser's local storage; there is no account sync. Clearing browser data removes progress.

Additional v0.20 checks: `npm run test:racing`, `npm run test:encounters`, and `node tests/objectives.cjs`. A foundry demolition event requires destroying all three cyan relays before crossing the finish. Space strikes forward; direct collisions also destroy relays.

## EVENT HORIZON riding changes

Campaign courses now use fixed sequences of large vertical assemblies. Lean to match sloped landings; badly aligned technical landings crash rather than merely cost health. Brake can bring the bike to a stop and overrides boost. In the reactor catcher, reduce speed to land beneath the bulkhead. On the Prism route, hop onto the elevated violet road to take the shortcut, or stay low and breach the glass. Z can release a guided loop; throttle, brake and boost affect loop speed.

Space has a visible windup and strikes one rider. Bruisers can guard; speedsters can evade. Brake + lean forward guards against rival strikes. Glass shatters without barrel explosion damage. Cyan crosses in the finale restore 35 integrity and some fuel once per rider; opponents use the same pads.

Additional checks: `npm run test:navigation`, `npm run test:combat`, `npm run test:routes`, `npm run test:live`. Existing save progress is retained, including historical times from earlier course versions.

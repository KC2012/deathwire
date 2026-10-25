# Current state / v0.20 FULL THROTTLE

Playable artifact: `dist/DEATHWIRE.html`. Source remains in `source/`; controls and the basic motorcycle integration remain intact. The campaign is still twelve brisk events across four districts. v1 credits, medals, equipment and options remain compatible without a schema change.

Four new signature assemblies:

- **Overdrive:** staged conveyor runway, three velocity strips, launch ramp, 300-unit gap and broad recovery deck.
- **Iron Cathedral:** linked working presses, conveyor, four collapsing bridge spans and a lower rescue deck shared by all riders.
- **Ghost Transmission:** an elevated sinusoidal magnetic rail with throttle/brake/boost control, visual data architecture and a launch exit. It is explicitly guided arcade motion; the lower road provides a fallback.
- **Orbital:** linked tower loops, a charged runway and a long skyline launch. The final campaign event combines multiple signature families.

Every signature passed isolated normal-input traversal at cruise/full throttle on all four builds (32 combinations), without recovery credits or health overrides. The entire campaign also passed stock-bike normal-input traversal, including three required demolition relays in event 6. Existing 17 browser checks and 100 extended seeded audits pass. Standalone export runs with real browser keyboard controls and no external requests. All four signatures also passed real animation-frame throttle-only traversals, with live screenshots recorded.

Racing changed materially: better hazard anticipation, normal boost management, common impact rules, and visible chassis durability comparable to player garage builds. Sustained low-speed contact no longer deals repeated pileup damage. In 18 recorded races (six courses, three seeds each), AI finishers appeared in 16 races; 33 of 72 AI starters finished; AI beat the scripted player in 12 races. The complete table and actual race gaps are in `tests/racing-results.json`. Field simulation continues after the player finish through a test-only rollout so later finishers are measured, not inferred.

Remaining limits: this is still an arcade game with guided loops/rails; there are no true rigid-body machines or alternate-route planning. Two recorded late fields were eliminated. The demolition climax is demanding (10 integrity remaining in the recorded stock run). Human fun/balance testing, real mobile hardware and other browser engines remain unverified. New screenshots were visually inspected; traversal uses a geometry-aware scripted rider, not a human playtest.

# DEATHWIRE — CODEX FULL GAME DEVELOPMENT MANDATE

## Your assignment
You are the autonomous lead developer, game designer, technical designer, QA engineer, and implementation owner for **DEATHWIRE**. Take the supplied playable single-file HTML prototype and develop it into a cohesive, complete, replayable **single-player side-scrolling cyberpunk rocketbike combat racing game**. This is an **implementation assignment, not a request for a proposal**. Make sensible decisions independently, implement them, test them, fix them, and keep going. Aim for a strong playable game, not a long checklist of disconnected features.

The attached `source/index.html` is the latest known prototype (v0.04 ROCKET RIDE). Inspect and play it before making architectural choices. It is a reference implementation, **not sacred code**: refactor or replace weak internals while preserving and improving what is fun. Do not claim an untested feature works.

## Creative north star
Imagine Moto X3M's absurd notebook-doodle deathtrap courses, Trials-like expressive bike control, Road Rash / Road Redemption's rival motorcycle combat, and a far-future neon-industrial cyberpunk rocketbike aesthetic. The fantasy is **unreasonable speed + physical control + dangerous rival riders + spectacular, fair, navigable contraptions**. Think loops around towers, booster strips that fire bikes across chasms, suspended rails, giant saws, crushing presses, rotating machinery, collapsing bridges, chain-reaction explosions, and opponents tumbling into the carnage. It should feel thrilling within 30 seconds and reward skill over repeated play.

Three equally important pillars:
1. **Ride:** immediately satisfying throttle, braking, momentum, grounded wheelies, pitch control, jumps, flips, clean landings, boost and recovery. Arcade physics with readable, coherent consequences, not a realism simulator.
2. **Fight:** independently simulated rivals racing and battling in the same hazardous world; melee, ramming, knockdowns, later a small set of differentiated weapons; environmental eliminations; credible competition and finish rankings.
3. **Survive the track:** outrageous mechanical obstacle architecture, destructible scenery, loops, boosts, moving platforms, layered routes, escalating set pieces, and procedurally recombined but navigable challenges.

## Nonnegotiable design constraints
- **Side-view, 2D, single-player, browser playable.** No online multiplayer or server requirement.
- **Controls:** Up/W accelerate; Down/S brake; Left/A lean back (including on the ground / wheelies); Right/D lean forward (including on the ground); Z jump/hop; X boost; Space attack; P pause; Ctrl+Shift+D developer/testing panel. Support usable landscape touch controls. Keep inputs few and intuitive.
- **No floating instructional hazard text** during normal play. Teach through visual affordances, safe introduction, environmental cues, and optional tutorial/practice tracks. Telegraph moving machinery visually; no arbitrary surprise deaths.
- Preserve the successful **lightweight minimalist 1-bit / monochrome silhouette** foundation. Evolve it toward fast, smooth neon cyberpunk with controlled cyan/magenta accents, bright sparks, dynamic motion, spectacular explosions, parallax, debris and crisp readability. Do not sacrifice clarity to visual noise.
- High speed is central. Most obstacles should be solved in motion. Occasional precision sections are fine, but avoid constant stop-and-wait timing puzzles.
- Procedural generation must use **replayable seeds**, bounded difficulty, safe transitions, validated jumps, hazard timing, and sensible enemy placement. Never mistake unbounded randomness for interesting level design.
- Offline-first/no paid services/no external API dependency. Prefer an easily distributed standalone HTML export. Modular source code and a local build step are allowed if documented.
- Do not add monetization, accounts, microtransactions, compulsory tutorials, or feature bloat.
- Make independent routine design choices. Ask only when a major creative direction, substantial external dependency, money, or destructive operation truly requires approval.

## Current prototype: audit before trusting
The supplied game includes Endless, Death Race, Gauntlet, generated segments, seeded tracks, several hazards, AI riders, loops, boosters, rudimentary grounded lean, touch UI and a developer panel. Some implementations are experimental or brittle. In particular, inspect whether the v0.04 grounded wheelie changes actually work consistently, whether boosted jump trajectories are reachable, whether loops lock/unlock safely, whether duplicate/legacy functions exist, and whether procedural modules remain traversable at varying speeds. Do not assume a feature is complete merely because a function or UI label exists. Keep an explicit issue list, test cases, and regression coverage.

## Development workstreams — integrate rather than isolate

### A. Core physics and feel
Implement a robust fixed-timestep arcade motorcycle model with independent front/rear ground contact or a comparably coherent approximation; reliable transitions across slopes, gaps, platforms, overhangs, ramps, moving surfaces and upside-down rail/loop structures. Grounded leaning should enable actual useful wheelies and nose control, not just decorative rotation. Tune torque, traction, suspension compression/rebound, airtime pitch, landing angle/velocity, crash thresholds and recovery. Maintain speed and player agency; use selective assist only when it improves control. Make jumps, boost strips and loops mutually compatible. Build a crash spectacle (bike and rider debris/tumble) with fast restart. Ensure keyboard and touch controls are responsive and releases cannot stick.

### B. Track construction and physics-driven spectacle
Develop a reusable **track grammar**: straights, ramps, jumps, double jumps, halfpipes, loops, banked transitions, elevated decks, moving/rotating platforms, conveyors, boosters, launch rails, crushers, saws, spikes, pendulums, lasers, explosives, fragile bridges, breakable barriers, falling machinery and chain reactions. Include massive set-piece assemblies, not just isolated traps. Consider alternate routes only when camera/geometry and AI support them clearly. Rocket pads should enable impossible-looking but fair speed-dependent jumps and loops. Hazard danger zones must align with what is drawn; animations telegraph timing; there should be identifiable successful approaches. Enemies and environment should interact under consistent rules.

### C. Procedural generation and authored campaign courses
Use hand-designed **encounter modules with randomized parameters**, tagged entrances/exits, speed requirements, landing envelopes, hazard states, and difficulty costs. Assemble modules with pacing (warmup -> build -> challenge -> release -> climax), not continuous maximum chaos. Create a safe-route or bounded-input traversal validator and run seeded stress tests; where full automated play is difficult, use conservative construction rules plus automated geometry assertions and recorded manual passes. Store failing seeds. Make deterministic track generation independent from cosmetic randomness. Build both finite authored/curated campaign missions and endless generated runs using common components. A lightweight internal track test/editor is highly desirable if it accelerates content production.

### D. Rivals, combat and racing
Implement differentiated AI riders (speedster, brawler, bruiser, survivor, hunter, reckless/maniac) with believable throttle/brake/jump/lean decisions, anticipation of upcoming hazards, risk preferences, recovery, readable attack windups and genuine overtaking. They must obey hazards and collisions rather than cheating through them. Make melee directional, timed, visible and physically consequential; ramming and hazard knockoffs should be more important than generic health depletion. Add a compact, balanced weapon set only after core collisions feel good. Implement true race rankings, finishes, placements, elimination and clear victory/failure states. Tune AI so competition feels alive without rubber-band cheating or constant unavoidable attacks.

### E. Complete single-player campaign and progression
Build a **finished, modestly scoped first campaign** rather than an enormous unfinished world. Creative freedom on narrative details: a dystopian far-future death-racing circuit through distinct industrial districts, rival crews, dangerous infrastructure and increasingly absurd courses. Suggested structure: 4–6 themed regions, 3–5 meaningful events per region, escalating final showdowns, a handful of memorable named rivals, unlockable bike parts and event types. You may adjust counts based on what can actually be finished and tested. Missions should vary among sprint races, combat death races, checkpoint gauntlets, pursuits, survival and set-piece trials. Provide a coherent map/event selection flow, meaningful event rewards, an upgrade garage, persistent progress, clear objectives, retry and campaign completion. Upgrades should create interesting tradeoffs (engine, boost, handling, durability, melee/weapons) without destroying baseline handling or making early missions grindy. No dead-end progression, no paywalls, no required farming. Ensure save format validation, versioning and graceful storage failure handling. Keep Endless/Quick Race accessible separately.

### F. Presentation, onboarding and accessibility
Design mobile-first responsive menus and readable HUD. Keep the game view unobstructed; avoid lengthy tutorial overlays. Introduce mechanics through optional short training tracks that demonstrate throttle/lean/wheelie, jump/land, boosters/loops, hazards, and combat. Use visual telegraphs, road geometry, sound and animation to teach. Provide pause, restart, retry same seed, sound toggle, reduced screen shake/flashes, and performance options if needed. Use simple synthesized/offline audio or bundled assets with appropriate rights. Add speed trails, sparks, explosions, impact frames, parallax and expressive rider/bike silhouettes while maintaining contrast.

### G. Engineering, QA, and developer tools
Refactor the prototype into understandable components as necessary. Preserve an easy local run path and a standalone playable distribution artifact. Add automated tests for deterministic generation, save/load/migrations, mode transitions, finish conditions, checkpoints, death/restart, loop entrance/exit, boost/launch, moving platform contact, AI collision, controls and hazard hitboxes. Run many seeded simulations and log exceptions, stuck states, impossible gaps and failures. Include developer controls for god mode, slow motion, seed input, teleport to module, spawn rider, visualize contacts/hitboxes, regenerate track, unlock campaign and reset save (with confirmation). Track performance on desktop and mobile; cap particles and inactive entities. Document known limitations honestly.

## Suggested execution sequence (you may improve it)
1. **Baseline:** inspect/play source; inventory systems and defects; set up repo, docs, tests and stable playable baseline.
2. **Ridecraft:** fix grounded lean, contact physics, camera, jumping, boosting, loops and crash/retry. Verify actual feel in browser.
3. **Deathworks:** establish modular track grammar, more spectacular hazards/set pieces, generation constraints, validation, and reliable enemy-safe sections.
4. **Road War:** improve AI, attacks, collision outcomes, race ranking and mode goals.
5. **Campaign:** build event structure, region themes, garage/upgrades, rival progression, save/load and campaign completion.
6. **Polish:** onboarding, UX, art/effects/audio, mobile, accessibility, balancing, stress testing and regression.

Do not disappear into a huge architectural rewrite with no playable result. Maintain a runnable build at every milestone. Prioritize **quality of the core loop over feature count**. If execution time is limited, finish and polish a smaller vertical slice rather than ship an impressive but broken feature list.

## Acceptance criteria
- Launches locally without accounts, API keys, server calls or paid assets; playable keyboard and landscape touch.
- Motorcycle controls match the agreed layout, grounded wheelies are meaningful, jumps/landings are predictable, loops and rocket pads work, and quick retry is reliable.
- Tracks offer genuinely varied, spectacular, legible and reasonably navigable obstacles; multiple procedural seeds pass systematic validation and human-style test runs.
- AI riders race, attack, crash and finish consistently; outcomes are understandable and not fake.
- A complete campaign can be started, progressed through, saved, resumed and finished; garage/upgrades and event rewards function; standalone modes remain playable.
- No serious game-blocking JS errors, broken UI states, impossible default missions, softlocks, lost progress or excessive mobile clipping.
- The final distribution contains an actual playable build plus source, test results, changelog, known issues and instructions. Never present untested assumptions as verified facts.

## Autonomy and reporting protocol
Work independently within these boundaries. Make decisions and record them in `DECISIONS.md`, not as repeated clarification requests. Maintain `PROJECT.md` (vision/architecture), `ROADMAP.md` (milestones), `CURRENT_STATE.md` (what actually works), `TESTING.md` (test commands/results and known gaps), and `CHANGELOG.md`. At meaningful milestones, summarize what is implemented, what was verified in browser, what remains broken, and what you will tackle next. Keep commits/milestones reversible. Do not deploy, publish, spend money or push to external services without explicit approval.

## First action
**Open and run `source/index.html`. Audit it. Create the project files and tests. Then begin implementation immediately.** Do not stop after creating a plan. Continue across workstreams, exercising judgment, until you have the strongest complete playable DEATHWIRE build feasible.

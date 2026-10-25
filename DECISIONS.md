# Design and technical decisions

1. Retain the prototype's canvas renderer and fast auto-cruise identity. Remove shadowed duplicate functions rather than rewrite the entire game without a playable checkpoint.
2. Use fixed 1/120-second world steps with a bounded frame accumulator. Render separately; reset the accumulator for each run. Two wheel contact samples provide a coherent arcade approximation, with real single-wheel support during grounded lean.
3. Keep loops as explicit guided rails. They have per-rider engagement bookkeeping and release forward/upright after a full turn. This is an intentional arcade assist.
4. Deliver four regions with three short events each. Mix checkpoint gauntlets with genuine crew races; do not add unfinished pursuits, weapon inventories or a huge open world.
5. Completing an event opens the next, even outside first place. Medals reward mastery, not mandatory grinding. Reward only first clears and improved medals; repeating a result cannot mint scrap indefinitely.
6. Offer interchangeable complete builds, not five independent multiplicative upgrade trees. Stock is sufficient; parts have bounded strengths and weaknesses.
7. Generate whole finite courses and retain them. This fixes checkpoints returning to geometry that had already been deleted. Only Endless uses rolling pruning and rival spawning.
8. Give every finite race its starting grid once. Remove distance-based rubber banding. Placement uses actual surviving/finished riders; the result denominator remains the starting field.
9. Keep ordinary obstacle instructions out of the game view. Use the track, glowing pads, machinery movement and optional manual/practice to teach. Short impact notifications remain.
10. Correct the turbine envelope: its old height/radius could not be hopped from the road. Lower, smaller cutting wheels can be cleared using the standard hop; reactor assemblies preserve scale through multiple connected elements.
11. Separate editable code and HTML shell, with a tiny offline export script. Play requires no installed packages; Playwright is development-only.
12. Use browser-local saves with validation, bounded numbers, an explicit schema version and graceful failures. No network profile or account system.
13. Defer elaborate weapons, alternate-route AI, ragdoll constraints and a visual course editor. Preserve the tested coherent campaign instead of presenting unfinished labels as features.

## v0.20 decisions

14. Preserve basic handling; focus on connected encounter design and racing rather than a new physics rewrite.
15. Add four signature families with wide entries/exits. Long launches declare a 420-unit/s approach envelope and receive velocity strips before takeoff. Keep a fallback road under magnetic rails and under collapsing bridge spans.
16. Fix contact damage at its cause: separating riders at similar speeds should not drain health. Resolve penetration by actual front/rear order; damage requires a significant relative impact. The same player/rival impact thresholds apply.
17. Give rivals explicit garage-comparable durability and non-positional speed targets. Sprinter/raider boost consumes/recharges fuel; nobody receives speed based on distance to the player. Remove premature ramp hopping so the common launch code fires.
18. Retain elimination as a legitimate outcome. Racing regression requires AI finishers in at least 80% of 18 sampled races and on every representative course across three seeds, plus actual wins against the scripted player. It does not demand invincible survivors in every run.
19. Add one tested event format: demolition escape. Missing a cyan relay fails the event. Do not add untested chase/weapon features just to increase format count.
20. Retain save schema v1 and preserve existing progress and best times. Existing best times refer to their historical courses; new medals remain attainable.

## v0.30 decisions

21. Replace the campaign's narrow 280–437 elevation band with bounded -950–800 construction and authored, nonrepeating encounter sequences per event. Endless keeps its established module selection. Decorative size alone did not change play; technical landings and an actual catcher aperture now demand control.
22. Use swept-height filtering for wheel surfaces so an upper road cannot capture a bike riding beneath it. Surface-relative vertical velocity permits a hopped bike to catch a rising shortcut. Layered bridges render as thin slabs so lower roads remain visible.
23. Keep guided loops explicitly assisted, scale angular travel by radius, allow speed controls and a Z release with tangent velocity. Do not describe these as free rigid-body loops.
24. Make pitch failure consequential on technical campaign courses: a landing error above .85 radians with downward speed above 160 causes a crash. Existing nontechnical Endless retains forgiving health-based landing damage.
25. Brake reaches zero and takes precedence over boost. The catcher has a flat apron before its collision wall; its opening is actually wide enough for a grounded rider.
26. Use a .14-second melee windup, .68-second cooldown and one forward target. Rivals respond to the windup through guarding/evasion; player brake+forward guard reduces strike damage. Ground traffic has persistent per-contact bookkeeping: only a new physical impact damages, with separation hysteresis; no proximity-only contact is counted.
27. A press deals damage once per rider per stroke, under shared rules. Otherwise braking inside a press could drain health repeatedly without a new machine action. AI forecasts strokes and brakes without positional rubber banding.
28. Collapsing bridge spans have a shared lower escape ramp. A competitor breaking a span must change the route rather than guarantee elimination. Trial recovery restores future fragile geometry to prevent checkpoint softlocks.
29. Final-event service pads restore 35 integrity and .3 boost once per rider, including rivals. This supports a four-district marathon without secretly increasing player durability. Cyan crosses visibly communicate the interaction.
30. Validate the campaign with bounded normal-input policy retries (throttle, boost, cruise, delayed start). Record failed attempts; do not claim perfect first-pass clearance. Isolated throttle+boost comparisons demonstrate navigation changes independently of opponent damage.

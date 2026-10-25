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

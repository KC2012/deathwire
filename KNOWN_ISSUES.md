# Known limitations

- This is a compact campaign release milestone, not the entire long-term assignment. Weapons beyond melee, moving rigid-body contraptions, alternate-route navigation, pursuits and a visual editor remain deferred.
- Two contact samples and guided loop rails trade simulation fidelity for speed and predictable controls. There is no full rigid-body bike/rider ragdoll.
- Ghost Protocol is demanding: the conservative scripted stock-bike rider completes it with about 3.5 integrity. Human balance testing should prioritize it.
- AI riders anticipate gaps and traps but are not exhaustive course planners. They can crash and be eliminated. No rubber banding replaces their simulation. They may all lose to a skilled sustained-throttle player.
- Landscape touch layout is browser-tested, but real mobile hardware, audio behavior under mobile OS policies, accessibility with assistive technology, and Firefox/Safari require further testing.
- Progress is local to the browser/origin. File-opening storage behavior varies by browser. Unavailable storage preserves session play and displays a warning in Settings; it cannot preserve progress after closing the tab.
- Version 1 save validation rejects unknown schemas rather than trying to migrate hypothetical future formats. Prototype personal bests remain separate from campaign progress.
- Seed audits prove conservative construction properties, not every possible input speed or hazard phase. Braking at a launch can still cause a fall; speed is part of the challenge. The scripted campaign traversal covers one bounded policy on the stock bike.
- Desktop headless Chromium validation is not a hardware performance benchmark. Long Endless sessions and every garage/seed combination have not been exhaustively soaked.
- No deployment, push or cloud snapshot publication was performed. Reusable configuration was saved as a draft; restored-task behavior remains unverified.

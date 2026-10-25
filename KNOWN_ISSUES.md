# v0.30 known limits

- A full rigid-body bike/rider simulation, freely rotating rideable machinery and unconstrained loops are not implemented. Guided loops expose speed/release control; art machinery outside bright road/collision shapes is decorative.
- Two of the four isolated new families still permit held throttle+boost completion. They provide racing/recovery rhythm and route choices; not every section demands precision. Navigation comparisons establish two specific failures of held inputs, not a universal impossibility proof.
- Campaign completion uses a bounded set of normal-input retries. The attempt log includes crashes and combat deaths; first-pass success on every event is not claimed. Upper routes, landing alignment, braking and guarding need learning.
- The press section and late races remain demanding. AI riders can fail and can defeat the player. There is no hidden catch-up speed, invulnerability, respawn teleport or finish projection.
- AI recognizes hazards and traffic but does not search a full route graph. The optional Prism shortcut is player-selectable; AI may take it through a jump but does not guarantee optimal branch planning.
- Collision damage is an arcade consequence; solid presses are not rigid-body constraints. A per-stroke hit cannot repeatedly drain health without a new stroke. The same rule applies to player and rivals.
- Old campaign records remain historical after course changes. Saves remain browser/origin-local and unknown future formats are rejected; current v1 progress is preserved.
- Desktop Chromium and landscape bounds were checked. Human feel/balance testing, assistive technology, Firefox/Safari, real mobile touch/audio/performance and long Endless soak testing remain unrun.
- The 32 build/speed matrix remains a regression of the retained v0.20 assemblies. New mega-course coverage is stock-bike input-policy traversal, not exhaustive coverage of every garage build and phase.
- New screenshots include both staged engineering views and real animation-frame runs; neither substitutes for human playtesting. Cloud task restoration/publication is not verified by game tests.

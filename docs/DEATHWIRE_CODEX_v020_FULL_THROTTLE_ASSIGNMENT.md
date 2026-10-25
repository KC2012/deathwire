# DEATHWIRE — Codex Assignment: v0.20 FULL THROTTLE

## Mission

Take the current **v0.10 BLACK CIRCUIT** repository and develop the next substantial playable milestone, **v0.20 FULL THROTTLE**. This is an implementation and creative-design assignment, not a planning exercise. Work independently: inspect the current game and recorded tests, make decisions, implement, playtest, adjust, and continue until a coherent, significantly richer build is ready. You may reorganize the code, but keep a working build throughout. Do not wait for approval on ordinary design choices.

**Creative target:** Moto X3M's outrageous notebook-doodle deathtraps + expressive Trials-like rocketbike control + Road Rash-style physical competition, presented as an ultra-fast, minimalist, neon-industrial cyberpunk arcade game. The rider, rivals, and track must create emergent spectacles together. Prioritize **memorable gameplay per minute** over the number of features.

## Starting point and evidence

Read `CURRENT_STATE.md`, `KNOWN_ISSUES.md`, `ROADMAP.md`, `DECISIONS.md`, `TESTING.md`, and the actual code. Keep the existing tests running. v0.10 already has a 12-event/four-district campaign, four garage builds, guided loops, boost pads, grounded lean, seeded course modules, local saves, standalone export, and development tools. **Do not restart the project or rebuild these systems merely for novelty.**

The recorded campaign automation completes the entire circuit in roughly four minutes of optimized riding (events about 11–31 seconds). More importantly, in **all six races with opponents, all four rivals were eliminated before finishing** in the recorded runs. This is a major qualitative gap: first place is often uncontested. Use this evidence to prioritize meaningful racing, AI survival, and event variety rather than simply increasing enemy count or damage.

## Priority 1 — Make the tracks spectacular and playable

Turn modular hazard sequences into **large, interconnected, outrageous mechanical constructions**. Add several truly distinct encounter families rather than a long list of cosmetic obstacle variants. Examples to choose from and adapt:

- Multi-stage rocket launch systems: visible charge strips, accelerating runway, immense ballistic gap, aerial hazards, and dramatic but attainable landing zones.
- Tower loops, corkscrew-like guided 2D rails, inverted ceiling tracks, magnetic wall-ride transitions, and large halfpipe/rebound sequences. Keep controls meaningful; use explicit arcade assistance where required rather than pretending a 2D rigid-body simulation can do everything.
- Giant rotating machinery with rideable surfaces, moving lifts, crusher tunnels, swinging demolition arms, or linked conveyor mechanisms.
- Destructible architectural set pieces: collapsing skybridges, glass tunnels, explosive supports, runaway machinery, and chain reactions that visibly change the route.
- Clear alternate high/low routes **only if** camera, collisions, and rival navigation can support them; otherwise build one excellent route.

Author at least **one signature multi-stage set piece per district**, with additional smaller variations. Give each district a distinctive silhouette, machinery language, obstacle rhythm, and lighting treatment, not just a different tint. Preserve high-speed flow: some intense sections should be followed by open racing/recovery stretches. Make launch-pad timing, collision bounds, hazard telegraphs, and camera look-ahead readable without floating instructional hazard text.

Expand the seeded procedural grammar with entrance/exit constraints, speed/launch envelopes, hazard timing bounds, safe transitions, and an encounter pacing director. Curated campaign encounters can be partially authored and randomized within safe limits. Ensure **the generated geometry is actually traversable at plausible speeds**, not just syntactically valid. Save reproducible failing seeds; build internal tools to jump to and repeat any encounter.

## Priority 2 — Make rival riders genuine competitors

Improve anticipation, hazard handling, recoveries, and tactical decisions so rivals regularly survive long enough to compete at the finish. Retain shared collision and damage rules—**no invulnerable AI, teleporting, or hidden rubber-band speed cheats**. Differentiate riders by driving style, risk, aggression, boost usage, and attack timing. Give a few named rivals recognizable silhouettes/behavior and recurring campaign appearances.

Make overtaking and combat legible. Attacks need windups, hit reactions, knockback, and counterplay. Emphasize environmental knockoffs and collisions over generic damage exchanges. Add a small, carefully balanced combat enhancement only if it deepens this physical interplay (for example, one alternate melee tool or limited-use offensive option), not a sprawling weapon inventory.

**Racing acceptance target:** In repeated automated and human-reviewed runs across representative race courses, some AI riders should survive to finish, compete for placement, and sometimes beat a competent but imperfect player. The player's rank must reflect real positions. Record finish/survival rates and race gaps, not merely whether the player can finish. Avoid tuning the entire game around an omniscient scripted test rider.

## Priority 3 — Make the campaign feel like a campaign

Preserve the existing four-district Black Circuit structure and player progress. Make the twelve events **meaningfully different** in what happens and what the player is trying to accomplish. Improve existing races/gauntlets and add **one or two new event formats** only when they are genuinely playable and tested: e.g. an elimination chase, a demolition run, an escalating pursuit, or a rival showdown. Every district should have a distinctive climax; the final event should be a memorable synthesis of track spectacle and a recurring rival, not just a longer ordinary sprint.

Use concise pre/post-event flavor, brief rival identity, visible environmental storytelling, and occasional dramatic introductions. Do not bury the action under dialogue or lengthy menus. Expand the garage only enough to create interesting playstyle tradeoffs and meaningful reasons to revisit events; the stock bike must remain viable. Improve event length and pacing where appropriate, but keep runs brisk and restart fast. Preserve medal fairness, no-grind unlocks, persistent progress, and validated saves. **Migrate existing v1 saves** if the schema changes; never silently erase the current campaign.

## Priority 4 — Make speed and destruction feel extraordinary

Keep the minimalist high-contrast 1-bit silhouette foundation and controlled cyan/magenta district accents. Push motion and impact through camera lead, speed streaks, engine/boost audio, tire/suspension feedback, sparks, debris, dynamic lighting accents, screen shake with reduced-motion support, and distinct destruction animations. A crash should be spectacular and understandable. Keep the player and imminent hazards readable at maximum speed. Optimize for desktop and landscape mobile; avoid excessive overlays, tutorial popups, bloom, particles, or interface clutter.

Preserve controls: **Up/W throttle, Down/S brake, Left/A lean back/wheelie, Right/D lean forward, Z hop, X boost, Space attack, P pause, R retry, Ctrl+Shift+D developer panel.** Do not regress the currently liked basic riding feel just to make physics more elaborate. Keep no compulsory network services, external assets, paid APIs, multiplayer, or monetization. Export one offline playable HTML file.

## Working method — act autonomously, but verify

1. Establish a baseline by running the current build and tests. Inspect actual gameplay/screenshots and identify the most important quality gaps.
2. Build a **complete representative vertical slice** first: one extraordinary track assembly, one credible rival encounter, and one satisfying event result. Playtest and tune it before mass-producing content.
3. Generalize the successful mechanics into reusable encounter modules and district content. Revisit pacing and camera as track speed/scale increases.
4. Improve the campaign and garage around the now-proven gameplay. Keep the whole game playable after each milestone.
5. Run existing regressions plus new tests: seeded geometry/transition audits, normal-input rider traversal at multiple speeds and bike builds, AI finish/survival statistics, collision/loop/boost edge cases, checkpoint recovery, save migration, touch layout, and standalone export. Use browser gameplay/screenshots, not tests alone, to assess clarity and excitement.
6. Fix regressions before declaring success. Update `CURRENT_STATE.md`, `ROADMAP.md`, `DECISIONS.md`, `KNOWN_ISSUES.md`, `TESTING.md`, and `CHANGELOG.md` honestly. Do not call untested features complete.

## Definition of done for v0.20

- At least four memorable, mechanically distinct district signature encounters, each actually playable and tested.
- Expanded procedural variety with bounded, reproducible transitions and useful in-game engineering tools for encounter replay.
- Racing that produces credible finishes and sustained rivalry, with recorded survival/placement evidence.
- A campaign whose districts, events, and finale have distinct identities and escalating spectacle; progression and existing saves remain functional.
- Noticeably stronger speed, impact, destruction, and environmental personality without loss of readability or control.
- Working offline standalone HTML build, reproducible tests, screenshots of the new content, and candid notes on unresolved issues.

**Authority:** Make routine creative and technical decisions yourself. If a proposed feature fails to improve play, cut or redesign it. Favor a smaller set of exceptional interactions over many shallow ones. Do not stop at a roadmap or a single cosmetic pass; implement and iterate as far as the available execution time permits. Preserve a known-good checkpoint and report exactly what is complete versus deferred.

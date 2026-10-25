# DEATHWIRE

Ride, fight, survive the track. Maintain the supplied monochrome silhouette identity and use restrained cyan, pink and district accents. A compact campaign that can actually be completed takes priority over a huge unfinished world. No accounts, monetization, services or required network calls.

The user explicitly authorized development beyond the supplied prototype. The attached assignment informed scope and acceptance tests; ordinary technical decisions were made independently. Only two attachments were supplied: an assignment and a single HTML prototype, not a ZIP. The initially empty repository was populated from that HTML after running it in Chromium.

## Architecture

- `source/game.js`: one private game closure; 120 Hz fixed-step integration, separate front/rear wheel contact samples, grounded lean torque, coyote jumping, ballistic flight, guided loop rails, common rider/hazard simulation, seeded module grammar, procedural scenery and synth audio.
- `source/circuit.js`: twelve curated event configurations in four districts; first-clear progression, three medal levels, four bounded bike builds, versioned validated saves, options, menus and developer tools. Build embeds it into the game closure.
- `source/shell.html`: responsive game shell and overlays. Canvas renders the world; DOM provides menus and touch inputs.
- `tools/build.mjs`: dependency-free single-file export, syntax validation and SHA-256 manifest. Generated HTML is committed as a ready-to-play artifact.
- `tests`: browser regressions, long seeded geometry inspection, stock-bike campaign traversal and a real animation-frame distribution smoke test.

Track randomness uses a dedicated seed generator. AI and effects have separate streams; visual randomness cannot change track construction. Curated campaign modules repeat with bounded terrain variations and safe entry/exit geometry. Finite courses are generated before the race and retained for checkpoint recovery. Endless generation alone prunes old geometry.

Rivals have independent physics, damage, jump decisions, attack telegraphs and finish positions. No race catch-up speed adjustment or mid-course spawning occurs in finite modes. Loop rides are deliberately guided arcade set pieces, not rigid-body simulations.

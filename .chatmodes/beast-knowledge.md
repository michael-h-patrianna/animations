Assumptions
- The user wants exact visual parity with the CSS originals where applicable; for spring-bounce we mirror the existing framer version’s physics.
- The catalog ordering places framer duplicates immediately after their CSS/base counterparts for discoverability.

Decisions
- Reuse the shared framer overrides in framer-shared.css for centering/transform neutrality instead of a per-animation CSS file. This keeps behavior consistent and avoids transform conflicts.
- Keep overlay opacity at 0.72 to match the base set.

Context notes
- structure.json drives the UI catalog and tests; each animation.id must map to a component in animationRegistry via the dialogsModalBaseFramerAnimations export.
- Base spring-bounce already uses framer-motion within the CSS group; we still add a duplicate under the new framer group for catalog completeness.

Sources/links
- N/A (internal repo code references only)

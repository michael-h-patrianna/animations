---
argument-hint: [description of animation to create]
description: Create a new animation with AI-generated image assets — concept → assets → dual implementation → review.
---

Create a production-ready animation for this showcase catalog. User request: "$ARGUMENTS"

PHASE 1 — CONCEPT:

Design the animation concept. Determine:
- Visual narrative implied by the user's description
- Motion pattern (bounce, morph, particle, parallax, reveal, etc.)
- Image assets needed: subject, transparency requirement, dimensions, DOM placement
- Target category and group (existing or new)
- Keyframe sequences, timing curves, and layering for both CSS and Motion variants

Use the `animation-design` skill to research existing animations for similar motion patterns. Extract relevant curves and timing from the project's design tokens. Never copy reference code.

Output:
```
CONCEPT:
  title: [human-readable name]
  id: [group-id__variant-name]
  category: [category folder name]
  group: [group folder name]
  description: [one sentence — visual effect and use case]
  motion_pattern: [primary technique]
  keyframes: [value sequence for primary animation]
  timing: [duration, easing, delays]
  assets_needed: [{name, subject, transparency_required, dimensions}]
```

QUALITY GATE:
- Clear visual narrative, not just "make it move"
- Every asset listed with transparency requirement
- Motion pattern maps to an allowed CSS property (transform, opacity, backgroundColor)
- Timing values sourced from project design tokens

PHASE 2 — ASSET GENERATION:

Call `xainflow_get_context` to load workspace/credits/projects. If multiple projects exist, ask which to use.

For each asset in `assets_needed`:

1. Use the `ai-image-generation-prompting` skill to write the generation prompt. For transparent assets, append: "The subject is isolated on a transparent background with no shadows or ground plane."

2. Generate with `xainflow_generate_image`:
   - Transparency required → model `gpt-image`
   - No transparency → model `grok-imagine`
   - Set `aspect_ratio` to match target dimensions

3. Download: `curl -sL "<asset_url>" -o "src/assets/<category>/<filename>.png"`
   Create directory if needed. Add the asset to `src/assets/index.ts`.

Regenerate once if an asset does not meet quality expectations.

QUALITY GATE:
- Every asset saved to `src/assets/` (verify with `ls`)
- Correct model used per transparency requirement

PHASE 3 — IMPLEMENTATION:

Use the `animation-design` skill to implement the animation. Provide the concept from Phase 1 and asset paths from Phase 2. The skill handles: technique research, Motion+React variant, CSS+React variant, group registration, and verification.

PHASE 4 — VERIFICATION:

Run `npm run typecheck` and `npm run lint`. Fix issues found. Maximum one fix cycle — report any remaining issues.

OUTPUT:
- Files created/modified (paths)
- Asset generation: model used, credits per asset
- Issues found and resolutions
- Final animation id and location

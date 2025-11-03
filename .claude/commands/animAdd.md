---
argument-hint: [description]
description: Design and implement a new animation from a natural language description via animation-designer → animation-developer → review → tests → docs.
---

You are orchestrating a complete animation delivery workflow. The user provided the animation description as: "$ARGUMENTS".

GOAL
- Take the user's description and produce a production-ready animation in this repository, following our motion design principles and RN-compatibility requirements.

WORKFLOW (STRICT ORDER)
1) DESIGN SPEC (animation-designer)
   - Call the subagent `animation-designer` with the user's description to generate a single ANIMATION_SPEC block.
   - Enforce that the spec fully follows docs/animation-short.md.
   - If the output is not a single valid ANIMATION_SPEC JSON block, request a corrected output from the same subagent.

2) IMPLEMENTATION (animation-developer)
   - Hand the ANIMATION_SPEC to `animation-developer` to implement the animation in React using CSS and/or Framer Motion.
   - Ensure accessibility (prefers-reduced-motion) and performance targets are implemented.
   - Require the developer to place code within appropriate src/ locations, follow existing patterns, and add any necessary assets/config.


3) CODE REVIEW (code-reviewer)
   - Ask `code-reviewer` to review the implementation for correctness, performance, accessibility, and maintainability.
   - If issues are found, fix them and re-run review until approved.

4) TESTS (test-automator or testing-specialist)
   - Select a suitable testing subagent (`test-automator` or `testing-specialist`).
   - Write or update automated tests that cover the new animation behavior. Prefer Playwright for e2e and any existing unit/integration frameworks in this repo.
   - Ensure tests are deterministic and verify key timings/variant states where feasible.

5) RUN TESTS & FIX
   - Run tests. If failures occur, fix and iterate until all tests pass.

6) DOCS (docs-architect)
   - Call `docs-architect` to update or add documentation as needed (README sections or docs/*) describing the new animation, how it works, and any usage examples.

7) FINAL CHECKLIST
   - Confirm alignment with docs/animation-short.md
   - Confirm RN translatability per docs/REACT_NATIVE_REFACTORING_PATTERNS.md
   - Confirm prefers-reduced-motion behavior exists
   - Confirm performance targets and no layout thrash
   - Confirm tests exist and pass
   - Confirm docs updated

RESOURCES TO REFERENCE
- @docs/animation-short.md
- @docs/REACT_NATIVE_REFACTORING_PATTERNS.md
- @CLAUDE.md (project memory)
- Project structure under @src/**/*
- Existing agents under @.claude/agents/* to align styles

IMPORTANT RULES
- Do NOT include source code in the DESIGN SPEC step (design-only). Code only appears in the IMPLEMENTATION step.
- Use the subagents exactly as described: animation-designer → animation-developer → code-reviewer → tests → docs.
- Keep outputs traceable to the ANIMATION_SPEC.
- Prefer transform/opacity for performance; avoid filter/clip-path/vh/vw; no DOM-only APIs.
- Ensure reduced motion alternative is implemented and tested.

OUTPUT
- Provide a concise progress log for each step.
- Indicate locations of created/edited files.
- Summarize test results and document updates.

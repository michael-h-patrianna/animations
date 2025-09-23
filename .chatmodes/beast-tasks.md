Phase plan and task tracker

PHASE 1: UNDERSTAND & PLAN
- [✓] Analyze request and repo context
- [✓] Identify missing parity (spring-bounce framer entry)
- [✓] Plan implementation tasks and validation

PHASE 2: IMPLEMENT SOLUTION
- [ ] Create ModalFramerSpringBounce component mirroring ModalBaseSpringBounce
- [ ] Wire into dialogs modal-base-framer index map and exports
- [ ] Add catalog entry to docs/structure.json for modal-base-framer__spring-bounce
- [ ] Run lint and build
- [ ] Run unit tests via tasks; inspect output and fix issues if any

PHASE 3: VALIDATE & ITERATE
- [ ] Registry coverage: ensure all modal-base-framer IDs in structure.json are registered
- [ ] Visual parity assumptions documented (overlay opacity, spring params)
- [ ] Quality gates: Lint PASS, Build PASS, Tests PASS (or analyze failures and iterate up to 3x)
- [ ] Decide DONE or iterate

Notes
- Keep data-animation-id consistent with structure.json IDs.
- Use existing framer-shared.css and modal shared.css to avoid transform conflicts.

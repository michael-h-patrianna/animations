Problem
- Add missing framer duplicate “Spring Bounce” in the new “Base modals (framer)” group so that every animation from the base modal group has a framer counterpart.

Users (JTBD)
- Developers browsing the catalog need consistent framer-based variants to compare and adopt.

Goals / Success
- A component exists at id modal-base-framer__spring-bounce
- It renders visually identical to the existing base spring-bounce demo
- The registry and catalog resolve without errors; tests remain green

Scope
- In: Component creation, registry wiring, structure.json update, lint/build/test
- Out: Any additional animations or unrelated refactors

Functional requirements
- Component uses framer-motion spring physics matching ModalBaseSpringBounce
- Overlay opacity and fade match base
- data-animation-id matches structure.json exactly

Non-functional
- TypeScript passes type-check
- Lint passes per project config
- Build succeeds

Acceptance criteria
- structure.json contains an entry for modal-base-framer__spring-bounce under dialogs/modal-base-framer
- dialogsModalBaseFramerAnimations maps that id to a React component
- Rendering the component shows an overlay fade and a springy modal entrance matching the base version

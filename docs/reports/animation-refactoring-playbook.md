# Animation Group Refactoring Playbook

## Goal

Every animation in this catalog must be a standalone, copy-pasteable component that a developer can drop into any React web app or adapt for React Native (via Moti). Every hardcoded value a consumer would want to change is exposed as an optional prop with a sensible default. The animation works with zero props in the catalog and with full configuration in a consumer's app.

The dual-variant model (Motion in `framer/`, CSS keyframes in `css/`) is non-negotiable. The Motion variant is the starting point for React Native developers. Both variants must produce visually identical results.

## Quality Bar

Study `src/components/rewards/collection-effects/` — this is the reference implementation. Before starting work on any group, read every file in that directory and understand the decisions: the shared types, the fallback particle system, the image preloader, the prop interface, the scale curves, the demo separation. Your output must match or exceed this quality.

Research how the effect you're implementing works in mobile games, AAA games, and professional animation libraries (Lottie, Rive, After Effects). Search the web for 2-3 real-world references. The difference between "mechanically correct" and "feels professional" comes from understanding motion principles — anticipation, follow-through, overshoot, secondary action, easing curves — as they apply to the SPECIFIC effect, not from generic bullet points.

## What You Must Consider

### The standalone test

After refactoring, a consumer copies the listed files (component + CSS + shared utilities — may be multiple files) into their React project. They write JSX using the props you designed. It works. No `MockContent` imports, no `DemoAnchors`, no `@/assets` that don't exist in their project, no `isDemo` branches, no catalog-specific code paths.

### The type constraint

Components are typed `ComponentType<Record<string, unknown>>` (enforced in `src/lib/groupBuilder.ts:121-124`). All props MUST be optional. The catalog renders `<Component />` with zero props. Design defaults that produce meaningful behavior — container center for spatial effects, placeholder content for wrappers, demo values for data-driven components.

### The dual-variant CSS conflict

Both `framer/*.css` and `css/*.css` load eagerly via `import.meta.glob` in the group `index.ts`. If both variants use the same class name, the CSS variant's `animation:` property silently overrides Motion's transform animation on framer elements. This breaks framer animations in ways that are invisible in code review — particles render but don't move.

Framer `m.*` elements sharing a class name with CSS-animated elements need `style={{ animation: 'none' }}`. CSS particle classes need `opacity: 0` and `animation-fill-mode: both` to prevent flash-of-visibility during delay.

### The demo separation architecture

Animation components contain zero demo code. The catalog renders demo UI externally through `demoMode` metadata → `DemoModeWrapper` in `GroupSection.tsx` → `MockDemoAnchors.tsx`. When you add a new demo mode, extend the type union in `src/types/animation.ts` (both `Animation` and `AnimationMetadata`), propagate in `src/services/animationData.ts`, and extend the wrapper in `GroupSection.tsx`.

### The complexity spectrum

Not all animations are the same product:

- A **bounce effect** wraps any element the consumer provides. The refactoring is about accepting `children` and exposing timing/intensity knobs. Don't add spatial props — they're meaningless here.
- A **particle effect** generates its own visual driven by spatial and count props. The refactoring is about making origin/target/count/appearance configurable and providing SVG fallbacks when no images are given.
- A **progress bar** fills based on a data value. The refactoring is about accepting a `progress` prop and exposing color/size/easing knobs.
- An **orchestration** coordinates multiple child elements. The refactoring is about accepting children and exposing stagger/trigger/duration knobs.
- A **full scene** (card pack, chest reveal) is a self-contained product with phases and state machine. The consumer configures WHAT (data, theme, callbacks) not HOW (phases, timing, transitions). If you're exposing `anticipationDuration` as a prop, you've gone too far. The boundary: props control content and appearance, the component owns choreography.

Think about which kind of animation you're working on. The approach differs fundamentally across these categories.

### What a consumer actually needs to know

For every animation you refactor, the consumer needs exactly four answers:
1. Where does this go in my component tree?
2. What props do I pass?
3. What files do I copy?
4. How do I trigger/control it?

The metadata `description` field and the file header comment should answer all four.

## How to Work

### Start with scenarios, not code

Before reading any animation code, write the consumer scenario: "A developer building [specific app type] wants [specific visual result]. They write: [JSX]." This forces the API to emerge from real use cases. The JSX you write IS the specification — implementation follows.

### Critique your own API design before implementing

After writing the consumer scenario, attack it:
- Does this API work for a mobile app AND a web app AND a browser game?
- Are there props that only make sense in one context?
- Would a developer look at this interface and immediately know what each prop does?
- Am I exposing too much (implementation details as props) or too little (hardcoded values that should be configurable)?
- Does the component degrade gracefully when given zero props, or does it produce a blank box?

If the API survives this critique, implement it. If not, revise and critique again.

### Critique your implementation before declaring it done

After implementing, ask:
- Does the animation LOOK and FEEL like its counterpart in a professional mobile game?
- Is the Motion variant actually animating, or is the CSS variant's stylesheet silently overriding it?
- Do particles/elements appear at their correct positions on mount, or flash at (0,0) first?
- Does replay produce fresh behavior (randomized positions, new particle data)?
- Would I be embarrassed showing this to a senior game developer?

If any answer is wrong, debug and fix. The diagnostic patterns from the collection-effects work:

| You see | The cause is | Fix |
|-|-|-|
| Elements at top-left (0,0) then jump | `useEffect` before layout settles | `useLayoutEffect` |
| Framer particles visible but frozen | CSS `animation:` overrides Motion | `style={{ animation: 'none' }}` on `m.*` elements |
| CSS particles flash then disappear during delay | `fill-mode: forwards` skips 0% keyframe during delay | `opacity: 0` on class + `fill-mode: both` |
| Framer: some properties animate, others don't | `times` array length doesn't match all property arrays | All animated properties must be same-length arrays when `times` is set |
| Lint: strict-boolean-expressions | `if (obj)` or `if (num)` | `if (x !== undefined)`, `(n === 0 ? 1 : n)` |

### Shared file naming

Files at group root that aren't animations must match `SKIP_PATTERN` in `src/lib/groupBuilder.ts:31` — prefix with `Shared` or `Mock`. Otherwise they're registered as animation components and the build breaks.

## Files to Study

Before starting any group refactoring, read these for context:

| File | What it tells you |
|-|-|
| `src/components/rewards/collection-effects/SharedTypes.ts` | How to design a shared props interface with spatial resolution utilities |
| `src/components/rewards/collection-effects/framer/CollectionEffectsCoinMagnet.tsx` | Reference for a fully standalone configurable particle animation |
| `src/components/rewards/collection-effects/css/CollectionEffectsCoinMagnet.tsx` | How the CSS variant mirrors the framer variant using custom properties |
| `src/components/rewards/collection-effects/MockDemoAnchors.tsx` | How catalog demo UI works — randomized positions, ref passing |
| `src/components/ui/GroupSection.tsx:165-189` | How `DemoModeWrapper` renders demo UI based on metadata |
| `src/types/animation.ts` | Where `demoMode` lives in the type system |
| `src/lib/groupBuilder.ts:31` | The `SKIP_PATTERN` regex for shared file naming |

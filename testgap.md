# Test Coverage Gap Analysis — Animations Catalog

Date: 2025-09-22

## Executive summary

- Current unit test baseline is low: overall coverage is 15.65% statements / 18.31% branches / 16.88% functions / 15.59% lines.
- Only three unit test suites exist (`src/App.test.tsx`, `src/components/Sidebar.test.tsx`, `src/components/ui/AnimationCard.test.tsx`). They exercise catalog scaffolding, not individual animation components.
- End-to-end coverage is limited to three Playwright specs focusing on: basic homepage rendering, category/group navigation, and a single progress-bar flow (Mission Checkpoints timing).
- Compared to the target "everything is covered by automated tests: unit and e2e", the majority of animation components, data wiring, and critical user journeys are untested.

## Current testing setup (from repository)

- Unit: Jest + React Testing Library + jsdom; coverage configured via `collectCoverageFrom` to include `src/**/*.{js,jsx,ts,tsx}` excluding d.ts and main entry.
- E2E: Playwright (`tests/e2e`) with Chromium/Firefox/WebKit projects; dev server auto-starts (`npm run dev`) and `reuseExistingServer: true`; reporter `html`.
- Supporting mocks: `src/test/setup.ts` provides IntersectionObserver and ResizeObserver mocks.

## Measured unit coverage snapshot

Command executed: `npm run -s test:coverage`

Key observations (abridged):

- Overall: 15.65% statements.
- Catalog scaffolding has tests:
  - `src/components/Sidebar.tsx`: 100%
  - `src/components/ui/AnimationCard.tsx`: 100%
  - `src/App.tsx`: ~60% statements (via high-level rendering tests)
- Many animation directories are effectively 0% because components are not loaded in unit tests:
  - `src/components/dialogs/*`: ~0–2.5%
  - `src/components/progress/*`: ~2.09% (most files 0%)
  - `src/components/realtime/*`: ~1–2%
  - `src/components/rewards/*`: ~6–9%
- `src/components/base/text-effects/*` shows high coverage (~87% statements) but this is incidental through `App` rendering the first group by default, not targeted assertions per component.

Conclusion: unit tests do not directly validate the vast majority of animation components or their behaviors.

## Unit test inventory

- Present:
  - `src/App.test.tsx`: "renders current category", switching categories, group navigation, active state checks.
  - `src/components/Sidebar.test.tsx`: rendering and callbacks for category/group items; active-state transitions.
  - `src/components/ui/AnimationCard.test.tsx`: header/description, replay remount, accordion behavior, infinite/in-viewport mounting.
- Missing:
  - Per-animation component tests (all groups: base/standard-effects, button-effects, dialogs/*, progress/*, realtime/*, rewards/*).
  - Data layer tests for `src/services/animationData.ts`.
  - Registry/structure consistency tests (`docs/structure.json` ↔ `src/components/animationRegistry.ts` ↔ component files).
  - Hooks (`src/hooks/useAnimations.ts`), preload utilities in `src/lib`, and UI components like `GroupSection`, `CategorySection`, `sidebar.tsx` (the latter is a different component from `Sidebar.tsx`).

## E2E test inventory

- `tests/e2e/homepage.spec.ts`:
  - Loads catalog, verifies "Categories" heading, presence of Dialogs category, a base modal group, existence of an animation card, and replay button works.
- `tests/e2e/category-navigation.spec.ts`:
  - Confirms single-category view, sidebar active state, keyboard navigation, swipe gestures, and scroll position maintenance.
- `tests/e2e/mission-checkpoints.spec.ts`:
  - Verifies milestone activation timing synced to progress fill and basic UI compactness for the Mission Checkpoints progress bar.

- Missing end-to-end coverage:
  - All dialog/modal entrance effects beyond a presence smoke check; choreography (modal open + content timing) flows.
  - All base Standard effects and Button effects (hover, press interactions, and animation replay correctness).
  - Progress bars other than Mission Checkpoints (timeline progress, segmented, gradient, thin, bounce, zoomed, etc.).
  - Real-time updates & timers (badge states, pulses, flip digits, leaderboard/live score/tickers) under real-time categories.
  - Rewards (icon animations, modal celebrations, reward basics) behaviors and replay.
  - Accessibility and keyboard focus flows across groups.
  - Responsive/mobile viewports.

## Gaps versus "everything covered"

Below maps each catalog group (from `docs/structure.json`) to current automated coverage status:

| Category | Group | Unit tests | E2E tests |
|---|---|---|---|
| Base effects | Text effects | Partial (incidental via `App`) | Not covered |
| Base effects | Standard effects | None | Not covered |
| Base effects | Button effects | None | Not covered |
| Dialog & Modal Animations | Base modal animations | None | Presence-only checks; no effect validation |
| Dialog & Modal Animations | Content choreography | None | Not covered |
| Dialog & Modal Animations | Auto-dismiss patterns | None | Not covered |
| Dialog & Modal Animations | Tile animations (orchestration) | None | Not covered |
| Progress & Loading Animations | Progress bars | None | Partial (Mission Checkpoints only) |
| Progress & Loading Animations | Loading states | None | Not covered |
| Real-time Updates & Timers | Timer effects | None | Not covered |
| Real-time Updates & Timers | Update indicators | None | Not covered |
| Real-time Updates & Timers | Real-time data | None | Not covered |
| Game Elements & Rewards | Icon animations | None | Not covered |
| Game Elements & Rewards | Celebration effects | None | Not covered |
| Game Elements & Rewards | Reward basic | None | Not covered |

Additional systemic gaps:

- No tests ensuring that every animation defined in `docs/structure.json` has a corresponding component registered in `animationRegistry` and that it renders without throwing.
- No per-animation visual/state assertions (e.g., class changes, inline style transforms, data attributes) or timing assertions for keyframes/Framer Motion transitions.
- No snapshot baselines for DOM structure of each animation, making regressions likely.
- No coverage thresholds enforced in CI.

## Playwright run “hangs” via VS Code chat

Symptom: Running `npm run -s test:e2e` from this chat sometimes appears to hang even though the report opens.

Likely causes and mitigations:

- Reporter/UI: The `html` reporter generates a report that may keep the process alive in some environments. Mitigate by using a non-interactive reporter for headless runs:
  - `playwright test --reporter=line` (or `list`), or set `reporter: [['html', { open: 'never' }], 'list']` in config.
- Dev server lifecycle: `webServer` starts Vite in dev mode. If a server is already running or doesn’t tear down cleanly, the process may wait. Options:
  - Set `reuseExistingServer: false` in CI/headless context.
  - Use `CI=1` which sets `workers: 1` and disables interactive behavior; add an alternate config or env-guarded settings.
- Port contention/timeouts: Ensure the port (5173) is free; increase `timeout` only if necessary.

Local reliable run suggestions:

- Headless, non-interactive: `npx playwright test --reporter=list`
- To view the report after: `npx playwright show-report`

## Recommendations to reach “everything covered”

Prioritized plan, minimizing risk while maximizing coverage quickly:

1) Foundation and safety nets (fast wins)
- Add a "registry consistency" unit test that:
  - Parses `docs/structure.json` and iterates all `animations` ids.
  - Asserts each id exists in `animationRegistry` and its component can mount/unmount inside `AnimationCard` without throwing.
  - Ensures there are no registered components not represented in structure.
- Add a smoke test to render each group’s demo grid and assert:
  - Each card exists, has `data-animation-id`, and the Replay control remounts content.
- Add coverage thresholds to Jest (project-level and per-file overrides as needed) to stop regressions. Start modest (e.g., 40% global, 20% branches) and ratchet up.

2) Per-group unit tests (targeted assertions)
- Base • Standard effects / Button effects: For each effect, assert key behaviors deterministically:
  - Presence of expected container classes, inline transform/opacity values at t=0 and after triggering (use jest fake timers and requestAnimationFrame mocks where needed).
  - Verify replay resets state.
- Dialogs:
  - Modal base effects: Given the container open action, assert overlay opacity and modal transform sequences (sample timestamps).
  - Content choreography: Ensure modal open animation and content stagger overlap properly (content begins shortly before full open).
  - Auto-dismiss toasts/snackbars: Assert countdown timers and dismissal events fire at expected times.
- Progress:
  - For each bar (segmented, thin, gradient, bounce, timeline, zoomed), isolate the progression logic and assert milestone timings, width/transform increments, easing.
- Real-time:
  - Timer effects: tick cadence, urgency states, flip-digit progression (use fake timers).
  - Update indicators: badge pop/pulse/live ping visibility and loop intervals.
- Rewards:
  - Icon animations & celebrations: ensure deterministic classes/timings and replay independence.

3) E2E coverage by user journeys
- Navigation: Sidebar category → first group, group deep-linking, keyboard and swipe navigation (already partial) across all categories.
- Interaction suites:
  - Button effects: hover and click interactions validate visual state changes (via computed style or attribute toggles).
  - Dialog flows: open modal, observe entrance effect, then content animation timing and sequencing.
  - Progress bars: for each variant, verify progression and milestone synchronization (extend the Mission Checkpoints pattern).
  - Rewards: trigger replays and validate elements (coins/confetti icons) appear with expected counts and positions.
- Accessibility: tab order, ARIA roles/headings presence, focus rings.
- Viewports: mobile and desktop projects for a minimal subset.

4) Tooling/infra
- Add a CI workflow to run: lint, typecheck, `jest --coverage`, and Playwright (headless, non-interactive reporter). Store Playwright HTML report as an artifact.
- Stabilize Playwright config for CI runs (`reporter: [['html', { open: 'never' }], 'list']`, `reuseExistingServer: false` when `CI=1`).

## Concrete backlog (actionable)

Short-term (1–2 days):
- Implement registry/structure smoke test described above.
- Implement per-group mount smoke tests that render every animation card and verify replay remount.
- Add Jest coverage thresholds at 40/30/30/40 (stmts/branches/funcs/lines) and increase gradually.
- Switch Playwright reporter to `list` for headless runs; keep `html` generation with `open: 'never'`.

Medium-term (3–7 days):
- Add focused unit tests for:
  - Dialog modal base (2–3 representative effects)
  - Progress bars: segmented, gradient, thin, bounce, timeline
  - Button effects: liquid morph, ripple, shockwave, split reveal
  - Real-time: timer pulse/flip; update indicator badge pop/pulse
  - Rewards: one icon animation and one celebration effect
- Extend E2E:
  - One representative journey per category + replay behavior validated.
  - Mission Checkpoints already exists; add Timeline Progress and Segmented.

Long-term (ongoing):
- Achieve per-animation assertions ensuring the key timing/transform is verified.
- Introduce visual regression testing for a small, stable subset (optional; requires tooling and image baselines).

## Risks and mitigations

- Animation determinism: CSS keyframes and Framer Motion introduce timing variance. Use fake timers and settle points; assert on classes and computed transforms rather than pixel-perfect coordinates.
- Flaky e2e timing: Prefer deterministic hooks (data attributes toggled at milestones) over time-based sleeps; leverage Playwright’s expect polls.
- Test maintenance: Co-locate minimal, stable public test ids (`data-animation-id`, `data-role="replay"`) and keep animation internals encapsulated.

## Quality gates proposal

- Lint + typecheck must pass.
- Jest coverage thresholds enforced; PRs cannot reduce coverage beyond thresholds.
- Playwright suite must pass on Chromium at minimum; optional matrix for Firefox/WebKit on main.

## Summary of current vs target

- Current: 3 unit suites, ~15.65% statements covered; 3 e2e specs covering only core scaffolding and one progress bar timing.
- Target: Every animation component exercised by unit tests (at least smoke + key assertions), and every user journey represented by at least one e2e spec per group.
- Path: Implement registry/structure smoke tests, per-group mounts, and category-representative suites, then scale depth and raise thresholds.

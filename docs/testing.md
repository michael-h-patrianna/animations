# Testing Guide for LLM Coding Agents

**Purpose**: Instructions for writing and running tests in this animation library.

**Tech Stack**: Vitest 4 (unit/component) + Playwright (E2E) + Testing Library + happy-dom

---

## Running Tests

```bash
# Unit tests (fast, use this most often)
pnpm test                    # Single run, exits when done
pnpm run test:coverage       # With coverage report

# Watch mode (ONLY for interactive debugging)
ALLOW_VITEST_WATCH=1 pnpm run test:watch

# E2E tests (slower, requires browser)
pnpm run test:e2e            # Headless
pnpm run test:e2e:headed     # Visible browser
pnpm run test:e2e:report     # View HTML report
```

**CRITICAL**: Never use watch mode in automated workflows. Always use `pnpm test`.

---

## Where to Put Tests

| Type                       | Location          | File Pattern                |
| -------------------------- | ----------------- | --------------------------- |
| Feature/domain tests       | `src/__tests__/`  | `<feature>.test.tsx`        |
| Smoke tests                | `src/__tests__/`  | `<group>.smoke.test.tsx`    |
| Hook tests                 | `src/__tests__/`  | `hooks.<hookName>.test.tsx` |
| Co-located component tests | Next to component | `<Component>.test.tsx`      |
| E2E tests                  | `tests/e2e/`      | `<feature>.spec.ts`         |

---

## How to Write an Animation Smoke Test

**Template** (`src/__tests__/<group>.smoke.test.tsx`):

```typescript
import { render, waitFor } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, it, expect } from 'vitest'
import { groupExport } from '@/components/<category>/<group>'

describe('<GroupName> Smoke Tests', () => {
  Object.entries(groupExport.framer).forEach(([id, { component: Component }]) => {
    it(`renders ${id} without crashing`, async () => {
      const { container } = render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      )

      await waitFor(
        () => {
          expect(container.querySelector(`[data-animation-id="${id}"]`)).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })
  })
})
```

Do not use `setTimeout()` sleeps for lazy components. Wait for the rendered condition you actually need with `waitFor(...)` or a `findBy*` query instead.

---

## Test Utilities

```typescript
import { withAnimationCard, queryStage, advanceRaf } from '@/test/utils/animationTestUtils'

withAnimationCard(<Component />, { id: 'test-id', title: 'Test', description: 'Desc' })
const stage = queryStage()        // Query .pf-demo-stage element
await advanceRaf(600)             // Advance fake timers 600ms
```

Always pair `vi.useFakeTimers()` in `beforeEach` with `vi.useRealTimers()` in `afterEach`.

---

## E2E Depth Rules

Every E2E test must verify **observable user-facing behavior**, not just DOM existence. A test that passes when the feature is visually broken is worse than no test — it creates false confidence.

### What Every E2E Test Must Assert

| Requirement                | Example                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| **Functional correctness** | Clicking a nav link changes the visible content, not just the URL           |
| **Visual layout**          | Panels are positioned correctly, content doesn't overflow or overlap        |
| **State round-trip**       | User action → state change → UI update → verify the update is visible       |
| **Error absence**          | Auto-fixture `_autoErrorGuard` catches uncaught JS errors and console.error |

### Forbidden E2E Patterns

| Pattern                                            | Why it's shallow                                              | Do instead                                                            |
| -------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `toBeVisible()` as sole assertion                  | Element exists but could be unstyled, mispositioned, or empty | Assert content, dimensions, or computed style                         |
| `toHaveCount(n)` without content check             | Correct count of empty/broken elements passes                 | Check at least one element's content or dimensions                    |
| `waitForTimeout(ms)`                               | Arbitrary delay — flaky, slow, hides real timing issues       | Wait for a condition: `toBeVisible`, `waitForFunction`, `expect.poll` |
| Navigation test without content verification       | URL changed but content could be stale or missing             | Assert the rendered content matches the navigated target              |
| Checking `data-active` without visual confirmation | Attribute set but styling could be broken                     | Also verify computed style or visual indicator                        |
| `toHaveAttribute` as sole functional assertion     | Attribute present but feature could be non-functional         | Assert the downstream effect of that attribute                        |

### Layout Assertions

When testing panel-based layouts, verify spatial relationships:

```typescript
// Verify panel is positioned and sized correctly
const panel = page.getByTestId('left-panel')
const box = await panel.boundingBox()
expect(box).not.toBeNull()
expect(box!.width).toBeGreaterThan(200)
expect(box!.height).toBeGreaterThan(100)

// Verify content area doesn't overlap panels
const content = page.getByTestId('content-area')
const contentBox = await content.boundingBox()
expect(contentBox!.x).toBeGreaterThanOrEqual(box!.x + box!.width - 5) // Allow small overlap for borders

// Verify panel content is scrollable when it overflows
const scrollHeight = await panel.evaluate((el) => el.scrollHeight)
const clientHeight = await panel.evaluate((el) => el.clientHeight)
if (scrollHeight > clientHeight) {
  // Verify scrollbar or scroll behavior works
  await panel.evaluate((el) => el.scrollTo(0, 100))
  const scrollTop = await panel.evaluate((el) => el.scrollTop)
  expect(scrollTop).toBeGreaterThan(0)
}
```

---

## E2E Testability Attributes

Production components expose these `data-*` and `aria-*` attributes for E2E automation. Do not remove them.

| Attribute                            | Element                               | Purpose                               |
| ------------------------------------ | ------------------------------------- | ------------------------------------- |
| `data-testid="top-bar"`              | Top bar `<div>`                       | Locate the top navigation bar         |
| `data-testid="left-panel"`           | Left panel `<m.div>` in EditorLayout  | Locate the left sidebar panel         |
| `data-testid="right-panel"`          | Right panel `<m.div>` in EditorLayout | Locate the right inspector panel      |
| `data-testid="toggle-left-panel"`    | Button in EditorTopBar                | Toggle left panel visibility          |
| `data-testid="toggle-right-panel"`   | Button in EditorTopBar                | Toggle right panel visibility         |
| `data-testid="code-mode-switch"`     | ToggleGroup in EditorLeftPanel        | Switch between Framer/CSS/PixiJS mode |
| `data-testid="sidebar-section-{id}"` | ControlGroup in EditorLeftPanel       | Category section in sidebar nav       |
| `data-testid="sidebar-subnav-{id}"`  | `<nav>` in EditorLeftPanel            | Group links within a category         |
| `data-testid="sidebar-group-{id}"`   | `<button>` in EditorLeftPanel         | Individual group nav link             |
| `data-active`                        | Active sidebar group `<button>`       | Marks the currently selected group    |
| `data-animation-id`                  | Animation root element                | Identifies animation components       |
| `data-testid="card-canvas"`          | AnimationCard wrapper                 | Animation card display area           |
| `data-testid="demo-stage"`           | Demo stage `<div>`                    | Animation rendering stage             |
| `data-testid="card-title"`           | Card header                           | Animation title text                  |
| `data-testid="topbar-title"`         | Top bar center                        | Current group name and count          |
| `data-testid="menu-view"`            | VIEW dropdown trigger                 | Theme/accent settings menu            |
| `data-testid="github-link"`          | GitHub `<a>`                          | External repository link              |
| `aria-expanded`                      | Category toggle, panel toggle         | Reflects open/closed state            |

---

## E2E Selector Policy

**Enforced by ESLint rule `no-class-id-locators`.**

| Priority | Selector Type       | When to use                                     |
| -------- | ------------------- | ----------------------------------------------- |
| 1        | `data-testid`       | UI shell components, interactive elements       |
| 2        | `data-animation-id` | Animation card containers                       |
| 3        | `aria-*` / `role`   | Accessible interactive elements                 |
| 4        | `data-role`         | Semantic roles not in ARIA spec                 |
| 5        | `:scope > *`        | Structural child queries within scoped locators |

**Banned**: CSS class selectors, ID selectors, bare tag selectors (lint error in non-animation spec files).

**Exception**: `animation-*.spec.ts` files may use CSS class selectors within `data-animation-id` containers.

**Page objects**: Reusable selectors belong in `tests/e2e/page-objects/`. Prefer `CatalogPage` and `MobilePage` methods.

---

## E2E Test Template

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('verifies expected behavior', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-animation-id]').first()).toBeVisible()
  })
})
```

---

## Memory Safety

- Max 4 test workers in parallel. Do NOT change `maxWorkers` in vitest.config.ts.
- Call `cleanup()` from @testing-library/react in afterEach.
- Do not generate 1000+ data points in a single test.

## PixiJS Test Policy

- Unit tests should verify PixiJS metadata, URL suffixes, registry loading, and source tabs. Do not rely on happy-dom to prove WebGL/canvas rendering.
- Component tests that mount `PixiAnimationHost` must mock absent browser APIs and destroy Pixi applications after assertions.
- Canvas rendering, nonblank pixels, and interaction checks belong in Playwright E2E or browser-driven tests.
- Do not add `waitForTimeout` sleeps for GSAP timelines. Wait for observable canvas/state conditions.

---

## Common Mistakes

- **Don't**: Test animation frame values. **Do**: Test start/end state or "renders without crashing".
- **Don't**: Use relative imports. **Do**: Use `@/` alias.
- **Don't**: Write tests that only check defaults exist. **Do**: Verify actual behavior.
- **Don't**: Skip `Suspense` wrapper for lazy components. **Do**: Always wrap in `<Suspense>`.
- **Don't**: Mock everything. **Do**: Mock only browser APIs absent in happy-dom (IntersectionObserver, ResizeObserver).
- **Don't**: Assert on implementation details. **Do**: Assert on observable behavior (DOM output, returned values).

## E2E Test Patterns

**Wait for conditions, never arbitrary timeouts:**

```typescript
// WRONG: arbitrary delay
await page.waitForTimeout(2000)

// RIGHT: wait for the actual condition
await expect(page.getByTestId('left-panel')).toBeVisible()
await catalogPage.waitForCards()
await expect.poll(async () => newActive.count(), { timeout: 5_000 }).toBe(1)
```

**Verify panel state via both attribute AND visual effect:**

```typescript
// Attribute check alone is shallow
await expect(toggle).toHaveAttribute('aria-expanded', 'true')

// Add visual verification
const panel = page.getByTestId('left-panel')
await expect(panel).toBeVisible()
const box = await panel.boundingBox()
expect(box!.width).toBeGreaterThan(200)
```

**Animated elements — Motion panel entrance causes DOM instability:**

```typescript
// Use force:true for clicks inside animated panels, or wait for stable child
await tab.click({ force: true })
// Or wait for animation to complete
await expect(panel.locator('[data-testid="sidebar-section-base"]')).toBeVisible()
```

---

## Quality Gate

Before claiming E2E tests pass:

- [ ] Actually ran the tests (do not assume from previous runs)
- [ ] All tests pass with zero skipped failures
- [ ] Every test would **fail** if the feature under test were broken
- [ ] No `waitForTimeout` — all waits are condition-based
- [ ] Layout tests verify bounding boxes, not just `toBeVisible`
- [ ] Navigation tests verify rendered content changed, not just URL
- [ ] No flaky timing dependencies

---

## On-Demand References

| Detail                           | Serena Memory             |
| -------------------------------- | ------------------------- |
| Hook/registry test templates     | `test_templates_advanced` |
| Component behavior test template | `test_templates_advanced` |

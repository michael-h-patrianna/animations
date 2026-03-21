# Testing Guide for LLM Coding Agents

**Purpose**: Instructions for writing and running tests in this animation library.

**Tech Stack**: Vitest 4 (unit/component) + Playwright (E2E) + Testing Library + happy-dom

---

## Running Tests

```bash
# Unit tests (fast, use this most often)
npm test                    # Single run, exits when done
npm run test:coverage       # With coverage report

# Watch mode (ONLY for interactive debugging)
ALLOW_VITEST_WATCH=1 npm run test:watch

# E2E tests (slower, requires browser)
npm run test:e2e            # Headless
npm run test:e2e:headed     # Visible browser
npm run test:e2e:report     # View HTML report
```

**CRITICAL**: Never use watch mode in automated workflows. Always use `npm test`.

---

## Where to Put Tests

| Type | Location | File Pattern |
|-|-|-|
| Feature/domain tests | `src/__tests__/` | `<feature>.test.tsx` |
| Smoke tests | `src/__tests__/` | `<group>.smoke.test.tsx` |
| Hook tests | `src/__tests__/` | `hooks.<hookName>.test.tsx` |
| Co-located component tests | Next to component | `<Component>.test.tsx` |
| E2E tests | `tests/e2e/` | `<feature>.spec.ts` |

---

## How to Write an Animation Smoke Test

**Template** (`src/__tests__/<group>.smoke.test.tsx`):

```typescript
import { render } from '@testing-library/react'
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

      // Wait for lazy component
      await new Promise((r) => setTimeout(r, 100))

      expect(container.querySelector(`[data-animation-id="${id}"]`)).toBeInTheDocument()
    })
  })
})
```

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

## E2E Selector Policy

**Enforced by ESLint rule `no-class-id-locators`.**

| Priority | Selector Type | When to use |
|-|-|-|
| 1 | `data-testid` | UI shell components, interactive elements |
| 2 | `data-animation-id` | Animation card containers |
| 3 | `aria-*` / `role` | Accessible interactive elements |
| 4 | `data-role` | Semantic roles not in ARIA spec |
| 5 | `:scope > *` | Structural child queries within scoped locators |

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

---

## Common Mistakes

- **Don't**: Test animation frame values. **Do**: Test start/end state or "renders without crashing".
- **Don't**: Use relative imports. **Do**: Use `@/` alias.
- **Don't**: Write tests that only check defaults exist. **Do**: Verify actual behavior.
- **Don't**: Skip `Suspense` wrapper for lazy components. **Do**: Always wrap in `<Suspense>`.
- **Don't**: Mock everything. **Do**: Mock only browser APIs absent in happy-dom (IntersectionObserver, ResizeObserver).
- **Don't**: Assert on implementation details. **Do**: Assert on observable behavior (DOM output, returned values).

## On-Demand References

| Detail | Serena Memory |
|-|-|
| Hook/registry test templates | `test_templates_advanced` |
| Component behavior test template | `test_templates_advanced` |

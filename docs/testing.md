# Testing Guide for LLM Coding Agents

**Purpose**: Instructions for writing and running tests in this animation library.

**Tech Stack**: Vitest 3 (unit/component) + Playwright (E2E) + Testing Library + jsdom

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

```
src/
├── __tests__/                        # PUT feature/domain tests HERE
│   ├── allAnimations.smoke.test.tsx  # Smoke tests for all animations
│   ├── registryConsistency.test.tsx  # Registry validation
│   ├── hooks.useAnimations.test.tsx  # Hook tests
│   └── ui.animation-card.test.tsx    # UI component tests
└── components/
    └── ui/
        └── AnimationCard.test.tsx    # Co-located component tests (alternative)

tests/
└── e2e/                              # PUT Playwright E2E tests HERE
    └── animation-rendering.spec.ts
```

**Decision tree**:
- Testing a specific component? → Co-locate as `Component.test.tsx`
- Testing a feature/domain? → Put in `src/__tests__/`
- Testing user journeys in browser? → Put in `tests/e2e/`

---

## How to Write an Animation Test

### Smoke Test (Verify Rendering)

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

### Component Behavior Test

**Template** (testing AnimationCard with animation):
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { withAnimationCard, queryStage, advanceRaf } from '@/test/utils/animationTestUtils'
import { ComponentName } from '@/components/<category>/<group>/framer/ComponentName'

describe('<ComponentName>', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('triggers animation on render', () => {
    render(withAnimationCard(<ComponentName />, { id: 'group__variant' }))

    const stage = queryStage()
    expect(stage).toBeTruthy()
    expect(stage!.querySelector('[data-animation-id]')).toBeInTheDocument()
  })

  it('replays animation when replay button clicked', async () => {
    render(withAnimationCard(<ComponentName />, { id: 'group__variant' }))

    const prevStage = queryStage()!
    screen.getByRole('button', { name: /replay/i }).click()

    const newStage = queryStage()
    expect(newStage).not.toBe(prevStage) // Component remounted
  })
})
```

### Hook Test

**Template**:
```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAnimations } from '@/hooks/useAnimations'

describe('useAnimations', () => {
  it('loads categories from registry', async () => {
    const { result } = renderHook(() => useAnimations())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.categories).toBeDefined()
    expect(result.current.categories.length).toBeGreaterThan(0)
  })
})
```

### Registry Consistency Test

**Template**:
```typescript
import { describe, it, expect } from 'vitest'
import { categories, buildRegistryFromCategories } from '@/components/animationRegistry'

describe('Animation Registry', () => {
  it('has unique animation IDs', () => {
    const registry = buildRegistryFromCategories()
    const ids = Object.keys(registry)
    const uniqueIds = new Set(ids)

    expect(ids.length).toBe(uniqueIds.size)
  })

  it('all animations have required metadata', () => {
    Object.values(categories).forEach((cat) => {
      Object.values(cat.groups).forEach((group) => {
        Object.entries(group.framer).forEach(([id, { metadata }]) => {
          expect(metadata.id).toBe(id)
          expect(metadata.title).toBeTruthy()
          expect(metadata.description).toBeTruthy()
          expect(Array.isArray(metadata.tags)).toBe(true)
        })
      })
    })
  })
})
```

---

## How to Write E2E Tests

**Template** (`tests/e2e/<feature>.spec.ts`):
```typescript
import { test, expect } from '@playwright/test'

test.describe('Animation Gallery', () => {
  test('displays categories and animations', async ({ page }) => {
    await page.goto('/')

    // Wait for content
    await expect(page.locator('[data-animation-id]').first()).toBeVisible()

    // Verify category exists
    await expect(page.getByText('Dialog & Modal Animations')).toBeVisible()
  })

  test('replays animation when clicking replay', async ({ page }) => {
    await page.goto('/')

    const card = page.locator('[data-animation-id="modal-base__scale-gentle-pop"]').first()
    await card.scrollIntoViewIfNeeded()

    const replayButton = page.locator('[data-role="replay"]').first()
    await replayButton.click()

    // Animation should replay (component remounts)
    await expect(card).toBeVisible()
  })
})
```

---

## Test Utilities

Use the provided test utilities from `@/test/utils/animationTestUtils`:

```typescript
import { withAnimationCard, queryStage, advanceRaf } from '@/test/utils/animationTestUtils'

// Wrap animation in AnimationCard
withAnimationCard(<Component />, { id: 'test-id', title: 'Test', description: 'Desc' })

// Query the .pf-demo-stage element
const stage = queryStage()

// Advance fake timers for animation testing
await advanceRaf(600) // Advance 600ms
```

---

## Memory Safety Rules

**CRITICAL**: Max 4 test workers in parallel. Do NOT change `maxWorkers` in vitest.config.ts.

**DO**:
- Use `pool: 'threads'` (memory-efficient)
- Call `cleanup()` from @testing-library/react in afterEach
- Process data in batches if > 100 items

**DON'T**:
- Generate 1000+ data points in single test
- Forget to cleanup timers/listeners
- Run tests in watch mode in CI

---

## Test Naming Conventions

| Type | File Pattern | Example |
|------|--------------|---------|
| Smoke tests | `<group>.smoke.test.tsx` | `modal-base.smoke.test.tsx` |
| Component tests | `<Component>.test.tsx` | `AnimationCard.test.tsx` |
| Feature tests | `<feature>.test.tsx` | `registryConsistency.test.tsx` |
| Hook tests | `hooks.<hookName>.test.tsx` | `hooks.useAnimations.test.tsx` |
| E2E tests | `<feature>.spec.ts` | `animation-rendering.spec.ts` |

---

## Common Mistakes

❌ **Don't**: Test animation frame values (too brittle, changes with timing)
✅ **Do**: Test start state, end state, or just "renders without crashing"

❌ **Don't**: Use relative imports in tests
✅ **Do**: Use `@/` alias: `import X from '@/components/X'`

❌ **Don't**: Write tests that only check default values exist
✅ **Do**: Write tests that verify actual functionality and behavior

❌ **Don't**: Run `npm run test:watch` in automated workflows
✅ **Do**: Run `npm test` for single-run execution

❌ **Don't**: Mock everything - test real integrations where possible
✅ **Do**: Mock browser APIs (IntersectionObserver, ResizeObserver) that don't exist in jsdom

❌ **Don't**: Skip the `Suspense` wrapper for lazy-loaded components
✅ **Do**: Wrap lazy components in `<Suspense>` with fallback

❌ **Don't**: Forget to call `jest.useRealTimers()` in afterEach
✅ **Do**: Always cleanup fake timers to prevent test pollution

❌ **Don't**: Assert on implementation details (internal state, private methods)
✅ **Do**: Assert on observable behavior (DOM output, returned values)

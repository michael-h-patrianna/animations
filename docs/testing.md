# Testing Guide for LLM Coding Agents

**Purpose**: This document teaches you how to write and run tests in the animations project.

**Tech Stack**: Vitest 3 (unit/component tests) + Playwright (E2E tests) + Testing Library + jsdom

---

## Testing Principles

### 1. 100% Test Coverage Required
**Rule**: All new features must have comprehensive test coverage. Tests are not optional.

**Coverage Requirements**:
- Unit tests for all utilities, services, hooks
- Component tests for UI components
- Smoke tests for all animation components
- E2E tests for critical user journeys

### 2. Tests Must Be Meaningful
**Rule**: Tests should verify actual functionality, not just rendering.

❌ **Bad Test**: Only checks if component renders
```typescript
it('renders', () => {
  render(<Component />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

✅ **Good Test**: Verifies behavior and logic
```typescript
it('triggers animation replay when replay button clicked', async () => {
  render(<AnimationCard {...props} />)
  const replayButton = screen.getByRole('button', { name: /replay/i })

  await user.click(replayButton)

  expect(screen.getByTestId('animation')).toHaveAttribute('key', '1')
})
```

### 3. Test Safety (Critical)
**Rule**: Never run tests in watch mode in automated workflows. Watch mode is only for interactive debugging.

**Pattern**:
```bash
# ✅ Correct: CI/automation
npm test  # Runs once and exits

# ❌ Wrong: CI/automation
npm run test:watch  # Hangs forever

# ✅ Correct: Local development (with explicit permission)
ALLOW_VITEST_WATCH=1 npm run test:watch
```

---

## Unit Testing (Vitest)

### File Locations
```
src/
├─ __tests__/                      # Domain/feature tests
│  ├─ allAnimations.smoke.test.tsx # Smoke tests
│  ├─ registryConsistency.test.tsx # Registry validation
│  ├─ hooks.useAnimations.test.tsx # Hook tests
│  └─ ui.animation-card.test.tsx   # UI component tests
└─ components/
   └─ ui/
      └─ AnimationCard.test.tsx    # Co-located component tests
```

**Pattern**: Use `__tests__/` for feature tests, co-locate with components for component-specific tests.

### Test File Naming
- Pattern: `{feature}.test.tsx` or `{component}.test.tsx`
- Use descriptive names: `registryConsistency.test.tsx`, not `test1.tsx`

### Unit Test Template
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('ComponentName', () => {
  it('should [describe expected behavior]', async () => {
    // Arrange: Set up test data and render
    const user = userEvent.setup()
    const props = { /* test props */ }
    render(<ComponentName {...props} />)

    // Act: Perform user interaction
    await user.click(screen.getByRole('button'))

    // Assert: Verify outcome
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Hook Testing Pattern
```typescript
import { renderHook, waitFor } from '@testing-library/react'

describe('useAnimations', () => {
  it('should load categories', async () => {
    const { result } = renderHook(() => useAnimations())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.categories).toHaveLength(5)
    expect(result.current.categories[0].id).toBe('base')
  })
})
```

### Service Testing Pattern
```typescript
import { animationDataService } from '@/services/animationData'

describe('animationDataService', () => {
  it('should load all animations', async () => {
    const catalog = await animationDataService.loadAnimations()

    expect(catalog).toBeInstanceOf(Array)
    expect(catalog.length).toBeGreaterThan(0)
    expect(catalog[0]).toHaveProperty('id')
    expect(catalog[0]).toHaveProperty('title')
  })
})
```

### Smoke Test Pattern
**Purpose**: Verify all animations render without throwing errors.

```typescript
import { act, render } from '@testing-library/react'
import { buildRegistryFromCategories } from '@/components/animationRegistry'

describe('Animation Smoke Tests', () => {
  it('renders all animations without errors', async () => {
    const registry = buildRegistryFromCategories()

    for (const [id, Component] of Object.entries(registry)) {
      try {
        await act(async () => {
          const { unmount } = render(<Component />)
          await Promise.resolve()  // Flush microtasks
          unmount()
        })
      } catch (e) {
        throw new Error(`Animation "${id}" failed: ${(e as Error).message}`)
      }
    }
  })
})
```

---

## Component Testing (Vitest + Testing Library)

### Component Test Template
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('AnimationCard', () => {
  const defaultProps = {
    animation: {
      id: 'test__animation',
      title: 'Test Animation',
      description: 'Test description',
      categoryId: 'base',
      groupId: 'test',
      tags: ['test'],
    },
    Component: () => <div data-testid="animation">Test</div>,
  }

  it('displays animation title and description', () => {
    render(<AnimationCard {...defaultProps} />)

    expect(screen.getByText('Test Animation')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('replays animation when replay button clicked', async () => {
    const user = userEvent.setup()
    render(<AnimationCard {...defaultProps} />)

    const replayButton = screen.getByRole('button', { name: /replay/i })
    await user.click(replayButton)

    // Verify replay behavior
    expect(screen.getByTestId('animation')).toBeInTheDocument()
  })
})
```

### Testing Async Behavior
```typescript
it('loads data asynchronously', async () => {
  render(<Component />)

  // Wait for loading state to finish
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  // Verify loaded data
  expect(screen.getByText('Loaded Data')).toBeInTheDocument()
})
```

### Testing User Interactions
```typescript
it('handles user input', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()

  render(<Form onSubmit={onSubmit} />)

  await user.type(screen.getByRole('textbox'), 'test input')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(onSubmit).toHaveBeenCalledWith({ value: 'test input' })
})
```

---

## E2E Testing (Playwright)

### File Locations
```
tests/
└─ e2e/
   ├─ homepage.spec.ts                  # Homepage tests
   ├─ category-navigation.spec.ts       # Navigation tests
   ├─ animation-rendering.spec.ts       # Animation rendering
   ├─ search-and-filter.spec.ts         # Search functionality
   └─ modal-base-slide-down-soft-css.spec.ts  # Specific animation
```

**Pattern**: Name tests after features or specific animations being tested.

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test'

test('feature name', async ({ page }) => {
  // Navigate to page
  await page.goto('/')

  // Wait for critical element
  await page.waitForSelector('.pf-sidebar', { timeout: 10000 })

  // Interact with page
  await page.click('.pf-sidebar__link--group:first-child')

  // Assert outcome
  await expect(page.locator('.pf-card').first()).toBeVisible()
})
```

### Testing Animations Visually
```typescript
test('animation renders correctly', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.pf-sidebar', { timeout: 10000 })

  // Find animation by data attribute
  const animation = page.locator('[data-animation-id="modal-base__scale-gentle-pop"]')
  await expect(animation).toBeVisible()

  // Click replay button
  const replayButton = animation.locator('[data-role="replay"]')
  await replayButton.click()

  // Verify animation still visible after replay
  await expect(animation).toBeVisible()
})
```

### Testing Navigation
```typescript
test('sidebar navigation scrolls to group', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.pf-sidebar', { timeout: 10000 })

  // Click second group in sidebar
  const groupLinks = page.locator('.pf-sidebar__link--group')
  await groupLinks.nth(1).click()

  // Wait for scroll animation
  await page.waitForTimeout(500)

  // Verify content changed
  const cards = page.locator('.pf-card[data-animation-id]')
  await expect(cards.first()).toBeVisible()
})
```

### Testing Search/Filter
```typescript
test('search filters animations', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.pf-sidebar', { timeout: 10000 })

  // Type in search box
  const searchBox = page.getByRole('textbox', { name: /search/i })
  await searchBox.fill('modal')

  // Verify filtered results
  const cards = page.locator('.pf-card[data-animation-id]')
  await expect(cards).toHaveCount(10)  // Adjust expected count
})
```

### Debugging E2E Tests
```typescript
// Run test in headed mode (see browser)
npm run test:e2e:headed

// Take screenshot on failure
test('feature', async ({ page }) => {
  try {
    // test code
  } catch (error) {
    await page.screenshot({ path: 'failure.png' })
    throw error
  }
})

// Use test.only for focused debugging
test.only('specific test', async ({ page }) => {
  // only this test runs
})
```

---

## Running Tests

### Unit/Component Tests (Vitest)
```bash
# Run all tests once
npm test

# Run with coverage
npm run test:coverage

# Watch mode (LOCAL DEV ONLY, requires ALLOW_VITEST_WATCH=1)
ALLOW_VITEST_WATCH=1 npm run test:watch

# Cleanup before tests (automatic with pretest script)
npm run pretest
```

### E2E Tests (Playwright)
```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

### Full Test Suite
```bash
# Run both unit and E2E tests
npm test && npm run test:e2e
```

---

## Test Configuration

### Vitest Config
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/e2e/**',  // Exclude Playwright tests
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'src/setupTests.ts',
        '**/*.test.{ts,tsx}',
        'scripts/**',
      ],
    },
  },
})
```

### Playwright Config
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
})
```

---

## Common Testing Patterns

### Pattern: Testing Registry Consistency
```typescript
it('ensures all animations have unique IDs', () => {
  const registry = buildRegistryFromCategories()
  const ids = Object.keys(registry)
  const uniqueIds = new Set(ids)

  expect(ids.length).toBe(uniqueIds.size)
})

it('ensures all animation IDs follow naming convention', () => {
  const registry = buildRegistryFromCategories()

  for (const id of Object.keys(registry)) {
    // Should be: group__variant-name
    expect(id).toMatch(/^[a-z-]+__[a-z-]+(-[a-z]+)*$/)
  }
})
```

### Pattern: Testing Data Transformations
```typescript
it('transforms category exports to UI format', () => {
  const catalog = buildCatalogFromCategories()

  expect(catalog).toBeInstanceOf(Array)
  expect(catalog[0]).toHaveProperty('id')
  expect(catalog[0]).toHaveProperty('title')
  expect(catalog[0]).toHaveProperty('groups')
  expect(catalog[0].groups[0]).toHaveProperty('animations')
})
```

### Pattern: Testing Error Boundaries
```typescript
it('catches errors in animation components', () => {
  const ThrowError = () => {
    throw new Error('Test error')
  }

  render(
    <ErrorBoundary fallback={<div>Error caught</div>}>
      <ThrowError />
    </ErrorBoundary>
  )

  expect(screen.getByText('Error caught')).toBeInTheDocument()
})
```

---

## Test Coverage Targets

### Required Coverage
- **Utilities**: 100%
- **Services**: 100%
- **Hooks**: 100%
- **UI Components**: 90%+
- **Animation Components**: Smoke test coverage (renders without error)

### Checking Coverage
```bash
npm run test:coverage

# View coverage report
open coverage/index.html
```

---

## Common Mistakes

❌ **Don't**: Run `npm run test:watch` in CI/automation
✅ **Do**: Use `npm test` for automated workflows

❌ **Don't**: Test only that component renders
✅ **Do**: Test actual behavior and user interactions

❌ **Don't**: Use arbitrary timeouts
✅ **Do**: Use `waitFor` and proper assertions

❌ **Don't**: Test implementation details
✅ **Do**: Test user-visible behavior

❌ **Don't**: Skip E2E tests for animations
✅ **Do**: Verify animations render visually in Playwright

❌ **Don't**: Use `test.skip` to ignore failing tests
✅ **Do**: Fix the root cause or remove the test

❌ **Don't**: Write flaky tests with race conditions
✅ **Do**: Use proper async handling and `waitFor`

---

## Debugging Tests

### Vitest Debugging
```bash
# Run single test file
npm test -- AnimationCard.test.tsx

# Run tests matching pattern
npm test -- --grep "animation replay"

# Show detailed error output
npm test -- --reporter=verbose
```

### Playwright Debugging
```bash
# Run in headed mode (see browser)
npm run test:e2e:headed

# Run single test file
npx playwright test tests/e2e/homepage.spec.ts

# Debug mode with browser DevTools
npx playwright test --debug

# View trace
npx playwright show-trace trace.zip
```

### Common Issues

**Issue**: Tests hang forever
**Solution**: Check for missing `await` or `waitFor`

**Issue**: "Element not found"
**Solution**: Add proper wait conditions (`waitForSelector`)

**Issue**: Flaky tests
**Solution**: Use `waitFor` instead of fixed timeouts

**Issue**: Mock not working
**Solution**: Ensure mock is setup before import

---

## Quick Reference

### Vitest Commands
| Command | Description |
|---------|-------------|
| `npm test` | Run all unit tests once |
| `npm run test:coverage` | Run with coverage report |
| `npm run pretest` | Cleanup before tests |

### Playwright Commands
| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:headed` | Run with visible browser |
| `npm run test:e2e:report` | View test report |

### Testing Library Queries (Priority Order)
1. `getByRole` - Accessible queries (preferred)
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Form inputs
4. `getByText` - Non-interactive text
5. `getByTestId` - Last resort

### Vitest Assertions
```typescript
expect(value).toBe(expected)            // Strict equality
expect(value).toEqual(expected)         // Deep equality
expect(value).toBeTruthy()              // Truthy check
expect(value).toHaveLength(5)           // Array/string length
expect(fn).toHaveBeenCalled()           // Mock called
expect(fn).toHaveBeenCalledWith(args)   // Mock called with args
```

### Playwright Assertions
```typescript
await expect(locator).toBeVisible()
await expect(locator).toHaveText('text')
await expect(locator).toHaveAttribute('attr', 'value')
await expect(page).toHaveURL('url')
await expect(page).toHaveTitle('title')
```

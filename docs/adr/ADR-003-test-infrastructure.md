# ADR-003: Test Infrastructure with Vitest and Playwright

**Status**: Accepted

**Date**: 2024-2025 (retroactive documentation)

## Context

The Animation Catalog requires comprehensive testing to ensure:

1. **Component Correctness**: Animations render and behave as expected
2. **Performance**: No regressions in animation performance
3. **Determinism**: Tests produce consistent results across runs
4. **Visual Quality**: Animations look correct in browsers
5. **Accessibility**: Interactive animations are keyboard/screen-reader accessible
6. **Fast Feedback**: Tests run quickly during development

Testing needs:

- **Unit Tests**: Component logic, hooks, services
- **Integration Tests**: Component interactions, state management
- **E2E Tests**: Full user flows, visual validation
- **Performance Tests**: Animation FPS, bundle size

Test frameworks considered:

1. **Jest + React Testing Library**: Industry standard
2. **Vitest + Testing Library**: Modern, faster, Vite-native
3. **Cypress**: Popular E2E framework
4. **Playwright**: Modern E2E with better features

## Decision

We chose a **two-tier testing strategy**:

### Tier 1: Unit & Integration Tests with Vitest

- **Vitest** as the test runner (instead of Jest)
- **React Testing Library** for component testing
- **`happy-dom` + shared setup shims** for stable browser-like tests

**Why Vitest over Jest:**

- Native Vite integration (faster, no config duplication)
- ES modules support out of the box
- Faster test execution (parallel by default)
- Compatible Jest API (easy migration)
- Better TypeScript support

### Tier 2: E2E Tests with Playwright

- **Playwright** for end-to-end browser testing
- Structural, layout, and accessibility validation for interactive flows
- Chromium-only execution in the current config
- HTML reports and retry traces for debugging failures

**Why Playwright over Cypress:**

- Optional multi-browser support if future coverage justifies the CI cost
- Better API for async operations
- Built-in test artifacts (reports, traces, screenshots when explicitly captured)
- Faster execution
- Better debugging with Playwright Inspector

## Implementation

### Directory Structure

```
src/
  __tests__/               # Unit & integration tests
    *.test.tsx
  components/
    **/*.test.tsx          # Co-located component tests

tests/
  e2e/                     # Playwright E2E tests
    *.spec.ts

scripts/
  run-vitest.mjs           # Thin Vitest CLI wrapper
  run-playwright.mjs       # Thin Playwright CLI wrapper
  cleanup-vitest.mjs       # Kill stray Vitest workers before single-run commands
```

### Test Commands

```bash
npm test                  # Run all Vitest tests (single run; cleanup runs first)
npm run test:e2e          # Run Playwright tests (headless Chromium)
npm run test:e2e:headed   # Run Playwright with visible Chromium
npm run type-check        # TypeScript validation
```

### Test Stability

The current tooling does **not** inject special deterministic environment variables from the wrapper scripts. Stability comes from a smaller set of explicit controls:

- `cleanup-vitest.mjs` runs before `npm test`, `npm run test:watch`, and `npm run test:coverage` to remove lingering Vitest workers.
- `vitest.config.ts` uses `happy-dom` and `src/setupTests.ts` to install consistent DOM API shims such as `IntersectionObserver`, `ResizeObserver`, and Web Animations fallbacks.
- Timing-sensitive unit tests opt into `vi.useFakeTimers()` rather than relying on global clock overrides.
- Playwright uses stable DOM/layout assertions, CI-only retries, and first-retry traces instead of a multi-browser matrix or screenshot diffs by default.

**Benefits:**

- More stable local runs
- Shared browser shims reduce environment drift across component tests
- Timing-sensitive tests stay explicit about the clocks and mocks they control
- CI retries capture traces for easier failure analysis

### Key Configurations

**`vitest.config.ts`:**

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/setupTests.ts',
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
    },
  },
})
```

**`playwright.config.ts`:**

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Consequences

### Positive

- **Fast Feedback**: Vitest is 2-3x faster than Jest for our test suite
- **Vite Native**: No config duplication, same build pipeline
- **Better DX**: Hot reload for tests, watch mode with UI
- **Stable Component Tests**: `happy-dom` + shared setup mocks cover the browser APIs our components rely on
- **Lower CI Cost**: Chromium-only Playwright keeps browser coverage focused and faster
- **Debuggable Failures**: Playwright HTML reports and retry traces aid investigation
- **CI Integration**: Both tools have excellent GitHub Actions support

### Negative

- **Learning Curve**: Team needs to learn Playwright (different from Cypress)
- **No Global Determinism Switch**: Tests that depend on time or randomness must control those inputs themselves
- **Single-Browser E2E Coverage**: Firefox/WebKit regressions are not caught by default
- **Test Maintenance**: E2E tests can be brittle with DOM changes
- **Performance Overhead**: Full browser tests are slower than unit tests
- **Vitest Memory Leaks**: Historical issue requiring cleanup script

### Mitigation Strategies

1. **Cleanup Script**: `cleanup-vitest.mjs` kills stray workers
2. **Thin Wrappers**: `run-vitest.mjs` and `run-playwright.mjs` keep npm entrypoints consistent while forwarding CLI args unchanged
3. **Test-Level Control**: Use fake timers and targeted mocks for timing-sensitive cases
4. **Retry Logic**: Playwright retries only on CI and captures first-retry traces
5. **Selective Browser Scope**: Revisit Firefox/WebKit only when a real bug class justifies the extra CI cost

## Testing Strategy

### What to Unit Test

- ✅ Component rendering with Testing Library
- ✅ Hook logic (`useAnimations`, etc.)
- ✅ Service functions (`animationData`, `preload`)
- ✅ Utility functions
- ✅ State machine transitions (if implemented)

### What to E2E Test

- ✅ Full navigation flows (group switching, URL sync)
- ✅ Structural parity, layout, and containment checks for animations
- ✅ Drawer interactions
- ✅ Error boundary fallback
- ✅ Responsive layouts
- ✅ Accessibility behaviors in preview and navigation flows

### What NOT to Test

- ❌ Third-party library internals (Framer Motion)
- ❌ Pixel-perfect screenshot diffs for animated content by default
- ❌ Browser-specific quirks outside the configured Chromium target unless we intentionally expand the project matrix

## Alternatives Not Chosen

### Jest

**Pros**: Industry standard, huge ecosystem
**Cons**: Slower, requires Babel config, worse Vite integration

### Cypress

**Pros**: Great DX, popular, good docs
**Cons**: Chrome-only, slower, limited multi-window support

### Storybook + Chromatic

**Pros**: Visual testing, component library
**Cons**: Overhead for simple catalog, costly for commercial use

## Future Enhancements

1. **Performance Testing**: Add Lighthouse CI for performance budgets
2. **Visual Regression**: Integrate Percy or Chromatic for screenshot diffing
3. **Coverage Goals**: Target 80%+ unit test coverage
4. **Mutation Testing**: Use Stryker for test quality validation
5. **Fake Timers**: Use `vi.useFakeTimers()` for timer-based animations

## References

- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration
- `scripts/run-vitest.mjs` - Thin Vitest CLI wrapper
- `scripts/run-playwright.mjs` - Thin Playwright CLI wrapper
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

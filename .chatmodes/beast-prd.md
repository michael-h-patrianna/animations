Problem

Increase unit test coverage to 100% and fix failing tests.

Users / JTBD

- Repo maintainer wants confidence and green CI.

Goals / Success

- Jest coverage 100% statements/branches/functions/lines.
- All tests pass locally.

Scope

- In: Adjust tests for determinism, add smoke tests; minor code typings only if needed.
- Out: Major refactors or behavior changes.

Functional

- Add tests that render components and assert minimal DOM presence to execute code paths.
- Stabilize flaky timing tests.

Non-functional

- Fast tests, deterministic (fake timers, mocks).

Acceptance criteria

- Running `npm run test:coverage` reports 100% across all metrics.
- No failing tests.
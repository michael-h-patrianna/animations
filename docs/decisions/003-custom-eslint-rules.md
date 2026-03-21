# ADR-003: Custom ESLint Rules for Animation Portability

**Status:** Accepted
**Date:** 2026-02

## Context

Animation components must conform to portability constraints (no blur, no radial gradients, no viewport units, no CSS animations in Framer variants). These constraints are non-obvious and easily violated by contributors.

## Decision

Encode portability constraints as custom ESLint rules in `eslint-rules/`. Rules are grouped by concern:

- **animation-rules.js** — Portability: `no-blur-animation`, `no-radial-angular-gradient`, `no-viewport-units`, `no-css-animations-in-motion`, `no-non-portable-styles`, `no-svg-in-motion`, `no-css-grid-in-motion`, `no-calc-in-motion`
- **extra-rules.js** — Quality: `no-shallow-assertions`, `require-data-testid`, `require-data-animation-id`
- **testing-rules.js** — E2E: `no-class-id-locators`

## Consequences

- **Positive:** Violations caught at lint time, not in code review or production.
- **Positive:** Rules are scoped to specific file patterns (e.g., `framer/**` gets stricter rules than `css/**`).
- **Negative:** Custom rules require maintenance. Mitigated by documenting the "why" in eslint.config.js comments.
- **Enforced by:** Pre-commit hook (`lint-staged`), CI (`npm run lint`).

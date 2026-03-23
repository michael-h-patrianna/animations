# ADR-008: Lint Config Integrity Enforcement

**Status**: Accepted

**Date**: 2025

## Context

AI coding agents and developers under time pressure tend to resolve lint violations by:
1. Downgrading severity from `error` to `warning` in Stylelint configs
2. Scattering inline `eslint-disable` suppressions across files
3. Disabling rules globally instead of fixing the underlying code

These actions pass CI but degrade the codebase over time, turning the linter from a quality gate into a suggestion engine.

## Decision

### Stylelint: enforceNoWarnings()

The Stylelint config (`stylelint.config.js`) wraps the entire config in `enforceNoWarnings()`, a function that throws at config load time if any rule has `severity: "warning"`. This makes it impossible to downgrade a rule to warning — you must either fix the violation, disable the rule entirely (with a comment explaining why), or adjust the rule's parameters.

### ESLint: Inline suppression audit

The ESLint config uses file-level overrides (eslint.config.js) to handle rule exceptions by file category rather than inline suppressions. The codebase has only 4 inline `eslint-disable-line` comments and 2 `eslint-disable-next-line` comments, each with an explanation.

### Custom anti-shallow-assertion rule

The `no-shallow-assertions` ESLint rule (eslint-rules/extra-rules.js) prevents tests from using existence-only matchers (`toBeDefined`, `toBeTruthy`, `.not.toBeNull()`, `typeof` checks, etc.) that pass without verifying correctness.

## Consequences

**Easier:**
- Maintaining quality: lint violations must be fixed, not suppressed
- Onboarding: new contributors cannot silently degrade lint rules
- AI-agent safety: agents cannot downgrade lint severity to make code pass

**Harder:**
- Emergency fixes: cannot quickly suppress a new rule that fires on existing code
- Migration: adding a new lint rule requires fixing all existing violations upfront, or using config-level overrides with documented rationale

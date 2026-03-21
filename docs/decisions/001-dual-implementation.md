# ADR-001: Dual CSS/Framer Implementation Per Animation

**Status:** Accepted
**Date:** 2026-02

## Context

The animation library needs to support both web and React Native targets. CSS animations are native to web but unavailable in React Native. Framer Motion (via `motion`) works on both platforms but adds bundle weight and runtime cost.

## Decision

Every animation is implemented twice: once with CSS (`css/` folder) and once with Framer Motion (`framer/` folder). The catalog UI switches between them via the CodeMode toggle.

## Consequences

- **Positive:** React Native portability without sacrificing web performance. CSS variants use GPU-accelerated animations. Framer variants use `motion/react-m` for tree-shaking.
- **Positive:** Side-by-side comparison lets users pick the implementation that fits their stack.
- **Negative:** Double the component count (~2x maintenance). Mitigated by co-located metadata and `buildGroupExport` automation.
- **Enforced by:** ESLint rules `no-css-animations-in-motion`, `no-non-portable-styles`, `no-svg-in-motion` ensure Framer variants stay React Native–compatible.

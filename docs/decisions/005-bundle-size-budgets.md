# ADR-005: Bundle Size Budgets

**Status:** Accepted
**Date:** 2026-03

## Context

As a marketplace animation library, bundle size directly impacts customer adoption. Vite's manual chunk splitting separates vendor code, but without explicit budgets, size regressions go unnoticed.

## Decision

A budget checker script (`scripts/check-bundle-size.mjs`) validates main chunks after each build:

| Chunk                    | Budget | Baseline (2026-03) |
| ------------------------ | ------ | ------------------ |
| `index-*.js` (app entry) | 400 KB | ~300 KB            |
| `react-vendor-*.js`      | 300 KB | ~221 KB            |
| `motion-*.js`            | 150 KB | ~84 KB             |
| `vendor-*.js`            | 600 KB | ~430 KB            |
| `index-*.css`            | 300 KB | ~230 KB            |

Budgets are uncompressed sizes. Real transfer sizes are ~30% of these (gzip).

## Consequences

- **Positive:** Size regressions are caught in CI before merge.
- **Positive:** Budgets have ~30% headroom above baseline, allowing reasonable growth without constant budget bumps.
- **Negative:** Animation components are lazy-loaded as individual chunks and not budgeted — their combined size is large but never loaded at once. Consider adding a per-chunk budget if any single animation exceeds 50 KB.
- **Enforced by:** CI step `npm run build:check-size` after build.

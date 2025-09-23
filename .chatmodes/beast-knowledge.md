Assumptions

- Tests can be adjusted to be deterministic (fake timers, deterministic random).
- Hitting 100% coverage may require broad smoke tests; acceptable since it's a demo repo.

Decisions

- Excluded test files from app tsbuild to avoid type clashes.
- Added ambient types making Element.animate/getAnimations non-optional.

Context notes

- Current failures: zoomed progress width check timing; x2 multiplier ambiguous text.
- Coverage current ~91% statements; gaps primarily in components not directly tested.

Sources/links

- Jest + Testing Library best practices for async UI and fake timers.
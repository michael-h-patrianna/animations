2026-02-20: Cleaned 14 CSS files with truncated 4-digit custom-property color values introduced by color-fix scripts. Removed dead truncated declarations (`--...: #xxxx`) and resolved duplicate custom properties in ProgressBarsMilestoneUnlock* and ProgressBarsOrbitRing* (both css + framer). Verified with ripgrep: no remaining `--var: #xxxx` declarations under `src/components`.

Priority color fixes:
- Milestone unlock: kept locked border token `--...-border-e1: #cbd5e1` and unlocked border token `--...-border-0b: #f59e0b`; removed duplicated/conflicting border declarations.
- Orbit ring: normalized track/fill/marker tokens to a single set: `--...bg-1-eb: #e5e7eb`, `--...bg-1-f6: #3b82f6`, `--...bg-2-af: #9ca3af`, `--...bg-2-d4: #06b6d4`.

Verification commands used:
- `rg -n -P "--[a-zA-Z0-9_-]+:\s*#[0-9a-fA-F]{4}(?![0-9a-fA-F])" src/components`
- `npx stylelint <touched files>`
- `npx vite build`

Notes:
- Targeted stylelint still reports pre-existing rule violations in touched files (hardcoded colors/radial-gradient/hex-length/single-line declarations/empty blocks). Build passes.
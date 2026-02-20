# Completion checklist
- Read impacted code paths before editing (no guessing).
- Verify with concrete commands before claiming success:
  - Prefer `npm run lint` and relevant targeted checks.
  - Run `npm run build` unless blocked by known unrelated issues.
  - For UI/theme changes, inspect generated CSS/token output where possible.
- Keep scope tight; do not revert unrelated dirty-worktree changes.
- Provide findings with file:line references ordered by severity.
- Call out residual risks or blockers explicitly (e.g., pre-existing TypeScript failures).
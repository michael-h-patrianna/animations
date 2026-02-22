# App navigation callback contract (2026-02-22)
- Bug observed: `TypeError: navigateToGroup is not a function` from `useGroupInitialization` effect.
- Root cause: `src/App.tsx` invoked `useGroupInitialization` without passing `navigateToGroup`, while hook requires and calls it for canonical redirects.
- Fix pattern: define `navigateToGroup` with React Router `useNavigate` and pass into hook; also reuse same callback for group selection navigation to keep SPA routing behavior.
- Verification: `src/__tests__/hooks.useGroupInitialization.test.tsx` passes; routing test case `navigates to selected group via router without full-page reload` passes.
- Note: repository currently has unrelated type-check/test failures around `AppSidebar` `codeMode` expectations and code-mode routing tests.
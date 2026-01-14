# Development Guide for LLM Coding Agents

**Purpose**: Instructions for setup, running, building, and deploying this animation library.

**Tech Stack**: Vite 7 + React 19 + TypeScript 5.8 + Tailwind CSS + Vercel

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## Key Commands

| Task | Command | Notes |
|------|---------|-------|
| Dev server | `npm run dev` | Hot reload at localhost:5173 |
| Type check | `npm run type-check` | TypeScript validation only |
| Lint | `npm run lint` | ESLint check |
| Lint fix | `npm run lint:fix` | Auto-fix lint issues |
| Format | `npm run format` | Prettier formatting |
| Format check | `npm run format:check` | Check formatting only |
| Unit tests | `npm test` | Single run, exits |
| Test coverage | `npm run test:coverage` | With coverage report |
| E2E tests | `npm run test:e2e` | Playwright headless |
| E2E headed | `npm run test:e2e:headed` | Visible browser |
| Build | `npm run build` | Production build to `dist/` |
| Preview | `npm run preview` | Serve production build |
| Analyze | `npm run build:analyze` | Bundle analysis |

---

## Development Workflow

### Starting Work

```bash
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Start dev server
npm run dev
```

### Before Committing

```bash
# Run all checks
npm run type-check && npm run lint && npm test

# Or run individually to debug issues
npm run type-check   # Check types first
npm run lint         # Then lint
npm test             # Then tests
```

### Building for Production

```bash
# Build
npm run build

# Preview locally
npm run preview
```

---

## Import Aliases

Use these aliases instead of relative imports:

| Alias | Path |
|-------|------|
| `@/` | `src/` |
| `@/components` | `src/components/` |
| `@/hooks` | `src/hooks/` |
| `@/utils` | `src/utils/` |
| `@/types` | `src/types/` |
| `@/assets` | `src/assets/` |

**Example**:
```typescript
// ✅ Correct
import { AnimationCard } from '@/components/ui/AnimationCard'

// ❌ Avoid
import { AnimationCard } from '../../../components/ui/AnimationCard'
```

---

## Troubleshooting

### "Module not found" Error

**Cause**: Missing import in index.ts or circular dependency
**Fix**:
1. Check the import path uses `@/` alias
2. Verify the component is exported from group/category index.ts
3. Check for circular imports between files

### "Metadata missing" Error

**Cause**: Component's `.meta.ts` file missing or not imported
**Fix**:
1. Verify `ComponentName.meta.ts` exists next to component
2. Check metadata is imported in group `index.ts`
3. Ensure metadata id matches `data-animation-id` attribute

### Build Fails with Type Errors

**Cause**: TypeScript strict mode catches issues
**Fix**:
```bash
# Run type check to see all errors
npm run type-check

# Common fixes:
# - Add explicit types to function parameters
# - Handle null/undefined cases
# - Import types with `import type { X }`
```

### Tests Hanging (Never Finish)

**Cause**: Watch mode running in CI, or leaked timers
**Fix**:
```bash
# Use single-run mode
npm test

# NOT watch mode
# npm run test:watch  # ❌ Don't use in automation
```

### E2E Tests Failing

**Cause**: Dev server not running or wrong port
**Fix**:
```bash
# Playwright auto-starts server, but verify:
# - Port 5173 is free
# - baseURL in playwright.config.ts matches

# Run with visible browser to debug
npm run test:e2e:headed
```

### "Maximum call stack exceeded" or Memory Issues

**Cause**: Circular imports or too many parallel workers
**Fix**:
1. Check for circular imports between index.ts files
2. Verify vitest.config.ts has `maxWorkers: 4` (max)
3. Look for recursive component rendering

---

## Project Structure Quick Reference

```
.
├── src/
│   ├── components/           # Animation components (category/group/tech)
│   │   ├── animationRegistry.ts  # Central registry
│   │   ├── ui/               # UI components
│   │   ├── base/             # Category: base effects
│   │   ├── dialogs/          # Category: dialog animations
│   │   ├── progress/         # Category: progress indicators
│   │   ├── realtime/         # Category: realtime updates
│   │   └── rewards/          # Category: reward effects
│   ├── services/             # Data services
│   ├── hooks/                # React hooks
│   ├── types/                # TypeScript types
│   ├── motion/               # Shared motion utilities
│   └── __tests__/            # Unit tests
├── tests/
│   └── e2e/                  # Playwright E2E tests
├── docs/                     # Documentation
├── public/                   # Static assets
└── dist/                     # Build output (gitignored)
```

---

## Deployment (Vercel)

### Auto-Deployment

Push to `main` branch triggers automatic deployment (if configured).

### Manual Deployment

```bash
# Deploy to production
npx vercel --prod

# Deploy preview
npx vercel
```

### Environment Variables

No required environment variables for basic deployment.

---

## Common Mistakes

❌ **Don't**: Use relative imports like `../../../components/`
✅ **Do**: Use `@/` alias: `@/components/ui/AnimationCard`

❌ **Don't**: Run `npm run test:watch` in CI/automated scripts
✅ **Do**: Run `npm test` for single-run execution

❌ **Don't**: Forget to run type check before committing
✅ **Do**: Run `npm run type-check && npm run lint && npm test`

❌ **Don't**: Commit without testing your changes render correctly
✅ **Do**: Run `npm run dev` and visually verify animations work

❌ **Don't**: Build without checking TypeScript first
✅ **Do**: Run `npm run type-check` before `npm run build`

❌ **Don't**: Leave the dev server running when running tests
✅ **Do**: Let test commands manage their own servers

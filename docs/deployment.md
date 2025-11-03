# Local Development Guide for LLM Coding Agents

**Purpose**: This document teaches you how to run the application locally and execute key commands.

**Tech Stack**: Vite 7 + React 19 + TypeScript 5.8 + npm

---

## Local Development Setup

### Prerequisites
```bash
# Required
- Node.js 18+ (check: node --version)
- npm 9+ (check: npm --version)
- Git (check: git --version)
```

### Step 1: Clone and Install
```bash
# Clone repository
git clone <repository-url>
cd animations

# Install dependencies
npm install
```

### Step 2: Start Development Server
```bash
# Start Vite dev server (hot reload enabled)
npm run dev

# Server will start at http://localhost:5173
```

---

## Running the Application

### Development Mode
```bash
# Start dev server with hot reload
npm run dev

# Access at: http://localhost:5173
# Changes auto-reload in browser
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Analysis
```bash
# Build with bundle analyzer
npm run build:analyze

# Opens visualizer showing bundle size breakdown
```

---

## Running Tests

### Unit Tests (Vitest)
```bash
# Run all tests once (CI mode)
npm test

# Run with coverage report
npm run test:coverage

# Cleanup test artifacts
npm run pretest

# Watch mode (LOCAL DEV ONLY - requires explicit permission)
ALLOW_VITEST_WATCH=1 npm run test:watch
```

### E2E Tests (Playwright)
```bash
# Run all E2E tests
npm run test:e2e

# Run with visible browser (debugging)
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

### Full Test Suite
```bash
# Run both unit and E2E tests
npm test && npm run test:e2e
```

---

## Code Quality Commands

### Linting
```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix
```

### Formatting
```bash
# Check code formatting
npm run format:check

# Format all files
npm run format
```

### Type Checking
```bash
# Run TypeScript type checker
npm run type-check
```

### Pre-Commit Checklist
```bash
# Run all checks before committing
npm run lint:fix && npm run format && npm run type-check && npm test
```

---

## Common Development Tasks

### Adding New Animation

**Step 1: Create Component Files**
```bash
# Navigate to group folder
cd src/components/dialogs/modal-base

# Create Framer Motion version
touch framer/ModalBaseNewAnimation.tsx
touch framer/ModalBaseNewAnimation.meta.ts

# OR create CSS version
touch css/ModalBaseNewAnimation.tsx
touch css/ModalBaseNewAnimation.meta.ts
touch css/ModalBaseNewAnimation.css
```

**Step 2: Implement Component**
```typescript
// framer/ModalBaseNewAnimation.tsx
import * as m from 'motion/react-m'

export function ModalBaseNewAnimation() {
  return (
    <m.div data-animation-id="modal-base__new-animation">
      {/* Animation implementation */}
    </m.div>
  )
}
```

**Step 3: Export Metadata**
```typescript
// framer/ModalBaseNewAnimation.meta.ts
import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-base__new-animation',
  title: 'New Animation',
  description: 'Description of animation behavior',
  tags: ['modal', 'new'],
  disableReplay: false,
}
```

**Step 4: Add to Group Index**
```typescript
// modal-base/index.ts
import { lazy } from 'react'
import { metadata as newAnimationMetadata } from './framer/ModalBaseNewAnimation.meta'

const ModalBaseNewAnimation = lazy(() =>
  import('./framer/ModalBaseNewAnimation').then(m => ({ default: m.ModalBaseNewAnimation }))
)

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    // ... existing animations
    'modal-base__new-animation': {
      component: ModalBaseNewAnimation,
      metadata: newAnimationMetadata,
    },
  },
  css: { /* ... */ },
}
```

**Step 5: Test**
```bash
# Run smoke tests to ensure animation renders
npm test -- allAnimations.smoke.test

# Run dev server to view animation
npm run dev
```

### Creating New Group

**Step 1: Create Folder Structure**
```bash
mkdir -p src/components/dialogs/new-group/{framer,css}
touch src/components/dialogs/new-group/index.ts
touch src/components/dialogs/new-group/shared.css
```

**Step 2: Implement Group Index**
```typescript
// new-group/index.ts
import type { GroupExport, GroupMetadata } from '@/types/animation'

export const groupMetadata: GroupMetadata = {
  id: 'new-group',
  title: 'New Group',
  tech: 'framer',
  demo: 'New group description',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    // Add animations here
  },
  css: {},
}
```

**Step 3: Add to Category**
```typescript
// dialogs/index.ts
import { groupExport as newGroup } from './new-group'

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    // ... existing groups
    'new-group': newGroup,
  },
}
```

### Creating New Category

**Step 1: Create Folder Structure**
```bash
mkdir -p src/components/new-category
touch src/components/new-category/index.ts
```

**Step 2: Implement Category Index**
```typescript
// new-category/index.ts
import type { CategoryExport, CategoryMetadata } from '@/types/animation'

export const categoryMetadata: CategoryMetadata = {
  id: 'new-category',
  title: 'New Category',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    // Add groups here
  },
}
```

**Step 3: Add to Registry**
```typescript
// animationRegistry.ts
import { categoryExport as newCategory } from '@/components/new-category'

export const categories: Record<string, CategoryExport> = {
  // ... existing categories
  'new-category': newCategory,
}
```

---

## Troubleshooting

### Port Already in Use
**Issue**: `Error: Port 5173 is already in use`

**Solution**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Module Not Found
**Issue**: `Cannot find module '@/components/...'`

**Solution**:
```bash
# Check path aliases in vite.config.ts and tsconfig.json
# Restart dev server
npm run dev
```

### Type Errors
**Issue**: TypeScript compilation errors

**Solution**:
```bash
# Run type checker
npm run type-check

# Check tsconfig.json for proper configuration
# Ensure all dependencies are installed
npm install
```

### Test Failures
**Issue**: Tests failing unexpectedly

**Solution**:
```bash
# Clean test artifacts
npm run pretest

# Run tests with verbose output
npm test -- --reporter=verbose

# Run single test file for debugging
npm test -- AnimationCard.test.tsx
```

### Build Failures
**Issue**: Production build fails

**Solution**:
```bash
# Clean dist folder
rm -rf dist

# Rebuild
npm run build

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

### Playwright Tests Hanging
**Issue**: E2E tests never complete

**Solution**:
```bash
# Ensure dev server is running
npm run dev

# In another terminal, run Playwright
npm run test:e2e

# Or use npx to start server automatically
npx playwright test
```

---

## Environment Variables

### Default Configuration
```bash
# .env (if needed)
VITE_API_URL=http://localhost:3000  # Not used in current project
```

**Note**: This project is frontend-only, no backend API required.

### Build Modes
```bash
# Development build
npm run dev

# Production build
npm run build

# Production preview
npm run preview
```

---

## Project Scripts Reference

### Development
| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server |
| `build` | `tsc -b && vite build` | Production build |
| `build:analyze` | `vite build --mode analyze` | Build with analyzer |
| `preview` | `vite preview` | Preview production build |

### Testing
| Script | Command | Description |
|--------|---------|-------------|
| `test` | `node ./scripts/run-vitest.mjs run` | Run tests once |
| `test:watch` | `node scripts/vitest-watch.mjs` | Watch mode |
| `test:coverage` | Run with coverage | Coverage report |
| `test:e2e` | `node ./scripts/run-playwright.mjs` | E2E tests |
| `test:e2e:headed` | Run with browser | E2E debugging |
| `pretest` | `node scripts/cleanup-vitest.mjs` | Cleanup before tests |

### Code Quality
| Script | Command | Description |
|--------|---------|-------------|
| `lint` | `eslint .` | Check linting |
| `lint:fix` | `eslint . --fix` | Fix linting |
| `format` | `prettier --write .` | Format code |
| `format:check` | `prettier --check .` | Check formatting |
| `type-check` | `tsc --noEmit` | Type checking |

---

## File Watching

### Vite Hot Reload
- Auto-reloads on file changes
- Fast HMR (Hot Module Replacement)
- Preserves component state when possible

### What Triggers Reload
- `.tsx` / `.ts` file changes
- `.css` file changes
- `vite.config.ts` changes (requires manual restart)
- `package.json` changes (requires `npm install`)

### What Doesn't Trigger Reload
- Test files (`.test.tsx`)
- Config files outside Vite's watch
- Files in `node_modules`

---

## Performance Tips

### Development
```bash
# Faster dev server startup
npm run dev

# Use build analysis to identify large bundles
npm run build:analyze
```

### Build Optimization
```bash
# Production build is automatically optimized
npm run build

# Check bundle size
ls -lh dist/assets/

# Analyze bundle composition
npm run build:analyze
```

### Test Performance
```bash
# Run tests in parallel (default)
npm test

# Run single test file for faster feedback
npm test -- ComponentName.test.tsx

# Skip E2E tests during rapid iteration
npm test  # Just unit tests
```

---

## Common Workflows

### Feature Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/new-animation

# 2. Start dev server
npm run dev

# 3. Make changes, see hot reload

# 4. Write tests
# Create test file in src/__tests__/

# 5. Run tests
npm test

# 6. Check code quality
npm run lint:fix && npm run format

# 7. Build and verify
npm run build
npm run preview

# 8. Commit and push
git add .
git commit -m "Add new animation"
git push origin feature/new-animation
```

### Bug Fix Workflow
```bash
# 1. Reproduce bug locally
npm run dev

# 2. Write failing test
# Add test case that exposes bug

# 3. Fix bug
# Modify code to pass test

# 4. Verify fix
npm test
npm run test:e2e

# 5. Commit
git add .
git commit -m "Fix: [description]"
```

### Pre-Deployment Checklist
```bash
# 1. All tests passing
npm test && npm run test:e2e

# 2. No linting errors
npm run lint

# 3. Code formatted
npm run format

# 4. Type checking passes
npm run type-check

# 5. Production build succeeds
npm run build

# 6. Preview looks correct
npm run preview
```

---

## Quick Commands Cheatsheet

```bash
# Start development
npm run dev

# Run tests
npm test

# Fix code issues
npm run lint:fix && npm run format

# Build for production
npm run build

# Full quality check
npm run lint && npm run type-check && npm test
```

---

## Getting Help

### Documentation
- Architecture: `docs/architecture.md`
- Testing: `docs/testing.md`
- Style Guide: `.claude/meta/styleguide.md`

### Debugging
```bash
# Verbose test output
npm test -- --reporter=verbose

# Show all test files
npm test -- --list

# Run specific test
npm test -- --grep "animation replay"

# Debug E2E tests
npm run test:e2e:headed
```

### Common Questions

**Q: How do I add a new animation?**
A: See "Adding New Animation" section above.

**Q: Why are my changes not showing?**
A: Check that dev server is running (`npm run dev`). Hard refresh browser (Cmd+Shift+R).

**Q: How do I run only one test?**
A: `npm test -- YourTestFile.test.tsx` or use `it.only` in test file.

**Q: How do I debug Playwright tests?**
A: `npm run test:e2e:headed` or `npx playwright test --debug`

**Q: Can I use a different port?**
A: `npm run dev -- --port 3000`

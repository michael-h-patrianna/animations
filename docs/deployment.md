# Deployment & Local Dev Guide for LLM Coding Agents

**Purpose**: How to run, build, and deploy the application.

**Tech Stack**: Vite, Vercel.

---

## Local Development Setup

### 1. Install Dependencies

Requires **pnpm >= 10**.

```bash
pnpm install
```

### 2. Start Dev Server

```bash
pnpm run dev
```

Access at `http://localhost:3000` (configured in `vite.config.ts`). E2E tests run on port 5173 via `playwright.config.ts` webServer override for test isolation.

---

## Building for Production

### Build Command

```bash
pnpm run build
```

**Output**: `dist/` folder.

### Preview Production Build

```bash
pnpm run preview
```

Runs a local server serving the `dist/` folder.

---

## Deployment (Vercel)

**Config**: `vercel.json`

### Auto-Deployment

Pushing to the `main` branch triggers a Vercel deployment (if configured).

### Manual Deployment

```bash
pnpm dlx vercel --prod
```

---

## Troubleshooting

### "Missing Module" Errors

**Cause**: Often due to incorrect imports in `index.ts` files or circular dependencies.
**Fix**: Check the `animationRegistry.ts` imports and ensure no circular references between Categories and Groups.

### "Metadata Missing"

**Cause**: Component's `.meta.ts` file is missing or doesn't export `metadata`.
**Fix**: Verify the `.meta.ts` file exists alongside the component and exports `export const metadata: AnimationMetadata = { ... }`.

---

## Quick Cheatsheet

| Task       | Command               |
| ---------- | --------------------- |
| Start Dev  | `pnpm run dev`        |
| Type Check | `pnpm run type-check` |
| Lint       | `pnpm run lint`       |
| Build      | `pnpm run build`      |
| Test       | `pnpm test`           |

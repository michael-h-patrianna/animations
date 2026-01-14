# Deployment & Local Dev Guide for LLM Coding Agents

**Purpose**: How to run, build, and deploy the application.

**Tech Stack**: Vite, Vercel.

---

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Access at `http://localhost:5173` (default).

---

## Building for Production

### Build Command
```bash
npm run build
```
**Output**: `dist/` folder.

### Preview Production Build
```bash
npm run preview
```
Runs a local server serving the `dist/` folder.

---

## Deployment (Vercel)

**Config**: `vercel.json`

### Auto-Deployment
Pushing to the `main` branch triggers a Vercel deployment (if configured).

### Manual Deployment
```bash
npx vercel --prod
```

---

## Troubleshooting

### "Missing Module" Errors
**Cause**: Often due to incorrect imports in `index.ts` files or circular dependencies.
**Fix**: Check the `animationRegistry.ts` imports and ensure no circular references between Categories and Groups.

### "Metadata Missing"
**Cause**: Component didn't export `metadata` or Group `index.ts` didn't include it.
**Fix**: Verify the `export const metadata` exists and is being used in the aggregation file.

---

## Quick Cheatsheet

| Task | Command |
|------|---------|
| Start Dev | `npm run dev` |
| Type Check | `npm run type-check` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| Test | `npm test` |

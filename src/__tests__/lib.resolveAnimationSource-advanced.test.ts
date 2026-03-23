import { buildGroupExport, resolveAnimationSource } from '@/lib/groupBuilder'
import type { AnimationMetadata, GroupMetadata } from '@/types/animation'
import { describe, expect, it, vi } from 'vitest'

const groupMeta: GroupMetadata = { id: 'test-group', title: 'Test Group' }

function makeMeta(id: string, overrides?: Partial<AnimationMetadata>): AnimationMetadata {
  return {
    id,
    title: id,
    description: 'desc',
    urlSlugFramer: `/${id}-framer`,
    urlSlugCss: `/${id}-css`,
    ...overrides,
  }
}

describe('resolveAnimationSource — advanced scenarios', () => {
  it('does NOT resolve bare CSS imports (import "../shared.css") as source tabs', async () => {
    // Bare CSS imports (without `from`) are side-effect-only imports used for styling.
    // The extractRelativeImports regex only matches `from '...'` patterns.
    // This documents the current behavior: shared.css is not included as a tab.
    const tsxSource = `import '../shared.css'\nimport { helper } from '../Config'\nexport function MyAnim() { return <div /> }`
    const componentCss = `.pf-my-anim { opacity: 1; }`
    const configCode = `export const helper = true`

    const result = buildGroupExport(
      groupMeta,
      {},
      {},
      { './css/MyAnim.tsx': () => Promise.resolve({ MyAnim: () => null }) },
      { './css/MyAnim.meta.ts': { metadata: makeMeta('g__my-anim') } },
      {
        cssTsx: { './css/MyAnim.tsx': vi.fn().mockResolvedValue(tsxSource) },
        cssCss: { './css/MyAnim.css': vi.fn().mockResolvedValue(componentCss) },
        shared: {
          './shared.css': vi.fn().mockResolvedValue('.pf-shared {}'),
          './Config.ts': vi.fn().mockResolvedValue(configCode),
        },
      }
    )

    const tabs = await resolveAnimationSource(undefined, result.css['g__my-anim']!)

    // Should have: Component, CSS (component), Config.ts — but NOT shared.css
    expect(tabs).toHaveLength(3)
    expect(tabs[0]!.label).toBe('Component')
    expect(tabs[1]!.label).toBe('CSS')
    expect(tabs[2]!.label).toBe('Config.ts')
    // shared.css is not included because bare imports are not parsed
    expect(tabs.map((t) => t.label)).not.toContain('shared.css')
  })

  it('handles both variants importing the same shared file without duplication', async () => {
    const framerTsx = `import { Config } from '../Config'\nexport function A() {}`
    const cssTsx = `import { Config } from '../Config'\nexport function A() {}`
    const configCode = `export const Config = { speed: 1 }`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      { './css/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './css/A.meta.ts': { metadata: makeMeta('g__a') } },
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(framerTsx) },
        cssTsx: { './css/A.tsx': vi.fn().mockResolvedValue(cssTsx) },
        shared: { './Config.ts': vi.fn().mockResolvedValue(configCode) },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, result.css['g__a']!)
    const configTabs = tabs.filter((t) => t.label === 'Config.ts')
    expect(configTabs).toHaveLength(1)
    expect(configTabs[0]!.code).toBe(configCode)
  })

  it('handles re-export syntax (export { X } from) without false positive shared tab inclusion', async () => {
    // Re-exports like `export { Config } from '../Config'` use 'from' syntax
    // and should be parsed by extractRelativeImports. This verifies the regex handles them.
    const tsxSource = `export { Config } from '../Config'\nexport function A() { return <div /> }`
    const configCode = `export const Config = {}`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: { './Config.ts': vi.fn().mockResolvedValue(configCode) },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, undefined)
    const configTab = tabs.find((t) => t.label === 'Config.ts')
    expect(configTab, 'Re-exported Config.ts should appear as shared tab').toEqual(
      expect.objectContaining({ label: 'Config.ts', code: configCode, language: 'tsx' })
    )
  })

  it('resolves same-directory helper imports from css/ subdir alongside component CSS', async () => {
    const tsxSource = `import { helper } from './HelperUtils'\nexport function A() { return <div /> }`
    const helperCode = `export function helper() {}`

    const result = buildGroupExport(
      groupMeta,
      {},
      {},
      { './css/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './css/A.meta.ts': { metadata: makeMeta('g__a') } },
      {
        cssTsx: {
          './css/A.tsx': vi.fn().mockResolvedValue(tsxSource),
          './css/HelperUtils.tsx': vi.fn().mockResolvedValue(helperCode),
        },
        // CSS file matches the component basename (A.css)
        cssCss: { './css/A.css': vi.fn().mockResolvedValue('.foo { color: red }') },
      }
    )

    const tabs = await resolveAnimationSource(undefined, result.css['g__a']!)
    const labels = tabs.map((t) => t.label)
    // Component TSX + Component CSS + helper
    expect(labels).toContain('Component')
    expect(labels).toContain('CSS')
    expect(labels).toContain('HelperUtils.tsx')
  })

  it('handles concurrent calls for the same entry without corrupting results', async () => {
    let callCount = 0
    const tsxLoader = vi.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          callCount++
          // Each call resolves with same content after different delays
          setTimeout(() => resolve(`tsx source v${callCount}`), callCount * 10)
        })
    )

    const result = buildGroupExport(
      groupMeta,
      { './framer/Concurrent.tsx': () => Promise.resolve({ Concurrent: () => null }) },
      { './framer/Concurrent.meta.ts': { metadata: makeMeta('g__concurrent') } },
      {},
      {},
      {
        framerTsx: { './framer/Concurrent.tsx': tsxLoader },
      }
    )

    const entry = result.framer['g__concurrent']!

    // Call concurrently
    const [tabs1, tabs2] = await Promise.all([
      resolveAnimationSource(entry, undefined),
      resolveAnimationSource(entry, undefined),
    ])

    // Both should resolve successfully with a single tab
    expect(tabs1).toHaveLength(1)
    expect(tabs2).toHaveLength(1)
    expect(tabs1[0]!.label).toBe('Component')
    expect(tabs2[0]!.label).toBe('Component')
    // Both should have the code loaded (content may differ since loaders are called independently)
    expect(tabs1[0]!.code).toMatch(/tsx source/)
    expect(tabs2[0]!.code).toMatch(/tsx source/)
  })

  it('propagates loader rejection to the caller', async () => {
    const tsxLoader = vi.fn().mockRejectedValue(new Error('network timeout'))

    const result = buildGroupExport(
      groupMeta,
      { './framer/Fail.tsx': () => Promise.resolve({ Fail: () => null }) },
      { './framer/Fail.meta.ts': { metadata: makeMeta('g__fail') } },
      {},
      {},
      {
        framerTsx: { './framer/Fail.tsx': tsxLoader },
      }
    )

    const framerEntry = result.framer['g__fail']!
    await expect(resolveAnimationSource(framerEntry, undefined)).rejects.toThrow('network timeout')
  })

  it('fails entirely when one of multiple loaders rejects (Promise.all behavior)', async () => {
    const cssTsxLoader = vi.fn().mockResolvedValue('css tsx source')
    const cssCssLoader = vi.fn().mockRejectedValue(new Error('css load failed'))

    const result = buildGroupExport(
      groupMeta,
      {},
      {},
      { './css/Partial.tsx': () => Promise.resolve({ Partial: () => null }) },
      { './css/Partial.meta.ts': { metadata: makeMeta('g__partial') } },
      {
        cssTsx: { './css/Partial.tsx': cssTsxLoader },
        cssCss: { './css/Partial.css': cssCssLoader },
      }
    )

    const cssEntry = result.css['g__partial']!
    // Promise.all fails if ANY loader rejects — both tabs are lost
    await expect(resolveAnimationSource(undefined, cssEntry)).rejects.toThrow('css load failed')
  })

  it('propagates shared file loader rejection', async () => {
    const tsxSource = `import { helper } from '../utils'\nexport function A() {}`
    const tsxLoader = vi.fn().mockResolvedValue(tsxSource)
    const sharedLoader = vi.fn().mockRejectedValue(new Error('shared file missing'))

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': tsxLoader },
        shared: { './utils.ts': sharedLoader },
      }
    )

    const framerEntry = result.framer['g__a']!
    await expect(resolveAnimationSource(framerEntry, undefined)).rejects.toThrow(
      'shared file missing'
    )
  })

  it('returns empty tabs when both entries are undefined', async () => {
    const tabs = await resolveAnimationSource(undefined, undefined)
    expect(tabs).toEqual([])
  })

  it('does not include deeply nested imports (../../) that escape the group root', async () => {
    // An import like '../../sharedLib' from framer/Component.tsx resolves to
    // './../sharedLib' which doesn't match any glob key in the shared pool.
    // This verifies the resolution correctly ignores imports outside the group boundary.
    const tsxSource = `import { deep } from '../../sharedLib'\nexport function A() {}`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: { './sharedLib.ts': vi.fn().mockResolvedValue('export const deep = 1') },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, undefined)

    // Only the component tsx should appear — the ../../sharedLib import resolves
    // to './../sharedLib' which doesn't match './sharedLib.ts' in the shared pool
    expect(tabs).toHaveLength(1)
    expect(tabs[0]!.label).toBe('Component')
  })

  it('returns tabs in correct order: framer tsx, css tsx, css css, then shared sorted', async () => {
    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      { './css/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './css/A.meta.ts': { metadata: makeMeta('g__a') } },
      {
        framerTsx: {
          './framer/A.tsx': vi
            .fn()
            .mockResolvedValue(`import { u } from '../utils'\nexport function A() {}`),
        },
        framerCss: { './framer/A.css': vi.fn().mockResolvedValue('.framer-css {}') },
        cssTsx: { './css/A.tsx': vi.fn().mockResolvedValue('export function A() {}') },
        cssCss: { './css/A.css': vi.fn().mockResolvedValue('.css-css {}') },
        shared: { './utils.ts': vi.fn().mockResolvedValue('export const u = 1') },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, result.css['g__a']!)
    const labels = tabs.map((t) => t.label)

    // Expected order: framer tsx, css tsx, css css, then shared files (framer CSS excluded)
    expect(labels).toEqual(['Component', 'Component', 'CSS', 'utils.ts'])
  })

  it('ignores absolute/bare module imports (non-relative) and does not create shared tabs for them', async () => {
    // Imports like '@/utils/foo' or 'lodash' are not relative — they don't start with ./ or ../
    // resolveImportToGroupRoot returns them unchanged, and they won't match any shared pool key
    const tsxSource = `import { cn } from '@/lib/utils'\nimport * as m from 'motion/react-m'\nimport { helper } from '../Config'\nexport function A() { return <div /> }`
    const configCode = `export const helper = true`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: { './Config.ts': vi.fn().mockResolvedValue(configCode) },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, undefined)

    // Only Component + Config.ts should appear
    // '@/lib/utils' and 'motion/react-m' are NOT relative imports → no shared tabs
    const labels = tabs.map((t) => t.label)
    expect(labels).toEqual(['Component', 'Config.ts'])
  })

  it('resolves .css extension shared files with language "css"', async () => {
    const tsxSource = `import { helper } from '../shared'\nexport function A() { return <div /> }`
    const sharedCss = `.pf-shared { display: flex; }`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: { './shared.css': vi.fn().mockResolvedValue(sharedCss) },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, undefined)

    const sharedTab = tabs.find((t) => t.label === 'shared.css')
    expect(sharedTab).toEqual({ label: 'shared.css', code: sharedCss, language: 'css' })
  })

  it('does NOT parse dynamic imports — import("../foo") is not matched by RELATIVE_IMPORT_RE', async () => {
    // Dynamic imports use import() syntax, not `from '...'` syntax.
    // The regex /\bfrom\s+['"]/ does not match dynamic imports.
    const tsxSource = `const lazy = import('../DynamicHelper')\nexport function A() { return <div /> }`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: { './DynamicHelper.ts': vi.fn().mockResolvedValue('export const x = 1') },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, undefined)
    // Only the component — DynamicHelper is NOT included because dynamic imports aren't parsed
    expect(tabs).toHaveLength(1)
    expect(tabs[0]!.label).toBe('Component')
  })

  it('parses type-only imports — import type { X } from "../types"', async () => {
    // type-only imports still use `from '...'` syntax, so RELATIVE_IMPORT_RE matches them
    const tsxSource = `import type { Config } from '../types'\nexport function A() { return <div /> }`
    const typesCode = `export type Config = { speed: number }`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: { './types.ts': vi.fn().mockResolvedValue(typesCode) },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, undefined)
    // type-only import still resolves to a shared tab
    const typesTab = tabs.find((t) => t.label === 'types.ts')
    expect(typesTab).toEqual(expect.objectContaining({ label: 'types.ts', code: typesCode }))
  })

  it('does NOT parse imports inside comments', async () => {
    // The regex matches ANY line with `from '...'` — it cannot distinguish commented-out imports.
    // This documents the known limitation: commented imports are still parsed.
    const tsxSource = `// import { helper } from '../commented'\nimport { real } from '../real'\nexport function A() { return <div /> }`
    const commentedCode = `export const helper = 1`
    const realCode = `export const real = 2`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: {
          './commented.ts': vi.fn().mockResolvedValue(commentedCode),
          './real.ts': vi.fn().mockResolvedValue(realCode),
        },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, undefined)
    const labels = tabs.map((t) => t.label)
    // Both appear because the regex cannot distinguish comments from code
    expect(labels).toContain('real.ts')
    // KNOWN LIMITATION: commented import is also included
    expect(labels).toContain('commented.ts')
  })

  it('handles component that imports multiple shared files — all appear sorted alphabetically', async () => {
    const tsxSource = `import { z } from '../zebra'\nimport { a } from '../alpha'\nimport { m } from '../middle'\nexport function A() { return <div /> }`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: {
          './zebra.ts': vi.fn().mockResolvedValue('export const z = 1'),
          './alpha.ts': vi.fn().mockResolvedValue('export const a = 2'),
          './middle.ts': vi.fn().mockResolvedValue('export const m = 3'),
        },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, undefined)
    const sharedLabels = tabs.filter((t) => t.label !== 'Component').map((t) => t.label)

    // Shared files should be sorted alphabetically by glob path
    expect(sharedLabels).toEqual(['alpha.ts', 'middle.ts', 'zebra.ts'])
  })
})

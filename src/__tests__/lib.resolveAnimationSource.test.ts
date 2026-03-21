import { buildGroupExport, resolveAnimationSource } from '@/lib/groupBuilder'
import type { AnimationMetadata, GroupMetadata } from '@/types/animation'
import { describe, expect, it, vi } from 'vitest'

const groupMeta: GroupMetadata = { id: 'test-group', title: 'Test Group' }

function makeMeta(id: string, overrides?: Partial<AnimationMetadata>): AnimationMetadata {
  return { id, title: id, description: 'desc', tags: [], ...overrides }
}

describe('resolveAnimationSource', () => {
  it('resolves all source tabs for framer entry with tsx and css', async () => {
    const tsxLoader = vi.fn().mockResolvedValue('export function Foo() {}')
    const cssLoader = vi.fn().mockResolvedValue('.foo { color: red }')

    const result = buildGroupExport(
      groupMeta,
      { './framer/TestAnim.tsx': () => Promise.resolve({ TestAnim: () => null }) },
      { './framer/TestAnim.meta.ts': { metadata: makeMeta('g__test-anim') } },
      {},
      {},
      {
        framerTsx: { './framer/TestAnim.tsx': tsxLoader },
        framerCss: { './framer/TestAnim.css': cssLoader },
      }
    )

    const framerEntry = result.framer['g__test-anim']!
    const tabs = await resolveAnimationSource(framerEntry, undefined)

    expect(tabs).toHaveLength(2)
    expect(tabs[0]).toEqual({
      label: 'Component (Motion)',
      code: 'export function Foo() {}',
      language: 'tsx',
    })
    expect(tabs[1]).toEqual({ label: 'CSS (Motion)', code: '.foo { color: red }', language: 'css' })
  })

  it('returns empty array when no loaders attached', async () => {
    const result = buildGroupExport(
      groupMeta,
      { './framer/TestAnim.tsx': () => Promise.resolve({ TestAnim: () => null }) },
      { './framer/TestAnim.meta.ts': { metadata: makeMeta('g__test-anim') } },
      {},
      {}
    )

    const framerEntry = result.framer['g__test-anim']!
    const tabs = await resolveAnimationSource(framerEntry, undefined)

    expect(tabs).toEqual([])
  })

  it('returns only framer tsx tab when css loader is absent', async () => {
    const tsxLoader = vi.fn().mockResolvedValue('const x = 1')

    const result = buildGroupExport(
      groupMeta,
      { './framer/TestAnim.tsx': () => Promise.resolve({ TestAnim: () => null }) },
      { './framer/TestAnim.meta.ts': { metadata: makeMeta('g__test-anim') } },
      {},
      {},
      {
        framerTsx: { './framer/TestAnim.tsx': tsxLoader },
      }
    )

    const framerEntry = result.framer['g__test-anim']!
    const tabs = await resolveAnimationSource(framerEntry, undefined)

    expect(tabs).toHaveLength(1)
    expect(tabs[0]).toEqual({ label: 'Component (Motion)', code: 'const x = 1', language: 'tsx' })
  })

  it('resolves all 4 tabs when both variants have tsx and css', async () => {
    const framerTsxLoader = vi.fn().mockResolvedValue('framer tsx')
    const framerCssLoader = vi.fn().mockResolvedValue('framer css')
    const cssTsxLoader = vi.fn().mockResolvedValue('css tsx')
    const cssCssLoader = vi.fn().mockResolvedValue('css stylesheet')

    const result = buildGroupExport(
      groupMeta,
      { './framer/Anim.tsx': () => Promise.resolve({ Anim: () => null }) },
      { './framer/Anim.meta.ts': { metadata: makeMeta('g__anim') } },
      { './css/Anim.tsx': () => Promise.resolve({ Anim: () => null }) },
      { './css/Anim.meta.ts': { metadata: makeMeta('g__anim') } },
      {
        framerTsx: { './framer/Anim.tsx': framerTsxLoader },
        framerCss: { './framer/Anim.css': framerCssLoader },
        cssTsx: { './css/Anim.tsx': cssTsxLoader },
        cssCss: { './css/Anim.css': cssCssLoader },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__anim']!, result.css['g__anim']!)

    expect(tabs).toHaveLength(4)
    expect(tabs[0]).toEqual({ label: 'Component (Motion)', code: 'framer tsx', language: 'tsx' })
    expect(tabs[1]).toEqual({ label: 'Component (CSS)', code: 'css tsx', language: 'tsx' })
    expect(tabs[2]).toEqual({ label: 'CSS', code: 'css stylesheet', language: 'css' })
    expect(tabs[3]).toEqual({ label: 'CSS (Motion)', code: 'framer css', language: 'css' })
  })

  it('resolves CSS-only variant tabs correctly', async () => {
    const cssTsxLoader = vi.fn().mockResolvedValue('export function CssAnim() {}')
    const cssCssLoader = vi.fn().mockResolvedValue('.css-anim { color: blue }')

    const result = buildGroupExport(
      groupMeta,
      {},
      {},
      { './css/CssAnim.tsx': () => Promise.resolve({ CssAnim: () => null }) },
      { './css/CssAnim.meta.ts': { metadata: makeMeta('g__css-anim') } },
      {
        cssTsx: { './css/CssAnim.tsx': cssTsxLoader },
        cssCss: { './css/CssAnim.css': cssCssLoader },
      }
    )

    const cssEntry = result.css['g__css-anim']!
    const tabs = await resolveAnimationSource(undefined, cssEntry)

    expect(tabs).toHaveLength(2)
    expect(tabs[0]).toEqual({
      label: 'Component (CSS)',
      code: 'export function CssAnim() {}',
      language: 'tsx',
    })
    expect(tabs[1]).toEqual({ label: 'CSS', code: '.css-anim { color: blue }', language: 'css' })
  })

  it('calls each source loader only once per resolveAnimationSource call', async () => {
    const tsxLoader = vi.fn().mockResolvedValue('tsx source')
    const cssLoader = vi.fn().mockResolvedValue('css source')

    const result = buildGroupExport(
      groupMeta,
      { './framer/Comp.tsx': () => Promise.resolve({ Comp: () => null }) },
      { './framer/Comp.meta.ts': { metadata: makeMeta('g__comp') } },
      {},
      {},
      {
        framerTsx: { './framer/Comp.tsx': tsxLoader },
        framerCss: { './framer/Comp.css': cssLoader },
      }
    )

    const framerEntry = result.framer['g__comp']!
    await resolveAnimationSource(framerEntry, undefined)

    expect(tsxLoader).toHaveBeenCalledOnce()
    expect(cssLoader).toHaveBeenCalledOnce()
  })

  it('includes shared group-root files imported by the component', async () => {
    const tsxSource = `import { randBetween } from '../utils'\nexport function Firework() { return <div /> }`
    const utilsSource = `export function randBetween(a: number, b: number) { return a + Math.random() * (b - a) }`

    const result = buildGroupExport(
      groupMeta,
      { './framer/Firework.tsx': () => Promise.resolve({ Firework: () => null }) },
      { './framer/Firework.meta.ts': { metadata: makeMeta('g__firework') } },
      {},
      {},
      {
        framerTsx: { './framer/Firework.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: { './utils.ts': vi.fn().mockResolvedValue(utilsSource) },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__firework']!, undefined)

    expect(tabs).toHaveLength(2)
    expect(tabs[0]!.label).toBe('Component (Motion)')
    expect(tabs[1]).toEqual({ label: 'utils.ts', code: utilsSource, language: 'tsx' })
  })

  it('includes helper files from within framer/css subdirs', async () => {
    const tsxSource = `import { HelperFn } from './XpAccumulationHelpers'\nexport function XpBar() { return <div /> }`
    const helperSource = `export function HelperFn() { return 42 }`

    const result = buildGroupExport(
      groupMeta,
      { './css/XpBar.tsx': () => Promise.resolve({ XpBar: () => null }) },
      {},
      { './css/XpBar.tsx': () => Promise.resolve({ XpBar: () => null }) },
      { './css/XpBar.meta.ts': { metadata: makeMeta('g__xp-bar') } },
      {
        cssTsx: {
          './css/XpBar.tsx': vi.fn().mockResolvedValue(tsxSource),
          './css/XpAccumulationHelpers.tsx': vi.fn().mockResolvedValue(helperSource),
        },
      }
    )

    const tabs = await resolveAnimationSource(undefined, result.css['g__xp-bar']!)

    expect(tabs).toHaveLength(2)
    expect(tabs[0]!.label).toBe('Component (CSS)')
    expect(tabs[1]).toEqual({
      label: 'XpAccumulationHelpers.tsx',
      code: helperSource,
      language: 'tsx',
    })
  })

  it('deduplicates shared files imported by both variants', async () => {
    const framerSource = `import { utils } from '../utils'\nexport function A() {}`
    const cssSource = `import { utils } from '../utils'\nexport function A() {}`
    const utilsCode = `export const utils = {}`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      { './css/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './css/A.meta.ts': { metadata: makeMeta('g__a') } },
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(framerSource) },
        cssTsx: { './css/A.tsx': vi.fn().mockResolvedValue(cssSource) },
        shared: { './utils.ts': vi.fn().mockResolvedValue(utilsCode) },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, result.css['g__a']!)

    const utilsTabs = tabs.filter((t) => t.label === 'utils.ts')
    expect(utilsTabs).toHaveLength(1)
  })

  it('excludes Mock imports from shared tabs', async () => {
    const tsxSource = `import { MockModalContent } from '../MockModalContent'\nexport function A() {}`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: { './MockModalContent.tsx': vi.fn().mockResolvedValue('mock content') },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, undefined)

    expect(tabs).toHaveLength(1)
    expect(tabs[0]!.label).toBe('Component (Motion)')
  })

  it('includes empty-string source as a tab (loaded but empty file)', async () => {
    const tsxLoader = vi.fn().mockResolvedValue('')

    const result = buildGroupExport(
      groupMeta,
      { './framer/Empty.tsx': () => Promise.resolve({ Empty: () => null }) },
      { './framer/Empty.meta.ts': { metadata: makeMeta('g__empty') } },
      {},
      {},
      {
        framerTsx: { './framer/Empty.tsx': tsxLoader },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__empty']!, undefined)

    // Empty string is a valid loaded source — the tab should be present
    expect(tabs).toHaveLength(1)
    expect(tabs[0]).toEqual({ label: 'Component (Motion)', code: '', language: 'tsx' })
  })

  it('correctly resolves same-directory helper imports from css subdir', async () => {
    const tsxSource = `import { helper } from './SharedUtils'\nexport function A() {}`
    const helperSource = `export function helper() {}`

    const result = buildGroupExport(
      groupMeta,
      {},
      {},
      { './css/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './css/A.meta.ts': { metadata: makeMeta('g__a') } },
      {
        cssTsx: {
          './css/A.tsx': vi.fn().mockResolvedValue(tsxSource),
          './css/SharedUtils.tsx': vi.fn().mockResolvedValue(helperSource),
        },
      }
    )

    const tabs = await resolveAnimationSource(undefined, result.css['g__a']!)
    const helperTab = tabs.find((t) => t.label === 'SharedUtils.tsx')
    expect(helperTab).toEqual(
      expect.objectContaining({ code: helperSource, label: 'SharedUtils.tsx', language: 'tsx' })
    )
  })

  it('correctly resolves parent-directory imports to group root', async () => {
    // Import '../types' from framer/Component.tsx should resolve to ./types at group root
    const tsxSource = `import { MyType } from '../types'\nexport function A() {}`
    const typesSource = `export type MyType = string`

    const result = buildGroupExport(
      groupMeta,
      { './framer/A.tsx': () => Promise.resolve({ A: () => null }) },
      { './framer/A.meta.ts': { metadata: makeMeta('g__a') } },
      {},
      {},
      {
        framerTsx: { './framer/A.tsx': vi.fn().mockResolvedValue(tsxSource) },
        shared: { './types.ts': vi.fn().mockResolvedValue(typesSource) },
      }
    )

    const tabs = await resolveAnimationSource(result.framer['g__a']!, undefined)
    const typesTab = tabs.find((t) => t.label === 'types.ts')
    expect(typesTab).toEqual(
      expect.objectContaining({ code: typesSource, label: 'types.ts', language: 'tsx' })
    )
  })

  it('does not share source loaders between different animation entries', async () => {
    const loaderA = vi.fn().mockResolvedValue('source A')
    const loaderB = vi.fn().mockResolvedValue('source B')

    const result = buildGroupExport(
      groupMeta,
      {
        './framer/AnimA.tsx': () => Promise.resolve({ AnimA: () => null }),
        './framer/AnimB.tsx': () => Promise.resolve({ AnimB: () => null }),
      },
      {
        './framer/AnimA.meta.ts': { metadata: makeMeta('g__anim-a') },
        './framer/AnimB.meta.ts': { metadata: makeMeta('g__anim-b') },
      },
      {},
      {},
      {
        framerTsx: {
          './framer/AnimA.tsx': loaderA,
          './framer/AnimB.tsx': loaderB,
        },
      }
    )

    const tabsA = await resolveAnimationSource(result.framer['g__anim-a']!, undefined)
    const tabsB = await resolveAnimationSource(result.framer['g__anim-b']!, undefined)

    expect(tabsA[0]!.code).toBe('source A')
    expect(tabsB[0]!.code).toBe('source B')
  })
})

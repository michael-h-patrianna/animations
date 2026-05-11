import {
  GROUP_HELPER_FILE_NAMES,
  buildGroupExport,
  isKnownGroupHelperFileName,
  resolveAnimationSource,
} from '@/lib/groupBuilder'
import { render, screen, waitFor } from '@testing-library/react'
import { Component, Suspense, createElement, memo, type ReactNode } from 'react'
import type { AnimationMetadata, GroupMetadata } from '@/types/animation'
import { describe, expect, it, vi } from 'vitest'

const groupMeta: GroupMetadata = { id: 'test-group', title: 'Test Group' }

const groupRootSourceModules = import.meta.glob<string>(
  '/src/components/{base,dialogs,progress,realtime,rewards}/*/*.{ts,tsx}',
  { query: '?raw', import: 'default', eager: true }
)
const groupSubdirTsModules = import.meta.glob<string>(
  '/src/components/{base,dialogs,progress,realtime,rewards}/*/{framer,css}/*.ts',
  { query: '?raw', import: 'default', eager: true }
)
const groupSubdirTsxModules = import.meta.glob<string>(
  '/src/components/{base,dialogs,progress,realtime,rewards}/*/{framer,css}/*.tsx',
  { query: '?raw', import: 'default', eager: true }
)
const groupSubdirMetaModules = import.meta.glob<string>(
  '/src/components/{base,dialogs,progress,realtime,rewards}/*/{framer,css}/*.meta.ts',
  { query: '?raw', import: 'default', eager: true }
)
const groupSubdirCssModules = import.meta.glob<string>(
  '/src/components/{base,dialogs,progress,realtime,rewards}/*/{framer,css}/*.css',
  { query: '?raw', import: 'default', eager: true }
)
const groupSubdirComponentBases = new Set(
  Object.keys(groupSubdirMetaModules).map((path) => path.replace(/\.meta\.ts$/, ''))
)

function fileName(path: string): string {
  return path.replace(/^.*\//, '')
}

function discoverActualHelperFileNames(): string[] {
  const names = new Set<string>()

  for (const path of Object.keys(groupRootSourceModules)) {
    const name = fileName(path)
    if (name !== 'index.ts') {
      names.add(name)
    }
  }

  for (const path of Object.keys(groupSubdirTsModules)) {
    const name = fileName(path)
    if (!name.endsWith('.meta.ts')) {
      names.add(name)
    }
  }

  for (const path of Object.keys(groupSubdirTsxModules)) {
    if (!groupSubdirComponentBases.has(path.replace(/\.tsx$/, ''))) {
      names.add(fileName(path))
    }
  }

  for (const path of Object.keys(groupSubdirCssModules)) {
    const name = fileName(path)
    if (
      !name.endsWith('.module.css') &&
      !groupSubdirComponentBases.has(path.replace(/\.css$/, ''))
    ) {
      names.add(name)
    }
  }

  return [...names].sort()
}

class TestErrorBoundary extends Component<
  { children: ReactNode; onError: (error: Error) => void },
  { error: Error | null }
> {
  state = { error: null }

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error }
  }

  componentDidCatch(error: Error): void {
    this.props.onError(error)
  }

  render(): ReactNode {
    return this.state.error ? null : this.props.children
  }
}

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

describe('buildGroupExport', () => {
  it('pairs meta modules with component loaders by filename', () => {
    const framerComponents = {
      './framer/TestAnim.tsx': () => Promise.resolve({ TestAnim: () => null }),
    }
    const framerMeta = {
      './framer/TestAnim.meta.ts': { metadata: makeMeta('test-group__test-anim') },
    }

    const result = buildGroupExport(groupMeta, framerComponents, framerMeta, {}, {})

    expect(result.metadata).toBe(groupMeta)
    expect(Object.keys(result.framer)).toEqual(['test-group__test-anim'])
    expect(result.framer['test-group__test-anim']!.metadata.id).toBe('test-group__test-anim')
    // Component should be a React.lazy object
    expect(result.framer['test-group__test-anim']!.component).toHaveProperty(
      '$$typeof',
      Symbol.for('react.lazy')
    )
  })

  it('skips exact helper files during registration', () => {
    const components = {
      './framer/CardPackOpenCardParts.tsx': () =>
        Promise.resolve({ CardPackOpenCardParts: () => null }),
      './framer/CardPackOpenParts.tsx': () => Promise.resolve({ CardPackOpenParts: () => null }),
      './framer/RealAnim.tsx': () => Promise.resolve({ RealAnim: () => null }),
    }
    const meta = {
      './framer/CardPackOpenCardParts.meta.ts': {
        metadata: makeMeta('g__card-pack-open-card-parts'),
      },
      './framer/CardPackOpenParts.meta.ts': { metadata: makeMeta('g__card-pack-open-parts') },
      './framer/RealAnim.meta.ts': { metadata: makeMeta('g__real-anim') },
    }

    const result = buildGroupExport(groupMeta, components, meta, {}, {})

    expect(Object.keys(result.framer)).toEqual(['g__real-anim'])
  })

  it('skips meta entries without matching component loaders', () => {
    const result = buildGroupExport(
      groupMeta,
      {},
      { './framer/Orphan.meta.ts': { metadata: makeMeta('g__orphan') } },
      {},
      {}
    )

    expect(Object.keys(result.framer)).toEqual([])
  })

  it('builds both framer and css maps independently', () => {
    const result = buildGroupExport(
      groupMeta,
      { './framer/AnimA.tsx': () => Promise.resolve({ AnimA: () => null }) },
      { './framer/AnimA.meta.ts': { metadata: makeMeta('g__anim-a') } },
      { './css/AnimB.tsx': () => Promise.resolve({ AnimB: () => null }) },
      { './css/AnimB.meta.ts': { metadata: makeMeta('g__anim-b') } }
    )

    expect(Object.keys(result.framer)).toEqual(['g__anim-a'])
    expect(Object.keys(result.css)).toEqual(['g__anim-b'])
  })

  it('handles empty glob results', () => {
    const result = buildGroupExport(groupMeta, {}, {}, {}, {})

    expect(Object.keys(result.framer)).toEqual([])
    expect(Object.keys(result.css)).toEqual([])
    expect(result.metadata).toBe(groupMeta)
  })

  it('matches every helper file currently present in group folders', () => {
    const actualHelperFileNames = discoverActualHelperFileNames()

    expect(actualHelperFileNames).toEqual([...GROUP_HELPER_FILE_NAMES].sort())
    expect(actualHelperFileNames.filter((name) => !isKnownGroupHelperFileName(name))).toEqual([])
  })

  it('does not skip regex-like names unless they are explicit helper files', () => {
    const cases: Array<{ name: string; shouldSkip: boolean }> = [
      { name: 'MockContent', shouldSkip: false },
      { name: 'SharedLayout', shouldSkip: false },
      { name: 'PremiumCard', shouldSkip: false },
      { name: 'BurstComponents', shouldSkip: false },
      { name: 'FieldHelper', shouldSkip: false },
      { name: 'LayoutParts', shouldSkip: false },
      { name: 'CardPackOpenParts', shouldSkip: true },
      { name: 'RealAnimation', shouldSkip: false },
      { name: 'ModalBaseScaleGentlePop', shouldSkip: false },
    ]

    for (const { name, shouldSkip } of cases) {
      const components = {
        [`./framer/${name}.tsx`]: () => Promise.resolve({ [name]: () => null }),
      }
      const meta = {
        [`./framer/${name}.meta.ts`]: { metadata: makeMeta(`g__${name.toLowerCase()}`) },
      }

      const result = buildGroupExport(groupMeta, components, meta, {}, {})
      const keys = Object.keys(result.framer)

      if (shouldSkip) {
        expect(keys, `${name} should be filtered out`).toEqual([])
      } else {
        expect(keys.length, `${name} should pass through`).toBe(1)
      }
    }
  })

  describe('baseNameFromPath (tested indirectly)', () => {
    it('handles deeply nested paths', () => {
      const result = buildGroupExport(
        groupMeta,
        { './framer/sub/deep/MyAnim.tsx': () => Promise.resolve({ MyAnim: () => null }) },
        { './framer/sub/deep/MyAnim.meta.ts': { metadata: makeMeta('g__myanim') } },
        {},
        {}
      )
      // baseNameFromPath strips everything before last slash and extension
      expect(Object.keys(result.framer)).toEqual(['g__myanim'])
    })

    it('handles .ts extension (not just .tsx)', () => {
      const result = buildGroupExport(
        groupMeta,
        { './framer/PureLogic.ts': () => Promise.resolve({ PureLogic: () => null }) },
        { './framer/PureLogic.meta.ts': { metadata: makeMeta('g__pure-logic') } },
        {},
        {}
      )
      expect(Object.keys(result.framer)).toEqual(['g__pure-logic'])
    })

    it('matches component and meta files case-sensitively', () => {
      const result = buildGroupExport(
        groupMeta,
        { './framer/MyAnim.tsx': () => Promise.resolve({ MyAnim: () => null }) },
        // Different case in meta path — won't match
        { './framer/Myanim.meta.ts': { metadata: makeMeta('g__myanim') } },
        {},
        {}
      )
      // No match because 'MyAnim' !== 'Myanim'
      expect(Object.keys(result.framer)).toEqual([])
    })
  })

  describe('metadata propagation', () => {
    it('preserves all metadata fields including optional ones', () => {
      const fullMeta = makeMeta('g__full', {
        tags: ['scale', 'modal'],
        infinite: true,
        disableReplay: true,
        controls: 'lights',
        prizeCountMax: 5,
      })

      const result = buildGroupExport(
        groupMeta,
        { './framer/Full.tsx': () => Promise.resolve({ Full: () => null }) },
        { './framer/Full.meta.ts': { metadata: fullMeta } },
        {},
        {}
      )

      const anim = result.framer['g__full']!
      expect(anim.metadata).toBe(fullMeta)
      expect(anim.metadata.tags).toEqual(['scale', 'modal'])
      expect(anim.metadata.infinite).toBe(true)
      expect(anim.metadata.disableReplay).toBe(true)
      expect(anim.metadata.controls).toBe('lights')
      expect(anim.metadata.prizeCountMax).toBe(5)
    })

    it('handles meta without optional fields', () => {
      const minimalMeta = makeMeta('g__minimal')

      const result = buildGroupExport(
        groupMeta,
        { './framer/Minimal.tsx': () => Promise.resolve({ Minimal: () => null }) },
        { './framer/Minimal.meta.ts': { metadata: minimalMeta } },
        {},
        {}
      )

      const anim = result.framer['g__minimal']!
      // Only expected keys should be present — no optional fields added
      expect(Object.keys(anim.metadata).sort()).toEqual([
        'description',
        'id',
        'title',
        'urlSlugCss',
        'urlSlugFramer',
      ])
    })
  })

  describe('multiple animations in same group', () => {
    it('correctly pairs multiple animations within framer and css', () => {
      const result = buildGroupExport(
        groupMeta,
        {
          './framer/AnimAlpha.tsx': () => Promise.resolve({ AnimAlpha: () => null }),
          './framer/AnimBeta.tsx': () => Promise.resolve({ AnimBeta: () => null }),
          './framer/AnimGamma.tsx': () => Promise.resolve({ AnimGamma: () => null }),
        },
        {
          './framer/AnimAlpha.meta.ts': { metadata: makeMeta('g__alpha') },
          './framer/AnimBeta.meta.ts': { metadata: makeMeta('g__beta') },
          './framer/AnimGamma.meta.ts': { metadata: makeMeta('g__gamma') },
        },
        {
          './css/AnimAlpha.tsx': () => Promise.resolve({ AnimAlpha: () => null }),
        },
        {
          './css/AnimAlpha.meta.ts': { metadata: makeMeta('g__alpha') },
        }
      )

      expect(Object.keys(result.framer).sort()).toEqual(['g__alpha', 'g__beta', 'g__gamma'])
      expect(Object.keys(result.css)).toEqual(['g__alpha'])
    })

    it('meta without matching component is silently skipped', () => {
      const result = buildGroupExport(
        groupMeta,
        {
          './framer/AnimAlpha.tsx': () => Promise.resolve({ AnimAlpha: () => null }),
          // AnimBeta component exists but AnimGamma does not
        },
        {
          './framer/AnimAlpha.meta.ts': { metadata: makeMeta('g__alpha') },
          './framer/AnimBeta.meta.ts': { metadata: makeMeta('g__beta') }, // no component
          './framer/AnimGamma.meta.ts': { metadata: makeMeta('g__gamma') }, // no component
        },
        {},
        {}
      )

      // Only alpha has a matching component
      expect(Object.keys(result.framer)).toEqual(['g__alpha'])
    })
  })

  describe('raw source loaders', () => {
    it('attaches tsx and css source loaders when provided', () => {
      const tsxLoader = vi.fn().mockResolvedValue('const x = 1')
      const cssLoader = vi.fn().mockResolvedValue('.foo {}')

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

      const entry = result.framer['g__test-anim']!
      // Entry exists and has correct metadata — source loaders are stored in WeakMap, not on the object
      expect(entry.metadata.id).toBe('g__test-anim')
      expect(Object.keys(entry)).not.toContain('_sourceLoader')
    })
  })
})

describe('buildGroupExport lazy component contract', () => {
  it('creates React.lazy components that use the filename as the export name', async () => {
    // This tests the core assumption: the component module exports a named export
    // matching the filename. If the file is AnimAlpha.tsx, the module must have
    // an export named "AnimAlpha".
    const onError = vi.fn()
    const result = buildGroupExport(
      groupMeta,
      {
        './framer/AnimAlpha.tsx': () =>
          Promise.resolve({
            AnimAlpha: memo(() =>
              createElement('div', { 'data-testid': 'anim-alpha' }, 'AnimAlpha rendered')
            ),
            OtherExport: () => 'wrong',
          }),
      },
      { './framer/AnimAlpha.meta.ts': { metadata: makeMeta('g__alpha') } },
      {},
      {}
    )

    const lazyComponent = result.framer['g__alpha']!.component
    // Verify it's a lazy component
    expect(lazyComponent).toHaveProperty('$$typeof', Symbol.for('react.lazy'))

    render(
      createElement(
        TestErrorBoundary,
        { onError },
        createElement(Suspense, { fallback: null }, createElement(lazyComponent))
      )
    )

    expect(await screen.findByTestId('anim-alpha')).toHaveTextContent('AnimAlpha rendered')
    expect(onError).not.toHaveBeenCalled()
  })

  it('throws a dev error when the expected named export is missing', async () => {
    const onError = vi.fn()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    try {
      const result = buildGroupExport(
        groupMeta,
        {
          './framer/NoExport.tsx': () => Promise.resolve({}),
        },
        { './framer/NoExport.meta.ts': { metadata: makeMeta('g__no-export') } },
        {},
        {}
      )

      render(
        createElement(
          TestErrorBoundary,
          { onError },
          createElement(
            Suspense,
            { fallback: null },
            createElement(result.framer['g__no-export']!.component)
          )
        )
      )

      await waitFor(() => expect(onError).toHaveBeenCalledOnce())
      const error = onError.mock.calls[0]![0] as Error

      expect(error.message).toContain('Invalid component export "NoExport"')
      expect(error.message).toContain('./framer/NoExport.tsx')
      expect(error.message).toContain('Available exports: (none)')
    } finally {
      consoleError.mockRestore()
    }
  })

  describe('collectHelperLoaders and shared pool merging', () => {
    it('includes exact CSS helper files in the shared pool', async () => {
      const helperCssLoader = vi.fn().mockResolvedValue('.mock-helper {}')

      const result = buildGroupExport(
        groupMeta,
        { './framer/RealAnim.tsx': () => Promise.resolve({ RealAnim: () => null }) },
        { './framer/RealAnim.meta.ts': { metadata: makeMeta('g__real-anim') } },
        {},
        {},
        {
          framerTsx: {
            './framer/RealAnim.tsx': vi
              .fn()
              .mockResolvedValue("import './shared.css'\nexport function RealAnim() {}"),
          },
          framerCss: { './framer/shared.css': helperCssLoader },
        }
      )

      const tabs = await resolveAnimationSource(result.framer['g__real-anim']!, undefined)
      expect(tabs.map((tab) => tab.label)).toEqual(['Component', 'shared.css'])
    })

    it('merges framer and css helper loaders into the same shared pool', () => {
      // Both framer/ and css/ may have helper files. These should be merged
      // so that resolveAnimationSource can find helpers from either subdir.
      const result = buildGroupExport(
        groupMeta,
        { './framer/AnimA.tsx': () => Promise.resolve({ AnimA: () => null }) },
        { './framer/AnimA.meta.ts': { metadata: makeMeta('g__a') } },
        { './css/AnimA.tsx': () => Promise.resolve({ AnimA: () => null }) },
        { './css/AnimA.meta.ts': { metadata: makeMeta('g__a') } },
        {
          framerTsx: {
            './framer/AnimA.tsx': vi.fn().mockResolvedValue('export function AnimA() {}'),
            './framer/CardPackOpenParts.tsx': vi.fn().mockResolvedValue('// framer helper'),
          },
          cssTsx: {
            './css/AnimA.tsx': vi.fn().mockResolvedValue('export function AnimA() {}'),
            './css/CardPackOpenParts.tsx': vi.fn().mockResolvedValue('// css helper'),
          },
        }
      )

      // Both variants should be registered
      expect(Object.keys(result.framer)).toEqual(['g__a'])
      expect(Object.keys(result.css)).toEqual(['g__a'])
    })

    it('last-write-wins when framer and css have identically-pathed helper files', () => {
      // If both framer/ and css/ contain ./CardPackOpenParts.tsx, the allShared merger
      // uses object spread: { ...shared, ...framerHelpers, ...cssHelpers }
      // css helpers overwrite framer helpers with the same path key
      const framerHelper = vi.fn().mockResolvedValue('framer version')
      const cssHelper = vi.fn().mockResolvedValue('css version')

      const result = buildGroupExport(
        groupMeta,
        { './framer/Anim.tsx': () => Promise.resolve({ Anim: () => null }) },
        { './framer/Anim.meta.ts': { metadata: makeMeta('g__anim') } },
        { './css/Anim.tsx': () => Promise.resolve({ Anim: () => null }) },
        { './css/Anim.meta.ts': { metadata: makeMeta('g__anim') } },
        {
          framerTsx: {
            './framer/Anim.tsx': vi.fn().mockResolvedValue('export function Anim() {}'),
            // Same relative path from framer/ subdir
            './framer/CardPackOpenParts.tsx': framerHelper,
          },
          cssTsx: {
            './css/Anim.tsx': vi.fn().mockResolvedValue('export function Anim() {}'),
            // Same relative path from css/ subdir — different key, so no collision
            './css/CardPackOpenParts.tsx': cssHelper,
          },
        }
      )

      // Both entries should exist. The paths differ (./framer/ vs ./css/)
      // so there is no actual collision in the allShared pool.
      expect(Object.keys(result.framer)).toEqual(['g__anim'])
      expect(Object.keys(result.css)).toEqual(['g__anim'])
    })
  })

  it('throws on duplicate animation IDs in dev mode', () => {
    // Duplicate animation IDs within a tech variant are a data integrity bug —
    // one animation silently disappears. The invariant check catches this at build time.
    expect(() =>
      buildGroupExport(
        groupMeta,
        {
          './framer/FirstVersion.tsx': () => Promise.resolve({ FirstVersion: () => null }),
          './framer/SecondVersion.tsx': () => Promise.resolve({ SecondVersion: () => null }),
        },
        {
          './framer/FirstVersion.meta.ts': {
            metadata: makeMeta('g__same-id', { title: 'First' }),
          },
          './framer/SecondVersion.meta.ts': {
            metadata: makeMeta('g__same-id', { title: 'Second' }),
          },
        },
        {},
        {}
      )
    ).toThrow(/Duplicate animation ID "g__same-id"/)
  })
})

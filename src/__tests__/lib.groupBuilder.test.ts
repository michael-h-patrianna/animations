import { buildGroupExport } from '@/lib/groupBuilder'
import type { AnimationMetadata, GroupMetadata } from '@/types/animation'
import { describe, expect, it } from 'vitest'

const groupMeta: GroupMetadata = { id: 'test-group', title: 'Test Group' }

function makeMeta(id: string, overrides?: Partial<AnimationMetadata>): AnimationMetadata {
  return { id, title: id, description: 'desc', tags: [], ...overrides }
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
    expect(result.framer['test-group__test-anim'].metadata.id).toBe('test-group__test-anim')
    // Component should be a React.lazy object
    expect(result.framer['test-group__test-anim'].component).toHaveProperty(
      '$$typeof',
      Symbol.for('react.lazy')
    )
  })

  it('skips files matching SKIP_PATTERN', () => {
    const components = {
      './framer/MockContent.tsx': () => Promise.resolve({ MockContent: () => null }),
      './framer/SharedParts.tsx': () => Promise.resolve({ SharedParts: () => null }),
      './framer/IndexHelper.tsx': () => Promise.resolve({ IndexHelper: () => null }),
      './framer/RealAnim.tsx': () => Promise.resolve({ RealAnim: () => null }),
    }
    const meta = {
      './framer/MockContent.meta.ts': { metadata: makeMeta('g__mock-content') },
      './framer/SharedParts.meta.ts': { metadata: makeMeta('g__shared-parts') },
      './framer/IndexHelper.meta.ts': { metadata: makeMeta('g__index-helper') },
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

  it('skips files matching each segment of SKIP_PATTERN', () => {
    const cases: Array<{ name: string; shouldSkip: boolean }> = [
      { name: 'MockContent', shouldSkip: true }, // ^Mock
      { name: 'SharedLayout', shouldSkip: true }, // ^Shared
      { name: 'PremiumCard', shouldSkip: true }, // ^Premium
      { name: 'BurstComponents', shouldSkip: true }, // .*Components
      { name: 'cardSets', shouldSkip: true }, // .*cardSets
      { name: 'fireworkModel', shouldSkip: true }, // .*fireworkModel
      { name: 'FieldHelper', shouldSkip: true }, // .*Helper
      { name: 'LayoutParts', shouldSkip: true }, // .*Parts
      { name: 'indexSomething', shouldSkip: true }, // ^index
      { name: 'utils', shouldSkip: true }, // .*utils
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

      const anim = result.framer['g__full']
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

      const anim = result.framer['g__minimal']
      // Only expected keys should be present — no optional fields added
      expect(Object.keys(anim.metadata).sort()).toEqual(['description', 'id', 'tags', 'title'])
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
})

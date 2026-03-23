/**
 * Isolated unit tests for buildCatalog's internal sorting behavior (toAnimations).
 *
 * These tests mock the animationRegistry to inject controlled data, verifying
 * that the order metadata field correctly determines animation sequence within
 * groups. This complements the integration-style tests in services.animationData.test.ts.
 */
import type { AnimationMetadata, CategoryExport } from '@/types/animation'
import { describe, expect, it, vi } from 'vitest'

function makeExport(id: string, order?: number) {
  return {
    component: (() => null) as unknown as React.ComponentType<Record<string, unknown>>,
    metadata: {
      id,
      title: id,
      description: `Description for ${id}`,
      ...(order !== undefined ? { order } : {}),
    } satisfies AnimationMetadata,
  }
}

function makeCategories(
  framerExports: Record<string, ReturnType<typeof makeExport>>
): Record<string, CategoryExport> {
  return {
    test: {
      metadata: { id: 'test', title: 'Test' },
      groups: {
        'test-group': {
          metadata: { id: 'test-group', title: 'Test Group' },
          framer: framerExports,
          css: {},
        },
      },
    },
  }
}

describe('buildCatalog sorting (isolated)', () => {
  it('sorts animations by ascending order value', async () => {
    const mockCategories = makeCategories({
      g__third: makeExport('g__third', 3),
      g__first: makeExport('g__first', 1),
      g__second: makeExport('g__second', 2),
    })

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    const { buildCatalog } = await import('@/services/animationData')

    const catalog = buildCatalog()
    const group = catalog[0]!.groups[0]!
    const ids = group.animations.map((a) => a.id)

    expect(ids).toEqual(['g__first', 'g__second', 'g__third'])

    vi.doUnmock('@/components/animationRegistry')
  })

  it('animations with no order field default to 0 and sort after negative-order animations', async () => {
    const mockCategories = makeCategories({
      'g__default-b': makeExport('g__default-b'), // order undefined → 0
      g__negative: makeExport('g__negative', -1),
      'g__default-a': makeExport('g__default-a'), // order undefined → 0
    })

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const catalog = buildCatalog()
    const ids = catalog[0]!.groups[0]!.animations.map((a) => a.id)

    // Negative order comes first; default-order animations maintain their relative insertion order
    expect(ids[0]).toBe('g__negative')
    // The two default-order animations follow (order among equals depends on Object.values order)
    expect(ids.slice(1).sort()).toEqual(['g__default-a', 'g__default-b'])

    vi.doUnmock('@/components/animationRegistry')
  })

  it('negative order values sort before zero and positive', async () => {
    const mockCategories = makeCategories({
      g__positive: makeExport('g__positive', 5),
      g__negative: makeExport('g__negative', -5),
      g__zero: makeExport('g__zero', 0),
    })

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const catalog = buildCatalog()
    const ids = catalog[0]!.groups[0]!.animations.map((a) => a.id)

    expect(ids).toEqual(['g__negative', 'g__zero', 'g__positive'])

    vi.doUnmock('@/components/animationRegistry')
  })

  it('equal order values preserve relative position (sort stability)', async () => {
    // All have the same order — sort should be stable (preserve Object.values order)
    const mockCategories = makeCategories({
      g__alpha: makeExport('g__alpha', 1),
      g__beta: makeExport('g__beta', 1),
      g__gamma: makeExport('g__gamma', 1),
    })

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const catalog = buildCatalog()
    const ids = catalog[0]!.groups[0]!.animations.map((a) => a.id)

    // With identical order values, Object.values insertion order is preserved
    // by Array.prototype.sort's stability guarantee (ES2019+)
    expect(ids).toEqual(['g__alpha', 'g__beta', 'g__gamma'])

    vi.doUnmock('@/components/animationRegistry')
  })

  it('empty exports produce a group with zero animations (filtered out by toGroup)', async () => {
    const mockCategories = makeCategories({})

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const catalog = buildCatalog()
    // toGroup returns null for empty exports → flatMap filters it out
    expect(catalog[0]!.groups).toHaveLength(0)

    vi.doUnmock('@/components/animationRegistry')
  })

  it('single animation produces a valid group with one entry', async () => {
    const mockCategories = makeCategories({
      g__solo: makeExport('g__solo'),
    })

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const catalog = buildCatalog()
    const group = catalog[0]!.groups[0]!
    expect(group.animations).toHaveLength(1)
    expect(group.animations[0]!.id).toBe('g__solo')

    vi.doUnmock('@/components/animationRegistry')
  })

  it('URL slugs use the base group ID (without tech suffix) and encode the animation ID', async () => {
    const mockCategories = makeCategories({
      'g__anim-with-special': makeExport('g__anim-with-special'),
    })

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const catalog = buildCatalog()
    const anim = catalog[0]!.groups[0]!.animations[0]!

    expect(anim.urlSlugFramer).toBe('/test-group-framer?animation=g__anim-with-special')
    expect(anim.urlSlugCss).toBe('/test-group-css?animation=g__anim-with-special')

    vi.doUnmock('@/components/animationRegistry')
  })

  it('group title includes tech suffix: (Framer) or (CSS)', async () => {
    const mockCategories: Record<string, CategoryExport> = {
      test: {
        metadata: { id: 'test', title: 'Test' },
        groups: {
          'my-group': {
            metadata: { id: 'my-group', title: 'My Group' },
            framer: { g__a: makeExport('g__a') },
            css: { g__a: makeExport('g__a') },
          },
        },
      },
    }

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const catalog = buildCatalog()
    const groups = catalog[0]!.groups
    expect(groups).toHaveLength(2)
    expect(groups[0]!.title).toBe('My Group (Framer)')
    expect(groups[0]!.tech).toBe('framer')
    expect(groups[1]!.title).toBe('My Group (CSS)')
    expect(groups[1]!.tech).toBe('css')

    vi.doUnmock('@/components/animationRegistry')
  })

  it('propagates all optional metadata fields to Animation objects', async () => {
    const mockCategories = makeCategories({
      g__full: {
        component: (() => null) as unknown as React.ComponentType<Record<string, unknown>>,
        metadata: {
          id: 'g__full',
          title: 'Full',
          description: 'Fully configured',
          disableReplay: true,
          infinite: true,
          controls: 'lights',
          prizeCountMax: 5,
          previewPosition: 'top-left',
          tier: 3,
          demoMode: 'burst',
          previewMaxWidth: 400,
          order: 1,
        },
      },
    })

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const anim = buildCatalog()[0]!.groups[0]!.animations[0]!
    expect(anim.disableReplay).toBe(true)
    expect(anim.infinite).toBe(true)
    expect(anim.controls).toBe('lights')
    expect(anim.prizeCountMax).toBe(5)
    expect(anim.previewPosition).toBe('top-left')
    expect(anim.tier).toBe(3)
    expect(anim.demoMode).toBe('burst')
    expect(anim.previewMaxWidth).toBe(400)

    vi.doUnmock('@/components/animationRegistry')
  })

  it('categoryId and groupId are correctly set on each animation', async () => {
    const mockCategories: Record<string, CategoryExport> = {
      'my-cat': {
        metadata: { id: 'my-cat', title: 'My Category' },
        groups: {
          'my-grp': {
            metadata: { id: 'my-grp', title: 'My Group' },
            framer: { 'my-grp__anim': makeExport('my-grp__anim') },
            css: {},
          },
        },
      },
    }

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const anim = buildCatalog()[0]!.groups[0]!.animations[0]!
    expect(anim.categoryId).toBe('my-cat')
    expect(anim.groupId).toBe('my-grp-framer')

    vi.doUnmock('@/components/animationRegistry')
  })

  it('URL slugs correctly encode animation IDs with URL-special characters', async () => {
    // If an animation ID ever contained characters that are special in URLs
    // (spaces, ampersands, etc.), encodeURIComponent must encode them.
    // Current IDs use only [a-z0-9-_] which don't need encoding, but this
    // verifies the encodeURIComponent call is actually present and working.
    const mockCategories = makeCategories({
      'g__has spaces & symbols': makeExport('g__has spaces & symbols'),
    })

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const catalog = buildCatalog()
    const anim = catalog[0]!.groups[0]!.animations[0]!

    // encodeURIComponent('g__has spaces & symbols') → 'g__has%20spaces%20%26%20symbols'
    const encoded = encodeURIComponent('g__has spaces & symbols')
    expect(anim.urlSlugFramer).toBe(`/test-group-framer?animation=${encoded}`)
    expect(anim.urlSlugCss).toBe(`/test-group-css?animation=${encoded}`)

    vi.doUnmock('@/components/animationRegistry')
  })

  it('handles demo metadata field (does not appear in Animation, just passes through)', async () => {
    const mockCategories: Record<string, CategoryExport> = {
      test: {
        metadata: { id: 'test', title: 'Test' },
        groups: {
          'test-group': {
            metadata: { id: 'test-group', title: 'Test Group', demo: 'Group demo description' },
            framer: { g__a: makeExport('g__a') },
            css: {},
          },
        },
      },
    }

    vi.doMock('@/components/animationRegistry', () => ({ categories: mockCategories }))
    vi.resetModules()
    const { buildCatalog } = await import('@/services/animationData')

    const catalog = buildCatalog()
    const group = catalog[0]!.groups[0]!
    expect(group.demo).toBe('Group demo description')

    vi.doUnmock('@/components/animationRegistry')
  })
})

import {
  clearGroupCache,
  declareCategoryGroups,
  isGroupCached,
  loadLazyGroup,
  preloadLazyGroup,
} from '@/lib/lazyGroupRegistry'
import type { GroupExport, GroupMetadata } from '@/types/animation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Use a synthetic category isolated from production registrations so the
// test can control loader success/failure deterministically.
const TEST_CATEGORY = '__lazy-cache-test__'

function buildEmptyGroupExport(metadata: GroupMetadata): GroupExport {
  return { metadata, framer: {}, css: {} }
}

describe('loadLazyGroup cache invariants', () => {
  const metadata: GroupMetadata = { id: 'retry-fixture', title: 'Retry Fixture' }
  let attempt = 0
  let behavior: 'fail' | 'succeed' = 'fail'

  beforeEach(() => {
    attempt = 0
    behavior = 'fail'

    declareCategoryGroups(TEST_CATEGORY, 'Cache Test', [
      {
        metadata,
        load: () => {
          attempt += 1
          return behavior === 'fail'
            ? Promise.reject(new Error(`load failure #${attempt}`))
            : Promise.resolve({ groupExport: buildEmptyGroupExport(metadata) })
        },
      },
    ])
  })

  afterEach(() => {
    clearGroupCache()
    vi.unstubAllEnvs()
  })

  it('evicts the cache entry on failure so the next call re-invokes the loader', async () => {
    await expect(loadLazyGroup('retry-fixture-framer')).rejects.toThrow('load failure #1')
    expect(isGroupCached('retry-fixture-framer')).toBe(false)

    behavior = 'succeed'
    const result = await loadLazyGroup('retry-fixture-framer')

    expect(attempt).toBe(2) // 1 failure + 1 retry — no re-subscription to the poisoned promise
    expect(result.group.id).toBe('retry-fixture-framer')
    expect(isGroupCached('retry-fixture-framer')).toBe(true)
  })

  it('deduplicates concurrent callers to a single in-flight loader invocation', async () => {
    behavior = 'succeed'

    const [a, b, c] = await Promise.all([
      loadLazyGroup('retry-fixture-framer'),
      loadLazyGroup('retry-fixture-framer'),
      loadLazyGroup('retry-fixture-framer'),
    ])

    expect(attempt).toBe(1)
    expect(a).toBe(b)
    expect(b).toBe(c)
  })

  it('preloadLazyGroup swallows failures and also evicts the cache', async () => {
    preloadLazyGroup('retry-fixture-framer')

    // Wait for the rejection + eviction to complete before asserting.
    await vi.waitFor(() => {
      expect(isGroupCached('retry-fixture-framer')).toBe(false)
    })
    expect(attempt).toBe(1)

    behavior = 'succeed'
    const result = await loadLazyGroup('retry-fixture-framer')
    expect(result.group.id).toBe('retry-fixture-framer')
  })

  it('throws synchronously-rejecting if no loader is registered for the id', async () => {
    await expect(loadLazyGroup('does-not-exist-framer')).rejects.toThrow(
      /No loader registered for "does-not-exist-framer"/
    )
  })
})

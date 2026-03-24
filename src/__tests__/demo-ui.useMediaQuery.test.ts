import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  BREAKPOINTS,
  useBreakpoint,
  useIsDesktop,
  useIsMobile,
  useMediaQuery,
} from '@/demo-ui/hooks/useMediaQuery'

/**
 * Tests for useMediaQuery and derived hooks.
 *
 * happy-dom's matchMedia returns { matches: false } by default and does not
 * dynamically respond to viewport changes. We mock matchMedia to control
 * match state and verify subscription behavior.
 */

type MockMediaQueryList = {
  matches: boolean
  media: string
  addEventListener: ReturnType<typeof vi.fn>
  removeEventListener: ReturnType<typeof vi.fn>
  // Legacy methods (not used by hook but required by type)
  addListener: ReturnType<typeof vi.fn>
  removeListener: ReturnType<typeof vi.fn>
  onchange: null
  dispatchEvent: ReturnType<typeof vi.fn>
}

function createMockMediaQueryList(query: string, matches: boolean): MockMediaQueryList {
  return {
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  }
}

describe('useMediaQuery', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    vi.restoreAllMocks()
  })

  it('returns true when the media query matches', () => {
    const mockMql = createMockMediaQueryList('(min-width: 1024px)', true)
    window.matchMedia = vi.fn().mockReturnValue(mockMql)

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'))
    expect(result.current).toBe(true)
  })

  it('returns false when the media query does not match', () => {
    const mockMql = createMockMediaQueryList('(min-width: 1024px)', false)
    window.matchMedia = vi.fn().mockReturnValue(mockMql)

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'))
    expect(result.current).toBe(false)
  })

  it('subscribes to change events on mount', () => {
    const mockMql = createMockMediaQueryList('(min-width: 768px)', false)
    window.matchMedia = vi.fn().mockReturnValue(mockMql)

    renderHook(() => useMediaQuery('(min-width: 768px)'))

    expect(mockMql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('unsubscribes from change events on unmount', () => {
    const mockMql = createMockMediaQueryList('(min-width: 768px)', false)
    window.matchMedia = vi.fn().mockReturnValue(mockMql)

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    unmount()

    expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('re-subscribes when the query string changes', () => {
    const mql1 = createMockMediaQueryList('(min-width: 768px)', false)
    const mql2 = createMockMediaQueryList('(min-width: 1024px)', true)

    window.matchMedia = vi.fn((query: string) => {
      return query === '(min-width: 768px)' ? mql1 : mql2
    }) as unknown as typeof window.matchMedia

    const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(min-width: 768px)' },
    })

    expect(result.current).toBe(false)

    rerender({ query: '(min-width: 1024px)' })

    // Should have unsubscribed from old query and subscribed to new one
    expect(mql1.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    expect(mql2.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    expect(result.current).toBe(true)
  })

  it('updates when the media query match state changes', () => {
    let currentMatches = false
    const listeners: Array<() => void> = []

    const mockMql = {
      get matches() {
        return currentMatches
      },
      media: '(min-width: 768px)',
      addEventListener: vi.fn((_event: string, cb: () => void) => {
        listeners.push(cb)
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }

    window.matchMedia = vi.fn().mockReturnValue(mockMql)

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)

    // Simulate viewport resize crossing the breakpoint
    currentMatches = true
    act(() => {
      for (const listener of listeners) {
        listener()
      }
    })

    expect(result.current).toBe(true)
  })

  it('passes the exact query string to matchMedia', () => {
    const mockMql = createMockMediaQueryList('(max-height: 500px)', false)
    window.matchMedia = vi.fn().mockReturnValue(mockMql)

    renderHook(() => useMediaQuery('(max-height: 500px)'))

    // matchMedia is called in both subscribe and getSnapshot
    const calls = (window.matchMedia as ReturnType<typeof vi.fn>).mock.calls
    expect(calls.some((call: string[]) => call[0] === '(max-height: 500px)')).toBe(true)
  })
})

describe('useBreakpoint', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('uses the correct media query for each breakpoint', () => {
    window.matchMedia = vi.fn((query: string) =>
      createMockMediaQueryList(query, false)
    ) as unknown as typeof window.matchMedia

    for (const [bp, query] of Object.entries(BREAKPOINTS)) {
      renderHook(() => useBreakpoint(bp as keyof typeof BREAKPOINTS))

      const calls = (window.matchMedia as ReturnType<typeof vi.fn>).mock.calls
      expect(
        calls.some((call: string[]) => call[0] === query),
        `useBreakpoint("${bp}") should use query "${query}"`
      ).toBe(true)
    }
  })

  it('returns true when breakpoint is met', () => {
    window.matchMedia = vi
      .fn()
      .mockReturnValue(
        createMockMediaQueryList('(min-width: 1024px)', true)
      ) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useBreakpoint('lg'))
    expect(result.current).toBe(true)
  })

  it('returns false when breakpoint is not met', () => {
    window.matchMedia = vi
      .fn()
      .mockReturnValue(
        createMockMediaQueryList('(min-width: 1024px)', false)
      ) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useBreakpoint('lg'))
    expect(result.current).toBe(false)
  })
})

describe('useIsMobile', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('returns true when viewport is below md breakpoint', () => {
    // md is (min-width: 768px) — when it does NOT match, we're mobile
    window.matchMedia = vi
      .fn()
      .mockReturnValue(
        createMockMediaQueryList(BREAKPOINTS.md, false)
      ) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('returns false when viewport is at or above md breakpoint', () => {
    window.matchMedia = vi
      .fn()
      .mockReturnValue(
        createMockMediaQueryList(BREAKPOINTS.md, true)
      ) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})

describe('useIsDesktop', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('returns true when viewport is at or above lg breakpoint', () => {
    window.matchMedia = vi
      .fn()
      .mockReturnValue(
        createMockMediaQueryList(BREAKPOINTS.lg, true)
      ) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useIsDesktop())
    expect(result.current).toBe(true)
  })

  it('returns false when viewport is below lg breakpoint', () => {
    window.matchMedia = vi
      .fn()
      .mockReturnValue(
        createMockMediaQueryList(BREAKPOINTS.lg, false)
      ) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useIsDesktop())
    expect(result.current).toBe(false)
  })
})

describe('BREAKPOINTS constant', () => {
  it('contains exactly the expected breakpoint keys', () => {
    expect(Object.keys(BREAKPOINTS).sort()).toEqual(['2xl', 'lg', 'md', 'sm', 'xl'])
  })

  it('all breakpoint values are min-width media queries', () => {
    for (const [key, value] of Object.entries(BREAKPOINTS)) {
      expect(value, `${key} should be a min-width query`).toMatch(/^\(min-width: \d+px\)$/)
    }
  })

  it('breakpoint widths are strictly ascending', () => {
    const widths = Object.values(BREAKPOINTS).map((q) => {
      const match = q.match(/(\d+)px/)
      return match ? parseInt(match[1]!, 10) : 0
    })

    for (let i = 1; i < widths.length; i++) {
      expect(
        widths[i],
        `Breakpoint at index ${i} (${widths[i]}px) should be > index ${i - 1} (${widths[i - 1]}px)`
      ).toBeGreaterThan(widths[i - 1]!)
    }
  })
})

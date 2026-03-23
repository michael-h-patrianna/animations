/**
 * Media Query Hooks
 * Provides reactive media query matching for responsive layouts.
 */

import { useEffect, useState } from 'react'

/** Named responsive breakpoint identifiers. */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/** Min-width media queries for each breakpoint. */
export const BREAKPOINTS: Record<Breakpoint, string> = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
}

/** Reactively matches a CSS media query string. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}

/** Returns true if the viewport is at or above the given breakpoint. */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(BREAKPOINTS[breakpoint])
}

/** Returns true if the viewport is below the `md` breakpoint (mobile). */
export function useIsMobile(): boolean {
  return !useMediaQuery(BREAKPOINTS.md)
}

/** Returns true if the viewport is at or above the `lg` breakpoint (desktop). */
export function useIsDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.lg)
}

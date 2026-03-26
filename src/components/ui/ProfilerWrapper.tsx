/**
 * Conditional React.Profiler wrapper for dev-mode render timing.
 *
 * In dev mode: wraps children with `<Profiler>` and forwards timing data
 * via the `onRender` callback from `useRenderProfile`.
 *
 * In production: renders children directly with zero overhead (no Profiler in tree).
 */

import { Profiler, type ReactNode } from 'react'

interface ProfilerWrapperProps {
  /** Profiler ID — typically the animation or component ID. */
  id: string
  /** Callback from useRenderProfile.onRender. */
  onRender: (
    id: string,
    phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number,
    baseDuration: number
  ) => void
  children: ReactNode
}

/** Wraps children in React.Profiler during development, passes through in production. */
export function ProfilerWrapper({ id, onRender, children }: ProfilerWrapperProps) {
  if (!import.meta.env.DEV) {
    return <>{children}</>
  }

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  )
}

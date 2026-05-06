import { useCssReducedMotionCallback } from '@/utils/useCssReducedMotionCallback'
import { render } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

function ReducedMotionProbe({ onComplete }: { onComplete?: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useCssReducedMotionCallback(ref, onComplete)
  return <div ref={ref} data-testid="probe" />
}

describe('useCssReducedMotionCallback', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    vi.restoreAllMocks()
  })

  it('fires completion immediately when the OS reduced-motion query matches', () => {
    const onComplete = vi.fn()
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })

    render(<ReducedMotionProbe onComplete={onComplete} />)

    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('fires completion when a catalog reduced-motion ancestor is present', () => {
    const onComplete = vi.fn()
    window.matchMedia = vi.fn().mockReturnValue({ matches: false })

    render(
      <div data-reduced-motion="reduce">
        <ReducedMotionProbe onComplete={onComplete} />
      </div>
    )

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('fires at most once across rerenders while reduced motion stays active', () => {
    const onComplete = vi.fn()
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })

    const { rerender } = render(<ReducedMotionProbe onComplete={onComplete} />)
    rerender(<ReducedMotionProbe onComplete={onComplete} />)

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('does not fire without reduced motion or without a callback', () => {
    const onComplete = vi.fn()
    window.matchMedia = vi.fn().mockReturnValue({ matches: false })

    render(<ReducedMotionProbe onComplete={onComplete} />)
    render(<ReducedMotionProbe />)

    expect(onComplete).not.toHaveBeenCalled()
  })
})

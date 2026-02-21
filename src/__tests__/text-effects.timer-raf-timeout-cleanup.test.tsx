import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TextEffectsComboCounter as CssTextEffectsComboCounter } from '@/components/base/text-effects/css/TextEffectsComboCounter'
import { TextEffectsXpNumberPop as CssTextEffectsXpNumberPop } from '@/components/base/text-effects/css/TextEffectsXpNumberPop'
import { TextEffectsCounterIncrement as FramerTextEffectsCounterIncrement } from '@/components/base/text-effects/framer/TextEffectsCounterIncrement'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

function assertNoLeakedTimersAfterUnmount(
  Component: () => JSX.Element,
  options?: { advanceBeforeUnmountMs?: number }
) {
  const { unmount } = render(<Component />)

  if (options?.advanceBeforeUnmountMs) {
    act(() => {
      vi.advanceTimersByTime(options.advanceBeforeUnmountMs as number)
    })
  }

  unmount()

  expect(vi.getTimerCount()).toBe(0)

  act(() => {
    vi.runOnlyPendingTimers()
  })

  expect(vi.getTimerCount()).toBe(0)
}

describe('text-effects timer/raf cleanup', () => {
  it('cleans up CSS combo-counter RAF loop on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssTextEffectsComboCounter)
  })

  it('cleans up CSS xp-number-pop RAF loop on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssTextEffectsXpNumberPop)
  })

  it('cleans up Framer counter-increment nested timeouts on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerTextEffectsCounterIncrement, {
      advanceBeforeUnmountMs: 100,
    })
  })
})

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ButtonEffectsRipple as CssButtonEffectsRipple } from '@/components/base/button-effects/css/ButtonEffectsRipple'
import { ButtonEffectsShockwave as CssButtonEffectsShockwave } from '@/components/base/button-effects/css/ButtonEffectsShockwave'
import { ButtonEffectsRipple as FramerButtonEffectsRipple } from '@/components/base/button-effects/framer/ButtonEffectsRipple'
import { ButtonEffectsShockwave as FramerButtonEffectsShockwave } from '@/components/base/button-effects/framer/ButtonEffectsShockwave'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

function assertNoLeakedTimeoutsAfterClickUnmount(
  Component: () => JSX.Element,
  options?: { buttonName?: RegExp | string }
) {
  const { unmount } = render(<Component />)

  const button = screen.getByRole('button', {
    name: options?.buttonName ?? /click me|ripple button/i,
  })

  act(() => {
    fireEvent.click(button, { clientX: 16, clientY: 12 })
  })

  // Verify click scheduled delayed cleanup timer before unmount.
  expect(vi.getTimerCount()).toBeGreaterThan(0)

  unmount()

  expect(vi.getTimerCount()).toBe(0)

  act(() => {
    vi.runOnlyPendingTimers()
  })

  expect(vi.getTimerCount()).toBe(0)
}

describe('button-effects timeout cleanup', () => {
  it('cleans up CSS ripple timeout on unmount', () => {
    assertNoLeakedTimeoutsAfterClickUnmount(CssButtonEffectsRipple, { buttonName: /click me/i })
  })

  it('cleans up CSS shockwave timeout on unmount', () => {
    assertNoLeakedTimeoutsAfterClickUnmount(CssButtonEffectsShockwave, { buttonName: /click me/i })
  })

  it('cleans up Framer ripple timeout on unmount', () => {
    assertNoLeakedTimeoutsAfterClickUnmount(FramerButtonEffectsRipple, {
      buttonName: /ripple button/i,
    })
  })

  it('cleans up Framer shockwave timeout on unmount', () => {
    assertNoLeakedTimeoutsAfterClickUnmount(FramerButtonEffectsShockwave, {
      buttonName: /click me/i,
    })
  })
})

import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { TextEffectsComboCounter as CssTextEffectsComboCounter } from '@/components/base/text-effects/css/TextEffectsComboCounter'
import { TextEffectsXpNumberPop as CssTextEffectsXpNumberPop } from '@/components/base/text-effects/css/TextEffectsXpNumberPop'
import { TextEffectsCounterIncrement as FramerTextEffectsCounterIncrement } from '@/components/base/text-effects/framer/TextEffectsCounterIncrement'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

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

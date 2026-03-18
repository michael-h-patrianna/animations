import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { ProgressBarsProgressBounce as CssProgressBarsProgressBounce } from '@/components/progress/progress-bars/css/ProgressBarsProgressBounce'
import { ProgressBarsProgressBounce as FramerProgressBarsProgressBounce } from '@/components/progress/progress-bars/framer/ProgressBarsProgressBounce'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('progress-bars progress-bounce timer cleanup', () => {
  it('cleans up CSS progress-bounce timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssProgressBarsProgressBounce)
  })

  it('cleans up Framer progress-bounce timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerProgressBarsProgressBounce)
  })
})

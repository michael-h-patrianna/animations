import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { CollectionEffectsCoinBurst as CssCoinBurst } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinBurst'
import { CollectionEffectsCoinMagnet as CssCoinMagnet } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinMagnet'
import { CollectionEffectsCoinTrail as CssCoinTrail } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinTrail'
import { CollectionEffectsCoinBurst as FramerCoinBurst } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst'
import { CollectionEffectsCoinMagnet as FramerCoinMagnet } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinMagnet'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('rewards collection-effects timer cleanup', () => {
  it('cleans up CSS coin-burst timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssCoinBurst, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up Framer coin-burst timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerCoinBurst, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up CSS coin-magnet timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssCoinMagnet, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up Framer coin-magnet timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerCoinMagnet, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up CSS coin-trail timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssCoinTrail, { advanceBeforeUnmountMs: 2000 })
  })
})

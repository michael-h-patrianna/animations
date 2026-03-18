import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { PrizeRevealArcanePortal as CssArcanePortal } from '@/components/rewards/prize-reveal/css/PrizeRevealArcanePortal'
import { PrizeRevealChestGcSc as CssChestGcSc } from '@/components/rewards/prize-reveal/css/PrizeRevealChestGcSc'
import { PrizeRevealCrystalShatter as CssCrystalShatter } from '@/components/rewards/prize-reveal/css/PrizeRevealCrystalShatter'
import { PrizeRevealPirateChestNoWin as CssPirateNoWin } from '@/components/rewards/prize-reveal/css/PrizeRevealPirateChestNoWin'
import { PrizeRevealPirateChestWin as CssPirateWin } from '@/components/rewards/prize-reveal/css/PrizeRevealPirateChestWin'
import { PrizeRevealArcanePortal as FramerArcanePortal } from '@/components/rewards/prize-reveal/framer/PrizeRevealArcanePortal'
import { PrizeRevealChestGcSc as FramerChestGcSc } from '@/components/rewards/prize-reveal/framer/PrizeRevealChestGcSc'
import { PrizeRevealCrystalShatter as FramerCrystalShatter } from '@/components/rewards/prize-reveal/framer/PrizeRevealCrystalShatter'
import { PrizeRevealPirateChestNoWin as FramerPirateNoWin } from '@/components/rewards/prize-reveal/framer/PrizeRevealPirateChestNoWin'
import { PrizeRevealPirateChestWin as FramerPirateWin } from '@/components/rewards/prize-reveal/framer/PrizeRevealPirateChestWin'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('prize-reveal timer cleanup', () => {
  it('cleans up CSS arcane-portal timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssArcanePortal, { advanceBeforeUnmountMs: 5000 })
  })

  it('cleans up Framer arcane-portal timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerArcanePortal, { advanceBeforeUnmountMs: 5000 })
  })

  it('cleans up CSS chest-gc-sc timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssChestGcSc, { advanceBeforeUnmountMs: 5000 })
  })

  it('cleans up Framer chest-gc-sc timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerChestGcSc, { advanceBeforeUnmountMs: 5000 })
  })

  it('cleans up CSS crystal-shatter timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssCrystalShatter, { advanceBeforeUnmountMs: 5000 })
  })

  it('cleans up Framer crystal-shatter timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerCrystalShatter, { advanceBeforeUnmountMs: 5000 })
  })

  it('cleans up CSS pirate-chest-no-win timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssPirateNoWin, { advanceBeforeUnmountMs: 5000 })
  })

  it('cleans up Framer pirate-chest-no-win timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerPirateNoWin, { advanceBeforeUnmountMs: 5000 })
  })

  it('cleans up CSS pirate-chest-win timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssPirateWin, { advanceBeforeUnmountMs: 5000 })
  })

  it('cleans up Framer pirate-chest-win timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerPirateWin, { advanceBeforeUnmountMs: 5000 })
  })
})

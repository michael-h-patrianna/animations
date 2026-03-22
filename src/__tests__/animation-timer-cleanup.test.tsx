/**
 * Consolidated timer leak tests for all animation components that use
 * setTimeout, setInterval, or requestAnimationFrame.
 *
 * Each entry renders the component, optionally advances fake timers to trigger
 * timer-scheduling code paths, then unmounts and asserts zero pending timers.
 * This catches leaked handles that would accumulate across mount/unmount cycles
 * or cause memory leaks in production.
 *
 * Previously spread across 11 test files with identical boilerplate. Consolidated
 * into a data-driven loop for maintainability. Adding a new component requires
 * only adding an entry to the TIMER_COMPONENTS array.
 */
import type React from 'react'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

// ── Progress bars ────────────────────────────────────────────────────────

import { ProgressBarsCelebrationBurst as CssCelebrationBurst } from '@/components/progress/progress-bars/css/ProgressBarsCelebrationBurst'
import { ProgressBarsProgressBounce as CssProgressBounce } from '@/components/progress/progress-bars/css/ProgressBarsProgressBounce'
import { ProgressBarsProgressMilestones as CssProgressMilestones } from '@/components/progress/progress-bars/css/ProgressBarsProgressMilestones'
import { ProgressBarsProgressSegmented as CssProgressSegmented } from '@/components/progress/progress-bars/css/ProgressBarsProgressSegmented'
import { ProgressBarsProgressThin as CssProgressThin } from '@/components/progress/progress-bars/css/ProgressBarsProgressThin'
import { ProgressBarsProgressBounce as FramerProgressBounce } from '@/components/progress/progress-bars/framer/ProgressBarsProgressBounce'
import { ProgressBarsProgressSegmented as FramerProgressSegmented } from '@/components/progress/progress-bars/framer/ProgressBarsProgressSegmented'
import { ProgressBarsProgressThin as FramerProgressThin } from '@/components/progress/progress-bars/framer/ProgressBarsProgressThin'

// ── Realtime data ────────────────────────────────────────────────────────

import { RealtimeDataLeaderboardShift as CssLeaderboardShift } from '@/components/realtime/realtime-data/css/RealtimeDataLeaderboardShift'
import { RealtimeDataLiveScoreUpdate as CssLiveScoreUpdate } from '@/components/realtime/realtime-data/css/RealtimeDataLiveScoreUpdate'
import { RealtimeDataStackedRealtime as CssStackedRealtime } from '@/components/realtime/realtime-data/css/RealtimeDataStackedRealtime'
import { RealtimeDataLeaderboardShift as FramerLeaderboardShift } from '@/components/realtime/realtime-data/framer/RealtimeDataLeaderboardShift'
import { RealtimeDataLiveScoreUpdate as FramerLiveScoreUpdate } from '@/components/realtime/realtime-data/framer/RealtimeDataLiveScoreUpdate'
import { RealtimeDataStackedRealtime as FramerStackedRealtime } from '@/components/realtime/realtime-data/framer/RealtimeDataStackedRealtime'

// ── Timer effects ────────────────────────────────────────────────────────

import { TimerEffectsPillCountdownExtreme as CssPillExtreme } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownExtreme'
import { TimerEffectsPillCountdownGlitch as CssPillGlitch } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownGlitch'
import { TimerEffectsPillCountdownHeartbeat as CssPillHeartbeat } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownHeartbeat'
import { TimerEffectsPillCountdownMedium as CssPillMedium } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownMedium'
import { TimerEffectsPillCountdownSoft as CssPillSoft } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownSoft'
import { TimerEffectsPillCountdownStrong as CssPillStrong } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownStrong'
import { TimerEffectsTimerFlash as CssTimerFlash } from '@/components/realtime/timer-effects/css/TimerEffectsTimerFlash'
import { TimerEffectsTimerFlashSoft as CssTimerFlashSoft } from '@/components/realtime/timer-effects/css/TimerEffectsTimerFlashSoft'
import { TimerEffectsTimerPulse as CssTimerPulse } from '@/components/realtime/timer-effects/css/TimerEffectsTimerPulse'
import { TimerEffectsPillCountdownExtreme as FramerPillExtreme } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownExtreme'
import { TimerEffectsPillCountdownGlitch as FramerPillGlitch } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownGlitch'
import { TimerEffectsPillCountdownHeartbeat as FramerPillHeartbeat } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownHeartbeat'
import { TimerEffectsPillCountdownMedium as FramerPillMedium } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownMedium'
import { TimerEffectsPillCountdownSoft as FramerPillSoft } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownSoft'
import { TimerEffectsPillCountdownStrong as FramerPillStrong } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownStrong'
import { TimerEffectsTimerFlash as FramerTimerFlash } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerFlash'
import { TimerEffectsTimerFlashSoft as FramerTimerFlashSoft } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerFlashSoft'
import { TimerEffectsTimerPulse as FramerTimerPulse } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerPulse'

// ── Update indicators ────────────────────────────────────────────────────

import { UpdateIndicatorsBadgePop as CssBadgePop } from '@/components/realtime/update-indicators/css/UpdateIndicatorsBadgePop'
import { UpdateIndicatorsBadgePulse as CssBadgePulse } from '@/components/realtime/update-indicators/css/UpdateIndicatorsBadgePulse'
import { UpdateIndicatorsLivePing as CssLivePing } from '@/components/realtime/update-indicators/css/UpdateIndicatorsLivePing'
import { UpdateIndicatorsBadgePop as FramerBadgePop } from '@/components/realtime/update-indicators/framer/UpdateIndicatorsBadgePop'

// ── Rewards ──────────────────────────────────────────────────────────────

import { CollectionEffectsCoinBurst as CssCoinBurst } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinBurst'
import { CollectionEffectsCoinMagnet as CssCoinMagnet } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinMagnet'
import { CollectionEffectsCoinTrail as CssCoinTrail } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinTrail'
import { CollectionEffectsCoinBurst as FramerCoinBurst } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst'
import { CollectionEffectsCoinMagnet as FramerCoinMagnet } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinMagnet'
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

// ── Text effects ─────────────────────────────────────────────────────────

import { TextEffectsComboCounter as CssComboCounter } from '@/components/base/text-effects/css/TextEffectsComboCounter'
import { TextEffectsXpNumberPop as CssXpNumberPop } from '@/components/base/text-effects/css/TextEffectsXpNumberPop'
import { TextEffectsCounterIncrement as FramerCounterIncrement } from '@/components/base/text-effects/framer/TextEffectsCounterIncrement'

// ── Test data ────────────────────────────────────────────────────────────

type TimerComponentEntry = {
  name: string
  component: React.ComponentType
  advanceMs?: number
}

const TIMER_COMPONENTS: TimerComponentEntry[] = [
  // Progress bars
  { name: 'CSS progress-milestones', component: CssProgressMilestones },
  { name: 'CSS celebration-burst', component: CssCelebrationBurst, advanceMs: 2000 },
  { name: 'CSS progress-bounce', component: CssProgressBounce },
  { name: 'Framer progress-bounce', component: FramerProgressBounce },
  { name: 'CSS progress-segmented', component: CssProgressSegmented },
  { name: 'CSS progress-thin', component: CssProgressThin },
  { name: 'Framer progress-segmented', component: FramerProgressSegmented },
  { name: 'Framer progress-thin', component: FramerProgressThin },

  // Realtime data
  { name: 'CSS leaderboard-shift', component: CssLeaderboardShift, advanceMs: 800 },
  { name: 'Framer leaderboard-shift', component: FramerLeaderboardShift, advanceMs: 800 },
  { name: 'CSS live-score-update', component: CssLiveScoreUpdate, advanceMs: 2100 },
  { name: 'Framer live-score-update', component: FramerLiveScoreUpdate, advanceMs: 2100 },
  { name: 'CSS stacked-realtime', component: CssStackedRealtime, advanceMs: 2100 },
  { name: 'Framer stacked-realtime', component: FramerStackedRealtime, advanceMs: 2100 },

  // Timer effects — pill countdown
  { name: 'CSS pill-soft', component: CssPillSoft, advanceMs: 2000 },
  { name: 'Framer pill-soft', component: FramerPillSoft, advanceMs: 2000 },
  { name: 'CSS pill-medium', component: CssPillMedium, advanceMs: 2000 },
  { name: 'Framer pill-medium', component: FramerPillMedium, advanceMs: 2000 },
  { name: 'CSS pill-heartbeat', component: CssPillHeartbeat, advanceMs: 2000 },
  { name: 'Framer pill-heartbeat', component: FramerPillHeartbeat, advanceMs: 2000 },
  { name: 'CSS pill-glitch', component: CssPillGlitch, advanceMs: 2000 },
  { name: 'Framer pill-glitch', component: FramerPillGlitch, advanceMs: 2000 },
  { name: 'CSS pill-strong', component: CssPillStrong, advanceMs: 51100 },
  { name: 'Framer pill-strong', component: FramerPillStrong, advanceMs: 51100 },
  { name: 'CSS pill-extreme', component: CssPillExtreme, advanceMs: 60100 },
  { name: 'Framer pill-extreme', component: FramerPillExtreme, advanceMs: 60100 },

  // Timer effects — pulse & flash
  { name: 'CSS timer-pulse', component: CssTimerPulse, advanceMs: 2000 },
  { name: 'Framer timer-pulse', component: FramerTimerPulse, advanceMs: 2000 },
  { name: 'CSS timer-flash', component: CssTimerFlash, advanceMs: 32000 },
  { name: 'Framer timer-flash', component: FramerTimerFlash, advanceMs: 32000 },
  { name: 'CSS timer-flash-soft', component: CssTimerFlashSoft, advanceMs: 32000 },
  { name: 'Framer timer-flash-soft', component: FramerTimerFlashSoft, advanceMs: 32000 },

  // Update indicators
  { name: 'CSS badge-pop', component: CssBadgePop, advanceMs: 3000 },
  { name: 'Framer badge-pop', component: FramerBadgePop, advanceMs: 3000 },
  { name: 'CSS badge-pulse', component: CssBadgePulse, advanceMs: 3000 },
  { name: 'CSS live-ping', component: CssLivePing, advanceMs: 3000 },

  // Rewards — collection effects
  { name: 'CSS coin-burst', component: CssCoinBurst, advanceMs: 2000 },
  { name: 'Framer coin-burst', component: FramerCoinBurst, advanceMs: 2000 },
  { name: 'CSS coin-magnet', component: CssCoinMagnet, advanceMs: 2000 },
  { name: 'Framer coin-magnet', component: FramerCoinMagnet, advanceMs: 2000 },
  { name: 'CSS coin-trail', component: CssCoinTrail, advanceMs: 2000 },

  // Rewards — prize reveal
  { name: 'CSS arcane-portal', component: CssArcanePortal, advanceMs: 5000 },
  { name: 'Framer arcane-portal', component: FramerArcanePortal, advanceMs: 5000 },
  { name: 'CSS chest-gc-sc', component: CssChestGcSc, advanceMs: 5000 },
  { name: 'Framer chest-gc-sc', component: FramerChestGcSc, advanceMs: 5000 },
  { name: 'CSS crystal-shatter', component: CssCrystalShatter, advanceMs: 5000 },
  { name: 'Framer crystal-shatter', component: FramerCrystalShatter, advanceMs: 5000 },
  { name: 'CSS pirate-no-win', component: CssPirateNoWin, advanceMs: 5000 },
  { name: 'Framer pirate-no-win', component: FramerPirateNoWin, advanceMs: 5000 },
  { name: 'CSS pirate-win', component: CssPirateWin, advanceMs: 5000 },
  { name: 'Framer pirate-win', component: FramerPirateWin, advanceMs: 5000 },

  // Text effects
  { name: 'CSS combo-counter', component: CssComboCounter },
  { name: 'CSS xp-number-pop', component: CssXpNumberPop },
  { name: 'Framer counter-increment', component: FramerCounterIncrement, advanceMs: 100 },
]

// ── Test runner ──────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('animation component timer cleanup', () => {
  for (const { name, component, advanceMs } of TIMER_COMPONENTS) {
    it(`${name}: no leaked timers after unmount`, () => {
      assertNoLeakedTimersAfterUnmount(
        component,
        advanceMs ? { advanceBeforeUnmountMs: advanceMs } : undefined
      )
    })
  }
})

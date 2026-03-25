/**
 * Apply manually reviewed tier classifications to all .meta.ts files.
 * Both CSS and framer variants get the same tier.
 *
 * This hardcoded map is the AUTHORITATIVE source for tier assignments.
 * `classify-tiers.mjs` is an analytical tool that heuristically computes
 * minimum tiers from import analysis — use it for discovery, not enforcement.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ANIM_ROOT = resolve(__dirname, '../src/components')

// ── Reviewed classifications ────────────────────────────────────────────

const TIERS = {
  // base/standard-effects
  StandardEffectsBlink: 1,
  StandardEffectsBounce: 1,
  StandardEffectsFade: 1,
  StandardEffectsFlip: 1,
  StandardEffectsFloat: 1,
  StandardEffectsHeartbeat: 1,
  StandardEffectsJello: 1,
  StandardEffectsPop: 1,
  StandardEffectsPulse: 2,
  StandardEffectsPulseCircle: 2,
  StandardEffectsPulseWave: 2,
  StandardEffectsRadialPulse: 2,
  StandardEffectsRubberBand: 1,
  StandardEffectsScale: 1,
  StandardEffectsShake: 1,
  StandardEffectsSlide: 1,
  StandardEffectsSpin: 1,
  StandardEffectsSqueeze: 1,
  StandardEffectsSwing: 1,
  StandardEffectsTada: 1,
  StandardEffectsWiggle: 1,

  // base/button-effects
  ButtonEffectsJitter: 1,
  ButtonEffectsLiquidMorph: 1,
  ButtonEffectsPressSquash: 1,
  ButtonEffectsRewardReadyPulse: 1,
  ButtonEffectsRipple: 4,
  ButtonEffectsShockwave: 4,
  ButtonEffectsSplitReveal: 2,
  ButtonFeedbackShakeGentle: 1,

  // base/text-effects
  TextEffectsCharacterReveal: 3,
  TextEffectsComboCounter: 4,
  TextEffectsCounterIncrement: 4,
  TextEffectsEpicWin: 3,
  TextEffectsGlitchText: 2,
  TextEffectsHorizonLightPass: 3,
  TextEffectsLevelBreakthrough: 4,
  TextEffectsLightSweepDraw: 3,
  TextEffectsMetallicSpecularFlash: 3,
  TextEffectsTypewriter: 3,
  TextEffectsVerbFall: 3,
  TextEffectsVerbFlip: 3,
  TextEffectsVerbFloat: 3,
  TextEffectsVerbJog: 3,
  TextEffectsVerbJump: 3,
  TextEffectsVerbTwirl: 3,
  TextEffectsWaveReveal: 3,
  TextEffectsWaveText: 3,
  TextEffectsXpNumberPop: 4,

  // dialogs/modal-base
  ModalBaseFlip3d: 2,
  ModalBaseGlitchDigital: 2,
  ModalBasePortalSwirl: 2,
  ModalBaseRippleExpand: 2,
  ModalBaseScaleGentlePop: 2,
  ModalBaseShatterAssemble: 2,
  ModalBaseSlideDownSoft: 2,
  ModalBaseSlideLeftDrift: 2,
  ModalBaseSlideRightDrift: 2,
  ModalBaseSlideUpSoft: 2,
  ModalBaseSpringBounce: 2,
  ModalBaseTvTurnOn: 2,
  ModalBaseUnfoldOrigami: 2,
  ModalBaseZoomElastic: 2,

  // dialogs/modal-content
  ModalContentButtonsStagger2: 3,
  ModalContentButtonsStagger3: 3,
  ModalContentFormFieldGradient: 3,
  ModalContentFormFieldLeftReveal: 3,
  ModalContentFormFieldRightReveal: 3,
  ModalContentListSoftStagger: 3,
  ModalContentListSpotlight: 3,
  ModalContentListVerticalWipe: 3,

  // dialogs/modal-dismiss
  ModalDismissSnackbarScale: 4,
  ModalDismissSnackbarWipe: 4,
  ModalDismissToastDrop: 4,
  ModalDismissToastFadeProgress: 4,
  ModalDismissToastRaise: 4,
  ModalDismissToastSlideLeft: 4,
  ModalDismissToastSlideRight: 4,

  // dialogs/modal-orchestration
  ModalOrchestrationComparisonMorph: 3,
  ModalOrchestrationFlipReveal: 4,
  ModalOrchestrationGridHighlight: 3,
  ModalOrchestrationMagneticHover: 3,
  ModalOrchestrationSelectionGrid: 3,
  ModalOrchestrationSpringPhysics: 3,
  ModalOrchestrationStaggerInview: 3,
  ModalOrchestrationTabMorph: 4,
  ModalOrchestrationWizardFadeCross: 3,
  ModalOrchestrationWizardScaleRotate: 3,
  ModalOrchestrationWizardSlideStack: 3,

  // progress/loading-states
  LoadingStatesDotsPortal: 3,
  LoadingStatesDotsRise: 3,
  LoadingStatesRingMulti: 3,
  LoadingStatesRingProgress: 2,
  LoadingStatesSkeletonCard: 3,
  LoadingStatesSkeletonHorizontal: 3,
  LoadingStatesSkeletonTile: 3,
  LoadingStatesSkeletonVertical: 3,
  LoadingStatesSpinnerDualRing: 2,
  LoadingStatesSpinnerGalaxy: 2,
  LoadingStatesSpinnerOrbital: 2,

  // progress/progress-bars
  ProgressBarsCelebrationBurst: 4,
  ProgressBarsChargeSurge: 4,
  ProgressBarsCircularDash: 4,
  ProgressBarsCrystalNodes: 4,
  ProgressBarsElasticFill: 2,
  ProgressBarsFlagPlant: 4,
  ProgressBarsJourneyMap: 4,
  ProgressBarsLiquidTube: 4,
  ProgressBarsMilestoneUnlock: 4,
  ProgressBarsNeonPulse: 4,
  ProgressBarsProgressBounce: 4,
  ProgressBarsProgressMilestones: 4,
  ProgressBarsProgressSegmented: 4,
  ProgressBarsProgressThin: 3,
  ProgressBarsQuestlineRoyal: 4,
  ProgressBarsRetroBit: 4,
  ProgressBarsSciFiLoader: 4,
  ProgressBarsStamina: 4,
  ProgressBarsTimelineProgress: 3,
  ProgressBarsXpAccumulation: 4,
  ProgressBarsZoomedProgress: 4,

  // realtime/realtime-data
  RealtimeDataLeaderboardShift: 4,
  RealtimeDataLiveScoreUpdate: 4,
  RealtimeDataStackedRealtime: 4,
  RealtimeDataWinTicker: 2,

  // realtime/timer-effects
  TimerEffectsPillCountdownExtreme: 4,
  TimerEffectsPillCountdownGlitch: 4,
  TimerEffectsPillCountdownHeartbeat: 4,
  TimerEffectsPillCountdownMedium: 4,
  TimerEffectsPillCountdownSoft: 4,
  TimerEffectsPillCountdownStrong: 4,
  TimerEffectsTimerFlash: 4,
  TimerEffectsTimerFlashSoft: 4,
  TimerEffectsTimerPulse: 4,
  TimerEffectsUrgentPulse: 2,

  // realtime/update-indicators
  UpdateIndicatorsBadgePop: 4,
  UpdateIndicatorsBadgePulse: 2,
  UpdateIndicatorsHomeIconDotBounce: 4,
  UpdateIndicatorsHomeIconDotPulse: 4,
  UpdateIndicatorsHomeIconDotRadar: 4,
  UpdateIndicatorsHomeIconDotSweep: 4,
  UpdateIndicatorsLivePing: 2,

  // rewards/collection-effects
  CollectionEffectsCoinBurst: 4,
  CollectionEffectsCoinMagnet: 4,
  CollectionEffectsCoinsFountain: 4,
  CollectionEffectsCoinTrail: 4,

  // rewards/icon-animations
  IconAnimationsBounce: 4,
  IconAnimationsFloat: 4,
  IconAnimationsPulse: 4,
  IconAnimationsShake: 4,

  // rewards/lights
  LightsCircleStatic1: 3,
  LightsCircleStatic2: 3,
  LightsCircleStatic3: 3,
  LightsCircleStatic4: 3,
  LightsCircleStatic5: 3,
  LightsCircleStatic6: 3,
  LightsCircleStatic7: 3,
  LightsCircleStatic8: 3,

  // rewards/modal-celebrations
  ModalCelebrationsCoinCascade: 4,
  ModalCelebrationsCoinsArc: 4,
  ModalCelebrationsCoinsSwirl: 4,
  ModalCelebrationsConfettiBurst: 3,
  ModalCelebrationsConfettiPulse: 3,
  ModalCelebrationsConfettiRain: 3,
  ModalCelebrationsConfettiSpiral: 3,
  ModalCelebrationsFirework: 4,
  ModalCelebrationsFireworksRing: 3,
  ModalCelebrationsFireworksTriple: 3,
  ModalCelebrationsTreasureParticles: 4,

  // rewards/prize-reveal
  CardPackOpen: 4,
  PrizeRevealArcanePortal: 4,
  PrizeRevealChestGcSc: 4,
  PrizeRevealCrystalShatter: 4,
  PrizeRevealPirateChestNoWin: 4,
  PrizeRevealPirateChestWin: 4,
}

// ── Apply ───────────────────────────────────────────────────────────────

function walkDir(dir, predicate) {
  const results = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return results
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    let stat
    try {
      stat = statSync(full)
    } catch {
      continue
    }
    if (stat.isDirectory()) results.push(...walkDir(full, predicate))
    else if (predicate(full)) results.push(full)
  }
  return results
}

const metaFiles = walkDir(ANIM_ROOT, (f) => {
  if (!f.endsWith('.meta.ts')) return false
  const dir = basename(dirname(f))
  return dir === 'css' || dir === 'framer'
})

let updated = 0
let unchanged = 0
let notFound = 0

for (const metaPath of metaFiles) {
  const name = basename(metaPath, '.meta.ts')
  const tier = TIERS[name]
  if (tier === undefined) {
    console.warn(`  NOT IN MAP: ${name}`)
    notFound++
    continue
  }

  let content = readFileSync(metaPath, 'utf8')
  const currentMatch = content.match(/\btier:\s*([1-4])\b/)
  const currentTier = currentMatch ? Number(currentMatch[1]) : null

  if (currentTier === tier) {
    unchanged++
    continue
  }

  if (currentTier !== null) {
    // Replace existing tier
    content = content.replace(/\btier:\s*[1-4]\b/, `tier: ${tier}`)
  } else {
    // Should not happen — all files already have tier from auto-classification
    console.warn(`  NO TIER FOUND: ${basename(metaPath)}`)
    continue
  }

  writeFileSync(metaPath, content)
  updated++
}

console.log(
  `Done. Updated: ${updated}, Unchanged: ${unchanged}, Not in map: ${notFound}, Total: ${metaFiles.length}`
)

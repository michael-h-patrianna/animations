import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as celebrationBurstMetadata } from './framer/ProgressBarsCelebrationBurst.meta'
import { metadata as chargeSurgeMetadata } from './framer/ProgressBarsChargeSurge.meta'
import { metadata as orbitRingMetadata } from './framer/ProgressBarsOrbitRing.meta'
import { metadata as progressBounceMetadata } from './framer/ProgressBarsProgressBounce.meta'
import { metadata as progressGradientMetadata } from './framer/ProgressBarsProgressGradient.meta'
import { metadata as progressMilestonesMetadata } from './framer/ProgressBarsProgressMilestones.meta'
import { metadata as progressSegmentedMetadata } from './framer/ProgressBarsProgressSegmented.meta'
import { metadata as progressStripedMetadata } from './framer/ProgressBarsProgressStriped.meta'
import { metadata as progressThinMetadata } from './framer/ProgressBarsProgressThin.meta'
import { metadata as timelineProgressMetadata } from './framer/ProgressBarsTimelineProgress.meta'
import { metadata as xpAccumulationMetadata } from './framer/ProgressBarsXpAccumulation.meta'
import { metadata as zoomedProgressMetadata } from './framer/ProgressBarsZoomedProgress.meta'
import { metadata as retroBitMetadata } from './framer/ProgressBarsRetroBit.meta'
import { metadata as sciFiLoaderMetadata } from './framer/ProgressBarsSciFiLoader.meta'
import { metadata as liquidTubeMetadata } from './framer/ProgressBarsLiquidTube.meta'
import { metadata as neonPulseMetadata } from './framer/ProgressBarsNeonPulse.meta'
import { metadata as glitchMetadata } from './framer/ProgressBarsGlitch.meta'
import { metadata as bossHealthMetadata } from './framer/ProgressBarsBossHealth.meta'
import { metadata as staminaMetadata } from './framer/ProgressBarsStamina.meta'
import { metadata as circularDashMetadata } from './framer/ProgressBarsCircularDash.meta'
import { metadata as milestoneUnlockMetadata } from './framer/ProgressBarsMilestoneUnlock.meta'
import { metadata as journeyMapMetadata } from './framer/ProgressBarsJourneyMap.meta'
import { metadata as crystalNodesMetadata } from './framer/ProgressBarsCrystalNodes.meta'
import { metadata as flagPlantMetadata } from './framer/ProgressBarsFlagPlant.meta'
import { metadata as coinTrailMetadata } from './framer/ProgressBarsCoinTrail.meta'

// CSS - Import metadata only
import { metadata as celebrationBurstCssMetadata } from './css/ProgressBarsCelebrationBurst.meta'
import { metadata as chargeSurgeCssMetadata } from './css/ProgressBarsChargeSurge.meta'
import { metadata as orbitRingCssMetadata } from './css/ProgressBarsOrbitRing.meta'
import { metadata as progressBounceCssMetadata } from './css/ProgressBarsProgressBounce.meta'
import { metadata as progressGradientCssMetadata } from './css/ProgressBarsProgressGradient.meta'
import { metadata as progressMilestonesCssMetadata } from './css/ProgressBarsProgressMilestones.meta'
import { metadata as progressSegmentedCssMetadata } from './css/ProgressBarsProgressSegmented.meta'
import { metadata as progressStripedCssMetadata } from './css/ProgressBarsProgressStriped.meta'
import { metadata as progressThinCssMetadata } from './css/ProgressBarsProgressThin.meta'
import { metadata as timelineProgressCssMetadata } from './css/ProgressBarsTimelineProgress.meta'
import { metadata as xpAccumulationCssMetadata } from './css/ProgressBarsXpAccumulation.meta'
import { metadata as zoomedProgressCssMetadata } from './css/ProgressBarsZoomedProgress.meta'
import { metadata as retroBitCssMetadata } from './css/ProgressBarsRetroBit.meta'
import { metadata as sciFiLoaderCssMetadata } from './css/ProgressBarsSciFiLoader.meta'
import { metadata as liquidTubeCssMetadata } from './css/ProgressBarsLiquidTube.meta'
import { metadata as neonPulseCssMetadata } from './css/ProgressBarsNeonPulse.meta'
import { metadata as glitchCssMetadata } from './css/ProgressBarsGlitch.meta'
import { metadata as bossHealthCssMetadata } from './css/ProgressBarsBossHealth.meta'
import { metadata as staminaCssMetadata } from './css/ProgressBarsStamina.meta'
import { metadata as circularDashCssMetadata } from './css/ProgressBarsCircularDash.meta'
import { metadata as milestoneUnlockCssMetadata } from './css/ProgressBarsMilestoneUnlock.meta'
import { metadata as journeyMapCssMetadata } from './css/ProgressBarsJourneyMap.meta'
import { metadata as crystalNodesCssMetadata } from './css/ProgressBarsCrystalNodes.meta'
import { metadata as flagPlantCssMetadata } from './css/ProgressBarsFlagPlant.meta'
import { metadata as coinTrailCssMetadata } from './css/ProgressBarsCoinTrail.meta'

// Framer Motion - Lazy load components
const ProgressBarsCelebrationBurst = lazy(() =>
  import('./framer/ProgressBarsCelebrationBurst').then((m) => ({
    default: m.ProgressBarsCelebrationBurst,
  }))
)
const ProgressBarsChargeSurge = lazy(() =>
  import('./framer/ProgressBarsChargeSurge').then((m) => ({
    default: m.ProgressBarsChargeSurge,
  }))
)
const ProgressBarsOrbitRing = lazy(() =>
  import('./framer/ProgressBarsOrbitRing').then((m) => ({
    default: m.ProgressBarsOrbitRing,
  }))
)
const ProgressBarsProgressBounce = lazy(() =>
  import('./framer/ProgressBarsProgressBounce').then((m) => ({
    default: m.ProgressBarsProgressBounce,
  }))
)
const ProgressBarsProgressGradient = lazy(() =>
  import('./framer/ProgressBarsProgressGradient').then((m) => ({
    default: m.ProgressBarsProgressGradient,
  }))
)
const ProgressBarsProgressMilestones = lazy(() =>
  import('./framer/ProgressBarsProgressMilestones').then((m) => ({
    default: m.ProgressBarsProgressMilestones,
  }))
)
const ProgressBarsProgressSegmented = lazy(() =>
  import('./framer/ProgressBarsProgressSegmented').then((m) => ({
    default: m.ProgressBarsProgressSegmented,
  }))
)
const ProgressBarsProgressThin = lazy(() =>
  import('./framer/ProgressBarsProgressThin').then((m) => ({ default: m.ProgressBarsProgressThin }))
)
const ProgressBarsTimelineProgress = lazy(() =>
  import('./framer/ProgressBarsTimelineProgress').then((m) => ({
    default: m.ProgressBarsTimelineProgress,
  }))
)
const ProgressBarsXpAccumulation = lazy(() =>
  import('./framer/ProgressBarsXpAccumulation').then((m) => ({
    default: m.ProgressBarsXpAccumulation,
  }))
)
const ProgressBarsZoomedProgress = lazy(() =>
  import('./framer/ProgressBarsZoomedProgress').then((m) => ({
    default: m.ProgressBarsZoomedProgress,
  }))
)
const ProgressBarsProgressStriped = lazy(() =>
  import('./framer/ProgressBarsProgressStriped').then((m) => ({
    default: m.ProgressBarsProgressStriped,
  }))
)
const ProgressBarsRetroBit = lazy(() => import('./framer/ProgressBarsRetroBit').then(m => ({ default: m.ProgressBarsRetroBit })))
const ProgressBarsSciFiLoader = lazy(() => import('./framer/ProgressBarsSciFiLoader').then(m => ({ default: m.ProgressBarsSciFiLoader })))
const ProgressBarsLiquidTube = lazy(() => import('./framer/ProgressBarsLiquidTube').then(m => ({ default: m.ProgressBarsLiquidTube })))
const ProgressBarsNeonPulse = lazy(() => import('./framer/ProgressBarsNeonPulse').then(m => ({ default: m.ProgressBarsNeonPulse })))
const ProgressBarsGlitch = lazy(() => import('./framer/ProgressBarsGlitch').then(m => ({ default: m.ProgressBarsGlitch })))
const ProgressBarsBossHealth = lazy(() => import('./framer/ProgressBarsBossHealth').then(m => ({ default: m.ProgressBarsBossHealth })))
const ProgressBarsStamina = lazy(() => import('./framer/ProgressBarsStamina').then(m => ({ default: m.ProgressBarsStamina })))
const ProgressBarsCircularDash = lazy(() => import('./framer/ProgressBarsCircularDash').then(m => ({ default: m.ProgressBarsCircularDash })))
const ProgressBarsMilestoneUnlock = lazy(() => import('./framer/ProgressBarsMilestoneUnlock').then(m => ({ default: m.ProgressBarsMilestoneUnlock })))
const ProgressBarsJourneyMap = lazy(() => import('./framer/ProgressBarsJourneyMap').then(m => ({ default: m.ProgressBarsJourneyMap })))
const ProgressBarsCrystalNodes = lazy(() => import('./framer/ProgressBarsCrystalNodes').then(m => ({ default: m.ProgressBarsCrystalNodes })))
const ProgressBarsFlagPlant = lazy(() => import('./framer/ProgressBarsFlagPlant').then(m => ({ default: m.ProgressBarsFlagPlant })))
const ProgressBarsCoinTrail = lazy(() => import('./framer/ProgressBarsCoinTrail').then(m => ({ default: m.ProgressBarsCoinTrail })))


// CSS - Lazy load components
const CssProgressBarsCelebrationBurst = lazy(() =>
  import('./css/ProgressBarsCelebrationBurst').then((m) => ({
    default: m.ProgressBarsCelebrationBurst,
  }))
)
const CssProgressBarsChargeSurge = lazy(() =>
  import('./css/ProgressBarsChargeSurge').then((m) => ({
    default: m.ProgressBarsChargeSurge,
  }))
)
const CssProgressBarsOrbitRing = lazy(() =>
  import('./css/ProgressBarsOrbitRing').then((m) => ({
    default: m.ProgressBarsOrbitRing,
  }))
)
const CssProgressBarsProgressBounce = lazy(() =>
  import('./css/ProgressBarsProgressBounce').then((m) => ({
    default: m.ProgressBarsProgressBounce,
  }))
)
const CssProgressBarsProgressGradient = lazy(() =>
  import('./css/ProgressBarsProgressGradient').then((m) => ({
    default: m.ProgressBarsProgressGradient,
  }))
)
const CssProgressBarsProgressMilestones = lazy(() =>
  import('./css/ProgressBarsProgressMilestones').then((m) => ({
    default: m.ProgressBarsProgressMilestones,
  }))
)
const CssProgressBarsProgressSegmented = lazy(() =>
  import('./css/ProgressBarsProgressSegmented').then((m) => ({
    default: m.ProgressBarsProgressSegmented,
  }))
)
const CssProgressBarsProgressStriped = lazy(() =>
  import('./css/ProgressBarsProgressStriped').then((m) => ({
    default: m.ProgressBarsProgressStriped,
  }))
)
const CssProgressBarsProgressThin = lazy(() =>
  import('./css/ProgressBarsProgressThin').then((m) => ({ default: m.ProgressBarsProgressThin }))
)
const CssProgressBarsTimelineProgress = lazy(() =>
  import('./css/ProgressBarsTimelineProgress').then((m) => ({
    default: m.ProgressBarsTimelineProgress,
  }))
)
const CssProgressBarsXpAccumulation = lazy(() =>
  import('./css/ProgressBarsXpAccumulation').then((m) => ({
    default: m.ProgressBarsXpAccumulation,
  }))
)
const CssProgressBarsZoomedProgress = lazy(() =>
  import('./css/ProgressBarsZoomedProgress').then((m) => ({
    default: m.ProgressBarsZoomedProgress,
  }))
)
const CssProgressBarsRetroBit = lazy(() => import('./css/ProgressBarsRetroBit').then(m => ({ default: m.ProgressBarsRetroBit })))
const CssProgressBarsSciFiLoader = lazy(() => import('./css/ProgressBarsSciFiLoader').then(m => ({ default: m.ProgressBarsSciFiLoader })))
const CssProgressBarsLiquidTube = lazy(() => import('./css/ProgressBarsLiquidTube').then(m => ({ default: m.ProgressBarsLiquidTube })))
const CssProgressBarsNeonPulse = lazy(() => import('./css/ProgressBarsNeonPulse').then(m => ({ default: m.ProgressBarsNeonPulse })))
const CssProgressBarsGlitch = lazy(() => import('./css/ProgressBarsGlitch').then(m => ({ default: m.ProgressBarsGlitch })))
const CssProgressBarsBossHealth = lazy(() => import('./css/ProgressBarsBossHealth').then(m => ({ default: m.ProgressBarsBossHealth })))
const CssProgressBarsStamina = lazy(() => import('./css/ProgressBarsStamina').then(m => ({ default: m.ProgressBarsStamina })))
const CssProgressBarsCircularDash = lazy(() => import('./css/ProgressBarsCircularDash').then(m => ({ default: m.ProgressBarsCircularDash })))
const CssProgressBarsMilestoneUnlock = lazy(() => import('./css/ProgressBarsMilestoneUnlock').then(m => ({ default: m.ProgressBarsMilestoneUnlock })))
const CssProgressBarsJourneyMap = lazy(() => import('./css/ProgressBarsJourneyMap').then(m => ({ default: m.ProgressBarsJourneyMap })))
const CssProgressBarsCrystalNodes = lazy(() => import('./css/ProgressBarsCrystalNodes').then(m => ({ default: m.ProgressBarsCrystalNodes })))
const CssProgressBarsFlagPlant = lazy(() => import('./css/ProgressBarsFlagPlant').then(m => ({ default: m.ProgressBarsFlagPlant })))
const CssProgressBarsCoinTrail = lazy(() => import('./css/ProgressBarsCoinTrail').then(m => ({ default: m.ProgressBarsCoinTrail })))

export const groupMetadata: GroupMetadata = {
  id: 'progress-bars',
  title: 'Progress bars',
  tech: 'framer',
  demo: 'progressBar',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'progress-bars__celebration-burst': {
      component: ProgressBarsCelebrationBurst,
      metadata: celebrationBurstMetadata,
    },
    'progress-bars__charge-surge': {
      component: ProgressBarsChargeSurge,
      metadata: chargeSurgeMetadata,
    },
    'progress-bars__orbit-ring': {
      component: ProgressBarsOrbitRing,
      metadata: orbitRingMetadata,
    },
    'progress-bars__timeline-progress': {
      component: ProgressBarsTimelineProgress,
      metadata: timelineProgressMetadata,
    },
    'progress-bars__progress-milestones': {
      component: ProgressBarsProgressMilestones,
      metadata: progressMilestonesMetadata,
    },
    'progress-bars__progress-segmented': {
      component: ProgressBarsProgressSegmented,
      metadata: progressSegmentedMetadata,
    },
    'progress-bars__progress-gradient': {
      component: ProgressBarsProgressGradient,
      metadata: progressGradientMetadata,
    },
    'progress-bars__progress-bounce': {
      component: ProgressBarsProgressBounce,
      metadata: progressBounceMetadata,
    },
    'progress-bars__progress-thin': {
      component: ProgressBarsProgressThin,
      metadata: progressThinMetadata,
    },
    'progress-bars__xp-accumulation': {
      component: ProgressBarsXpAccumulation,
      metadata: xpAccumulationMetadata,
    },
    'progress-bars__zoomed-progress': {
      component: ProgressBarsZoomedProgress,
      metadata: zoomedProgressMetadata,
    },

    'progress-bars__progress-striped': {
      component: ProgressBarsProgressStriped,
      metadata: progressStripedMetadata,
    },
    'progress-bars__retro-bit': { component: ProgressBarsRetroBit, metadata: retroBitMetadata },
    'progress-bars__sci-fi-loader': { component: ProgressBarsSciFiLoader, metadata: sciFiLoaderMetadata },
    'progress-bars__liquid-tube': { component: ProgressBarsLiquidTube, metadata: liquidTubeMetadata },
    'progress-bars__neon-pulse': { component: ProgressBarsNeonPulse, metadata: neonPulseMetadata },
    'progress-bars__glitch': { component: ProgressBarsGlitch, metadata: glitchMetadata },
    'progress-bars__boss-health': { component: ProgressBarsBossHealth, metadata: bossHealthMetadata },
    'progress-bars__stamina': { component: ProgressBarsStamina, metadata: staminaMetadata },
    'progress-bars__circular-dash': { component: ProgressBarsCircularDash, metadata: circularDashMetadata },
    'progress-bars__milestone-unlock': { component: ProgressBarsMilestoneUnlock, metadata: milestoneUnlockMetadata },
    'progress-bars__journey-map': { component: ProgressBarsJourneyMap, metadata: journeyMapMetadata },
    'progress-bars__crystal-nodes': { component: ProgressBarsCrystalNodes, metadata: crystalNodesMetadata },
    'progress-bars__flag-plant': { component: ProgressBarsFlagPlant, metadata: flagPlantMetadata },
    'progress-bars__coin-trail': { component: ProgressBarsCoinTrail, metadata: coinTrailMetadata },
  },
  css: {
    'progress-bars__celebration-burst': {
      component: CssProgressBarsCelebrationBurst,
      metadata: celebrationBurstCssMetadata,
    },
    'progress-bars__charge-surge': {
      component: CssProgressBarsChargeSurge,
      metadata: chargeSurgeCssMetadata,
    },
    'progress-bars__orbit-ring': {
      component: CssProgressBarsOrbitRing,
      metadata: orbitRingCssMetadata,
    },
    'progress-bars__timeline-progress': {
      component: CssProgressBarsTimelineProgress,
      metadata: timelineProgressCssMetadata,
    },
    'progress-bars__progress-milestones': {
      component: CssProgressBarsProgressMilestones,
      metadata: progressMilestonesCssMetadata,
    },
    'progress-bars__progress-segmented': {
      component: CssProgressBarsProgressSegmented,
      metadata: progressSegmentedCssMetadata,
    },
    'progress-bars__progress-gradient': {
      component: CssProgressBarsProgressGradient,
      metadata: progressGradientCssMetadata,
    },
    'progress-bars__progress-bounce': {
      component: CssProgressBarsProgressBounce,
      metadata: progressBounceCssMetadata,
    },
    'progress-bars__progress-thin': {
      component: CssProgressBarsProgressThin,
      metadata: progressThinCssMetadata,
    },
    'progress-bars__xp-accumulation': {
      component: CssProgressBarsXpAccumulation,
      metadata: xpAccumulationCssMetadata,
    },
    'progress-bars__zoomed-progress': {
      component: CssProgressBarsZoomedProgress,
      metadata: zoomedProgressCssMetadata,
    },

    'progress-bars__progress-striped': {
      component: CssProgressBarsProgressStriped,
      metadata: progressStripedCssMetadata,
    },
    'progress-bars__retro-bit': { component: CssProgressBarsRetroBit, metadata: retroBitCssMetadata },
    'progress-bars__sci-fi-loader': { component: CssProgressBarsSciFiLoader, metadata: sciFiLoaderCssMetadata },
    'progress-bars__liquid-tube': { component: CssProgressBarsLiquidTube, metadata: liquidTubeCssMetadata },
    'progress-bars__neon-pulse': { component: CssProgressBarsNeonPulse, metadata: neonPulseCssMetadata },
    'progress-bars__glitch': { component: CssProgressBarsGlitch, metadata: glitchCssMetadata },
    'progress-bars__boss-health': { component: CssProgressBarsBossHealth, metadata: bossHealthCssMetadata },
    'progress-bars__stamina': { component: CssProgressBarsStamina, metadata: staminaCssMetadata },
    'progress-bars__circular-dash': { component: CssProgressBarsCircularDash, metadata: circularDashCssMetadata },
    'progress-bars__milestone-unlock': { component: CssProgressBarsMilestoneUnlock, metadata: milestoneUnlockCssMetadata },
    'progress-bars__journey-map': { component: CssProgressBarsJourneyMap, metadata: journeyMapCssMetadata },
    'progress-bars__crystal-nodes': { component: CssProgressBarsCrystalNodes, metadata: crystalNodesCssMetadata },
    'progress-bars__flag-plant': { component: CssProgressBarsFlagPlant, metadata: flagPlantCssMetadata },
    'progress-bars__coin-trail': { component: CssProgressBarsCoinTrail, metadata: coinTrailCssMetadata },
  },
}
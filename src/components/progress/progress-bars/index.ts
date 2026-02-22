// Framer variant CSS (loaded at group level for no-css-in-motion compliance)
import './shared.css'
import './framer/ProgressBarsCelebrationBurst.css'
import './framer/ProgressBarsChargeSurge.css'
import './framer/ProgressBarsCircularDash.css'
import './framer/ProgressBarsCrystalNodes.css'
import './framer/ProgressBarsElasticFill.css'
import './framer/ProgressBarsFlagPlant.css'
import './framer/ProgressBarsJourneyMap.css'
import './framer/ProgressBarsLiquidTube.css'
import './framer/ProgressBarsMilestoneUnlock.css'
import './framer/ProgressBarsNeonPulse.css'
import './framer/ProgressBarsProgressBounce.css'
import './framer/ProgressBarsProgressMilestones.css'
import './framer/ProgressBarsProgressSegmented.css'
import './framer/ProgressBarsProgressThin.css'
import './framer/ProgressBarsQuestlineRoyal.css'
import './framer/ProgressBarsRetroBit.css'
import './framer/ProgressBarsSciFiLoader.css'
import './framer/ProgressBarsStamina.css'
import './framer/ProgressBarsTimelineProgress.css'
import './framer/ProgressBarsXpAccumulation.css'
import './framer/ProgressBarsZoomedProgress.css'

import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as celebrationBurstMetadata } from './framer/ProgressBarsCelebrationBurst.meta'
import { metadata as chargeSurgeMetadata } from './framer/ProgressBarsChargeSurge.meta'
import { metadata as progressBounceMetadata } from './framer/ProgressBarsProgressBounce.meta'
import { metadata as progressMilestonesMetadata } from './framer/ProgressBarsProgressMilestones.meta'
import { metadata as progressSegmentedMetadata } from './framer/ProgressBarsProgressSegmented.meta'
import { metadata as progressThinMetadata } from './framer/ProgressBarsProgressThin.meta'
import { metadata as timelineProgressMetadata } from './framer/ProgressBarsTimelineProgress.meta'
import { metadata as xpAccumulationMetadata } from './framer/ProgressBarsXpAccumulation.meta'
import { metadata as zoomedProgressMetadata } from './framer/ProgressBarsZoomedProgress.meta'
import { metadata as retroBitMetadata } from './framer/ProgressBarsRetroBit.meta'
import { metadata as sciFiLoaderMetadata } from './framer/ProgressBarsSciFiLoader.meta'
import { metadata as liquidTubeMetadata } from './framer/ProgressBarsLiquidTube.meta'
import { metadata as neonPulseMetadata } from './framer/ProgressBarsNeonPulse.meta'
import { metadata as staminaMetadata } from './framer/ProgressBarsStamina.meta'
import { metadata as circularDashMetadata } from './framer/ProgressBarsCircularDash.meta'
import { metadata as milestoneUnlockMetadata } from './framer/ProgressBarsMilestoneUnlock.meta'
import { metadata as journeyMapMetadata } from './framer/ProgressBarsJourneyMap.meta'
import { metadata as crystalNodesMetadata } from './framer/ProgressBarsCrystalNodes.meta'
import { metadata as flagPlantMetadata } from './framer/ProgressBarsFlagPlant.meta'
import { metadata as elasticFillMetadata } from './framer/ProgressBarsElasticFill.meta'
import { metadata as questlineRoyalMetadata } from './framer/ProgressBarsQuestlineRoyal.meta'

// CSS - Import metadata only
import { metadata as celebrationBurstCssMetadata } from './css/ProgressBarsCelebrationBurst.meta'
import { metadata as chargeSurgeCssMetadata } from './css/ProgressBarsChargeSurge.meta'
import { metadata as progressBounceCssMetadata } from './css/ProgressBarsProgressBounce.meta'
import { metadata as progressMilestonesCssMetadata } from './css/ProgressBarsProgressMilestones.meta'
import { metadata as progressSegmentedCssMetadata } from './css/ProgressBarsProgressSegmented.meta'
import { metadata as progressThinCssMetadata } from './css/ProgressBarsProgressThin.meta'
import { metadata as timelineProgressCssMetadata } from './css/ProgressBarsTimelineProgress.meta'
import { metadata as xpAccumulationCssMetadata } from './css/ProgressBarsXpAccumulation.meta'
import { metadata as zoomedProgressCssMetadata } from './css/ProgressBarsZoomedProgress.meta'
import { metadata as retroBitCssMetadata } from './css/ProgressBarsRetroBit.meta'
import { metadata as sciFiLoaderCssMetadata } from './css/ProgressBarsSciFiLoader.meta'
import { metadata as liquidTubeCssMetadata } from './css/ProgressBarsLiquidTube.meta'
import { metadata as neonPulseCssMetadata } from './css/ProgressBarsNeonPulse.meta'
import { metadata as staminaCssMetadata } from './css/ProgressBarsStamina.meta'
import { metadata as circularDashCssMetadata } from './css/ProgressBarsCircularDash.meta'
import { metadata as milestoneUnlockCssMetadata } from './css/ProgressBarsMilestoneUnlock.meta'
import { metadata as journeyMapCssMetadata } from './css/ProgressBarsJourneyMap.meta'
import { metadata as crystalNodesCssMetadata } from './css/ProgressBarsCrystalNodes.meta'
import { metadata as flagPlantCssMetadata } from './css/ProgressBarsFlagPlant.meta'
import { metadata as elasticFillCssMetadata } from './css/ProgressBarsElasticFill.meta'
import { metadata as questlineRoyalCssMetadata } from './css/ProgressBarsQuestlineRoyal.meta'

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
const ProgressBarsProgressBounce = lazy(() =>
  import('./framer/ProgressBarsProgressBounce').then((m) => ({
    default: m.ProgressBarsProgressBounce,
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
const ProgressBarsRetroBit = lazy(() => import('./framer/ProgressBarsRetroBit').then(m => ({ default: m.ProgressBarsRetroBit })))
const ProgressBarsSciFiLoader = lazy(() => import('./framer/ProgressBarsSciFiLoader').then(m => ({ default: m.ProgressBarsSciFiLoader })))
const ProgressBarsLiquidTube = lazy(() => import('./framer/ProgressBarsLiquidTube').then(m => ({ default: m.ProgressBarsLiquidTube })))
const ProgressBarsNeonPulse = lazy(() => import('./framer/ProgressBarsNeonPulse').then(m => ({ default: m.ProgressBarsNeonPulse })))
const ProgressBarsStamina = lazy(() => import('./framer/ProgressBarsStamina').then(m => ({ default: m.ProgressBarsStamina })))
const ProgressBarsCircularDash = lazy(() => import('./framer/ProgressBarsCircularDash').then(m => ({ default: m.ProgressBarsCircularDash })))
const ProgressBarsMilestoneUnlock = lazy(() => import('./framer/ProgressBarsMilestoneUnlock').then(m => ({ default: m.ProgressBarsMilestoneUnlock })))
const ProgressBarsJourneyMap = lazy(() => import('./framer/ProgressBarsJourneyMap').then(m => ({ default: m.ProgressBarsJourneyMap })))
const ProgressBarsCrystalNodes = lazy(() => import('./framer/ProgressBarsCrystalNodes').then(m => ({ default: m.ProgressBarsCrystalNodes })))
const ProgressBarsFlagPlant = lazy(() => import('./framer/ProgressBarsFlagPlant').then(m => ({ default: m.ProgressBarsFlagPlant })))
const ProgressBarsElasticFill = lazy(() => import('./framer/ProgressBarsElasticFill').then(m => ({ default: m.ProgressBarsElasticFill })))
const ProgressBarsQuestlineRoyal = lazy(() => import('./framer/ProgressBarsQuestlineRoyal').then(m => ({ default: m.ProgressBarsQuestlineRoyal })))

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
const CssProgressBarsProgressBounce = lazy(() =>
  import('./css/ProgressBarsProgressBounce').then((m) => ({
    default: m.ProgressBarsProgressBounce,
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
const CssProgressBarsStamina = lazy(() => import('./css/ProgressBarsStamina').then(m => ({ default: m.ProgressBarsStamina })))
const CssProgressBarsCircularDash = lazy(() => import('./css/ProgressBarsCircularDash').then(m => ({ default: m.ProgressBarsCircularDash })))
const CssProgressBarsMilestoneUnlock = lazy(() => import('./css/ProgressBarsMilestoneUnlock').then(m => ({ default: m.ProgressBarsMilestoneUnlock })))
const CssProgressBarsJourneyMap = lazy(() => import('./css/ProgressBarsJourneyMap').then(m => ({ default: m.ProgressBarsJourneyMap })))
const CssProgressBarsCrystalNodes = lazy(() => import('./css/ProgressBarsCrystalNodes').then(m => ({ default: m.ProgressBarsCrystalNodes })))
const CssProgressBarsFlagPlant = lazy(() => import('./css/ProgressBarsFlagPlant').then(m => ({ default: m.ProgressBarsFlagPlant })))
const CssProgressBarsElasticFill = lazy(() => import('./css/ProgressBarsElasticFill').then(m => ({ default: m.ProgressBarsElasticFill })))
const CssProgressBarsQuestlineRoyal = lazy(() => import('./css/ProgressBarsQuestlineRoyal').then(m => ({ default: m.ProgressBarsQuestlineRoyal })))

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
    'progress-bars__retro-bit': { component: ProgressBarsRetroBit, metadata: retroBitMetadata },
    'progress-bars__sci-fi-loader': { component: ProgressBarsSciFiLoader, metadata: sciFiLoaderMetadata },
    'progress-bars__liquid-tube': { component: ProgressBarsLiquidTube, metadata: liquidTubeMetadata },
    'progress-bars__neon-pulse': { component: ProgressBarsNeonPulse, metadata: neonPulseMetadata },
    'progress-bars__stamina': { component: ProgressBarsStamina, metadata: staminaMetadata },
    'progress-bars__circular-dash': { component: ProgressBarsCircularDash, metadata: circularDashMetadata },
    'progress-bars__milestone-unlock': { component: ProgressBarsMilestoneUnlock, metadata: milestoneUnlockMetadata },
    'progress-bars__journey-map': { component: ProgressBarsJourneyMap, metadata: journeyMapMetadata },
    'progress-bars__crystal-nodes': { component: ProgressBarsCrystalNodes, metadata: crystalNodesMetadata },
    'progress-bars__flag-plant': { component: ProgressBarsFlagPlant, metadata: flagPlantMetadata },
    'progress-bars__elastic-fill': { component: ProgressBarsElasticFill, metadata: elasticFillMetadata },
    'progress-bars__questline-royal': { component: ProgressBarsQuestlineRoyal, metadata: questlineRoyalMetadata },
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
    'progress-bars__retro-bit': { component: CssProgressBarsRetroBit, metadata: retroBitCssMetadata },
    'progress-bars__sci-fi-loader': { component: CssProgressBarsSciFiLoader, metadata: sciFiLoaderCssMetadata },
    'progress-bars__liquid-tube': { component: CssProgressBarsLiquidTube, metadata: liquidTubeCssMetadata },
    'progress-bars__neon-pulse': { component: CssProgressBarsNeonPulse, metadata: neonPulseCssMetadata },
    'progress-bars__stamina': { component: CssProgressBarsStamina, metadata: staminaCssMetadata },
    'progress-bars__circular-dash': { component: CssProgressBarsCircularDash, metadata: circularDashCssMetadata },
    'progress-bars__milestone-unlock': { component: CssProgressBarsMilestoneUnlock, metadata: milestoneUnlockCssMetadata },
    'progress-bars__journey-map': { component: CssProgressBarsJourneyMap, metadata: journeyMapCssMetadata },
    'progress-bars__crystal-nodes': { component: CssProgressBarsCrystalNodes, metadata: crystalNodesCssMetadata },
    'progress-bars__flag-plant': { component: CssProgressBarsFlagPlant, metadata: flagPlantCssMetadata },
    'progress-bars__elastic-fill': { component: CssProgressBarsElasticFill, metadata: elasticFillCssMetadata },
    'progress-bars__questline-royal': { component: CssProgressBarsQuestlineRoyal, metadata: questlineRoyalCssMetadata },
  },
}

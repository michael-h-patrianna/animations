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

export const groupMetadata: GroupMetadata = {
  id: 'progress-bars',
  title: 'Progress bars',
  tech: 'css',
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
  },
}

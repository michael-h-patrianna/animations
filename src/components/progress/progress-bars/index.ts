import type { GroupMetadata, GroupExport } from '@/types/animation'

// CSS animations
import {
  ProgressBarsProgressBounce as CssProgressBarsProgressBounce,
  metadata as progressBounceCssMetadata,
} from './css/ProgressBarsProgressBounce'
import {
  ProgressBarsProgressGradient as CssProgressBarsProgressGradient,
  metadata as progressGradientCssMetadata,
} from './css/ProgressBarsProgressGradient'
import {
  ProgressBarsProgressMilestones as CssProgressBarsProgressMilestones,
  metadata as progressMilestonesCssMetadata,
} from './css/ProgressBarsProgressMilestones'
import {
  ProgressBarsProgressSegmented as CssProgressBarsProgressSegmented,
  metadata as progressSegmentedCssMetadata,
} from './css/ProgressBarsProgressSegmented'
import {
  ProgressBarsProgressThin as CssProgressBarsProgressThin,
  metadata as progressThinCssMetadata,
} from './css/ProgressBarsProgressThin'
import {
  ProgressBarsTimelineProgress as CssProgressBarsTimelineProgress,
  metadata as timelineProgressCssMetadata,
} from './css/ProgressBarsTimelineProgress'
import {
  ProgressBarsXpAccumulation as CssProgressBarsXpAccumulation,
  metadata as xpAccumulationCssMetadata,
} from './css/ProgressBarsXpAccumulation'
import {
  ProgressBarsZoomedProgress as CssProgressBarsZoomedProgress,
  metadata as zoomedProgressCssMetadata,
} from './css/ProgressBarsZoomedProgress'
import {
  ProgressBarsProgressSpark as CssProgressBarsProgressSpark,
  metadata as progressSparkCssMetadata,
} from './css/ProgressBarsProgressSpark'
import {
  ProgressBarsProgressStriped as CssProgressBarsProgressStriped,
  metadata as progressStripedCssMetadata,
} from './css/ProgressBarsProgressStriped'

import {
  ProgressBarsProgressBounce,
  metadata as progressBounceMetadata,
} from './framer/ProgressBarsProgressBounce'
import {
  ProgressBarsProgressGradient,
  metadata as progressGradientMetadata,
} from './framer/ProgressBarsProgressGradient'
import {
  ProgressBarsProgressMilestones,
  metadata as progressMilestonesMetadata,
} from './framer/ProgressBarsProgressMilestones'
import {
  ProgressBarsProgressSegmented,
  metadata as progressSegmentedMetadata,
} from './framer/ProgressBarsProgressSegmented'
import {
  ProgressBarsProgressThin,
  metadata as progressThinMetadata,
} from './framer/ProgressBarsProgressThin'
import {
  ProgressBarsTimelineProgress,
  metadata as timelineProgressMetadata,
} from './framer/ProgressBarsTimelineProgress'
import {
  ProgressBarsXpAccumulation,
  metadata as xpAccumulationMetadata,
} from './framer/ProgressBarsXpAccumulation'
import {
  ProgressBarsZoomedProgress,
  metadata as zoomedProgressMetadata,
} from './framer/ProgressBarsZoomedProgress'
import {
  ProgressBarsProgressSpark,
  metadata as progressSparkMetadata,
} from './framer/ProgressBarsProgressSpark'
import {
  ProgressBarsProgressStriped,
  metadata as progressStripedMetadata,
} from './framer/ProgressBarsProgressStriped'


export const groupMetadata: GroupMetadata = {
  id: 'progress-bars',
  title: 'Progress bars',
  tech: 'css',
  demo: 'progressBar',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
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
    'progress-bars__progress-spark': {
      component: ProgressBarsProgressSpark,
      metadata: progressSparkMetadata,
    },
    'progress-bars__progress-striped': {
      component: ProgressBarsProgressStriped,
      metadata: progressStripedMetadata,
    },
  },
  css: {
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
    'progress-bars__progress-spark': {
      component: CssProgressBarsProgressSpark,
      metadata: progressSparkCssMetadata,
    },
    'progress-bars__progress-striped': {
      component: CssProgressBarsProgressStriped,
      metadata: progressStripedCssMetadata,
    },
  },
}

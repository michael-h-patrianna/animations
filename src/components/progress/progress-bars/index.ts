import type { GroupMetadata, GroupExport } from '@/types/animation'

import {
  ProgressBarsProgressBounce,
  metadata as progressBounceMetadata,
} from './ProgressBarsProgressBounce'
import {
  ProgressBarsProgressGradient,
  metadata as progressGradientMetadata,
} from './ProgressBarsProgressGradient'
import {
  ProgressBarsProgressMilestones,
  metadata as progressMilestonesMetadata,
} from './ProgressBarsProgressMilestones'
import {
  ProgressBarsProgressSegmented,
  metadata as progressSegmentedMetadata,
} from './ProgressBarsProgressSegmented'
import {
  ProgressBarsProgressThin,
  metadata as progressThinMetadata,
} from './ProgressBarsProgressThin'
import {
  ProgressBarsTimelineProgress,
  metadata as timelineProgressMetadata,
} from './ProgressBarsTimelineProgress'
import {
  ProgressBarsXpAccumulation,
  metadata as xpAccumulationMetadata,
} from './ProgressBarsXpAccumulation'
import {
  ProgressBarsZoomedProgress,
  metadata as zoomedProgressMetadata,
} from './ProgressBarsZoomedProgress'


export const groupMetadata: GroupMetadata = {
  id: 'progress-bars',
  title: 'Progress bars',
  tech: 'css',
  demo: 'progressBar',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
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
  },
}

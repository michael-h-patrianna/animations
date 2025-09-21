import type { AnimationComponentMap } from '@/types/animation';

import { ProgressBarsProgressBounce } from './ProgressBarsProgressBounce';
import { ProgressBarsProgressGradient } from './ProgressBarsProgressGradient';
import { ProgressBarsProgressMilestones } from './ProgressBarsProgressMilestones';
import { ProgressBarsProgressSegmented } from './ProgressBarsProgressSegmented';
import { ProgressBarsProgressThin } from './ProgressBarsProgressThin';
import { ProgressBarsTimelineProgress } from './ProgressBarsTimelineProgress';
import { ProgressBarsXpAccumulation } from './ProgressBarsXpAccumulation';
import { ProgressBarsZoomedProgress } from './ProgressBarsZoomedProgress';

export { ProgressBarsProgressBounce } from './ProgressBarsProgressBounce';
export { ProgressBarsProgressGradient } from './ProgressBarsProgressGradient';
export { ProgressBarsProgressMilestones } from './ProgressBarsProgressMilestones';
export { ProgressBarsProgressSegmented } from './ProgressBarsProgressSegmented';
export { ProgressBarsProgressThin } from './ProgressBarsProgressThin';
export { ProgressBarsTimelineProgress } from './ProgressBarsTimelineProgress';
export { ProgressBarsXpAccumulation } from './ProgressBarsXpAccumulation';
export { ProgressBarsZoomedProgress } from './ProgressBarsZoomedProgress';

export const progressProgressBarsAnimations: AnimationComponentMap = {
  'progress-bars__progress-bounce': ProgressBarsProgressBounce,
  'progress-bars__progress-gradient': ProgressBarsProgressGradient,
  'progress-bars__progress-milestones': ProgressBarsProgressMilestones,
  'progress-bars__progress-segmented': ProgressBarsProgressSegmented,
  'progress-bars__progress-thin': ProgressBarsProgressThin,
  'progress-bars__timeline-progress': ProgressBarsTimelineProgress,
  'progress-bars__xp-accumulation': ProgressBarsXpAccumulation,
  'progress-bars__zoomed-progress': ProgressBarsZoomedProgress
};

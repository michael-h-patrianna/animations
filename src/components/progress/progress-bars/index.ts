import type { AnimationComponentMap } from '@/types/animation';

import { ProgressBarsProgressBounce } from './ProgressBarsProgressBounce';
import { ProgressBarsProgressGradient } from './ProgressBarsProgressGradient';
import { ProgressBarsProgressMilestones } from './ProgressBarsProgressMilestones';
import { ProgressBarsProgressSegmented } from './ProgressBarsProgressSegmented';
import { ProgressBarsProgressSpark } from './ProgressBarsProgressSpark';
import { ProgressBarsProgressStriped } from './ProgressBarsProgressStriped';
import { ProgressBarsProgressThin } from './ProgressBarsProgressThin';
import { ProgressBarsTimelineProgress } from './ProgressBarsTimelineProgress';

export { ProgressBarsProgressBounce } from './ProgressBarsProgressBounce';
export { ProgressBarsProgressGradient } from './ProgressBarsProgressGradient';
export { ProgressBarsProgressMilestones } from './ProgressBarsProgressMilestones';
export { ProgressBarsProgressSegmented } from './ProgressBarsProgressSegmented';
export { ProgressBarsProgressSpark } from './ProgressBarsProgressSpark';
export { ProgressBarsProgressStriped } from './ProgressBarsProgressStriped';
export { ProgressBarsProgressThin } from './ProgressBarsProgressThin';
export { ProgressBarsTimelineProgress } from './ProgressBarsTimelineProgress';

export const progressProgressBarsAnimations: AnimationComponentMap = {
  'progress-bars__progress-bounce': ProgressBarsProgressBounce,
  'progress-bars__progress-gradient': ProgressBarsProgressGradient,
  'progress-bars__progress-milestones': ProgressBarsProgressMilestones,
  'progress-bars__progress-segmented': ProgressBarsProgressSegmented,
  'progress-bars__progress-spark': ProgressBarsProgressSpark,
  'progress-bars__progress-striped': ProgressBarsProgressStriped,
  'progress-bars__progress-thin': ProgressBarsProgressThin,
  'progress-bars__timeline-progress': ProgressBarsTimelineProgress
};

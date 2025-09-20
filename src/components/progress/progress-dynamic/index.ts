import type { AnimationComponentMap } from '@/types/animation';

import { ProgressDynamicAchievementCard } from './ProgressDynamicAchievementCard';
import { ProgressDynamicAchievementRing } from './ProgressDynamicAchievementRing';
import { ProgressDynamicLevelBanner } from './ProgressDynamicLevelBanner';
import { ProgressDynamicLevelBreakthrough } from './ProgressDynamicLevelBreakthrough';
import { ProgressDynamicLevelMeter } from './ProgressDynamicLevelMeter';
import { ProgressDynamicQuestChain } from './ProgressDynamicQuestChain';
import { ProgressDynamicXpBarFlare } from './ProgressDynamicXpBarFlare';
import { ProgressDynamicXpNumberPop } from './ProgressDynamicXpNumberPop';

export { ProgressDynamicAchievementCard } from './ProgressDynamicAchievementCard';
export { ProgressDynamicAchievementRing } from './ProgressDynamicAchievementRing';
export { ProgressDynamicLevelBanner } from './ProgressDynamicLevelBanner';
export { ProgressDynamicLevelBreakthrough } from './ProgressDynamicLevelBreakthrough';
export { ProgressDynamicLevelMeter } from './ProgressDynamicLevelMeter';
export { ProgressDynamicQuestChain } from './ProgressDynamicQuestChain';
export { ProgressDynamicXpBarFlare } from './ProgressDynamicXpBarFlare';
export { ProgressDynamicXpNumberPop } from './ProgressDynamicXpNumberPop';

export const progressProgressDynamicAnimations: AnimationComponentMap = {
  'progress-dynamic__achievement-card': ProgressDynamicAchievementCard,
  'progress-dynamic__achievement-ring': ProgressDynamicAchievementRing,
  'progress-dynamic__level-banner': ProgressDynamicLevelBanner,
  'progress-dynamic__level-breakthrough': ProgressDynamicLevelBreakthrough,
  'progress-dynamic__level-meter': ProgressDynamicLevelMeter,
  'progress-dynamic__quest-chain': ProgressDynamicQuestChain,
  'progress-dynamic__xp-bar-flare': ProgressDynamicXpBarFlare,
  'progress-dynamic__xp-number-pop': ProgressDynamicXpNumberPop
};

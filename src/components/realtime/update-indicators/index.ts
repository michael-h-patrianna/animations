import type { AnimationComponentMap } from '@/types/animation';

import { UpdateIndicatorsBadgePop } from './UpdateIndicatorsBadgePop';
import { UpdateIndicatorsBadgePulse } from './UpdateIndicatorsBadgePulse';
import { UpdateIndicatorsCounterIncrement } from './UpdateIndicatorsCounterIncrement';
import { UpdateIndicatorsLivePing } from './UpdateIndicatorsLivePing';

export { UpdateIndicatorsBadgePop } from './UpdateIndicatorsBadgePop';
export { UpdateIndicatorsBadgePulse } from './UpdateIndicatorsBadgePulse';
export { UpdateIndicatorsCounterIncrement } from './UpdateIndicatorsCounterIncrement';
export { UpdateIndicatorsLivePing } from './UpdateIndicatorsLivePing';

export const realtimeUpdateIndicatorsAnimations: AnimationComponentMap = {
  'update-indicators__badge-pop': UpdateIndicatorsBadgePop,
  'update-indicators__badge-pulse': UpdateIndicatorsBadgePulse,
  'update-indicators__counter-increment': UpdateIndicatorsCounterIncrement,
  'update-indicators__live-ping': UpdateIndicatorsLivePing,
};

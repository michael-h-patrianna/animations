import type { AnimationComponentMap } from '@/types/animation';

import { UpdateIndicatorsBadgePop } from './UpdateIndicatorsBadgePop';
import { UpdateIndicatorsBadgePulse } from './UpdateIndicatorsBadgePulse';
import { UpdateIndicatorsCounterIncrement } from './UpdateIndicatorsCounterIncrement';
import { UpdateIndicatorsLivePing } from './UpdateIndicatorsLivePing';
import { UpdateIndicatorsNotificationDot } from './UpdateIndicatorsNotificationDot';
import { UpdateIndicatorsTickerScroll } from './UpdateIndicatorsTickerScroll';
import { UpdateIndicatorsUpdateFlip } from './UpdateIndicatorsUpdateFlip';
import { UpdateIndicatorsUpdateSlide } from './UpdateIndicatorsUpdateSlide';

export { UpdateIndicatorsBadgePop } from './UpdateIndicatorsBadgePop';
export { UpdateIndicatorsBadgePulse } from './UpdateIndicatorsBadgePulse';
export { UpdateIndicatorsCounterIncrement } from './UpdateIndicatorsCounterIncrement';
export { UpdateIndicatorsLivePing } from './UpdateIndicatorsLivePing';
export { UpdateIndicatorsNotificationDot } from './UpdateIndicatorsNotificationDot';
export { UpdateIndicatorsTickerScroll } from './UpdateIndicatorsTickerScroll';
export { UpdateIndicatorsUpdateFlip } from './UpdateIndicatorsUpdateFlip';
export { UpdateIndicatorsUpdateSlide } from './UpdateIndicatorsUpdateSlide';

export const realtimeUpdateIndicatorsAnimations: AnimationComponentMap = {
  'update-indicators__badge-pop': UpdateIndicatorsBadgePop,
  'update-indicators__badge-pulse': UpdateIndicatorsBadgePulse,
  'update-indicators__counter-increment': UpdateIndicatorsCounterIncrement,
  'update-indicators__live-ping': UpdateIndicatorsLivePing,
  'update-indicators__notification-dot': UpdateIndicatorsNotificationDot,
  'update-indicators__ticker-scroll': UpdateIndicatorsTickerScroll,
  'update-indicators__update-flip': UpdateIndicatorsUpdateFlip,
  'update-indicators__update-slide': UpdateIndicatorsUpdateSlide
};

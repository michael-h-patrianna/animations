import type { AnimationComponentMap } from '@/types/animation';

import { baseStandardEffectsAnimations } from '@/components/base/standard-effects';
import { AnimationComponentMap as baseTextEffectsAnimations } from '@/components/base/text-effects';
import { dialogsModalBaseAnimations } from '@/components/dialogs/modal-base';
import { dialogsModalContentAnimations } from '@/components/dialogs/modal-content';
import { dialogsModalDismissAnimations } from '@/components/dialogs/modal-dismiss';
import { dialogsModalOrchestrationAnimations } from '@/components/dialogs/modal-orchestration';
import { progressLoadingStatesAnimations } from '@/components/progress/loading-states';
import { progressProgressBarsAnimations } from '@/components/progress/progress-bars';
import { realtimeRealtimeDataAnimations } from '@/components/realtime/realtime-data';
import { realtimeTimerEffectsAnimations } from '@/components/realtime/timer-effects';
import { realtimeUpdateIndicatorsAnimations } from '@/components/realtime/update-indicators';
import { iconAnimationsComponents } from '@/components/rewards/icon-animations';
import { dialogsModalCelebrationsAnimations } from '@/components/rewards/modal-celebrations';
import { rewardsRewardBasicAnimations } from '@/components/rewards/reward-basic';

export const animationRegistry: AnimationComponentMap = {
  ...baseTextEffectsAnimations,
  ...baseStandardEffectsAnimations,
  ...dialogsModalBaseAnimations,
  ...dialogsModalContentAnimations,
  ...dialogsModalDismissAnimations,
  ...dialogsModalOrchestrationAnimations,
  ...dialogsModalCelebrationsAnimations,
  ...progressProgressBarsAnimations,
  ...progressLoadingStatesAnimations,
  ...realtimeTimerEffectsAnimations,
  ...realtimeUpdateIndicatorsAnimations,
  ...realtimeRealtimeDataAnimations,
  ...iconAnimationsComponents,
  ...rewardsRewardBasicAnimations,

};

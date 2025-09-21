import type { AnimationComponentMap } from '@/types/animation';

import { AnimationComponentMap as baseTextEffectsAnimations } from '@/components/base/text-effects';
import { baseStandardEffectsAnimations } from '@/components/base/standard-effects';
import { dialogsModalBaseAnimations } from '@/components/dialogs/modal-base';
import { dialogsModalCelebrationsAnimations } from '@/components/dialogs/modal-celebrations';
import { dialogsModalContentAnimations } from '@/components/dialogs/modal-content';
import { dialogsModalDismissAnimations } from '@/components/dialogs/modal-dismiss';
import { dialogsModalOrchestrationAnimations } from '@/components/dialogs/modal-orchestration';
import { progressLoadingStatesAnimations } from '@/components/progress/loading-states';
import { progressProgressBarsAnimations } from '@/components/progress/progress-bars';
import { realtimeRealtimeDataAnimations } from '@/components/realtime/realtime-data';
import { realtimeTimerEffectsAnimations } from '@/components/realtime/timer-effects';
import { realtimeUpdateIndicatorsAnimations } from '@/components/realtime/update-indicators';
import { iconAnimationsComponents } from '@/components/rewards/icon-animations';
import { rewardsRewardBasicAnimations } from '@/components/rewards/reward-basic';
import { rewardsRewardFeedbackAnimations } from '@/components/rewards/reward-feedback';
import { rewardsRewardMechanicsAnimations } from '@/components/rewards/reward-mechanics';
import { rewardsRewardOrchestrationsAnimations } from '@/components/rewards/reward-orchestrations';

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
  ...rewardsRewardFeedbackAnimations,
  ...rewardsRewardMechanicsAnimations,
  ...rewardsRewardOrchestrationsAnimations

};

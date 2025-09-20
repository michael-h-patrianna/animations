import type { AnimationComponentMap } from '@/types/animation';

import { AnimationComponentMap as baseTextEffectsAnimations } from '@/components/base/text-effects';
import { dialogsModalBaseAnimations } from '@/components/dialogs/modal-base';
import { dialogsModalContentAnimations } from '@/components/dialogs/modal-content';
import { dialogsModalDismissAnimations } from '@/components/dialogs/modal-dismiss';
import { dialogsModalOrchestrationAnimations } from '@/components/dialogs/modal-orchestration';
import { dialogsModalCelebrationsAnimations } from '@/components/dialogs/modal-celebrations';
import { progressProgressBarsAnimations } from '@/components/progress/progress-bars';
import { progressLoadingStatesAnimations } from '@/components/progress/loading-states';
import { progressProgressDynamicAnimations } from '@/components/progress/progress-dynamic';
import { progressMilestoneCelebrationsAnimations } from '@/components/progress/milestone-celebrations';
import { realtimeTimerEffectsAnimations } from '@/components/realtime/timer-effects';
import { realtimeUpdateIndicatorsAnimations } from '@/components/realtime/update-indicators';
import { realtimeComplexTimersAnimations } from '@/components/realtime/complex-timers';
import { realtimeRealtimeDataAnimations } from '@/components/realtime/realtime-data';
import { rewardsRewardBasicAnimations } from '@/components/rewards/reward-basic';
import { rewardsRewardFeedbackAnimations } from '@/components/rewards/reward-feedback';
import { rewardsRewardMechanicsAnimations } from '@/components/rewards/reward-mechanics';
import { rewardsRewardOrchestrationsAnimations } from '@/components/rewards/reward-orchestrations';
import { navigationMenuAnimationsAnimations } from '@/components/navigation/menu-animations';
import { navigationPageTransitionsAnimations } from '@/components/navigation/page-transitions';
import { navigationComplexNavigationAnimations } from '@/components/navigation/complex-navigation';
import { navigationLayoutShiftsAnimations } from '@/components/navigation/layout-shifts';
import { microInteractiveFeedbackAnimations } from '@/components/micro/interactive-feedback';
import { microStateChangesAnimations } from '@/components/micro/state-changes';
import { microAdvancedInteractionsAnimations } from '@/components/micro/advanced-interactions';
import { dataBasicChartsAnimations } from '@/components/data/basic-charts';
import { dataInteractiveVisualsAnimations } from '@/components/data/interactive-visuals';
import { ambientAmbientEffectsAnimations } from '@/components/ambient/ambient-effects';
import { ambientAdvancedEffectsAnimations } from '@/components/ambient/advanced-effects';

export const animationRegistry: AnimationComponentMap = {
  ...baseTextEffectsAnimations,
  ...dialogsModalBaseAnimations,
  ...dialogsModalContentAnimations,
  ...dialogsModalDismissAnimations,
  ...dialogsModalOrchestrationAnimations,
  ...dialogsModalCelebrationsAnimations,
  ...progressProgressBarsAnimations,
  ...progressLoadingStatesAnimations,
  ...progressProgressDynamicAnimations,
  ...progressMilestoneCelebrationsAnimations,
  ...realtimeTimerEffectsAnimations,
  ...realtimeUpdateIndicatorsAnimations,
  ...realtimeComplexTimersAnimations,
  ...realtimeRealtimeDataAnimations,
  ...rewardsRewardBasicAnimations,
  ...rewardsRewardFeedbackAnimations,
  ...rewardsRewardMechanicsAnimations,
  ...rewardsRewardOrchestrationsAnimations,
  ...navigationMenuAnimationsAnimations,
  ...navigationPageTransitionsAnimations,
  ...navigationComplexNavigationAnimations,
  ...navigationLayoutShiftsAnimations,
  ...microInteractiveFeedbackAnimations,
  ...microStateChangesAnimations,
  ...microAdvancedInteractionsAnimations,
  ...dataBasicChartsAnimations,
  ...dataInteractiveVisualsAnimations,
  ...ambientAmbientEffectsAnimations,
  ...ambientAdvancedEffectsAnimations,
};

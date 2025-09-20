import type { AnimationComponentMap } from '@/types/animation';

import { RewardOrchestrationsCoinCascade } from './RewardOrchestrationsCoinCascade';
import { RewardOrchestrationsCoinTrail } from './RewardOrchestrationsCoinTrail';
import { RewardOrchestrationsJackpotBeam } from './RewardOrchestrationsJackpotBeam';
import { RewardOrchestrationsMapTravel } from './RewardOrchestrationsMapTravel';
import { RewardOrchestrationsMultiCoin } from './RewardOrchestrationsMultiCoin';
import { RewardOrchestrationsRewardCelebration } from './RewardOrchestrationsRewardCelebration';
import { RewardOrchestrationsRewardPath } from './RewardOrchestrationsRewardPath';
import { RewardOrchestrationsTreasureParticles } from './RewardOrchestrationsTreasureParticles';
import { RewardOrchestrationsUnlockCascade } from './RewardOrchestrationsUnlockCascade';
import { RewardOrchestrationsUnlockChain } from './RewardOrchestrationsUnlockChain';

export { RewardOrchestrationsCoinCascade } from './RewardOrchestrationsCoinCascade';
export { RewardOrchestrationsCoinTrail } from './RewardOrchestrationsCoinTrail';
export { RewardOrchestrationsJackpotBeam } from './RewardOrchestrationsJackpotBeam';
export { RewardOrchestrationsMapTravel } from './RewardOrchestrationsMapTravel';
export { RewardOrchestrationsMultiCoin } from './RewardOrchestrationsMultiCoin';
export { RewardOrchestrationsRewardCelebration } from './RewardOrchestrationsRewardCelebration';
export { RewardOrchestrationsRewardPath } from './RewardOrchestrationsRewardPath';
export { RewardOrchestrationsTreasureParticles } from './RewardOrchestrationsTreasureParticles';
export { RewardOrchestrationsUnlockCascade } from './RewardOrchestrationsUnlockCascade';
export { RewardOrchestrationsUnlockChain } from './RewardOrchestrationsUnlockChain';

export const rewardsRewardOrchestrationsAnimations: AnimationComponentMap = {
  'reward-orchestrations__coin-cascade': RewardOrchestrationsCoinCascade,
  'reward-orchestrations__coin-trail': RewardOrchestrationsCoinTrail,
  'reward-orchestrations__jackpot-beam': RewardOrchestrationsJackpotBeam,
  'reward-orchestrations__map-travel': RewardOrchestrationsMapTravel,
  'reward-orchestrations__multi-coin': RewardOrchestrationsMultiCoin,
  'reward-orchestrations__reward-celebration': RewardOrchestrationsRewardCelebration,
  'reward-orchestrations__reward-path': RewardOrchestrationsRewardPath,
  'reward-orchestrations__treasure-particles': RewardOrchestrationsTreasureParticles,
  'reward-orchestrations__unlock-cascade': RewardOrchestrationsUnlockCascade,
  'reward-orchestrations__unlock-chain': RewardOrchestrationsUnlockChain
};

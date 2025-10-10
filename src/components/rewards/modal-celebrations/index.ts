import type { GroupMetadata, GroupExport } from '@/types/animation'

import { ModalCelebrationsCoinCascade, metadata as coinCascadeMetadata } from './ModalCelebrationsCoinCascade'
import { ModalCelebrationsCoinsArc, metadata as coinsArcMetadata } from './ModalCelebrationsCoinsArc'
import { ModalCelebrationsCoinsFountain, metadata as coinsFountainMetadata } from './ModalCelebrationsCoinsFountain'
import { ModalCelebrationsCoinsSwirl, metadata as coinsSwirlMetadata } from './ModalCelebrationsCoinsSwirl'
import { ModalCelebrationsCoinTrail, metadata as coinTrailMetadata } from './ModalCelebrationsCoinTrail'
import { ModalCelebrationsConfettiBurst, metadata as confettiBurstMetadata } from './ModalCelebrationsConfettiBurst'
import { ModalCelebrationsConfettiPulse, metadata as confettiPulseMetadata } from './ModalCelebrationsConfettiPulse'
import { ModalCelebrationsConfettiRain, metadata as confettiRainMetadata } from './ModalCelebrationsConfettiRain'
import { ModalCelebrationsConfettiSpiral, metadata as confettiSpiralMetadata } from './ModalCelebrationsConfettiSpiral'
import { ModalCelebrationsFireworksRing, metadata as fireworksRingMetadata } from './ModalCelebrationsFireworksRing'
import { ModalCelebrationsFireworksTriple, metadata as fireworksTripleMetadata } from './ModalCelebrationsFireworksTriple'
import { ModalCelebrationsJackpotCelebration, metadata as jackpotCelebrationMetadata } from './ModalCelebrationsJackpotCelebration'
import { ModalCelebrationsMultiCoin, metadata as multiCoinMetadata } from './ModalCelebrationsMultiCoin'
import { ModalCelebrationsRewardSpotlight, metadata as rewardSpotlightMetadata } from './ModalCelebrationsRewardSpotlight'
import { ModalCelebrationsTreasureParticles, metadata as treasureParticlesMetadata } from './ModalCelebrationsTreasureParticles'


export const groupMetadata: GroupMetadata = {
  id: 'modal-celebrations',
  title: 'Celebration effects',
  tech: 'framer',
  demo: 'celebration',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
    'modal-celebrations__confetti-burst': {
      component: ModalCelebrationsConfettiBurst,
      metadata: confettiBurstMetadata,
    },
    'modal-celebrations__confetti-spiral': {
      component: ModalCelebrationsConfettiSpiral,
      metadata: confettiSpiralMetadata,
    },
    'modal-celebrations__confetti-rain': {
      component: ModalCelebrationsConfettiRain,
      metadata: confettiRainMetadata,
    },
    'modal-celebrations__coins-arc': {
      component: ModalCelebrationsCoinsArc,
      metadata: coinsArcMetadata,
    },
    'modal-celebrations__coins-fountain': {
      component: ModalCelebrationsCoinsFountain,
      metadata: coinsFountainMetadata,
    },
    'modal-celebrations__coins-swirl': {
      component: ModalCelebrationsCoinsSwirl,
      metadata: coinsSwirlMetadata,
    },
    'modal-celebrations__fireworks-triple': {
      component: ModalCelebrationsFireworksTriple,
      metadata: fireworksTripleMetadata,
    },
    'modal-celebrations__fireworks-ring': {
      component: ModalCelebrationsFireworksRing,
      metadata: fireworksRingMetadata,
    },
    'modal-celebrations__reward-spotlight': {
      component: ModalCelebrationsRewardSpotlight,
      metadata: rewardSpotlightMetadata,
    },
    'modal-celebrations__jackpot-celebration': {
      component: ModalCelebrationsJackpotCelebration,
      metadata: jackpotCelebrationMetadata,
    },
    'modal-celebrations__confetti-pulse': {
      component: ModalCelebrationsConfettiPulse,
      metadata: confettiPulseMetadata,
    },
    'modal-celebrations__coin-trail': {
      component: ModalCelebrationsCoinTrail,
      metadata: coinTrailMetadata,
    },
    'modal-celebrations__coin-cascade': {
      component: ModalCelebrationsCoinCascade,
      metadata: coinCascadeMetadata,
    },
    'modal-celebrations__multi-coin': {
      component: ModalCelebrationsMultiCoin,
      metadata: multiCoinMetadata,
    },
    'modal-celebrations__treasure-particles': {
      component: ModalCelebrationsTreasureParticles,
      metadata: treasureParticlesMetadata,
    },
  },
}

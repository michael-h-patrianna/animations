import type { GroupMetadata, GroupExport } from '@/types/animation'

import { ModalCelebrationsCoinsArc, metadata as coinsArcMetadata } from './framer/ModalCelebrationsCoinsArc'
import { ModalCelebrationsCoinsFountain, metadata as coinsFountainMetadata } from './framer/ModalCelebrationsCoinsFountain'
import { ModalCelebrationsConfettiBurst, metadata as confettiBurstMetadata } from './framer/ModalCelebrationsConfettiBurst'
import { ModalCelebrationsConfettiRain, metadata as confettiRainMetadata } from './framer/ModalCelebrationsConfettiRain'
import { ModalCelebrationsConfettiSpiral, metadata as confettiSpiralMetadata } from './framer/ModalCelebrationsConfettiSpiral'
import { ModalCelebrationsFireworksRing, metadata as fireworksRingMetadata } from './framer/ModalCelebrationsFireworksRing'
import { ModalCelebrationsFireworksTriple, metadata as fireworksTripleMetadata } from './framer/ModalCelebrationsFireworksTriple'
import { ModalCelebrationsTreasureParticles, metadata as treasureParticlesMetadata } from './framer/ModalCelebrationsTreasureParticles'

// CSS animations
import { ModalCelebrationsCoinCascade as CssModalCelebrationsCoinCascade, metadata as coinCascadeCssMetadata } from './css/ModalCelebrationsCoinCascade'
import { ModalCelebrationsCoinsArc as CssModalCelebrationsCoinsArc, metadata as coinsArcCssMetadata } from './css/ModalCelebrationsCoinsArc'
import { ModalCelebrationsCoinsFountain as CssModalCelebrationsCoinsFountain, metadata as coinsFountainCssMetadata } from './css/ModalCelebrationsCoinsFountain'
import { ModalCelebrationsCoinsSwirl as CssModalCelebrationsCoinsSwirl, metadata as coinsSwirlCssMetadata } from './css/ModalCelebrationsCoinsSwirl'
import { ModalCelebrationsCoinTrail as CssModalCelebrationsCoinTrail, metadata as coinTrailCssMetadata } from './css/ModalCelebrationsCoinTrail'
import { ModalCelebrationsConfettiBurst as CssModalCelebrationsConfettiBurst, metadata as confettiBurstCssMetadata } from './css/ModalCelebrationsConfettiBurst'
import { ModalCelebrationsConfettiPulse as CssModalCelebrationsConfettiPulse, metadata as confettiPulseCssMetadata } from './css/ModalCelebrationsConfettiPulse'
import { ModalCelebrationsConfettiRain as CssModalCelebrationsConfettiRain, metadata as confettiRainCssMetadata } from './css/ModalCelebrationsConfettiRain'
import { ModalCelebrationsConfettiSpiral as CssModalCelebrationsConfettiSpiral, metadata as confettiSpiralCssMetadata } from './css/ModalCelebrationsConfettiSpiral'
import { ModalCelebrationsFireworksRing as CssModalCelebrationsFireworksRing, metadata as fireworksRingCssMetadata } from './css/ModalCelebrationsFireworksRing'
import { ModalCelebrationsFireworksTriple as CssModalCelebrationsFireworksTriple, metadata as fireworksTripleCssMetadata } from './css/ModalCelebrationsFireworksTriple'
import { ModalCelebrationsJackpotCelebration as CssModalCelebrationsJackpotCelebration, metadata as jackpotCelebrationCssMetadata } from './css/ModalCelebrationsJackpotCelebration'
import { ModalCelebrationsMultiCoin as CssModalCelebrationsMultiCoin, metadata as multiCoinCssMetadata } from './css/ModalCelebrationsMultiCoin'
import { ModalCelebrationsRewardSpotlight as CssModalCelebrationsRewardSpotlight, metadata as rewardSpotlightCssMetadata } from './css/ModalCelebrationsRewardSpotlight'
import { ModalCelebrationsTreasureParticles as CssModalCelebrationsTreasureParticles, metadata as treasureParticlesCssMetadata } from './css/ModalCelebrationsTreasureParticles'


export const groupMetadata: GroupMetadata = {
  id: 'modal-celebrations',
  title: 'Celebration effects',
  tech: 'framer',
  demo: 'celebration',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
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
    'modal-celebrations__fireworks-triple': {
      component: ModalCelebrationsFireworksTriple,
      metadata: fireworksTripleMetadata,
    },
    'modal-celebrations__fireworks-ring': {
      component: ModalCelebrationsFireworksRing,
      metadata: fireworksRingMetadata,
    },
    'modal-celebrations__treasure-particles': {
      component: ModalCelebrationsTreasureParticles,
      metadata: treasureParticlesMetadata,
    },
  },
  css: {
    'modal-celebrations__confetti-burst': {
      component: CssModalCelebrationsConfettiBurst,
      metadata: confettiBurstCssMetadata,
    },
    'modal-celebrations__confetti-spiral': {
      component: CssModalCelebrationsConfettiSpiral,
      metadata: confettiSpiralCssMetadata,
    },
    'modal-celebrations__confetti-rain': {
      component: CssModalCelebrationsConfettiRain,
      metadata: confettiRainCssMetadata,
    },
    'modal-celebrations__coins-arc': {
      component: CssModalCelebrationsCoinsArc,
      metadata: coinsArcCssMetadata,
    },
    'modal-celebrations__coins-fountain': {
      component: CssModalCelebrationsCoinsFountain,
      metadata: coinsFountainCssMetadata,
    },
    'modal-celebrations__fireworks-triple': {
      component: CssModalCelebrationsFireworksTriple,
      metadata: fireworksTripleCssMetadata,
    },
    'modal-celebrations__fireworks-ring': {
      component: CssModalCelebrationsFireworksRing,
      metadata: fireworksRingCssMetadata,
    },
    'modal-celebrations__treasure-particles': {
      component: CssModalCelebrationsTreasureParticles,
      metadata: treasureParticlesCssMetadata,
    },
    'modal-celebrations__coin-cascade': {
      component: CssModalCelebrationsCoinCascade,
      metadata: coinCascadeCssMetadata,
    },
    'modal-celebrations__coins-swirl': {
      component: CssModalCelebrationsCoinsSwirl,
      metadata: coinsSwirlCssMetadata,
    },
    'modal-celebrations__coin-trail': {
      component: CssModalCelebrationsCoinTrail,
      metadata: coinTrailCssMetadata,
    },
    'modal-celebrations__confetti-pulse': {
      component: CssModalCelebrationsConfettiPulse,
      metadata: confettiPulseCssMetadata,
    },
    'modal-celebrations__jackpot-celebration': {
      component: CssModalCelebrationsJackpotCelebration,
      metadata: jackpotCelebrationCssMetadata,
    },
    'modal-celebrations__multi-coin': {
      component: CssModalCelebrationsMultiCoin,
      metadata: multiCoinCssMetadata,
    },
    'modal-celebrations__reward-spotlight': {
      component: CssModalCelebrationsRewardSpotlight,
      metadata: rewardSpotlightCssMetadata,
    },
  },
}

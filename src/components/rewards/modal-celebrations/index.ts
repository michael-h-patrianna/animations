import type { GroupMetadata, GroupExport } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as coinsArcMetadata } from './framer/ModalCelebrationsCoinsArc.meta'
import { metadata as coinsFountainMetadata } from './framer/ModalCelebrationsCoinsFountain.meta'
import { metadata as confettiBurstMetadata } from './framer/ModalCelebrationsConfettiBurst.meta'
import { metadata as confettiRainMetadata } from './framer/ModalCelebrationsConfettiRain.meta'
import { metadata as confettiSpiralMetadata } from './framer/ModalCelebrationsConfettiSpiral.meta'
import { metadata as fireworksRingMetadata } from './framer/ModalCelebrationsFireworksRing.meta'
import { metadata as fireworksTripleMetadata } from './framer/ModalCelebrationsFireworksTriple.meta'
import { metadata as treasureParticlesMetadata } from './framer/ModalCelebrationsTreasureParticles.meta'

// CSS - Import metadata only
import { metadata as coinCascadeCssMetadata } from './css/ModalCelebrationsCoinCascade.meta'
import { metadata as coinsArcCssMetadata } from './css/ModalCelebrationsCoinsArc.meta'
import { metadata as coinsFountainCssMetadata } from './css/ModalCelebrationsCoinsFountain.meta'
import { metadata as coinsSwirlCssMetadata } from './css/ModalCelebrationsCoinsSwirl.meta'
import { metadata as coinTrailCssMetadata } from './css/ModalCelebrationsCoinTrail.meta'
import { metadata as confettiBurstCssMetadata } from './css/ModalCelebrationsConfettiBurst.meta'
import { metadata as confettiPulseCssMetadata } from './css/ModalCelebrationsConfettiPulse.meta'
import { metadata as confettiRainCssMetadata } from './css/ModalCelebrationsConfettiRain.meta'
import { metadata as confettiSpiralCssMetadata } from './css/ModalCelebrationsConfettiSpiral.meta'
import { metadata as fireworksRingCssMetadata } from './css/ModalCelebrationsFireworksRing.meta'
import { metadata as fireworksTripleCssMetadata } from './css/ModalCelebrationsFireworksTriple.meta'
import { metadata as jackpotCelebrationCssMetadata } from './css/ModalCelebrationsJackpotCelebration.meta'
import { metadata as multiCoinCssMetadata } from './css/ModalCelebrationsMultiCoin.meta'
import { metadata as rewardSpotlightCssMetadata } from './css/ModalCelebrationsRewardSpotlight.meta'
import { metadata as treasureParticlesCssMetadata } from './css/ModalCelebrationsTreasureParticles.meta'

// Framer Motion - Lazy load components
const ModalCelebrationsCoinsArc = lazy(() => import('./framer/ModalCelebrationsCoinsArc').then(m => ({ default: m.ModalCelebrationsCoinsArc })))
const ModalCelebrationsCoinsFountain = lazy(() => import('./framer/ModalCelebrationsCoinsFountain').then(m => ({ default: m.ModalCelebrationsCoinsFountain })))
const ModalCelebrationsConfettiBurst = lazy(() => import('./framer/ModalCelebrationsConfettiBurst').then(m => ({ default: m.ModalCelebrationsConfettiBurst })))
const ModalCelebrationsConfettiRain = lazy(() => import('./framer/ModalCelebrationsConfettiRain').then(m => ({ default: m.ModalCelebrationsConfettiRain })))
const ModalCelebrationsConfettiSpiral = lazy(() => import('./framer/ModalCelebrationsConfettiSpiral').then(m => ({ default: m.ModalCelebrationsConfettiSpiral })))
const ModalCelebrationsFireworksRing = lazy(() => import('./framer/ModalCelebrationsFireworksRing').then(m => ({ default: m.ModalCelebrationsFireworksRing })))
const ModalCelebrationsFireworksTriple = lazy(() => import('./framer/ModalCelebrationsFireworksTriple').then(m => ({ default: m.ModalCelebrationsFireworksTriple })))
const ModalCelebrationsTreasureParticles = lazy(() => import('./framer/ModalCelebrationsTreasureParticles').then(m => ({ default: m.ModalCelebrationsTreasureParticles })))

// CSS - Lazy load components
const CssModalCelebrationsCoinCascade = lazy(() => import('./css/ModalCelebrationsCoinCascade').then(m => ({ default: m.ModalCelebrationsCoinCascade })))
const CssModalCelebrationsCoinsArc = lazy(() => import('./css/ModalCelebrationsCoinsArc').then(m => ({ default: m.ModalCelebrationsCoinsArc })))
const CssModalCelebrationsCoinsFountain = lazy(() => import('./css/ModalCelebrationsCoinsFountain').then(m => ({ default: m.ModalCelebrationsCoinsFountain })))
const CssModalCelebrationsCoinsSwirl = lazy(() => import('./css/ModalCelebrationsCoinsSwirl').then(m => ({ default: m.ModalCelebrationsCoinsSwirl })))
const CssModalCelebrationsCoinTrail = lazy(() => import('./css/ModalCelebrationsCoinTrail').then(m => ({ default: m.ModalCelebrationsCoinTrail })))
const CssModalCelebrationsConfettiBurst = lazy(() => import('./css/ModalCelebrationsConfettiBurst').then(m => ({ default: m.ModalCelebrationsConfettiBurst })))
const CssModalCelebrationsConfettiPulse = lazy(() => import('./css/ModalCelebrationsConfettiPulse').then(m => ({ default: m.ModalCelebrationsConfettiPulse })))
const CssModalCelebrationsConfettiRain = lazy(() => import('./css/ModalCelebrationsConfettiRain').then(m => ({ default: m.ModalCelebrationsConfettiRain })))
const CssModalCelebrationsConfettiSpiral = lazy(() => import('./css/ModalCelebrationsConfettiSpiral').then(m => ({ default: m.ModalCelebrationsConfettiSpiral })))
const CssModalCelebrationsFireworksRing = lazy(() => import('./css/ModalCelebrationsFireworksRing').then(m => ({ default: m.ModalCelebrationsFireworksRing })))
const CssModalCelebrationsFireworksTriple = lazy(() => import('./css/ModalCelebrationsFireworksTriple').then(m => ({ default: m.ModalCelebrationsFireworksTriple })))
const CssModalCelebrationsJackpotCelebration = lazy(() => import('./css/ModalCelebrationsJackpotCelebration').then(m => ({ default: m.ModalCelebrationsJackpotCelebration })))
const CssModalCelebrationsMultiCoin = lazy(() => import('./css/ModalCelebrationsMultiCoin').then(m => ({ default: m.ModalCelebrationsMultiCoin })))
const CssModalCelebrationsRewardSpotlight = lazy(() => import('./css/ModalCelebrationsRewardSpotlight').then(m => ({ default: m.ModalCelebrationsRewardSpotlight })))
const CssModalCelebrationsTreasureParticles = lazy(() => import('./css/ModalCelebrationsTreasureParticles').then(m => ({ default: m.ModalCelebrationsTreasureParticles })))

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

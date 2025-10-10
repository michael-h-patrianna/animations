import type { GroupMetadata, GroupExport } from '@/types/animation'

import { ModalCelebrationsCoinsArc, metadata as coinsArcMetadata } from './framer/ModalCelebrationsCoinsArc'
import { ModalCelebrationsCoinsFountain, metadata as coinsFountainMetadata } from './framer/ModalCelebrationsCoinsFountain'
import { ModalCelebrationsConfettiBurst, metadata as confettiBurstMetadata } from './framer/ModalCelebrationsConfettiBurst'
import { ModalCelebrationsConfettiRain, metadata as confettiRainMetadata } from './framer/ModalCelebrationsConfettiRain'
import { ModalCelebrationsConfettiSpiral, metadata as confettiSpiralMetadata } from './framer/ModalCelebrationsConfettiSpiral'
import { ModalCelebrationsFireworksRing, metadata as fireworksRingMetadata } from './framer/ModalCelebrationsFireworksRing'
import { ModalCelebrationsFireworksTriple, metadata as fireworksTripleMetadata } from './framer/ModalCelebrationsFireworksTriple'
import { ModalCelebrationsTreasureParticles, metadata as treasureParticlesMetadata } from './framer/ModalCelebrationsTreasureParticles'


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
}

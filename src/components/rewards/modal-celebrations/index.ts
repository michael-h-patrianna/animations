import type { GroupMetadata, GroupExport } from '@/types/animation'

import { ModalCelebrationsCoinsArc, metadata as coinsArcMetadata } from './ModalCelebrationsCoinsArc'
import { ModalCelebrationsCoinsFountain, metadata as coinsFountainMetadata } from './ModalCelebrationsCoinsFountain'
import { ModalCelebrationsConfettiBurst, metadata as confettiBurstMetadata } from './ModalCelebrationsConfettiBurst'
import { ModalCelebrationsConfettiRain, metadata as confettiRainMetadata } from './ModalCelebrationsConfettiRain'
import { ModalCelebrationsConfettiSpiral, metadata as confettiSpiralMetadata } from './ModalCelebrationsConfettiSpiral'
import { ModalCelebrationsFireworksRing, metadata as fireworksRingMetadata } from './ModalCelebrationsFireworksRing'
import { ModalCelebrationsFireworksTriple, metadata as fireworksTripleMetadata } from './ModalCelebrationsFireworksTriple'
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

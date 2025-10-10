import type { GroupMetadata, GroupExport } from '@/types/animation'

import { ModalFramerFlip3d, metadata as flip3dMetadata } from './ModalFramerFlip3d'
import { ModalFramerGlitchDigital, metadata as glitchDigitalMetadata } from './ModalFramerGlitchDigital'
import { ModalFramerPortalSwirl, metadata as portalSwirlMetadata } from './ModalFramerPortalSwirl'
import { ModalFramerRippleExpand, metadata as rippleExpandMetadata } from './ModalFramerRippleExpand'
import { ModalFramerScaleGentlePop, metadata as scaleGentlePopMetadata } from './ModalFramerScaleGentlePop'
import { ModalFramerShatterAssemble, metadata as shatterAssembleMetadata } from './ModalFramerShatterAssemble'
import { ModalFramerSlideDownSoft, metadata as slideDownSoftMetadata } from './ModalFramerSlideDownSoft'
import { ModalFramerSlideLeftDrift, metadata as slideLeftDriftMetadata } from './ModalFramerSlideLeftDrift'
import { ModalFramerSlideRightDrift, metadata as slideRightDriftMetadata } from './ModalFramerSlideRightDrift'
import { ModalFramerSlideUpSoft, metadata as slideUpSoftMetadata } from './ModalFramerSlideUpSoft'
import { ModalFramerSpringBounce, metadata as springBounceMetadata } from './ModalFramerSpringBounce'
import { ModalFramerTvTurnOn, metadata as tvTurnOnMetadata } from './ModalFramerTvTurnOn'
import { ModalFramerUnfoldOrigami, metadata as unfoldOrigamiMetadata } from './ModalFramerUnfoldOrigami'
import { ModalFramerZoomElastic, metadata as zoomElasticMetadata } from './ModalFramerZoomElastic'

export const groupMetadata: GroupMetadata = {
  id: 'modal-base-framer',
  title: 'Base modals (framer)',
  tech: 'framer',
  demo: 'modalBaseFramer',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
    'modal-base-framer__scale-gentle-pop': {
      component: ModalFramerScaleGentlePop,
      metadata: scaleGentlePopMetadata,
    },
    'modal-base-framer__slide-up-soft': {
      component: ModalFramerSlideUpSoft,
      metadata: slideUpSoftMetadata,
    },
    'modal-base-framer__slide-down-soft': {
      component: ModalFramerSlideDownSoft,
      metadata: slideDownSoftMetadata,
    },
    'modal-base-framer__slide-left-drift': {
      component: ModalFramerSlideLeftDrift,
      metadata: slideLeftDriftMetadata,
    },
    'modal-base-framer__slide-right-drift': {
      component: ModalFramerSlideRightDrift,
      metadata: slideRightDriftMetadata,
    },
    'modal-base-framer__spring-bounce': {
      component: ModalFramerSpringBounce,
      metadata: springBounceMetadata,
    },
    'modal-base-framer__flip-3d': {
      component: ModalFramerFlip3d,
      metadata: flip3dMetadata,
    },
    'modal-base-framer__glitch-digital': {
      component: ModalFramerGlitchDigital,
      metadata: glitchDigitalMetadata,
    },
    'modal-base-framer__portal-swirl': {
      component: ModalFramerPortalSwirl,
      metadata: portalSwirlMetadata,
    },
    'modal-base-framer__tv-turn-on': {
      component: ModalFramerTvTurnOn,
      metadata: tvTurnOnMetadata,
    },
    'modal-base-framer__unfold-origami': {
      component: ModalFramerUnfoldOrigami,
      metadata: unfoldOrigamiMetadata,
    },
    'modal-base-framer__shatter-assemble': {
      component: ModalFramerShatterAssemble,
      metadata: shatterAssembleMetadata,
    },
    'modal-base-framer__ripple-expand': {
      component: ModalFramerRippleExpand,
      metadata: rippleExpandMetadata,
    },
    'modal-base-framer__zoom-elastic': {
      component: ModalFramerZoomElastic,
      metadata: zoomElasticMetadata,
    },
  },
}


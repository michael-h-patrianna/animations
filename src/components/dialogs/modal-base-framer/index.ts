import type { AnimationComponentMap } from '@/types/animation'

import { ModalFramerFlip3d } from './ModalFramerFlip3d'
import { ModalFramerGlitchDigital } from './ModalFramerGlitchDigital'
import { ModalFramerPortalSwirl } from './ModalFramerPortalSwirl'
import { ModalFramerRippleExpand } from './ModalFramerRippleExpand'
import { ModalFramerScaleGentlePop } from './ModalFramerScaleGentlePop'
import { ModalFramerShatterAssemble } from './ModalFramerShatterAssemble'
import { ModalFramerSlideDownSoft } from './ModalFramerSlideDownSoft'
import { ModalFramerSlideLeftDrift } from './ModalFramerSlideLeftDrift'
import { ModalFramerSlideRightDrift } from './ModalFramerSlideRightDrift'
import { ModalFramerSlideUpSoft } from './ModalFramerSlideUpSoft'
import { ModalFramerSpringBounce } from './ModalFramerSpringBounce'
import { ModalFramerTvTurnOn } from './ModalFramerTvTurnOn'
import { ModalFramerUnfoldOrigami } from './ModalFramerUnfoldOrigami'
import { ModalFramerZoomElastic } from './ModalFramerZoomElastic'

export {
  ModalFramerFlip3d,
  ModalFramerGlitchDigital,
  ModalFramerPortalSwirl,
  ModalFramerRippleExpand,
  ModalFramerScaleGentlePop,
  ModalFramerShatterAssemble,
  ModalFramerSlideDownSoft,
  ModalFramerSlideLeftDrift,
  ModalFramerSlideRightDrift,
  ModalFramerSlideUpSoft,
  ModalFramerSpringBounce,
  ModalFramerTvTurnOn,
  ModalFramerUnfoldOrigami,
  ModalFramerZoomElastic,
}

export const dialogsModalBaseFramerAnimations: AnimationComponentMap = {
  'modal-base-framer__scale-gentle-pop': ModalFramerScaleGentlePop,
  'modal-base-framer__slide-up-soft': ModalFramerSlideUpSoft,
  'modal-base-framer__slide-down-soft': ModalFramerSlideDownSoft,
  'modal-base-framer__slide-left-drift': ModalFramerSlideLeftDrift,
  'modal-base-framer__slide-right-drift': ModalFramerSlideRightDrift,
  'modal-base-framer__flip-3d': ModalFramerFlip3d,
  'modal-base-framer__glitch-digital': ModalFramerGlitchDigital,
  'modal-base-framer__portal-swirl': ModalFramerPortalSwirl,
  'modal-base-framer__tv-turn-on': ModalFramerTvTurnOn,
  'modal-base-framer__unfold-origami': ModalFramerUnfoldOrigami,
  'modal-base-framer__shatter-assemble': ModalFramerShatterAssemble,
  'modal-base-framer__ripple-expand': ModalFramerRippleExpand,
  'modal-base-framer__zoom-elastic': ModalFramerZoomElastic,
  'modal-base-framer__spring-bounce': ModalFramerSpringBounce,
}

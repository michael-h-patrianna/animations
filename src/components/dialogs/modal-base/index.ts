import type { GroupExport, GroupMetadata } from '@/types/animation'

import { ModalBaseFlip3d, metadata as flip3dMetadata } from './framer/ModalBaseFlip3d'
import {
  ModalBaseGlitchDigital,
  metadata as glitchDigitalMetadata,
} from './framer/ModalBaseGlitchDigital'
import {
  ModalBasePortalSwirl,
  metadata as portalSwirlMetadata,
} from './framer/ModalBasePortalSwirl'
import {
  ModalBaseRippleExpand,
  metadata as rippleExpandMetadata,
} from './framer/ModalBaseRippleExpand'
import {
  ModalBaseScaleGentlePop,
  metadata as scaleGentlePopMetadata,
} from './framer/ModalBaseScaleGentlePop'
import {
  ModalBaseShatterAssemble,
  metadata as shatterAssembleMetadata,
} from './framer/ModalBaseShatterAssemble'
import {
  ModalBaseSlideDownSoft,
  metadata as slideDownSoftMetadata,
} from './framer/ModalBaseSlideDownSoft'
import {
  ModalBaseSlideLeftDrift,
  metadata as slideLeftDriftMetadata,
} from './framer/ModalBaseSlideLeftDrift'
import {
  ModalBaseSlideRightDrift,
  metadata as slideRightDriftMetadata,
} from './framer/ModalBaseSlideRightDrift'
import {
  ModalBaseSlideUpSoft,
  metadata as slideUpSoftMetadata,
} from './framer/ModalBaseSlideUpSoft'
import {
  ModalBaseSpringBounce,
  metadata as springBounceMetadata,
} from './framer/ModalBaseSpringBounce'
import { ModalBaseTvTurnOn, metadata as tvTurnOnMetadata } from './framer/ModalBaseTvTurnOn'
import {
  ModalBaseUnfoldOrigami,
  metadata as unfoldOrigamiMetadata,
} from './framer/ModalBaseUnfoldOrigami'
import {
  ModalBaseZoomElastic,
  metadata as zoomElasticMetadata,
} from './framer/ModalBaseZoomElastic'

import {
  ModalBaseShatterAssemble as ModalBaseShatterAssembleCSS,
  metadata as shatterAssembleCSSMetadata,
} from './css/ModalBaseShatterAssemble'

import {
  ModalBaseSlideDownSoft as ModalBaseSlideDownSoftCSS,
  metadata as slideDownSoftCSSMetadata,
} from './css/ModalBaseSlideDownSoft'

import {
  ModalBaseSlideLeftDrift as ModalBaseSlideLeftDriftCSS,
  metadata as slideLeftDriftCSSMetadata,
} from './css/ModalBaseSlideLeftDrift'

import {
  ModalBaseSlideRightDrift as ModalBaseSlideRightDriftCSS,
  metadata as slideRightDriftCSSMetadata,
} from './css/ModalBaseSlideRightDrift'

import {
  ModalBaseScaleGentlePop as ModalBaseScaleGentlePopCSS,
  metadata as scaleGentlePopCSSMetadata,
} from './css/ModalBaseScaleGentlePop'

import {
  ModalBaseSlideUpSoft as ModalBaseSlideUpSoftCSS,
  metadata as slideUpSoftCSSMetadata,
} from './css/ModalBaseSlideUpSoft'

import {
  ModalBaseFlip3d as ModalBaseFlip3dCSS,
  metadata as flip3dCSSMetadata,
} from './css/ModalBaseFlip3d'

import {
  ModalBaseGlitchDigital as ModalBaseGlitchDigitalCSS,
  metadata as glitchDigitalCSSMetadata,
} from './css/ModalBaseGlitchDigital'

import {
  ModalBasePortalSwirl as ModalBasePortalSwirlCSS,
  metadata as portalSwirlCSSMetadata,
} from './css/ModalBasePortalSwirl'

import {
  ModalBaseTvTurnOn as ModalBaseTvTurnOnCSS,
  metadata as tvTurnOnCSSMetadata,
} from './css/ModalBaseTvTurnOn'

import {
  ModalBaseUnfoldOrigami as ModalBaseUnfoldOrigamiCSS,
  metadata as unfoldOrigamiCSSMetadata,
} from './css/ModalBaseUnfoldOrigami'

import {
  ModalBaseRippleExpand as ModalBaseRippleExpandCSS,
  metadata as rippleExpandCSSMetadata,
} from './css/ModalBaseRippleExpand'

import {
  ModalBaseZoomElastic as ModalBaseZoomElasticCSS,
  metadata as zoomElasticCSSMetadata,
} from './css/ModalBaseZoomElastic'

import {
  ModalBaseSpringBounce as ModalBaseSpringBounceCSS,
  metadata as springBounceCSSMetadata,
} from './css/ModalBaseSpringBounce'

export const groupMetadata: GroupMetadata = {
  id: 'modal-base',
  title: 'Base modal animations',
  tech: 'framer',
  demo: 'modalBaseFramer',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'modal-base__scale-gentle-pop': {
      component: ModalBaseScaleGentlePop,
      metadata: scaleGentlePopMetadata,
    },
    'modal-base__slide-up-soft': {
      component: ModalBaseSlideUpSoft,
      metadata: slideUpSoftMetadata,
    },
    'modal-base__slide-down-soft': {
      component: ModalBaseSlideDownSoft,
      metadata: slideDownSoftMetadata,
    },
    'modal-base__slide-left-drift': {
      component: ModalBaseSlideLeftDrift,
      metadata: slideLeftDriftMetadata,
    },
    'modal-base__slide-right-drift': {
      component: ModalBaseSlideRightDrift,
      metadata: slideRightDriftMetadata,
    },
    'modal-base__spring-bounce': {
      component: ModalBaseSpringBounce,
      metadata: springBounceMetadata,
    },
    'modal-base__flip-3d': {
      component: ModalBaseFlip3d,
      metadata: flip3dMetadata,
    },
    'modal-base__glitch-digital': {
      component: ModalBaseGlitchDigital,
      metadata: glitchDigitalMetadata,
    },
    'modal-base__portal-swirl': {
      component: ModalBasePortalSwirl,
      metadata: portalSwirlMetadata,
    },
    'modal-base__tv-turn-on': {
      component: ModalBaseTvTurnOn,
      metadata: tvTurnOnMetadata,
    },
    'modal-base__unfold-origami': {
      component: ModalBaseUnfoldOrigami,
      metadata: unfoldOrigamiMetadata,
    },
    'modal-base__shatter-assemble': {
      component: ModalBaseShatterAssemble,
      metadata: shatterAssembleMetadata,
    },
    'modal-base__ripple-expand': {
      component: ModalBaseRippleExpand,
      metadata: rippleExpandMetadata,
    },
    'modal-base__zoom-elastic': {
      component: ModalBaseZoomElastic,
      metadata: zoomElasticMetadata,
    },
  },
  css: {
    'modal-base__shatter-assemble': {
      component: ModalBaseShatterAssembleCSS,
      metadata: shatterAssembleCSSMetadata,
    },
    'modal-base__slide-down-soft': {
      component: ModalBaseSlideDownSoftCSS,
      metadata: slideDownSoftCSSMetadata,
    },
    'modal-base__slide-left-drift': {
      component: ModalBaseSlideLeftDriftCSS,
      metadata: slideLeftDriftCSSMetadata,
    },
    'modal-base__slide-right-drift': {
      component: ModalBaseSlideRightDriftCSS,
      metadata: slideRightDriftCSSMetadata,
    },
    'modal-base__scale-gentle-pop': {
      component: ModalBaseScaleGentlePopCSS,
      metadata: scaleGentlePopCSSMetadata,
    },
    'modal-base__slide-up-soft': {
      component: ModalBaseSlideUpSoftCSS,
      metadata: slideUpSoftCSSMetadata,
    },
    'modal-base__flip-3d': {
      component: ModalBaseFlip3dCSS,
      metadata: flip3dCSSMetadata,
    },
    'modal-base__glitch-digital': {
      component: ModalBaseGlitchDigitalCSS,
      metadata: glitchDigitalCSSMetadata,
    },
    'modal-base__portal-swirl': {
      component: ModalBasePortalSwirlCSS,
      metadata: portalSwirlCSSMetadata,
    },
    'modal-base__tv-turn-on': {
      component: ModalBaseTvTurnOnCSS,
      metadata: tvTurnOnCSSMetadata,
    },
    'modal-base__unfold-origami': {
      component: ModalBaseUnfoldOrigamiCSS,
      metadata: unfoldOrigamiCSSMetadata,
    },
    'modal-base__ripple-expand': {
      component: ModalBaseRippleExpandCSS,
      metadata: rippleExpandCSSMetadata,
    },
    'modal-base__zoom-elastic': {
      component: ModalBaseZoomElasticCSS,
      metadata: zoomElasticCSSMetadata,
    },
    'modal-base__spring-bounce': {
      component: ModalBaseSpringBounceCSS,
      metadata: springBounceCSSMetadata,
    },
  },
}

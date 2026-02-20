import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as flip3dMetadata } from './framer/ModalBaseFlip3d.meta'
import { metadata as glitchDigitalMetadata } from './framer/ModalBaseGlitchDigital.meta'
import { metadata as portalSwirlMetadata } from './framer/ModalBasePortalSwirl.meta'
import { metadata as rippleExpandMetadata } from './framer/ModalBaseRippleExpand.meta'
import { metadata as scaleGentlePopMetadata } from './framer/ModalBaseScaleGentlePop.meta'
import { metadata as shatterAssembleMetadata } from './framer/ModalBaseShatterAssemble.meta'
import { metadata as slideDownSoftMetadata } from './framer/ModalBaseSlideDownSoft.meta'
import { metadata as slideLeftDriftMetadata } from './framer/ModalBaseSlideLeftDrift.meta'
import { metadata as slideRightDriftMetadata } from './framer/ModalBaseSlideRightDrift.meta'
import { metadata as slideUpSoftMetadata } from './framer/ModalBaseSlideUpSoft.meta'
import { metadata as springBounceMetadata } from './framer/ModalBaseSpringBounce.meta'
import { metadata as tvTurnOnMetadata } from './framer/ModalBaseTvTurnOn.meta'
import { metadata as unfoldOrigamiMetadata } from './framer/ModalBaseUnfoldOrigami.meta'
import { metadata as zoomElasticMetadata } from './framer/ModalBaseZoomElastic.meta'

// CSS - Import metadata only
import { metadata as flip3dCSSMetadata } from './css/ModalBaseFlip3d.meta'
import { metadata as glitchDigitalCSSMetadata } from './css/ModalBaseGlitchDigital.meta'
import { metadata as portalSwirlCSSMetadata } from './css/ModalBasePortalSwirl.meta'
import { metadata as rippleExpandCSSMetadata } from './css/ModalBaseRippleExpand.meta'
import { metadata as scaleGentlePopCSSMetadata } from './css/ModalBaseScaleGentlePop.meta'
import { metadata as shatterAssembleCSSMetadata } from './css/ModalBaseShatterAssemble.meta'
import { metadata as slideDownSoftCSSMetadata } from './css/ModalBaseSlideDownSoft.meta'
import { metadata as slideLeftDriftCSSMetadata } from './css/ModalBaseSlideLeftDrift.meta'
import { metadata as slideRightDriftCSSMetadata } from './css/ModalBaseSlideRightDrift.meta'
import { metadata as slideUpSoftCSSMetadata } from './css/ModalBaseSlideUpSoft.meta'
import { metadata as springBounceCSSMetadata } from './css/ModalBaseSpringBounce.meta'
import { metadata as tvTurnOnCSSMetadata } from './css/ModalBaseTvTurnOn.meta'
import { metadata as unfoldOrigamiCSSMetadata } from './css/ModalBaseUnfoldOrigami.meta'
import { metadata as zoomElasticCSSMetadata } from './css/ModalBaseZoomElastic.meta'

// Framer Motion - Lazy load components
const ModalBaseFlip3d = lazy(() =>
  import('./framer/ModalBaseFlip3d').then((m) => ({ default: m.ModalBaseFlip3d }))
)
const ModalBaseGlitchDigital = lazy(() =>
  import('./framer/ModalBaseGlitchDigital').then((m) => ({ default: m.ModalBaseGlitchDigital }))
)
const ModalBasePortalSwirl = lazy(() =>
  import('./framer/ModalBasePortalSwirl').then((m) => ({ default: m.ModalBasePortalSwirl }))
)
const ModalBaseRippleExpand = lazy(() =>
  import('./framer/ModalBaseRippleExpand').then((m) => ({ default: m.ModalBaseRippleExpand }))
)
const ModalBaseScaleGentlePop = lazy(() =>
  import('./framer/ModalBaseScaleGentlePop').then((m) => ({ default: m.ModalBaseScaleGentlePop }))
)
const ModalBaseShatterAssemble = lazy(() =>
  import('./framer/ModalBaseShatterAssemble').then((m) => ({ default: m.ModalBaseShatterAssemble }))
)
const ModalBaseSlideDownSoft = lazy(() =>
  import('./framer/ModalBaseSlideDownSoft').then((m) => ({ default: m.ModalBaseSlideDownSoft }))
)
const ModalBaseSlideLeftDrift = lazy(() =>
  import('./framer/ModalBaseSlideLeftDrift').then((m) => ({ default: m.ModalBaseSlideLeftDrift }))
)
const ModalBaseSlideRightDrift = lazy(() =>
  import('./framer/ModalBaseSlideRightDrift').then((m) => ({ default: m.ModalBaseSlideRightDrift }))
)
const ModalBaseSlideUpSoft = lazy(() =>
  import('./framer/ModalBaseSlideUpSoft').then((m) => ({ default: m.ModalBaseSlideUpSoft }))
)
const ModalBaseSpringBounce = lazy(() =>
  import('./framer/ModalBaseSpringBounce').then((m) => ({ default: m.ModalBaseSpringBounce }))
)
const ModalBaseTvTurnOn = lazy(() =>
  import('./framer/ModalBaseTvTurnOn').then((m) => ({ default: m.ModalBaseTvTurnOn }))
)
const ModalBaseUnfoldOrigami = lazy(() =>
  import('./framer/ModalBaseUnfoldOrigami').then((m) => ({ default: m.ModalBaseUnfoldOrigami }))
)
const ModalBaseZoomElastic = lazy(() =>
  import('./framer/ModalBaseZoomElastic').then((m) => ({ default: m.ModalBaseZoomElastic }))
)

// CSS - Lazy load components
const ModalBaseShatterAssembleCSS = lazy(() =>
  import('./css/ModalBaseShatterAssemble').then((m) => ({ default: m.ModalBaseShatterAssemble }))
)
const ModalBaseSlideDownSoftCSS = lazy(() =>
  import('./css/ModalBaseSlideDownSoft').then((m) => ({ default: m.ModalBaseSlideDownSoft }))
)
const ModalBaseSlideLeftDriftCSS = lazy(() =>
  import('./css/ModalBaseSlideLeftDrift').then((m) => ({ default: m.ModalBaseSlideLeftDrift }))
)
const ModalBaseSlideRightDriftCSS = lazy(() =>
  import('./css/ModalBaseSlideRightDrift').then((m) => ({ default: m.ModalBaseSlideRightDrift }))
)
const ModalBaseScaleGentlePopCSS = lazy(() =>
  import('./css/ModalBaseScaleGentlePop').then((m) => ({ default: m.ModalBaseScaleGentlePop }))
)
const ModalBaseSlideUpSoftCSS = lazy(() =>
  import('./css/ModalBaseSlideUpSoft').then((m) => ({ default: m.ModalBaseSlideUpSoft }))
)
const ModalBaseFlip3dCSS = lazy(() =>
  import('./css/ModalBaseFlip3d').then((m) => ({ default: m.ModalBaseFlip3d }))
)
const ModalBaseGlitchDigitalCSS = lazy(() =>
  import('./css/ModalBaseGlitchDigital').then((m) => ({ default: m.ModalBaseGlitchDigital }))
)
const ModalBasePortalSwirlCSS = lazy(() =>
  import('./css/ModalBasePortalSwirl').then((m) => ({ default: m.ModalBasePortalSwirl }))
)
const ModalBaseTvTurnOnCSS = lazy(() =>
  import('./css/ModalBaseTvTurnOn').then((m) => ({ default: m.ModalBaseTvTurnOn }))
)
const ModalBaseUnfoldOrigamiCSS = lazy(() =>
  import('./css/ModalBaseUnfoldOrigami').then((m) => ({ default: m.ModalBaseUnfoldOrigami }))
)
const ModalBaseRippleExpandCSS = lazy(() =>
  import('./css/ModalBaseRippleExpand').then((m) => ({ default: m.ModalBaseRippleExpand }))
)
const ModalBaseZoomElasticCSS = lazy(() =>
  import('./css/ModalBaseZoomElastic').then((m) => ({ default: m.ModalBaseZoomElastic }))
)
const ModalBaseSpringBounceCSS = lazy(() =>
  import('./css/ModalBaseSpringBounce').then((m) => ({ default: m.ModalBaseSpringBounce }))
)

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
    'modal-base__tfx-glitchdigital': {
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
    'modal-base__tfx-glitchdigital': {
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

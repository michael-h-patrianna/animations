import type {
  GroupMetadata,
  GroupExport
} from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as metadataButtonsStagger2 } from './framer/ModalContentButtonsStagger2.meta'
import { metadata as metadataButtonsStagger3 } from './framer/ModalContentButtonsStagger3.meta'
import { metadata as metadataFormFieldGradient } from './framer/ModalContentFormFieldGradient.meta'
import { metadata as metadataFormFieldLeftReveal } from './framer/ModalContentFormFieldLeftReveal.meta'
import { metadata as metadataFormFieldRightReveal } from './framer/ModalContentFormFieldRightReveal.meta'
import { metadata as metadataListSoftStagger } from './framer/ModalContentListSoftStagger.meta'
import { metadata as metadataListVerticalWipe } from './framer/ModalContentListVerticalWipe.meta'

// CSS - Import metadata only
import { metadata as metadataButtonsStagger2Css } from './css/ModalContentButtonsStagger2.meta'
import { metadata as metadataButtonsStagger3Css } from './css/ModalContentButtonsStagger3.meta'
import { metadata as metadataFormFieldGradientCss } from './css/ModalContentFormFieldGradient.meta'
import { metadata as metadataFormFieldLeftRevealCss } from './css/ModalContentFormFieldLeftReveal.meta'
import { metadata as metadataFormFieldRightRevealCss } from './css/ModalContentFormFieldRightReveal.meta'
import { metadata as metadataListSoftStaggerCss } from './css/ModalContentListSoftStagger.meta'
import { metadata as metadataListSpotlightCss } from './css/ModalContentListSpotlight.meta'
import { metadata as metadataListVerticalWipeCss } from './css/ModalContentListVerticalWipe.meta'

// Framer Motion - Lazy load components
const ModalContentButtonsStagger2 = lazy(() => import('./framer/ModalContentButtonsStagger2').then(m => ({ default: m.ModalContentButtonsStagger2 })))
const ModalContentButtonsStagger3 = lazy(() => import('./framer/ModalContentButtonsStagger3').then(m => ({ default: m.ModalContentButtonsStagger3 })))
const ModalContentFormFieldGradient = lazy(() => import('./framer/ModalContentFormFieldGradient').then(m => ({ default: m.ModalContentFormFieldGradient })))
const ModalContentFormFieldLeftReveal = lazy(() => import('./framer/ModalContentFormFieldLeftReveal').then(m => ({ default: m.ModalContentFormFieldLeftReveal })))
const ModalContentFormFieldRightReveal = lazy(() => import('./framer/ModalContentFormFieldRightReveal').then(m => ({ default: m.ModalContentFormFieldRightReveal })))
const ModalContentListSoftStagger = lazy(() => import('./framer/ModalContentListSoftStagger').then(m => ({ default: m.ModalContentListSoftStagger })))
const ModalContentListVerticalWipe = lazy(() => import('./framer/ModalContentListVerticalWipe').then(m => ({ default: m.ModalContentListVerticalWipe })))

// CSS - Lazy load components
const CssModalContentButtonsStagger2 = lazy(() => import('./css/ModalContentButtonsStagger2').then(m => ({ default: m.ModalContentButtonsStagger2 })))
const CssModalContentButtonsStagger3 = lazy(() => import('./css/ModalContentButtonsStagger3').then(m => ({ default: m.ModalContentButtonsStagger3 })))
const CssModalContentFormFieldGradient = lazy(() => import('./css/ModalContentFormFieldGradient').then(m => ({ default: m.ModalContentFormFieldGradient })))
const CssModalContentFormFieldLeftReveal = lazy(() => import('./css/ModalContentFormFieldLeftReveal').then(m => ({ default: m.ModalContentFormFieldLeftReveal })))
const CssModalContentFormFieldRightReveal = lazy(() => import('./css/ModalContentFormFieldRightReveal').then(m => ({ default: m.ModalContentFormFieldRightReveal })))
const CssModalContentListSoftStagger = lazy(() => import('./css/ModalContentListSoftStagger').then(m => ({ default: m.ModalContentListSoftStagger })))
const CssModalContentListSpotlight = lazy(() => import('./css/ModalContentListSpotlight').then(m => ({ default: m.ModalContentListSpotlight })))
const CssModalContentListVerticalWipe = lazy(() => import('./css/ModalContentListVerticalWipe').then(m => ({ default: m.ModalContentListVerticalWipe })))

// Group metadata
export const groupMetadata: GroupMetadata = {
  id: 'modal-content',
  title: 'Content choreography',
  tech: 'css',
  demo: 'modalContent'
}

// Group export with co-located metadata
export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'modal-content__buttons-stagger-2': {
      component: ModalContentButtonsStagger2,
      metadata: metadataButtonsStagger2
    },
    'modal-content__buttons-stagger-3': {
      component: ModalContentButtonsStagger3,
      metadata: metadataButtonsStagger3
    },
    'modal-content__form-field-gradient': {
      component: ModalContentFormFieldGradient,
      metadata: metadataFormFieldGradient
    },
    'modal-content__form-field-left-reveal': {
      component: ModalContentFormFieldLeftReveal,
      metadata: metadataFormFieldLeftReveal
    },
    'modal-content__form-field-right-reveal': {
      component: ModalContentFormFieldRightReveal,
      metadata: metadataFormFieldRightReveal
    },
    'modal-content__list-soft-stagger': {
      component: ModalContentListSoftStagger,
      metadata: metadataListSoftStagger
    },
    'modal-content__list-vertical-wipe': {
      component: ModalContentListVerticalWipe,
      metadata: metadataListVerticalWipe
    }
  },
  css: {
    'modal-content__buttons-stagger-2': {
      component: CssModalContentButtonsStagger2,
      metadata: metadataButtonsStagger2Css
    },
    'modal-content__buttons-stagger-3': {
      component: CssModalContentButtonsStagger3,
      metadata: metadataButtonsStagger3Css
    },
    'modal-content__form-field-gradient': {
      component: CssModalContentFormFieldGradient,
      metadata: metadataFormFieldGradientCss
    },
    'modal-content__form-field-left-reveal': {
      component: CssModalContentFormFieldLeftReveal,
      metadata: metadataFormFieldLeftRevealCss
    },
    'modal-content__form-field-right-reveal': {
      component: CssModalContentFormFieldRightReveal,
      metadata: metadataFormFieldRightRevealCss
    },
    'modal-content__list-soft-stagger': {
      component: CssModalContentListSoftStagger,
      metadata: metadataListSoftStaggerCss
    },
    'modal-content__list-spotlight': {
      component: CssModalContentListSpotlight,
      metadata: metadataListSpotlightCss
    },
    'modal-content__list-vertical-wipe': {
      component: CssModalContentListVerticalWipe,
      metadata: metadataListVerticalWipeCss
    }
  },
}

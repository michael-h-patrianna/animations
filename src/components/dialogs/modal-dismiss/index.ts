import type {
  GroupMetadata,
  GroupExport
} from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as metadataSnackbarScale } from './framer/ModalDismissSnackbarScale.meta'
import { metadata as metadataSnackbarWipe } from './framer/ModalDismissSnackbarWipe.meta'
import { metadata as metadataToastDrop } from './framer/ModalDismissToastDrop.meta'
import { metadata as metadataToastFadeProgress } from './framer/ModalDismissToastFadeProgress.meta'
import { metadata as metadataToastRaise } from './framer/ModalDismissToastRaise.meta'
import { metadata as metadataToastSlideLeft } from './framer/ModalDismissToastSlideLeft.meta'
import { metadata as metadataToastSlideRight } from './framer/ModalDismissToastSlideRight.meta'

// CSS - Import metadata only
import { metadata as metadataSnackbarScaleCss } from './css/ModalDismissSnackbarScale.meta'
import { metadata as metadataSnackbarWipeCss } from './css/ModalDismissSnackbarWipe.meta'
import { metadata as metadataToastDropCss } from './css/ModalDismissToastDrop.meta'
import { metadata as metadataToastFadeProgressCss } from './css/ModalDismissToastFadeProgress.meta'
import { metadata as metadataToastRaiseCss } from './css/ModalDismissToastRaise.meta'
import { metadata as metadataToastSlideLeftCss } from './css/ModalDismissToastSlideLeft.meta'
import { metadata as metadataToastSlideRightCss } from './css/ModalDismissToastSlideRight.meta'

// Framer Motion - Lazy load components
const ModalDismissSnackbarScale = lazy(() => import('./framer/ModalDismissSnackbarScale').then(m => ({ default: m.ModalDismissSnackbarScale })))
const ModalDismissSnackbarWipe = lazy(() => import('./framer/ModalDismissSnackbarWipe').then(m => ({ default: m.ModalDismissSnackbarWipe })))
const ModalDismissToastDrop = lazy(() => import('./framer/ModalDismissToastDrop').then(m => ({ default: m.ModalDismissToastDrop })))
const ModalDismissToastFadeProgress = lazy(() => import('./framer/ModalDismissToastFadeProgress').then(m => ({ default: m.ModalDismissToastFadeProgress })))
const ModalDismissToastRaise = lazy(() => import('./framer/ModalDismissToastRaise').then(m => ({ default: m.ModalDismissToastRaise })))
const ModalDismissToastSlideLeft = lazy(() => import('./framer/ModalDismissToastSlideLeft').then(m => ({ default: m.ModalDismissToastSlideLeft })))
const ModalDismissToastSlideRight = lazy(() => import('./framer/ModalDismissToastSlideRight').then(m => ({ default: m.ModalDismissToastSlideRight })))

// CSS - Lazy load components
const CssModalDismissSnackbarScale = lazy(() => import('./css/ModalDismissSnackbarScale').then(m => ({ default: m.ModalDismissSnackbarScale })))
const CssModalDismissSnackbarWipe = lazy(() => import('./css/ModalDismissSnackbarWipe').then(m => ({ default: m.ModalDismissSnackbarWipe })))
const CssModalDismissToastDrop = lazy(() => import('./css/ModalDismissToastDrop').then(m => ({ default: m.ModalDismissToastDrop })))
const CssModalDismissToastFadeProgress = lazy(() => import('./css/ModalDismissToastFadeProgress').then(m => ({ default: m.ModalDismissToastFadeProgress })))
const CssModalDismissToastRaise = lazy(() => import('./css/ModalDismissToastRaise').then(m => ({ default: m.ModalDismissToastRaise })))
const CssModalDismissToastSlideLeft = lazy(() => import('./css/ModalDismissToastSlideLeft').then(m => ({ default: m.ModalDismissToastSlideLeft })))
const CssModalDismissToastSlideRight = lazy(() => import('./css/ModalDismissToastSlideRight').then(m => ({ default: m.ModalDismissToastSlideRight })))

// Group metadata
export const groupMetadata: GroupMetadata = {
  id: 'modal-dismiss',
  title: 'Auto-dismiss patterns',
  tech: 'css',
  demo: 'toast'
}

// Group export with co-located metadata
export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'modal-dismiss__toast-slide-left': {
      component: ModalDismissToastSlideLeft,
      metadata: metadataToastSlideLeft
    },
    'modal-dismiss__toast-slide-right': {
      component: ModalDismissToastSlideRight,
      metadata: metadataToastSlideRight
    },
    'modal-dismiss__toast-drop': {
      component: ModalDismissToastDrop,
      metadata: metadataToastDrop
    },
    'modal-dismiss__toast-raise': {
      component: ModalDismissToastRaise,
      metadata: metadataToastRaise
    },
    'modal-dismiss__toast-fade-progress': {
      component: ModalDismissToastFadeProgress,
      metadata: metadataToastFadeProgress
    },
    'modal-dismiss__snackbar-wipe': {
      component: ModalDismissSnackbarWipe,
      metadata: metadataSnackbarWipe
    },
    'modal-dismiss__snackbar-scale': {
      component: ModalDismissSnackbarScale,
      metadata: metadataSnackbarScale
    }
  },
  css: {
    'modal-dismiss__toast-slide-left': {
      component: CssModalDismissToastSlideLeft,
      metadata: metadataToastSlideLeftCss
    },
    'modal-dismiss__toast-slide-right': {
      component: CssModalDismissToastSlideRight,
      metadata: metadataToastSlideRightCss
    },
    'modal-dismiss__toast-drop': {
      component: CssModalDismissToastDrop,
      metadata: metadataToastDropCss
    },
    'modal-dismiss__toast-raise': {
      component: CssModalDismissToastRaise,
      metadata: metadataToastRaiseCss
    },
    'modal-dismiss__toast-fade-progress': {
      component: CssModalDismissToastFadeProgress,
      metadata: metadataToastFadeProgressCss
    },
    'modal-dismiss__snackbar-wipe': {
      component: CssModalDismissSnackbarWipe,
      metadata: metadataSnackbarWipeCss
    },
    'modal-dismiss__snackbar-scale': {
      component: CssModalDismissSnackbarScale,
      metadata: metadataSnackbarScaleCss
    }
  },
}

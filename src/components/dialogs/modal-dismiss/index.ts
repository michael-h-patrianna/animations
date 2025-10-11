import type {
  GroupMetadata,
  GroupExport
} from '@/types/animation'

import {
  ModalDismissSnackbarScale,
  metadata as metadataSnackbarScale
} from './framer/ModalDismissSnackbarScale'
import {
  ModalDismissSnackbarWipe,
  metadata as metadataSnackbarWipe
} from './framer/ModalDismissSnackbarWipe'
import {
  ModalDismissToastDrop,
  metadata as metadataToastDrop
} from './framer/ModalDismissToastDrop'
import {
  ModalDismissToastFadeProgress,
  metadata as metadataToastFadeProgress
} from './framer/ModalDismissToastFadeProgress'
import {
  ModalDismissToastRaise,
  metadata as metadataToastRaise
} from './framer/ModalDismissToastRaise'
import {
  ModalDismissToastSlideLeft,
  metadata as metadataToastSlideLeft
} from './framer/ModalDismissToastSlideLeft'
import {
  ModalDismissToastSlideRight,
  metadata as metadataToastSlideRight
} from './framer/ModalDismissToastSlideRight'

// CSS animations
import {
  ModalDismissSnackbarScale as CssModalDismissSnackbarScale,
  metadata as metadataSnackbarScaleCss
} from './css/ModalDismissSnackbarScale'
import {
  ModalDismissSnackbarWipe as CssModalDismissSnackbarWipe,
  metadata as metadataSnackbarWipeCss
} from './css/ModalDismissSnackbarWipe'
import {
  ModalDismissToastDrop as CssModalDismissToastDrop,
  metadata as metadataToastDropCss
} from './css/ModalDismissToastDrop'
import {
  ModalDismissToastFadeProgress as CssModalDismissToastFadeProgress,
  metadata as metadataToastFadeProgressCss
} from './css/ModalDismissToastFadeProgress'
import {
  ModalDismissToastRaise as CssModalDismissToastRaise,
  metadata as metadataToastRaiseCss
} from './css/ModalDismissToastRaise'
import {
  ModalDismissToastSlideLeft as CssModalDismissToastSlideLeft,
  metadata as metadataToastSlideLeftCss
} from './css/ModalDismissToastSlideLeft'
import {
  ModalDismissToastSlideRight as CssModalDismissToastSlideRight,
  metadata as metadataToastSlideRightCss
} from './css/ModalDismissToastSlideRight'

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


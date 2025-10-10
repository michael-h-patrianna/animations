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
  css: {},
}


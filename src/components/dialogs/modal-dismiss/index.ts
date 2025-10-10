import type {
  GroupMetadata,
  GroupExport
} from '@/types/animation'

import {
  ModalDismissSnackbarScale,
  metadata as metadataSnackbarScale
} from './ModalDismissSnackbarScale'
import {
  ModalDismissSnackbarWipe,
  metadata as metadataSnackbarWipe
} from './ModalDismissSnackbarWipe'
import {
  ModalDismissToastDrop,
  metadata as metadataToastDrop
} from './ModalDismissToastDrop'
import {
  ModalDismissToastFadeProgress,
  metadata as metadataToastFadeProgress
} from './ModalDismissToastFadeProgress'
import {
  ModalDismissToastRaise,
  metadata as metadataToastRaise
} from './ModalDismissToastRaise'
import {
  ModalDismissToastSlideLeft,
  metadata as metadataToastSlideLeft
} from './ModalDismissToastSlideLeft'
import {
  ModalDismissToastSlideRight,
  metadata as metadataToastSlideRight
} from './ModalDismissToastSlideRight'

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
  animations: {
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
  }
}


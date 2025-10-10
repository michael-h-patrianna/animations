import type {
  GroupMetadata,
  GroupExport
} from '@/types/animation'

import {
  ModalContentButtonsStagger2,
  metadata as metadataButtonsStagger2
} from './ModalContentButtonsStagger2'
import {
  ModalContentButtonsStagger3,
  metadata as metadataButtonsStagger3
} from './ModalContentButtonsStagger3'
import {
  ModalContentFormFieldGradient,
  metadata as metadataFormFieldGradient
} from './ModalContentFormFieldGradient'
import {
  ModalContentFormFieldLeftReveal,
  metadata as metadataFormFieldLeftReveal
} from './ModalContentFormFieldLeftReveal'
import {
  ModalContentFormFieldRightReveal,
  metadata as metadataFormFieldRightReveal
} from './ModalContentFormFieldRightReveal'
import {
  ModalContentListSoftStagger,
  metadata as metadataListSoftStagger
} from './ModalContentListSoftStagger'
import {
  ModalContentListSpotlight,
  metadata as metadataListSpotlight
} from './ModalContentListSpotlight'
import {
  ModalContentListVerticalWipe,
  metadata as metadataListVerticalWipe
} from './ModalContentListVerticalWipe'

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
  animations: {
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
    'modal-content__list-spotlight': {
      component: ModalContentListSpotlight,
      metadata: metadataListSpotlight
    },
    'modal-content__list-vertical-wipe': {
      component: ModalContentListVerticalWipe,
      metadata: metadataListVerticalWipe
    }
  }
}


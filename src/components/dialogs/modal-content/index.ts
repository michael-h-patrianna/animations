import type {
  GroupMetadata,
  GroupExport
} from '@/types/animation'

import {
  ModalContentButtonsStagger2,
  metadata as metadataButtonsStagger2
} from './framer/ModalContentButtonsStagger2'
import {
  ModalContentButtonsStagger3,
  metadata as metadataButtonsStagger3
} from './framer/ModalContentButtonsStagger3'
import {
  ModalContentFormFieldGradient,
  metadata as metadataFormFieldGradient
} from './framer/ModalContentFormFieldGradient'
import {
  ModalContentFormFieldLeftReveal,
  metadata as metadataFormFieldLeftReveal
} from './framer/ModalContentFormFieldLeftReveal'
import {
  ModalContentFormFieldRightReveal,
  metadata as metadataFormFieldRightReveal
} from './framer/ModalContentFormFieldRightReveal'
import {
  ModalContentListSoftStagger,
  metadata as metadataListSoftStagger
} from './framer/ModalContentListSoftStagger'
import {
  ModalContentListVerticalWipe,
  metadata as metadataListVerticalWipe
} from './framer/ModalContentListVerticalWipe'

// CSS animations
import {
  ModalContentButtonsStagger2 as CssModalContentButtonsStagger2,
  metadata as metadataButtonsStagger2Css
} from './css/ModalContentButtonsStagger2'
import {
  ModalContentButtonsStagger3 as CssModalContentButtonsStagger3,
  metadata as metadataButtonsStagger3Css
} from './css/ModalContentButtonsStagger3'
import {
  ModalContentFormFieldGradient as CssModalContentFormFieldGradient,
  metadata as metadataFormFieldGradientCss
} from './css/ModalContentFormFieldGradient'
import {
  ModalContentFormFieldLeftReveal as CssModalContentFormFieldLeftReveal,
  metadata as metadataFormFieldLeftRevealCss
} from './css/ModalContentFormFieldLeftReveal'
import {
  ModalContentFormFieldRightReveal as CssModalContentFormFieldRightReveal,
  metadata as metadataFormFieldRightRevealCss
} from './css/ModalContentFormFieldRightReveal'
import {
  ModalContentListSoftStagger as CssModalContentListSoftStagger,
  metadata as metadataListSoftStaggerCss
} from './css/ModalContentListSoftStagger'
import {
  ModalContentListSpotlight as CssModalContentListSpotlight,
  metadata as metadataListSpotlightCss
} from './css/ModalContentListSpotlight'
import {
  ModalContentListVerticalWipe as CssModalContentListVerticalWipe,
  metadata as metadataListVerticalWipeCss
} from './css/ModalContentListVerticalWipe'

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


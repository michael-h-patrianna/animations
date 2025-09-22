import type { AnimationComponentMap } from '@/types/animation'

import { ModalContentButtonsStagger2 } from './ModalContentButtonsStagger2'
import { ModalContentButtonsStagger3 } from './ModalContentButtonsStagger3'
import { ModalContentFormFieldGradient } from './ModalContentFormFieldGradient'
import { ModalContentFormFieldLeftReveal } from './ModalContentFormFieldLeftReveal'
import { ModalContentFormFieldRightReveal } from './ModalContentFormFieldRightReveal'
import { ModalContentListSoftStagger } from './ModalContentListSoftStagger'
import { ModalContentListSpotlight } from './ModalContentListSpotlight'
import { ModalContentListVerticalWipe } from './ModalContentListVerticalWipe'

export { ModalContentButtonsStagger2 } from './ModalContentButtonsStagger2'
export { ModalContentButtonsStagger3 } from './ModalContentButtonsStagger3'
export { ModalContentFormFieldGradient } from './ModalContentFormFieldGradient'
export { ModalContentFormFieldLeftReveal } from './ModalContentFormFieldLeftReveal'
export { ModalContentFormFieldRightReveal } from './ModalContentFormFieldRightReveal'
export { ModalContentListSoftStagger } from './ModalContentListSoftStagger'
export { ModalContentListSpotlight } from './ModalContentListSpotlight'
export { ModalContentListVerticalWipe } from './ModalContentListVerticalWipe'

export const dialogsModalContentAnimations: AnimationComponentMap = {
  'modal-content__buttons-stagger-2': ModalContentButtonsStagger2,
  'modal-content__buttons-stagger-3': ModalContentButtonsStagger3,
  'modal-content__form-field-gradient': ModalContentFormFieldGradient,
  'modal-content__form-field-left-reveal': ModalContentFormFieldLeftReveal,
  'modal-content__form-field-right-reveal': ModalContentFormFieldRightReveal,
  'modal-content__list-soft-stagger': ModalContentListSoftStagger,
  'modal-content__list-spotlight': ModalContentListSpotlight,
  'modal-content__list-vertical-wipe': ModalContentListVerticalWipe,
}

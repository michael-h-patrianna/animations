import type { AnimationComponentMap } from '@/types/animation';

import { ModalDismissNotificationBurst } from './ModalDismissNotificationBurst';
import { ModalDismissSnackbarScale } from './ModalDismissSnackbarScale';
import { ModalDismissSnackbarWipe } from './ModalDismissSnackbarWipe';
import { ModalDismissToastDrop } from './ModalDismissToastDrop';
import { ModalDismissToastFadeProgress } from './ModalDismissToastFadeProgress';
import { ModalDismissToastRaise } from './ModalDismissToastRaise';
import { ModalDismissToastSlideLeft } from './ModalDismissToastSlideLeft';
import { ModalDismissToastSlideRight } from './ModalDismissToastSlideRight';

export { ModalDismissNotificationBurst } from './ModalDismissNotificationBurst';
export { ModalDismissSnackbarScale } from './ModalDismissSnackbarScale';
export { ModalDismissSnackbarWipe } from './ModalDismissSnackbarWipe';
export { ModalDismissToastDrop } from './ModalDismissToastDrop';
export { ModalDismissToastFadeProgress } from './ModalDismissToastFadeProgress';
export { ModalDismissToastRaise } from './ModalDismissToastRaise';
export { ModalDismissToastSlideLeft } from './ModalDismissToastSlideLeft';
export { ModalDismissToastSlideRight } from './ModalDismissToastSlideRight';

export const dialogsModalDismissAnimations: AnimationComponentMap = {
  'modal-dismiss__notification-burst': ModalDismissNotificationBurst,
  'modal-dismiss__snackbar-scale': ModalDismissSnackbarScale,
  'modal-dismiss__snackbar-wipe': ModalDismissSnackbarWipe,
  'modal-dismiss__toast-drop': ModalDismissToastDrop,
  'modal-dismiss__toast-fade-progress': ModalDismissToastFadeProgress,
  'modal-dismiss__toast-raise': ModalDismissToastRaise,
  'modal-dismiss__toast-slide-left': ModalDismissToastSlideLeft,
  'modal-dismiss__toast-slide-right': ModalDismissToastSlideRight
};

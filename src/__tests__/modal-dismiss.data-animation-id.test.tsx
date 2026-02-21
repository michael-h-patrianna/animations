import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ModalDismissSnackbarScale as CssModalDismissSnackbarScale } from '@/components/dialogs/modal-dismiss/css/ModalDismissSnackbarScale'
import { ModalDismissSnackbarWipe as CssModalDismissSnackbarWipe } from '@/components/dialogs/modal-dismiss/css/ModalDismissSnackbarWipe'
import { ModalDismissToastDrop as CssModalDismissToastDrop } from '@/components/dialogs/modal-dismiss/css/ModalDismissToastDrop'
import { ModalDismissToastFadeProgress as CssModalDismissToastFadeProgress } from '@/components/dialogs/modal-dismiss/css/ModalDismissToastFadeProgress'
import { ModalDismissToastRaise as CssModalDismissToastRaise } from '@/components/dialogs/modal-dismiss/css/ModalDismissToastRaise'
import { ModalDismissToastSlideLeft as CssModalDismissToastSlideLeft } from '@/components/dialogs/modal-dismiss/css/ModalDismissToastSlideLeft'
import { ModalDismissToastSlideRight as CssModalDismissToastSlideRight } from '@/components/dialogs/modal-dismiss/css/ModalDismissToastSlideRight'
import { ModalDismissSnackbarScale as FramerModalDismissSnackbarScale } from '@/components/dialogs/modal-dismiss/framer/ModalDismissSnackbarScale'
import { ModalDismissSnackbarWipe as FramerModalDismissSnackbarWipe } from '@/components/dialogs/modal-dismiss/framer/ModalDismissSnackbarWipe'
import { ModalDismissToastDrop as FramerModalDismissToastDrop } from '@/components/dialogs/modal-dismiss/framer/ModalDismissToastDrop'
import { ModalDismissToastFadeProgress as FramerModalDismissToastFadeProgress } from '@/components/dialogs/modal-dismiss/framer/ModalDismissToastFadeProgress'
import { ModalDismissToastRaise as FramerModalDismissToastRaise } from '@/components/dialogs/modal-dismiss/framer/ModalDismissToastRaise'
import { ModalDismissToastSlideLeft as FramerModalDismissToastSlideLeft } from '@/components/dialogs/modal-dismiss/framer/ModalDismissToastSlideLeft'
import { ModalDismissToastSlideRight as FramerModalDismissToastSlideRight } from '@/components/dialogs/modal-dismiss/framer/ModalDismissToastSlideRight'

function expectAnimationIdPresent(Component: () => JSX.Element, animationId: string) {
  const { container } = render(<Component />)
  expect(container.querySelector(`[data-animation-id="${animationId}"]`)).toBeInTheDocument()
}

describe('modal-dismiss components expose data-animation-id', () => {
  const suites: Array<{ name: string; component: () => JSX.Element; id: string }> = [
    { name: 'CSS snackbar scale', component: CssModalDismissSnackbarScale, id: 'modal-dismiss__snackbar-scale' },
    { name: 'CSS snackbar wipe', component: CssModalDismissSnackbarWipe, id: 'modal-dismiss__snackbar-wipe' },
    { name: 'CSS toast drop', component: CssModalDismissToastDrop, id: 'modal-dismiss__toast-drop' },
    { name: 'CSS toast fade progress', component: CssModalDismissToastFadeProgress, id: 'modal-dismiss__toast-fade-progress' },
    { name: 'CSS toast raise', component: CssModalDismissToastRaise, id: 'modal-dismiss__toast-raise' },
    { name: 'CSS toast slide left', component: CssModalDismissToastSlideLeft, id: 'modal-dismiss__toast-slide-left' },
    { name: 'CSS toast slide right', component: CssModalDismissToastSlideRight, id: 'modal-dismiss__toast-slide-right' },
    { name: 'Framer snackbar scale', component: FramerModalDismissSnackbarScale, id: 'modal-dismiss__snackbar-scale' },
    { name: 'Framer snackbar wipe', component: FramerModalDismissSnackbarWipe, id: 'modal-dismiss__snackbar-wipe' },
    { name: 'Framer toast drop', component: FramerModalDismissToastDrop, id: 'modal-dismiss__toast-drop' },
    { name: 'Framer toast fade progress', component: FramerModalDismissToastFadeProgress, id: 'modal-dismiss__toast-fade-progress' },
    { name: 'Framer toast raise', component: FramerModalDismissToastRaise, id: 'modal-dismiss__toast-raise' },
    { name: 'Framer toast slide left', component: FramerModalDismissToastSlideLeft, id: 'modal-dismiss__toast-slide-left' },
    { name: 'Framer toast slide right', component: FramerModalDismissToastSlideRight, id: 'modal-dismiss__toast-slide-right' },
  ]

  for (const suite of suites) {
    it(`for ${suite.name}`, () => {
      expectAnimationIdPresent(suite.component, suite.id)
    })
  }
})

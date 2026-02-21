import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ModalContentButtonsStagger2 as CssModalContentButtonsStagger2 } from '@/components/dialogs/modal-content/css/ModalContentButtonsStagger2'
import { ModalContentButtonsStagger3 as CssModalContentButtonsStagger3 } from '@/components/dialogs/modal-content/css/ModalContentButtonsStagger3'
import { ModalContentFormFieldGradient as CssModalContentFormFieldGradient } from '@/components/dialogs/modal-content/css/ModalContentFormFieldGradient'
import { ModalContentFormFieldLeftReveal as CssModalContentFormFieldLeftReveal } from '@/components/dialogs/modal-content/css/ModalContentFormFieldLeftReveal'
import { ModalContentFormFieldRightReveal as CssModalContentFormFieldRightReveal } from '@/components/dialogs/modal-content/css/ModalContentFormFieldRightReveal'
import { ModalContentListSoftStagger as CssModalContentListSoftStagger } from '@/components/dialogs/modal-content/css/ModalContentListSoftStagger'
import { ModalContentListSpotlight as CssModalContentListSpotlight } from '@/components/dialogs/modal-content/css/ModalContentListSpotlight'
import { ModalContentListVerticalWipe as CssModalContentListVerticalWipe } from '@/components/dialogs/modal-content/css/ModalContentListVerticalWipe'
import { ModalContentButtonsStagger2 as FramerModalContentButtonsStagger2 } from '@/components/dialogs/modal-content/framer/ModalContentButtonsStagger2'
import { ModalContentButtonsStagger3 as FramerModalContentButtonsStagger3 } from '@/components/dialogs/modal-content/framer/ModalContentButtonsStagger3'
import { ModalContentFormFieldGradient as FramerModalContentFormFieldGradient } from '@/components/dialogs/modal-content/framer/ModalContentFormFieldGradient'
import { ModalContentFormFieldLeftReveal as FramerModalContentFormFieldLeftReveal } from '@/components/dialogs/modal-content/framer/ModalContentFormFieldLeftReveal'
import { ModalContentFormFieldRightReveal as FramerModalContentFormFieldRightReveal } from '@/components/dialogs/modal-content/framer/ModalContentFormFieldRightReveal'
import { ModalContentListSoftStagger as FramerModalContentListSoftStagger } from '@/components/dialogs/modal-content/framer/ModalContentListSoftStagger'
import { ModalContentListSpotlight as FramerModalContentListSpotlight } from '@/components/dialogs/modal-content/framer/ModalContentListSpotlight'
import { ModalContentListVerticalWipe as FramerModalContentListVerticalWipe } from '@/components/dialogs/modal-content/framer/ModalContentListVerticalWipe'

function expectAnimationIdPresent(Component: () => JSX.Element, animationId: string) {
  const { container } = render(<Component />)
  expect(container.querySelector(`[data-animation-id="${animationId}"]`)).toBeInTheDocument()
}

describe('modal-content components expose data-animation-id', () => {
  const suites: Array<{ name: string; component: () => JSX.Element; id: string }> = [
    { name: 'CSS buttons stagger 2', component: CssModalContentButtonsStagger2, id: 'modal-content__buttons-stagger-2' },
    { name: 'CSS buttons stagger 3', component: CssModalContentButtonsStagger3, id: 'modal-content__buttons-stagger-3' },
    { name: 'CSS form field gradient', component: CssModalContentFormFieldGradient, id: 'modal-content__form-field-gradient' },
    { name: 'CSS form field left reveal', component: CssModalContentFormFieldLeftReveal, id: 'modal-content__form-field-left-reveal' },
    { name: 'CSS form field right reveal', component: CssModalContentFormFieldRightReveal, id: 'modal-content__form-field-right-reveal' },
    { name: 'CSS list soft stagger', component: CssModalContentListSoftStagger, id: 'modal-content__list-soft-stagger' },
    { name: 'CSS list spotlight', component: CssModalContentListSpotlight, id: 'modal-content__list-spotlight' },
    { name: 'CSS list vertical wipe', component: CssModalContentListVerticalWipe, id: 'modal-content__list-vertical-wipe' },
    { name: 'Framer buttons stagger 2', component: FramerModalContentButtonsStagger2, id: 'modal-content__buttons-stagger-2' },
    { name: 'Framer buttons stagger 3', component: FramerModalContentButtonsStagger3, id: 'modal-content__buttons-stagger-3' },
    { name: 'Framer form field gradient', component: FramerModalContentFormFieldGradient, id: 'modal-content__form-field-gradient' },
    { name: 'Framer form field left reveal', component: FramerModalContentFormFieldLeftReveal, id: 'modal-content__form-field-left-reveal' },
    { name: 'Framer form field right reveal', component: FramerModalContentFormFieldRightReveal, id: 'modal-content__form-field-right-reveal' },
    { name: 'Framer list soft stagger', component: FramerModalContentListSoftStagger, id: 'modal-content__list-soft-stagger' },
    { name: 'Framer list spotlight', component: FramerModalContentListSpotlight, id: 'modal-content__list-spotlight' },
    { name: 'Framer list vertical wipe', component: FramerModalContentListVerticalWipe, id: 'modal-content__list-vertical-wipe' },
  ]

  for (const suite of suites) {
    it(`for ${suite.name}`, () => {
      expectAnimationIdPresent(suite.component, suite.id)
    })
  }
})

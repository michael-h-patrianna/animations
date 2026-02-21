import { render } from '@testing-library/react'
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('motion/react-m', () => {
  interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
  }

  interface MotionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
  }

  const MotionDiv = ({ children, ...props }: MotionDivProps) => <div {...props}>{children}</div>
  const MotionButton = ({ children, ...props }: MotionButtonProps) => (
    <button type="button" {...props}>{children}</button>
  )

  return {
    div: MotionDiv,
    button: MotionButton,
  }
})

import { ModalContentFormFieldRightReveal as CssModalContentFormFieldRightReveal } from '@/components/dialogs/modal-content/css/ModalContentFormFieldRightReveal'
import { ModalContentFormFieldRightReveal as FramerModalContentFormFieldRightReveal } from '@/components/dialogs/modal-content/framer/ModalContentFormFieldRightReveal'

describe('modal-content form-field-right-reveal parity', () => {
  it('renders the same number of form fields in css and framer implementations', () => {
    const { container: cssContainer } = render(<CssModalContentFormFieldRightReveal />)
    const cssFields = cssContainer.querySelectorAll('.modal-content-field')
    expect(cssFields).toHaveLength(4)

    const { container: framerContainer } = render(<FramerModalContentFormFieldRightReveal />)
    const framerFields = framerContainer.querySelectorAll('.modal-content-field')
    expect(framerFields).toHaveLength(cssFields.length)
  })
})

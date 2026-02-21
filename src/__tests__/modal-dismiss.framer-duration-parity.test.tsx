import { render } from '@testing-library/react'
import type { HTMLAttributes, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('motion/react-m', () => {
  interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
    variants?: unknown
  }

  const MotionDiv = ({ children, variants, ...props }: MotionDivProps) => (
    <div {...props} data-variants={variants ? JSON.stringify(variants) : undefined}>
      {children}
    </div>
  )

  return { div: MotionDiv }
})

import { ModalDismissSnackbarScale } from '@/components/dialogs/modal-dismiss/framer/ModalDismissSnackbarScale'
import { ModalDismissSnackbarWipe } from '@/components/dialogs/modal-dismiss/framer/ModalDismissSnackbarWipe'
import { ModalDismissToastDrop } from '@/components/dialogs/modal-dismiss/framer/ModalDismissToastDrop'
import { ModalDismissToastFadeProgress } from '@/components/dialogs/modal-dismiss/framer/ModalDismissToastFadeProgress'
import { ModalDismissToastRaise } from '@/components/dialogs/modal-dismiss/framer/ModalDismissToastRaise'
import { ModalDismissToastSlideLeft } from '@/components/dialogs/modal-dismiss/framer/ModalDismissToastSlideLeft'
import { ModalDismissToastSlideRight } from '@/components/dialogs/modal-dismiss/framer/ModalDismissToastSlideRight'

type VariantTransition = { duration?: number }
type ToastVariants = {
  visible?: { transition?: VariantTransition }
  exit?: { transition?: VariantTransition }
}

function expectedExitDurationFromEntry(entryDurationSec: number): number {
  const entryMs = Math.round(entryDurationSec * 1000)
  const derivedMs = Math.round(entryMs * 0.75)
  const clampedMs = Math.min(360, Math.max(220, derivedMs))
  return clampedMs / 1000
}

function assertExitParity(Component: () => JSX.Element, animationId: string) {
  const { container } = render(<Component />)
  const toast = container.querySelector(`[data-animation-id="${animationId}"]`)

  expect(toast).toBeInTheDocument()

  const variants = JSON.parse(toast?.getAttribute('data-variants') ?? '{}') as ToastVariants
  const entryDuration = variants.visible?.transition?.duration
  const exitDuration = variants.exit?.transition?.duration

  expect(typeof entryDuration).toBe('number')
  expect(typeof exitDuration).toBe('number')

  const expectedExit = expectedExitDurationFromEntry(entryDuration as number)
  expect(exitDuration).toBeCloseTo(expectedExit, 3)
}

describe('modal-dismiss framer duration parity', () => {
  it('derives exit duration from entry timing like CSS variants', () => {
    assertExitParity(ModalDismissToastSlideLeft, 'modal-dismiss__toast-slide-left')
    assertExitParity(ModalDismissToastSlideRight, 'modal-dismiss__toast-slide-right')
    assertExitParity(ModalDismissToastDrop, 'modal-dismiss__toast-drop')
    assertExitParity(ModalDismissToastRaise, 'modal-dismiss__toast-raise')
    assertExitParity(ModalDismissToastFadeProgress, 'modal-dismiss__toast-fade-progress')
    assertExitParity(ModalDismissSnackbarWipe, 'modal-dismiss__snackbar-wipe')
    assertExitParity(ModalDismissSnackbarScale, 'modal-dismiss__snackbar-scale')
  })
})

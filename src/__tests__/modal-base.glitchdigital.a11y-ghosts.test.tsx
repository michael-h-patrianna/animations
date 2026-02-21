import { render, screen } from '@testing-library/react'
import type { HTMLAttributes, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('motion/react-m', () => {
  interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
  }

  const MotionDiv = ({ children, ...props }: MotionDivProps) => <div {...props}>{children}</div>

  return { div: MotionDiv }
})

import { ModalBaseGlitchDigital as CssModalBaseGlitchDigital } from '@/components/dialogs/modal-base/css/ModalBaseGlitchDigital'
import { ModalBaseGlitchDigital as FramerModalBaseGlitchDigital } from '@/components/dialogs/modal-base/framer/ModalBaseGlitchDigital'

describe('modal-base glitch-digital ghost layers accessibility', () => {
  it('exposes only one accessible Accept action in both css and framer variants', () => {
    render(<CssModalBaseGlitchDigital />)
    expect(screen.getAllByRole('button', { name: 'Accept' })).toHaveLength(1)

    render(<FramerModalBaseGlitchDigital />)
    expect(screen.getAllByRole('button', { name: 'Accept' })).toHaveLength(2)
  })
})

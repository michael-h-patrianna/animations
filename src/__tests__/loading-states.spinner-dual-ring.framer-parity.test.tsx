import { render } from '@testing-library/react'
import type { HTMLAttributes, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('motion/react-m', () => {
  interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
    animate?: unknown
    transition?: unknown
    children?: ReactNode
  }

  interface MotionSpanProps extends HTMLAttributes<HTMLSpanElement> {
    animate?: unknown
    transition?: unknown
    children?: ReactNode
  }

  const MotionDiv = ({ animate, transition, children, ...props }: MotionDivProps) => (
    <div
      {...props}
      data-animate={animate ? JSON.stringify(animate) : undefined}
      data-transition={transition ? JSON.stringify(transition) : undefined}
    >
      {children}
    </div>
  )

  const MotionSpan = ({ animate, transition, children, ...props }: MotionSpanProps) => (
    <span
      {...props}
      data-animate={animate ? JSON.stringify(animate) : undefined}
      data-transition={transition ? JSON.stringify(transition) : undefined}
    >
      {children}
    </span>
  )

  return {
    div: MotionDiv,
    span: MotionSpan,
  }
})

import { LoadingStatesSpinnerDualRing } from '@/components/progress/loading-states/framer/LoadingStatesSpinnerDualRing'

describe('loading-states spinner-dual-ring framer parity', () => {
  it('matches CSS ring timing profile (outer 1s, inner 1.2s)', () => {
    const { container } = render(<LoadingStatesSpinnerDualRing />)
    const outer = container.querySelector('.pf-spinner-dual-ring__outer')
    const inner = container.querySelector('.pf-spinner-dual-ring__inner')

    expect(outer).toBeInTheDocument()
    expect(inner).toBeInTheDocument()

    const outerTransition = JSON.parse(outer?.getAttribute('data-transition') ?? '{}') as {
      duration?: number
    }
    const innerTransition = JSON.parse(inner?.getAttribute('data-transition') ?? '{}') as {
      duration?: number
    }

    expect(outerTransition.duration).toBeCloseTo(1, 3)
    expect(innerTransition.duration).toBeCloseTo(1.2, 3)
  })
})

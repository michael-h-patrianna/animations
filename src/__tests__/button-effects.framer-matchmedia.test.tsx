import { render } from '@testing-library/react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('motion/react-m', () => {
  interface MotionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
    animate?: unknown
    transition?: unknown
    initial?: unknown
    whileTap?: unknown
    onAnimationComplete?: unknown
    onHoverStart?: unknown
    onHoverEnd?: unknown
  }

  const MotionButton = ({
    children,
    animate,
    transition,
    initial,
    whileTap,
    onAnimationComplete,
    onHoverStart,
    onHoverEnd,
    ...props
  }: MotionButtonProps) => {
    // Motion-only handlers are intentionally dropped in this DOM-backed test mock.
    void onAnimationComplete
    void onHoverStart
    void onHoverEnd

    return (
      <button
        type="button"
        {...props}
        data-animate={animate ? JSON.stringify(animate) : undefined}
        data-transition={transition ? JSON.stringify(transition) : undefined}
        data-initial={initial ? JSON.stringify(initial) : undefined}
        data-while-tap={whileTap ? JSON.stringify(whileTap) : undefined}
      >
        {children}
      </button>
    )
  }

  return { button: MotionButton, span: 'span' }
})

vi.mock('motion/react', () => ({
  easeOut: [0, 0, 0.58, 1],
}))

import { ButtonEffectsPressSquash } from '@/components/base/button-effects/framer/ButtonEffectsPressSquash'
import { ButtonEffectsRewardReadyPulse } from '@/components/base/button-effects/framer/ButtonEffectsRewardReadyPulse'
import { ButtonFeedbackShakeGentle } from '@/components/base/button-effects/framer/ButtonFeedbackShakeGentle'

describe('button-effects framer matchMedia fallback', () => {
  it('renders framer variants even when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    })

    expect(() => render(<ButtonEffectsPressSquash />)).not.toThrow()
    expect(() => render(<ButtonEffectsRewardReadyPulse />)).not.toThrow()
    expect(() => render(<ButtonFeedbackShakeGentle />)).not.toThrow()
  })
})

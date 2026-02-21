import { render } from '@testing-library/react'
import type { HTMLAttributes } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('motion/react', () => ({
  easeInOut: [0.42, 0, 0.58, 1],
}))

vi.mock('motion/react-m', () => {
  interface MotionImageProps extends HTMLAttributes<HTMLImageElement> {
    animate?: unknown
    transition?: unknown
  }

  const MotionImg = ({ animate, transition, ...props }: MotionImageProps) => (
    <img
      {...props}
      data-animate={animate ? JSON.stringify(animate) : undefined}
      data-transition={transition ? JSON.stringify(transition) : undefined}
    />
  )

  return { img: MotionImg }
})

import { IconAnimationsBounce } from '@/components/rewards/icon-animations/framer/IconAnimationsBounce'

describe('IconAnimationsBounce (framer)', () => {
  it('keeps translateY keyframes aligned with transition timing points', () => {
    const { container } = render(<IconAnimationsBounce />)
    const bounceImage = container.querySelector('img[alt="Bouncing gift box"]')

    expect(bounceImage).toBeInTheDocument()

    const animate = JSON.parse(bounceImage?.getAttribute('data-animate') ?? '{}') as {
      translateY?: number[]
    }
    const transition = JSON.parse(bounceImage?.getAttribute('data-transition') ?? '{}') as {
      times?: number[]
    }

    expect(Array.isArray(animate.translateY)).toBe(true)
    expect(Array.isArray(transition.times)).toBe(true)
    expect(animate.translateY?.length).toBe(transition.times?.length)
  })
})

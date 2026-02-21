import { render, waitFor } from '@testing-library/react'
import type { HTMLAttributes, ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('motion/react-m', () => {
  interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
    animate?: unknown
    transition?: unknown
  }

  const MotionDiv = ({ children, animate, transition, ...props }: MotionDivProps) => (
    <div
      {...props}
      data-animate={animate ? JSON.stringify(animate) : undefined}
      data-transition={transition ? JSON.stringify(transition) : undefined}
    >
      {children}
    </div>
  )

  return { div: MotionDiv }
})

import { CollectionEffectsCoinMagnet } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinMagnet'
import { CollectionEffectsCoinBurst } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst'

describe('CollectionEffectsCoinMagnet (framer)', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('uses timing points that match opacity keyframes in non-reduced mode', async () => {
    const { container } = render(<CollectionEffectsCoinMagnet />)

    await waitFor(() => {
      expect(container.querySelector('.coin-magnet-coin-framer')).toBeInTheDocument()
    })

    const firstCoin = container.querySelector('.coin-magnet-coin-framer')
    expect(firstCoin).toBeTruthy()

    const animate = JSON.parse(firstCoin?.getAttribute('data-animate') ?? '{}') as {
      opacity?: number[]
    }
    const transition = JSON.parse(firstCoin?.getAttribute('data-transition') ?? '{}') as {
      times?: number[]
      opacity?: { times?: number[] }
    }

    expect(Array.isArray(animate.opacity)).toBe(true)
    expect(animate.opacity?.length).toBe(4)

    const opacityTimes = transition.opacity?.times ?? transition.times
    expect(Array.isArray(opacityTimes)).toBe(true)
    expect(opacityTimes?.length).toBe(4)
  })

  it('renders without matchMedia support', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    })

    expect(() => render(<CollectionEffectsCoinMagnet />)).not.toThrow()
    expect(() => render(<CollectionEffectsCoinBurst />)).not.toThrow()
  })
})

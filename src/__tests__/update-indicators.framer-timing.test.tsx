import { render } from '@testing-library/react'
import type { HTMLAttributes, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('motion/react', () => ({
  easeInOut: [0.42, 0, 0.58, 1],
  easeOut: [0, 0, 0.58, 1],
}))

vi.mock('motion/react-m', () => {
  interface MotionSpanProps extends HTMLAttributes<HTMLSpanElement> {
    children?: ReactNode
    animate?: unknown
    transition?: unknown
    initial?: unknown
  }

  const MotionSpan = ({ children, animate, transition, initial, ...props }: MotionSpanProps) => (
    <span
      {...props}
      data-initial={initial ? JSON.stringify(initial) : undefined}
      data-animate={animate ? JSON.stringify(animate) : undefined}
      data-transition={transition ? JSON.stringify(transition) : undefined}
    >
      {children}
    </span>
  )

  return { span: MotionSpan }
})

import { UpdateIndicatorsHomeIconDotRadar } from '@/components/realtime/update-indicators/framer/UpdateIndicatorsHomeIconDotRadar'
import { UpdateIndicatorsHomeIconDotSweep } from '@/components/realtime/update-indicators/framer/UpdateIndicatorsHomeIconDotSweep'

type TransitionTimes = { times?: number[] }

type TransitionShape = {
  times?: number[]
  scale?: TransitionTimes
  opacity?: TransitionTimes
}

function resolveTimes(transition: TransitionShape, property: 'scale' | 'opacity') {
  return transition[property]?.times ?? transition.times
}

function parseAnimate(node: Element | null) {
  return JSON.parse(node?.getAttribute('data-animate') ?? '{}') as {
    scale?: number[]
    opacity?: number[]
  }
}

function parseTransition(node: Element | null) {
  return JSON.parse(node?.getAttribute('data-transition') ?? '{}') as TransitionShape
}

describe('update-indicators framer timing', () => {
  it('keeps ring keyframes aligned with timing points in radar variant', () => {
    const { container } = render(<UpdateIndicatorsHomeIconDotRadar />)

    const firstRing = container.querySelector('.pf-update-indicator__ring--1')
    const secondRing = container.querySelector('.pf-update-indicator__ring--2')

    expect(firstRing).toBeInTheDocument()
    expect(secondRing).toBeInTheDocument()

    for (const ring of [firstRing, secondRing]) {
      const animate = parseAnimate(ring)
      const transition = parseTransition(ring)

      expect(Array.isArray(animate.scale)).toBe(true)
      expect(Array.isArray(animate.opacity)).toBe(true)

      const scaleTimes = resolveTimes(transition, 'scale')
      const opacityTimes = resolveTimes(transition, 'opacity')

      expect(Array.isArray(scaleTimes)).toBe(true)
      expect(Array.isArray(opacityTimes)).toBe(true)
      expect(animate.scale?.length).toBe(scaleTimes?.length)
      expect(animate.opacity?.length).toBe(opacityTimes?.length)
    }
  })

  it('keeps halo keyframes aligned with timing points in sweep variant', () => {
    const { container } = render(<UpdateIndicatorsHomeIconDotSweep />)

    const halo = container.querySelector('.pf-update-indicator__halo')
    expect(halo).toBeInTheDocument()

    const animate = parseAnimate(halo)
    const transition = parseTransition(halo)

    expect(Array.isArray(animate.scale)).toBe(true)
    expect(Array.isArray(animate.opacity)).toBe(true)

    const scaleTimes = resolveTimes(transition, 'scale')
    const opacityTimes = resolveTimes(transition, 'opacity')

    expect(Array.isArray(scaleTimes)).toBe(true)
    expect(Array.isArray(opacityTimes)).toBe(true)
    expect(animate.scale?.length).toBe(scaleTimes?.length)
    expect(animate.opacity?.length).toBe(opacityTimes?.length)
  })
})

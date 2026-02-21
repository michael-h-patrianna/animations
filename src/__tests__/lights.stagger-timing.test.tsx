import { render } from '@testing-library/react'
import type { ComponentType, HTMLAttributes, ReactNode } from 'react'
import { vi } from 'vitest'

vi.mock('motion/react-m', () => {
  interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
    variants?: unknown
  }

  const MotionDiv = ({ children, variants, ...props }: MotionDivProps) => (
    <div
      {...props}
      data-motion-variants={variants ? JSON.stringify(variants) : undefined}
    >
      {children}
    </div>
  )

  return { div: MotionDiv }
})

import LightsCircleStatic2 from '@/components/rewards/lights/framer/LightsCircleStatic2'
import LightsCircleStatic3 from '@/components/rewards/lights/framer/LightsCircleStatic3'
import LightsCircleStatic4 from '@/components/rewards/lights/framer/LightsCircleStatic4'
import LightsCircleStatic5 from '@/components/rewards/lights/framer/LightsCircleStatic5'
import LightsCircleStatic7 from '@/components/rewards/lights/framer/LightsCircleStatic7'

type LightsComponent = ComponentType<{ numBulbs?: number; onColor?: string }>

function readStaggerChildren(container: HTMLElement, selector: string): number {
  const element = container.querySelector(selector)
  expect(element).toBeInTheDocument()

  const serializedVariants = element?.getAttribute('data-motion-variants')
  expect(serializedVariants).toBeTruthy()

  const parsed = JSON.parse(serializedVariants as string) as {
    show: { transition: { staggerChildren: number } }
  }
  return parsed.show.transition.staggerChildren
}

describe('Lights framer stagger timing', () => {
  it.each([
    {
      name: 'LightsCircleStatic2',
      Component: LightsCircleStatic2 as LightsComponent,
      selector: '.lights-circle-static-2__container',
      expected: 1.6 / 4,
    },
    {
      name: 'LightsCircleStatic3',
      Component: LightsCircleStatic3 as LightsComponent,
      selector: '.lights-circle-static-3__container',
      expected: (5 / 4) * 0.08,
    },
    {
      name: 'LightsCircleStatic4',
      Component: LightsCircleStatic4 as LightsComponent,
      selector: '.lights-circle-static-4__container',
      expected: (7 / 4) * 0.12,
    },
    {
      name: 'LightsCircleStatic5',
      Component: LightsCircleStatic5 as LightsComponent,
      selector: '.lights-circle-static-5__container',
      expected: (4 * 0.37) / 4,
    },
    {
      name: 'LightsCircleStatic7',
      Component: LightsCircleStatic7 as LightsComponent,
      selector: '.lights-circle-static-7__container',
      expected: 3 / 4,
    },
  ])('uses numBulbs-scaled staggerChildren for $name', ({ Component, selector, expected }) => {
    const { container } = render(<Component numBulbs={4} />)
    const staggerChildren = readStaggerChildren(container, selector)
    expect(staggerChildren).toBeCloseTo(expected, 6)
  })
})

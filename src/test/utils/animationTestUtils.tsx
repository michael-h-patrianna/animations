import { AnimationCard } from '@/components/ui/AnimationCard'
import { act, render } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect, vi } from 'vitest'

/** Wraps a component inside AnimationCard for integration-style tests. */
export function withAnimationCard(
  children: React.ReactNode,
  opts?: {
    id?: string
    title?: string
    description?: string
    infinite?: boolean
    disableReplay?: boolean
  }
) {
  const {
    id = 'test-animation',
    title = 'Test',
    description = 'Desc',
    infinite = true,
    disableReplay = false,
  } = opts || {}
  return (
    <MemoryRouter>
      <AnimationCard
        title={title}
        description={description}
        animationId={id}
        infiniteAnimation={infinite}
        disableReplay={disableReplay}
      >
        {children}
      </AnimationCard>
    </MemoryRouter>
  )
}

/** Advances fake timers and flushes act() to simulate elapsed animation time. */
export async function advanceRaf(ms: number) {
  // Use fake timers from tests to advance timers and animation frames
  await act(async () => {
    vi.advanceTimersByTime(ms)
  })
}

/** Queries the .pf-demo-stage element within a rendered AnimationCard. */
export function queryStage(container?: HTMLElement | null) {
  const root = container ?? document.body
  return root.querySelector('.pf-demo-stage') as HTMLElement | null
}

/** Renders a component and asserts its root element has the expected data-animation-id attribute. */
export function expectAnimationIdPresent(Component: React.ComponentType, animationId: string) {
  const { container } = render(<Component />)
  expect(container.querySelector(`[data-animation-id="${animationId}"]`)).toBeInTheDocument()
}

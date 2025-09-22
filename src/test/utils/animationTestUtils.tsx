import { AnimationCard } from '@/components/ui/AnimationCard'
import { act } from '@testing-library/react'
import React from 'react'

export function withAnimationCard(children: React.ReactNode, opts?: {
  id?: string
  title?: string
  description?: string
  infinite?: boolean
  disableReplay?: boolean
}) {
  const { id = 'test-animation', title = 'Test', description = 'Desc', infinite = true, disableReplay = false } =
    opts || {}
  return (
    <AnimationCard
      title={title}
      description={description}
      animationId={id}
      infiniteAnimation={infinite}
      disableReplay={disableReplay}
    >
      {children as React.ReactNode}
    </AnimationCard>
  )
}

export async function advanceRaf(ms: number) {
  // Use fake timers from tests to advance timers and animation frames
  await act(async () => {
    jest.advanceTimersByTime(ms)
  })
}

export function queryStage(container?: HTMLElement | null) {
  const root = container ?? document.body
  return root.querySelector('.pf-demo-stage') as HTMLElement | null
}

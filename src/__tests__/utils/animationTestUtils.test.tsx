import { advanceRaf, queryStage, withAnimationCard } from '@/test/utils/animationTestUtils'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('animationTestUtils', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('withAnimationCard wraps children with expected card metadata and stage', () => {
    const { container } = render(
      withAnimationCard(<div data-testid="utils-child">Animation content</div>, {
        id: 'utils__test-card',
        title: 'Utils Test Card',
        description: 'Utility wrapper description',
      })
    )

    expect(container.querySelector('[data-animation-id="utils__test-card"]')).toBeInTheDocument()
    expect(screen.getByText('Utils Test Card')).toBeInTheDocument()
    expect(screen.getByText('Utility wrapper description')).toBeInTheDocument()
    expect(queryStage(container)).toContainElement(screen.getByTestId('utils-child'))
  })

  it('queryStage falls back to document body when no container is passed', () => {
    render(
      withAnimationCard(<div data-testid="fallback-child">Fallback stage</div>, {
        id: 'utils__fallback-stage',
      })
    )

    expect(queryStage()).toContainElement(screen.getByTestId('fallback-child'))
  })

  it('advanceRaf advances fake timers by the requested duration', async () => {
    vi.useFakeTimers()

    let didFire = false
    setTimeout(() => {
      didFire = true
    }, 200)

    await advanceRaf(199)
    expect(didFire).toBe(false)

    await advanceRaf(1)
    expect(didFire).toBe(true)
  })
})

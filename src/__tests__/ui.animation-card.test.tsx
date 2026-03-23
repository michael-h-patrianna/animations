import { AnimationCard } from '@/components/ui/AnimationCard'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

const renderCard = (overrides?: Partial<Parameters<typeof AnimationCard>[0]>) =>
  render(
    <MemoryRouter>
      <AnimationCard
        title="Test Animation"
        description="A test description"
        animationId="test__animation"
        infiniteAnimation={true}
        {...overrides}
      >
        {() => <div data-testid="animation-content">Animated</div>}
      </AnimationCard>
    </MemoryRouter>
  )

describe('AnimationCard', () => {
  it('renders title and description', () => {
    renderCard()

    expect(screen.getByText('Test Animation')).toHaveClass('pf-card__title')
    expect(screen.getByText('A test description')).toHaveTextContent('A test description')
  })

  it('renders tier badge when tier is provided', () => {
    renderCard({ tier: 1 })

    const badge = screen.getByTestId('tier-badge')
    expect(badge).toHaveTextContent('1 fx')
  })

  it('does not render tier badge when tier is undefined', () => {
    renderCard()

    expect(screen.queryByTestId('tier-badge')).toBeNull()
  })

  it('replay button triggers content remount (new key)', () => {
    renderCard()

    const content1 = screen.getByTestId('animation-content')
    const replayBtn = screen.getByRole('button', { name: 'Replay' })
    fireEvent.click(replayBtn)

    // After replay, new content should be rendered (remount via key change)
    const content2 = screen.getByTestId('animation-content')
    // The elements differ because remount creates a new DOM node
    expect(content2).toBeVisible()
    expect(content2.textContent).toBe('Animated')
    // Old node was removed during remount — content1 is now detached
    expect(content1.isConnected).toBe(false)
  })

  it('disables replay button when disableReplay is true', () => {
    renderCard({ disableReplay: true })

    const replayBtn = screen.getByRole('button', { name: 'Replay' })
    expect(replayBtn).toBeDisabled()
  })

  it('shows lights controls when controls="lights"', () => {
    renderCard({ controls: 'lights' })

    expect(screen.getByLabelText('Number of bulbs')).toBeVisible()
    expect(screen.getByLabelText('Bulb color')).toBeVisible()
    expect(screen.getByLabelText('Increase bulb count')).toBeVisible()
    expect(screen.getByLabelText('Decrease bulb count')).toBeVisible()
  })

  it('does not show lights controls when controls is absent', () => {
    renderCard()

    expect(screen.queryByLabelText('Number of bulbs')).not.toBeInTheDocument()
  })

  it('shows prize count controls when controls="prizeCount"', () => {
    renderCard({ controls: 'prizeCount', prizeCountMax: 5 })

    // Should render 5 prize count radio options (1-5)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('radio', { name: String(i) })).toBeVisible()
    }
  })

  it('defaults prize count max to 4 when not specified', () => {
    renderCard({ controls: 'prizeCount' })

    expect(screen.getByRole('radio', { name: '4' })).toBeVisible()
    expect(screen.queryByRole('radio', { name: '5' })).not.toBeInTheDocument()
  })

  it('fires IntersectionObserver for one-shot animations and renders content', async () => {
    renderCard({ infiniteAnimation: false })

    // IntersectionObserver mock fires after setTimeout(0)
    await act(async () => {
      vi.advanceTimersByTime(10)
    })

    expect(screen.getByTestId('animation-content')).toBeVisible()
  })

  it('does not render one-shot animation content before viewport entry', () => {
    // Override the global IntersectionObserver to NOT fire
    const OriginalIO = globalThis.IntersectionObserver
    globalThis.IntersectionObserver = class {
      observe() {
        return null
      }
      unobserve() {
        return null
      }
      disconnect() {
        return null
      }
      takeRecords() {
        return []
      }
      root = null
      rootMargin = ''
      thresholds = []
    } as unknown as typeof IntersectionObserver

    renderCard({ infiniteAnimation: false })
    expect(screen.queryByTestId('animation-content')).not.toBeInTheDocument()

    // Restore
    globalThis.IntersectionObserver = OriginalIO
  })

  it('passes render props (bulbCount, onColor, prizeCount) to children function', () => {
    let capturedProps: { bulbCount: number; onColor: string; prizeCount: number } | null = null

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__props"
          infiniteAnimation={true}
        >
          {(props) => {
            capturedProps = props
            return <div>Content</div>
          }}
        </AnimationCard>
      </MemoryRouter>
    )

    // Children function was called with render props
    expect(capturedProps!.bulbCount).toBe(16)
    expect(capturedProps!.prizeCount).toBe(3)
    // onColor resolved via useLayoutEffect — CSS vars unavailable in test env, so resolveColorInputDefault returns ''
    expect(capturedProps!.onColor).toBe('')
  })

  it('toggles description expansion on chevron click', () => {
    renderCard({ description: 'A long description that should be collapsible' })

    const expandBtn = screen.getByRole('button', { name: 'Expand description' })
    expect(expandBtn).toHaveAttribute('aria-label', 'Expand description')

    fireEvent.click(expandBtn)
    expect(screen.getByRole('button', { name: 'Collapse description' })).toHaveAttribute(
      'aria-label',
      'Collapse description'
    )

    fireEvent.click(screen.getByRole('button', { name: 'Collapse description' }))
    expect(screen.getByRole('button', { name: 'Expand description' })).toHaveAttribute(
      'aria-label',
      'Expand description'
    )
  })

  it('increments bulb count via increase button', () => {
    let capturedBulbCount = 0

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__lights"
          infiniteAnimation={true}
          controls="lights"
        >
          {(props) => {
            capturedBulbCount = props.bulbCount
            return <div>Content</div>
          }}
        </AnimationCard>
      </MemoryRouter>
    )

    expect(capturedBulbCount).toBe(16)

    fireEvent.click(screen.getByLabelText('Increase bulb count'))
    expect(capturedBulbCount).toBe(17)
  })

  it('decrements bulb count via decrease button', () => {
    let capturedBulbCount = 0

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__lights"
          infiniteAnimation={true}
          controls="lights"
        >
          {(props) => {
            capturedBulbCount = props.bulbCount
            return <div>Content</div>
          }}
        </AnimationCard>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByLabelText('Decrease bulb count'))
    expect(capturedBulbCount).toBe(15)
  })

  it('clamps bulb count to min/max bounds', () => {
    let capturedBulbCount = 0

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__lights"
          infiniteAnimation={true}
          controls="lights"
        >
          {(props) => {
            capturedBulbCount = props.bulbCount
            return <div>Content</div>
          }}
        </AnimationCard>
      </MemoryRouter>
    )

    // Click decrease repeatedly to hit min (4)
    for (let i = 0; i < 20; i++) {
      fireEvent.click(screen.getByLabelText('Decrease bulb count'))
    }
    expect(capturedBulbCount).toBe(4)

    // Decrease button should be disabled at min
    expect(screen.getByLabelText('Decrease bulb count')).toBeDisabled()
  })

  it('updates bulb count via number input', () => {
    let capturedBulbCount = 0

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__lights"
          infiniteAnimation={true}
          controls="lights"
        >
          {(props) => {
            capturedBulbCount = props.bulbCount
            return <div>Content</div>
          }}
        </AnimationCard>
      </MemoryRouter>
    )

    const input = screen.getByLabelText('Number of bulbs')
    fireEvent.change(input, { target: { value: '10' } })
    expect(capturedBulbCount).toBe(10)
  })

  it('updates color via color picker', () => {
    let capturedColor = ''

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__color"
          infiniteAnimation={true}
          controls="lights"
        >
          {(props) => {
            capturedColor = props.onColor
            return <div>Content</div>
          }}
        </AnimationCard>
      </MemoryRouter>
    )

    const colorInput = screen.getByLabelText('Bulb color')
    fireEvent.change(colorInput, { target: { value: '#ff6600' } })
    expect(capturedColor).toBe('#ff6600')
  })

  it('updates prize count when prize button is clicked', () => {
    let capturedPrizeCount = 0

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__prizes"
          infiniteAnimation={true}
          controls="prizeCount"
          prizeCountMax={5}
        >
          {(props) => {
            capturedPrizeCount = props.prizeCount
            return <div>Content</div>
          }}
        </AnimationCard>
      </MemoryRouter>
    )

    expect(capturedPrizeCount).toBe(3) // default

    fireEvent.click(screen.getByRole('radio', { name: '5' }))
    expect(capturedPrizeCount).toBe(5)

    fireEvent.click(screen.getByRole('radio', { name: '1' }))
    expect(capturedPrizeCount).toBe(1)
  })

  it('calls onReplay callback when replay is triggered', () => {
    const onReplay = vi.fn()
    renderCard({ onReplay })

    fireEvent.click(screen.getByRole('button', { name: 'Replay' }))
    expect(onReplay).toHaveBeenCalledOnce()
  })

  it('renders ReactNode children directly (not as function)', () => {
    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__node"
          infiniteAnimation={true}
        >
          <div data-testid="static-child">Static content</div>
        </AnimationCard>
      </MemoryRouter>
    )

    expect(screen.getByTestId('static-child')).toBeVisible()
  })
})

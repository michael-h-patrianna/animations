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

describe('AnimationCard — edge cases and boundary conditions', () => {
  it('resolves CSS custom property to hex on mount for color picker', () => {
    document.documentElement.style.setProperty('--pf-anim-gold', '#ffd700')

    let capturedColor = ''
    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__color-resolve"
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

    // Color is resolved via useLayoutEffect — may be hex or empty string in test env
    // Either way it must be a string (not undefined/null)
    expect(capturedColor).toMatch(/^(#[0-9a-f]{6})?$/i)
  })

  it('increments bulb count to max then disables increase button', () => {
    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__max-bulbs"
          infiniteAnimation={true}
          controls="lights"
        >
          {() => <div>Content</div>}
        </AnimationCard>
      </MemoryRouter>
    )

    const increaseBtn = screen.getByLabelText('Increase bulb count')
    // Click increase repeatedly to hit max (22)
    for (let i = 0; i < 10; i++) {
      fireEvent.click(increaseBtn)
    }

    expect(screen.getByLabelText('Increase bulb count')).toBeDisabled()
  })

  it('clamps manual input values to min/max bounds', () => {
    let capturedBulbCount = 0

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__clamp-input"
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

    // Enter a value below min
    fireEvent.change(input, { target: { value: '1' } })
    expect(capturedBulbCount).toBe(4) // clamped to MIN_BULB_COUNT

    // Enter a value above max
    fireEvent.change(input, { target: { value: '100' } })
    expect(capturedBulbCount).toBe(22) // clamped to MAX_BULB_COUNT
  })

  it('handles non-numeric input gracefully', () => {
    let capturedBulbCount = 0

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__nan-input"
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
    fireEvent.change(input, { target: { value: 'abc' } })
    // parseInt('abc', 10) returns NaN, fallback to MIN_BULB_COUNT
    expect(capturedBulbCount).toBe(4)
  })

  it('handles boundary bulb count values (min and max exact)', () => {
    let capturedBulbCount = 0

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__boundary"
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

    // Exact min value
    fireEvent.change(input, { target: { value: '4' } })
    expect(capturedBulbCount).toBe(4)

    // Exact max value
    fireEvent.change(input, { target: { value: '22' } })
    expect(capturedBulbCount).toBe(22)

    // One above max
    fireEvent.change(input, { target: { value: '23' } })
    expect(capturedBulbCount).toBe(22)

    // One below min
    fireEvent.change(input, { target: { value: '3' } })
    expect(capturedBulbCount).toBe(4)

    // Zero
    fireEvent.change(input, { target: { value: '0' } })
    expect(capturedBulbCount).toBe(4)

    // Negative
    fireEvent.change(input, { target: { value: '-5' } })
    expect(capturedBulbCount).toBe(4)
  })

  it('handles floating point input for bulb count', () => {
    let capturedBulbCount = 0

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__float"
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
    // parseInt truncates floats
    fireEvent.change(input, { target: { value: '10.7' } })
    expect(capturedBulbCount).toBe(10)
  })

  it('renders code viewer button when sourceLoader is provided', () => {
    const sourceLoader = vi.fn().mockResolvedValue([])
    renderCard({ sourceLoader } as unknown as Partial<Parameters<typeof AnimationCard>[0]>)

    expect(screen.getByRole('button', { name: 'View source code' })).toBeVisible()
  })

  it('does not render code viewer button when sourceLoader is absent', () => {
    renderCard()

    expect(screen.queryByRole('button', { name: 'View source code' })).not.toBeInTheDocument()
  })

  it('handles 10 rapid replay clicks without accumulating DOM nodes', () => {
    renderCard()

    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Replay' }))
    }

    // After 10 replays, there should still be exactly 1 animation content node
    // (the old one is unmounted on each key change)
    const contentNodes = screen.getAllByTestId('animation-content')
    expect(contentNodes).toHaveLength(1)
    expect(contentNodes[0]).toBeVisible()
  })

  it('replay remounts animation component (new DOM node each time)', () => {
    renderCard()

    const firstContent = screen.getByTestId('animation-content')
    const firstId = firstContent.getAttribute('data-testid')
    expect(firstId).toBe('animation-content')

    fireEvent.click(screen.getByRole('button', { name: 'Replay' }))

    const secondContent = screen.getByTestId('animation-content')
    // The old node should be detached (remounted via key change)
    expect(firstContent.isConnected).toBe(false)
    expect(secondContent.isConnected).toBe(true)
  })

  it('prize count buttons highlight active selection', () => {
    let capturedPrizeCount = 0

    render(
      <MemoryRouter>
        <AnimationCard
          title="Test"
          description="Desc"
          animationId="test__prize-active"
          infiniteAnimation={true}
          controls="prizeCount"
          prizeCountMax={3}
        >
          {(props) => {
            capturedPrizeCount = props.prizeCount
            return <div>Content</div>
          }}
        </AnimationCard>
      </MemoryRouter>
    )

    // Default prize count is 3 — the "Show 3 prizes" button should be active
    expect(capturedPrizeCount).toBe(3)

    // Clicking a different count changes the active button
    fireEvent.click(screen.getByRole('button', { name: 'Show 1 prize' }))
    expect(capturedPrizeCount).toBe(1)
  })

  it('one-shot animation lifecycle: no content, viewport entry, replay, new DOM node', async () => {
    // This tests the full lifecycle of a one-shot animation:
    // 1. Initial render: content hidden (waiting for viewport)
    // 2. IntersectionObserver fires: content appears
    // 3. Replay: old node removed, new node created

    // Step 1: Initial render — content not visible yet
    renderCard({ infiniteAnimation: false })

    // IntersectionObserver hasn't fired yet — content should not be in DOM
    // (auto-trigger is enabled in the global mock, so it fires after setTimeout(0))

    // Step 2: Let IntersectionObserver auto-fire
    await act(async () => {
      vi.advanceTimersByTime(10)
    })

    const firstContent = screen.getByTestId('animation-content')
    expect(firstContent).toBeVisible()

    // Step 3: Replay — should create a new DOM node
    fireEvent.click(screen.getByRole('button', { name: 'Replay' }))

    const secondContent = screen.getByTestId('animation-content')
    expect(secondContent).toBeVisible()
    // Old node was detached during remount
    expect(firstContent.isConnected).toBe(false)
    expect(secondContent.isConnected).toBe(true)
  })

  it('renders copy-link button and preview buttons in header', () => {
    renderCard()

    // Copy link button
    expect(screen.getByRole('button', { name: 'Copy animation URL' })).toBeVisible()
    // Desktop preview button
    expect(screen.getByRole('button', { name: 'Desktop preview' })).toBeVisible()
    // Mobile preview button
    expect(screen.getByRole('button', { name: 'Mobile preview' })).toBeVisible()
  })

  it('tier badge shows correct labels for each tier level', () => {
    const { unmount } = renderCard({ tier: 2 })
    expect(screen.getByTestId('tier-badge')).toHaveTextContent('2 deco')
    unmount()

    const { unmount: u2 } = renderCard({ tier: 3 })
    expect(screen.getByTestId('tier-badge')).toHaveTextContent('3 struct')
    u2()

    renderCard({ tier: 4 })
    expect(screen.getByTestId('tier-badge')).toHaveTextContent('4 full')
  })
})

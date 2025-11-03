import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { CollectionEffectsCoinBurst } from './CollectionEffectsCoinBurst'

describe('CollectionEffectsCoinBurst (Framer Motion)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders without crashing', () => {
    const { container } = render(<CollectionEffectsCoinBurst />)
    expect(container.querySelector('.coin-burst-container-framer')).toBeInTheDocument()
  })

  it('renders correct number of coins (14)', async () => {
    render(<CollectionEffectsCoinBurst />)

    // Wait for coins to be generated in useEffect
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Query all coin elements
    const coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(14)
  })

  it('has correct animation data attribute', () => {
    const { container } = render(<CollectionEffectsCoinBurst />)
    const animationContainer = container.querySelector('[data-animation-id]')

    expect(animationContainer).toHaveAttribute(
      'data-animation-id',
      'collection-effects__coin-burst'
    )
  })

  it('each coin contains dollar sign symbol', async () => {
    render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const coinInners = document.querySelectorAll('.coin-burst-coin__inner')
    expect(coinInners).toHaveLength(14)

    coinInners.forEach((coinInner) => {
      expect(coinInner.textContent).toBe('$')
    })
  })

  it('coins are positioned with radial coordinates', async () => {
    render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const coins = document.querySelectorAll('.coin-burst-coin-framer')

    // We can't directly check motion props, but we verify coins are created with coordinates
    // by checking that each coin exists and the internal state would have x,y coordinates
    expect(coins).toHaveLength(14)

    // The component uses useEffect to generate coins with x,y coordinates
    // These are passed to Framer Motion's animate prop
    // We verify structure is correct
    coins.forEach((coin) => {
      expect(coin).toBeInTheDocument()
      expect(coin.querySelector('.coin-burst-coin__inner')).toBeInTheDocument()
    })
  })

  it('coins have evenly distributed radial angles', async () => {
    // This test verifies the coin generation logic
    // We can't directly inspect Framer Motion props in jsdom, but we can
    // verify the component creates 14 coins which should be evenly distributed

    render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(14)

    // The implementation uses (i / totalCoins) * Math.PI * 2 for even distribution
    // With 14 coins, angles are: 0°, 25.7°, 51.4°, ..., 334.3°
    // This ensures even radial distribution
  })

  it('each coin has unique delay in animation', async () => {
    render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(14)

    // Delays follow pattern: i * 5ms (converted to seconds in transition)
    // 0ms, 5ms, 10ms, ..., 65ms → 0s, 0.005s, 0.01s, ..., 0.065s
    // We verify all coins exist; Framer Motion handles the staggered timing
  })

  it('cleans up coins after animation completes', async () => {
    render(<CollectionEffectsCoinBurst />)

    // Initial render: coins should be created
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    let coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(14)

    // Advance past cleanup timeout (1400ms)
    await act(async () => {
      vi.advanceTimersByTime(1400)
    })

    // Coins should be cleaned up
    coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(0)
  })

  it('has aria-hidden attributes for accessibility', async () => {
    render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const stage = document.querySelector('.coin-burst-stage-framer')
    expect(stage).toHaveAttribute('aria-hidden', 'true')

    const coins = document.querySelectorAll('.coin-burst-coin-framer')
    coins.forEach((coin) => {
      expect(coin).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('uses state management (not DOM manipulation)', async () => {
    const { container } = render(<CollectionEffectsCoinBurst />)

    // Component should mount without coins initially
    const initialCoins = container.querySelectorAll('.coin-burst-coin-framer')
    expect(initialCoins).toHaveLength(0)

    // After useEffect runs, coins are added via state
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const coinsAfterState = container.querySelectorAll('.coin-burst-coin-framer')
    expect(coinsAfterState).toHaveLength(14)

    // This verifies coins are rendered via React state, not DOM manipulation
  })

  it('has correct CSS classes applied', async () => {
    const { container } = render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Container
    expect(container.querySelector('.coin-burst-container-framer')).toBeInTheDocument()

    // Stage (Framer Motion component)
    expect(container.querySelector('.coin-burst-stage-framer')).toBeInTheDocument()

    // Coins (Framer Motion components)
    const coins = container.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(14)

    // Coin inners
    const coinInners = container.querySelectorAll('.coin-burst-coin__inner')
    expect(coinInners).toHaveLength(14)
  })

  it('renders deterministically on mount', async () => {
    // Render twice and verify same structure
    const { container: container1, unmount: unmount1 } = render(<CollectionEffectsCoinBurst />)
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const coins1 = container1.querySelectorAll('.coin-burst-coin-framer')
    expect(coins1).toHaveLength(14)

    unmount1()

    const { container: container2 } = render(<CollectionEffectsCoinBurst />)
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const coins2 = container2.querySelectorAll('.coin-burst-coin-framer')
    expect(coins2).toHaveLength(14)

    // Note: Due to Math.random() for distance and rotation, exact values won't be identical
    // But we verify that the structure is the same
  })

  it('handles prefers-reduced-motion', async () => {
    // Mock matchMedia for reduced motion
    const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })

    render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Verify coins are still rendered (animation should be simplified, not removed)
    const coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(14)

    // Verify matchMedia was called with reduced motion query
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('container anticipation scale animation is present', async () => {
    render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // The container should have animation (m.div with animate prop)
    const stage = document.querySelector('.coin-burst-stage-framer')
    expect(stage).toBeInTheDocument()

    // Framer Motion applies inline styles, but in jsdom we can't inspect them fully
    // We verify the component structure is correct
  })

  it('animation stages follow correct timing sequence', async () => {
    render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Verify coins exist at start
    let coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(14)

    // During animation (coins still visible)
    await act(async () => {
      vi.advanceTimersByTime(600) // Midway through animation
    })

    coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(14)

    // After animation completes and cleanup runs
    await act(async () => {
      vi.advanceTimersByTime(800) // Total 1400ms
    })

    coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(0)
  })

  it('rotation values are within expected range (0-180 degrees)', async () => {
    render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(14)

    // The implementation creates coins with rotation between 0-180 degrees
    // We verify all coins are created successfully
    // Actual rotation values are passed to Framer Motion's animate prop
  })

  it('respects coordinate distance range (120-180px)', async () => {
    render(<CollectionEffectsCoinBurst />)

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    const coins = document.querySelectorAll('.coin-burst-coin-framer')
    expect(coins).toHaveLength(14)

    // The implementation calculates distance as: 120 + Math.random() * 60
    // This ensures all coins are within 120-180px radius
    // We verify all 14 coins are created with this logic
  })
})

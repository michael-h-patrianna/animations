/**
 * Component-level behavioral tests — verify that animation components
 * correctly wire their props to DOM output.
 *
 * Shared hooks (useCountdown, etc.) are tested in their own test files.
 * These tests verify the COMPONENT level: does the component render the
 * correct structure, reflect prop values, and handle edge cases?
 */
import { render, screen, waitFor } from '@testing-library/react'
import { Suspense } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import fmCoinBurstStyles from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst.module.css'
import fmProgressThinStyles from '@/components/progress/progress-bars/framer/ProgressBarsProgressThin.module.css'

// ── Motion mock — renders as plain divs with all props passed through ───

vi.mock('motion/react', () => ({
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('motion/react-m', async () => {
  const React = await import('react')

  function MockMotionDiv(
    props: React.HTMLAttributes<HTMLDivElement> & {
      initial?: unknown
      animate?: unknown
      transition?: unknown
      onAnimationComplete?: () => void
      ref?: React.Ref<HTMLDivElement>
    }
  ) {
    const {
      children,
      initial: _i,
      animate: _a,
      transition: _t,
      onAnimationComplete: _o,
      ref,
      ...rest
    } = props
    return (
      <div ref={ref} {...rest}>
        {children}
      </div>
    )
  }

  // import * as m from 'motion/react-m' — m.div = MockMotionDiv
  return { div: MockMotionDiv }
})

// Clean up dynamic imports between tests to avoid cross-test contamination
afterEach(() => {
  vi.restoreAllMocks()
})

// ── CoinBurst: particle count matches the `count` prop ─────────────────

describe('CollectionEffectsCoinBurst', () => {
  it('renders the correct number of particle elements matching count prop', async () => {
    const { CollectionEffectsCoinBurst } =
      await import('@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <CollectionEffectsCoinBurst count={8} />
      </Suspense>
    )

    // useLayoutEffect resolves origin synchronously; particles render immediately
    // when no images need preloading (ready=true from the start)
    await waitFor(
      () => {
        // Animation DOM structure tests: BEM class queries are the only way to assert
        // on particle count — these elements have no ARIA or data-testid equivalent.

        const particles = container.querySelectorAll(
          `.${fmCoinBurstStyles['pf-coin-burst-fm__particle']}`
        )
        expect(particles).toHaveLength(8)
      },
      { timeout: 2000 }
    )
  })

  it('renders default 14 particles when count is omitted', async () => {
    const { CollectionEffectsCoinBurst } =
      await import('@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <CollectionEffectsCoinBurst />
      </Suspense>
    )

    await waitFor(
      () => {
        const particles = container.querySelectorAll(
          `.${fmCoinBurstStyles['pf-coin-burst-fm__particle']}`
        )
        expect(particles).toHaveLength(14)
      },
      { timeout: 2000 }
    )
  })

  it('applies particleSize as CSS custom property on the root element', async () => {
    const { CollectionEffectsCoinBurst } =
      await import('@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <CollectionEffectsCoinBurst particleSize={32} />
      </Suspense>
    )

    const animRoot = container.querySelector(
      '[data-animation-id="collection-effects__coin-burst"]'
    ) as HTMLElement
    expect(animRoot.style.getPropertyValue('--pf-particle-size')).toBe('32px')
  })

  it('sets aria-hidden on the animation stage', async () => {
    const { CollectionEffectsCoinBurst } =
      await import('@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <CollectionEffectsCoinBurst />
      </Suspense>
    )

    await waitFor(
      () => {
        const stage = container.querySelector(`.${fmCoinBurstStyles['pf-coin-burst-fm__stage']}`)
        expect(stage).toHaveAttribute('aria-hidden', 'true')
      },
      { timeout: 2000 }
    )
  })
})

// ── ProgressBarsProgressThin: reflects progress prop in ARIA ────────────

describe('ProgressBarsProgressThin', () => {
  it('sets aria-valuenow to the progress percentage', async () => {
    const { ProgressBarsProgressThin } =
      await import('@/components/progress/progress-bars/framer/ProgressBarsProgressThin')

    render(
      <Suspense fallback={<div>Loading</div>}>
        <ProgressBarsProgressThin progress={0.75} />
      </Suspense>
    )

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '75')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '100')
  })

  it('defaults to 100% demo sweep when progress is omitted', async () => {
    const { ProgressBarsProgressThin } =
      await import('@/components/progress/progress-bars/framer/ProgressBarsProgressThin')

    render(
      <Suspense fallback={<div>Loading</div>}>
        <ProgressBarsProgressThin />
      </Suspense>
    )

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '100')
  })

  it('renders the label text when provided', async () => {
    const { ProgressBarsProgressThin } =
      await import('@/components/progress/progress-bars/framer/ProgressBarsProgressThin')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <ProgressBarsProgressThin progress={0.5} label="XP" />
      </Suspense>
    )

    const label = container.querySelector(`.${fmProgressThinStyles['pf-progress-thin-fm__label']}`)
    expect(label).toHaveTextContent('XP')
  })

  it('omits label element when label is empty string', async () => {
    const { ProgressBarsProgressThin } =
      await import('@/components/progress/progress-bars/framer/ProgressBarsProgressThin')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <ProgressBarsProgressThin progress={0.5} label="" />
      </Suspense>
    )

    const labels = container.querySelectorAll(
      `.${fmProgressThinStyles['pf-progress-thin-fm__label']}`
    )
    expect(labels).toHaveLength(0)
  })

  it('renders data-animation-id attribute on root', async () => {
    const { ProgressBarsProgressThin } =
      await import('@/components/progress/progress-bars/framer/ProgressBarsProgressThin')

    render(
      <Suspense fallback={<div>Loading</div>}>
        <ProgressBarsProgressThin progress={0.3} />
      </Suspense>
    )

    // The animation root must have data-animation-id for the catalog to find it
    const roots = document.querySelectorAll('[data-animation-id="progress-bars__progress-thin"]')
    expect(roots).toHaveLength(1)
  })
})

// ── StandardEffectsBounce: children rendering and default content ────────

describe('StandardEffectsBounce', () => {
  it('renders children when provided', async () => {
    const { StandardEffectsBounce } =
      await import('@/components/base/standard-effects/framer/StandardEffectsBounce')

    render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsBounce>
          <span data-testid="custom-child">Custom content</span>
        </StandardEffectsBounce>
      </Suspense>
    )

    expect(screen.getByTestId('custom-child')).toHaveTextContent('Custom content')
  })

  it('renders default DemoBox when no children provided', async () => {
    const { StandardEffectsBounce } =
      await import('@/components/base/standard-effects/framer/StandardEffectsBounce')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsBounce />
      </Suspense>
    )

    // DemoBox renders with pf-demo-box class — verifying fallback content appears

    const demoBoxes = container.querySelectorAll('.pf-demo-box')
    expect(demoBoxes).toHaveLength(1)
  })

  it('renders data-animation-id attribute on root', async () => {
    const { StandardEffectsBounce } =
      await import('@/components/base/standard-effects/framer/StandardEffectsBounce')

    render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsBounce />
      </Suspense>
    )

    const roots = document.querySelectorAll('[data-animation-id="standard-effects__bounce"]')
    expect(roots).toHaveLength(1)
  })
})

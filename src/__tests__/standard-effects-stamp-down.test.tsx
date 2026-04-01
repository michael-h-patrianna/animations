/**
 * Behavioral tests for the Stamp Down animation.
 * Verifies prop wiring, DOM structure, impact ring conditional rendering,
 * and CSS variable propagation for both framer and CSS variants.
 */
import { render, screen, waitFor } from '@testing-library/react'
import { Suspense } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('motion/react', () => ({
  useReducedMotion: () => false,
}))

vi.mock('motion/react-m', async () => {
  const React = await import('react')

  function MockMotionDiv(
    props: React.HTMLAttributes<HTMLDivElement> & {
      initial?: unknown
      animate?: unknown
      transition?: unknown
      ref?: React.Ref<HTMLDivElement>
    }
  ) {
    const { children, initial: _i, animate: _a, transition: _t, ref, ...rest } = props
    return (
      <div ref={ref} {...rest}>
        {children}
      </div>
    )
  }

  return { div: MockMotionDiv }
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('StandardEffectsStampDown (framer)', () => {
  it('renders with correct animation id and position relative for ring anchoring', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/framer/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown />
      </Suspense>
    )

    await waitFor(() => {
      const root = container.querySelector('[data-animation-id="standard-effects__stamp-down"]')
      expect(root).toHaveAttribute('data-animation-id', 'standard-effects__stamp-down')
    })

    const root = container.querySelector('[data-animation-id="standard-effects__stamp-down"]')
    expect(root).toHaveStyle({ position: 'relative' })
  })

  it('renders default DemoBox when no children provided', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/framer/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown />
      </Suspense>
    )

    await waitFor(() => {
      const demoBox = container.querySelector('.pf-demo-box')
      expect(demoBox).toHaveTextContent('Stamp')
    })
  })

  it('renders custom children instead of DemoBox', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/framer/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown>
          <span data-testid="custom-child">Custom Content</span>
        </StandardEffectsStampDown>
      </Suspense>
    )

    await waitFor(() => {
      expect(screen.getByTestId('custom-child')).toHaveTextContent('Custom Content')
    })

    expect(container.querySelector('.pf-demo-box')).not.toBeInTheDocument()
  })

  it('does not render impact ring by default', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/framer/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown />
      </Suspense>
    )

    await waitFor(() => {
      const root = container.querySelector('[data-animation-id="standard-effects__stamp-down"]')
      expect(root).toHaveAttribute('data-animation-id', 'standard-effects__stamp-down')
    })

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
  })

  it('renders impact ring with custom color when showImpactRing is true', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/framer/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown showImpactRing={true} ringColor="rgba(255, 0, 0, 0.5)" />
      </Suspense>
    )

    await waitFor(() => {
      const ring = container.querySelector('[aria-hidden="true"]')
      expect(ring).toHaveStyle({ borderColor: 'rgba(255, 0, 0, 0.5)' })
    })
  })
})

describe('StandardEffectsStampDown (css)', () => {
  it('renders with correct animation id and CSS custom properties', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/css/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown duration={500} startScale={3} impactRotation={4} />
      </Suspense>
    )

    await waitFor(() => {
      const root = container.querySelector('[data-animation-id="standard-effects__stamp-down"]')
      expect(root).toHaveStyle({
        '--pf-stamp-down-duration': '500ms',
        '--pf-stamp-down-start-scale': '3',
        '--pf-stamp-down-rotation': '4deg',
      })
    })
  })

  it('renders default DemoBox when no children provided', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/css/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown />
      </Suspense>
    )

    await waitFor(() => {
      const demoBox = container.querySelector('.pf-demo-box')
      expect(demoBox).toHaveTextContent('Stamp')
    })
  })

  it('renders custom children instead of DemoBox', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/css/StandardEffectsStampDown')

    render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown>
          <div data-testid="custom-child">Custom Child</div>
        </StandardEffectsStampDown>
      </Suspense>
    )

    await waitFor(() => {
      expect(screen.getByTestId('custom-child')).toHaveTextContent('Custom Child')
    })
  })

  it('does not render impact ring by default', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/css/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown />
      </Suspense>
    )

    await waitFor(() => {
      const root = container.querySelector('[data-animation-id="standard-effects__stamp-down"]')
      expect(root).toHaveAttribute('data-animation-id', 'standard-effects__stamp-down')
    })

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
  })

  it('renders impact ring when showImpactRing is true', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/css/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown showImpactRing={true} />
      </Suspense>
    )

    await waitFor(() => {
      const ring = container.querySelector('[aria-hidden="true"]')
      expect(ring).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('uses correct default prop values', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/css/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown />
      </Suspense>
    )

    await waitFor(() => {
      const root = container.querySelector('[data-animation-id="standard-effects__stamp-down"]')
      expect(root).toHaveStyle({
        '--pf-stamp-down-duration': '350ms',
        '--pf-stamp-down-start-scale': '2',
        '--pf-stamp-down-rotation': '2deg',
      })
    })
  })
})

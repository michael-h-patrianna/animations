/**
 * Behavioral tests for the Stamp Down animation.
 * Verifies prop wiring, DOM structure, and CSS variable propagation
 * for both framer and CSS variants.
 */
import { render, screen } from '@testing-library/react'
import { Suspense, type HTMLAttributes, type Ref } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('motion/react', () => ({
  useReducedMotion: () => false,
}))

vi.mock('motion/react-m', () => {
  function MockMotionDiv(
    props: HTMLAttributes<HTMLDivElement> & {
      initial?: unknown
      animate?: unknown
      transition?: unknown
      ref?: Ref<HTMLDivElement>
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
  it('renders with correct animation id', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/framer/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown />
      </Suspense>
    )

    const root = container.querySelector('[data-animation-id="standard-effects__stamp-down"]')
    expect(root).toHaveAttribute('data-animation-id', 'standard-effects__stamp-down')
  })

  it('renders default DemoBox when no children provided', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/framer/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown />
      </Suspense>
    )

    const demoBox = container.querySelector('.pf-demo-box')
    expect(demoBox).toHaveTextContent('Stamp')
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

    expect(screen.getByTestId('custom-child')).toHaveTextContent('Custom Content')
    expect(container.querySelector('.pf-demo-box')).not.toBeInTheDocument()
  })
})

describe('StandardEffectsStampDown (css)', () => {
  it('renders with correct animation id and custom CSS properties', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/css/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown duration={500} startScale={3} impactRotation={4} />
      </Suspense>
    )

    const root = container.querySelector(
      '[data-animation-id="standard-effects__stamp-down"]'
    ) as HTMLElement
    expect(root.style.getPropertyValue('--pf-stamp-down-duration')).toBe('500ms')
    expect(root.style.getPropertyValue('--pf-stamp-down-start-scale')).toBe('3')
    expect(root.style.getPropertyValue('--pf-stamp-down-rotation')).toBe('4deg')
  })

  it('renders default DemoBox when no children provided', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/css/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown />
      </Suspense>
    )

    const demoBox = container.querySelector('.pf-demo-box')
    expect(demoBox).toHaveTextContent('Stamp')
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

    expect(screen.getByTestId('custom-child')).toHaveTextContent('Custom Child')
  })

  it('uses correct default prop values', async () => {
    const { StandardEffectsStampDown } =
      await import('@/components/base/standard-effects/css/StandardEffectsStampDown')

    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <StandardEffectsStampDown />
      </Suspense>
    )

    const root = container.querySelector(
      '[data-animation-id="standard-effects__stamp-down"]'
    ) as HTMLElement
    expect(root.style.getPropertyValue('--pf-stamp-down-duration')).toBe('350ms')
    expect(root.style.getPropertyValue('--pf-stamp-down-start-scale')).toBe('2')
    expect(root.style.getPropertyValue('--pf-stamp-down-rotation')).toBe('2deg')
  })
})

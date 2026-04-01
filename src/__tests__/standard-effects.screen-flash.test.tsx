/**
 * Screen Flash — behavioral tests for both framer and CSS variants.
 * Verifies render output, prop wiring, overlay structure, and parity.
 */
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { metadata as framerMeta } from '@/components/base/standard-effects/framer/StandardEffectsScreenFlash.meta'
import { metadata as cssMeta } from '@/components/base/standard-effects/css/StandardEffectsScreenFlash.meta'

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

describe('Screen Flash parity', () => {
  it('framer and CSS metadata share the same animation id', () => {
    expect(framerMeta.id).toBe('standard-effects__screen-flash')
    expect(cssMeta.id).toBe(framerMeta.id)
  })

  it('both metadata expose identical configurable prop names', () => {
    const framerPropNames = framerMeta.props!.map((p) => p.name).sort()
    const cssPropNames = cssMeta.props!.map((p) => p.name).sort()
    expect(framerPropNames).toEqual(cssPropNames)
  })
})

describe('Screen Flash — Framer variant', () => {
  const loadFramer = async () => {
    const mod = await import('@/components/base/standard-effects/framer/StandardEffectsScreenFlash')
    return mod.StandardEffectsScreenFlash
  }

  it('renders wrapper with the correct data-animation-id', async () => {
    const Component = await loadFramer()
    const { container } = render(<Component />)
    const root = container.querySelector('[data-animation-id="standard-effects__screen-flash"]')
    expect(root?.getAttribute('data-animation-id')).toBe('standard-effects__screen-flash')
  })

  it('renders overlay with aria-hidden and pointer-events:none', async () => {
    const Component = await loadFramer()
    const { container } = render(<Component />)
    const root = container.querySelector('[data-animation-id="standard-effects__screen-flash"]')!
    const overlay = root.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(overlay.getAttribute('aria-hidden')).toBe('true')
    expect(overlay.style.pointerEvents).toBe('none')
  })

  it('applies custom color to the overlay backgroundColor', async () => {
    const Component = await loadFramer()
    const { container } = render(<Component color="red" />)
    const root = container.querySelector('[data-animation-id="standard-effects__screen-flash"]')!
    const overlay = root.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(overlay.style.backgroundColor).toBe('red')
  })

  it('renders default DemoBox content when no children provided', async () => {
    const Component = await loadFramer()
    const { container } = render(<Component />)
    const root = container.querySelector('[data-animation-id="standard-effects__screen-flash"]')!
    const labels = root.querySelectorAll('[class*="demo-box__label"]')
    expect(labels).toHaveLength(1)
    expect(labels[0].textContent).toBe('Flash')
  })

  it('renders custom children and omits DemoBox', async () => {
    const Component = await loadFramer()
    const { container } = render(
      <Component>
        <span data-testid="custom-child">Custom Content</span>
      </Component>
    )
    expect(screen.getByTestId('custom-child')).toHaveTextContent('Custom Content')
    const root = container.querySelector('[data-animation-id="standard-effects__screen-flash"]')!
    expect(root.querySelectorAll('[class*="demo-box"]')).toHaveLength(0)
  })
})

describe('Screen Flash — CSS variant', () => {
  const loadCss = async () => {
    const mod = await import('@/components/base/standard-effects/css/StandardEffectsScreenFlash')
    return mod.StandardEffectsScreenFlash
  }

  it('renders wrapper with the correct data-animation-id', async () => {
    const Component = await loadCss()
    const { container } = render(<Component />)
    const root = container.querySelector('[data-animation-id="standard-effects__screen-flash"]')
    expect(root?.getAttribute('data-animation-id')).toBe('standard-effects__screen-flash')
  })

  it('renders overlay with aria-hidden attribute', async () => {
    const Component = await loadCss()
    const { container } = render(<Component />)
    const root = container.querySelector('[data-animation-id="standard-effects__screen-flash"]')!
    const overlay = root.querySelector('[aria-hidden="true"]')
    expect(overlay?.getAttribute('aria-hidden')).toBe('true')
  })

  it('wires color, duration, and peakDuration to CSS custom properties', async () => {
    const Component = await loadCss()
    const { container } = render(<Component color="gold" duration={600} peakDuration={120} />)
    const root = container.querySelector(
      '[data-animation-id="standard-effects__screen-flash"]'
    ) as HTMLElement
    expect(root.style.getPropertyValue('--pf-flash-color')).toBe('gold')
    expect(root.style.getPropertyValue('--pf-flash-duration')).toBe('600ms')
    expect(root.style.getPropertyValue('--pf-flash-peak-duration')).toBe('120ms')
  })

  it('renders default DemoBox content when no children provided', async () => {
    const Component = await loadCss()
    const { container } = render(<Component />)
    const root = container.querySelector('[data-animation-id="standard-effects__screen-flash"]')!
    const labels = root.querySelectorAll('[class*="demo-box__label"]')
    expect(labels).toHaveLength(1)
    expect(labels[0].textContent).toBe('Flash')
  })

  it('renders custom children and omits DemoBox', async () => {
    const Component = await loadCss()
    const { container } = render(
      <Component>
        <span data-testid="custom-child">Game View</span>
      </Component>
    )
    expect(screen.getByTestId('custom-child')).toHaveTextContent('Game View')
    const root = container.querySelector('[data-animation-id="standard-effects__screen-flash"]')!
    expect(root.querySelectorAll('[class*="demo-box"]')).toHaveLength(0)
  })
})

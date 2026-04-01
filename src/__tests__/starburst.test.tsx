import { render, screen, waitFor } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it } from 'vitest'

import { StandardEffectsStarburst as FramerStarburst } from '@/components/base/standard-effects/framer/StandardEffectsStarburst'
import { StandardEffectsStarburst as CssStarburst } from '@/components/base/standard-effects/css/StandardEffectsStarburst'

describe.each([
  { name: 'Framer', Component: FramerStarburst },
  { name: 'CSS', Component: CssStarburst },
])('StandardEffectsStarburst ($name)', ({ Component }) => {
  it('renders with data-animation-id inside Suspense', async () => {
    render(
      <Suspense fallback={<div>loading</div>}>
        <Component />
      </Suspense>
    )

    await waitFor(() => {
      const el = screen.getByRole('img', { name: 'Starburst radial rays' })
      expect(el).toHaveAttribute('data-animation-id', 'standard-effects__starburst')
    })
  })

  it('renders with zero props (standalone)', () => {
    render(<Component />)
    const el = screen.getByRole('img', { name: 'Starburst radial rays' })
    expect(el).toHaveAttribute('data-animation-id', 'standard-effects__starburst')
  })

  it('renders correct number of SVG ray wedges', () => {
    render(<Component rayCount={8} />)
    const el = screen.getByRole('img', { name: 'Starburst radial rays' })
    const svg = el.querySelector('svg')!
    expect(svg.querySelectorAll('path')).toHaveLength(8)
  })

  it('clamps ray count to valid range [4, 24]', () => {
    const { unmount } = render(<Component rayCount={2} />)
    const el = screen.getByRole('img', { name: 'Starburst radial rays' })
    expect(el.querySelector('svg')!.querySelectorAll('path')).toHaveLength(4)
    unmount()

    render(<Component rayCount={30} />)
    const el2 = screen.getByRole('img', { name: 'Starburst radial rays' })
    expect(el2.querySelector('svg')!.querySelectorAll('path')).toHaveLength(24)
  })

  it('applies custom size to SVG viewBox', () => {
    render(<Component size={300} />)
    const el = screen.getByRole('img', { name: 'Starburst radial rays' })
    const svg = el.querySelector('svg')!
    expect(svg.getAttribute('viewBox')).toBe('0 0 300 300')
  })

  it('applies custom ray color to SVG path fills', () => {
    render(<Component rayColor="rgba(100, 200, 50, 0.3)" />)
    const el = screen.getByRole('img', { name: 'Starburst radial rays' })
    const path = el.querySelector('svg path')!
    expect(path.getAttribute('fill')).toBe('rgba(100, 200, 50, 0.3)')
  })

  it('renders children inside content slot when provided', () => {
    render(
      <Component>
        <span data-testid="child-content">Reward Icon</span>
      </Component>
    )

    expect(screen.getByTestId('child-content')).toHaveTextContent('Reward Icon')
    const el = screen.getByRole('img', { name: 'Starburst radial rays' })
    expect(el).toHaveAttribute('data-animation-id', 'standard-effects__starburst')
  })

  it('has accessible role and label', () => {
    render(<Component />)
    const el = screen.getByRole('img', { name: 'Starburst radial rays' })
    expect(el).toBeVisible()
  })

  it('applies containment styling on root element', () => {
    render(<Component />)
    const el = screen.getByRole('img', { name: 'Starburst radial rays' })
    const hasInlineOverflow = el.style.overflow === 'hidden'
    const hasClassName = el.className.length > 0
    expect(hasInlineOverflow || hasClassName).toBe(true)
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextEffectsGlitchText } from '@/components/base/text-effects/css/TextEffectsGlitchText'
import glitchStyles from '@/components/base/text-effects/css/TextEffectsGlitchText.module.css'

/** Shorthand for CSS module class selector */
const g = (cls: string) => `.${glitchStyles[cls]}`

/** Counts elements containing the given text within the container's text layers. */
function countTextInLayers(container: HTMLElement, text: string): number {
  const layers = container.querySelectorAll(
    `${g('tfx-glitchtext__base')}, ${g('tfx-glitchtext__layer--cyan')}, ${g('tfx-glitchtext__layer--magenta')}`
  )
  return Array.from(layers).filter((el) => el.textContent?.includes(text)).length
}

describe('TextEffectsGlitchText (CSS)', () => {
  it('renders three text layers (base + 2 RGB) for glitch effect', () => {
    const { container } = render(<TextEffectsGlitchText />)
    // The glitch effect needs exactly 3 copies: base + cyan + magenta
    expect(countTextInLayers(container, 'SYSTEM ERROR')).toBe(3)
  })

  it('renders custom text prop across all three layers', () => {
    const { container } = render(<TextEffectsGlitchText text="CONNECTION LOST" />)
    expect(countTextInLayers(container, 'CONNECTION LOST')).toBe(3)
  })

  it('children prop overrides text prop', () => {
    const { container } = render(
      <TextEffectsGlitchText text="SHOULD NOT SHOW">CHILDREN TEXT</TextEffectsGlitchText>
    )
    expect(countTextInLayers(container, 'SHOULD NOT SHOW')).toBe(0)
    expect(countTextInLayers(container, 'CHILDREN TEXT')).toBe(3)
  })

  it('preserves JSX children structure in all layers', () => {
    render(
      <TextEffectsGlitchText>
        <span data-testid="custom-child">
          ERROR <strong>404</strong>
        </span>
      </TextEffectsGlitchText>
    )
    // JSX children must appear in all 3 layers for visual effect
    expect(screen.getAllByTestId('custom-child')).toHaveLength(3)
  })

  it('renders BEM class structure required for CSS animations', () => {
    const { container } = render(<TextEffectsGlitchText />)
    expect(container.querySelector(g('tfx-glitchtext__container'))).toBeInTheDocument()
    expect(container.querySelector(g('tfx-glitchtext__base'))).toBeInTheDocument()
    expect(container.querySelector(g('tfx-glitchtext__layer--cyan'))).toBeInTheDocument()
    expect(container.querySelector(g('tfx-glitchtext__layer--magenta'))).toBeInTheDocument()
    expect(container.querySelector(g('tfx-glitchtext__bars'))).toBeInTheDocument()
  })

  it('applies custom className alongside component classes', () => {
    const { container } = render(<TextEffectsGlitchText className="custom-class" />)
    const el = container.querySelector(g('tfx-glitchtext__container'))
    expect(el).toHaveClass('custom-class')
    expect(el).toHaveClass(glitchStyles['tfx-glitchtext__container'])
  })

  it('sets data-animation-id for registry contract', () => {
    const { container } = render(<TextEffectsGlitchText />)
    expect(
      container.querySelector('[data-animation-id="text-effects__glitch-text"]')
    ).toBeInTheDocument()
  })

  it('marks decorative layers as aria-hidden for accessibility', () => {
    const { container } = render(<TextEffectsGlitchText />)
    expect(container.querySelector(g('tfx-glitchtext__layer--cyan'))).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(container.querySelector(g('tfx-glitchtext__layer--magenta'))).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(container.querySelector(g('tfx-glitchtext__bars'))).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    // Base text must NOT be aria-hidden (screen readers need it)
    expect(container.querySelector(g('tfx-glitchtext__base'))).not.toHaveAttribute('aria-hidden')
  })

  it('sets will-change hints for GPU-accelerated animations', () => {
    const { container } = render(<TextEffectsGlitchText />)
    expect(container.querySelector(g('tfx-glitchtext__base'))).toHaveStyle({
      willChange: 'transform',
    })
    expect(container.querySelector(g('tfx-glitchtext__layer--cyan'))).toHaveStyle({
      willChange: 'transform, opacity',
    })
    expect(container.querySelector(g('tfx-glitchtext__layer--magenta'))).toHaveStyle({
      willChange: 'transform, opacity',
    })
  })

  it('updates all three layers when text prop changes', () => {
    const { container, rerender } = render(<TextEffectsGlitchText text="BEFORE" />)
    expect(countTextInLayers(container, 'BEFORE')).toBe(3)
    rerender(<TextEffectsGlitchText text="AFTER" />)
    expect(countTextInLayers(container, 'BEFORE')).toBe(0)
    expect(countTextInLayers(container, 'AFTER')).toBe(3)
  })

  it('renders empty string without crashing', () => {
    const { container } = render(<TextEffectsGlitchText text="" />)
    expect(container.querySelector(g('tfx-glitchtext__container'))).toBeInTheDocument()
  })
})

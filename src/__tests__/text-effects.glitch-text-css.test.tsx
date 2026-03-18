import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextEffectsGlitchText } from '../components/base/text-effects/css/TextEffectsGlitchText'

describe('TextEffectsGlitchText (CSS)', () => {
  it('renders three text layers (base + 2 RGB) for glitch effect', () => {
    render(<TextEffectsGlitchText />)
    // The glitch effect needs exactly 3 copies: base + cyan + magenta
    const elements = screen.getAllByText('SYSTEM ERROR')
    expect(elements).toHaveLength(3)
  })

  it('renders custom text prop across all three layers', () => {
    render(<TextEffectsGlitchText text="CONNECTION LOST" />)
    expect(screen.getAllByText('CONNECTION LOST')).toHaveLength(3)
  })

  it('children prop overrides text prop', () => {
    render(<TextEffectsGlitchText text="SHOULD NOT SHOW">CHILDREN TEXT</TextEffectsGlitchText>)
    expect(screen.queryAllByText('SHOULD NOT SHOW')).toHaveLength(0)
    expect(screen.getAllByText('CHILDREN TEXT')).toHaveLength(3)
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
    expect(screen.getAllByText('404')).toHaveLength(3)
  })

  it('renders BEM class structure required for CSS animations', () => {
    const { container } = render(<TextEffectsGlitchText />)
    expect(container.querySelector('.tfx-glitchtext__container')).toBeInTheDocument()
    expect(container.querySelector('.tfx-glitchtext__base')).toBeInTheDocument()
    expect(container.querySelector('.tfx-glitchtext__layer--cyan')).toBeInTheDocument()
    expect(container.querySelector('.tfx-glitchtext__layer--magenta')).toBeInTheDocument()
    expect(container.querySelector('.tfx-glitchtext__bars')).toBeInTheDocument()
  })

  it('applies custom className alongside component classes', () => {
    const { container } = render(<TextEffectsGlitchText className="custom-class" />)
    const el = container.querySelector('.tfx-glitchtext__container')
    expect(el).toHaveClass('custom-class')
    expect(el).toHaveClass('tfx-glitchtext__container')
  })

  it('sets data-animation-id for registry contract', () => {
    const { container } = render(<TextEffectsGlitchText />)
    expect(
      container.querySelector('[data-animation-id="text-effects__tfx-glitchtext"]')
    ).toBeInTheDocument()
  })

  it('marks decorative layers as aria-hidden for accessibility', () => {
    const { container } = render(<TextEffectsGlitchText />)
    expect(container.querySelector('.tfx-glitchtext__layer--cyan')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(container.querySelector('.tfx-glitchtext__layer--magenta')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(container.querySelector('.tfx-glitchtext__bars')).toHaveAttribute('aria-hidden', 'true')
    // Base text must NOT be aria-hidden (screen readers need it)
    expect(container.querySelector('.tfx-glitchtext__base')).not.toHaveAttribute('aria-hidden')
  })

  it('sets will-change hints for GPU-accelerated animations', () => {
    const { container } = render(<TextEffectsGlitchText />)
    expect(container.querySelector('.tfx-glitchtext__base')).toHaveStyle({
      willChange: 'transform',
    })
    expect(container.querySelector('.tfx-glitchtext__layer--cyan')).toHaveStyle({
      willChange: 'transform, opacity',
    })
    expect(container.querySelector('.tfx-glitchtext__layer--magenta')).toHaveStyle({
      willChange: 'transform, opacity',
    })
  })

  it('updates all three layers when text prop changes', () => {
    const { rerender } = render(<TextEffectsGlitchText text="BEFORE" />)
    expect(screen.getAllByText('BEFORE')).toHaveLength(3)
    rerender(<TextEffectsGlitchText text="AFTER" />)
    expect(screen.queryByText('BEFORE')).not.toBeInTheDocument()
    expect(screen.getAllByText('AFTER')).toHaveLength(3)
  })

  it('renders empty string without crashing', () => {
    const { container } = render(<TextEffectsGlitchText text="" />)
    expect(container.querySelector('.tfx-glitchtext__container')).toBeInTheDocument()
  })
})

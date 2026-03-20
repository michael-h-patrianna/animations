import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextEffectsLevelBreakthrough } from '../components/base/text-effects/css/TextEffectsLevelBreakthrough'

describe('TextEffectsLevelBreakthrough', () => {
  it('renders default LEVEL 1 → LEVEL 2 transition text', () => {
    const { container } = render(<TextEffectsLevelBreakthrough />)
    expect(container.querySelector('.tfx-breakthrough-text-start')?.textContent).toBe('LEVEL 1')
    expect(container.querySelector('.tfx-breakthrough-text-end')?.textContent).toBe('LEVEL 2')
  })

  it('accepts custom startText and endText props', () => {
    const { container } = render(
      <TextEffectsLevelBreakthrough startText="BRONZE" endText="SILVER" />
    )
    expect(container.querySelector('.tfx-breakthrough-text-start')?.textContent).toBe('BRONZE')
    expect(container.querySelector('.tfx-breakthrough-text-end')?.textContent).toBe('SILVER')
  })

  it('renders BEM class structure required for CSS animation sequence', () => {
    const { container } = render(<TextEffectsLevelBreakthrough />)
    expect(container.querySelector('.tfx-breakthrough-container')).toBeInTheDocument()
    expect(container.querySelector('.tfx-breakthrough-text-wrapper')).toBeInTheDocument()
    expect(container.querySelector('.tfx-breakthrough-text-start')).toBeInTheDocument()
    expect(container.querySelector('.tfx-breakthrough-text-end')).toBeInTheDocument()
    expect(container.querySelector('.tfx-breakthrough-surge-outer')).toBeInTheDocument()
    expect(container.querySelector('.tfx-breakthrough-surge-inner')).toBeInTheDocument()
  })

  it('positions end text absolutely over start text for crossfade effect', () => {
    const { container } = render(<TextEffectsLevelBreakthrough />)
    expect(container.querySelector('.tfx-breakthrough-text-wrapper')).toHaveStyle({
      position: 'relative',
    })
    expect(container.querySelector('.tfx-breakthrough-text-end')).toHaveStyle({
      position: 'absolute',
    })
    expect(container.querySelector('.tfx-breakthrough-text-start')).not.toHaveStyle({
      position: 'absolute',
    })
  })

  it('starts with end text and surge rings at opacity 0 (animated in by CSS)', () => {
    const { container } = render(<TextEffectsLevelBreakthrough />)
    expect(container.querySelector('.tfx-breakthrough-text-end')).toHaveStyle({ opacity: '0' })
    expect(container.querySelector('.tfx-breakthrough-surge-outer')).toHaveStyle({ opacity: '0' })
    expect(container.querySelector('.tfx-breakthrough-surge-inner')).toHaveStyle({ opacity: '0' })
  })

  it('sets will-change hints for GPU acceleration on animated elements', () => {
    const { container } = render(<TextEffectsLevelBreakthrough />)
    expect(container.querySelector('.tfx-breakthrough-text-wrapper')).toHaveStyle({
      willChange: 'transform',
    })
    expect(container.querySelector('.tfx-breakthrough-text-start')).toHaveStyle({
      willChange: 'opacity',
    })
    expect(container.querySelector('.tfx-breakthrough-surge-outer')).toHaveStyle({
      willChange: 'transform, opacity',
    })
  })

  it('surge rings have pointer-events: none to not block interaction', () => {
    const { container } = render(<TextEffectsLevelBreakthrough />)
    expect(container.querySelector('.tfx-breakthrough-surge-outer')).toHaveStyle({
      pointerEvents: 'none',
    })
    expect(container.querySelector('.tfx-breakthrough-surge-inner')).toHaveStyle({
      pointerEvents: 'none',
    })
  })

  it('sets data-animation-id for registry contract', () => {
    const { container } = render(<TextEffectsLevelBreakthrough />)
    expect(
      container.querySelector('[data-animation-id="text-effects__level-breakthrough"]')
    ).toBeInTheDocument()
  })

  it('applies custom className alongside component classes', () => {
    const { container } = render(<TextEffectsLevelBreakthrough className="custom" />)
    const el = container.querySelector('.tfx-breakthrough-container')
    expect(el).toHaveClass('custom')
    expect(el).toHaveClass('tfx-breakthrough-container')
  })

  it('both text elements remain in DOM for screen readers', () => {
    render(<TextEffectsLevelBreakthrough startText="START" endText="END" />)
    expect(screen.getByText('START')).toHaveClass('tfx-breakthrough-text-start')
    expect(screen.getByText('END')).toHaveClass('tfx-breakthrough-text-end')
  })

  it('updates text when props change', () => {
    const { container, rerender } = render(<TextEffectsLevelBreakthrough startText="BEFORE" />)
    expect(container.querySelector('.tfx-breakthrough-text-start')?.textContent).toBe('BEFORE')
    rerender(<TextEffectsLevelBreakthrough startText="AFTER" />)
    expect(container.querySelector('.tfx-breakthrough-text-start')?.textContent).toBe('AFTER')
  })

  it('handles empty strings without crashing', () => {
    const { container } = render(<TextEffectsLevelBreakthrough startText="" endText="" />)
    expect(container.querySelector('.tfx-breakthrough-container')).toBeInTheDocument()
  })

  it('does not use legacy pf- prefixed classes', () => {
    const { container } = render(<TextEffectsLevelBreakthrough />)
    expect(container.querySelector('.pf-breakthrough-container')).not.toBeInTheDocument()
    expect(container.querySelector('.pf-level-breakthrough')).not.toBeInTheDocument()
  })
})

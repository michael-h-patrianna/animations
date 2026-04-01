import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextEffectsFloatingCombatText as FramerVariant } from '@/components/base/text-effects/framer/TextEffectsFloatingCombatText'
import { TextEffectsFloatingCombatText as CssVariant } from '@/components/base/text-effects/css/TextEffectsFloatingCombatText'
import framerStyles from '@/components/base/text-effects/framer/TextEffectsFloatingCombatText.module.css'
import cssStyles from '@/components/base/text-effects/css/TextEffectsFloatingCombatText.module.css'

const ANIMATION_ID = 'text-effects__floating-combat-text'

describe('TextEffectsFloatingCombatText (Framer)', () => {
  it('renders without crashing with zero props', () => {
    const { container } = render(<FramerVariant />)
    expect(container.querySelector(`[data-animation-id="${ANIMATION_ID}"]`)).toHaveAttribute(
      'data-animation-id',
      ANIMATION_ID
    )
  })

  it('renders default value text', () => {
    render(<FramerVariant />)
    expect(screen.getByTestId('combat-text-value')).toHaveTextContent('-42')
  })

  it('renders custom value prop', () => {
    render(<FramerVariant value="+100" />)
    expect(screen.getByTestId('combat-text-value')).toHaveTextContent('+100')
  })

  it('assigns positive band for non-negative values', () => {
    render(<FramerVariant value="+50" />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-band', 'positive')
  })

  it('assigns positive-high band when value >= positiveHighLimit', () => {
    render(<FramerVariant value="+200" positiveHighLimit={100} />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-band', 'positive-high')
  })

  it('assigns negative band for negative values above limit', () => {
    render(<FramerVariant value="-30" negativeHighLimit={100} />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-band', 'negative')
  })

  it('assigns negative-high band when value <= -negativeHighLimit', () => {
    render(<FramerVariant value="-150" negativeHighLimit={100} />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-band', 'negative-high')
  })

  it('treats zero as positive band', () => {
    render(<FramerVariant value="0" />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-band', 'positive')
  })

  it('treats boundary value at exactly positiveHighLimit as positive-high', () => {
    render(<FramerVariant value="100" positiveHighLimit={100} />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-band', 'positive-high')
  })

  it('treats boundary value at exactly -negativeHighLimit as negative-high', () => {
    render(<FramerVariant value="-100" negativeHighLimit={100} />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-band', 'negative-high')
  })

  it('overrides color via CSS variable when colorPositive is set', () => {
    const { container } = render(<FramerVariant value="+10" colorPositive="#00ff00" />)
    const root = container.querySelector(`[data-animation-id="${ANIMATION_ID}"]`)
    const style = root?.getAttribute('style') ?? ''
    expect(style).toContain('--pf-combat-text-color')
  })

  it('overrides color via CSS variable when colorNegativeHigh is set', () => {
    const { container } = render(<FramerVariant value="-200" colorNegativeHigh="#990000" />)
    const root = container.querySelector(`[data-animation-id="${ANIMATION_ID}"]`)
    const style = root?.getAttribute('style') ?? ''
    expect(style).toContain('--pf-combat-text-color')
  })

  it('does not set inline color when no color prop is provided', () => {
    const { container } = render(<FramerVariant value="+10" />)
    const root = container.querySelector(`[data-animation-id="${ANIMATION_ID}"]`)
    expect(root?.getAttribute('style')).toBeNull()
  })

  it('applies custom fontFamily', () => {
    render(<FramerVariant fontFamily="monospace" />)
    expect(screen.getByTestId('combat-text-value')).toHaveStyle({ fontFamily: 'monospace' })
  })

  it('applies custom fontWeight', () => {
    render(<FramerVariant fontWeight="900" />)
    expect(screen.getByTestId('combat-text-value')).toHaveStyle({ fontWeight: '900' })
  })

  it('has data-testid="combat-text" on root', () => {
    render(<FramerVariant />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-animation-id', ANIMATION_ID)
  })

  it('renders with container class for layout', () => {
    const { container } = render(<FramerVariant />)
    expect(container.querySelector(`.${framerStyles['pf-combat-text-fm']}`)).toHaveAttribute(
      'data-testid',
      'combat-text'
    )
  })
})

describe('TextEffectsFloatingCombatText (CSS)', () => {
  it('renders without crashing with zero props', () => {
    const { container } = render(<CssVariant />)
    expect(container.querySelector(`[data-animation-id="${ANIMATION_ID}"]`)).toHaveAttribute(
      'data-animation-id',
      ANIMATION_ID
    )
  })

  it('renders default value text', () => {
    render(<CssVariant />)
    expect(screen.getByTestId('combat-text-value')).toHaveTextContent('-42')
  })

  it('renders custom value prop', () => {
    render(<CssVariant value="+250" />)
    expect(screen.getByTestId('combat-text-value')).toHaveTextContent('+250')
  })

  it('assigns correct band for all four value ranges', () => {
    const cases: [string, Record<string, unknown>, string][] = [
      ['+50', {}, 'positive'],
      ['+200', { positiveHighLimit: 100 }, 'positive-high'],
      ['-30', {}, 'negative'],
      ['-200', { negativeHighLimit: 100 }, 'negative-high'],
    ]
    for (const [value, extraProps, expectedBand] of cases) {
      const { unmount } = render(<CssVariant value={value} {...extraProps} />)
      expect(screen.getByTestId('combat-text')).toHaveAttribute('data-band', expectedBand)
      unmount()
    }
  })

  it('overrides color via CSS variable when a color prop matches the band', () => {
    const { container } = render(<CssVariant value="-10" colorNegative="#ff0000" />)
    const root = container.querySelector(`[data-animation-id="${ANIMATION_ID}"]`)
    const style = root?.getAttribute('style') ?? ''
    expect(style).toContain('--tfx-combattext-color')
  })

  it('sets CSS custom properties for animation', () => {
    render(<CssVariant floatDistance={80} />)
    const el = screen.getByTestId('combat-text-value')
    const style = el.getAttribute('style') ?? ''
    expect(style).toContain('--tfx-combattext-float-distance')
    expect(style).toContain('--tfx-combattext-drift-x')
    expect(style).toContain('--tfx-combattext-pop-scale')
  })

  it('applies custom animationDuration', () => {
    render(<CssVariant duration={1200} />)
    expect(screen.getByTestId('combat-text-value')).toHaveStyle({ animationDuration: '1200ms' })
  })

  it('renders BEM class structure', () => {
    const { container } = render(<CssVariant />)
    expect(container.querySelector(`.${cssStyles['tfx-combattext__container']}`)).toHaveAttribute(
      'data-testid',
      'combat-text'
    )
    expect(container.querySelector(`.${cssStyles['tfx-combattext__text']}`)).toHaveAttribute(
      'data-testid',
      'combat-text-value'
    )
  })

  it('has data-testid="combat-text" on root', () => {
    render(<CssVariant />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-animation-id', ANIMATION_ID)
  })
})

describe('Framer/CSS parity', () => {
  it('both variants produce the same data-animation-id', () => {
    const { container: framerContainer, unmount: unmountFramer } = render(<FramerVariant />)
    const framerId = framerContainer
      .querySelector('[data-animation-id]')
      ?.getAttribute('data-animation-id')
    unmountFramer()

    const { container: cssContainer } = render(<CssVariant />)
    const cssId = cssContainer
      .querySelector('[data-animation-id]')
      ?.getAttribute('data-animation-id')

    expect(framerId).toBe(ANIMATION_ID)
    expect(cssId).toBe(ANIMATION_ID)
  })

  it('both variants render the same text content with same props', () => {
    const { unmount: unmountFramer } = render(<FramerVariant value="+500" />)
    const framerText = screen.getByTestId('combat-text-value').textContent
    unmountFramer()

    render(<CssVariant value="+500" />)
    const cssText = screen.getByTestId('combat-text-value').textContent

    expect(framerText).toBe(cssText)
  })

  it('both variants resolve the same data-band for the same value', () => {
    const { unmount: unmountFramer } = render(
      <FramerVariant value="-200" negativeHighLimit={100} />
    )
    const framerBand = screen.getByTestId('combat-text').getAttribute('data-band')
    unmountFramer()

    render(<CssVariant value="-200" negativeHighLimit={100} />)
    const cssBand = screen.getByTestId('combat-text').getAttribute('data-band')

    expect(framerBand).toBe('negative-high')
    expect(cssBand).toBe('negative-high')
  })
})

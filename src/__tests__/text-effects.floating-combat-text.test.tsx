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

  it('sets data-type attribute matching the type prop', () => {
    render(<FramerVariant type="heal" />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-type', 'heal')
  })

  it('defaults to damage type', () => {
    render(<FramerVariant />)
    expect(screen.getByTestId('combat-text')).toHaveAttribute('data-type', 'damage')
  })

  it('sets all five type values correctly', () => {
    const types = ['damage', 'heal', 'gold', 'neutral', 'critical'] as const
    for (const type of types) {
      const { unmount } = render(<FramerVariant type={type} />)
      expect(screen.getByTestId('combat-text')).toHaveAttribute('data-type', type)
      unmount()
    }
  })

  it('custom color prop sets CSS variable override', () => {
    const { container } = render(<FramerVariant color="#ff00ff" />)
    const root = container.querySelector(`[data-animation-id="${ANIMATION_ID}"]`)
    const style = root?.getAttribute('style') ?? ''
    expect(style).toContain('--pf-combat-text-color')
  })

  it('critical type applies 1.5x font size', () => {
    render(<FramerVariant type="critical" fontSize={24} />)
    expect(screen.getByTestId('combat-text-value')).toHaveStyle({ fontSize: '36px' })
  })

  it('critical type applies critical CSS class', () => {
    const { container } = render(<FramerVariant type="critical" />)
    const textEl = container.querySelector(`.${framerStyles['pf-combat-text-fm__text--critical']}`)
    expect(textEl).toHaveAttribute('data-testid', 'combat-text-value')
  })

  it('non-critical type does not apply critical CSS class', () => {
    const { container } = render(<FramerVariant type="damage" />)
    const textEl = container.querySelector(`.${framerStyles['pf-combat-text-fm__text--critical']}`)
    expect(textEl).toBeNull()
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

  it('sets data-type attribute for correct type', () => {
    const types = ['damage', 'heal', 'gold', 'neutral', 'critical'] as const
    for (const type of types) {
      const { unmount } = render(<CssVariant type={type} />)
      expect(screen.getByTestId('combat-text')).toHaveAttribute('data-type', type)
      unmount()
    }
  })

  it('custom color prop sets CSS variable override on container', () => {
    const { container } = render(<CssVariant color="#00ff00" />)
    const root = container.querySelector(`[data-animation-id="${ANIMATION_ID}"]`)
    const style = root?.getAttribute('style') ?? ''
    expect(style).toContain('--tfx-combattext-color')
  })

  it('critical type applies 1.5x font size', () => {
    render(<CssVariant type="critical" fontSize={20} />)
    expect(screen.getByTestId('combat-text-value')).toHaveStyle({ fontSize: '30px' })
  })

  it('critical type applies critical CSS class', () => {
    const { container } = render(<CssVariant type="critical" />)
    const textEl = container.querySelector(`.${cssStyles['tfx-combattext__text--critical']}`)
    expect(textEl).toHaveAttribute('data-testid', 'combat-text-value')
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
    const { unmount: unmountFramer } = render(<FramerVariant value="+500" type="gold" />)
    const framerText = screen.getByTestId('combat-text-value').textContent
    unmountFramer()

    render(<CssVariant value="+500" type="gold" />)
    const cssText = screen.getByTestId('combat-text-value').textContent

    expect(framerText).toBe(cssText)
  })

  it('both variants set the same data-type attribute', () => {
    const { unmount: unmountFramer } = render(<FramerVariant type="heal" />)
    const framerType = screen.getByTestId('combat-text').getAttribute('data-type')
    unmountFramer()

    render(<CssVariant type="heal" />)
    const cssType = screen.getByTestId('combat-text').getAttribute('data-type')

    expect(framerType).toBe('heal')
    expect(cssType).toBe('heal')
  })
})

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UpdateIndicatorsBadgePop as CssBadgePop } from '@/components/realtime/update-indicators/css/UpdateIndicatorsBadgePop'
import { UpdateIndicatorsBadgePulse as CssBadgePulse } from '@/components/realtime/update-indicators/css/UpdateIndicatorsBadgePulse'
import { UpdateIndicatorsHomeIconDotBounce as CssDotBounce } from '@/components/realtime/update-indicators/css/UpdateIndicatorsHomeIconDotBounce'
import { UpdateIndicatorsLivePing as CssLivePing } from '@/components/realtime/update-indicators/css/UpdateIndicatorsLivePing'
import { UpdateIndicatorsBadgePop as FramerBadgePop } from '@/components/realtime/update-indicators/framer/UpdateIndicatorsBadgePop'
import { UpdateIndicatorsHomeIconDotBounce as FramerDotBounce } from '@/components/realtime/update-indicators/framer/UpdateIndicatorsHomeIconDotBounce'

/**
 * Parity tests verify that CSS and Framer variants of the same animation
 * produce structurally equivalent DOM — same data-animation-id, same
 * BEM class structure, same text content.
 */
describe('update-indicators CSS/Framer DOM parity', () => {
  it('badge-pop variants share the same data-animation-id', () => {
    const css = render(<CssBadgePop />)
    const framer = render(<FramerBadgePop />)

    const cssAnimId = css.container
      .querySelector('[data-animation-id]')
      ?.getAttribute('data-animation-id')
    const framerAnimId = framer.container
      .querySelector('[data-animation-id]')
      ?.getAttribute('data-animation-id')

    expect(cssAnimId).toBe('update-indicators__badge-pop')
    expect(framerAnimId).toBe('update-indicators__badge-pop')
  })

  it('badge-pop variants share structural BEM classes', () => {
    const css = render(<CssBadgePop />)
    const framer = render(<FramerBadgePop />)

    // CSS uses pf-update-indicator, framer uses pf-update-indicator-fm
    expect(css.container.querySelector('.pf-update-indicator')).toBeInTheDocument()
    expect(framer.container.querySelector('.pf-update-indicator-fm')).toBeInTheDocument()

    expect(css.container.querySelector('.pf-update-indicator__badge')).toBeInTheDocument()
    expect(framer.container.querySelector('.pf-update-indicator-fm__badge')).toBeInTheDocument()
  })

  it('badge-pop variants render the same default text content', () => {
    const css = render(<CssBadgePop />)
    const framer = render(<FramerBadgePop />)

    const cssBadgeText = css.container.querySelector('.pf-update-indicator__badge')?.textContent
    const framerBadgeText = framer.container.querySelector(
      '.pf-update-indicator-fm__badge'
    )?.textContent

    expect(cssBadgeText).toBe('New')
    expect(framerBadgeText).toBe('New')
    expect(cssBadgeText).toBe(framerBadgeText)
  })

  it('badge-pulse CSS variant has correct data-animation-id', () => {
    const { container } = render(<CssBadgePulse />)
    expect(
      container.querySelector('[data-animation-id="update-indicators__badge-pulse"]')
    ).toBeInTheDocument()
  })

  it('live-ping CSS variant has correct data-animation-id', () => {
    const { container } = render(<CssLivePing />)
    expect(
      container.querySelector('[data-animation-id="update-indicators__live-ping"]')
    ).toBeInTheDocument()
  })

  it('dot-bounce variants share the same data-animation-id', () => {
    const css = render(<CssDotBounce />)
    const framer = render(<FramerDotBounce />)

    const cssAnimId = css.container
      .querySelector('[data-animation-id]')
      ?.getAttribute('data-animation-id')
    const framerAnimId = framer.container
      .querySelector('[data-animation-id]')
      ?.getAttribute('data-animation-id')

    expect(cssAnimId).toBe('update-indicators__home-icon-dot-bounce')
    expect(framerAnimId).toBe('update-indicators__home-icon-dot-bounce')
  })

  it('dot-bounce renders anchor wrapper when children provided', () => {
    const { container } = render(
      <FramerDotBounce>
        <span data-testid="child">icon</span>
      </FramerDotBounce>
    )

    expect(container.querySelector('.pf-update-indicator-fm__anchor')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument()
    expect(container.querySelector('.pf-update-indicator-fm__dot')).toBeInTheDocument()
  })

  it('dot-bounce renders only dot when no children', () => {
    const { container } = render(<FramerDotBounce />)

    expect(container.querySelector('.pf-update-indicator-fm__anchor')).not.toBeInTheDocument()
    expect(container.querySelector('.pf-update-indicator-fm__dot')).toBeInTheDocument()
  })
})

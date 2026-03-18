import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UpdateIndicatorsBadgePop as CssBadgePop } from '@/components/realtime/update-indicators/css/UpdateIndicatorsBadgePop'
import { UpdateIndicatorsBadgePulse as CssBadgePulse } from '@/components/realtime/update-indicators/css/UpdateIndicatorsBadgePulse'
import { UpdateIndicatorsLivePing as CssLivePing } from '@/components/realtime/update-indicators/css/UpdateIndicatorsLivePing'
import { UpdateIndicatorsBadgePop as FramerBadgePop } from '@/components/realtime/update-indicators/framer/UpdateIndicatorsBadgePop'

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

    // Both should have the same container class
    expect(css.container.querySelector('.pf-update-indicator')).toBeInTheDocument()
    expect(framer.container.querySelector('.pf-update-indicator')).toBeInTheDocument()

    // Both should have icon, copy, and badge elements
    expect(css.container.querySelector('.pf-update-indicator__icon')).toBeInTheDocument()
    expect(framer.container.querySelector('.pf-update-indicator__icon')).toBeInTheDocument()

    expect(css.container.querySelector('.pf-update-indicator__badge')).toBeInTheDocument()
    expect(framer.container.querySelector('.pf-update-indicator__badge')).toBeInTheDocument()
  })

  it('badge-pop variants render the same text content', () => {
    const css = render(<CssBadgePop />)
    const framer = render(<FramerBadgePop />)

    const cssBadgeText = css.container.querySelector('.pf-update-indicator__badge')?.textContent
    const framerBadgeText = framer.container.querySelector(
      '.pf-update-indicator__badge'
    )?.textContent

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
})

import { loadLazyCatalog, resetLazyTestState } from '@/__tests__/helpers/lazyCatalog'
import { StandardEffectsBlink } from '@/components/base/standard-effects/css/StandardEffectsBlink'
import { StandardEffectsPulse } from '@/components/base/standard-effects/css/StandardEffectsPulse'
import { StandardEffectsPulseCircle } from '@/components/base/standard-effects/css/StandardEffectsPulseCircle'
import { ButtonFeedbackShakeGentle } from '@/components/base/button-effects/css/ButtonFeedbackShakeGentle'
import { ButtonEffectsRewardReadyPulse } from '@/components/base/button-effects/css/ButtonEffectsRewardReadyPulse'
import { ButtonEffectsRipple } from '@/components/base/button-effects/css/ButtonEffectsRipple'
import { ModalOrchestrationGridHighlight } from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationGridHighlight'
import { ModalOrchestrationMagneticHover } from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationMagneticHover'
import { metadata as springPhysicsCssMetadata } from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationSpringPhysics.meta'
import { PrizeRevealPirateChestWin } from '@/components/rewards/prize-reveal/framer/PrizeRevealPirateChestWin'
import { metadata as pirateChestNoWinCssMetadata } from '@/components/rewards/prize-reveal/css/PrizeRevealPirateChestNoWin.meta'
import { metadata as pirateChestWinCssMetadata } from '@/components/rewards/prize-reveal/css/PrizeRevealPirateChestWin.meta'
import { metadata as pirateChestNoWinFramerMetadata } from '@/components/rewards/prize-reveal/framer/PrizeRevealPirateChestNoWin.meta'
import { metadata as pirateChestWinFramerMetadata } from '@/components/rewards/prize-reveal/framer/PrizeRevealPirateChestWin.meta'
import { buildPropDefaults } from '@/contexts/AnimationInspectorContext'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('animation portability fixes', () => {
  beforeEach(() => {
    resetLazyTestState()
  })

  afterEach(() => {
    document.documentElement.style.removeProperty('--test-token-color')
    vi.useRealTimers()
    resetLazyTestState()
  })

  it('builds nested style defaults and resolves CSS token colors for inspector fields', () => {
    document.documentElement.style.setProperty('--test-token-color', '#336699')

    const defaults = buildPropDefaults([
      {
        type: 'color',
        name: 'accentColor',
        label: 'Accent',
        default: 'var(--test-token-color)',
      },
      {
        type: 'style-object',
        name: 'style',
        label: 'Theme',
        fields: [
          {
            type: 'color',
            key: '--test-bg',
            label: 'Background',
            default: 'var(--test-token-color)',
          },
          {
            type: 'number',
            key: '--test-height',
            label: 'Height',
            default: 14,
            unit: 'px',
          },
        ],
      },
    ] as any)

    expect(defaults).toEqual({
      accentColor: '#336699',
      style: {
        '--test-bg': '#336699',
        '--test-height': '14px',
      },
    })
  })

  it('uses structured style controls for all progress-bar metadata instead of a disabled style placeholder', async () => {
    const catalog = await loadLazyCatalog()
    const progressBarGroups = catalog
      .flatMap((category) => category.groups)
      .filter((group) => group.id === 'progress-bars-framer' || group.id === 'progress-bars-css')

    expect(progressBarGroups).toHaveLength(2)

    for (const group of progressBarGroups) {
      for (const animation of group.animations) {
        const styleProp = animation.props?.find((prop) => prop.name === 'style') as
          | { type?: string; disabled?: boolean; fields?: unknown[] }
          | undefined

        expect(styleProp?.type, `${animation.id} should expose structured style controls`).toBe(
          'style-object'
        )
        expect(
          styleProp?.disabled,
          `${animation.id} should not keep the disabled style placeholder`
        ).not.toBe(true)
        expect(
          styleProp?.fields?.length ?? 0,
          `${animation.id} should expose at least one theme field`
        ).toBeGreaterThan(0)
      }
    }
  })

  it('makes CSS spring-physics metadata truthful about the controls it actually supports', () => {
    const propNames = springPhysicsCssMetadata.props?.map((prop) => prop.name) ?? []

    expect(propNames).toContain('duration')
    expect(propNames).not.toContain('stiffness')
    expect(propNames).not.toContain('damping')
    expect(propNames).not.toContain('mass')
  })

  it('wires configurable props into CSS base effects instead of ignoring them', () => {
    const { container } = render(
      <>
        <StandardEffectsBlink duration={1750}>
          <span>Blink Child</span>
        </StandardEffectsBlink>
        <StandardEffectsPulse duration={2300} glowColor="#ff00aa" borderRadius={24}>
          <span>Pulse Child</span>
        </StandardEffectsPulse>
        <StandardEffectsPulseCircle size={88} color="#123456" ringColor="#abcdef" duration={1800} />
        <ButtonFeedbackShakeGentle duration={180} trigger={false}>
          <button>Retry</button>
        </ButtonFeedbackShakeGentle>
        <ButtonEffectsRewardReadyPulse duration={2600} pulseScale={1.18} bobDistance={7}>
          <button>Claim</button>
        </ButtonEffectsRewardReadyPulse>
        <ButtonEffectsRipple color="#ff00aa" duration={780} />
      </>
    )

    expect(screen.getByText('Blink Child')).toBeVisible()
    expect(screen.getByText('Pulse Child')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Claim' })).toBeVisible()

    const blinkRoot = container.querySelector('[data-animation-id="standard-effects__blink"]') as HTMLElement
    const pulseRoot = container.querySelector('[data-animation-id="standard-effects__pulse"]') as HTMLElement
    const pulseCircleRoot = container.querySelector(
      '[data-animation-id="standard-effects__pulse-circle"]'
    ) as HTMLElement
    const shakeButton = screen.getByRole('button', { name: 'Retry' }) as HTMLElement
    const rewardButton = screen.getByRole('button', { name: 'Claim' }) as HTMLElement
    const rippleRoot = container.querySelector('[data-animation-id="button-effects__ripple"]') as HTMLElement

    expect(blinkRoot.style.getPropertyValue('--pf-blink-duration')).toBe('1750ms')
    expect(pulseRoot.style.getPropertyValue('--pf-pulse-duration')).toBe('2300ms')
    expect(pulseRoot.style.getPropertyValue('--pf-pulse-glow-color')).toBe('#ff00aa')
    expect(pulseRoot.style.getPropertyValue('--pf-pulse-border-radius')).toBe('24px')
    expect(pulseCircleRoot.style.getPropertyValue('--pf-pulse-circle-size')).toBe('88px')
    expect(pulseCircleRoot.style.getPropertyValue('--pf-pulse-circle-color')).toBe('#123456')
    expect(pulseCircleRoot.style.getPropertyValue('--pf-pulse-circle-ring-color')).toBe('#abcdef')
    expect(pulseCircleRoot.style.getPropertyValue('--pf-pulse-circle-duration')).toBe('1800ms')
    expect(shakeButton.style.getPropertyValue('--pf-shake-gentle-duration')).toBe('180ms')
    expect(rewardButton.style.getPropertyValue('--pf-reward-pulse-duration')).toBe('2600ms')
    expect(rewardButton.style.getPropertyValue('--pf-reward-pulse-scale')).toBe('1.18')
    expect(rewardButton.style.getPropertyValue('--pf-reward-pulse-bob')).toBe('7px')
    expect(rippleRoot.style.getPropertyValue('--pf-ripple-color')).toBe('#ff00aa')
  })

  it('passes the missing CSS orchestration props through to the rendered styles', () => {
    const { container } = render(
      <>
        {(
          <ModalOrchestrationGridHighlight
            {...({ distance: 28, stagger: 120, duration: 300, columns: 3 } as any)}
          />
        )}
        {(
          <ModalOrchestrationMagneticHover
            {...({ tiltIntensity: 9, stagger: 90, duration: 420, columns: 2 } as any)}
          />
        )}
      </>
    )

    const gridRoot = container.querySelector('[data-animation-id="modal-orchestration__grid-highlight"]') as HTMLElement
    const magneticRoot = container.querySelector('[data-animation-id="modal-orchestration__magnetic-hover"]') as HTMLElement

    expect(gridRoot.style.getPropertyValue('--pf-grid-highlight-distance')).toBe('28px')
    expect(magneticRoot.style.getPropertyValue('--pf-magnetic-hover-tilt')).toBe('9deg')
  })

  it('adds configurable timing and count props to pirate chest reveal variants', () => {
    const winPropNames = pirateChestWinFramerMetadata.props?.map((prop) => prop.name) ?? []
    const noWinPropNames = pirateChestNoWinFramerMetadata.props?.map((prop) => prop.name) ?? []
    const cssWinPropNames = pirateChestWinCssMetadata.props?.map((prop) => prop.name) ?? []
    const cssNoWinPropNames = pirateChestNoWinCssMetadata.props?.map((prop) => prop.name) ?? []

    expect(winPropNames).toEqual(expect.arrayContaining(['shakeDelayMs', 'revealDelayMs', 'coinCount']))
    expect(noWinPropNames).toEqual(expect.arrayContaining(['shakeDelayMs', 'revealDelayMs']))
    expect(cssWinPropNames).toEqual(expect.arrayContaining(['shakeDelayMs', 'revealDelayMs', 'coinCount']))
    expect(cssNoWinPropNames).toEqual(expect.arrayContaining(['shakeDelayMs', 'revealDelayMs']))
  })

  it('uses pirate chest win timing and coin count props at runtime', () => {
    vi.useFakeTimers()

    const { container } = render(
      <PrizeRevealPirateChestWin {...({ shakeDelayMs: 0, revealDelayMs: 0, coinCount: 3 } as any)} />
    )

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(container.querySelectorAll('.pf-pirate-chest-win__coin')).toHaveLength(3)
  })
})

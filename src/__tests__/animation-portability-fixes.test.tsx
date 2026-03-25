import { loadLazyCatalog, resetLazyTestState } from '@/__tests__/helpers/lazyCatalog'
import {
  coinImage,
  modalCelebrationsFireworkParticle1Image,
  modalCelebrationsFireworkParticle2Image,
  modalCelebrationsFireworkParticle3Image,
  presentBox,
  presentBoxBalloon,
  pulseScroll,
  shakeIcon,
} from '@/assets'
import { StandardEffectsBlink } from '@/components/base/standard-effects/css/StandardEffectsBlink'
import { StandardEffectsPulse } from '@/components/base/standard-effects/css/StandardEffectsPulse'
import { StandardEffectsPulseCircle } from '@/components/base/standard-effects/css/StandardEffectsPulseCircle'
import { ButtonFeedbackShakeGentle } from '@/components/base/button-effects/css/ButtonFeedbackShakeGentle'
import { ButtonEffectsRewardReadyPulse } from '@/components/base/button-effects/css/ButtonEffectsRewardReadyPulse'
import { ButtonEffectsRipple } from '@/components/base/button-effects/css/ButtonEffectsRipple'
import { ModalOrchestrationGridHighlight } from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationGridHighlight'
import { ModalOrchestrationMagneticHover } from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationMagneticHover'
import { metadata as springPhysicsCssMetadata } from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationSpringPhysics.meta'
import { TimerEffectsPillCountdownSoft } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownSoft'
import { metadata as collectionCoinBurstMetadata } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst.meta'
import { metadata as collectionCoinMagnetMetadata } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinMagnet.meta'
import { metadata as collectionCoinTrailMetadata } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinTrail.meta'
import { metadata as collectionCoinsFountainMetadata } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinsFountain.meta'
import { metadata as iconBounceMetadata } from '@/components/rewards/icon-animations/framer/IconAnimationsBounce.meta'
import { metadata as iconFloatMetadata } from '@/components/rewards/icon-animations/framer/IconAnimationsFloat.meta'
import { metadata as iconPulseMetadata } from '@/components/rewards/icon-animations/framer/IconAnimationsPulse.meta'
import { metadata as iconShakeMetadata } from '@/components/rewards/icon-animations/framer/IconAnimationsShake.meta'
import { ModalCelebrationsFireworksRing as CssModalCelebrationsFireworksRing } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsFireworksRing'
import { metadata as coinCascadeMetadata } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsCoinCascade.meta'
import { metadata as coinsArcMetadata } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsCoinsArc.meta'
import { metadata as coinsSwirlMetadata } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsCoinsSwirl.meta'
import { ModalCelebrationsFireworksRing as FramerModalCelebrationsFireworksRing } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsFireworksRing'
import { metadata as fireworkMetadata } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsFirework.meta'
import { metadata as treasureParticlesMetadata } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsTreasureParticles.meta'
import { PrizeRevealPirateChestWin } from '@/components/rewards/prize-reveal/framer/PrizeRevealPirateChestWin'
import { metadata as pirateChestNoWinCssMetadata } from '@/components/rewards/prize-reveal/css/PrizeRevealPirateChestNoWin.meta'
import { metadata as pirateChestWinCssMetadata } from '@/components/rewards/prize-reveal/css/PrizeRevealPirateChestWin.meta'
import { metadata as pirateChestNoWinFramerMetadata } from '@/components/rewards/prize-reveal/framer/PrizeRevealPirateChestNoWin.meta'
import { metadata as pirateChestWinFramerMetadata } from '@/components/rewards/prize-reveal/framer/PrizeRevealPirateChestWin.meta'
import { buildPropDefaults, hasDirtyPropOverrides } from '@/contexts/AnimationInspectorContext'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function countFramerFireworksRingEmbers(container: HTMLElement) {
  return Array.from(container.querySelectorAll('span')).filter((node) => {
    const el = node as HTMLElement
    return (
      el.className === '' &&
      el.style.left === '50%' &&
      el.style.top === '50%' &&
      el.style.marginLeft === ''
    )
  }).length
}

function countCssFireworksRingEmbers(container: HTMLElement) {
  return Array.from(container.querySelectorAll('span')).filter(
    (node) => (node as HTMLElement).style.getPropertyValue('--sx') !== ''
  ).length
}

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
    ] satisfies import('@/types/animation').PropConfig[])

    expect(defaults).toEqual({
      accentColor: '#336699',
      style: {
        '--test-bg': '#336699',
        '--test-height': '14px',
      },
    })
  })

  it('seeds starter image defaults for previewable reward animations without marking them dirty', () => {
    const buildDefaults = buildPropDefaults as (
      propsConfig?: unknown,
      animationId?: string
    ) => Record<string, unknown>
    const isDirty = hasDirtyPropOverrides as (
      overrides: Record<string, unknown>,
      propsConfig?: unknown,
      animationId?: string
    ) => boolean

    const iconCases = [
      [iconBounceMetadata, { src: presentBox, alt: 'Bouncing gift box' }],
      [iconFloatMetadata, { src: presentBoxBalloon, alt: 'Floating balloon' }],
      [iconPulseMetadata, { src: pulseScroll, alt: 'Pulsing scroll' }],
      [iconShakeMetadata, { src: shakeIcon, alt: 'Shake animation' }],
    ] as const

    for (const [metadata, expectedDefaults] of iconCases) {
      const defaults = buildDefaults(metadata.props, metadata.id)
      expect(defaults).toEqual(expect.objectContaining(expectedDefaults))
      expect(isDirty(defaults, metadata.props, metadata.id)).toBe(false)
    }

    const collectionCases = [
      collectionCoinBurstMetadata,
      collectionCoinMagnetMetadata,
      collectionCoinTrailMetadata,
      collectionCoinsFountainMetadata,
    ] as const

    for (const metadata of collectionCases) {
      const defaults = buildDefaults(metadata.props, metadata.id)
      expect(defaults).toEqual(
        expect.objectContaining({
          particleImages: [coinImage],
        })
      )
      expect(isDirty(defaults, metadata.props, metadata.id)).toBe(false)
    }

    const fireworkDefaults = buildDefaults(fireworkMetadata.props, fireworkMetadata.id)
    expect(fireworkDefaults).toEqual(
      expect.objectContaining({
        particleImages: [
          modalCelebrationsFireworkParticle1Image,
          modalCelebrationsFireworkParticle2Image,
          modalCelebrationsFireworkParticle3Image,
        ],
      })
    )
    expect(isDirty(fireworkDefaults, fireworkMetadata.props, fireworkMetadata.id)).toBe(false)

    const coinCelebrationCases = [
      coinsArcMetadata,
      coinsSwirlMetadata,
      coinCascadeMetadata,
      treasureParticlesMetadata,
    ] as const

    for (const metadata of coinCelebrationCases) {
      const defaults = buildDefaults(metadata.props, metadata.id)
      expect(defaults).toEqual(
        expect.objectContaining({
          coinImage,
        })
      )
      expect(isDirty(defaults, metadata.props, metadata.id)).toBe(false)
    }
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
          styleProp?.fields?.map((f) => f.key) ?? [],
          `${animation.id} should expose at least one theme field`
        ).toEqual(expect.arrayContaining([expect.stringMatching(/^--/)]))
      }
    }
  }, 30_000)

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

    expect(container.querySelector('[data-animation-id="standard-effects__blink"]')).toBeVisible()
    expect(container.querySelector('[data-animation-id="standard-effects__pulse"]')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Claim' })).toBeVisible()

    const blinkRoot = container.querySelector(
      '[data-animation-id="standard-effects__blink"]'
    ) as HTMLElement
    const pulseRoot = container.querySelector(
      '[data-animation-id="standard-effects__pulse"]'
    ) as HTMLElement
    const pulseCircleRoot = container.querySelector(
      '[data-animation-id="standard-effects__pulse-circle"]'
    ) as HTMLElement
    const shakeButton = screen.getByRole('button', { name: 'Retry' }) as HTMLElement
    const rewardButton = screen.getByRole('button', { name: 'Claim' }) as HTMLElement
    const rippleRoot = container.querySelector(
      '[data-animation-id="button-effects__ripple"]'
    ) as HTMLElement

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
        {
          <ModalOrchestrationGridHighlight
            {...({ distance: 28, stagger: 120, duration: 300, columns: 3 } as Record<
              string,
              unknown
            >)}
          />
        }
        {
          <ModalOrchestrationMagneticHover
            {...({ tiltIntensity: 9, stagger: 90, duration: 420, columns: 2 } as Record<
              string,
              unknown
            >)}
          />
        }
      </>
    )

    const gridRoot = container.querySelector(
      '[data-animation-id="modal-orchestration__grid-highlight"]'
    ) as HTMLElement
    const magneticRoot = container.querySelector(
      '[data-animation-id="modal-orchestration__magnetic-hover"]'
    ) as HTMLElement

    expect(gridRoot.style.getPropertyValue('--pf-grid-highlight-distance')).toBe('28px')
    expect(magneticRoot.style.getPropertyValue('--pf-magnetic-hover-tilt')).toBe('9deg')
  })

  it('wires the soft pill pulseIntensity prop into the rendered CSS variable', () => {
    const { container } = render(<TimerEffectsPillCountdownSoft pulseIntensity={0.18} />)

    const pillRoot = container.querySelector('.pf-pill-timer__pill--soft') as HTMLElement

    expect(pillRoot.style.getPropertyValue('--pf-pill-soft-pulse-scale')).toBe('1.18')
  })

  it('adds configurable timing and count props to pirate chest reveal variants', () => {
    const winPropNames = pirateChestWinFramerMetadata.props?.map((prop) => prop.name) ?? []
    const noWinPropNames = pirateChestNoWinFramerMetadata.props?.map((prop) => prop.name) ?? []
    const cssWinPropNames = pirateChestWinCssMetadata.props?.map((prop) => prop.name) ?? []
    const cssNoWinPropNames = pirateChestNoWinCssMetadata.props?.map((prop) => prop.name) ?? []

    expect(winPropNames).toEqual(
      expect.arrayContaining(['shakeDelayMs', 'revealDelayMs', 'coinCount'])
    )
    expect(noWinPropNames).toEqual(expect.arrayContaining(['shakeDelayMs', 'revealDelayMs']))
    expect(cssWinPropNames).toEqual(
      expect.arrayContaining(['shakeDelayMs', 'revealDelayMs', 'coinCount'])
    )
    expect(cssNoWinPropNames).toEqual(expect.arrayContaining(['shakeDelayMs', 'revealDelayMs']))
  })

  it('uses pirate chest win timing and coin count props at runtime', () => {
    vi.useFakeTimers()

    const { container } = render(
      <PrizeRevealPirateChestWin
        {...({ shakeDelayMs: 0, revealDelayMs: 0, coinCount: 3 } as Record<string, unknown>)}
      />
    )

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(container.querySelectorAll('.pf-pirate-chest-win__coin')).toHaveLength(3)
  })

  it('uses particleCount to control fireworks ring ember density in both variants', () => {
    const css = render(<CssModalCelebrationsFireworksRing particleCount={9} />)
    const framer = render(<FramerModalCelebrationsFireworksRing particleCount={9} />)

    expect(countCssFireworksRingEmbers(css.container)).toBe(18)
    expect(countFramerFireworksRingEmbers(framer.container)).toBe(18)
  })
})

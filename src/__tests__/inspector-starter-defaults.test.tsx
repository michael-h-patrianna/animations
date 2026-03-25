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
import { metadata as collectionCoinBurstMetadata } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst.meta'
import { metadata as collectionCoinMagnetMetadata } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinMagnet.meta'
import { metadata as collectionCoinTrailMetadata } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinTrail.meta'
import { metadata as collectionCoinsFountainMetadata } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinsFountain.meta'
import { metadata as iconBounceMetadata } from '@/components/rewards/icon-animations/framer/IconAnimationsBounce.meta'
import { metadata as iconFloatMetadata } from '@/components/rewards/icon-animations/framer/IconAnimationsFloat.meta'
import { metadata as iconPulseMetadata } from '@/components/rewards/icon-animations/framer/IconAnimationsPulse.meta'
import { metadata as iconShakeMetadata } from '@/components/rewards/icon-animations/framer/IconAnimationsShake.meta'
import { metadata as coinCascadeMetadata } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsCoinCascade.meta'
import { metadata as coinsArcMetadata } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsCoinsArc.meta'
import { metadata as coinsSwirlMetadata } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsCoinsSwirl.meta'
import { metadata as fireworkMetadata } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsFirework.meta'
import { metadata as treasureParticlesMetadata } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsTreasureParticles.meta'
import { buildPropDefaults, hasDirtyPropOverrides } from '@/contexts/AnimationInspectorContext'
import { describe, expect, it } from 'vitest'

describe('animation inspector starter defaults', () => {
  it('seeds preview starter assets without marking them dirty', () => {
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
})

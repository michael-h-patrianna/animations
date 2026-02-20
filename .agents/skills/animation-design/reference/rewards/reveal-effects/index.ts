import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as anticipationShakeMetadata } from './framer/RevealEffectsAnticipationShake.meta'
import { metadata as cardFlipSmoothMetadata } from './framer/RevealEffectsCardFlipSmooth.meta'
import { metadata as badgeScaleShineMetadata } from './framer/AchievementRevealsBadgeScaleShine.meta'
import { metadata as cardSlideUpMetadata } from './framer/RevealEffectsCardSlideUp.meta'
import { metadata as cardFanMetadata } from './framer/RevealEffectsCardFan.meta'
import { metadata as cardSpin3DMetadata } from './framer/RevealEffectsCardSpin3D.meta'
import { metadata as cardShimmerMetadata } from './framer/RevealEffectsCardShimmer.meta'
import { metadata as chestLidOpenMetadata } from './framer/RevealEffectsChestLidOpen.meta'
import { metadata as chestBounceOpenMetadata } from './framer/RevealEffectsChestBounceOpen.meta'
import { metadata as chestGlowOpenMetadata } from './framer/RevealEffectsChestGlowOpen.meta'
import { metadata as giftBoxUnwrapMetadata } from './framer/RevealEffectsGiftBoxUnwrap.meta'
import { metadata as orbShatterMetadata } from './framer/RevealEffectsOrbShatter.meta'
import { metadata as prizePopMetadata } from './framer/RevealEffectsPrizePop.meta'
import { metadata as prizeFloatLandMetadata } from './framer/RevealEffectsPrizeFloatLand.meta'
import { metadata as prizeRaysMetadata } from './framer/RevealEffectsPrizeRays.meta'


// CSS - Import metadata only
import { metadata as anticipationShakeCssMetadata } from './css/RevealEffectsAnticipationShake.meta'
import { metadata as cardFlipSmoothCssMetadata } from './css/RevealEffectsCardFlipSmooth.meta'
import { metadata as badgeScaleShineCssMetadata } from './css/AchievementRevealsBadgeScaleShine.meta'
import { metadata as cardSlideUpCssMetadata } from './css/RevealEffectsCardSlideUp.meta'
import { metadata as cardFanCssMetadata } from './css/RevealEffectsCardFan.meta'
import { metadata as cardSpin3DCssMetadata } from './css/RevealEffectsCardSpin3D.meta'
import { metadata as cardShimmerCssMetadata } from './css/RevealEffectsCardShimmer.meta'
import { metadata as chestLidOpenCssMetadata } from './css/RevealEffectsChestLidOpen.meta'
import { metadata as chestBounceOpenCssMetadata } from './css/RevealEffectsChestBounceOpen.meta'
import { metadata as chestGlowOpenCssMetadata } from './css/RevealEffectsChestGlowOpen.meta'
import { metadata as giftBoxUnwrapCssMetadata } from './css/RevealEffectsGiftBoxUnwrap.meta'
import { metadata as orbShatterCssMetadata } from './css/RevealEffectsOrbShatter.meta'
import { metadata as prizePopCssMetadata } from './css/RevealEffectsPrizePop.meta'
import { metadata as prizeFloatLandCssMetadata } from './css/RevealEffectsPrizeFloatLand.meta'
import { metadata as prizeRaysCssMetadata } from './css/RevealEffectsPrizeRays.meta'

// Framer Motion - Lazy load components
const RevealEffectsCardFlipSmooth = lazy(() =>
  import('./framer/RevealEffectsCardFlipSmooth').then((m) => ({
    default: m.RevealEffectsCardFlipSmooth,
  }))
)

const RevealEffectsAnticipationShake = lazy(() =>
  import('./framer/RevealEffectsAnticipationShake').then((m) => ({
    default: m.RevealEffectsAnticipationShake,
  }))
)

const AchievementRevealsBadgeScaleShine = lazy(() =>
  import('./framer/AchievementRevealsBadgeScaleShine').then((m) => ({
    default: m.AchievementRevealsBadgeScaleShine,
  }))
)

const RevealEffectsCardSlideUp = lazy(() => import('./framer/RevealEffectsCardSlideUp').then(m => ({ default: m.RevealEffectsCardSlideUp })))
const RevealEffectsCardFan = lazy(() => import('./framer/RevealEffectsCardFan').then(m => ({ default: m.RevealEffectsCardFan })))
const RevealEffectsCardSpin3D = lazy(() => import('./framer/RevealEffectsCardSpin3D').then(m => ({ default: m.RevealEffectsCardSpin3D })))
const RevealEffectsCardShimmer = lazy(() => import('./framer/RevealEffectsCardShimmer').then(m => ({ default: m.RevealEffectsCardShimmer })))
const RevealEffectsChestLidOpen = lazy(() => import('./framer/RevealEffectsChestLidOpen').then(m => ({ default: m.RevealEffectsChestLidOpen })))
const RevealEffectsChestBounceOpen = lazy(() => import('./framer/RevealEffectsChestBounceOpen').then(m => ({ default: m.RevealEffectsChestBounceOpen })))
const RevealEffectsChestGlowOpen = lazy(() => import('./framer/RevealEffectsChestGlowOpen').then(m => ({ default: m.RevealEffectsChestGlowOpen })))
const RevealEffectsGiftBoxUnwrap = lazy(() => import('./framer/RevealEffectsGiftBoxUnwrap').then(m => ({ default: m.RevealEffectsGiftBoxUnwrap })))
const RevealEffectsOrbShatter = lazy(() => import('./framer/RevealEffectsOrbShatter').then(m => ({ default: m.RevealEffectsOrbShatter })))
const RevealEffectsPrizePop = lazy(() => import('./framer/RevealEffectsPrizePop').then(m => ({ default: m.RevealEffectsPrizePop })))
const RevealEffectsPrizeFloatLand = lazy(() => import('./framer/RevealEffectsPrizeFloatLand').then(m => ({ default: m.RevealEffectsPrizeFloatLand })))
const RevealEffectsPrizeRays = lazy(() => import('./framer/RevealEffectsPrizeRays').then(m => ({ default: m.RevealEffectsPrizeRays })))


// CSS - Lazy load components
const CssRevealEffectsCardFlipSmooth = lazy(() =>
  import('./css/RevealEffectsCardFlipSmooth').then((m) => ({
    default: m.RevealEffectsCardFlipSmooth,
  }))
)

const CssRevealEffectsAnticipationShake = lazy(() =>
  import('./css/RevealEffectsAnticipationShake').then((m) => ({
    default: m.RevealEffectsAnticipationShake,
  }))
)

const CssAchievementRevealsBadgeScaleShine = lazy(() =>
  import('./css/AchievementRevealsBadgeScaleShine').then((m) => ({
    default: m.AchievementRevealsBadgeScaleShine,
  }))
)

const CssRevealEffectsCardSlideUp = lazy(() => import('./css/RevealEffectsCardSlideUp').then(m => ({ default: m.RevealEffectsCardSlideUp })))
const CssRevealEffectsCardFan = lazy(() => import('./css/RevealEffectsCardFan').then(m => ({ default: m.RevealEffectsCardFan })))
const CssRevealEffectsCardSpin3D = lazy(() => import('./css/RevealEffectsCardSpin3D').then(m => ({ default: m.RevealEffectsCardSpin3D })))
const CssRevealEffectsCardShimmer = lazy(() => import('./css/RevealEffectsCardShimmer').then(m => ({ default: m.RevealEffectsCardShimmer })))
const CssRevealEffectsChestLidOpen = lazy(() => import('./css/RevealEffectsChestLidOpen').then(m => ({ default: m.RevealEffectsChestLidOpen })))
const CssRevealEffectsChestBounceOpen = lazy(() => import('./css/RevealEffectsChestBounceOpen').then(m => ({ default: m.RevealEffectsChestBounceOpen })))
const CssRevealEffectsChestGlowOpen = lazy(() => import('./css/RevealEffectsChestGlowOpen').then(m => ({ default: m.RevealEffectsChestGlowOpen })))
const CssRevealEffectsGiftBoxUnwrap = lazy(() => import('./css/RevealEffectsGiftBoxUnwrap').then(m => ({ default: m.RevealEffectsGiftBoxUnwrap })))
const CssRevealEffectsOrbShatter = lazy(() => import('./css/RevealEffectsOrbShatter').then(m => ({ default: m.RevealEffectsOrbShatter })))
const CssRevealEffectsPrizePop = lazy(() => import('./css/RevealEffectsPrizePop').then(m => ({ default: m.RevealEffectsPrizePop })))
const CssRevealEffectsPrizeFloatLand = lazy(() => import('./css/RevealEffectsPrizeFloatLand').then(m => ({ default: m.RevealEffectsPrizeFloatLand })))
const CssRevealEffectsPrizeRays = lazy(() => import('./css/RevealEffectsPrizeRays').then(m => ({ default: m.RevealEffectsPrizeRays })))

export const groupMetadata: GroupMetadata = {
  id: 'reveal-effects',
  title: 'Reveal Effects',
  tech: 'framer',
  demo: 'revealEffects',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'reveal-effects__card-flip-smooth': {
      component: RevealEffectsCardFlipSmooth,
      metadata: cardFlipSmoothMetadata,
    },
    'reveal-effects__anticipation-shake': {
      component: RevealEffectsAnticipationShake,
      metadata: anticipationShakeMetadata,
    },
    'achievement-reveals__badge-scale-shine': {
      component: AchievementRevealsBadgeScaleShine,
      metadata: badgeScaleShineMetadata,
    },
    'rewards-reveal-effects__card-slide-up': { component: RevealEffectsCardSlideUp, metadata: cardSlideUpMetadata },
    'rewards-reveal-effects__card-fan-reveal': { component: RevealEffectsCardFan, metadata: cardFanMetadata },
    'rewards-reveal-effects__card-spin-3d': { component: RevealEffectsCardSpin3D, metadata: cardSpin3DMetadata },
    'rewards-reveal-effects__card-shimmer': { component: RevealEffectsCardShimmer, metadata: cardShimmerMetadata },
    'rewards-reveal-effects__chest-lid-open': { component: RevealEffectsChestLidOpen, metadata: chestLidOpenMetadata },
    'rewards-reveal-effects__chest-bounce-open': { component: RevealEffectsChestBounceOpen, metadata: chestBounceOpenMetadata },
    'rewards-reveal-effects__chest-glow-open': { component: RevealEffectsChestGlowOpen, metadata: chestGlowOpenMetadata },
    'rewards-reveal-effects__gift-box-unwrap': { component: RevealEffectsGiftBoxUnwrap, metadata: giftBoxUnwrapMetadata },
    'rewards-reveal-effects__orb-shatter': { component: RevealEffectsOrbShatter, metadata: orbShatterMetadata },
    'rewards-reveal-effects__prize-pop': { component: RevealEffectsPrizePop, metadata: prizePopMetadata },
    'rewards-reveal-effects__prize-float-land': { component: RevealEffectsPrizeFloatLand, metadata: prizeFloatLandMetadata },
    'rewards-reveal-effects__prize-rays': { component: RevealEffectsPrizeRays, metadata: prizeRaysMetadata },
  },
  css: {
    'reveal-effects__card-flip-smooth': {
      component: CssRevealEffectsCardFlipSmooth,
      metadata: cardFlipSmoothCssMetadata,
    },
    'reveal-effects__anticipation-shake': {
      component: CssRevealEffectsAnticipationShake,
      metadata: anticipationShakeCssMetadata,
    },
    'achievement-reveals__badge-scale-shine': {
      component: CssAchievementRevealsBadgeScaleShine,
      metadata: badgeScaleShineCssMetadata,
    },
    'rewards-reveal-effects__card-slide-up': { component: CssRevealEffectsCardSlideUp, metadata: cardSlideUpCssMetadata },
    'rewards-reveal-effects__card-fan-reveal': { component: CssRevealEffectsCardFan, metadata: cardFanCssMetadata },
    'rewards-reveal-effects__card-spin-3d': { component: CssRevealEffectsCardSpin3D, metadata: cardSpin3DCssMetadata },
    'rewards-reveal-effects__card-shimmer': { component: CssRevealEffectsCardShimmer, metadata: cardShimmerCssMetadata },
    'rewards-reveal-effects__chest-lid-open': { component: CssRevealEffectsChestLidOpen, metadata: chestLidOpenCssMetadata },
    'rewards-reveal-effects__chest-bounce-open': { component: CssRevealEffectsChestBounceOpen, metadata: chestBounceOpenCssMetadata },
    'rewards-reveal-effects__chest-glow-open': { component: CssRevealEffectsChestGlowOpen, metadata: chestGlowOpenCssMetadata },
    'rewards-reveal-effects__gift-box-unwrap': { component: CssRevealEffectsGiftBoxUnwrap, metadata: giftBoxUnwrapCssMetadata },
    'rewards-reveal-effects__orb-shatter': { component: CssRevealEffectsOrbShatter, metadata: orbShatterCssMetadata },
    'rewards-reveal-effects__prize-pop': { component: CssRevealEffectsPrizePop, metadata: prizePopCssMetadata },
    'rewards-reveal-effects__prize-float-land': { component: CssRevealEffectsPrizeFloatLand, metadata: prizeFloatLandCssMetadata },
    'rewards-reveal-effects__prize-rays': { component: CssRevealEffectsPrizeRays, metadata: prizeRaysCssMetadata },
  },
}
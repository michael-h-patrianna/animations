import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as anticipationShakeMetadata } from './framer/RevealEffectsAnticipationShake.meta'
import { metadata as cardFlipSmoothMetadata } from './framer/RevealEffectsCardFlipSmooth.meta'
import { metadata as badgeScaleShineMetadata } from './framer/AchievementRevealsBadgeScaleShine.meta'

// CSS - Import metadata only
import { metadata as anticipationShakeCssMetadata } from './css/RevealEffectsAnticipationShake.meta'
import { metadata as cardFlipSmoothCssMetadata } from './css/RevealEffectsCardFlipSmooth.meta'
import { metadata as badgeScaleShineCssMetadata } from './css/AchievementRevealsBadgeScaleShine.meta'

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

export const groupMetadata: GroupMetadata = {
  id: 'reveal-effects',
  title: 'Reveal Effects',
  tech: 'css',
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
  },
}

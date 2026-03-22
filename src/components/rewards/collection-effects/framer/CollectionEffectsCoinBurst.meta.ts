import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'collection-effects__coin-burst',
  urlSlugFramer: '/collection-effects-framer?animation=collection-effects__coin-burst',
  urlSlugCss: '/collection-effects-css?animation=collection-effects__coin-burst',
  title: 'Coin Burst',
  description:
    'Radial particle burst from a configurable origin point. Supports custom particle images with preloading, SVG confetti fallback, and onComplete callback. Accepts from/count/particleImages/onComplete props.',
  tier: 3,
  demoMode: 'burst',
} satisfies AnimationMetadata

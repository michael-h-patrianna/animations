/**
 * Catalog-specific prop overrides for the animation inspector.
 *
 * These defaults provide Vite-resolved asset URLs (images, icons) that
 * replace the generic placeholder paths in `.meta.ts` files. They are
 * intentionally centralized here rather than in `.meta.ts` because:
 *
 * 1. `.meta.ts` defaults are portable — they work in any consumer project.
 *    Starter defaults inject catalog-specific assets that only exist in
 *    this repository's `@/assets` directory.
 *
 * 2. Tier 1-2 animations cannot import `@/assets` per the
 *    `tier-dependency-budget` lint rule. Centralizing asset coupling here
 *    keeps animation metadata tier-compliant.
 *
 * When adding a new animation that needs catalog-specific image defaults,
 * add an entry to `INSPECTOR_STARTER_DEFAULTS` below.
 */

import { shallowClone } from '@/utils/clone'
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

const DEFAULT_COIN_PARTICLE_IMAGES = [coinImage] as const

const DEFAULT_FIREWORK_PARTICLE_IMAGES = [
  modalCelebrationsFireworkParticle1Image,
  modalCelebrationsFireworkParticle2Image,
  modalCelebrationsFireworkParticle3Image,
] as const

const INSPECTOR_STARTER_DEFAULTS: Record<string, Record<string, unknown>> = {
  'collection-effects__coin-burst': { particleImages: [...DEFAULT_COIN_PARTICLE_IMAGES] },
  'collection-effects__coin-magnet': { particleImages: [...DEFAULT_COIN_PARTICLE_IMAGES] },
  'collection-effects__coin-trail': { particleImages: [...DEFAULT_COIN_PARTICLE_IMAGES] },
  'collection-effects__coins-fountain': { particleImages: [...DEFAULT_COIN_PARTICLE_IMAGES] },
  'icon-animations__bounce': { src: presentBox, alt: 'Bouncing gift box' },
  'icon-animations__float': { src: presentBoxBalloon, alt: 'Floating balloon' },
  'icon-animations__pulse': { src: pulseScroll, alt: 'Pulsing scroll' },
  'icon-animations__shake': { src: shakeIcon, alt: 'Shake animation' },
  'modal-celebrations__coin-cascade': { coinImage },
  'modal-celebrations__coins-arc': { coinImage },
  'modal-celebrations__coins-swirl': { coinImage },
  'modal-celebrations__firework': { particleImages: [...DEFAULT_FIREWORK_PARTICLE_IMAGES] },
  'modal-celebrations__treasure-particles': { coinImage },
}

/** Returns pre-configured prop defaults (images, alt text) for specific animation IDs. */
export function getInspectorStarterDefaults(animationId?: string): Record<string, unknown> {
  if (animationId == null) return {}

  const defaults = INSPECTOR_STARTER_DEFAULTS[animationId]
  if (defaults == null) return {}

  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [key, shallowClone(value)])
  )
}

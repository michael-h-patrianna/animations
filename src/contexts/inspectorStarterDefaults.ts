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

function cloneStarterValue(value: unknown): unknown {
  if (Array.isArray(value)) return [...value]
  if (typeof value === 'object' && value !== null) {
    return { ...(value as Record<string, unknown>) }
  }
  return value
}

export function getInspectorStarterDefaults(animationId?: string): Record<string, unknown> {
  if (animationId == null) return {}

  const defaults = INSPECTOR_STARTER_DEFAULTS[animationId]
  if (defaults == null) return {}

  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [key, cloneStarterValue(value)])
  )
}

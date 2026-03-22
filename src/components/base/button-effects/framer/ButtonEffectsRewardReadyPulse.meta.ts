import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'button-effects__reward-ready-pulse',
  title: 'Reward Ready Pulse',
  description:
    'Wraps any element with a breathing scale + vertical bob to signal availability. Pauses on hover, compresses on tap. Props: duration, pulseScale, bobDistance.',
  infinite: true,
  tier: 1,
}

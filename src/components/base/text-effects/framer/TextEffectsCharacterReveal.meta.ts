import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'text-effects__character-reveal',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__character-reveal',
  urlSlugCss: '/text-effects-css?animation=text-effects__character-reveal',
  title: 'Character Reveal',
  description:
    'Premium text reveal with layered shadows and character scale animations for achievement moments.',
  disableReplay: false,
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'ACHIEVEMENT' },
    { type: 'string', name: 'subtitle', label: 'Subtitle', default: 'UNLOCKED' },
    { type: 'color', name: 'color', label: 'Color', default: '#ffd700' },
    { type: 'color', name: 'subtitleColor', label: 'Subtitle Color', default: 'rgba(255,193,7,0.8)' },
  ],
} satisfies AnimationMetadata

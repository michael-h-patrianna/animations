import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'icon-animations__pulse',
  urlSlugFramer: '/icon-animations-framer?animation=icon-animations__pulse',
  urlSlugCss: '/icon-animations-css?animation=icon-animations__pulse',
  title: 'Pulse',
  description:
    'Animated image with scale pulse, rotation wobble and opacity breathing. Props: src, alt, width, duration.',
  infinite: true,
  tier: 2,
  props: [
    {
      type: 'image',
      name: 'src',
      label: 'Image URL',
      description: 'Image source URL. Renders a placeholder when omitted.',
    },
    { type: 'string', name: 'alt', label: 'Alt Text', default: '' },
    {
      type: 'number',
      name: 'width',
      label: 'Width',
      default: 140,
      min: 20,
      max: 400,
      step: 10,
      unit: 'px',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Cycle Duration',
      default: 2000,
      min: 500,
      max: 20000,
      step: 500,
      unit: 'ms',
    },
  ],
}

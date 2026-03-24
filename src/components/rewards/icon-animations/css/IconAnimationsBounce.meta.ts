import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'icon-animations__bounce',
  urlSlugFramer: '/icon-animations-framer?animation=icon-animations__bounce',
  urlSlugCss: '/icon-animations-css?animation=icon-animations__bounce',
  title: 'Bounce',
  description:
    'Animated image with vertical bounce, squash-stretch deformation and tilt. Props: src, alt, width, duration.',
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
      default: 120,
      min: 20,
      max: 400,
      step: 10,
      unit: 'px',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 800,
      min: 200,
      max: 5000,
      step: 100,
      unit: 'ms',
    },
  ],
}

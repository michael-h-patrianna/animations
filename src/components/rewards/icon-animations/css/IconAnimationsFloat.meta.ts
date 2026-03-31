import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'icon-animations__float',
  urlSlugFramer: '/icon-animations-framer?animation=icon-animations__float',
  urlSlugCss: '/icon-animations-css?animation=icon-animations__float',
  title: 'Float',
  description:
    'Animated image with gentle floating, horizontal sway and subtle scale breathing. Props: src, alt, width, duration.',
  infinite: true,
  tier: 2,
  props: [
    {
      type: 'image',
      name: 'src',
      label: 'Image URL',
      description: 'Image source URL. No default bundled — renders no image when omitted.',
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
      label: 'Cycle Duration',
      default: 6000,
      min: 1000,
      max: 20000,
      step: 500,
      unit: 'ms',
    },
  ],
}

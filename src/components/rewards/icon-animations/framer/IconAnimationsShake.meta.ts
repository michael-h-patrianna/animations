import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'icon-animations__shake',
  urlSlugFramer: '/icon-animations-framer?animation=icon-animations__shake',
  urlSlugCss: '/icon-animations-css?animation=icon-animations__shake',
  title: 'Shake',
  description:
    'Animated image with horizontal shake, rotation wobble and scale compression. Props: src, alt, width, duration.',
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
      label: 'Duration',
      default: 500,
      min: 100,
      max: 3000,
      step: 50,
      unit: 'ms',
    },
  ],
}

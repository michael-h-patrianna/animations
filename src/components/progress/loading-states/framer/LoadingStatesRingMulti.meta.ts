import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__ring-multi',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__ring-multi',
  urlSlugCss: '/loading-states-css?animation=loading-states__ring-multi',
  title: 'Multi Ring',
  description:
    'Three concentric rings spinning at different speeds. Configure size, colors, thickness, and speed.',
  infinite: true,
  tier: 4,
  props: [
    { type: 'number', name: 'size', label: 'Size', default: 60, min: 20, max: 120, step: 2, unit: 'px' },
    { type: 'colors', name: 'colors', label: 'Ring Colors', default: ['#c47ae5', '#c6ff77', '#47fff4'], maxItems: 3 },
    { type: 'number', name: 'thickness', label: 'Thickness', default: 3, min: 1, max: 10, step: 1, unit: 'px' },
    { type: 'number', name: 'speed', label: 'Speed', default: 1, min: 0.1, max: 5, step: 0.1, unit: 'x' },
    { type: 'string', name: 'className', label: 'Class Name' },
  ],
} satisfies AnimationMetadata

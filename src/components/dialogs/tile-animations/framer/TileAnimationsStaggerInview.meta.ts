import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'tile-animations__stagger-inview',
  urlSlugFramer: '/tile-animations-framer?animation=tile-animations__stagger-inview',
  urlSlugCss: '/tile-animations-css?animation=tile-animations__stagger-inview',
  title: 'Stagger In-View',
  description:
    'Wrap child elements to stagger-reveal them on mount. Configurable stagger delay, duration, distance, and columns.',
  tier: 3,
  previewMaxWidth: 414,
  props: [
    {
      type: 'number',
      name: 'stagger',
      label: 'Stagger',
      default: 100,
      min: 0,
      max: 500,
      step: 10,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 600,
      min: 100,
      max: 2000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'distance',
      label: 'Distance',
      default: 60,
      min: 0,
      max: 200,
      step: 5,
      unit: 'px',
    },
    { type: 'number', name: 'columns', label: 'Columns', default: 4, min: 1, max: 6, step: 1 },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass grid items via JSX children',
    },
  ],
} satisfies AnimationMetadata

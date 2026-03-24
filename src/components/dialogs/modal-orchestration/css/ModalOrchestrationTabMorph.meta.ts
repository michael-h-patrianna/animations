import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__tab-morph',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__tab-morph',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__tab-morph',
  title: 'Interactive Tab Tiles',
  description:
    'Tab panel container with pop-scale entrance and sliding content transitions. Controlled or uncontrolled. Configurable labels, stagger, and active index.',
  tier: 3,
  previewMaxWidth: 414,
  props: [
    {
      type: 'number',
      name: 'stagger',
      label: 'Stagger',
      default: 260,
      min: 0,
      max: 1000,
      step: 10,
      unit: 'ms',
    },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass tab panel content via JSX children',
    },
    {
      type: 'string',
      name: 'labels',
      label: 'Tab Labels',
      disabled: true,
      disabledReason: 'String array — configure in code',
    },
    {
      type: 'string',
      name: 'activeIndex',
      label: 'Active Index',
      disabled: true,
      disabledReason: 'Controlled state — set in code',
    },
    {
      type: 'string',
      name: 'onTabChange',
      label: 'On Tab Change',
      disabled: true,
      disabledReason: 'Callback — set in code',
    },
  ],
} satisfies AnimationMetadata

import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'auto-dismiss__toast-raise',
  urlSlugFramer: '/auto-dismiss-framer?animation=auto-dismiss__toast-raise',
  urlSlugCss: '/auto-dismiss-css?animation=auto-dismiss__toast-raise',
  title: 'Toast Rise Up',
  description:
    'Wraps content with a rise-from-below entrance and upward exit. Configurable timeout via duration prop.',
  tier: 2,
  props: [
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'ReactNode — pass JSX via props',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 3600,
      min: 1000,
      max: 10000,
      step: 100,
      unit: 'ms',
    },
    {
      type: 'string',
      name: 'onDismiss',
      label: 'On Dismiss',
      disabled: true,
      disabledReason: 'Callback — pass a () => void function via props',
    },
    {
      type: 'string',
      name: 'style',
      label: 'Style',
      disabled: true,
      disabledReason: 'CSSProperties — pass a style object via props',
    },
  ],
}

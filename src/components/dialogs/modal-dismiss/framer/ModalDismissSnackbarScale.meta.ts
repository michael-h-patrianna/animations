import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-dismiss__snackbar-scale',
  urlSlugFramer: '/modal-dismiss-framer?animation=modal-dismiss__snackbar-scale',
  urlSlugCss: '/modal-dismiss-css?animation=modal-dismiss__snackbar-scale',
  title: 'Snackbar Scale Pulse',
  description:
    'Wraps content with a bouncy scale entrance, subtle pulse during visible phase, and scale-down exit. Configurable timeout via duration prop.',
  tier: 2,
  props: [
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'ReactNode — pass JSX via props' },
    { type: 'number', name: 'duration', label: 'Duration', default: 4000, min: 1000, max: 10000, step: 100, unit: 'ms' },
    { type: 'string', name: 'onDismiss', label: 'On Dismiss', disabled: true, disabledReason: 'Callback — pass a () => void function via props' },
    { type: 'string', name: 'className', label: 'Class Name' },
    { type: 'string', name: 'style', label: 'Style', disabled: true, disabledReason: 'CSSProperties — pass a style object via props' },
  ],
}

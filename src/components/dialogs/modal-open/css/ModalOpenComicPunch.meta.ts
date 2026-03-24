import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-open__comic-punch',
  urlSlugFramer: '/modal-open-framer?animation=modal-open__comic-punch',
  urlSlugCss: '/modal-open-css?animation=modal-open__comic-punch',
  title: 'Comic Punch',
  description:
    'Modal punches in from trigger with cartoon squash-stretch impact and bounce cycles. Props: from, duration, impactForce, contentRevealAt, children.',
  tier: 3,
  props: [
    { type: 'string', name: 'from', label: 'Origin Point', disabled: true, disabledReason: 'Ref or {x,y} — set in code' },
    { type: 'number', name: 'duration', label: 'Duration', default: 600, min: 100, max: 2000, step: 50, unit: 'ms' },
    { type: 'number', name: 'overlayOpacity', label: 'Overlay Opacity', default: 0.5, min: 0, max: 1, step: 0.05 },
    { type: 'number', name: 'impactForce', label: 'Impact Force', default: 0.5, min: 0, max: 1, step: 0.05 },
    { type: 'number', name: 'contentRevealAt', label: 'Content Reveal At', default: 60, min: 0, max: 100, step: 5, unit: '%' },
    { type: 'string', name: 'className', label: 'CSS Class', default: '' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass content via JSX children' },
    { type: 'string', name: 'style', label: 'Inline Styles', disabled: true, disabledReason: 'CSSProperties object — set in code' },
    { type: 'string', name: 'onAnimationComplete', label: 'On Complete', disabled: true, disabledReason: 'Callback — set in code' },
  ],
}

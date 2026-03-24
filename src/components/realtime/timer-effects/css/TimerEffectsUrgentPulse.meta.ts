import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'timer-effects__urgent-pulse',
  urlSlugFramer: '/timer-effects-framer?animation=timer-effects__urgent-pulse',
  urlSlugCss: '/timer-effects-css?animation=timer-effects__urgent-pulse',
  title: 'Urgent Pulse',
  description:
    'Urgent pulsing countdown with gradient shift. Configurable: startSeconds, mode, colors, thresholds, onEnd, onEndBehavior.',
  tier: 4,
  props: [
    { type: 'number', name: 'startSeconds', label: 'Start Seconds', default: 5, min: 5, max: 120, step: 1, unit: 's' },
    { type: 'select', name: 'mode', label: 'Mode', default: 'visual', options: [{ label: 'Visual', value: 'visual' }, { label: 'Exact', value: 'exact' }] },
    { type: 'string', name: 'colors', label: 'Colors', disabled: true, disabledReason: 'TimerPhaseColors object — configure in code' },
    { type: 'string', name: 'thresholds', label: 'Thresholds', disabled: true, disabledReason: 'TimerPhaseThresholds object — configure in code' },
    { type: 'string', name: 'onEnd', label: 'On End', disabled: true, disabledReason: 'Callback — set via code' },
    { type: 'select', name: 'onEndBehavior', label: 'On End Behavior', default: 'stay', options: [{ label: 'Hide', value: 'hide' }, { label: 'Stay', value: 'stay' }] },
    { type: 'color', name: 'textColor', label: 'Text Color' },
    { type: 'number', name: 'fontSize', label: 'Font Size', unit: 'px' },
  ],
} satisfies AnimationMetadata

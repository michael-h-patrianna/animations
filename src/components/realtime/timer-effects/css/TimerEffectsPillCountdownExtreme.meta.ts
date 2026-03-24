import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'timer-effects__pill-countdown-extreme',
  urlSlugFramer: '/timer-effects-framer?animation=timer-effects__pill-countdown-extreme',
  urlSlugCss: '/timer-effects-css?animation=timer-effects__pill-countdown-extreme',
  title: 'Pill Countdown — Extreme',
  description: 'Extreme: quiet until last 10s. Stepwise color; 3-2-1 buzz; flash on zero.',
  tier: 4,
  props: [
    { type: 'number', name: 'startSeconds', label: 'Start Seconds', default: 60, min: 5, max: 120, step: 1, unit: 's' },
    { type: 'select', name: 'mode', label: 'Mode', default: 'visual', options: [{ label: 'Visual', value: 'visual' }, { label: 'Exact', value: 'exact' }] },
    { type: 'string', name: 'colors', label: 'Colors', disabled: true, disabledReason: 'TimerPhaseColors object — configure in code' },
    { type: 'string', name: 'thresholds', label: 'Thresholds', disabled: true, disabledReason: 'TimerPhaseThresholds object — configure in code' },
    { type: 'string', name: 'onEnd', label: 'On End', disabled: true, disabledReason: 'Callback — set via code' },
    { type: 'select', name: 'onEndBehavior', label: 'On End Behavior', default: 'stay', options: [{ label: 'Hide', value: 'hide' }, { label: 'Stay', value: 'stay' }] },
    { type: 'color', name: 'textColor', label: 'Text Color' },
    { type: 'number', name: 'fontSize', label: 'Font Size', unit: 'px' },
  ],
}

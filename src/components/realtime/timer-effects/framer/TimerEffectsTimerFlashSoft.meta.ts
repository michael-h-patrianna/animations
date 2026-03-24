import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'timer-effects__timer-flash-soft',
  urlSlugFramer: '/timer-effects-framer?animation=timer-effects__timer-flash-soft',
  urlSlugCss: '/timer-effects-css?animation=timer-effects__timer-flash-soft',
  title: 'Flash Expire Soft',
  description: 'Softer version with shake reminder every 10 seconds.',
  tier: 4,
  props: [
    { type: 'number', name: 'startSeconds', label: 'Start Seconds', default: 32, min: 5, max: 120, step: 1, unit: 's' },
    { type: 'select', name: 'mode', label: 'Mode', default: 'visual', options: [{ label: 'Visual', value: 'visual' }, { label: 'Exact', value: 'exact' }] },
    { type: 'string', name: 'colors', label: 'Colors', disabled: true, disabledReason: 'TimerPhaseColors object — configure in code' },
    { type: 'string', name: 'thresholds', label: 'Thresholds', disabled: true, disabledReason: 'TimerPhaseThresholds object — configure in code' },
    { type: 'string', name: 'onEnd', label: 'On End', disabled: true, disabledReason: 'Callback — set via code' },
    { type: 'select', name: 'onEndBehavior', label: 'On End Behavior', default: 'stay', options: [{ label: 'Hide', value: 'hide' }, { label: 'Stay', value: 'stay' }] },
    { type: 'color', name: 'textColor', label: 'Text Color' },
    { type: 'number', name: 'fontSize', label: 'Font Size', unit: 'px' },
    { type: 'number', name: 'shakeInterval', label: 'Shake Interval', default: 10, min: 1, max: 60, step: 1, unit: 's' },
  ],
}

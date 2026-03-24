import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'timer-effects__pill-countdown-soft',
  urlSlugFramer: '/timer-effects-framer?animation=timer-effects__pill-countdown-soft',
  urlSlugCss: '/timer-effects-css?animation=timer-effects__pill-countdown-soft',
  title: 'Pill Countdown — Soft',
  description: 'Quiet countdown with brief pulse at key thresholds.',
  tier: 4,
  props: [
    {
      type: 'number',
      name: 'startSeconds',
      label: 'Start Seconds',
      default: 60,
      min: 5,
      max: 120,
      step: 1,
      unit: 's',
    },
    {
      type: 'select',
      name: 'mode',
      label: 'Mode',
      default: 'visual',
      options: [
        { label: 'Visual', value: 'visual' },
        { label: 'Exact', value: 'exact' },
      ],
    },
    {
      type: 'string',
      name: 'colors',
      label: 'Colors',
      disabled: true,
      disabledReason: 'TimerPhaseColors object — configure in code',
    },
    {
      type: 'string',
      name: 'thresholds',
      label: 'Thresholds',
      disabled: true,
      disabledReason: 'TimerPhaseThresholds object — configure in code',
    },
    {
      type: 'string',
      name: 'onEnd',
      label: 'On End',
      disabled: true,
      disabledReason: 'Callback — set via code',
    },
    {
      type: 'select',
      name: 'onEndBehavior',
      label: 'On End Behavior',
      default: 'stay',
      options: [
        { label: 'Hide', value: 'hide' },
        { label: 'Stay', value: 'stay' },
      ],
    },
    { type: 'color', name: 'textColor', label: 'Text Color' },
    { type: 'number', name: 'fontSize', label: 'Font Size', unit: 'px' },
    {
      type: 'number',
      name: 'pulseIntensity',
      label: 'Pulse Intensity',
      default: 0.05,
      min: 0,
      max: 1,
      step: 0.01,
    },
  ],
}

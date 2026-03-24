import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__horizon-light-pass',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__horizon-light-pass',
  urlSlugCss: '/text-effects-css?animation=text-effects__horizon-light-pass',
  title: 'Horizon Light Pass',
  description:
    'A horizontal light band passes across the text, briefly brightening and stretching letters before settling.',
  disableReplay: false,
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'LOREM IPSUM DOLOR' },
    { type: 'color', name: 'color', label: 'Color', default: '#e8e4da' },
  ],
}

import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__metallic-specular-flash',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__metallic-specular-flash',
  urlSlugCss: '/text-effects-css?animation=text-effects__metallic-specular-flash',
  title: 'Metallic Specular Flash',
  description:
    'A crisp, narrow specular flash sweeps across the text with brief skew and stretch, then settles.',
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'LOREM IPSUM DOLOR' },
    { type: 'color', name: 'color', label: 'Color', default: '#e8e4da' },
  ],
}

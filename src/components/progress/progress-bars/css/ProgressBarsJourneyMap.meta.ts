import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__journey-map',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__journey-map',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__journey-map',
  title: 'Journey Map',
  description: 'Avatar travels along a path activating nodes',
  tier: 4,
  previewMaxWidth: 414,
  props: [
    { type: 'number', name: 'progress', label: 'Progress', default: 0.72, min: 0, max: 1, step: 0.01 },
    { type: 'number', name: 'totalDistance', label: 'Total Distance', default: 520, min: 1, max: 10000, step: 10 },
    { type: 'string', name: 'unit', label: 'Unit', default: 'km' },
    { type: 'string', name: 'label', label: 'Label', default: 'Journey Distance' },
    { type: 'image', name: 'travelerIcon', label: 'Traveler Icon' },
    { type: 'image', name: 'destinationIcon', label: 'Destination Icon' },
    { type: 'string', name: 'className', label: 'Class Name' },
    { type: 'string', name: 'style', label: 'Style', disabled: true, disabledReason: 'CSSProperties object — set via code' },
  ],
} satisfies AnimationMetadata

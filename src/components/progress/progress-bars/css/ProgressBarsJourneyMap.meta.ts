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
    {
      type: 'number',
      name: 'progress',
      label: 'Progress',
      default: 0.72,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      type: 'number',
      name: 'totalDistance',
      label: 'Total Distance',
      default: 520,
      min: 1,
      max: 10000,
      step: 10,
    },
    { type: 'string', name: 'unit', label: 'Unit', default: 'km' },
    { type: 'string', name: 'label', label: 'Label', default: 'Journey Distance' },
    { type: 'image', name: 'travelerIcon', label: 'Traveler Icon' },
    { type: 'image', name: 'destinationIcon', label: 'Destination Icon' },
    {
      type: 'style-object',
      name: 'style',
      label: 'Theme',
      fields: [
        {
          type: 'color',
          key: '--journey-track-bg',
          label: 'Track',
          default: 'rgb(255 255 255 / 10%)',
        },
        { type: 'color', key: '--journey-fill-from', label: 'Fill Start', default: '#22c55e' },
        { type: 'color', key: '--journey-fill-to', label: 'Fill End', default: '#4ade80' },
        {
          type: 'color',
          key: '--journey-text-muted',
          label: 'Label Text',
          default: 'rgb(255 255 255 / 55%)',
        },
        {
          type: 'color',
          key: '--journey-text-strong',
          label: 'Value Text',
          default: 'rgb(255 255 255 / 95%)',
        },
        {
          type: 'color',
          key: '--journey-traveller-glow',
          label: 'Traveler Glow',
          default: 'rgb(74 222 128 / 45%)',
        },
      ],
    },
  ],
} satisfies AnimationMetadata

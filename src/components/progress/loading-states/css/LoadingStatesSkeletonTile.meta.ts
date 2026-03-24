import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__skeleton-tile',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__skeleton-tile',
  urlSlugCss: '/loading-states-css?animation=loading-states__skeleton-tile',
  title: 'Skeleton Tile Grid',
  description:
    'Shimmer tile grid composed from Skeleton primitives. Use SharedSkeleton.tsx (framer) or .pf-skeleton class (CSS) for custom layouts.',
  infinite: true,
  tier: 4,
  props: [
    { type: 'number', name: 'width', label: 'Width', default: 200, min: 80, max: 400, step: 10, unit: 'px' },
    { type: 'number', name: 'columns', label: 'Columns', default: 3, min: 1, max: 6, step: 1 },
    { type: 'number', name: 'rows', label: 'Rows', default: 2, min: 1, max: 6, step: 1 },
    { type: 'number', name: 'tileHeight', label: 'Tile Height', default: 40, min: 16, max: 80, step: 2, unit: 'px' },
    { type: 'number', name: 'gap', label: 'Gap', default: 8, min: 0, max: 24, step: 1, unit: 'px' },
    { type: 'color', name: 'baseColor', label: 'Base Color', default: 'rgb(236 195 255 / 5%)' },
    { type: 'color', name: 'shimmerColor', label: 'Shimmer Color', default: 'rgb(236 195 255 / 18%)' },
    { type: 'number', name: 'speed', label: 'Speed', default: 1, min: 0.1, max: 5, step: 0.1, unit: 'x' },
    { type: 'number', name: 'borderRadius', label: 'Border Radius', default: 4, min: 0, max: 16, step: 1, unit: 'px' },
    { type: 'string', name: 'className', label: 'Class Name' },
  ],
} satisfies AnimationMetadata

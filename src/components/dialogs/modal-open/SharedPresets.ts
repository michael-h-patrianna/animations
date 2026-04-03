/**
 * Demo presets for each modal-open animation.
 * Shared between framer/ and css/ variants to prevent drift.
 *
 * Copy-paste files: not needed — demo-only constants.
 */

import type { DemoPreset } from '@/components/dialogs/modal-open/SharedModalOpenLogic'

export const BUBBLE_POP_PRESETS: DemoPreset[] = [
  { label: 'Soy', force: 0.02, duration: 1200, reveal: 35 },
  { label: 'Soft', force: 0.1, duration: 900, reveal: 45 },
  { label: 'Harder', force: 0.6, duration: 550, reveal: 60 },
  { label: 'Daddy', force: 1.0, duration: 380, reveal: 70 },
]

export const COMIC_PUNCH_PRESETS: DemoPreset[] = [
  { label: 'Soy', force: 0.02, duration: 1000, reveal: 45 },
  { label: 'Soft', force: 0.1, duration: 700, reveal: 55 },
  { label: 'Harder', force: 0.6, duration: 480, reveal: 60 },
  { label: 'Daddy', force: 1.0, duration: 350, reveal: 68 },
]

export const FLY_IN_PRESETS: DemoPreset[] = [
  { label: 'Soy', force: 0.02, duration: 1200, reveal: 40 },
  { label: 'Soft', force: 0.1, duration: 900, reveal: 50 },
  { label: 'Harder', force: 0.6, duration: 520, reveal: 65 },
  { label: 'Daddy', force: 1.0, duration: 400, reveal: 72 },
]

export const SLAM_DOWN_PRESETS: DemoPreset[] = [
  { label: 'Soy', force: 0.02, duration: 1100, reveal: 45 },
  { label: 'Soft', force: 0.1, duration: 850, reveal: 55 },
  { label: 'Harder', force: 0.6, duration: 550, reveal: 65 },
  { label: 'Daddy', force: 1.0, duration: 450, reveal: 72 },
]

export const WANTED_POSTER_PRESETS: DemoPreset[] = [
  { label: 'Soy', force: 0.02, duration: 1200, reveal: 30 },
  { label: 'Soft', force: 0.1, duration: 900, reveal: 40 },
  { label: 'Harder', force: 0.6, duration: 550, reveal: 55 },
  { label: 'Daddy', force: 1.0, duration: 380, reveal: 68 },
]

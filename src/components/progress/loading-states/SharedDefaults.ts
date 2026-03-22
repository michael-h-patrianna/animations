/**
 * Default color values for loading-states animations.
 * Extracted to a shared module so animation components stay lint-clean.
 *
 * Consumers override these via props — they never import this file.
 */

// --- Spinners ---
export const SPINNER_DUAL_RING_COLOR = '#ecc3ff'
export const SPINNER_DUAL_RING_SECONDARY = '#c6ff77'

export const SPINNER_GALAXY_COLOR = '#c47ae5'
export const SPINNER_GALAXY_STARS: [string, string] = ['#c6ff77', '#47fff4']

export const SPINNER_ORBITAL_COLOR = '#c47ae5'

// --- Dots ---
export const DOTS_COLOR = '#c47ae5'

// --- Rings ---
export const RING_MULTI_COLORS: [string, string, string] = ['#c47ae5', '#c6ff77', '#47fff4']

export const RING_PROGRESS_COLOR = '#c47ae5'

// --- Skeletons ---
export const SKELETON_BASE_COLOR = 'rgb(236 195 255 / 5%)'
export const SKELETON_SHIMMER_COLOR = 'rgb(236 195 255 / 18%)'

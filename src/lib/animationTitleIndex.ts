/**
 * Animation title index for sidebar search.
 *
 * Consumes a build-time virtual module (`virtual:animation-title-index`)
 * produced by the Vite plugin — no runtime meta file imports.
 */

import { groupTitles } from 'virtual:animation-title-index'

const index = groupTitles

/**
 * Returns the count of animations in a group whose title matches the query.
 * Case-insensitive substring match.
 */
export function countMatchingAnimations(baseGroupId: string, query: string): number {
  const entries = index[baseGroupId]
  if (!entries || query === '') return 0
  const lower = query.toLowerCase()
  return entries.filter((e) => e.title.toLowerCase().includes(lower)).length
}

import '@/components/lazyBootstrap'
import { getLoadedGroupAnimations } from '@/lib/lazyGroupRegistry'
import type { AnimationExport } from '@/types/animation'

/**
 * Returns the AnimationExport map for a specific group and tech variant.
 * Synchronous — returns empty object if not yet loaded.
 *
 * @param baseGroupId - Base group ID without tech suffix (e.g., 'modal-base')
 * @param tech - Technology variant ('framer' or 'css')
 * @returns AnimationExport map (empty if not yet loaded)
 */
export function getGroupAnimations(
  baseGroupId: string,
  tech: 'framer' | 'css'
): Record<string, AnimationExport> {
  const groupId = `${baseGroupId}-${tech}`
  return getLoadedGroupAnimations(groupId)
}

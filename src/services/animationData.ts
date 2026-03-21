import { categories } from '@/components/animationRegistry'
import type { Animation, AnimationExport, Category, Group, GroupMetadata } from '@/types/animation'

/**
 * Maps raw AnimationExport entries into UI-friendly Animation objects for a single tech variant.
 */
function toAnimations(
  exports: Record<string, AnimationExport>,
  categoryId: string,
  groupId: string
): Animation[] {
  return Object.values(exports).map((anim) => ({
    id: anim.metadata.id,
    title: anim.metadata.title,
    description: anim.metadata.description,
    categoryId,
    groupId,
    tags: anim.metadata.tags,
    disableReplay: anim.metadata.disableReplay,
    infinite: anim.metadata.infinite,
    controls: anim.metadata.controls,
    prizeCountMax: anim.metadata.prizeCountMax,
  }))
}

/**
 * Creates a UI Group from a tech variant if it has any animations.
 */
function toGroup(
  groupMeta: GroupMetadata,
  tech: 'framer' | 'css',
  exports: Record<string, AnimationExport>,
  categoryId: string
): Group | null {
  const animations = toAnimations(exports, categoryId, `${groupMeta.id}-${tech}`)
  if (animations.length === 0) return null

  return {
    id: `${groupMeta.id}-${tech}`,
    title: `${groupMeta.title} (${tech === 'framer' ? 'Framer' : 'CSS'})`,
    tech,
    demo: groupMeta.demo,
    animations,
  }
}

/**
 * Builds the animation catalog from category exports.
 * Creates two separate groups per logical group: one for Framer, one for CSS.
 *
 * This is a pure, synchronous function — the catalog is derived entirely from
 * static imports aggregated in `animationRegistry.ts`.
 */
export function buildCatalog(): Category[] {
  return Object.values(categories).map((cat) => ({
    id: cat.metadata.id,
    title: cat.metadata.title,
    groups: Object.values(cat.groups).flatMap((group) => {
      const framer = toGroup(group.metadata, 'framer', group.framer, cat.metadata.id)
      const css = toGroup(group.metadata, 'css', group.css, cat.metadata.id)
      return [framer, css].filter((g): g is Group => g !== null)
    }),
  }))
}

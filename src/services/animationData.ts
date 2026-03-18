import { categories } from '@/components/animationRegistry'
import type { Category, Group } from '@/types/animation'

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
      const framerAnimations = Object.values(group.framer)
      const cssAnimations = Object.values(group.css)
      const result: Group[] = []

      if (framerAnimations.length > 0) {
        result.push({
          id: `${group.metadata.id}-framer`,
          title: `${group.metadata.title} (Framer)`,
          tech: 'framer',
          demo: group.metadata.demo,
          animations: framerAnimations.map((anim) => ({
            id: anim.metadata.id,
            title: anim.metadata.title,
            description: anim.metadata.description,
            categoryId: cat.metadata.id,
            groupId: `${group.metadata.id}-framer`,
            tags: anim.metadata.tags,
            disableReplay: anim.metadata.disableReplay,
            infinite: anim.metadata.infinite,
            controls: anim.metadata.controls,
            prizeCountMax: anim.metadata.prizeCountMax,
          })),
        })
      }

      if (cssAnimations.length > 0) {
        result.push({
          id: `${group.metadata.id}-css`,
          title: `${group.metadata.title} (CSS)`,
          tech: 'css',
          demo: group.metadata.demo,
          animations: cssAnimations.map((anim) => ({
            id: anim.metadata.id,
            title: anim.metadata.title,
            description: anim.metadata.description,
            categoryId: cat.metadata.id,
            groupId: `${group.metadata.id}-css`,
            tags: anim.metadata.tags,
            disableReplay: anim.metadata.disableReplay,
            infinite: anim.metadata.infinite,
            controls: anim.metadata.controls,
            prizeCountMax: anim.metadata.prizeCountMax,
          })),
        })
      }

      return result
    }),
  }))
}

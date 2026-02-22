import { categories } from '@/components/animationRegistry'
import type {
  Category,
  Group,
} from '@/types/animation'

/**
 * Builds catalog from category exports.
 * Creates TWO separate groups for each logical group: one for Framer, one for CSS.
 */
const buildCatalogFromCategories = (): Category[] => {
  return Object.values(categories).map(cat => ({
    id: cat.metadata.id,
    title: cat.metadata.title,
    groups: Object.values(cat.groups).flatMap(group => {
      const framerAnimations = Object.values(group.framer)
      const cssAnimations = Object.values(group.css)
      const result: Group[] = []

      // Add Framer group if it has animations
      if (framerAnimations.length > 0) {
        result.push({
          id: `${group.metadata.id}-framer`,
          title: `${group.metadata.title} (Framer)`,
          tech: 'framer',
          demo: group.metadata.demo,
          animations: framerAnimations.map(anim => ({
            id: anim.metadata.id,
            title: anim.metadata.title,
            description: anim.metadata.description,
            categoryId: cat.metadata.id,
            groupId: `${group.metadata.id}-framer`,
            tags: anim.metadata.tags,
            disableReplay: anim.metadata.disableReplay,
          })),
        })
      }

      // Add CSS group if it has animations
      if (cssAnimations.length > 0) {
        result.push({
          id: `${group.metadata.id}-css`,
          title: `${group.metadata.title} (CSS)`,
          tech: 'css',
          demo: group.metadata.demo,
          animations: cssAnimations.map(anim => ({
            id: anim.metadata.id,
            title: anim.metadata.title,
            description: anim.metadata.description,
            categoryId: cat.metadata.id,
            groupId: `${group.metadata.id}-css`,
            tags: anim.metadata.tags,
            disableReplay: anim.metadata.disableReplay,
          })),
        })
      }

      return result
    }),
  }))
}

class AnimationDataService {
  private catalog: Category[] | null = null

  private ensureCatalog(): Category[] {
    if (!this.catalog) {
      this.catalog = buildCatalogFromCategories()
    }
    return this.catalog
  }

  async loadAnimations(): Promise<Category[]> {
    return this.ensureCatalog()
  }

  async refreshCatalog(): Promise<Category[]> {
    this.catalog = buildCatalogFromCategories()
    return this.catalog
  }
}

export const animationDataService = new AnimationDataService()

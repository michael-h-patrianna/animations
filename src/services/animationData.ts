import { categories } from '@/components/animationRegistry'
import type {
  Animation,
  Category,
} from '@/types/animation'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
      const result = []

      // Add Framer group if it has animations
      if (framerAnimations.length > 0) {
        result.push({
          id: `${group.metadata.id}-framer`,
          title: `${group.metadata.title} (Framer)`,
          tech: group.metadata.tech,
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
          tech: group.metadata.tech,
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

/**
 * Builds catalog with additional animations merged in.
 *
 * @param additionalAnimations - Additional animations to merge
 */
const buildCatalogWithExtras = (additionalAnimations: Animation[]): Category[] => {
  const baseCatalog = buildCatalogFromCategories()

  // Merge with additional animations if any
  if (additionalAnimations.length > 0) {
    const catalogCopy = baseCatalog.map(cat => ({
      ...cat,
      groups: cat.groups.map(grp => ({
        ...grp,
        animations: [...grp.animations]
      }))
    }))

    additionalAnimations.forEach(anim => {
      const category = catalogCopy.find(c => c.id === anim.categoryId)
      if (category) {
        const group = category.groups.find(g => g.id === anim.groupId)
        if (group) {
          group.animations.push(anim)
        }
      }
    })

    return catalogCopy
  }

  return baseCatalog
}

class AnimationDataService {
  private catalog: Category[] | null = null
  private readonly extraAnimations: Animation[] = []

  private async ensureCatalog(): Promise<Category[]> {
    // Build catalog if it doesn't exist
    if (!this.catalog) {
      this.catalog = buildCatalogWithExtras(this.extraAnimations)
    }

    return this.catalog
  }

  async loadAnimations(): Promise<Category[]> {
    await delay(120)
    return this.ensureCatalog()
  }

  async refreshCatalog(): Promise<Category[]> {
    await delay(60)
    this.catalog = buildCatalogWithExtras(this.extraAnimations)
    return this.catalog
  }

  async addAnimation(animation: Omit<Animation, 'id'>): Promise<Animation> {
    const newAnimation: Animation = {
      ...animation,
      id: `${animation.groupId}__${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    }

    this.extraAnimations.push(newAnimation)

    if (this.catalog) {
      const category = this.catalog.find((entry) => entry.id === newAnimation.categoryId)
      const group = category?.groups.find((entry) => entry.id === newAnimation.groupId)

      if (group) {
        group.animations = [...group.animations, newAnimation]
      }
    }

    return newAnimation
  }

  async getAnimationsByGroup(categoryId: string, groupId: string): Promise<Animation[]> {
    const catalog = await this.ensureCatalog()
    const category = catalog.find((entry) => entry.id === categoryId)
    const group = category?.groups.find((entry) => entry.id === groupId)

    return group ? [...group.animations] : []
  }
}

export const animationDataService = new AnimationDataService()

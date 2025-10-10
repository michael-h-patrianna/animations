import { categories } from '@/components/animationRegistry'
import type { CodeMode } from '@/contexts/CodeModeContext'
import type {
  Animation,
  Category,
} from '@/types/animation'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Builds catalog from category exports.
 * This is the primary data source, reading from component-based metadata.
 *
 * @param codeMode - The code mode to filter animations by ('Framer' or 'CSS')
 */
const buildCatalogFromCategories = (codeMode: CodeMode = 'Framer'): Category[] => {
  const animationSource = codeMode === 'CSS' ? 'css' : 'framer'

  return Object.values(categories).map(cat => ({
    id: cat.metadata.id,
    title: cat.metadata.title,
    groups: Object.values(cat.groups).map(group => ({
      id: group.metadata.id,
      title: group.metadata.title,
      tech: group.metadata.tech,
      demo: group.metadata.demo,
      animations: Object.values(group[animationSource]).map(anim => ({
        id: anim.metadata.id,
        title: anim.metadata.title,
        description: anim.metadata.description,
        categoryId: cat.metadata.id,
        groupId: group.metadata.id,
        tags: anim.metadata.tags,
        disableReplay: anim.metadata.disableReplay,
      })),
    })),
  }))
}

/**
 * Builds catalog with additional animations merged in.
 *
 * @param additionalAnimations - Additional animations to merge
 * @param codeMode - The code mode to filter animations by ('Framer' or 'CSS')
 */
const buildCatalogWithExtras = (additionalAnimations: Animation[], codeMode: CodeMode = 'Framer'): Category[] => {
  const baseCatalog = buildCatalogFromCategories(codeMode)

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
  private currentCodeMode: CodeMode = 'Framer'

  private async ensureCatalog(codeMode?: CodeMode): Promise<Category[]> {
    const mode = codeMode ?? this.currentCodeMode

    // Rebuild catalog if code mode changed or catalog doesn't exist
    if (!this.catalog || mode !== this.currentCodeMode) {
      this.currentCodeMode = mode
      this.catalog = buildCatalogWithExtras(this.extraAnimations, mode)
    }

    return this.catalog
  }

  async loadAnimations(codeMode?: CodeMode): Promise<Category[]> {
    await delay(120)
    return this.ensureCatalog(codeMode)
  }

  async refreshCatalog(codeMode?: CodeMode): Promise<Category[]> {
    await delay(60)
    const mode = codeMode ?? this.currentCodeMode
    this.currentCodeMode = mode
    this.catalog = buildCatalogWithExtras(this.extraAnimations, mode)
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

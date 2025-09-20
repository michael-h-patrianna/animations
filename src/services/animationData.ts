import structureData from '../../docs/structure.json';
import type {
  Animation,
  Category,
  CategoryMeta,
  Group,
  GroupMeta,
  StructureData
} from '@/types/animation';

const STRUCTURE: StructureData = structureData;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const cloneAnimation = (animation: Animation): Animation => ({ ...animation });

const buildGroups = (category: CategoryMeta, animations: Animation[]): Group[] => {
  const groupsMeta: GroupMeta[] = category.groups ?? [];

  return groupsMeta.map((groupMeta) => {
    const groupAnimations = animations.filter(
      (animation) =>
        animation.categoryId === category.id && animation.groupId === groupMeta.id
    );

    return {
      ...groupMeta,
      animations: groupAnimations
    };
  });
};

const mapStructureToCatalog = (
  structure: StructureData,
  additionalAnimations: Animation[]
): Category[] => {
  const combinedAnimations = [
    ...structure.animations.map(cloneAnimation),
    ...additionalAnimations.map(cloneAnimation)
  ];

  return structure.categories.map((category) => ({
    id: category.id,
    title: category.title,
    groups: buildGroups(category, combinedAnimations)
  }));
};

class AnimationDataService {
  private catalog: Category[] | null = null;
  private readonly extraAnimations: Animation[] = [];

  private async ensureCatalog(): Promise<Category[]> {
    if (!this.catalog) {
      this.catalog = mapStructureToCatalog(STRUCTURE, this.extraAnimations);
    }

    return this.catalog;
  }

  async loadAnimations(): Promise<Category[]> {
    await delay(120);
    return this.ensureCatalog();
  }

  async refreshCatalog(): Promise<Category[]> {
    await delay(60);
    this.catalog = mapStructureToCatalog(STRUCTURE, this.extraAnimations);
    return this.catalog;
  }

  async addAnimation(animation: Omit<Animation, 'id'>): Promise<Animation> {
    const newAnimation: Animation = {
      ...animation,
      id: `${animation.groupId}__${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    };

    this.extraAnimations.push(newAnimation);

    if (this.catalog) {
      const category = this.catalog.find((entry) => entry.id === newAnimation.categoryId);
      const group = category?.groups.find((entry) => entry.id === newAnimation.groupId);

      if (group) {
        group.animations = [...group.animations, newAnimation];
      }
    }

    return newAnimation;
  }

  async getAnimationsByGroup(categoryId: string, groupId: string): Promise<Animation[]> {
    const catalog = await this.ensureCatalog();
    const category = catalog.find((entry) => entry.id === categoryId);
    const group = category?.groups.find((entry) => entry.id === groupId);

    return group ? [...group.animations] : [];
  }
}

export const animationDataService = new AnimationDataService();

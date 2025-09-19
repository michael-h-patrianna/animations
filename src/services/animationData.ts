import type { AnimationData, Category, Animation } from '@/types/animation';

// Initial categories - can be extended or loaded from API
const INITIAL_CATEGORIES = [
  { id: "dialogs", title: "Dialog & Modal Animations" },
  { id: "progress", title: "Progress & Loading Animations" },
  { id: "realtime", title: "Real-time Updates & Timers" },
  { id: "rewards", title: "Game Elements & Rewards" },
  { id: "navigation", title: "Navigation & Layout" },
  { id: "micro", title: "Micro-interactions" },
  { id: "data", title: "Data Visualization" },
  { id: "ambient", title: "Special Effects & Atmosphere" }
];

// Animation data service - easily replaceable with API calls
class AnimationDataService {
  private data: AnimationData = {
    categories: INITIAL_CATEGORIES,
    animations: [] // Will be populated as animations are added
  };

  async loadAnimations(): Promise<Category[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Group animations by category
    const categoriesWithAnimations = this.data.categories.map(category => ({
      ...category,
      animations: this.data.animations.filter(animation => 
        animation.categoryId === category.id
      )
    }));

    return categoriesWithAnimations;
  }

  async addAnimation(animation: Omit<Animation, 'id'>): Promise<void> {
    const newAnimation: Animation = {
      ...animation,
      id: `${animation.categoryId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.data.animations.push(newAnimation);
  }

  async getAnimationsByCategory(categoryId: string): Promise<Animation[]> {
    return this.data.animations.filter(animation => 
      animation.categoryId === categoryId
    );
  }

  // Method to replace data source (for future API integration)
  async loadFromSource(source: 'local' | 'api' | 'file' = 'local'): Promise<AnimationData> {
    switch (source) {
      case 'api':
        // Future: load from API
        throw new Error('API integration not implemented yet');
      case 'file':
        // Future: load from external file
        throw new Error('File loading not implemented yet');
      case 'local':
      default:
        return this.data;
    }
  }
}

// Export singleton instance
export const animationDataService = new AnimationDataService();

// Export type for component use
export type { AnimationData };
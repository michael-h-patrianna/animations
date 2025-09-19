export interface Animation {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  groupId?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  title: string;
  animations: Animation[];
}

export interface AnimationData {
  categories: Omit<Category, 'animations'>[];
  animations: Animation[];
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

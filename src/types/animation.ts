import type { ReactElement } from 'react';

export interface Animation {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  groupId: string;
  tags?: string[];
  disableReplay?: boolean; // when true, the AnimationCard should disable the replay button
}

export interface Group {
  id: string;
  title: string;
  tech?: string;
  demo?: string;
  animations: Animation[];
}

export interface Category {
  id: string;
  title: string;
  groups: Group[];
}

export interface GroupMeta {
  id: string;
  title: string;
  tech?: string;
  demo?: string;
}

export interface CategoryMeta {
  id: string;
  title: string;
  groups?: GroupMeta[];
}

export interface StructureData {
  categories: CategoryMeta[];
  animations: Animation[];
}

export type AnimationComponent = () => ReactElement;
export type AnimationComponentMap = Record<string, AnimationComponent>;

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

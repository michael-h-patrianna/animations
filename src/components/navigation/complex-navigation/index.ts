import type { AnimationComponentMap } from '@/types/animation';

import { ComplexNavigationNavGesture } from './ComplexNavigationNavGesture';
import { ComplexNavigationNavMorph } from './ComplexNavigationNavMorph';
import { ComplexNavigationNavOrbit } from './ComplexNavigationNavOrbit';
import { ComplexNavigationNavParallax } from './ComplexNavigationNavParallax';
import { ComplexNavigationNavSpotlight } from './ComplexNavigationNavSpotlight';
import { ComplexNavigationNavSticky } from './ComplexNavigationNavSticky';

export { ComplexNavigationNavGesture } from './ComplexNavigationNavGesture';
export { ComplexNavigationNavMorph } from './ComplexNavigationNavMorph';
export { ComplexNavigationNavOrbit } from './ComplexNavigationNavOrbit';
export { ComplexNavigationNavParallax } from './ComplexNavigationNavParallax';
export { ComplexNavigationNavSpotlight } from './ComplexNavigationNavSpotlight';
export { ComplexNavigationNavSticky } from './ComplexNavigationNavSticky';

export const navigationComplexNavigationAnimations: AnimationComponentMap = {
  'complex-navigation__nav-gesture': ComplexNavigationNavGesture,
  'complex-navigation__nav-morph': ComplexNavigationNavMorph,
  'complex-navigation__nav-orbit': ComplexNavigationNavOrbit,
  'complex-navigation__nav-parallax': ComplexNavigationNavParallax,
  'complex-navigation__nav-spotlight': ComplexNavigationNavSpotlight,
  'complex-navigation__nav-sticky': ComplexNavigationNavSticky
};

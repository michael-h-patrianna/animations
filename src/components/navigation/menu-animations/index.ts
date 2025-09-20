import type { AnimationComponentMap } from '@/types/animation';

import { MenuAnimationsBreadcrumbFlare } from './MenuAnimationsBreadcrumbFlare';
import { MenuAnimationsBreadcrumbSlide } from './MenuAnimationsBreadcrumbSlide';
import { MenuAnimationsMenuDrawerScale } from './MenuAnimationsMenuDrawerScale';
import { MenuAnimationsMenuDrawerSlide } from './MenuAnimationsMenuDrawerSlide';
import { MenuAnimationsMenuDropdown } from './MenuAnimationsMenuDropdown';
import { MenuAnimationsMenuDropdownSoft } from './MenuAnimationsMenuDropdownSoft';
import { MenuAnimationsMenuTabGlide } from './MenuAnimationsMenuTabGlide';
import { MenuAnimationsMenuTabInk } from './MenuAnimationsMenuTabInk';
import { MenuAnimationsMobileMenuTransform } from './MenuAnimationsMobileMenuTransform';
import { MenuAnimationsNavHover } from './MenuAnimationsNavHover';
import { MenuAnimationsSidebarFloating } from './MenuAnimationsSidebarFloating';
import { MenuAnimationsSidebarReveal } from './MenuAnimationsSidebarReveal';

export { MenuAnimationsBreadcrumbFlare } from './MenuAnimationsBreadcrumbFlare';
export { MenuAnimationsBreadcrumbSlide } from './MenuAnimationsBreadcrumbSlide';
export { MenuAnimationsMenuDrawerScale } from './MenuAnimationsMenuDrawerScale';
export { MenuAnimationsMenuDrawerSlide } from './MenuAnimationsMenuDrawerSlide';
export { MenuAnimationsMenuDropdown } from './MenuAnimationsMenuDropdown';
export { MenuAnimationsMenuDropdownSoft } from './MenuAnimationsMenuDropdownSoft';
export { MenuAnimationsMenuTabGlide } from './MenuAnimationsMenuTabGlide';
export { MenuAnimationsMenuTabInk } from './MenuAnimationsMenuTabInk';
export { MenuAnimationsMobileMenuTransform } from './MenuAnimationsMobileMenuTransform';
export { MenuAnimationsNavHover } from './MenuAnimationsNavHover';
export { MenuAnimationsSidebarFloating } from './MenuAnimationsSidebarFloating';
export { MenuAnimationsSidebarReveal } from './MenuAnimationsSidebarReveal';

export const navigationMenuAnimationsAnimations: AnimationComponentMap = {
  'menu-animations__breadcrumb-flare': MenuAnimationsBreadcrumbFlare,
  'menu-animations__breadcrumb-slide': MenuAnimationsBreadcrumbSlide,
  'menu-animations__menu-drawer-scale': MenuAnimationsMenuDrawerScale,
  'menu-animations__menu-drawer-slide': MenuAnimationsMenuDrawerSlide,
  'menu-animations__menu-dropdown': MenuAnimationsMenuDropdown,
  'menu-animations__menu-dropdown-soft': MenuAnimationsMenuDropdownSoft,
  'menu-animations__menu-tab-glide': MenuAnimationsMenuTabGlide,
  'menu-animations__menu-tab-ink': MenuAnimationsMenuTabInk,
  'menu-animations__mobile-menu-transform': MenuAnimationsMobileMenuTransform,
  'menu-animations__nav-hover': MenuAnimationsNavHover,
  'menu-animations__sidebar-floating': MenuAnimationsSidebarFloating,
  'menu-animations__sidebar-reveal': MenuAnimationsSidebarReveal
};

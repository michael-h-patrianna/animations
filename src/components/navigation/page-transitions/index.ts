import type { AnimationComponentMap } from '@/types/animation';

import { PageTransitionsHeroParallax } from './PageTransitionsHeroParallax';
import { PageTransitionsLazyEntrance } from './PageTransitionsLazyEntrance';
import { PageTransitionsLazyFade } from './PageTransitionsLazyFade';
import { PageTransitionsPageFade } from './PageTransitionsPageFade';
import { PageTransitionsPageScale } from './PageTransitionsPageScale';
import { PageTransitionsPageSlideRight } from './PageTransitionsPageSlideRight';
import { PageTransitionsPageSlideUp } from './PageTransitionsPageSlideUp';
import { PageTransitionsPageWipe } from './PageTransitionsPageWipe';
import { PageTransitionsScrollRevealBurst } from './PageTransitionsScrollRevealBurst';
import { PageTransitionsScrollRevealSoft } from './PageTransitionsScrollRevealSoft';
import { PageTransitionsSectionReveal } from './PageTransitionsSectionReveal';
import { PageTransitionsSectionRise } from './PageTransitionsSectionRise';

export { PageTransitionsHeroParallax } from './PageTransitionsHeroParallax';
export { PageTransitionsLazyEntrance } from './PageTransitionsLazyEntrance';
export { PageTransitionsLazyFade } from './PageTransitionsLazyFade';
export { PageTransitionsPageFade } from './PageTransitionsPageFade';
export { PageTransitionsPageScale } from './PageTransitionsPageScale';
export { PageTransitionsPageSlideRight } from './PageTransitionsPageSlideRight';
export { PageTransitionsPageSlideUp } from './PageTransitionsPageSlideUp';
export { PageTransitionsPageWipe } from './PageTransitionsPageWipe';
export { PageTransitionsScrollRevealBurst } from './PageTransitionsScrollRevealBurst';
export { PageTransitionsScrollRevealSoft } from './PageTransitionsScrollRevealSoft';
export { PageTransitionsSectionReveal } from './PageTransitionsSectionReveal';
export { PageTransitionsSectionRise } from './PageTransitionsSectionRise';

export const navigationPageTransitionsAnimations: AnimationComponentMap = {
  'page-transitions__hero-parallax': PageTransitionsHeroParallax,
  'page-transitions__lazy-entrance': PageTransitionsLazyEntrance,
  'page-transitions__lazy-fade': PageTransitionsLazyFade,
  'page-transitions__page-fade': PageTransitionsPageFade,
  'page-transitions__page-scale': PageTransitionsPageScale,
  'page-transitions__page-slide-right': PageTransitionsPageSlideRight,
  'page-transitions__page-slide-up': PageTransitionsPageSlideUp,
  'page-transitions__page-wipe': PageTransitionsPageWipe,
  'page-transitions__scroll-reveal-burst': PageTransitionsScrollRevealBurst,
  'page-transitions__scroll-reveal-soft': PageTransitionsScrollRevealSoft,
  'page-transitions__section-reveal': PageTransitionsSectionReveal,
  'page-transitions__section-rise': PageTransitionsSectionRise
};

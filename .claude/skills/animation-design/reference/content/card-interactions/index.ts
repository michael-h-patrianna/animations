import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Metadata
import { metadata as borderGradientMetaFramer } from './framer/CardInteractionsBorderGradient.meta'
import { metadata as neonGlowMetaFramer } from './framer/CardInteractionsNeonGlow.meta'
import { metadata as tilt3DMetaFramer } from './framer/CardInteractionsTilt3D.meta'
import { metadata as flip3DMetaFramer } from './framer/CardInteractionsFlip3D.meta'
import { metadata as contentSlideUpMetaFramer } from './framer/CardInteractionsContentSlideUp.meta'
import { metadata as spotlightMetaFramer } from './framer/CardInteractionsSpotlight.meta'
import { metadata as sheenSweepMetaFramer } from './framer/CardInteractionsSheenSweep.meta'
import { metadata as floatingBadgeMetaFramer } from './framer/CardInteractionsFloatingBadge.meta'
import { metadata as scaleClickMetaFramer } from './framer/CardInteractionsScaleClick.meta'

// CSS Metadata
import { metadata as borderGradientMetaCss } from './css/CardInteractionsBorderGradient.meta'
import { metadata as neonGlowMetaCss } from './css/CardInteractionsNeonGlow.meta'
import { metadata as tilt3DMetaCss } from './css/CardInteractionsTilt3D.meta'
import { metadata as flip3DMetaCss } from './css/CardInteractionsFlip3D.meta'
import { metadata as contentSlideUpMetaCss } from './css/CardInteractionsContentSlideUp.meta'
import { metadata as spotlightMetaCss } from './css/CardInteractionsSpotlight.meta'
import { metadata as sheenSweepMetaCss } from './css/CardInteractionsSheenSweep.meta'
import { metadata as floatingBadgeMetaCss } from './css/CardInteractionsFloatingBadge.meta'
import { metadata as scaleClickMetaCss } from './css/CardInteractionsScaleClick.meta'

// Framer Components
const BorderGradientFramer = lazy(() => import('./framer/CardInteractionsBorderGradient').then(m => ({ default: m.CardInteractionsBorderGradient })))
const NeonGlowFramer = lazy(() => import('./framer/CardInteractionsNeonGlow').then(m => ({ default: m.CardInteractionsNeonGlow })))
const Tilt3DFramer = lazy(() => import('./framer/CardInteractionsTilt3D').then(m => ({ default: m.CardInteractionsTilt3D })))
const Flip3DFramer = lazy(() => import('./framer/CardInteractionsFlip3D').then(m => ({ default: m.CardInteractionsFlip3D })))
const ContentSlideUpFramer = lazy(() => import('./framer/CardInteractionsContentSlideUp').then(m => ({ default: m.CardInteractionsContentSlideUp })))
const SpotlightFramer = lazy(() => import('./framer/CardInteractionsSpotlight').then(m => ({ default: m.CardInteractionsSpotlight })))
const SheenSweepFramer = lazy(() => import('./framer/CardInteractionsSheenSweep').then(m => ({ default: m.CardInteractionsSheenSweep })))
const FloatingBadgeFramer = lazy(() => import('./framer/CardInteractionsFloatingBadge').then(m => ({ default: m.CardInteractionsFloatingBadge })))
const ScaleClickFramer = lazy(() => import('./framer/CardInteractionsScaleClick').then(m => ({ default: m.CardInteractionsScaleClick })))

// CSS Components
const BorderGradientCss = lazy(() => import('./css/CardInteractionsBorderGradient').then(m => ({ default: m.CardInteractionsBorderGradient })))
const NeonGlowCss = lazy(() => import('./css/CardInteractionsNeonGlow').then(m => ({ default: m.CardInteractionsNeonGlow })))
const Tilt3DCss = lazy(() => import('./css/CardInteractionsTilt3D').then(m => ({ default: m.CardInteractionsTilt3D })))
const Flip3DCss = lazy(() => import('./css/CardInteractionsFlip3D').then(m => ({ default: m.CardInteractionsFlip3D })))
const ContentSlideUpCss = lazy(() => import('./css/CardInteractionsContentSlideUp').then(m => ({ default: m.CardInteractionsContentSlideUp })))
const SpotlightCss = lazy(() => import('./css/CardInteractionsSpotlight').then(m => ({ default: m.CardInteractionsSpotlight })))
const SheenSweepCss = lazy(() => import('./css/CardInteractionsSheenSweep').then(m => ({ default: m.CardInteractionsSheenSweep })))
const FloatingBadgeCss = lazy(() => import('./css/CardInteractionsFloatingBadge').then(m => ({ default: m.CardInteractionsFloatingBadge })))
const ScaleClickCss = lazy(() => import('./css/CardInteractionsScaleClick').then(m => ({ default: m.CardInteractionsScaleClick })))

export const groupMetadata: GroupMetadata = {
  id: 'card-interactions',
  title: 'Card Interactions',
  tech: 'framer',
  demo: 'Interactive hover and click effects for modern card UI.',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'card-interactions__border-gradient': { component: BorderGradientFramer, metadata: borderGradientMetaFramer },
    'card-interactions__neon-glow': { component: NeonGlowFramer, metadata: neonGlowMetaFramer },
    'card-interactions__tilt-3d': { component: Tilt3DFramer, metadata: tilt3DMetaFramer },
    'card-interactions__flip-3d': { component: Flip3DFramer, metadata: flip3DMetaFramer },
    'card-interactions__content-slide-up': { component: ContentSlideUpFramer, metadata: contentSlideUpMetaFramer },
    'card-interactions__spotlight': { component: SpotlightFramer, metadata: spotlightMetaFramer },
    'card-interactions__sheen-sweep': { component: SheenSweepFramer, metadata: sheenSweepMetaFramer },
    'card-interactions__floating-badge': { component: FloatingBadgeFramer, metadata: floatingBadgeMetaFramer },
    'card-interactions__scale-click': { component: ScaleClickFramer, metadata: scaleClickMetaFramer },
  },
  css: {
    'card-interactions__border-gradient': { component: BorderGradientCss, metadata: borderGradientMetaCss },
    'card-interactions__neon-glow': { component: NeonGlowCss, metadata: neonGlowMetaCss },
    'card-interactions__tilt-3d': { component: Tilt3DCss, metadata: tilt3DMetaCss },
    'card-interactions__flip-3d': { component: Flip3DCss, metadata: flip3DMetaCss },
    'card-interactions__content-slide-up': { component: ContentSlideUpCss, metadata: contentSlideUpMetaCss },
    'card-interactions__spotlight': { component: SpotlightCss, metadata: spotlightMetaCss },
    'card-interactions__sheen-sweep': { component: SheenSweepCss, metadata: sheenSweepMetaCss },
    'card-interactions__floating-badge': { component: FloatingBadgeCss, metadata: floatingBadgeMetaCss },
    'card-interactions__scale-click': { component: ScaleClickCss, metadata: scaleClickMetaCss },
  },
}
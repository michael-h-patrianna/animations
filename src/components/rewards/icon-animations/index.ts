import { IconAnimationsShake, metadata as shakeMetadata } from './framer/IconAnimationsShake'
import { IconAnimationsBounce, metadata as bounceMetadata } from './framer/IconAnimationsBounce'
import { IconAnimationsFloat, metadata as floatMetadata } from './framer/IconAnimationsFloat'
import { IconAnimationsPulse, metadata as pulseMetadata } from './framer/IconAnimationsPulse'

// CSS animations
import { IconAnimationsBounce as CssIconAnimationsBounce, metadata as bounceCssMetadata } from './css/IconAnimationsBounce'
import { IconAnimationsFloat as CssIconAnimationsFloat, metadata as floatCssMetadata } from './css/IconAnimationsFloat'
import { IconAnimationsPulse as CssIconAnimationsPulse, metadata as pulseCssMetadata } from './css/IconAnimationsPulse'
import { IconAnimationsShake as CssIconAnimationsShake, metadata as shakeCssMetadata } from './css/IconAnimationsShake'
import type { GroupMetadata, GroupExport } from '@/types/animation'


export const groupMetadata: GroupMetadata = {
  id: 'icon-animations',
  title: 'Icon animations',
  tech: 'css',
  demo: 'iconAnimations',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'icon-animations__shake': { component: IconAnimationsShake, metadata: shakeMetadata },
    'icon-animations__bounce': { component: IconAnimationsBounce, metadata: bounceMetadata },
    'icon-animations__float': { component: IconAnimationsFloat, metadata: floatMetadata },
    'icon-animations__pulse': { component: IconAnimationsPulse, metadata: pulseMetadata },
  },
  css: {
    'icon-animations__shake': { component: CssIconAnimationsShake, metadata: shakeCssMetadata },
    'icon-animations__bounce': { component: CssIconAnimationsBounce, metadata: bounceCssMetadata },
    'icon-animations__float': { component: CssIconAnimationsFloat, metadata: floatCssMetadata },
    'icon-animations__pulse': { component: CssIconAnimationsPulse, metadata: pulseCssMetadata },
  },
}

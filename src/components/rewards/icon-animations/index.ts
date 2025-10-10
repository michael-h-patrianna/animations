import { IconAnimationsShake, metadata as shakeMetadata } from './framer/IconAnimationsShake'
import { IconAnimationsBounce, metadata as bounceMetadata } from './framer/IconAnimationsBounce'
import { IconAnimationsFloat, metadata as floatMetadata } from './framer/IconAnimationsFloat'
import { IconAnimationsPulse, metadata as pulseMetadata } from './framer/IconAnimationsPulse'
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
  css: {},
}

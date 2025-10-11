import LightsCircleStatic1, { metadata as metadata1 } from './framer/LightsCircleStatic1'
import LightsCircleStatic2, { metadata as metadata2 } from './framer/LightsCircleStatic2'
import LightsCircleStatic3, { metadata as metadata3 } from './framer/LightsCircleStatic3'
import LightsCircleStatic4, { metadata as metadata4 } from './framer/LightsCircleStatic4'
import LightsCircleStatic5, { metadata as metadata5 } from './framer/LightsCircleStatic5'
import LightsCircleStatic6, { metadata as metadata6 } from './framer/LightsCircleStatic6'
import LightsCircleStatic7, { metadata as metadata7 } from './framer/LightsCircleStatic7'
import LightsCircleStatic8, { metadata as metadata8 } from './framer/LightsCircleStatic8'

// CSS animations
import CssLightsCircleStatic1, { metadata as cssMetadata1 } from './css/LightsCircleStatic1'
import CssLightsCircleStatic2, { metadata as cssMetadata2 } from './css/LightsCircleStatic2'
import CssLightsCircleStatic3, { metadata as cssMetadata3 } from './css/LightsCircleStatic3'
import CssLightsCircleStatic4, { metadata as cssMetadata4 } from './css/LightsCircleStatic4'
import CssLightsCircleStatic5, { metadata as cssMetadata5 } from './css/LightsCircleStatic5'
import CssLightsCircleStatic6, { metadata as cssMetadata6 } from './css/LightsCircleStatic6'
import CssLightsCircleStatic7, { metadata as cssMetadata7 } from './css/LightsCircleStatic7'
import CssLightsCircleStatic8, { metadata as cssMetadata8 } from './css/LightsCircleStatic8'
import type { GroupMetadata, GroupExport } from '@/types/animation'


export const groupMetadata: GroupMetadata = {
  id: 'lights',
  title: 'Lights',
  tech: 'css',
  demo: 'lights',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'lights__circle-static-1': { component: LightsCircleStatic1, metadata: metadata1 },
    'lights__circle-static-2': { component: LightsCircleStatic2, metadata: metadata2 },
    'lights__circle-static-3': { component: LightsCircleStatic3, metadata: metadata3 },
    'lights__circle-static-4': { component: LightsCircleStatic4, metadata: metadata4 },
    'lights__circle-static-5': { component: LightsCircleStatic5, metadata: metadata5 },
    'lights__circle-static-6': { component: LightsCircleStatic6, metadata: metadata6 },
    'lights__circle-static-7': { component: LightsCircleStatic7, metadata: metadata7 },
    'lights__circle-static-8': { component: LightsCircleStatic8, metadata: metadata8 },
  },
  css: {
    'lights__circle-static-1': { component: CssLightsCircleStatic1, metadata: cssMetadata1 },
    'lights__circle-static-2': { component: CssLightsCircleStatic2, metadata: cssMetadata2 },
    'lights__circle-static-3': { component: CssLightsCircleStatic3, metadata: cssMetadata3 },
    'lights__circle-static-4': { component: CssLightsCircleStatic4, metadata: cssMetadata4 },
    'lights__circle-static-5': { component: CssLightsCircleStatic5, metadata: cssMetadata5 },
    'lights__circle-static-6': { component: CssLightsCircleStatic6, metadata: cssMetadata6 },
    'lights__circle-static-7': { component: CssLightsCircleStatic7, metadata: cssMetadata7 },
    'lights__circle-static-8': { component: CssLightsCircleStatic8, metadata: cssMetadata8 },
  },
}

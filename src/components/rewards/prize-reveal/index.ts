// Framer variant CSS (loaded at group level for no-css-in-motion compliance)
import './shared.css'
import './framer/PrizeRevealPirateChestNoWin.css'
import './framer/PrizeRevealPirateChestWin.css'

import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as pirateChestNoWinMetadata } from './framer/PrizeRevealPirateChestNoWin.meta'
import { metadata as pirateChestWinMetadata } from './framer/PrizeRevealPirateChestWin.meta'

// CSS - Import metadata only
import { metadata as pirateChestNoWinCssMetadata } from './css/PrizeRevealPirateChestNoWin.meta'
import { metadata as pirateChestWinCssMetadata } from './css/PrizeRevealPirateChestWin.meta'

// Framer Motion - Lazy load components
const PrizeRevealPirateChestNoWin = lazy(() =>
  import('./framer/PrizeRevealPirateChestNoWin').then((m) => ({
    default: m.PrizeRevealPirateChestNoWin,
  }))
)
const PrizeRevealPirateChestWin = lazy(() =>
  import('./framer/PrizeRevealPirateChestWin').then((m) => ({
    default: m.PrizeRevealPirateChestWin,
  }))
)

// CSS - Lazy load components
const CssPrizeRevealPirateChestNoWin = lazy(() =>
  import('./css/PrizeRevealPirateChestNoWin').then((m) => ({
    default: m.PrizeRevealPirateChestNoWin,
  }))
)
const CssPrizeRevealPirateChestWin = lazy(() =>
  import('./css/PrizeRevealPirateChestWin').then((m) => ({
    default: m.PrizeRevealPirateChestWin,
  }))
)

export const groupMetadata: GroupMetadata = {
  id: 'prize-reveal',
  title: 'Prize Reveal',
  tech: 'framer',
  demo: 'celebration',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'prize-reveal__pirate-chest-no-win': {
      component: PrizeRevealPirateChestNoWin,
      metadata: pirateChestNoWinMetadata,
    },
    'prize-reveal__pirate-chest-win': {
      component: PrizeRevealPirateChestWin,
      metadata: pirateChestWinMetadata,
    },
  },
  css: {
    'prize-reveal__pirate-chest-no-win': {
      component: CssPrizeRevealPirateChestNoWin,
      metadata: pirateChestNoWinCssMetadata,
    },
    'prize-reveal__pirate-chest-win': {
      component: CssPrizeRevealPirateChestWin,
      metadata: pirateChestWinCssMetadata,
    },
  },
}

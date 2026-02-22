// Framer variant CSS (loaded at group level for no-css-in-motion compliance)
import './shared.css'
import './framer/PrizeRevealPirateChestNoWin.css'
import './framer/PrizeRevealPirateChestWin.css'
import './framer/PrizeRevealChestGcSc.css'
import './framer/PrizeRevealArcanePortal.css'

import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as arcanePortalMetadata } from './framer/PrizeRevealArcanePortal.meta'
import { metadata as chestGcScMetadata } from './framer/PrizeRevealChestGcSc.meta'
import { metadata as pirateChestNoWinMetadata } from './framer/PrizeRevealPirateChestNoWin.meta'
import { metadata as pirateChestWinMetadata } from './framer/PrizeRevealPirateChestWin.meta'

// CSS - Import metadata only
import { metadata as arcanePortalCssMetadata } from './css/PrizeRevealArcanePortal.meta'
import { metadata as chestGcScCssMetadata } from './css/PrizeRevealChestGcSc.meta'
import { metadata as pirateChestNoWinCssMetadata } from './css/PrizeRevealPirateChestNoWin.meta'
import { metadata as pirateChestWinCssMetadata } from './css/PrizeRevealPirateChestWin.meta'

// Framer Motion - Lazy load components
const PrizeRevealArcanePortal = lazy(() =>
  import('./framer/PrizeRevealArcanePortal').then((m) => ({
    default: m.PrizeRevealArcanePortal,
  }))
)
const PrizeRevealChestGcSc = lazy(() =>
  import('./framer/PrizeRevealChestGcSc').then((m) => ({
    default: m.PrizeRevealChestGcSc,
  }))
)
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
const CssPrizeRevealArcanePortal = lazy(() =>
  import('./css/PrizeRevealArcanePortal').then((m) => ({
    default: m.PrizeRevealArcanePortal,
  }))
)
const CssPrizeRevealChestGcSc = lazy(() =>
  import('./css/PrizeRevealChestGcSc').then((m) => ({
    default: m.PrizeRevealChestGcSc,
  }))
)
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
    'prize-reveal__arcane-portal': {
      component: PrizeRevealArcanePortal,
      metadata: arcanePortalMetadata,
    },
    'prize-reveal__chest-gc-sc': {
      component: PrizeRevealChestGcSc,
      metadata: chestGcScMetadata,
    },
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
    'prize-reveal__arcane-portal': {
      component: CssPrizeRevealArcanePortal,
      metadata: arcanePortalCssMetadata,
    },
    'prize-reveal__chest-gc-sc': {
      component: CssPrizeRevealChestGcSc,
      metadata: chestGcScCssMetadata,
    },
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

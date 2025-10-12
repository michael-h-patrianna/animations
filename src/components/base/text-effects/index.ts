import { lazy } from 'react'
import type { GroupExport, GroupMetadata, AnimationMetadata } from '@/types/animation'

// Import metadata only (not components) to avoid loading CSS
import { metadata as characterRevealMeta } from './framer/TextEffectsCharacterReveal.meta'
import { metadata as comboCounterMeta } from './framer/TextEffectsComboCounter.meta'
import { metadata as counterIncrementMeta } from './framer/TextEffectsCounterIncrement.meta'
import { metadata as epicWinMeta } from './framer/TextEffectsEpicWin.meta'
import { metadata as glitchTextMeta } from './framer/TextEffectsGlitchText.meta'
import { metadata as horizonLightPassMeta } from './framer/TextEffectsHorizonLightPass.meta'
import { metadata as levelBreakthroughMeta } from './framer/TextEffectsLevelBreakthrough.meta'
import { metadata as lightSweepDrawMeta } from './framer/TextEffectsLightSweepDraw.meta'
import { metadata as metallicSpecularFlashMeta } from './framer/TextEffectsMetallicSpecularFlash.meta'
import { metadata as typewriterMeta } from './framer/TextEffectsTypewriter.meta'
import { metadata as verbFallMeta } from './framer/TextEffectsVerbFall.meta'
import { metadata as verbFlipMeta } from './framer/TextEffectsVerbFlip.meta'
import { metadata as verbFloatMeta } from './framer/TextEffectsVerbFloat.meta'
import { metadata as verbJogMeta } from './framer/TextEffectsVerbJog.meta'
import { metadata as verbJumpMeta } from './framer/TextEffectsVerbJump.meta'
import { metadata as verbTwirlMeta } from './framer/TextEffectsVerbTwirl.meta'
import { metadata as waveRevealMeta } from './framer/TextEffectsWaveReveal.meta'
import { metadata as waveTextMeta } from './framer/TextEffectsWaveText.meta'
import { metadata as xpNumberPopMeta } from './framer/TextEffectsXpNumberPop.meta'

// Import CSS metadata only
import { metadata as characterRevealCssMeta } from './css/TextEffectsCharacterReveal.meta'
import { metadata as comboCounterCssMeta } from './css/TextEffectsComboCounter.meta'
import { metadata as counterIncrementCssMeta } from './css/TextEffectsCounterIncrement.meta'
import { metadata as epicWinCssMeta } from './css/TextEffectsEpicWin.meta'
import { metadata as glitchTextCssMeta } from './css/TextEffectsGlitchText.meta'
import { metadata as horizonLightPassCssMeta } from './css/TextEffectsHorizonLightPass.meta'
import { metadata as levelBreakthroughCssMeta } from './css/TextEffectsLevelBreakthrough.meta'
import { metadata as lightSweepDrawCssMeta } from './css/TextEffectsLightSweepDraw.meta'
import { metadata as metallicSpecularFlashCssMeta } from './css/TextEffectsMetallicSpecularFlash.meta'
import { metadata as typewriterCssMeta } from './css/TextEffectsTypewriter.meta'
import { metadata as verbFallCssMeta } from './css/TextEffectsVerbFall.meta'
import { metadata as verbFlipCssMeta } from './css/TextEffectsVerbFlip.meta'
import { metadata as verbFloatCssMeta } from './css/TextEffectsVerbFloat.meta'
import { metadata as verbJogCssMeta } from './css/TextEffectsVerbJog.meta'
import { metadata as verbJumpCssMeta } from './css/TextEffectsVerbJump.meta'
import { metadata as verbTwirlCssMeta } from './css/TextEffectsVerbTwirl.meta'
import { metadata as waveRevealCssMeta } from './css/TextEffectsWaveReveal.meta'
import { metadata as waveTextCssMeta } from './css/TextEffectsWaveText.meta'
import { metadata as xpNumberPopCssMeta } from './css/TextEffectsXpNumberPop.meta'

// Lazy load components
const TextEffectsCharacterReveal = lazy(() => import('./framer/TextEffectsCharacterReveal').then(m => ({ default: m.TextEffectsCharacterReveal })))
const TextEffectsComboCounter = lazy(() => import('./framer/TextEffectsComboCounter').then(m => ({ default: m.TextEffectsComboCounter })))
const TextEffectsCounterIncrement = lazy(() => import('./framer/TextEffectsCounterIncrement').then(m => ({ default: m.TextEffectsCounterIncrement })))
const TextEffectsEpicWin = lazy(() => import('./framer/TextEffectsEpicWin').then(m => ({ default: m.TextEffectsEpicWin })))
const TextEffectsGlitchText = lazy(() => import('./framer/TextEffectsGlitchText').then(m => ({ default: m.TextEffectsGlitchText })))
const TextEffectsHorizonLightPass = lazy(() => import('./framer/TextEffectsHorizonLightPass').then(m => ({ default: m.TextEffectsHorizonLightPass })))
const TextEffectsLevelBreakthrough = lazy(() => import('./framer/TextEffectsLevelBreakthrough').then(m => ({ default: m.TextEffectsLevelBreakthrough })))
const TextEffectsLightSweepDraw = lazy(() => import('./framer/TextEffectsLightSweepDraw').then(m => ({ default: m.TextEffectsLightSweepDraw })))
const TextEffectsMetallicSpecularFlash = lazy(() => import('./framer/TextEffectsMetallicSpecularFlash').then(m => ({ default: m.TextEffectsMetallicSpecularFlash })))
const TextEffectsTypewriter = lazy(() => import('./framer/TextEffectsTypewriter').then(m => ({ default: m.TextEffectsTypewriter })))
const TextEffectsVerbFall = lazy(() => import('./framer/TextEffectsVerbFall').then(m => ({ default: m.TextEffectsVerbFall })))
const TextEffectsVerbFlip = lazy(() => import('./framer/TextEffectsVerbFlip').then(m => ({ default: m.TextEffectsVerbFlip })))
const TextEffectsVerbFloat = lazy(() => import('./framer/TextEffectsVerbFloat').then(m => ({ default: m.TextEffectsVerbFloat })))
const TextEffectsVerbJog = lazy(() => import('./framer/TextEffectsVerbJog').then(m => ({ default: m.TextEffectsVerbJog })))
const TextEffectsVerbJump = lazy(() => import('./framer/TextEffectsVerbJump').then(m => ({ default: m.TextEffectsVerbJump })))
const TextEffectsVerbTwirl = lazy(() => import('./framer/TextEffectsVerbTwirl').then(m => ({ default: m.TextEffectsVerbTwirl })))
const TextEffectsWaveReveal = lazy(() => import('./framer/TextEffectsWaveReveal').then(m => ({ default: m.TextEffectsWaveReveal })))
const TextEffectsWaveText = lazy(() => import('./framer/TextEffectsWaveText').then(m => ({ default: m.TextEffectsWaveText })))
const TextEffectsXpNumberPop = lazy(() => import('./framer/TextEffectsXpNumberPop').then(m => ({ default: m.TextEffectsXpNumberPop })))

// Lazy load CSS components
const CssTextEffectsCharacterReveal = lazy(() => import('./css/TextEffectsCharacterReveal').then(m => ({ default: m.TextEffectsCharacterReveal })))
const CssTextEffectsComboCounter = lazy(() => import('./css/TextEffectsComboCounter').then(m => ({ default: m.TextEffectsComboCounter })))
const CssTextEffectsCounterIncrement = lazy(() => import('./css/TextEffectsCounterIncrement').then(m => ({ default: m.TextEffectsCounterIncrement })))
const CssTextEffectsEpicWin = lazy(() => import('./css/TextEffectsEpicWin').then(m => ({ default: m.TextEffectsEpicWin })))
const CssTextEffectsGlitchText = lazy(() => import('./css/TextEffectsGlitchText').then(m => ({ default: m.TextEffectsGlitchText })))
const CssTextEffectsHorizonLightPass = lazy(() => import('./css/TextEffectsHorizonLightPass').then(m => ({ default: m.TextEffectsHorizonLightPass })))
const CssTextEffectsLevelBreakthrough = lazy(() => import('./css/TextEffectsLevelBreakthrough').then(m => ({ default: m.TextEffectsLevelBreakthrough })))
const CssTextEffectsLightSweepDraw = lazy(() => import('./css/TextEffectsLightSweepDraw').then(m => ({ default: m.TextEffectsLightSweepDraw })))
const CssTextEffectsMetallicSpecularFlash = lazy(() => import('./css/TextEffectsMetallicSpecularFlash').then(m => ({ default: m.TextEffectsMetallicSpecularFlash })))
const CssTextEffectsTypewriter = lazy(() => import('./css/TextEffectsTypewriter').then(m => ({ default: m.TextEffectsTypewriter })))
const CssTextEffectsVerbFall = lazy(() => import('./css/TextEffectsVerbFall').then(m => ({ default: m.TextEffectsVerbFall })))
const CssTextEffectsVerbFlip = lazy(() => import('./css/TextEffectsVerbFlip').then(m => ({ default: m.TextEffectsVerbFlip })))
const CssTextEffectsVerbFloat = lazy(() => import('./css/TextEffectsVerbFloat').then(m => ({ default: m.TextEffectsVerbFloat })))
const CssTextEffectsVerbJog = lazy(() => import('./css/TextEffectsVerbJog').then(m => ({ default: m.TextEffectsVerbJog })))
const CssTextEffectsVerbJump = lazy(() => import('./css/TextEffectsVerbJump').then(m => ({ default: m.TextEffectsVerbJump })))
const CssTextEffectsVerbTwirl = lazy(() => import('./css/TextEffectsVerbTwirl').then(m => ({ default: m.TextEffectsVerbTwirl })))
const CssTextEffectsWaveReveal = lazy(() => import('./css/TextEffectsWaveReveal').then(m => ({ default: m.TextEffectsWaveReveal })))
const CssTextEffectsWaveText = lazy(() => import('./css/TextEffectsWaveText').then(m => ({ default: m.TextEffectsWaveText })))
const CssTextEffectsXpNumberPop = lazy(() => import('./css/TextEffectsXpNumberPop').then(m => ({ default: m.TextEffectsXpNumberPop })))

export const groupMetadata: GroupMetadata = {
  id: 'text-effects',
  title: 'Text effects',
  tech: 'framer',
  demo: 'textEffects'
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'text-effects__character-reveal': { component: TextEffectsCharacterReveal, metadata: characterRevealMeta },
    'text-effects__epic-win': { component: TextEffectsEpicWin, metadata: epicWinMeta },
    'text-effects__wave-text': { component: TextEffectsWaveText, metadata: waveTextMeta },
    'text-effects__glitch-text': { component: TextEffectsGlitchText, metadata: glitchTextMeta },
    'text-effects__typewriter': { component: TextEffectsTypewriter, metadata: typewriterMeta },
    'text-effects__combo-counter': { component: TextEffectsComboCounter, metadata: comboCounterMeta },
    'text-effects__xp-number-pop': { component: TextEffectsXpNumberPop, metadata: xpNumberPopMeta },
    'text-effects__level-breakthrough': { component: TextEffectsLevelBreakthrough, metadata: levelBreakthroughMeta },
    'text-effects__counter-increment': { component: TextEffectsCounterIncrement, metadata: counterIncrementMeta },
    'text-effects__wave-reveal': { component: TextEffectsWaveReveal, metadata: waveRevealMeta },
    'text-effects__light-sweep-draw': { component: TextEffectsLightSweepDraw, metadata: lightSweepDrawMeta },
    'text-effects__metallic-specular-flash': { component: TextEffectsMetallicSpecularFlash, metadata: metallicSpecularFlashMeta },
    'text-effects__horizon-light-pass': { component: TextEffectsHorizonLightPass, metadata: horizonLightPassMeta },
    'text-effects__verb-jumping': { component: TextEffectsVerbJump, metadata: verbJumpMeta },
    'text-effects__verb-floating': { component: TextEffectsVerbFloat, metadata: verbFloatMeta },
    'text-effects__verb-jogging': { component: TextEffectsVerbJog, metadata: verbJogMeta },
    'text-effects__verb-flipping': { component: TextEffectsVerbFlip, metadata: verbFlipMeta },
    'text-effects__verb-twirling': { component: TextEffectsVerbTwirl, metadata: verbTwirlMeta },
    'text-effects__verb-falling': { component: TextEffectsVerbFall, metadata: verbFallMeta },
  },
  css: {
    'text-effects__character-reveal': { component: CssTextEffectsCharacterReveal, metadata: characterRevealCssMeta },
    'text-effects__epic-win': { component: CssTextEffectsEpicWin, metadata: epicWinCssMeta },
    'text-effects__wave-text': { component: CssTextEffectsWaveText, metadata: waveTextCssMeta },
    'text-effects__glitch-text': { component: CssTextEffectsGlitchText, metadata: glitchTextCssMeta },
    'text-effects__typewriter': { component: CssTextEffectsTypewriter, metadata: typewriterCssMeta },
    'text-effects__combo-counter': { component: CssTextEffectsComboCounter, metadata: comboCounterCssMeta },
    'text-effects__xp-number-pop': { component: CssTextEffectsXpNumberPop, metadata: xpNumberPopCssMeta },
    'text-effects__level-breakthrough': { component: CssTextEffectsLevelBreakthrough, metadata: levelBreakthroughCssMeta },
    'text-effects__counter-increment': { component: CssTextEffectsCounterIncrement, metadata: counterIncrementCssMeta },
    'text-effects__wave-reveal': { component: CssTextEffectsWaveReveal, metadata: waveRevealCssMeta },
    'text-effects__light-sweep-draw': { component: CssTextEffectsLightSweepDraw, metadata: lightSweepDrawCssMeta },
    'text-effects__metallic-specular-flash': { component: CssTextEffectsMetallicSpecularFlash, metadata: metallicSpecularFlashCssMeta },
    'text-effects__horizon-light-pass': { component: CssTextEffectsHorizonLightPass, metadata: horizonLightPassCssMeta },
    'text-effects__verb-jumping': { component: CssTextEffectsVerbJump, metadata: verbJumpCssMeta },
    'text-effects__verb-floating': { component: CssTextEffectsVerbFloat, metadata: verbFloatCssMeta },
    'text-effects__verb-jogging': { component: CssTextEffectsVerbJog, metadata: verbJogCssMeta },
    'text-effects__verb-flipping': { component: CssTextEffectsVerbFlip, metadata: verbFlipCssMeta },
    'text-effects__verb-twirling': { component: CssTextEffectsVerbTwirl, metadata: verbTwirlCssMeta },
    'text-effects__verb-falling': { component: CssTextEffectsVerbFall, metadata: verbFallCssMeta },
  },
}

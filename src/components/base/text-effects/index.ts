import { TextEffectsCharacterReveal, metadata as characterRevealMeta } from './framer/TextEffectsCharacterReveal'
import { TextEffectsComboCounter, metadata as comboCounterMeta } from './framer/TextEffectsComboCounter'
import { TextEffectsCounterIncrement, metadata as counterIncrementMeta } from './framer/TextEffectsCounterIncrement'
import { TextEffectsEpicWin, metadata as epicWinMeta } from './framer/TextEffectsEpicWin'
import { TextEffectsGlitchText, metadata as glitchTextMeta } from './framer/TextEffectsGlitchText'
import { TextEffectsHorizonLightPass, metadata as horizonLightPassMeta } from './framer/TextEffectsHorizonLightPass'
import { TextEffectsLevelBreakthrough, metadata as levelBreakthroughMeta } from './framer/TextEffectsLevelBreakthrough'
import { TextEffectsLightSweepDraw, metadata as lightSweepDrawMeta } from './framer/TextEffectsLightSweepDraw'
import { TextEffectsMetallicSpecularFlash, metadata as metallicSpecularFlashMeta } from './framer/TextEffectsMetallicSpecularFlash'
import { TextEffectsTypewriter, metadata as typewriterMeta } from './framer/TextEffectsTypewriter'
import { TextEffectsVerbFall, metadata as verbFallMeta } from './framer/TextEffectsVerbFall'
import { TextEffectsVerbFlip, metadata as verbFlipMeta } from './framer/TextEffectsVerbFlip'
import { TextEffectsVerbFloat, metadata as verbFloatMeta } from './framer/TextEffectsVerbFloat'
import { TextEffectsVerbJog, metadata as verbJogMeta } from './framer/TextEffectsVerbJog'
import { TextEffectsVerbJump, metadata as verbJumpMeta } from './framer/TextEffectsVerbJump'
import { TextEffectsVerbTwirl, metadata as verbTwirlMeta } from './framer/TextEffectsVerbTwirl'
import { TextEffectsWaveReveal, metadata as waveRevealMeta } from './framer/TextEffectsWaveReveal'
import { TextEffectsWaveText, metadata as waveTextMeta } from './framer/TextEffectsWaveText'
import { TextEffectsXpNumberPop, metadata as xpNumberPopMeta } from './framer/TextEffectsXpNumberPop'

// CSS animations
import { TextEffectsCharacterReveal as CssTextEffectsCharacterReveal, metadata as characterRevealCssMeta } from './css/TextEffectsCharacterReveal'
import { TextEffectsComboCounter as CssTextEffectsComboCounter, metadata as comboCounterCssMeta } from './css/TextEffectsComboCounter'
import { TextEffectsCounterIncrement as CssTextEffectsCounterIncrement, metadata as counterIncrementCssMeta } from './css/TextEffectsCounterIncrement'
import { TextEffectsEpicWin as CssTextEffectsEpicWin, metadata as epicWinCssMeta } from './css/TextEffectsEpicWin'
import { TextEffectsGlitchText as CssTextEffectsGlitchText, metadata as glitchTextCssMeta } from './css/TextEffectsGlitchText'
import { TextEffectsHorizonLightPass as CssTextEffectsHorizonLightPass, metadata as horizonLightPassCssMeta } from './css/TextEffectsHorizonLightPass'
import { TextEffectsLevelBreakthrough as CssTextEffectsLevelBreakthrough, metadata as levelBreakthroughCssMeta } from './css/TextEffectsLevelBreakthrough'
import { TextEffectsLightSweepDraw as CssTextEffectsLightSweepDraw, metadata as lightSweepDrawCssMeta } from './css/TextEffectsLightSweepDraw'
import { TextEffectsMetallicSpecularFlash as CssTextEffectsMetallicSpecularFlash, metadata as metallicSpecularFlashCssMeta } from './css/TextEffectsMetallicSpecularFlash'
import { TextEffectsTypewriter as CssTextEffectsTypewriter, metadata as typewriterCssMeta } from './css/TextEffectsTypewriter'
import { TextEffectsVerbFall as CssTextEffectsVerbFall, metadata as verbFallCssMeta } from './css/TextEffectsVerbFall'
import { TextEffectsVerbFlip as CssTextEffectsVerbFlip, metadata as verbFlipCssMeta } from './css/TextEffectsVerbFlip'
import { TextEffectsVerbFloat as CssTextEffectsVerbFloat, metadata as verbFloatCssMeta } from './css/TextEffectsVerbFloat'
import { TextEffectsVerbJog as CssTextEffectsVerbJog, metadata as verbJogCssMeta } from './css/TextEffectsVerbJog'
import { TextEffectsVerbJump as CssTextEffectsVerbJump, metadata as verbJumpCssMeta } from './css/TextEffectsVerbJump'
import { TextEffectsVerbTwirl as CssTextEffectsVerbTwirl, metadata as verbTwirlCssMeta } from './css/TextEffectsVerbTwirl'
import { TextEffectsWaveReveal as CssTextEffectsWaveReveal, metadata as waveRevealCssMeta } from './css/TextEffectsWaveReveal'
import { TextEffectsWaveText as CssTextEffectsWaveText, metadata as waveTextCssMeta } from './css/TextEffectsWaveText'
import { TextEffectsXpNumberPop as CssTextEffectsXpNumberPop, metadata as xpNumberPopCssMeta } from './css/TextEffectsXpNumberPop'
import type { GroupExport, GroupMetadata } from '@/types/animation'

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

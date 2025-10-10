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
  css: {},
}

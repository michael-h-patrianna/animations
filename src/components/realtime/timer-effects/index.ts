// Framer variant CSS (loaded at group level for no-css-in-motion compliance)
import './shared.css'
import './framer/TimerEffectsPillCountdownExtreme.css'
import './framer/TimerEffectsPillCountdownGlitch.css'
import './framer/TimerEffectsPillCountdownHeartbeat.css'
import './framer/TimerEffectsPillCountdownMedium.css'
import './framer/TimerEffectsPillCountdownSoft.css'
import './framer/TimerEffectsPillCountdownStrong.css'
import './framer/TimerEffectsTimerFlash.css'
import './framer/TimerEffectsTimerFlashSoft.css'
import './framer/TimerEffectsTimerPulse.css'
import './framer/TimerEffectsUrgentPulse.css'

import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Lazy-loaded variants to enable code-splitting per animation component
const TimerEffectsTimerFlash = lazy(() =>
  import('./framer/TimerEffectsTimerFlash').then((m) => ({ default: m.TimerEffectsTimerFlash }))
)
const TimerEffectsTimerFlashSoft = lazy(() =>
  import('./framer/TimerEffectsTimerFlashSoft').then((m) => ({
    default: m.TimerEffectsTimerFlashSoft,
  }))
)
const TimerEffectsTimerPulse = lazy(() =>
  import('./framer/TimerEffectsTimerPulse').then((m) => ({ default: m.TimerEffectsTimerPulse }))
)

// New pill countdown family (escalating intensity)
const TimerEffectsPillCountdownStrong = lazy(() =>
  import('./framer/TimerEffectsPillCountdownStrong').then((m) => ({
    default: m.TimerEffectsPillCountdownStrong,
  }))
)
const TimerEffectsPillCountdownExtreme = lazy(() =>
  import('./framer/TimerEffectsPillCountdownExtreme').then((m) => ({
    default: m.TimerEffectsPillCountdownExtreme,
  }))
)
const TimerEffectsPillCountdownGlitch = lazy(() =>
  import('./framer/TimerEffectsPillCountdownGlitch').then((m) => ({
    default: m.TimerEffectsPillCountdownGlitch,
  }))
)
const TimerEffectsPillCountdownHeartbeat = lazy(() =>
  import('./framer/TimerEffectsPillCountdownHeartbeat').then((m) => ({
    default: m.TimerEffectsPillCountdownHeartbeat,
  }))
)
const TimerEffectsUrgentPulse = lazy(() =>
  import('./framer/TimerEffectsUrgentPulse').then((m) => ({
    default: m.TimerEffectsUrgentPulse,
  }))
)
const TimerEffectsPillCountdownMedium = lazy(() =>
  import('./framer/TimerEffectsPillCountdownMedium').then((m) => ({
    default: m.TimerEffectsPillCountdownMedium,
  }))
)
const TimerEffectsPillCountdownSoft = lazy(() =>
  import('./framer/TimerEffectsPillCountdownSoft').then((m) => ({
    default: m.TimerEffectsPillCountdownSoft,
  }))
)

// Import metadata directly (not lazy-loaded since metadata is needed immediately)
import { metadata as timerEffectsPillCountdownExtremeMetadata } from './framer/TimerEffectsPillCountdownExtreme.meta'
import { metadata as timerEffectsPillCountdownGlitchMetadata } from './framer/TimerEffectsPillCountdownGlitch.meta'
import { metadata as timerEffectsPillCountdownHeartbeatMetadata } from './framer/TimerEffectsPillCountdownHeartbeat.meta'
import { metadata as timerEffectsPillCountdownStrongMetadata } from './framer/TimerEffectsPillCountdownStrong.meta'
import { metadata as timerEffectsTimerFlashMetadata } from './framer/TimerEffectsTimerFlash.meta'
import { metadata as timerEffectsTimerFlashSoftMetadata } from './framer/TimerEffectsTimerFlashSoft.meta'
import { metadata as timerEffectsTimerPulseMetadata } from './framer/TimerEffectsTimerPulse.meta'
import { metadata as timerEffectsUrgentPulseMetadata } from './framer/TimerEffectsUrgentPulse.meta'
import { metadata as timerEffectsPillCountdownMediumMetadata } from './framer/TimerEffectsPillCountdownMedium.meta'
import { metadata as timerEffectsPillCountdownSoftMetadata } from './framer/TimerEffectsPillCountdownSoft.meta'

// CSS metadata imports (not lazy-loaded since metadata is needed immediately)
import { metadata as pillCountdownExtremeCssMetadata } from './css/TimerEffectsPillCountdownExtreme.meta'
import { metadata as pillCountdownGlitchCssMetadata } from './css/TimerEffectsPillCountdownGlitch.meta'
import { metadata as pillCountdownHeartbeatCssMetadata } from './css/TimerEffectsPillCountdownHeartbeat.meta'
import { metadata as pillCountdownMediumCssMetadata } from './css/TimerEffectsPillCountdownMedium.meta'
import { metadata as pillCountdownSoftCssMetadata } from './css/TimerEffectsPillCountdownSoft.meta'
import { metadata as pillCountdownStrongCssMetadata } from './css/TimerEffectsPillCountdownStrong.meta'
import { metadata as timerFlashCssMetadata } from './css/TimerEffectsTimerFlash.meta'
import { metadata as timerFlashSoftCssMetadata } from './css/TimerEffectsTimerFlashSoft.meta'
import { metadata as timerPulseCssMetadata } from './css/TimerEffectsTimerPulse.meta'
import { metadata as urgentPulseCssMetadata } from './css/TimerEffectsUrgentPulse.meta'

// CSS animations - Lazy load components
const CssTimerEffectsTimerFlash = lazy(() =>
  import('./css/TimerEffectsTimerFlash').then((m) => ({ default: m.TimerEffectsTimerFlash }))
)
const CssTimerEffectsTimerFlashSoft = lazy(() =>
  import('./css/TimerEffectsTimerFlashSoft').then((m) => ({
    default: m.TimerEffectsTimerFlashSoft,
  }))
)
const CssTimerEffectsTimerPulse = lazy(() =>
  import('./css/TimerEffectsTimerPulse').then((m) => ({ default: m.TimerEffectsTimerPulse }))
)
const CssTimerEffectsPillCountdownStrong = lazy(() =>
  import('./css/TimerEffectsPillCountdownStrong').then((m) => ({
    default: m.TimerEffectsPillCountdownStrong,
  }))
)
const CssTimerEffectsPillCountdownExtreme = lazy(() =>
  import('./css/TimerEffectsPillCountdownExtreme').then((m) => ({
    default: m.TimerEffectsPillCountdownExtreme,
  }))
)
const CssTimerEffectsPillCountdownGlitch = lazy(() =>
  import('./css/TimerEffectsPillCountdownGlitch').then((m) => ({
    default: m.TimerEffectsPillCountdownGlitch,
  }))
)
const CssTimerEffectsPillCountdownHeartbeat = lazy(() =>
  import('./css/TimerEffectsPillCountdownHeartbeat').then((m) => ({
    default: m.TimerEffectsPillCountdownHeartbeat,
  }))
)
const CssTimerEffectsPillCountdownMedium = lazy(() =>
  import('./css/TimerEffectsPillCountdownMedium').then((m) => ({
    default: m.TimerEffectsPillCountdownMedium,
  }))
)
const CssTimerEffectsPillCountdownSoft = lazy(() =>
  import('./css/TimerEffectsPillCountdownSoft').then((m) => ({
    default: m.TimerEffectsPillCountdownSoft,
  }))
)
const CssTimerEffectsUrgentPulse = lazy(() =>
  import('./css/TimerEffectsUrgentPulse').then((m) => ({
    default: m.TimerEffectsUrgentPulse,
  }))
)

export const groupMetadata: GroupMetadata = {
  id: 'timer-effects',
  title: 'Timer effects',
  tech: 'framer',
  demo: 'timer',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'timer-effects__timer-pulse': {
      component: TimerEffectsTimerPulse,
      metadata: timerEffectsTimerPulseMetadata,
    },
    'timer-effects__timer-flash': {
      component: TimerEffectsTimerFlash,
      metadata: timerEffectsTimerFlashMetadata,
    },
    'timer-effects__timer-flash-soft': {
      component: TimerEffectsTimerFlashSoft,
      metadata: timerEffectsTimerFlashSoftMetadata,
    },
    'timer-effects__pill-countdown-strong': {
      component: TimerEffectsPillCountdownStrong,
      metadata: timerEffectsPillCountdownStrongMetadata,
    },
    'timer-effects__pill-countdown-extreme': {
      component: TimerEffectsPillCountdownExtreme,
      metadata: timerEffectsPillCountdownExtremeMetadata,
    },
    'timer-effects__pill-countdown-glitch': {
      component: TimerEffectsPillCountdownGlitch,
      metadata: timerEffectsPillCountdownGlitchMetadata,
    },
    'timer-effects__pill-countdown-heartbeat': {
      component: TimerEffectsPillCountdownHeartbeat,
      metadata: timerEffectsPillCountdownHeartbeatMetadata,
    },
    'timer-effects__urgent-pulse': {
      component: TimerEffectsUrgentPulse,
      metadata: timerEffectsUrgentPulseMetadata,
    },
    'timer-effects__pill-countdown-medium': {
      component: TimerEffectsPillCountdownMedium,
      metadata: timerEffectsPillCountdownMediumMetadata,
    },
    'timer-effects__pill-countdown-soft': {
      component: TimerEffectsPillCountdownSoft,
      metadata: timerEffectsPillCountdownSoftMetadata,
    },
  },
  css: {
    'timer-effects__timer-pulse': {
      component: CssTimerEffectsTimerPulse,
      metadata: timerPulseCssMetadata,
    },
    'timer-effects__timer-flash': {
      component: CssTimerEffectsTimerFlash,
      metadata: timerFlashCssMetadata,
    },
    'timer-effects__timer-flash-soft': {
      component: CssTimerEffectsTimerFlashSoft,
      metadata: timerFlashSoftCssMetadata,
    },
    'timer-effects__pill-countdown-soft': {
      component: CssTimerEffectsPillCountdownSoft,
      metadata: pillCountdownSoftCssMetadata,
    },
    'timer-effects__pill-countdown-medium': {
      component: CssTimerEffectsPillCountdownMedium,
      metadata: pillCountdownMediumCssMetadata,
    },
    'timer-effects__pill-countdown-strong': {
      component: CssTimerEffectsPillCountdownStrong,
      metadata: pillCountdownStrongCssMetadata,
    },
    'timer-effects__pill-countdown-extreme': {
      component: CssTimerEffectsPillCountdownExtreme,
      metadata: pillCountdownExtremeCssMetadata,
    },
    'timer-effects__pill-countdown-glitch': {
      component: CssTimerEffectsPillCountdownGlitch,
      metadata: pillCountdownGlitchCssMetadata,
    },
    'timer-effects__pill-countdown-heartbeat': {
      component: CssTimerEffectsPillCountdownHeartbeat,
      metadata: pillCountdownHeartbeatCssMetadata,
    },
    'timer-effects__urgent-pulse': {
      component: CssTimerEffectsUrgentPulse,
      metadata: urgentPulseCssMetadata,
    },
  },
}

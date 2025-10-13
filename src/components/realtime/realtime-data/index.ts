import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as leaderboardMetadata } from './framer/RealtimeDataLeaderboardShift.meta'
import { metadata as liveScoreMetadata } from './framer/RealtimeDataLiveScoreUpdate.meta'
import { metadata as stackedMetadata } from './framer/RealtimeDataStackedRealtime.meta'
import { metadata as winTickerMetadata } from './framer/RealtimeDataWinTicker.meta'

// CSS - Import metadata only
import { metadata as leaderboardCssMetadata } from './css/RealtimeDataLeaderboardShift.meta'
import { metadata as liveScoreCssMetadata } from './css/RealtimeDataLiveScoreUpdate.meta'
import { metadata as stackedCssMetadata } from './css/RealtimeDataStackedRealtime.meta'
import { metadata as winTickerCssMetadata } from './css/RealtimeDataWinTicker.meta'

// Framer Motion - Lazy load components
const RealtimeDataLeaderboardShift = lazy(() =>
  import('./framer/RealtimeDataLeaderboardShift').then((m) => ({
    default: m.RealtimeDataLeaderboardShift,
  }))
)
const RealtimeDataLiveScoreUpdate = lazy(() =>
  import('./framer/RealtimeDataLiveScoreUpdate').then((m) => ({
    default: m.RealtimeDataLiveScoreUpdate,
  }))
)
const RealtimeDataStackedRealtime = lazy(() =>
  import('./framer/RealtimeDataStackedRealtime').then((m) => ({
    default: m.RealtimeDataStackedRealtime,
  }))
)
const RealtimeDataWinTicker = lazy(() =>
  import('./framer/RealtimeDataWinTicker').then((m) => ({ default: m.RealtimeDataWinTicker }))
)

// CSS - Lazy load components
const CssRealtimeDataLeaderboardShift = lazy(() =>
  import('./css/RealtimeDataLeaderboardShift').then((m) => ({
    default: m.RealtimeDataLeaderboardShift,
  }))
)
const CssRealtimeDataLiveScoreUpdate = lazy(() =>
  import('./css/RealtimeDataLiveScoreUpdate').then((m) => ({
    default: m.RealtimeDataLiveScoreUpdate,
  }))
)
const CssRealtimeDataStackedRealtime = lazy(() =>
  import('./css/RealtimeDataStackedRealtime').then((m) => ({
    default: m.RealtimeDataStackedRealtime,
  }))
)
const CssRealtimeDataWinTicker = lazy(() =>
  import('./css/RealtimeDataWinTicker').then((m) => ({ default: m.RealtimeDataWinTicker }))
)

export const groupMetadata: GroupMetadata = {
  id: 'realtime-data',
  title: 'Realtime data',
  tech: 'css',
  demo: 'realtimeData',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'realtime-data__leaderboard-shift': {
      component: RealtimeDataLeaderboardShift,
      metadata: leaderboardMetadata,
    },
    'realtime-data__live-score-update': {
      component: RealtimeDataLiveScoreUpdate,
      metadata: liveScoreMetadata,
    },
    'realtime-data__win-ticker': {
      component: RealtimeDataWinTicker,
      metadata: winTickerMetadata,
    },
    'realtime-data__stacked-realtime': {
      component: RealtimeDataStackedRealtime,
      metadata: stackedMetadata,
    },
  },
  css: {
    'realtime-data__leaderboard-shift': {
      component: CssRealtimeDataLeaderboardShift,
      metadata: leaderboardCssMetadata,
    },
    'realtime-data__live-score-update': {
      component: CssRealtimeDataLiveScoreUpdate,
      metadata: liveScoreCssMetadata,
    },
    'realtime-data__win-ticker': {
      component: CssRealtimeDataWinTicker,
      metadata: winTickerCssMetadata,
    },
    'realtime-data__stacked-realtime': {
      component: CssRealtimeDataStackedRealtime,
      metadata: stackedCssMetadata,
    },
  },
}

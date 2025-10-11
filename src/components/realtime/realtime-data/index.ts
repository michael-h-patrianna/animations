import type { GroupMetadata, GroupExport } from '@/types/animation'

import { RealtimeDataLeaderboardShift, metadata as leaderboardMetadata } from './framer/RealtimeDataLeaderboardShift'
import { RealtimeDataLiveScoreUpdate, metadata as liveScoreMetadata } from './framer/RealtimeDataLiveScoreUpdate'
import { RealtimeDataStackedRealtime, metadata as stackedMetadata } from './framer/RealtimeDataStackedRealtime'
import { RealtimeDataWinTicker, metadata as winTickerMetadata } from './framer/RealtimeDataWinTicker'

// CSS animations
import { RealtimeDataLeaderboardShift as CssRealtimeDataLeaderboardShift, metadata as leaderboardCssMetadata } from './css/RealtimeDataLeaderboardShift'
import { RealtimeDataLiveScoreUpdate as CssRealtimeDataLiveScoreUpdate, metadata as liveScoreCssMetadata } from './css/RealtimeDataLiveScoreUpdate'
import { RealtimeDataStackedRealtime as CssRealtimeDataStackedRealtime, metadata as stackedCssMetadata } from './css/RealtimeDataStackedRealtime'
import { RealtimeDataWinTicker as CssRealtimeDataWinTicker, metadata as winTickerCssMetadata } from './css/RealtimeDataWinTicker'

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
      metadata: leaderboardMetadata
    },
    'realtime-data__live-score-update': {
      component: RealtimeDataLiveScoreUpdate,
      metadata: liveScoreMetadata
    },
    'realtime-data__win-ticker': {
      component: RealtimeDataWinTicker,
      metadata: winTickerMetadata
    },
    'realtime-data__stacked-realtime': {
      component: RealtimeDataStackedRealtime,
      metadata: stackedMetadata
    }
  },
  css: {
    'realtime-data__leaderboard-shift': {
      component: CssRealtimeDataLeaderboardShift,
      metadata: leaderboardCssMetadata
    },
    'realtime-data__live-score-update': {
      component: CssRealtimeDataLiveScoreUpdate,
      metadata: liveScoreCssMetadata
    },
    'realtime-data__win-ticker': {
      component: CssRealtimeDataWinTicker,
      metadata: winTickerCssMetadata
    },
    'realtime-data__stacked-realtime': {
      component: CssRealtimeDataStackedRealtime,
      metadata: stackedCssMetadata
    }
  },
}


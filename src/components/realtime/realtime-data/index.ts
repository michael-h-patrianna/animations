import type { AnimationComponentMap } from '@/types/animation'

import { RealtimeDataLeaderboardShift } from './RealtimeDataLeaderboardShift'
import { RealtimeDataLiveScoreUpdate } from './RealtimeDataLiveScoreUpdate'
import { RealtimeDataStackedRealtime } from './RealtimeDataStackedRealtime'
import { RealtimeDataWinTicker } from './RealtimeDataWinTicker'

export { RealtimeDataLeaderboardShift } from './RealtimeDataLeaderboardShift'
export { RealtimeDataLiveScoreUpdate } from './RealtimeDataLiveScoreUpdate'
export { RealtimeDataStackedRealtime } from './RealtimeDataStackedRealtime'
export { RealtimeDataWinTicker } from './RealtimeDataWinTicker'

export const realtimeRealtimeDataAnimations: AnimationComponentMap = {
  'realtime-data__leaderboard-shift': RealtimeDataLeaderboardShift,
  'realtime-data__live-score-update': RealtimeDataLiveScoreUpdate,
  'realtime-data__stacked-realtime': RealtimeDataStackedRealtime,
  'realtime-data__win-ticker': RealtimeDataWinTicker,
}

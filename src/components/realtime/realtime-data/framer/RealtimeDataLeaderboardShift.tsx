import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useRef, useState, type Dispatch, type MutableRefObject, type SetStateAction } from 'react'

type TimeoutId = ReturnType<typeof setTimeout>

type LeaderboardEntry = {
  rank: number
  player: string
  score: number
}

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, player: 'Phoenix', score: 2450 },
  { rank: 2, player: 'Shadow', score: 2380 },
  { rank: 3, player: 'Nova', score: 2320 },
  { rank: 4, player: 'Apex', score: 2290 },
]

const rowTransition = { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }

const resetLeaderboard = () =>
  INITIAL_LEADERBOARD.map((entry) => ({
    ...entry,
  }))

const buildShiftedLeaderboard = (current: LeaderboardEntry[]) => {
  const nextLeaderboard = [...current]
  const firstPlayer = nextLeaderboard.shift()
  if (!firstPlayer) return current

  const updatedLeaderboard = nextLeaderboard.map((player, index) => ({
    ...player,
    rank: index + 1,
  }))

  updatedLeaderboard.push({
    ...firstPlayer,
    rank: 4,
    score: firstPlayer.score - 50,
  })

  return updatedLeaderboard
}

const useLeaderboardLoop = (
  leaderboardRef: MutableRefObject<LeaderboardEntry[]>,
  setLeaderboard: Dispatch<SetStateAction<LeaderboardEntry[]>>,
  setIsAnimating: Dispatch<SetStateAction<boolean>>
) => {
  useEffect(() => {
    const timeoutIds = new Set<TimeoutId>()
    let isMounted = true

    const scheduleTimeout = (callback: () => void, delayMs: number) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId)
        callback()
      }, delayMs)
      timeoutIds.add(timeoutId)
      return timeoutId
    }

    const startAnimation = () => {
      if (!isMounted) return
      setIsAnimating(true)

      scheduleTimeout(() => {
        if (!isMounted) return

        setLeaderboard(buildShiftedLeaderboard(leaderboardRef.current))
        setIsAnimating(false)

        scheduleTimeout(() => {
          if (!isMounted) return
          setLeaderboard(resetLeaderboard())
          scheduleTimeout(startAnimation, 1000)
        }, 2000)
      }, 800)
    }

    startAnimation()

    return () => {
      isMounted = false
      timeoutIds.forEach(clearTimeout)
      timeoutIds.clear()
    }
  }, [leaderboardRef, setIsAnimating, setLeaderboard])
}

/**
 *
 */
export function RealtimeDataLeaderboardShift() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(resetLeaderboard)
  const leaderboardRef = useRef(leaderboard)

  useEffect(() => {
    leaderboardRef.current = leaderboard
  }, [leaderboard])

  useLeaderboardLoop(leaderboardRef, setLeaderboard, setIsAnimating)

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__leaderboard-shift">
      <div className="pf-realtime-data__leaderboard">
        <AnimatePresence mode="popLayout">
          {leaderboard.map((player, index) => (
            <m.div
              key={player.player}
              className="pf-realtime-data__row"
              layout
              initial={index === 0 && isAnimating ? { y: 0, opacity: 1 } : false}
              animate={index === 0 && isAnimating ? { y: 100, opacity: 0 } : { y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={rowTransition}
            >
              <div className="pf-realtime-data__rank">#{player.rank}</div>
              <div className="pf-realtime-data__player">{player.player}</div>
              <div className="pf-realtime-data__score">{player.score.toLocaleString()}</div>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

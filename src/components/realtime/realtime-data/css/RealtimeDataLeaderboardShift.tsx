import { useEffect, useRef, useState, type Dispatch, type MutableRefObject, type SetStateAction } from 'react'
import './RealtimeDataLeaderboardShift.css'

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

const rowHeight = 48

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

const animatePlayerExit = (element: HTMLDivElement | undefined) => {
  if (!element) return
  element.animate(
    [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(100px)', opacity: 0 },
    ],
    {
      duration: 800,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards',
    }
  )
}

const animatePlayerShift = (
  element: HTMLDivElement | undefined,
  scheduleFrame: (callback: FrameRequestCallback) => number
) => {
  if (!element) return
  element.style.transform = `translateY(${rowHeight}px)`
  scheduleFrame(() => {
    element
      .animate(
        [
          { transform: `translateY(${rowHeight}px)` },
          { transform: 'translateY(0)' },
        ],
        {
          duration: 800,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
      .onfinish = () => {
      element.style.transform = ''
    }
  })
}

const animatePhoenixEntry = (
  element: HTMLDivElement | undefined,
  scheduleFrame: (callback: FrameRequestCallback) => number
) => {
  if (!element) return
  element.style.opacity = '0'
  element.style.transform = 'translateY(-20px)'
  scheduleFrame(() => {
    element
      .animate(
        [
          { transform: 'translateY(-20px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        {
          duration: 600,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
      .onfinish = () => {
      element.style.transform = ''
      element.style.opacity = ''
    }
  })
}

const runShiftAnimations = (
  refs: Map<string, HTMLDivElement>,
  scheduleFrame: (callback: FrameRequestCallback) => number
) => {
  ;['Shadow', 'Nova', 'Apex'].forEach((playerName) => {
    animatePlayerShift(refs.get(playerName), scheduleFrame)
  })
  animatePhoenixEntry(refs.get('Phoenix'), scheduleFrame)
}

const useLeaderboardShiftAnimation = (
  leaderboardRef: MutableRefObject<LeaderboardEntry[]>,
  rowRefs: MutableRefObject<Map<string, HTMLDivElement>>,
  setLeaderboard: Dispatch<SetStateAction<LeaderboardEntry[]>>
) => {
  useEffect(() => {
    const timeoutIds = new Set<TimeoutId>()
    const frameIds = new Set<number>()
    let isMounted = true

    const scheduleTimeout = (callback: () => void, delayMs: number) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId)
        callback()
      }, delayMs)
      timeoutIds.add(timeoutId)
      return timeoutId
    }

    const scheduleFrame = (callback: FrameRequestCallback) => {
      const frameId = requestAnimationFrame((timestamp) => {
        frameIds.delete(frameId)
        callback(timestamp)
      })
      frameIds.add(frameId)
      return frameId
    }

    const startAnimation = () => {
      if (!isMounted) return

      animatePlayerExit(rowRefs.current.get('Phoenix'))

      scheduleTimeout(() => {
        if (!isMounted) return

        setLeaderboard(buildShiftedLeaderboard(leaderboardRef.current))
        scheduleFrame(() => runShiftAnimations(rowRefs.current, scheduleFrame))

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
      frameIds.forEach(cancelAnimationFrame)
      frameIds.clear()
    }
  }, [leaderboardRef, rowRefs, setLeaderboard])
}

/**
 *
 */
export function RealtimeDataLeaderboardShift() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(resetLeaderboard)
  const leaderboardRef = useRef(leaderboard)
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    leaderboardRef.current = leaderboard
  }, [leaderboard])

  useLeaderboardShiftAnimation(leaderboardRef, rowRefs, setLeaderboard)

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__leaderboard-shift">
      <div className="pf-realtime-data__leaderboard">
        {leaderboard.map((player) => (
          <div
            key={player.player}
            ref={(element) => {
              if (element) rowRefs.current.set(player.player, element)
              else rowRefs.current.delete(player.player)
            }}
            className="pf-realtime-data__row"
          >
            <div className="pf-realtime-data__rank">#{player.rank}</div>
            <div className="pf-realtime-data__player">{player.player}</div>
            <div className="pf-realtime-data__score">{player.score.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

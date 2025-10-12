import type { AnimationMetadata } from '@/types/animation'
import { useEffect, useRef, useState } from 'react'
import './RealtimeDataLeaderboardShift.css'


export function RealtimeDataLeaderboardShift() {
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, player: 'Phoenix', score: 2450 },
    { rank: 2, player: 'Shadow', score: 2380 },
    { rank: 3, player: 'Nova', score: 2320 },
    { rank: 4, player: 'Apex', score: 2290 },
  ])
  const leaderboardRef = useRef(leaderboard)
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    leaderboardRef.current = leaderboard
  }, [leaderboard])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const startAnimation = () => {
      // Animate the first player out
      const firstPlayerElement = rowRefs.current.get('Phoenix')
      if (firstPlayerElement) {
        firstPlayerElement.animate(
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

      // After Phoenix exits, reorganize leaderboard and animate the shift
      setTimeout(() => {
        const newLeaderboard = [...leaderboardRef.current]
        const firstPlayer = newLeaderboard.shift()!

        // Create new objects to force React re-render with updated ranks
        const updatedLeaderboard = newLeaderboard.map((player, index) => ({
          ...player,
          rank: index + 1
        }))

        // Add Phoenix at the end with new rank and score
        updatedLeaderboard.push({
          ...firstPlayer,
          rank: 4,
          score: firstPlayer.score - 50
        })

        setLeaderboard(updatedLeaderboard)

        // Use FLIP technique: After state update, animate from old position to new
        requestAnimationFrame(() => {
          const playersToShift = ['Shadow', 'Nova', 'Apex']
          const rowHeight = 48 // row height (~32px) + gap (8px) + padding

          playersToShift.forEach((playerName) => {
            const playerElement = rowRefs.current.get(playerName)
            if (playerElement) {
              // Set initial position (where they were before the DOM update)
              playerElement.style.transform = `translateY(${rowHeight}px)`

              // Animate to final position in next frame
              requestAnimationFrame(() => {
                playerElement.animate(
                  [
                    { transform: `translateY(${rowHeight}px)` },
                    { transform: 'translateY(0)' },
                  ],
                  {
                    duration: 800,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fill: 'forwards',
                  }
                ).onfinish = () => {
                  // Clean up inline styles after animation
                  playerElement.style.transform = ''
                }
              })
            }
          })

          // Animate Phoenix entering at the bottom
          const phoenixElement = rowRefs.current.get('Phoenix')
          if (phoenixElement) {
            // Reset Phoenix's styles and animate it back in
            phoenixElement.style.opacity = '0'
            phoenixElement.style.transform = 'translateY(-20px)'

            requestAnimationFrame(() => {
              phoenixElement.animate(
                [
                  { transform: 'translateY(-20px)', opacity: 0 },
                  { transform: 'translateY(0)', opacity: 1 },
                ],
                {
                  duration: 600,
                  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  fill: 'forwards',
                }
              ).onfinish = () => {
                // Clean up inline styles after animation
                phoenixElement.style.transform = ''
                phoenixElement.style.opacity = ''
              }
            })
          }
        })

        // Reset after delay
        timeoutId = setTimeout(() => {
          setLeaderboard([
            { rank: 1, player: 'Phoenix', score: 2450 },
            { rank: 2, player: 'Shadow', score: 2380 },
            { rank: 3, player: 'Nova', score: 2320 },
            { rank: 4, player: 'Apex', score: 2290 },
          ])
          setTimeout(startAnimation, 1000)
        }, 2000)
      }, 800)
    }

    startAnimation()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__leaderboard-shift">
      <div className="pf-realtime-data__leaderboard">
        {leaderboard.map((player) => (
          <div
            key={player.player}
            ref={(el) => {
              if (el) rowRefs.current.set(player.player, el)
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


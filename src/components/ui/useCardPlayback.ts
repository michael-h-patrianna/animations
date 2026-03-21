import { useEffect, useRef, useState } from 'react'

/**
 * Manages animation playback state: viewport-triggered play, replay key, and visibility.
 *
 * Infinite animations are visible immediately. One-shot animations wait for
 * IntersectionObserver to confirm the card is in the viewport before playing.
 * The replay key is incremented to trigger a remount of the animation content.
 */
export function useCardPlayback(infiniteAnimation: boolean, onReplay?: () => void) {
  const [replayKey, setReplayKey] = useState(0)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [isVisible, setIsVisible] = useState(() => infiniteAnimation)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (infiniteAnimation) return

    const node = cardRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !hasPlayed) {
          setIsVisible(true)
          setHasPlayed(true)
          setReplayKey((key) => key + 1)
        }
      },
      { threshold: 0.3, rootMargin: '0px' }
    )

    if (node) observer.observe(node)
    return () => {
      if (node) observer.unobserve(node)
    }
  }, [hasPlayed, infiniteAnimation])

  const triggerReplay = () => {
    setReplayKey((key) => key + 1)
    onReplay?.()
  }

  return { cardRef, replayKey, isVisible, triggerReplay, setReplayKey }
}

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Manages animation playback state: viewport-triggered play, replay key, and visibility.
 *
 * Infinite animations are visible immediately. One-shot animations wait for
 * IntersectionObserver to confirm the card is in the viewport before playing.
 * The replay key is incremented to trigger a remount of the animation content.
 *
 * The observer is created once on mount and disconnects itself after the first
 * intersection — no wasted re-subscriptions when state changes.
 */
export function useCardPlayback(infiniteAnimation: boolean, onReplay?: () => void) {
  const [replayKey, setReplayKey] = useState(0)
  const [isVisible, setIsVisible] = useState(() => infiniteAnimation)
  const cardRef = useRef<HTMLDivElement>(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    if (infiniteAnimation || hasPlayedRef.current) return

    const node = cardRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true
          setIsVisible(true)
          setReplayKey((key) => key + 1)
          observer.disconnect()
        }
      },
      { threshold: 0.3, rootMargin: '0px' }
    )

    if (node) observer.observe(node)
    return () => observer.disconnect()
  }, [infiniteAnimation])

  const triggerReplay = useCallback(() => {
    setReplayKey((key) => key + 1)
    onReplay?.()
  }, [onReplay])

  return { cardRef, replayKey, isVisible, triggerReplay, setReplayKey }
}

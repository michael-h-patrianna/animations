import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface AnimationCardProps {
  title: string
  description: string
  animationId: string
  tags?: string[]
  onReplay?: () => void
  infiniteAnimation?: boolean // For animations that should loop indefinitely
  disableReplay?: boolean // When true, hide/disable the replay button
  children: React.ReactNode | ((props: { bulbCount: number; onColor: string }) => React.ReactNode)
}

export function AnimationCard({
  title,
  description,
  animationId,
  tags,
  children,
  onReplay,
  infiniteAnimation = false,
  disableReplay = false,
}: AnimationCardProps) {
  const [replayKey, setReplayKey] = useState(0)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [bulbCount, setBulbCount] = useState(16)
  const [onColor, setOnColor] = useState('#ffd700') // Gold/yellow for lit bulbs
  const cardRef = useRef<HTMLDivElement>(null)

  const isLightsAnimation = animationId.startsWith('lights__')

  useEffect(() => {
    if (infiniteAnimation) {
      // Infinite animations should always be visible/playing
      setIsVisible(true)
      return
    }

    const node = cardRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          setIsVisible(true)
          setHasPlayed(true)
          // Trigger animation by updating key
          setReplayKey((key) => key + 1)
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the card is visible
        rootMargin: '0px',
      }
    )

    if (node) {
      observer.observe(node)
    }

    return () => {
      if (node) observer.unobserve(node)
    }
  }, [hasPlayed, infiniteAnimation])

  const handleReplay = () => {
    setReplayKey((key) => key + 1)
    onReplay?.()
  }

  const handleBulbCountChange = (value: number) => {
    const newCount = Math.max(4, Math.min(22, value))
    setBulbCount(newCount)
    // Trigger replay when bulb count changes
    setReplayKey((key) => key + 1)
  }

  const handleColorChange = (color: string) => {
    setOnColor(color)
    // Trigger replay when color changes
    setReplayKey((key) => key + 1)
  }

  return (
    <Card className="pf-card" data-animation-id={animationId} ref={cardRef}>
      <CardHeader className="p-0 pb-3 space-y-0">
        <CardTitle className="pf-card__title mb-1">{title}</CardTitle>
        <div className="flex items-start gap-2">
          <p
            className={`pf-card__description flex-1 m-0 transition-all duration-200 ${
              !isExpanded ? 'line-clamp-1' : ''
            }`}
          >
            {description}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 p-0 bg-transparent border-none cursor-pointer focus:outline-none mt-1"
            aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
          >
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              } text-[var(--pf-text-secondary)]/60`}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0 py-3">
        <div className="pf-demo-canvas">
          <div key={replayKey} className="pf-demo-stage pf-demo-stage--top">
            {isVisible || infiniteAnimation
              ? typeof children === 'function'
                ? children({ bulbCount, onColor })
                : children
              : null}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pf-card__actions p-0 pt-3">
        {/* Left: tags */}
        <div className="pf-card__meta">
          {tags?.map((tag) => (
            <span key={tag}>{tag.toUpperCase()}</span>
          ))}
        </div>

        {/* Center: bulb count and color controls (for lights animations) */}
        {isLightsAnimation && (
          <div className="flex items-center gap-2">
            {/* Bulb count controls */}
            <div className="flex items-center">
              <button
                onClick={() => handleBulbCountChange(bulbCount - 1)}
                disabled={bulbCount <= 4}
                className="w-8 h-8 text-sm font-medium border border-r-0 rounded-l disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent cursor-pointer"
                aria-label="Decrease bulb count"
              >
                −
              </button>
              <input
                type="number"
                value={bulbCount}
                onChange={(e) => handleBulbCountChange(parseInt(e.target.value) || 4)}
                min={4}
                max={22}
                className="w-12 h-8 text-sm text-center border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Number of bulbs"
              />
              <button
                onClick={() => handleBulbCountChange(bulbCount + 1)}
                disabled={bulbCount >= 22}
                className="w-8 h-8 text-sm font-medium border border-l-0 rounded-r disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent cursor-pointer"
                aria-label="Increase bulb count"
              >
                +
              </button>
            </div>

            {/* Color picker */}
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={onColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-8 h-8 border rounded cursor-pointer"
                title="Bulb color"
                aria-label="Bulb color"
              />
            </div>
          </div>
        )}

        {/* Right: controls */}
        <div className="pf-card__controls">
          <Button
            variant="outline"
            size="sm"
            className="pf-card__replay"
            data-role="replay"
            onClick={handleReplay}
            disabled={disableReplay}
            aria-disabled={disableReplay}
          >
            Replay
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown } from '@/components/ui/icons/ChevronDown'
import { memo, useEffect, useRef, useState, type ReactNode } from 'react'

type AnimationRenderProps = {
  bulbCount: number
  onColor: string
  prizeCount: number
}

type AnimationChild = ReactNode | ((props: AnimationRenderProps) => ReactNode)

interface AnimationCardProps {
  title: string
  description: string
  animationId: string
  tags?: string[]
  onReplay?: () => void
  infiniteAnimation?: boolean
  disableReplay?: boolean
  children: AnimationChild
}

const MIN_BULB_COUNT = 4
const MAX_BULB_COUNT = 22

const clampBulbCount = (value: number) => Math.max(MIN_BULB_COUNT, Math.min(MAX_BULB_COUNT, value))

const rgbToHex = (color: string): string | null => {
  const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/i)
  if (!rgbMatch) return null

  const channels = rgbMatch.slice(1, 4).map(Number)
  if (channels.some((channel) => Number.isNaN(channel) || channel < 0 || channel > 255)) return null

  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

const normalizeHexColor = (color: string): string | null => {
  const hexMatch = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!hexMatch) return null

  const normalized = hexMatch[1].toLowerCase()
  if (normalized.length === 3) {
    return `#${normalized
      .split('')
      .map((digit) => `${digit}${digit}`)
      .join('')}`
  }

  return `#${normalized}`
}

const resolveColorInputDefault = (tokenColor: string): string => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return ''

  const tokenMatch = tokenColor.match(/^var\((--[\w-]+)\)$/)
  if (tokenMatch) {
    const cssTokenValue = window.getComputedStyle(document.documentElement).getPropertyValue(tokenMatch[1]).trim()
    const normalizedTokenColor = normalizeHexColor(cssTokenValue) ?? rgbToHex(cssTokenValue)
    if (normalizedTokenColor) return normalizedTokenColor
  }

  const fallbackInput = document.createElement('input')
  fallbackInput.type = 'color'
  const fallbackValue = fallbackInput.value
  const probe = document.createElement('span')
  probe.style.color = tokenColor
  document.body.appendChild(probe)
  const resolvedColor = window.getComputedStyle(probe).color
  probe.remove()

  return rgbToHex(resolvedColor) ?? normalizeHexColor(fallbackValue) ?? fallbackValue
}

const renderAnimationChild = (
  child: AnimationChild,
  isVisible: boolean,
  infiniteAnimation: boolean,
  bulbCount: number,
  onColor: string,
  prizeCount: number
) => {
  if (!isVisible && !infiniteAnimation) return null
  if (typeof child === 'function') return child({ bulbCount, onColor, prizeCount })
  return child
}

type DescriptionProps = {
  description: string
  isExpanded: boolean
  onToggle: () => void
}

const Description = ({ description, isExpanded, onToggle }: DescriptionProps) => (
  <div className="flex items-start gap-2">
    <p className={`pf-card__description flex-1 m-0 transition-all duration-200 ${!isExpanded ? 'line-clamp-1' : ''}`}>
      {description}
    </p>
    <button
      type="button"
      onClick={onToggle}
      className="shrink-0 p-0 bg-transparent border-none cursor-pointer focus:outline-none mt-1"
      aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
    >
      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} text-[var(--pf-text-secondary)]/60`} />
    </button>
  </div>
)

type LightsControlsProps = {
  bulbCount: number
  onColor: string
  onBulbCountChange: (value: number) => void
  onColorChange: (color: string) => void
}

type PrizeCountControlsProps = {
  prizeCount: number
  onPrizeCountChange: (count: number) => void
}

const PRIZE_COUNT_OPTIONS = [1, 2, 3, 4] as const

const PrizeCountControls = ({ prizeCount, onPrizeCountChange }: PrizeCountControlsProps) => (
  <div className="flex items-center gap-1">
    {PRIZE_COUNT_OPTIONS.map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onPrizeCountChange(n)}
        className={`w-8 h-8 text-sm font-medium border rounded cursor-pointer hover:bg-accent ${n === prizeCount ? 'bg-accent border-primary' : ''}`}
        aria-label={`Show ${n} prize${n > 1 ? 's' : ''}`}
      >
        {n}
      </button>
    ))}
  </div>
)

const LightsControls = ({ bulbCount, onColor, onBulbCountChange, onColorChange }: LightsControlsProps) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => onBulbCountChange(bulbCount - 1)}
        disabled={bulbCount <= MIN_BULB_COUNT}
        className="w-8 h-8 text-sm font-medium border border-r-0 rounded-l disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent cursor-pointer"
        aria-label="Decrease bulb count"
      >
        -
      </button>
      <input
        type="number"
        value={bulbCount}
        onChange={(event) => onBulbCountChange(parseInt(event.target.value, 10) || MIN_BULB_COUNT)}
        min={MIN_BULB_COUNT}
        max={MAX_BULB_COUNT}
        className="w-12 h-8 text-sm text-center border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Number of bulbs"
      />
      <button
        type="button"
        onClick={() => onBulbCountChange(bulbCount + 1)}
        disabled={bulbCount >= MAX_BULB_COUNT}
        className="w-8 h-8 text-sm font-medium border border-l-0 rounded-r disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent cursor-pointer"
        aria-label="Increase bulb count"
      >
        +
      </button>
    </div>
    <div className="flex items-center gap-1">
      <input
        type="color"
        value={onColor}
        onChange={(event) => onColorChange(event.target.value)}
        className="w-8 h-8 border rounded cursor-pointer"
        title="Bulb color"
        aria-label="Bulb color"
      />
    </div>
  </div>
)

const useCardPlayback = (infiniteAnimation: boolean, onReplay?: () => void) => {
  const [replayKey, setReplayKey] = useState(0)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (infiniteAnimation) {
      setIsVisible(true)
      return
    }

    const node = cardRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
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

type CardControlsState = {
  bulbCount: number
  onColor: string
  prizeCount: number
  setBulbCount: (v: number) => void
  setOnColor: (v: string) => void
  setPrizeCount: (v: number) => void
  setReplayKey: React.Dispatch<React.SetStateAction<number>>
}

const useCardControls = (setReplayKey: React.Dispatch<React.SetStateAction<number>>): CardControlsState => {
  const [bulbCount, setBulbCount] = useState(16)
  const [onColor, setOnColor] = useState(() => resolveColorInputDefault('var(--pf-anim-gold)'))
  const [prizeCount, setPrizeCount] = useState(3)
  return { bulbCount, onColor, prizeCount, setBulbCount, setOnColor, setPrizeCount, setReplayKey }
}

type FooterControlsProps = {
  animationId: string
  controls: CardControlsState
  tags?: string[]
  disableReplay: boolean
  onReplay: () => void
}

const FooterControls = ({ animationId, controls, tags, disableReplay, onReplay }: FooterControlsProps) => {
  const isLightsAnimation = animationId.startsWith('lights__')
  const isPrizeCountAnimation = animationId === 'prize-reveal__chest-gc-sc' || animationId === 'prize-reveal__arcane-portal'
  const { bulbCount, onColor, prizeCount, setBulbCount, setOnColor, setPrizeCount, setReplayKey } = controls

  const handleBulbCountChange = (value: number) => { setBulbCount(clampBulbCount(value)); setReplayKey((k) => k + 1) }
  const handleColorChange = (color: string) => { setOnColor(color); setReplayKey((k) => k + 1) }
  const handlePrizeCountChange = (count: number) => { setPrizeCount(count); setReplayKey((k) => k + 1) }

  return (
    <CardFooter className="pf-card__actions p-0 pt-3">
      <div className="pf-card__meta">{tags?.map((tag) => <span key={tag}>{tag.toUpperCase()}</span>)}</div>
      {isLightsAnimation && (
        <LightsControls bulbCount={bulbCount} onColor={onColor} onBulbCountChange={handleBulbCountChange} onColorChange={handleColorChange} />
      )}
      {isPrizeCountAnimation && (
        <PrizeCountControls prizeCount={prizeCount} onPrizeCountChange={handlePrizeCountChange} />
      )}
      <div className="pf-card__controls">
        <Button type="button" variant="outline" size="sm" className="pf-card__replay" data-role="replay" onClick={onReplay} disabled={disableReplay} aria-disabled={disableReplay}>
          Replay
        </Button>
      </div>
    </CardFooter>
  )
}

const AnimationCardComponent = ({
  title,
  description,
  animationId,
  tags,
  children,
  onReplay,
  infiniteAnimation = false,
  disableReplay = false,
}: AnimationCardProps) => {
  const { cardRef, replayKey, isVisible, triggerReplay, setReplayKey } = useCardPlayback(infiniteAnimation, onReplay)
  const [isExpanded, setIsExpanded] = useState(false)
  const controls = useCardControls(setReplayKey)

  return (
    <Card className="pf-card" data-animation-id={animationId} ref={cardRef}>
      <span className="pf-card__overlay" aria-hidden="true" />
      <CardHeader className="p-0 pb-3 space-y-0">
        <CardTitle className="pf-card__title mb-1">{title}</CardTitle>
        <Description description={description} isExpanded={isExpanded} onToggle={() => setIsExpanded((expanded) => !expanded)} />
      </CardHeader>
      <CardContent className="p-0 py-3">
        <div className="pf-demo-canvas">
          <div key={replayKey} className="pf-demo-stage pf-demo-stage--top">
            {renderAnimationChild(children, isVisible, infiniteAnimation, controls.bulbCount, controls.onColor, controls.prizeCount)}
          </div>
        </div>
      </CardContent>
      <FooterControls animationId={animationId} controls={controls} tags={tags} disableReplay={disableReplay} onReplay={triggerReplay} />
    </Card>
  )
}

export const AnimationCard = memo(AnimationCardComponent)

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeIcon, CodeViewerModal } from '@/components/ui/CodeViewerModal'
import { ChevronDown } from '@/components/ui/icons/ChevronDown'
import type { AnimationControlType, SourceTab } from '@/types/animation'
import { toHex } from '@/utils/colors'
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

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
  controls?: AnimationControlType
  prizeCountMax?: number
  children: AnimationChild
  /** Lazy loader that resolves source tabs for the code viewer */
  sourceLoader?: () => Promise<SourceTab[]>
}

const MIN_BULB_COUNT = 4
const MAX_BULB_COUNT = 22

const clampBulbCount = (value: number) => Math.max(MIN_BULB_COUNT, Math.min(MAX_BULB_COUNT, value))

const resolveColorInputDefault = (tokenColor: string): string => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return ''

  // Resolve CSS var() first via getComputedStyle, then fall back to DOM probe
  const tokenMatch = tokenColor.match(/^var\((--[\w-]+)\)$/)
  if (tokenMatch) {
    const cssTokenValue = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(tokenMatch[1]!)
      .trim()
    if (cssTokenValue !== '') {
      try {
        return toHex(cssTokenValue)
      } catch {
        // CSS variable resolved to an unparseable value — fall through to DOM probe
      }
    }
  }

  // Fall back to DOM probe for any other color format
  try {
    return toHex(tokenColor)
  } catch {
    // Color could not be parsed (e.g., CSS variable not available in test env)
    return ''
  }
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
    <p
      className={`pf-card__description flex-1 m-0 transition-all duration-200 ${!isExpanded ? 'line-clamp-1' : ''}`}
      data-testid="card-description"
      data-expanded={isExpanded || undefined}
    >
      {description}
    </p>
    <button
      type="button"
      onClick={onToggle}
      className="shrink-0 p-0 bg-transparent border-none cursor-pointer focus:outline-none mt-1"
      aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
      data-testid="description-toggle"
    >
      <ChevronDown
        className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} text-[var(--pf-text-secondary)]/60`}
      />
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

const PrizeCountControls = ({
  prizeCount,
  onPrizeCountChange,
  maxCount = 4,
}: PrizeCountControlsProps & { maxCount?: number }) => (
  <div className="flex items-center gap-1" data-testid="prize-controls">
    {Array.from({ length: maxCount }, (_, i) => i + 1).map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onPrizeCountChange(n)}
        className={`w-8 h-8 text-sm font-medium border rounded cursor-pointer hover:bg-accent ${n === prizeCount ? 'bg-accent border-primary' : ''}`}
        aria-label={`Show ${n} prize${n > 1 ? 's' : ''}`}
        aria-pressed={n === prizeCount}
      >
        {n}
      </button>
    ))}
  </div>
)

const LightsControls = ({
  bulbCount,
  onColor,
  onBulbCountChange,
  onColorChange,
}: LightsControlsProps) => (
  <div className="flex items-center gap-2" data-testid="lights-controls">
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
        onChange={(event) => {
          const parsed = parseInt(event.target.value, 10)
          onBulbCountChange(Number.isNaN(parsed) ? MIN_BULB_COUNT : parsed)
        }}
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
  // Infinite animations are visible immediately; one-shot animations wait for
  // IntersectionObserver to confirm the card is in the viewport before playing.
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

type CardControlsState = {
  bulbCount: number
  onColor: string
  prizeCount: number
  setBulbCount: (v: number) => void
  setOnColor: (v: string) => void
  setPrizeCount: (v: number) => void
  setReplayKey: React.Dispatch<React.SetStateAction<number>>
}

const useCardControls = (
  setReplayKey: React.Dispatch<React.SetStateAction<number>>
): CardControlsState => {
  const [bulbCount, setBulbCount] = useState(16)
  const [onColor, setOnColor] = useState('')
  const [prizeCount, setPrizeCount] = useState(3)

  // Resolve CSS custom property to hex — requires DOM access, so runs in layout effect
  // rather than a state initializer to avoid side effects during render. The setState
  // here fires exactly once on mount to resolve var(--pf-anim-gold) through the DOM.
  useLayoutEffect(() => {
    setOnColor(resolveColorInputDefault('var(--pf-anim-gold)')) // eslint-disable-line @eslint-react/set-state-in-effect -- intentional mount-only DOM probe
  }, [])

  return { bulbCount, onColor, prizeCount, setBulbCount, setOnColor, setPrizeCount, setReplayKey }
}

type FooterControlsProps = {
  cardControls: CardControlsState
  controlType?: AnimationControlType
  prizeCountMax?: number
  tags?: string[]
  disableReplay: boolean
  onReplay: () => void
}

const FooterControls = ({
  cardControls,
  controlType,
  prizeCountMax,
  tags,
  disableReplay,
  onReplay,
}: FooterControlsProps) => {
  const { bulbCount, onColor, prizeCount, setBulbCount, setOnColor, setPrizeCount, setReplayKey } =
    cardControls

  const handleBulbCountChange = (value: number) => {
    setBulbCount(clampBulbCount(value))
    setReplayKey((k) => k + 1)
  }
  const handleColorChange = (color: string) => {
    setOnColor(color)
    setReplayKey((k) => k + 1)
  }
  const handlePrizeCountChange = (count: number) => {
    setPrizeCount(count)
    setReplayKey((k) => k + 1)
  }

  return (
    <CardFooter className="pf-card__actions p-0 pt-3">
      <div className="pf-card__meta" data-testid="card-meta">
        {tags?.map((tag) => (
          <span key={tag}>{tag.toUpperCase()}</span>
        ))}
      </div>
      {controlType === 'lights' && (
        <LightsControls
          bulbCount={bulbCount}
          onColor={onColor}
          onBulbCountChange={handleBulbCountChange}
          onColorChange={handleColorChange}
        />
      )}
      {controlType === 'prizeCount' && (
        <PrizeCountControls
          prizeCount={prizeCount}
          onPrizeCountChange={handlePrizeCountChange}
          maxCount={prizeCountMax ?? 4}
        />
      )}
      <div className="pf-card__controls" data-testid="card-controls">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="pf-card__replay"
          data-role="replay"
          data-testid="card-replay"
          onClick={onReplay}
          disabled={disableReplay}
          aria-disabled={disableReplay}
        >
          Replay
        </Button>
      </div>
    </CardFooter>
  )
}

const useCodeViewer = (sourceLoader?: () => Promise<SourceTab[]>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [sources, setSources] = useState<SourceTab[] | null>(null)

  const open = useCallback(async () => {
    if (!sourceLoader) return
    if (!sources) {
      setSources(await sourceLoader())
    }
    setIsOpen(true)
  }, [sourceLoader, sources])

  const close = useCallback(() => setIsOpen(false), [])

  return { isOpen, sources, open, close }
}

type CardHeaderBarProps = {
  title: string
  isExpanded: boolean
  description: string
  onToggle: () => void
  onOpenCode?: () => void
}

const CardHeaderBar = ({
  title,
  isExpanded,
  description,
  onToggle,
  onOpenCode,
}: CardHeaderBarProps) => (
  <CardHeader className="p-0 pb-3 space-y-0">
    <div className="flex items-center justify-between gap-2">
      <CardTitle className="pf-card__title mb-0" data-testid="card-title">
        {title}
      </CardTitle>
      {onOpenCode && (
        <button
          type="button"
          className="pf-card__code-btn"
          onClick={onOpenCode}
          aria-label="View source code"
          title="View source code"
          data-testid="code-viewer-btn"
        >
          <CodeIcon />
        </button>
      )}
    </div>
    <Description description={description} isExpanded={isExpanded} onToggle={onToggle} />
  </CardHeader>
)

const AnimationCardComponent = ({
  title,
  description,
  animationId,
  tags,
  children,
  onReplay,
  infiniteAnimation = false,
  disableReplay = false,
  controls: controlType,
  prizeCountMax,
  sourceLoader,
}: AnimationCardProps) => {
  const { cardRef, replayKey, isVisible, triggerReplay, setReplayKey } = useCardPlayback(
    infiniteAnimation,
    onReplay
  )
  const [isExpanded, setIsExpanded] = useState(false)
  const cardControls = useCardControls(setReplayKey)
  const codeViewer = useCodeViewer(sourceLoader)

  return (
    <Card className="pf-card" data-animation-id={animationId} ref={cardRef}>
      <span className="pf-card__overlay" aria-hidden="true" />
      <CardHeaderBar
        title={title}
        description={description}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((expanded) => !expanded)}
        onOpenCode={sourceLoader ? codeViewer.open : undefined}
      />
      <CardContent className="p-0 py-3">
        <div className="pf-demo-canvas" data-testid="card-canvas">
          <div
            key={replayKey}
            className="pf-demo-stage pf-demo-stage--top"
            data-testid="demo-stage"
          >
            {renderAnimationChild(
              children,
              isVisible,
              infiniteAnimation,
              cardControls.bulbCount,
              cardControls.onColor,
              cardControls.prizeCount
            )}
          </div>
        </div>
      </CardContent>
      <FooterControls
        cardControls={cardControls}
        controlType={controlType}
        prizeCountMax={prizeCountMax}
        tags={tags}
        disableReplay={disableReplay}
        onReplay={triggerReplay}
      />
      {codeViewer.isOpen &&
        codeViewer.sources &&
        codeViewer.sources.length > 0 &&
        createPortal(
          <CodeViewerModal
            sources={codeViewer.sources}
            title={title}
            onClose={codeViewer.close}
          />,
          document.body
        )}
    </Card>
  )
}

export const AnimationCard = memo(AnimationCardComponent)

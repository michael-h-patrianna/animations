import { sx } from '@/demo-ui/lib/sx'
import { CHECKERBOARD, MIN_STOPS } from '@/demo-ui/components/ui/gradientEditorColor'
import type { StopWithKey } from '@/demo-ui/components/ui/gradientEditorTypes'

/**
 *
 */
export function StopList({
  stops,
  selectedIndex,
  onSelectStop,
  onRemoveStop,
  onStopPositionChange,
}: {
  stops: StopWithKey[]
  selectedIndex: number
  onSelectStop: (index: number) => void
  onRemoveStop: (index: number) => void
  onStopPositionChange: (index: number, position: number) => void
}) {
  return (
    <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto">
      {stops.map((stop, i) => (
        <div
          key={stop.key}
          data-testid={`gradient-stop-${String(i)}`}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
            i === selectedIndex
              ? 'relative z-10 bg-[var(--bg-active)] outline outline-1 outline-accent/40'
              : 'hover:bg-[var(--bg-hover)]'
          }`}
          onClick={() => onSelectStop(i)}
        >
          <div className="w-5 h-5 rounded border border-border-default shrink-0 relative overflow-hidden">
            <div
              className="absolute inset-0 -z-10"
              style={sx({ backgroundImage: `url(${CHECKERBOARD})`, opacity: 0.4 })}
            />
            <div className="absolute inset-0" style={sx({ backgroundColor: stop.color })} />
          </div>

          <span className="text-xs font-mono text-text-secondary flex-1 truncate">
            {stop.color}
          </span>

          <div className="flex items-center gap-0.5">
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={Math.round(stop.position)}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                if (!Number.isNaN(val)) {
                  onStopPositionChange(i, Math.max(0, Math.min(100, val)))
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-10 bg-transparent text-xs font-mono text-text-primary outline-none text-right [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-xs text-text-tertiary">%</span>
          </div>

          {stops.length > MIN_STOPS && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemoveStop(i)
              }}
              className="text-text-tertiary hover:text-danger text-sm p-1 shrink-0 transition-colors"
              aria-label={`Remove stop ${i + 1}`}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

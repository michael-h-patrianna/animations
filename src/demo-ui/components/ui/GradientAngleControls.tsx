import type { LinearGradientValue } from '@/types/gradient'
import { interpolateColorAtPosition } from '@/demo-ui/components/ui/gradientEditorColor'

/** Gradient angle slider and number input (0–359°). */
export function AngleControl({
  angle,
  onChange,
}: {
  angle: number
  onChange: (angle: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-tertiary font-medium shrink-0">Angle</span>
      <input
        type="range"
        min={0}
        max={359}
        step={1}
        value={angle}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        data-testid="gradient-angle-slider"
        className="flex-1 h-1.5 accent-[var(--accent)] cursor-pointer"
        aria-label="Gradient angle"
      />
      <div className="flex items-center gap-0.5">
        <input
          type="number"
          min={0}
          max={360}
          step={1}
          value={angle}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10)
            if (!Number.isNaN(val)) onChange(((val % 360) + 360) % 360)
          }}
          className="w-10 bg-[var(--bg-hover)] border border-border-default rounded px-1 py-0.5 text-xs font-mono text-text-primary outline-none text-right [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-xs text-text-tertiary">°</span>
      </div>
    </div>
  )
}

/** Adds a new color stop midway between the last two stops. */
export function AddStopButton({
  value,
  onAdd,
}: {
  value: LinearGradientValue
  onAdd: (pos: number, color: string) => void
}) {
  return (
    <button
      onClick={() => {
        const sorted = value.stops.slice().sort((a, b) => a.position - b.position)
        const pos =
          sorted.length >= 2
            ? (sorted[sorted.length - 2]!.position + sorted[sorted.length - 1]!.position) / 2
            : 50
        onAdd(pos, interpolateColorAtPosition(sorted, pos))
      }}
      data-testid="gradient-add-stop"
      className="text-xs text-accent hover:text-accent/80 transition-colors self-start"
    >
      + Add color stop
    </button>
  )
}

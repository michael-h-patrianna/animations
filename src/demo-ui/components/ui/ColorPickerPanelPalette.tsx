import { m as MotionEl } from 'motion/react'
import { sx } from '@/demo-ui/lib/sx'
import { CHECKERBOARD } from '@/demo-ui/components/ui/colorPickerPanelConstants'

/**
 *
 */
export function PaletteHistory({
  palette,
  history,
  onSelect,
}: {
  palette: string[]
  history: string[]
  onSelect: (c: string) => void
}) {
  return (
    <div className="space-y-2 pt-1">
      <div className="flex gap-1 justify-between">
        {palette.map((c) => (
          <MotionEl.button
            data-testid="color-picker-hsv-change"
            key={c}
            onClick={() => {
              onSelect(c)
            }}
            className="w-6 h-6 rounded-md border border-border-subtle hover:scale-110 hover:border-border-strong transition-all shadow-sm"
            style={sx({ backgroundColor: c })}
            title={c}
          />
        ))}
      </div>
      {history.length > 0 && (
        <div className="flex gap-1.5 flex-wrap pt-2 border-t border-border-subtle">
          {history.map((c) => (
            <MotionEl.button
              data-testid="color-picker-hsv-change-2"
              key={c}
              onClick={() => {
                onSelect(c)
              }}
              className="w-5 h-5 rounded-full border border-border-default hover:scale-110 hover:border-border-strong transition-all shadow-sm relative overflow-hidden"
              title="History"
            >
              <div
                className="absolute inset-0 -z-10"
                style={sx({ backgroundImage: `url(${CHECKERBOARD})`, opacity: 0.4 })}
              />
              <div className="absolute inset-0" style={sx({ backgroundColor: c })} />
            </MotionEl.button>
          ))}
        </div>
      )}
    </div>
  )
}

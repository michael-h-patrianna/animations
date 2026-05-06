import type React from 'react'
import { m as MotionEl } from 'motion/react'
import { isValidHex, parseColorToHsv, rgbToHex, type RGBA } from '@/demo-ui/lib/colors/colorUtils'
import type { ColorPickerState } from '@/demo-ui/lib/useColorPickerState'

/**
 *
 */
export function ColorInputs({
  state,
  disableAlpha,
  value,
}: {
  state: ColorPickerState
  disableAlpha: boolean
  value: string
}) {
  const { hsv, mode, setMode, hexInput, setHexInput, rgbInput, setRgbInput, handleHsvChange } =
    state

  const handleAlphaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10)
    const clamped = Number.isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed))
    handleHsvChange({ ...hsv, a: clamped / 100 })
  }

  const handleRgbInput = (channel: 'r' | 'g' | 'b', e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10)
    const val = Number.isNaN(parsed) ? 0 : Math.min(255, Math.max(0, parsed))
    const newRgb = { ...rgbInput, [channel]: val }
    setRgbInput(newRgb as RGBA)
    handleHsvChange(parseColorToHsv(rgbToHex(newRgb.r, newRgb.g, newRgb.b)))
  }

  return (
    <div className="flex flex-col gap-2 bg-[var(--bg-hover)] p-2 rounded-lg border border-border-subtle">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex bg-[var(--bg-active)] rounded p-0.5">
          {(['HEX', 'RGB'] as const).map((m) => (
            <MotionEl.button
              data-testid="color-picker-mode"
              key={m}
              onClick={() => {
                setMode(m)
              }}
              className={`px-2 py-0.5 text-[9px] font-bold rounded-sm transition-all ${mode === m ? 'bg-[var(--bg-active)] text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
            >
              {m}
            </MotionEl.button>
          ))}
        </div>
      </div>
      {mode === 'HEX' && (
        <div className="flex gap-2">
          <div className="flex-1 bg-[var(--bg-hover)] border border-border-default rounded px-2 py-1 flex items-center gap-2 group-focus-within:border-accent/50 transition-colors">
            <span className="text-[10px] text-text-tertiary font-mono select-none">#</span>
            <MotionEl.input
              type="text"
              value={hexInput.replace('#', '')}
              onChange={(e) => {
                const val = '#' + e.target.value
                setHexInput(val)
                if (isValidHex(val)) handleHsvChange(parseColorToHsv(val))
              }}
              onBlur={() => {
                if (!isValidHex(hexInput)) setHexInput(value)
              }}
              onFocus={(e) => {
                e.target.select()
              }}
              className="w-full bg-transparent text-xs font-mono text-text-primary outline-none uppercase"
              spellCheck={false}
            />
          </div>
          {!disableAlpha && (
            <div className="w-14 bg-[var(--bg-hover)] border border-border-default rounded px-1 py-1 flex items-center gap-1 group-focus-within:border-accent/50 transition-colors">
              <span className="text-[9px] text-text-tertiary font-bold">%</span>
              <MotionEl.input
                type="number"
                min={0}
                max={100}
                value={Math.round(hsv.a * 100)}
                onChange={handleAlphaInput}
                className="w-full bg-transparent text-xs font-mono text-text-primary outline-none text-right [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          )}
        </div>
      )}
      {mode === 'RGB' && (
        <div className="flex gap-1.5">
          {(['r', 'g', 'b'] as const).map((c) => (
            <div
              key={c}
              className="flex-1 bg-[var(--bg-hover)] border border-border-default rounded px-1 py-1 flex items-center gap-1"
            >
              <span className="text-[9px] text-text-tertiary uppercase font-bold">{c}</span>
              <MotionEl.input
                type="number"
                min={0}
                max={255}
                value={rgbInput[c]}
                onChange={(e) => {
                  handleRgbInput(c, e)
                }}
                className="w-full bg-transparent text-xs font-mono text-text-primary outline-none text-right [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          ))}
          {!disableAlpha && (
            <div className="w-12 bg-[var(--bg-hover)] border border-border-default rounded px-1 py-1 flex items-center gap-1">
              <span className="text-[9px] text-text-tertiary uppercase font-bold">a</span>
              <MotionEl.input
                type="number"
                min={0}
                max={100}
                value={Math.round(hsv.a * 100)}
                onChange={handleAlphaInput}
                className="w-full bg-transparent text-xs font-mono text-text-primary outline-none text-right [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

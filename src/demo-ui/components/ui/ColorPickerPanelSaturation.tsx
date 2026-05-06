import type React from 'react'
import { m as MotionEl } from 'motion/react'
import type { HSVA } from '@/demo-ui/lib/colors/colorUtils'
import { sx } from '@/demo-ui/lib/sx'
import {
  CHECKERBOARD,
  HUE_GRADIENT,
  NOISE_BG,
} from '@/demo-ui/components/ui/colorPickerPanelConstants'

/**
 *
 */
export function SaturationArea({
  hsv,
  svRef,
  onMouseDown,
  onHsvChange,
}: {
  hsv: HSVA
  svRef: React.RefObject<HTMLDivElement | null>
  onMouseDown: (e: React.MouseEvent) => void
  onHsvChange: (hsv: HSVA) => void
}) {
  const STEP = 0.02
  const handleKeyDown = (e: React.KeyboardEvent) => {
    let { s, v } = hsv
    switch (e.key) {
      case 'ArrowRight':
        s = Math.min(1, s + STEP)
        break
      case 'ArrowLeft':
        s = Math.max(0, s - STEP)
        break
      case 'ArrowUp':
        v = Math.min(1, v + STEP)
        break
      case 'ArrowDown':
        v = Math.max(0, v - STEP)
        break
      case 'Home':
        s = 0
        v = 0
        break
      case 'End':
        s = 1
        v = 1
        break
      default:
        return
    }
    e.preventDefault()
    onHsvChange({ ...hsv, s, v })
  }

  return (
    <div
      data-testid="color-picker-saturation"
      ref={svRef}
      className="w-full h-[160px] rounded-lg relative cursor-crosshair overflow-hidden shadow-lg ring-1 ring-border-default group"
      onMouseDown={onMouseDown}
      onKeyDown={handleKeyDown}
      style={sx({ backgroundColor: `hsl(${String(hsv.h * 360)}, 100%, 50%)` })}
      role="application"
      aria-label={`Saturation ${String(Math.round(hsv.s * 100))}%, Brightness ${String(Math.round(hsv.v * 100))}%`}
      aria-roledescription="2D color area"
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      <div
        className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
        style={sx({ backgroundImage: NOISE_BG })}
      />
      <div
        className="absolute w-4 h-4 rounded-full shadow-lg border-2 border-text-primary pointer-events-none -translate-x-1/2 -translate-y-1/2 transform transition-transform duration-75 ease-out group-active:scale-75"
        style={sx({ left: `${String(hsv.s * 100)}%`, top: `${String((1 - hsv.v) * 100)}%` })}
      />
    </div>
  )
}

/**
 *
 */
export function ColorSliders({
  hsv,
  disableAlpha,
  onHsvChange,
}: {
  hsv: HSVA
  disableAlpha: boolean
  onHsvChange: (hsv: HSVA) => void
}) {
  return (
    <div className="space-y-3" data-testid="color-picker-sliders">
      <div className="h-3 rounded-full relative overflow-hidden ring-1 ring-border-default cursor-pointer group">
        <div className="absolute inset-0" style={sx({ background: HUE_GRADIENT })} />
        <MotionEl.input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={hsv.h}
          onChange={(e) => {
            onHsvChange({ ...hsv, h: parseFloat(e.target.value) })
          }}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
          aria-label="Hue"
        />
        <div
          className="absolute top-0 bottom-0 w-2 h-full bg-white shadow-md rounded-full pointer-events-none -translate-x-1/2 transition-transform group-active:scale-110"
          style={sx({ left: `${String(hsv.h * 100)}%` })}
        />
      </div>
      {!disableAlpha && (
        <div className="h-3 rounded-full relative overflow-hidden ring-1 ring-border-default cursor-pointer group">
          <div
            className="absolute inset-0 z-0"
            style={sx({ backgroundImage: `url(${CHECKERBOARD})`, opacity: 0.4 })}
          />
          <div
            className="absolute inset-0 z-1"
            style={sx({
              background: 'linear-gradient(to right, #ffffff, #000000)',
            })}
          />
          <MotionEl.input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={hsv.a}
            onChange={(e) => {
              onHsvChange({ ...hsv, a: parseFloat(e.target.value) })
            }}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20"
            aria-label="Opacity"
          />
          <div
            className="absolute top-0 bottom-0 w-2 h-full bg-white shadow-md rounded-full pointer-events-none -translate-x-1/2 z-30 transition-transform group-active:scale-110"
            style={sx({ left: `${String(hsv.a * 100)}%` })}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Standalone color picker panel (no popover wrapper).
 *
 * This is the "guts" of the ColorPicker: saturation area, hue/alpha sliders,
 * hex/RGB inputs, palette, and history. Used directly inside ColorPicker's
 * Popover and by GradientEditor for per-stop color editing.
 */

import React, { useCallback, useState } from 'react'
import { parseColorToHsv } from '@/demo-ui/lib/colors/colorUtils'
import { useColorPickerState } from '@/demo-ui/lib/useColorPickerState'
import { sx } from '@/demo-ui/lib/sx'
import {
  ColorInputs,
  ColorSliders,
  PaletteHistory,
  PanelHeader,
  SaturationArea,
} from '@/demo-ui/components/ui/ColorPickerPanelControls'
import { copyColor, pickEyedropper } from '@/demo-ui/components/ui/colorPickerPanelActions'
import { useSaturationDrag } from '@/demo-ui/components/ui/useSaturationDrag'

/** Props for the standalone color picker panel (no popover). */
export interface ColorPickerPanelProps {
  value: string
  onChange: (value: string) => void
  /** Optional label - only shown when `showHeader` is true. */
  label?: string
  alpha?: number
  onChangeAlpha?: (alpha: number) => void
  disableAlpha?: boolean
  /** Show the header with before/after swatch, eyedropper, copy. Default true. */
  showHeader?: boolean
  /** Show palette and history rows. Default true. */
  showPalette?: boolean
  /** Width of the panel. Default 260. */
  width?: number
}

export const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
  value,
  onChange,
  alpha,
  onChangeAlpha,
  disableAlpha = false,
  showHeader = true,
  showPalette = true,
  width = 260,
}) => {
  const state = useColorPickerState({ value, onChange, alpha, onChangeAlpha, disableAlpha })
  const { hsv, handleHsvChange } = state
  const { svRef, handleSaturationMouseDown } = useSaturationDrag(hsv, handleHsvChange)

  const [initialColor] = useState(value)
  const handleEyedropper = useCallback(() => pickEyedropper(handleHsvChange), [handleHsvChange])
  const handleCopy = useCallback(() => copyColor(value), [value])

  return (
    <div
      data-testid="color-picker-panel"
      className="p-3 flex flex-col gap-3 select-none text-text-primary"
      style={sx({ width: `${String(width)}px` })}
    >
      {showHeader && (
        <PanelHeader
          initialColor={initialColor}
          value={value}
          onEyedropper={handleEyedropper}
          onCopy={handleCopy}
        />
      )}
      <SaturationArea
        hsv={hsv}
        svRef={svRef}
        onMouseDown={handleSaturationMouseDown}
        onHsvChange={handleHsvChange}
      />
      <ColorSliders hsv={hsv} disableAlpha={disableAlpha} onHsvChange={handleHsvChange} />
      <ColorInputs state={state} disableAlpha={disableAlpha} value={value} />
      {showPalette && (
        <PaletteHistory
          palette={state.palette}
          history={state.history}
          onSelect={(c) => {
            handleHsvChange(parseColorToHsv(c))
          }}
        />
      )}
    </div>
  )
}

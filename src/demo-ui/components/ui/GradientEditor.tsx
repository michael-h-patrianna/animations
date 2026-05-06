/**
 * Figma-style linear gradient editor.
 *
 * Features:
 * - Preview bar with draggable stop markers (Motion drag)
 * - Scrollable stop list with color swatch, position %, delete
 * - Angle slider
 * - Inline color picker panel for the selected stop (side-by-side layout)
 */

import type React from 'react'
import type { LinearGradientValue } from '@/types/gradient'
import { MAX_STOPS } from '@/demo-ui/components/ui/gradientEditorColor'
import { useGradientEditorState } from '@/demo-ui/components/ui/useGradientEditorState'
import {
  AddStopButton,
  AngleControl,
  GradientPreviewBar,
  StopColorPanel,
  StopList,
} from '@/demo-ui/components/ui/GradientEditorSections'

/** Props for the gradient editor panel. */
export interface GradientEditorProps {
  value: LinearGradientValue
  onChange: (value: LinearGradientValue) => void
}

export const GradientEditor: React.FC<GradientEditorProps> = ({ value, onChange }) => {
  const state = useGradientEditorState(value, onChange)

  return (
    <div className="flex gap-0" data-testid="gradient-editor">
      <div className="flex flex-col gap-3 p-3 w-[240px] select-none text-text-primary">
        <GradientPreviewBar
          gradient={value}
          stops={state.stopsWithKeys}
          selectedIndex={state.selectedIndex}
          onSelectStop={state.handleSelectStop}
          onStopPositionChange={state.handleStopPositionChange}
          onAddStop={state.handleAddStop}
        />
        <StopList
          stops={state.stopsWithKeys}
          selectedIndex={state.selectedIndex}
          onSelectStop={state.handleSelectStop}
          onRemoveStop={state.handleRemoveStop}
          onStopPositionChange={state.handleStopPositionChange}
        />
        <AngleControl angle={value.angle} onChange={state.handleAngleChange} />
        {value.stops.length < MAX_STOPS && (
          <AddStopButton value={value} onAdd={state.handleAddStop} />
        )}
      </div>
      {state.editingStopColor && state.selectedStop != null && (
        <StopColorPanel
          index={state.selectedIndex}
          color={state.selectedStop.color}
          onChange={state.handleStopColorChange}
          onClose={() => state.setEditingStopColor(false)}
        />
      )}
    </div>
  )
}

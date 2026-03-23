import { memo, type RefObject } from 'react'
import type { DemoPreset } from './SharedModalOpenLogic'

/**
 * Shared demo trigger button row for all modal-open animations.
 * Renders preset buttons; click handler wired by the parent via useModalOpenLogic.
 */
function SharedDemoTriggersComponent({
  presets,
  buttonListRef,
  onClickButton,
}: {
  presets: readonly DemoPreset[]
  buttonListRef: RefObject<(HTMLButtonElement | null)[]>
  onClickButton: (i: number) => void
}) {
  return (
    <div className="pf-mo-trigger-row">
      {presets.map((btn, i) => (
        <button
          key={btn.label}
          ref={(el) => {
            buttonListRef.current[i] = el
          }}
          type="button"
          className="pf-mo-trigger"
          onClick={() => onClickButton(i)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  )
}

export const SharedDemoTriggers = memo(SharedDemoTriggersComponent)

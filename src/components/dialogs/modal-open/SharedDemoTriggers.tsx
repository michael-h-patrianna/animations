import { memo, type RefObject } from 'react'
import type { DemoPreset } from './SharedModalOpenLogic'

/**
 * Shared demo trigger button row for all modal-open animations.
 * Renders preset buttons; click handler wired by the parent via useModalOpenLogic.
 */
function SharedDemoTriggersComponent({
  presets,
  btnRefs,
  onClickButton,
}: {
  presets: readonly DemoPreset[]
  btnRefs: RefObject<(HTMLButtonElement | null)[]>
  onClickButton: (i: number) => void
}) {
  return (
    <div className="pf-mo-trigger-row">
      {presets.map((btn, i) => (
        <button
          key={btn.label}
          ref={(el) => { btnRefs.current[i] = el }}
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

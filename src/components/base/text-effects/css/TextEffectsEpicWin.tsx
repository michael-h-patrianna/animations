import { memo } from 'react'
import './TextEffectsEpicWin.css'

/**
 * Standalone: Copy this file + TextEffectsEpicWin.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsEpicWinComponent({ text = 'EPIC WIN', color }: { text?: string; color?: string }) {
  return (
    <div
      className="tfe-epic-win tfe-epic-win--animate"
      data-animation-id="text-effects__epic-win"
      style={color !== undefined ? { '--text-effects-epic-win-color': color } as React.CSSProperties : undefined}
    >
      <div className="tfe-epic-win__text-container">
        {/* Layered shadow elements for depth */}
        <div className="tfe-epic-win__shadow-far">{text}</div>
        <div className="tfe-epic-win__shadow-mid">{text}</div>

        {/* Main metallic gradient text with per-character animation */}
        <div className="tfe-epic-win__main-text">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="tfe-epic-win__char"
              style={{ '--char-index': index } as React.CSSProperties}
            >
              <span className="tfe-epic-win__char-inner">
                {char === ' ' ? '\u00A0' : char}
                <span className="tfe-epic-win__char-glow" />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export const TextEffectsEpicWin = memo(TextEffectsEpicWinComponent)

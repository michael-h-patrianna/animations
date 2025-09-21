/**
 * Standalone: Copy this file and TextEffectsVerbJump.css into your app.
 * Runtime deps: react (no external splitting lib)
 * RN parity: transforms/opacity only; recreate CSS keyframes in Reanimated as needed.
 */
import React from 'react';
import './TextEffectsCharIndexDelays.css';
import './TextEffectsVerbJump.css';

export function TextEffectsVerbJump() {
  const text = 'LOREM IPSUM DOLOR';

  const letters = React.useMemo(() => Array.from(text), [text]);

  return (
    <div
      className="verbJump"
      data-animation-id="text-effects__verb-jumping"
      aria-label={text}
    >
  <div className="verbJump__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className={`verbJump__char i-${i}`}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TextEffectsVerbJump;

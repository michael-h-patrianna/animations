/**
 * Standalone: Copy this file and TextEffectsVerbJog.css into your app.
 */
import React from 'react';
import './TextEffectsVerbJog.css';

export function TextEffectsVerbJog() {
  const text = 'LOREM IPSUM DOLOR';
  const letters = React.useMemo(() => Array.from(text), [text]);
  return (
    <div className="verbJog" data-animation-id="text-effects__verb-jogging" aria-label={text}>
      <div className="verbJog__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className="verbJog__char">
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TextEffectsVerbJog;

/**
 * Standalone: Copy this file and TextEffectsVerbFloat.css into your app.
 * Runtime deps: react (no external splitting lib)
 */
import React from 'react';
import './TextEffectsVerbFloat.css';

export function TextEffectsVerbFloat() {
  const text = 'LOREM IPSUM DOLOR';
  const letters = React.useMemo(() => Array.from(text), [text]);

  return (
    <div className="verbFloat" data-animation-id="text-effects__verb-floating" aria-label={text}>
      <div className="verbFloat__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className="verbFloat__char">
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TextEffectsVerbFloat;

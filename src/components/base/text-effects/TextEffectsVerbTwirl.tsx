/**
 * Standalone: Copy this file and TextEffectsVerbTwirl.css into your app.
 */
import React from 'react';
import './TextEffectsVerbTwirl.css';

export function TextEffectsVerbTwirl() {
  const text = 'LOREM IPSUM DOLOR';
  const letters = React.useMemo(() => Array.from(text), [text]);
  return (
    <div className="verbTwirl" data-animation-id="text-effects__verb-twirling" aria-label={text}>
      <div className="verbTwirl__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className="verbTwirl__char">
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TextEffectsVerbTwirl;

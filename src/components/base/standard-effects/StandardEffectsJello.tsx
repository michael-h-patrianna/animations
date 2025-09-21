import React from 'react';
import './standard-effects.css';
import jelloWobble from '@/assets/animations/standard-effects/jello-wobble.png';

export function StandardEffectsJello() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element jello-element">
        <img src={jelloWobble} alt="Jello wobble" className="demo-icon-image" />
        <div className="demo-text">Wobble</div>
      </div>
    </div>
  );
}
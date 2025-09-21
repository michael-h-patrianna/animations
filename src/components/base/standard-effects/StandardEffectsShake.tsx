import React from 'react';
import './standard-effects.css';
import shakeIcon from '@/assets/animations/standard-effects/shake-warning.png';

export function StandardEffectsShake() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element shake-element">
        <img src={shakeIcon} alt="Error" className="demo-icon-image" />
        <div className="demo-text">Error State</div>
      </div>
    </div>
  );
}
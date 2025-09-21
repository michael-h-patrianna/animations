import React from 'react';
import './standard-effects.css';
import wiggleBell from '@/assets/animations/standard-effects/wiggle-bell.png';

export function StandardEffectsWiggle() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element wiggle-element">
        <img src={wiggleBell} alt="Wiggle bell" className="demo-icon-image" />
        <div className="demo-text">Attention</div>
      </div>
    </div>
  );
}
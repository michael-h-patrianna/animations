import React from 'react';
import './standard-effects.css';
import popBurst from '@/assets/animations/standard-effects/pop-burst.png';

export function StandardEffectsPop() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element pop-element">
        <img src={popBurst} alt="Pop burst" className="demo-icon-image" />
        <div className="demo-text">Emphasis</div>
      </div>
    </div>
  );
}
import React from 'react';
import './standard-effects.css';
import rubberBand from '@/assets/animations/standard-effects/rubber-band.png';

export function StandardEffectsRubberBand() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element rubber-band-element">
        <img src={rubberBand} alt="Rubber band" className="demo-icon-image" />
        <div className="demo-text">Elastic Snap</div>
      </div>
    </div>
  );
}
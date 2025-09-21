import React from 'react';
import './standard-effects.css';
import floatBalloon from '/Users/Spare/Documents/graphics/baby animals and christmas/PNG/1.png';

export function StandardEffectsFloat() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element float-element">
        <img src={floatBalloon} alt="Float balloon" className="demo-icon-image" />
        <div className="demo-text">Hovering</div>
      </div>
    </div>
  );
}
import React from 'react';
import './standard-effects.css';
import swingPendulum from '@/assets/animations/standard-effects/swing-pendulum.png';

export function StandardEffectsSwing() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element swing-element">
        <img src={swingPendulum} alt="Swing pendulum" className="demo-icon-image" />
        <div className="demo-text">Pendulum</div>
      </div>
    </div>
  );
}
import React from 'react';
import './standard-effects.css';
import pulseHeart from '/Users/Spare/Documents/graphics/adventure-game-3d-icon-2024-09-12-17-19-47-utc/Roll Paper.png';

export function StandardEffectsPulse() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element pulse-element">
        <img src={pulseHeart} alt="Pulse heart" className="demo-icon-image" />
        <div className="demo-text">Heartbeat</div>
      </div>
    </div>
  );
}
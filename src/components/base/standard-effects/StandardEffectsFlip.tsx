import React from 'react';
import './standard-effects.css';
import flipCard from '@/assets/animations/standard-effects/flip-card.png';

export function StandardEffectsFlip() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element flip-element">
        <img src={flipCard} alt="Flip card" className="demo-icon-image" />
        <div className="demo-text">Card Flip</div>
      </div>
    </div>
  );
}
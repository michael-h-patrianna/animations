import { useEffect, useRef } from 'react';
import './standard-effects.css';

export function StandardEffectsSuccessBounce() {
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger success bounce animation on mount
    if (feedbackRef.current) {
      const feedback = feedbackRef.current;
      
      // Reset any existing animation
      feedback.style.animation = 'none';
      void feedback.offsetWidth; // Force reflow
      
      // Apply success bounce animation
      feedback.style.animation = 'success-bounce-soft 520ms cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
    }
  }, []);

  return (
    <div className="modal-content-overlay">
      <div className="modal-content-modal">
        <div className="modal-content-header">
          <h4 className="modal-content-title">Sequence Control</h4>
          <span className="modal-content-badge">Modal</span>
        </div>
        <div className="modal-content-body">
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
          <div
            ref={feedbackRef}
            className="modal-content-feedback success"
          >
            Profile saved successfully!
          </div>
        </div>
        <div className="modal-content-footer">
          <button className="modal-content-button modal-content-button-primary">
            Accept
          </button>
          <button className="modal-content-button modal-content-button-secondary">
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

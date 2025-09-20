import { useEffect, useRef } from 'react';
import './modal-content.css';

export function ModalContentSuccessBounceEnergetic() {
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger success bounce animation on mount
    if (feedbackRef.current) {
      const feedback = feedbackRef.current;
      
      // Reset any existing animation
      feedback.style.animation = 'none';
      void feedback.offsetWidth; // Force reflow
      
      // Apply success bounce animation
      feedback.style.animation = 'success-bounce-energetic 620ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
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

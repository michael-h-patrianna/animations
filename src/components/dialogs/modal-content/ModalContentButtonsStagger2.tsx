import { useEffect, useRef } from 'react';
import './modal-content.css';

export function ModalContentButtonsStagger2() {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // Trigger staggered animation on mount
    buttonRefs.current.forEach((button, index) => {
      if (button) {
        // Reset any existing animation
        button.style.animation = 'none';
        void button.offsetWidth; // Force reflow
        
        // Apply staggered animation with 70ms base delay + 300ms modal delay
        const delay = 300 + (70 * index);
        button.style.animation = `button-stagger 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards ${delay}ms`;
        button.style.opacity = '0';
        button.style.transform = 'translateY(16px) scale(0.94)';
      }
    });
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
        </div>
        <div className="modal-content-footer">
          <button
            ref={(el) => buttonRefs.current[0] = el}
            className="modal-content-button modal-content-button-primary"
          >
            Primary
          </button>
          <button
            ref={(el) => buttonRefs.current[1] = el}
            className="modal-content-button modal-content-button-secondary"
          >
            Secondary
          </button>
        </div>
      </div>
    </div>
  );
}

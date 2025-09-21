import { useEffect, useRef } from 'react';
import './modal-content.css';

export function ModalContentFormFieldRightReveal() {
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // Trigger right reveal animation on mount
    fieldRefs.current.forEach((field, index) => {
      if (field) {
        // Reset any existing animation
        field.style.animation = 'none';
        void field.offsetWidth; // Force reflow
        
        // Apply right reveal animation with staggered delay + 300ms modal delay
        const delay = 300 + (90 * index);
        field.style.animation = `form-field-right-reveal 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards ${delay}ms`;
        field.style.opacity = '0';
        field.style.transform = 'translateX(32px)';
      }
    });

    // Trigger button stagger animation after form fields complete
    buttonRefs.current.forEach((button, index) => {
      if (button) {
        // Reset any existing animation
        button.style.animation = 'none';
        void button.offsetWidth; // Force reflow
        
        // Apply staggered animation with 750ms base delay + 70ms stagger
        const delay = 750 + (70 * index);
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
          <div className="modal-content-form">
            <div
              ref={(el) => { fieldRefs.current[0] = el; }}
              className="modal-content-field"
            >
              <label>Field 1</label>
              <input type="text" defaultValue="Input" />
            </div>
            <div
              ref={(el) => { fieldRefs.current[1] = el; }}
              className="modal-content-field"
            >
              <label>Field 2</label>
              <input type="text" defaultValue="Input" />
            </div>
            <div
              ref={(el) => { fieldRefs.current[2] = el; }}
              className="modal-content-field"
            >
              <label>Field 3</label>
              <input type="text" defaultValue="Input" />
            </div>
            <div
              ref={(el) => { fieldRefs.current[3] = el; }}
              className="modal-content-field"
            >
              <label>Field 4</label>
              <input type="text" defaultValue="Input" />
            </div>
          </div>
        </div>
        <div className="modal-content-footer">
          <button
            ref={(el) => { buttonRefs.current[0] = el; }}
            className="modal-content-button modal-content-button-primary"
          >
            Accept
          </button>
          <button
            ref={(el) => { buttonRefs.current[1] = el; }}
            className="modal-content-button modal-content-button-secondary"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

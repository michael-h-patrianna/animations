import { useEffect, useRef } from 'react';
import './modal-content.css';

export function ModalContentFormFieldLeftReveal() {
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Trigger left reveal animation on mount
    fieldRefs.current.forEach((field, index) => {
      if (field) {
        // Reset any existing animation
        field.style.animation = 'none';
        void field.offsetWidth; // Force reflow
        
        // Apply left reveal animation with staggered delay
        const delay = 90 * index;
        field.style.animation = `form-field-left-reveal 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards ${delay}ms`;
        field.style.opacity = '0';
        field.style.transform = 'translateX(-32px)';
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
              ref={(el) => fieldRefs.current[0] = el}
              className="modal-content-field"
            >
              <label>Field 1</label>
              <input type="text" defaultValue="Input" />
            </div>
            <div
              ref={(el) => fieldRefs.current[1] = el}
              className="modal-content-field"
            >
              <label>Field 2</label>
              <input type="text" defaultValue="Input" />
            </div>
            <div
              ref={(el) => fieldRefs.current[2] = el}
              className="modal-content-field"
            >
              <label>Field 3</label>
              <input type="text" defaultValue="Input" />
            </div>
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

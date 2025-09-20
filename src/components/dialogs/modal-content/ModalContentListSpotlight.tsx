import { useEffect, useRef } from 'react';
import './modal-content.css';

export function ModalContentListSpotlight() {
  const listItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Trigger spotlight animation on mount
    listItemRefs.current.forEach((item, index) => {
      if (item) {
        // Reset any existing animation
        item.style.animation = 'none';
        void item.offsetWidth; // Force reflow
        
        // Apply spotlight animation with staggered delay + 300ms modal delay
        const delay = 300 + (120 * index);
        item.style.animation = `list-spotlight 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards ${delay}ms`;
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        item.style.filter = 'brightness(0.7)';
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
          <div className="modal-content-list">
            <div
              ref={(el) => listItemRefs.current[0] = el}
              className="modal-content-list-item"
            >
              Milestone 1
            </div>
            <div
              ref={(el) => listItemRefs.current[1] = el}
              className="modal-content-list-item"
            >
              Milestone 2
            </div>
            <div
              ref={(el) => listItemRefs.current[2] = el}
              className="modal-content-list-item"
            >
              Milestone 3
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

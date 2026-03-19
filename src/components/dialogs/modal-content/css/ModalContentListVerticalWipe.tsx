import { useEffect, useRef } from 'react'
import './ModalContentListVerticalWipe.css'
export function ModalContentListVerticalWipe() {
  const items = ['Introduction complete', 'Profile configured', 'Preferences set', 'Ready to begin']
  const listItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    listItemsRef.current.forEach((item, index) => {
      if (item) {
        item.style.animation = 'none'
        void item.offsetWidth
        const delay = 300 + 80 * index
        item.style.animation = `list-vertical-wipe 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards ${delay}ms`
        item.style.opacity = '0'
        item.style.transform = 'scaleY(0)'
        item.style.transformOrigin = 'top'
      }
    })
    if (buttonRef.current) {
      const btn = buttonRef.current
      btn.style.animation = 'none'
      void btn.offsetWidth
      btn.style.animation = `button-stagger 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards 700ms`
      btn.style.opacity = '0'
      btn.style.transform = 'translateY(16px) scale(0.94)'
    }
  }, [])
  return (
    <div className="modal-content-overlay" data-animation-id="modal-content__list-vertical-wipe">
      <div className="modal-content-modal">
        <div className="modal-content-header">
          <h4 className="modal-content-title">Setup Complete</h4>
          <span className="modal-content-badge">Modal</span>
        </div>
        <div className="modal-content-body">
          <div className="modal-content-list">
            {items.map((item, index) => (
              <div
                key={index}
                ref={(el) => {
                  listItemsRef.current[index] = el
                }}
                className="modal-content-list-item"
                style={{ overflow: 'hidden' }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-content-footer">
          <button
            type="button"
            ref={(el) => {
              buttonRef.current = el
            }}
            className="modal-content-button modal-content-button-primary"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

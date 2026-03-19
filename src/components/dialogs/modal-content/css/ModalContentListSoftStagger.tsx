import { useEffect, useRef } from 'react'
import './ModalContentListSoftStagger.css'
export function ModalContentListSoftStagger() {
  const items = [
    'Privacy settings updated',
    'Two-factor authentication enabled',
    'Email notifications configured',
    'Profile picture updated',
    'Timezone set to UTC',
  ]
  const listItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    listItemsRef.current.forEach((item, index) => {
      if (item) {
        item.style.animation = 'none'
        void item.offsetWidth
        const delay = 300 + 60 * index
        item.style.animation = `list-soft-stagger 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards ${delay}ms`
        item.style.opacity = '0'
        item.style.transform = 'translateY(16px)'
      }
    })
    if (buttonRef.current) {
      const btn = buttonRef.current
      btn.style.animation = 'none'
      void btn.offsetWidth
      btn.style.animation = `button-stagger 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards 600ms`
      btn.style.opacity = '0'
      btn.style.transform = 'translateY(16px) scale(0.94)'
    }
  }, [])
  return (
    <div className="modal-content-overlay" data-animation-id="modal-content__list-soft-stagger">
      <div className="modal-content-modal">
        <div className="modal-content-header">
          <h4 className="modal-content-title">Recent Changes</h4>
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
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

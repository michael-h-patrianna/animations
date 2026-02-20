import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseFlip3d.css'

/**
 *
 */
export function ModalBaseFlip3d() {
  return (
    <div className="modal-base-flip3d" data-animation-id="modal-base__flip-3d">
      <div className="modal-base-flip3d__center">
        <div className="modal-base-flip3d__modal">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}


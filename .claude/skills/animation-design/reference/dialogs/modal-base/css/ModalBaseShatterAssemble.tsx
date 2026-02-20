import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseShatterAssemble.css'


export function ModalBaseShatterAssemble() {
  return (
    <div className="pf-modal-overlay pf-modal-shatter-overlay" data-animation-id="modal-base__shatter-assemble">
      <div className="pf-modal-center">
        <div className="pf-modal pf-modal-shatter">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}


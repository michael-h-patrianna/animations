import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseSlideUpSoft.css'


export function ModalBaseSlideUpSoft() {
  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--slide-up-soft"
      data-animation-id="modal-base__slide-up-soft"
    >
      <div className="pf-modal-center">
        <div className="pf-modal pf-modal--slide-up-soft">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}


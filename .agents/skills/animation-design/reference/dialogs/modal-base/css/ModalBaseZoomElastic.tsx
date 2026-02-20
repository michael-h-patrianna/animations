import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseZoomElastic.css'


export function ModalBaseZoomElastic() {
  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--zoom-elastic"
      data-animation-id="modal-base__zoom-elastic"
    >
      <div className="pf-modal-center">
        <div className="pf-modal pf-modal--zoom-elastic">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}


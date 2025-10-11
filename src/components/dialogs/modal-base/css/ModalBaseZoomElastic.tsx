import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseZoomElastic.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__zoom-elastic',
  title: 'Elastic Zoom Bounce',
  description: 'Mobile game style zoom with elastic bounce physics and overshoot.',
  tags: ['css'],
}

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

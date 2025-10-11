import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseShatterAssemble.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__shatter-assemble',
  title: 'Shatter Assembly',
  description: 'Glass fragments coalesce into modal with rotation effects.',
  tags: ['css'],
}

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

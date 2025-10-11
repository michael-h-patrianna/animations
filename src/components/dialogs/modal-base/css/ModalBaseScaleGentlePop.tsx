import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseScaleGentlePop.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__scale-gentle-pop',
  title: 'Gentle Scale Pop',
  description:
    'Scale entrance from 85% with fade-in using CSS keyframes. GPU-accelerated with transform and opacity.',
  tags: ['css'],
}

export function ModalBaseScaleGentlePop() {
  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--scale-gentle-pop"
      data-animation-id="modal-base__scale-gentle-pop"
    >
      <div className="pf-modal-center">
        <div className="pf-modal pf-modal--scale-gentle-pop">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}

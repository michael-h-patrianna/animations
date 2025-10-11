import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsSwing.css'

export function StandardEffectsSwing() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-swing-element">
        <div className="demo-text">Swing</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__swing',
  title: 'Swing',
  description: 'Pendulum arc swing with axis rotation and momentum lean for hanging elements.',
  tags: ['css'],
}

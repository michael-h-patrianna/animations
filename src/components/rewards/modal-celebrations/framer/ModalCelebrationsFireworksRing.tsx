
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useMemo } from 'react'

/**
 *
 */
export function ModalCelebrationsFireworksRing() {
const rings = useMemo(
    () => [
      { id: 0, scale: 3.2, delay: 0 },
      { id: 1, scale: 2.2, delay: 0.12 },
    ],
    []
  )
  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {rings.map((ring) => (
          <m.span
            key={ring.id}
            className="pf-celebration__ring"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{
              scale: ring.scale,
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: 1.6,
              delay: ring.delay,
              times: [0, 0.2, 1],
              ease: easeOut,
            }}
          />
        ))}
      </div>
    </div>
  )
}


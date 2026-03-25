import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

interface RecordedMotionDiv {
  className?: string
  transition?: unknown
}

interface ValueTransition {
  duration?: number
  delay?: number
  times?: number[]
}

interface CoinMagnetTransition {
  x?: ValueTransition
  y?: ValueTransition
  scale?: ValueTransition
  opacity?: ValueTransition
}

const recordedMotionDivs: RecordedMotionDiv[] = []

vi.mock('motion/react', () => ({
  useReducedMotion: () => false,
}))

vi.mock('motion/react-m', async () => {
  const React = await import('react')

  interface MockMotionDivProps extends React.HTMLAttributes<HTMLDivElement> {
    initial?: unknown
    animate?: unknown
    transition?: unknown
    onAnimationComplete?: () => void
  }

  function MockMotionDiv({
    children,
    className,
    initial: _initial,
    animate: _animate,
    transition,
    onAnimationComplete: _onAnimationComplete,
    ref,
    ...rest
  }: MockMotionDivProps & { ref?: React.Ref<HTMLDivElement> }) {
    recordedMotionDivs.push({
      className: typeof className === 'string' ? className : undefined,
      transition,
    })

    return (
      <div ref={ref} className={className} {...rest}>
        {children}
      </div>
    )
  }

  return { div: MockMotionDiv }
})

import { metadata as cssCoinMagnetMetadata } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinMagnet.meta'
import { CollectionEffectsCoinMagnet } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinMagnet'
import { metadata as framerCoinMagnetMetadata } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinMagnet.meta'

function getDurationDefault(
  props: ReadonlyArray<{
    name: string
    default?: unknown
  }> = []
) {
  return props.find((prop) => prop.name === 'duration')?.default
}

describe('collection effects coin magnet parity', () => {
  beforeEach(() => {
    recordedMotionDivs.length = 0
  })

  it('keeps the framer duration control aligned with the CSS metadata default', () => {
    expect(getDurationDefault(framerCoinMagnetMetadata.props)).toBe(1333)
    expect(getDurationDefault(framerCoinMagnetMetadata.props)).toBe(
      getDurationDefault(cssCoinMagnetMetadata.props)
    )
  })

  it('uses explicit per-property timing for framer magnet particles', async () => {
    render(
      <CollectionEffectsCoinMagnet
        count={1}
        from={{ x: 24, y: 24 }}
        to={{ x: 180, y: 48 }}
        particleImages={[]}
      />
    )

    await waitFor(() => {
      expect(
        recordedMotionDivs.some((entry) => entry.className === 'pf-coin-magnet__particle')
      ).toBe(true)
    })

    const particle = recordedMotionDivs.find(
      (entry) => entry.className === 'pf-coin-magnet__particle'
    )
    const transition = particle?.transition as CoinMagnetTransition | undefined

    expect(transition?.x?.duration).toBeCloseTo(1.333, 3)
    expect(transition?.y?.duration).toBeCloseTo(1.333, 3)
    expect(transition?.scale?.duration).toBeCloseTo(1.333, 3)
    expect(transition?.opacity?.duration).toBeCloseTo(1.333, 3)

    expect(transition?.x?.delay).toBe(0)
    expect(transition?.y?.delay).toBe(0)
    expect(transition?.scale?.delay).toBe(0)
    expect(transition?.opacity?.delay).toBe(0)
  })
})

/**
 * Regression coverage for getPropOverrides stale-asset refresh.
 *
 * The inspector replaces persisted Vite asset URLs (`/assets/...`) with the
 * current build's defaults so a content-hash bump after a redeploy doesn't 404.
 * Earlier versions wiped the entire `images` array as soon as a single element
 * looked stale, destroying user-typed URLs sitting alongside an asset URL.
 * These tests pin the per-element refresh contract.
 */
import {
  AnimationInspectorProvider,
  useAnimationInspector,
} from '@/contexts/AnimationInspectorContext'
import type { Animation, Group, PropConfig } from '@/types/animation'
import { render } from '@testing-library/react'
import { useEffect } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

const STORAGE_KEY = 'animation-catalog-inspector'

afterEach(() => {
  localStorage.removeItem(STORAGE_KEY)
})

function makeGroup(animation: Animation): Group {
  return {
    id: 'test-group-framer',
    title: 'Test Group',
    tech: 'framer',
    animations: [animation],
  }
}

function makeAnimation(props: PropConfig[]): Animation {
  return {
    id: 'test-group__images',
    title: 'Images Animation',
    description: 'Holds an images-typed prop',
    categoryId: 'rewards',
    groupId: 'test-group-framer',
    urlSlugFramer: '/test-group-framer?animation=test-group__images',
    urlSlugCss: '/test-group-css?animation=test-group__images',
    props,
  }
}

function Probe({
  animation,
  ref,
}: {
  animation: Animation
  ref: { current: Record<string, unknown> | undefined }
}) {
  const { selectAnimation, getPropOverrides } = useAnimationInspector()

  useEffect(() => {
    selectAnimation(animation)
    // selectAnimation triggers ensureOverrides synchronously inside the
    // provider; on the next call getPropOverrides reflects the persisted
    // state mutated through the stale-asset refresh path.
    ref.current = getPropOverrides(animation.id, animation.props)
  }, [selectAnimation, getPropOverrides, animation, ref])

  return null
}

function readOverrides(animation: Animation): Record<string, unknown> | undefined {
  const group = makeGroup(animation)
  const ref: { current: Record<string, unknown> | undefined } = { current: undefined }
  render(
    <AnimationInspectorProvider currentGroup={group}>
      <Probe animation={animation} ref={ref} />
    </AnimationInspectorProvider>
  )
  return ref.current
}

describe('getPropOverrides — stale asset refresh', () => {
  it('preserves user URLs sitting next to a stale /assets/ entry in an images array', () => {
    const animation = makeAnimation([
      {
        type: 'images',
        name: 'particleImages',
        label: 'Particle Images',
        default: ['/assets/coin-NEW.webp'],
        maxItems: 5,
      },
    ])

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        [animation.id]: {
          particleImages: ['/assets/coin-OLD.webp', 'https://custom.example/sparkle.png'],
        },
      })
    )

    const overrides = readOverrides(animation)

    expect(overrides?.particleImages).toEqual([
      '/assets/coin-NEW.webp',
      'https://custom.example/sparkle.png',
    ])
  })

  it('keeps a non-asset persisted images array unchanged', () => {
    const animation = makeAnimation([
      {
        type: 'images',
        name: 'particleImages',
        label: 'Particle Images',
        default: ['/assets/coin-NEW.webp'],
        maxItems: 5,
      },
    ])

    const userArray = ['https://custom.example/a.png', 'https://custom.example/b.png']
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        [animation.id]: { particleImages: userArray },
      })
    )

    const overrides = readOverrides(animation)
    expect(overrides?.particleImages).toEqual(userArray)
  })

  it('keeps user-supplied items past the freshDefaults length intact', () => {
    const animation = makeAnimation([
      {
        type: 'images',
        name: 'particleImages',
        label: 'Particle Images',
        default: ['/assets/coin-NEW.webp'],
        maxItems: 5,
      },
    ])

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        [animation.id]: {
          particleImages: [
            '/assets/coin-OLD.webp',
            'https://custom.example/a.png',
            'https://custom.example/b.png',
          ],
        },
      })
    )

    const overrides = readOverrides(animation)
    expect(overrides?.particleImages).toEqual([
      '/assets/coin-NEW.webp',
      'https://custom.example/a.png',
      'https://custom.example/b.png',
    ])
  })
})

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TextEffectsVerbFall as CssVerbFall } from '@/components/base/text-effects/css/TextEffectsVerbFall'
import { TextEffectsVerbFlip as CssVerbFlip } from '@/components/base/text-effects/css/TextEffectsVerbFlip'
import { TextEffectsVerbFloat as CssVerbFloat } from '@/components/base/text-effects/css/TextEffectsVerbFloat'
import { TextEffectsVerbJog as CssVerbJog } from '@/components/base/text-effects/css/TextEffectsVerbJog'
import { TextEffectsVerbJump as CssVerbJump } from '@/components/base/text-effects/css/TextEffectsVerbJump'
import { TextEffectsVerbTwirl as CssVerbTwirl } from '@/components/base/text-effects/css/TextEffectsVerbTwirl'
import { TextEffectsVerbFall as FramerVerbFall } from '@/components/base/text-effects/framer/TextEffectsVerbFall'
import { TextEffectsVerbFlip as FramerVerbFlip } from '@/components/base/text-effects/framer/TextEffectsVerbFlip'
import { TextEffectsVerbFloat as FramerVerbFloat } from '@/components/base/text-effects/framer/TextEffectsVerbFloat'
import { TextEffectsVerbJog as FramerVerbJog } from '@/components/base/text-effects/framer/TextEffectsVerbJog'
import { TextEffectsVerbJump as FramerVerbJump } from '@/components/base/text-effects/framer/TextEffectsVerbJump'
import { TextEffectsVerbTwirl as FramerVerbTwirl } from '@/components/base/text-effects/framer/TextEffectsVerbTwirl'
import { toHex } from '@/utils/colors'

// Framer components rely on group-level CSS side effects in production, so tests
// import the matching layout CSS directly to exercise their rendered character styles.
import '@/components/base/text-effects/framer/TextEffectsVerbFall.css'
import '@/components/base/text-effects/framer/TextEffectsVerbFlip.css'
import '@/components/base/text-effects/framer/TextEffectsVerbFloat.css'
import '@/components/base/text-effects/framer/TextEffectsVerbJog.css'
import '@/components/base/text-effects/framer/TextEffectsVerbJump.css'
import '@/components/base/text-effects/framer/TextEffectsVerbTwirl.css'

type VerbColorComponent = React.ComponentType<{
  text?: string
  color?: string
}>

interface VerbColorCase {
  name: string
  Component: VerbColorComponent
  charSelector: string
}

const DEFAULT_COLOR = '#e8e4da'
const CUSTOM_COLOR = '#ff6600'

const CASES: VerbColorCase[] = [
  {
    name: 'CSS jump',
    Component: CssVerbJump,
    charSelector: '.tfx-jump-char',
  },
  {
    name: 'CSS jog',
    Component: CssVerbJog,
    charSelector: '.tfx-jog-char',
  },
  {
    name: 'CSS float',
    Component: CssVerbFloat,
    charSelector: '.tfx-float-char',
  },
  {
    name: 'CSS flip',
    Component: CssVerbFlip,
    charSelector: '.tfx-flip-char',
  },
  {
    name: 'CSS fall',
    Component: CssVerbFall,
    charSelector: '.tfx-fall-char',
  },
  {
    name: 'CSS twirl',
    Component: CssVerbTwirl,
    charSelector: '.tfx-twirl-char',
  },
  {
    name: 'Framer jump',
    Component: FramerVerbJump,
    charSelector: '.pf-verb-jump__char',
  },
  {
    name: 'Framer jog',
    Component: FramerVerbJog,
    charSelector: '.pf-verb-jog__char',
  },
  {
    name: 'Framer float',
    Component: FramerVerbFloat,
    charSelector: '.pf-verb-float__char',
  },
  {
    name: 'Framer flip',
    Component: FramerVerbFlip,
    charSelector: '.pf-verb-flip__char',
  },
  {
    name: 'Framer fall',
    Component: FramerVerbFall,
    charSelector: '.pf-verb-fall__char',
  },
  {
    name: 'Framer twirl',
    Component: FramerVerbTwirl,
    charSelector: '.pf-verb-twirl__char',
  },
]

function expectAllCharacterColors(
  container: HTMLElement,
  selector: string,
  expectedColor: string
) {
  const chars = Array.from(container.querySelectorAll(selector))

  expect(chars.length).toBeGreaterThan(0)

  for (const char of chars) {
    expect(toHex(getComputedStyle(char).color)).toBe(expectedColor)
  }
}

describe('TextEffects verb color overrides', () => {
  it.each(CASES)('keeps the default character color in $name', ({ Component, charSelector }) => {
    const { container } = render(<Component text="GO" />)

    expectAllCharacterColors(container, charSelector, DEFAULT_COLOR)
  })

  it.each(CASES)(
    'applies a custom color override to the rendered characters in $name',
    ({ Component, charSelector }) => {
      const { container } = render(<Component text="GO" color={CUSTOM_COLOR} />)

      expectAllCharacterColors(container, charSelector, CUSTOM_COLOR)
    }
  )
})

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TextEffectsVerbFalling as CssVerbFall } from '@/components/base/text-effects/css/TextEffectsVerbFalling'
import { TextEffectsVerbFlipping as CssVerbFlip } from '@/components/base/text-effects/css/TextEffectsVerbFlipping'
import { TextEffectsVerbFloating as CssVerbFloat } from '@/components/base/text-effects/css/TextEffectsVerbFloating'
import { TextEffectsVerbJogging as CssVerbJog } from '@/components/base/text-effects/css/TextEffectsVerbJogging'
import { TextEffectsVerbJumping as CssVerbJump } from '@/components/base/text-effects/css/TextEffectsVerbJumping'
import { TextEffectsVerbTwirling as CssVerbTwirl } from '@/components/base/text-effects/css/TextEffectsVerbTwirling'
import { TextEffectsVerbFalling as FramerVerbFall } from '@/components/base/text-effects/framer/TextEffectsVerbFalling'
import { TextEffectsVerbFlipping as FramerVerbFlip } from '@/components/base/text-effects/framer/TextEffectsVerbFlipping'
import { TextEffectsVerbFloating as FramerVerbFloat } from '@/components/base/text-effects/framer/TextEffectsVerbFloating'
import { TextEffectsVerbJogging as FramerVerbJog } from '@/components/base/text-effects/framer/TextEffectsVerbJogging'
import { TextEffectsVerbJumping as FramerVerbJump } from '@/components/base/text-effects/framer/TextEffectsVerbJumping'
import { TextEffectsVerbTwirling as FramerVerbTwirl } from '@/components/base/text-effects/framer/TextEffectsVerbTwirling'
import { toHex } from '@/utils/colors'

// CSS module imports for layout styles needed by getComputedStyle
import '@/components/base/text-effects/framer/TextEffectsVerbFalling.module.css'
import '@/components/base/text-effects/framer/TextEffectsVerbFlipping.module.css'
import '@/components/base/text-effects/framer/TextEffectsVerbFloating.module.css'
import '@/components/base/text-effects/framer/TextEffectsVerbJogging.module.css'
import '@/components/base/text-effects/framer/TextEffectsVerbJumping.module.css'
import '@/components/base/text-effects/framer/TextEffectsVerbTwirling.module.css'

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

// CSS modules hash class names but always include the original name.
// Use [class*="name"] attribute selectors to match hashed classes.
const CASES: VerbColorCase[] = [
  {
    name: 'CSS jump',
    Component: CssVerbJump,
    charSelector: '[class*="tfx-jump-char"]',
  },
  {
    name: 'CSS jog',
    Component: CssVerbJog,
    charSelector: '[class*="tfx-jog-char"]',
  },
  {
    name: 'CSS float',
    Component: CssVerbFloat,
    charSelector: '[class*="tfx-float-char"]',
  },
  {
    name: 'CSS flip',
    Component: CssVerbFlip,
    charSelector: '[class*="tfx-flip-char"]',
  },
  {
    name: 'CSS fall',
    Component: CssVerbFall,
    charSelector: '[class*="tfx-fall-char"]',
  },
  {
    name: 'CSS twirl',
    Component: CssVerbTwirl,
    charSelector: '[class*="tfx-twirl-char"]',
  },
  {
    name: 'Framer jump',
    Component: FramerVerbJump,
    charSelector: '[class*="pf-verb-jump-fm__char"]',
  },
  {
    name: 'Framer jog',
    Component: FramerVerbJog,
    charSelector: '[class*="pf-verb-jog-fm__char"]',
  },
  {
    name: 'Framer float',
    Component: FramerVerbFloat,
    charSelector: '[class*="pf-verb-float-fm__char"]',
  },
  {
    name: 'Framer flip',
    Component: FramerVerbFlip,
    charSelector: '[class*="pf-verb-flip-fm__char"]',
  },
  {
    name: 'Framer fall',
    Component: FramerVerbFall,
    charSelector: '[class*="pf-verb-fall-fm__char"]',
  },
  {
    name: 'Framer twirl',
    Component: FramerVerbTwirl,
    charSelector: '[class*="pf-verb-twirl-fm__char"]',
  },
]

function expectAllCharacterColors(container: HTMLElement, selector: string, expectedColor: string) {
  const chars = Array.from(container.querySelectorAll(selector))

  expect(chars.length).toBeGreaterThanOrEqual(2)

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

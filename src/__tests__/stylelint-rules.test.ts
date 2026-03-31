/**
 * Tests for custom Stylelint rules in stylelint-rules/.
 *
 * Verifies that the project's custom CSS lint rules catch patterns they're
 * designed to catch and pass clean CSS. Uses stylelint.lint() directly.
 */

import stylelint from 'stylelint'
import { describe, it, expect } from 'vitest'
import { noBlurRule } from '../../stylelint-rules/no-blur.js'
import { noConicGradientRule } from '../../stylelint-rules/no-conic-gradient.js'
import { noHardcodedColorsRule } from '../../stylelint-rules/no-hardcoded-colors.js'
import { noZIndexMagicRule } from '../../stylelint-rules/no-z-index-magic.js'
import { noIgnoredDisplayPropertiesRule } from '../../stylelint-rules/no-ignored-display-properties.js'
import { noImportantInKeyframesRule } from '../../stylelint-rules/no-important-in-keyframes.js'
import { requireFramerClassSuffixRule } from '../../stylelint-rules/require-framer-class-suffix.js'

/** Helper to lint CSS with a single custom rule. */
async function lintWithRule(
  code: string,
  ruleName: string,
  plugin: stylelint.Plugin,
  codeFilename?: string
): Promise<stylelint.LintResult> {
  const result = await stylelint.lint({
    code,
    config: {
      plugins: [plugin],
      rules: { [ruleName]: true },
    },
    codeFilename,
  })
  return result.results[0]!
}

// ── no-z-index-magic ─────────────────────────────────────────────────────

describe('stylelint: no-z-index-magic', () => {
  const ruleName = 'animation-rules/no-z-index-magic'

  it('allows z-index values 1-100', async () => {
    const result = await lintWithRule('.a { z-index: 10; }', ruleName, noZIndexMagicRule)
    expect(result.warnings).toHaveLength(0)
  })

  it('allows z-index: auto', async () => {
    const result = await lintWithRule('.a { z-index: auto; }', ruleName, noZIndexMagicRule)
    expect(result.warnings).toHaveLength(0)
  })

  it('allows z-index with var()', async () => {
    const result = await lintWithRule(
      '.a { z-index: var(--z-overlay); }',
      ruleName,
      noZIndexMagicRule
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('rejects z-index: 999', async () => {
    const result = await lintWithRule('.a { z-index: 999; }', ruleName, noZIndexMagicRule)
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0]!.text).toContain('999')
  })

  it('rejects z-index: 9999', async () => {
    const result = await lintWithRule('.a { z-index: 9999; }', ruleName, noZIndexMagicRule)
    expect(result.warnings).toHaveLength(1)
  })

  it('rejects z-index: -101', async () => {
    const result = await lintWithRule('.a { z-index: -101; }', ruleName, noZIndexMagicRule)
    expect(result.warnings).toHaveLength(1)
  })
})

// ── no-hardcoded-colors ──────────────────────────────────────────────────

describe('stylelint: no-hardcoded-colors', () => {
  const ruleName = 'animation-rules/no-hardcoded-colors'

  it('allows CSS custom properties', async () => {
    const result = await lintWithRule(
      '.a { color: var(--text-primary); }',
      ruleName,
      noHardcodedColorsRule
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('allows transparent/currentcolor', async () => {
    const result = await lintWithRule(
      '.a { color: transparent; background-color: currentColor; }',
      ruleName,
      noHardcodedColorsRule
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('allows var() with hex fallback', async () => {
    const result = await lintWithRule(
      '.a { color: var(--text-primary, #fff); }',
      ruleName,
      noHardcodedColorsRule
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('rejects hardcoded hex', async () => {
    const result = await lintWithRule('.a { color: #ff0000; }', ruleName, noHardcodedColorsRule)
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0]!.text).toContain('Hardcoded color')
  })

  it('rejects hardcoded rgb()', async () => {
    const result = await lintWithRule(
      '.a { background-color: rgb(255, 0, 0); }',
      ruleName,
      noHardcodedColorsRule
    )
    expect(result.warnings).toHaveLength(1)
  })

  it('allows non-color properties with hex values', async () => {
    // Only color-related properties are checked
    const result = await lintWithRule('.a { content: "#ff0000"; }', ruleName, noHardcodedColorsRule)
    expect(result.warnings).toHaveLength(0)
  })
})

// ── no-blur ──────────────────────────────────────────────────────────────

describe('stylelint: no-blur', () => {
  const ruleName = 'animation-rules/no-blur'

  it('allows non-blur filters', async () => {
    const result = await lintWithRule('.a { filter: brightness(1.2); }', ruleName, noBlurRule)
    expect(result.warnings).toHaveLength(0)
  })

  it('allows static blur outside @keyframes', async () => {
    const result = await lintWithRule('.a { filter: blur(4px); }', ruleName, noBlurRule)
    expect(result.warnings).toHaveLength(0)
  })

  it('rejects blur() inside @keyframes', async () => {
    const result = await lintWithRule(
      '@keyframes fadeBlur { 0% { filter: blur(10px); } 100% { filter: blur(0); } }',
      ruleName,
      noBlurRule
    )
    expect(result.warnings).toHaveLength(2)
  })

  it('rejects backdrop-filter: blur() inside @keyframes', async () => {
    const result = await lintWithRule(
      '@keyframes blurIn { 0% { backdrop-filter: blur(10px); } 100% { backdrop-filter: blur(0); } }',
      ruleName,
      noBlurRule
    )
    expect(result.warnings).toHaveLength(2)
  })
})

// ── no-conic-gradient ────────────────────────────────────────────────────

describe('stylelint: no-radial-angular-gradient', () => {
  const ruleName = 'animation-rules/no-radial-angular-gradient'

  it('allows linear-gradient', async () => {
    const result = await lintWithRule(
      '.a { background: linear-gradient(to right, red, blue); }',
      ruleName,
      noConicGradientRule
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('allows radial-gradient', async () => {
    const result = await lintWithRule(
      '.a { background: radial-gradient(circle, red, blue); }',
      ruleName,
      noConicGradientRule
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('rejects conic-gradient', async () => {
    const result = await lintWithRule(
      '.a { background: conic-gradient(from 0deg, red, blue); }',
      ruleName,
      noConicGradientRule
    )
    expect(result.warnings).toHaveLength(1)
  })
})

// ── no-important-in-keyframes ────────────────────────────────────────────

describe('stylelint: no-important-in-keyframes', () => {
  const ruleName = 'animation-rules/no-important-in-keyframes'

  it('allows !important in regular rules', async () => {
    const result = await lintWithRule(
      '.a { color: red !important; }',
      ruleName,
      noImportantInKeyframesRule
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('rejects !important inside @keyframes', async () => {
    const result = await lintWithRule(
      '@keyframes fadeIn { 0% { opacity: 0 !important; } 100% { opacity: 1; } }',
      ruleName,
      noImportantInKeyframesRule
    )
    expect(result.warnings).toHaveLength(1)
  })
})

// ── no-ignored-display-properties ────────────────────────────────────────

describe('stylelint: no-ignored-display-properties', () => {
  const ruleName = 'animation-rules/no-ignored-display-properties'

  it('allows width with display: block', async () => {
    const result = await lintWithRule(
      '.a { display: block; width: 100px; }',
      ruleName,
      noIgnoredDisplayPropertiesRule
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('rejects width/height with display: inline', async () => {
    const result = await lintWithRule(
      '.a { display: inline; width: 100px; height: 50px; }',
      ruleName,
      noIgnoredDisplayPropertiesRule
    )
    expect(result.warnings).toHaveLength(2)
  })

  it('rejects top/left with position: static', async () => {
    const result = await lintWithRule(
      '.a { position: static; top: 10px; left: 20px; }',
      ruleName,
      noIgnoredDisplayPropertiesRule
    )
    expect(result.warnings).toHaveLength(2)
  })
})

// ── require-framer-class-suffix ──────────────────────────────────────────

describe('stylelint: require-framer-class-suffix', () => {
  const ruleName = 'animation-rules/require-framer-class-suffix'

  it('allows -fm suffixed classes in framer/ files', async () => {
    const result = await lintWithRule(
      '.pf-ripple-fm { opacity: 1; }',
      ruleName,
      requireFramerClassSuffixRule,
      'src/components/rewards/collection-effects/framer/Ripple.module.css'
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('rejects non-fm classes in framer/ files', async () => {
    const result = await lintWithRule(
      '.pf-ripple { opacity: 1; }',
      ruleName,
      requireFramerClassSuffixRule,
      'src/components/rewards/collection-effects/framer/Ripple.module.css'
    )
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0]!.text).toContain('-fm')
  })

  it('skips non-framer files', async () => {
    const result = await lintWithRule(
      '.pf-ripple { opacity: 1; }',
      ruleName,
      requireFramerClassSuffixRule,
      'src/components/rewards/collection-effects/css/Ripple.module.css'
    )
    expect(result.warnings).toHaveLength(0)
  })
})

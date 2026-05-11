/**
 * Tests for custom ESLint rules in eslint-rules/.
 *
 * Uses ESLint's RuleTester to verify that the project's custom lint rules
 * catch the patterns they're designed to catch and pass clean code.
 * These rules are governance tools — if they silently break during an
 * ESLint upgrade, project quality degrades without CI noticing.
 *
 * RuleTester.run() creates its own describe/it blocks, so each call
 * must be at module top level or inside a describe() — never inside it().
 */

import { RuleTester } from 'eslint'
import { describe, it, expect } from 'vitest'
import { rules } from '../../eslint-rules/animation-rules.js'
import { stripVarFallbacks } from '../../eslint-rules/strip-var-fallbacks.js'

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
})

// ── stripVarFallbacks ───────────────────────────────────────────────────

describe('stripVarFallbacks', () => {
  it('removes var fallbacks while preserving template interpolation text', () => {
    expect(stripVarFallbacks('color: var(--fg, #fff) ${token};')).toBe(
      'color: var(--stripped) ${token};'
    )
  })

  it('removes nested function fallbacks', () => {
    expect(stripVarFallbacks('box-shadow: 0 0 4px var(--shadow, rgb(0, 0, 0));')).toBe(
      'box-shadow: 0 0 4px var(--stripped);'
    )
  })
})

// ── no-hardcoded-colors ──────────────────────────────────────────────────

describe('no-hardcoded-colors', () => {
  ruleTester.run('no-hardcoded-colors', rules['no-hardcoded-colors'], {
    valid: [
      {
        code: 'const x = "var(--color-primary)"',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
      },
      {
        code: 'const x = "hello world"',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
      },
      {
        code: 'const x = "var(--color, #fff)"',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
      },
      {
        code: 'const x = `color: var(--color, #fff); transform: translateX(${offset}px)`',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
      },
    ],
    invalid: [
      {
        code: 'const x = "#ff0000"',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
        errors: [{ message: /Hardcoded color/ }],
      },
      {
        code: 'const x = "rgb(255, 0, 0)"',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
        errors: [{ message: /Hardcoded color/ }],
      },
      {
        code: 'const x = "border: 1px solid #fff"',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
        errors: [{ message: /Hardcoded color/ }],
      },
      {
        code: 'const x = `color: ${token}; border-color: #fff`',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
        errors: [{ message: /Hardcoded color/ }],
      },
    ],
  })
})

// ── no-relative-parent-imports ───────────────────────────────────────────

describe('no-relative-parent-imports', () => {
  ruleTester.run('no-relative-parent-imports', rules['no-relative-parent-imports'], {
    valid: [
      { code: 'import { foo } from "@/lib/utils"' },
      { code: 'import { foo } from "./sibling"' },
      { code: 'import styles from "./Foo.module.css"' },
    ],
    invalid: [
      {
        code: 'import { foo } from "../utils"',
        errors: [{ messageId: 'noRelativeParent' }],
      },
      {
        code: 'import { bar } from "../../lib/helpers"',
        errors: [{ messageId: 'noRelativeParent' }],
      },
    ],
  })
})

// ── no-viewport-units ────────────────────────────────────────────────────

describe('no-viewport-units', () => {
  ruleTester.run('no-viewport-units', rules['no-viewport-units'], {
    valid: [
      { code: 'const x = "100%"', filename: 'src/components/base/standard-effects/framer/Foo.tsx' },
      { code: 'const x = "50px"', filename: 'src/components/base/standard-effects/framer/Foo.tsx' },
      { code: 'const x = "100vh"', filename: 'src/App.tsx' },
    ],
    invalid: [
      {
        code: 'const x = "100vh"',
        filename: 'src/components/base/standard-effects/framer/Foo.tsx',
        errors: [{ message: /Viewport units/ }],
      },
      {
        code: 'const x = "50vw"',
        filename: 'src/components/base/standard-effects/css/Foo.tsx',
        errors: [{ message: /Viewport units/ }],
      },
    ],
  })
})

// ── no-important ─────────────────────────────────────────────────────────

describe('no-important', () => {
  ruleTester.run('no-important', rules['no-important'], {
    valid: [
      {
        code: 'const x = "display: block"',
        filename: 'src/components/base/standard-effects/framer/Foo.tsx',
      },
      { code: 'const x = "display: block !important"', filename: 'src/App.tsx' },
    ],
    invalid: [
      {
        code: 'const x = "display: block !important"',
        filename: 'src/components/base/standard-effects/framer/Foo.tsx',
        errors: [{ message: /!important is banned/ }],
      },
    ],
  })
})

// ── no-excessive-z-index ─────────────────────────────────────────────────

describe('no-excessive-z-index', () => {
  ruleTester.run('no-excessive-z-index', rules['no-excessive-z-index'], {
    valid: [
      {
        code: 'const s = { zIndex: 5 }',
        filename: 'src/components/base/standard-effects/framer/Foo.tsx',
      },
      {
        code: 'const s = { zIndex: 10 }',
        filename: 'src/components/base/standard-effects/framer/Foo.tsx',
      },
      {
        code: 'const s = { zIndex: -1 }',
        filename: 'src/components/base/standard-effects/framer/Foo.tsx',
      },
      { code: 'const s = { zIndex: 9999 }', filename: 'src/App.tsx' },
    ],
    invalid: [
      {
        code: 'const s = { zIndex: 11 }',
        filename: 'src/components/base/standard-effects/framer/Foo.tsx',
        errors: [{ message: /z-index values above 10/ }],
      },
      {
        code: 'const s = { zIndex: 100 }',
        filename: 'src/components/base/standard-effects/css/Foo.tsx',
        errors: [{ message: /z-index values above 10/ }],
      },
    ],
  })
})

// ── no-radial-angular-gradient ───────────────────────────────────────────

describe('no-radial-angular-gradient', () => {
  ruleTester.run('no-radial-angular-gradient', rules['no-radial-angular-gradient'], {
    valid: [
      { code: 'const x = "radial-gradient(circle, red, blue)"' },
      { code: 'const x = "linear-gradient(to right, red, blue)"' },
    ],
    invalid: [
      {
        code: 'const x = "conic-gradient(from 0deg, red, blue)"',
        errors: [{ message: /conic-gradient\(\) is banned/ }],
      },
    ],
  })
})

// ── no-shallow-assertions ────────────────────────────────────────────────

describe('no-shallow-assertions', () => {
  ruleTester.run('no-shallow-assertions', rules['no-shallow-assertions'], {
    valid: [
      { code: 'expect(result).toBe(42)' },
      { code: 'expect(result).toEqual({ name: "test" })' },
      { code: 'expect(result).toHaveLength(3)' },
      { code: 'expect(fn).toHaveBeenCalledWith(expect.any(Function))' },
    ],
    invalid: [
      {
        code: 'expect(result).toBeDefined()',
        errors: [{ message: /Shallow useless test/ }],
      },
      {
        code: 'expect(result).toBeTruthy()',
        errors: [{ message: /Shallow useless test/ }],
      },
      {
        code: 'expect(result).not.toBeNull()',
        errors: [{ message: /Shallow useless test/ }],
      },
      {
        // Triggers twice: once for typeof in expect(), once for toBe("function")
        code: 'expect(typeof result).toBe("function")',
        errors: [{ message: /Shallow useless test/ }, { message: /Shallow useless test/ }],
      },
      {
        code: 'expect(result).toBeInstanceOf(Error)',
        errors: [{ message: /Shallow useless test/ }],
      },
      {
        code: 'expect(result).toHaveProperty("name")',
        errors: [{ message: /Shallow useless test/ }],
      },
      {
        code: 'expect(result).toBeGreaterThan(0)',
        errors: [{ message: /Shallow useless test/ }],
      },
    ],
  })
})

// ── no-waitfor-timeout ───────────────────────────────────────────────────

describe('no-waitfor-timeout', () => {
  ruleTester.run('no-waitfor-timeout', rules['no-waitfor-timeout'], {
    valid: [
      { code: 'page.waitForTimeout(1000)', filename: 'src/App.tsx' },
      { code: 'await expect(page.locator("x")).toBeVisible()', filename: 'tests/e2e/foo.spec.ts' },
    ],
    invalid: [
      {
        code: 'await page.waitForTimeout(2000)',
        filename: 'tests/e2e/foo.spec.ts',
        errors: [{ message: /waitForTimeout\(\) is banned/ }],
      },
    ],
  })
})

// ── no-cross-category-imports ────────────────────────────────────────────

describe('no-cross-category-imports', () => {
  ruleTester.run('no-cross-category-imports', rules['no-cross-category-imports'], {
    valid: [
      {
        code: 'import { foo } from "@/components/rewards/lights/SharedUtils"',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
      },
      {
        code: 'import { AnimationMetadata } from "@/types/animation"',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
      },
      {
        code: 'import { foo } from "@/components/dialogs/modal-base/SharedUtils"',
        filename: 'src/App.tsx',
      },
    ],
    invalid: [
      {
        code: 'import { foo } from "@/components/dialogs/modal-base/SharedUtils"',
        filename: 'src/components/rewards/collection-effects/framer/Foo.tsx',
        errors: [{ message: /Cross-category import/ }],
      },
    ],
  })
})

// ── no-implicit-demo-block-styles ───────────────────────────────────────

describe('no-implicit-demo-block-styles', () => {
  const jsxLanguageOptions = {
    parserOptions: { ecmaFeatures: { jsx: true } },
  }

  ruleTester.run('no-implicit-demo-block-styles', rules['no-implicit-demo-block-styles'], {
    valid: [
      {
        code: 'import "@/components/demo-blocks/demo-blocks.css"\nexport function Foo() { return <div className="pf-demo-button" /> }',
        filename: 'src/components/base/lint-fixture/css/Foo.tsx',
        languageOptions: jsxLanguageOptions,
      },
      {
        code: 'import "../../../demo-blocks/demo-blocks.css"\nexport function Foo() { return <div className="pf-demo-button" /> }',
        filename: 'src/components/base/lint-fixture/framer/Foo.tsx',
        languageOptions: jsxLanguageOptions,
      },
      {
        code: 'import { DemoButton } from "@/components/demo-blocks"\nexport function Foo() { return <div className="pf-demo-button" /> }',
        filename: 'src/components/base/lint-fixture/css/Foo.tsx',
        languageOptions: jsxLanguageOptions,
      },
    ],
    invalid: [
      {
        code: 'import "@/components/demo-blocks/demo-blocks.css-extra"\nexport function Foo() { return <div className="pf-demo-button" /> }',
        filename: 'src/components/base/lint-fixture/css/Foo.tsx',
        languageOptions: jsxLanguageOptions,
        errors: [{ message: /does not explicitly load demo-block styles/ }],
      },
      {
        code: 'import "@/components/foo/demo-blocks/demo-blocks.css-extra"\nexport function Foo() { return <div className="pf-demo-button" /> }',
        filename: 'src/components/base/lint-fixture/css/Foo.tsx',
        languageOptions: jsxLanguageOptions,
        errors: [{ message: /does not explicitly load demo-block styles/ }],
      },
      {
        code: 'import "../../../demo-blocks/demo-blocks.css-extra"\nexport function Foo() { return <div className="pf-demo-button" /> }',
        filename: 'src/components/base/lint-fixture/framer/Foo.tsx',
        languageOptions: jsxLanguageOptions,
        errors: [{ message: /does not explicitly load demo-block styles/ }],
      },
    ],
  })
})

// ── Rule metadata integrity ──────────────────────────────────────────────

describe('ESLint rule metadata integrity', () => {
  it('every rule has required meta fields', () => {
    for (const [name, rule] of Object.entries(rules)) {
      expect(rule.meta, `Rule "${name}" missing meta`).toEqual(
        expect.objectContaining({
          type: expect.stringMatching(/^(problem|suggestion|layout)$/),
          docs: expect.objectContaining({
            description: expect.any(String),
          }),
        })
      )
      expect(rule.create, `Rule "${name}" missing create function`).toEqual(expect.any(Function))
    }
  })

  it('exports all expected rules', () => {
    const expectedRules = [
      'no-hardcoded-colors',
      'no-direct-image-imports',
      'no-css-animations-in-motion',
      'no-blur-animation',
      'no-radial-angular-gradient',
      'require-animation-metadata',
      'require-dual-implementation',
      'no-non-portable-styles',
      'no-css-grid-in-motion',
      'no-calc-in-motion',
      'no-relative-parent-imports',
      'no-viewport-units',
      'no-important',
      'require-data-animation-id',
      'no-css-animations-in-framer',
      'no-unstyled-interactive-elements',
      'no-excessive-z-index',
      'no-default-export-in-animation',
      'no-implicit-demo-block-styles',
      'no-svg-in-motion',
      'no-cross-category-imports',
      'no-shallow-assertions',
      'require-data-testid',
      'no-class-id-locators',
      'no-waitfor-timeout',
      'no-flaky-click-selectors',
    ]

    for (const ruleName of expectedRules) {
      expect(rules[ruleName], `Missing rule: ${ruleName}`).toEqual(
        expect.objectContaining({
          meta: expect.any(Object),
          create: expect.any(Function),
        })
      )
    }
  })
})

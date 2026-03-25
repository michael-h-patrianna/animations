import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

import { getFilename, isAnimationFile } from './rule-helpers.js'

/**
 * ESLint rules enforcing copy-paste portability for animation components.
 *
 * Portability tiers:
 *   1 (Effect)       — Copy keyframes/motion props. Apply to any element.
 *   2 (Decorated)    — Copy component + CSS. Small extractable utility imports OK.
 *   3 (Orchestration)— Copy component + CSS + follow HTML structure. No @/assets.
 *   4 (Component)    — Copy entire group directory. Unrestricted.
 */

/**
 * Reads the tier from the sibling .meta.ts file of an animation component.
 * Returns undefined if the file doesn't exist or tier is not declared.
 */
function readTierFromMeta(filename) {
  const base = basename(filename, '.tsx')
  const dir = dirname(filename)
  const metaPath = resolve(dir, `${base}.meta.ts`)

  let content
  try {
    content = readFileSync(metaPath, 'utf8')
  } catch {
    return undefined
  }

  // Match tier: 1, tier: 2, tier: 3, tier: 4 in the metadata object
  const match = content.match(/\btier\s*:\s*([1-4])\b/)
  return match ? Number(match[1]) : undefined
}

const portabilityRules = {
  /**
   * Every animation .meta.ts must declare a `tier` property.
   * Set to 'warn' during migration, escalate to 'error' once all animations are classified.
   */
  'require-portability-tier': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Every animation metadata file must declare a portability tier (1-4) for copy-paste classification.',
      },
      schema: [],
    },
    create(context) {
      const filename = getFilename(context)
      if (!filename.endsWith('.meta.ts')) return {}
      if (!filename.includes('/css/') && !filename.includes('/framer/')) return {}

      let hasTier = false

      return {
        Property(node) {
          const name = node.key?.name || node.key?.value
          if (name === 'tier') {
            hasTier = true

            // Validate tier value is 1-4
            if (node.value?.type === 'Literal') {
              const val = node.value.value
              if (![1, 2, 3, 4].includes(val)) {
                context.report({
                  node: node.value,
                  message: `Invalid portability tier: ${val}. Must be 1 (Effect), 2 (Decorated), 3 (Orchestration), or 4 (Component).`,
                })
              }
            }
          }
        },
        'Program:exit'() {
          if (!hasTier) {
            const base = basename(filename, '.meta.ts')
            context.report({
              loc: { line: 1, column: 0 },
              message: `${base}.meta.ts is missing a portability tier. Add tier: 1|2|3|4 to classify copy-paste requirements. See AnimationMetadata.tier JSDoc for definitions.`,
            })
          }
        },
      }
    },
  },

  /**
   * Validates that a component's imports respect its declared portability tier.
   *
   * Tier 1: No @/ imports at all (pure npm + local only)
   * Tier 2: @/motion/* and @/utils/* allowed. No @/assets.
   * Tier 3: @/motion/* and @/utils/* allowed. No @/assets.
   * Tier 4: Unrestricted.
   *
   * Only applies to .tsx files in css/ or framer/ that have a sibling .meta.ts with a tier.
   */
  'tier-dependency-budget': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Validate that animation component imports respect the declared portability tier.',
      },
      schema: [],
    },
    create(context) {
      if (!isAnimationFile(context)) return {}
      const filename = getFilename(context)
      if (!filename.endsWith('.tsx')) return {}
      const base = basename(filename, '.tsx')
      if (base.startsWith('Mock') || base === 'index') return {}

      const tier = readTierFromMeta(filename)
      if (tier === undefined) return {} // No tier declared — require-portability-tier handles this

      // Extractable utility prefixes — small modules a user can inline.
      // @/types/ is included because type-only imports are erased at compile time.
      // @/components/demo-blocks is included because demo-blocks are portable demo primitives.
      const extractableImports = ['@/motion/', '@/utils/', '@/types/', '@/components/demo-blocks']

      // Same-group imports: files in the same group directory travel with the
      // component when copy-pasted. Derive the group's @/ prefix from the file path.
      // e.g. src/components/dialogs/modal-base/framer/Foo.tsx → @/components/dialogs/modal-base/
      const groupMatch = filename.match(
        /src\/components\/((?:base|dialogs|progress|realtime|rewards)\/[^/]+)\//
      )
      const sameGroupPrefix = groupMatch ? `@/components/${groupMatch[1]}/` : undefined

      return {
        ImportDeclaration(node) {
          const source = node.source.value
          if (typeof source !== 'string') return
          if (!source.startsWith('@/')) return // npm or relative — always OK

          if (tier === 4) return // Tier 4 is unrestricted

          // Same-group imports are allowed at all tiers — these files are
          // co-located in the group directory and travel with the component.
          if (sameGroupPrefix && source.startsWith(sameGroupPrefix)) return

          // Demo-blocks are portable demo primitives — allowed at all tiers
          const isExtractable = extractableImports.some((prefix) => source.startsWith(prefix))
          if (isExtractable) return

          if (tier === 1) {
            // Tier 1: no @/ imports except extractable and same-group
            context.report({
              node,
              message: `Tier 1 (Effect) animations must not use project imports. Found: "${source}". Tier 1 components use only npm packages, local files, same-group files, and @/components/demo-blocks. Raise the tier to 2+ or remove this import.`,
            })
            return
          }

          // Tier 2 and 3: allow extractable utilities, ban @/assets
          if (source.startsWith('@/assets')) {
            context.report({
              node,
              message: `Tier ${tier} animations must not import from @/assets (project-specific images). Found: "${source}". Move to Tier 4 or replace with CSS-only visuals.`,
            })
            return
          }

          // Tier 2 and 3: only extractable imports allowed (already checked above)
          context.report({
            node,
            message: `Tier ${tier} animations may only import from extractable utilities (@/motion/*, @/utils/*, @/types/*, @/components/demo-blocks). Found: "${source}". Raise the tier to 4 or restructure.`,
          })
        },
      }
    },
  },

  /**
   * Ban `position: fixed` in animation files.
   * Fixed positioning breaks containment — the element escapes any parent container.
   */
  'no-position-fixed': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow position: fixed in animation components. Fixed positioning breaks container portability.',
      },
      schema: [],
    },
    create(context) {
      if (!isAnimationFile(context)) return {}
      const msg =
        'position: fixed is banned in animation components. It breaks containment — the element escapes any parent container the user places it in. Use position: absolute within a position: relative wrapper instead.'
      const fixedPattern = /position\s*:\s*fixed/i

      return {
        // JS style objects: { position: 'fixed' }
        Property(node) {
          const name = node.key?.name || node.key?.value
          if (name !== 'position') return
          if (node.value?.type === 'Literal' && node.value.value === 'fixed') {
            context.report({ node, message: msg })
          }
        },
        // String literals containing 'position: fixed' (e.g. in template CSS)
        Literal(node) {
          if (typeof node.value === 'string' && fixedPattern.test(node.value)) {
            context.report({ node, message: msg })
          }
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            if (fixedPattern.test(quasi.value.raw)) {
              context.report({ node, message: msg })
              return
            }
          }
        },
        // Scan co-located CSS files for position: fixed
        Program() {
          const filename = getFilename(context)
          if (!filename.endsWith('.tsx')) return
          const base = basename(filename, '.tsx')
          if (base.startsWith('Mock') || base === 'index') return

          const dir = dirname(filename)
          let cssFiles
          try {
            cssFiles = readdirSync(dir).filter((f) => f.endsWith('.css'))
          } catch {
            return
          }

          for (const cssFile of cssFiles) {
            let css
            try {
              css = readFileSync(join(dir, cssFile), 'utf8')
            } catch {
              continue
            }
            if (fixedPattern.test(css)) {
              context.report({
                loc: { line: 1, column: 0 },
                message: `${cssFile} contains position: fixed. ${msg}`,
              })
            }
          }
        },
      }
    },
  },

  /**
   * For Tier 1-2 animations, CSS files must use fallback values in var() expressions.
   * Without fallbacks, the component breaks when copied to a project without
   * the original CSS custom property definitions.
   *
   * Checks CSS files imported by the animation component's .tsx file.
   */
  'require-css-var-fallback': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Tier 1-2 animation CSS must include fallback values in var() for portability.',
      },
      schema: [],
    },
    create(context) {
      if (!isAnimationFile(context)) return {}
      const filename = getFilename(context)
      if (!filename.endsWith('.tsx')) return {}
      const base = basename(filename, '.tsx')
      if (base.startsWith('Mock') || base === 'index') return {}

      const tier = readTierFromMeta(filename)
      // Only enforce on Tier 1-2 (most portable)
      if (tier === undefined || tier > 2) return {}

      return {
        ImportDeclaration(node) {
          const source = node.source.value
          if (typeof source !== 'string') return
          if (!source.endsWith('.css')) return
          // Skip shared.css — its variables are self-contained definitions, not references
          if (source.endsWith('shared.css')) return

          const dir = dirname(filename)
          const cssPath = resolve(dir, source)

          let css
          try {
            css = readFileSync(cssPath, 'utf8')
          } catch {
            return
          }

          // Collect locally-defined custom properties (e.g. `--my-var: value;`).
          // If a variable is defined in the same CSS file it's self-contained — a
          // fallback is unnecessary because the definition travels with the code.
          const definedVars = new Set()
          const defPattern = /(--[\w-]+)\s*:/g
          let defMatch
          while ((defMatch = defPattern.exec(css)) !== null) {
            definedVars.add(defMatch[1])
          }

          // Find var(--xxx) without a fallback (no comma after the property name)
          // var(--color-accent) = no fallback (BAD if not locally defined)
          // var(--color-accent, #6366f1) = has fallback (GOOD)
          // var(--x, var(--y, #fff)) = nested fallback (GOOD)
          const varPattern = /var\(\s*(--[\w-]+)\s*\)/g
          let match
          while ((match = varPattern.exec(css)) !== null) {
            const varName = match[1]
            // Skip variables defined in the same CSS file — they're self-contained
            if (definedVars.has(varName)) continue
            context.report({
              loc: { line: 1, column: 0 },
              message: `CSS variable ${varName} in ${basename(cssPath)} has no fallback value. For Tier ${tier} portability, use var(${varName}, <fallback>) so the component works when copied without the theme CSS.`,
            })
          }
        },
      }
    },
  },
}

export { portabilityRules }

/**
 * Mirrors @media (prefers-reduced-motion: reduce) rules into a dynamic
 * stylesheet scoped to [data-reduced-motion='reduce']. This lets the catalog
 * toggle activate CSS reduced-motion alternatives without changing the OS
 * setting. One-direction only: force reduce when OS says no-preference.
 *
 * Animation CSS files keep portable @media queries — this is catalog-only glue.
 */

const STYLE_ID = 'catalog-reduced-motion-mirror'
const SCOPE = "[data-reduced-motion='reduce']"

/**
 * Scan all stylesheets and mirror prefers-reduced-motion rules under a
 * data-attribute selector. Call once on mount and again when lazy groups
 * load new CSS (detected via MutationObserver on <head>).
 */
export function syncReducedMotionStyles(): void {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    document.head.appendChild(style)
  }

  const mirrored: string[] = []

  for (const sheet of document.styleSheets) {
    try {
      extractReducedMotionRules(sheet.cssRules, mirrored)
    } catch {
      // Cross-origin stylesheets throw SecurityError — skip
    }
  }

  style.textContent = mirrored.join('\n')
}

function extractReducedMotionRules(rules: CSSRuleList, out: string[]): void {
  for (const rule of rules) {
    if (
      rule instanceof CSSMediaRule &&
      /prefers-reduced-motion:\s*reduce/i.test(rule.conditionText)
    ) {
      for (const inner of rule.cssRules) {
        if (inner instanceof CSSStyleRule) {
          // Scope every selector under the data-attribute
          const scopedSelector = inner.selectorText
            .split(',')
            .map((s) => `${SCOPE} ${s.trim()}`)
            .join(', ')
          // Extract declaration block from cssText (preserves !important)
          const cssText = inner.cssText
          const braceStart = cssText.indexOf('{')
          const body = braceStart >= 0 ? cssText.slice(braceStart) : `{ ${inner.style.cssText} }`
          out.push(`${scopedSelector} ${body}`)
        }
        // @keyframes inside the media query — emit globally so the scoped
        // style rules above can reference the reduced keyframe names.
        if (inner instanceof CSSKeyframesRule) {
          out.push(inner.cssText)
        }
      }
    }

    // Recurse into @layer, @supports, etc. — skip the media rules we already handled
    if (
      !(rule instanceof CSSMediaRule) &&
      'cssRules' in rule &&
      ((rule as CSSGroupingRule).cssRules?.length ?? 0) > 0
    ) {
      extractReducedMotionRules((rule as CSSGroupingRule).cssRules, out)
    }
  }
}

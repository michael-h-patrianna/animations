import type { HighlighterCore, ShikiTransformer } from 'shiki/core'

let highlighterPromise: Promise<HighlighterCore> | null = null

const FONT_STYLE_ITALIC = 1
const FONT_STYLE_BOLD = 2
const FONT_STYLE_UNDERLINE = 4
const FONT_STYLE_STRIKETHROUGH = 8

function colorClassName(prefix: 'fg' | 'bg', color: string | undefined): string | null {
  const normalized = color?.toLowerCase().replace(/^#/, '')
  return normalized ? `shiki-${prefix}-${normalized}` : null
}

function cspSafeClassTransformer(): ShikiTransformer {
  return {
    name: 'code-viewer-csp-safe-classes',
    pre(hast) {
      delete hast.properties.style
      this.addClassToHast(hast, 'code-modal__shiki')
      return hast
    },
    span(hast, _line, _column, _lineElement, token) {
      const classNames = ['shiki-token']
      const fgClass = colorClassName('fg', token.color)
      const bgClass = colorClassName('bg', token.bgColor)

      if (fgClass) classNames.push(fgClass)
      if (bgClass) classNames.push(bgClass)

      const fontStyle = token.fontStyle ?? 0
      const hasUnderline = Boolean(fontStyle & FONT_STYLE_UNDERLINE)
      const hasStrikethrough = Boolean(fontStyle & FONT_STYLE_STRIKETHROUGH)
      if ((fontStyle & FONT_STYLE_ITALIC) !== 0) classNames.push('shiki-font-italic')
      if ((fontStyle & FONT_STYLE_BOLD) !== 0) classNames.push('shiki-font-bold')
      if (hasUnderline && hasStrikethrough) classNames.push('shiki-font-underline-strikethrough')
      else if (hasUnderline) classNames.push('shiki-font-underline')
      else if (hasStrikethrough) classNames.push('shiki-font-strikethrough')

      delete hast.properties.style
      this.addClassToHast(hast, classNames)
      return hast
    },
  }
}

/**
 * Returns a lazily-initialized Shiki highlighter configured with only
 * TSX + CSS languages and the github-dark theme. The highlighter is
 * created once and cached for the lifetime of the page.
 *
 * Uses shiki/core + JS engine for minimal bundle size (~100KB gz
 * instead of ~1.2MB for the full bundle).
 */
export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter()
  }
  return highlighterPromise
}

async function createHighlighter(): Promise<HighlighterCore> {
  const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, tsx, css, theme] =
    await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
      import('@shikijs/langs/tsx'),
      import('@shikijs/langs/css'),
      import('@shikijs/themes/github-dark'),
    ])

  return createHighlighterCore({
    themes: [theme.default],
    langs: [tsx.default, css.default],
    engine: createJavaScriptRegexEngine(),
  })
}

/**
 * Highlights source code and returns an HTML string.
 * Lazy-loads the Shiki highlighter on first call.
 */
export async function highlightCode(code: string, lang: 'tsx' | 'css'): Promise<string> {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code, {
    lang,
    theme: 'github-dark',
    rootStyle: false,
    transformers: [cspSafeClassTransformer()],
  })
}

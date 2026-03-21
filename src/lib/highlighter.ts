import type { HighlighterCore } from 'shiki/core'

let highlighterPromise: Promise<HighlighterCore> | null = null

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
  })
}

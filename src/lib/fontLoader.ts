/**
 * Lazy font loader for preview fonts.
 *
 * Inter (UI font) and Lato (default preview font) are declared in fonts.css
 * and load eagerly. Every other preview font is registered with a constructable
 * stylesheet the first time it is selected — one network request per font file,
 * zero requests for fonts the user never picks.
 *
 * Comic Sans MS is a system font and needs no @font-face declaration.
 */

/** Fonts preloaded in fonts.css or provided by the OS — no runtime injection needed. */
const EAGER_FONTS = new Set(['Inter', 'Lato', 'Comic Sans MS'])

/** Tracks which fonts have already been injected to prevent duplicates. */
const injected = new Set<string>()

function supportsConstructableStylesheets(): boolean {
  return (
    typeof CSSStyleSheet !== 'undefined' &&
    typeof CSSStyleSheet.prototype.replaceSync === 'function' &&
    typeof Document !== 'undefined' &&
    'adoptedStyleSheets' in Document.prototype
  )
}

function adoptFontCSS(css: string): boolean {
  if (!supportsConstructableStylesheets()) return false

  const sheet = new CSSStyleSheet()
  sheet.replaceSync(css)
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
  return true
}

function injectTestFontStyle(font: string, css: string): void {
  const style = document.createElement('style')
  style.dataset.font = font
  style.textContent = css
  document.head.appendChild(style)
}

/** Returns the raw @font-face CSS for a given font, or null if not self-hosted. */
function buildFontCSS(font: string): string | null {
  switch (font) {
    case 'Roboto':
      return `@font-face{font-family:Roboto;font-style:normal;font-weight:100 900;font-display:swap;src:url('/fonts/roboto-latin.woff2') format('woff2')}`

    case 'Ubuntu':
      return [
        `@font-face{font-family:Ubuntu;font-style:normal;font-weight:300;font-display:swap;src:url('/fonts/ubuntu-latin-300.woff2') format('woff2')}`,
        `@font-face{font-family:Ubuntu;font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/ubuntu-latin-400.woff2') format('woff2')}`,
        `@font-face{font-family:Ubuntu;font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/ubuntu-latin-500.woff2') format('woff2')}`,
        `@font-face{font-family:Ubuntu;font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/ubuntu-latin-700.woff2') format('woff2')}`,
      ].join('')

    case 'Poppins':
      return [
        `@font-face{font-family:Poppins;font-style:normal;font-weight:300;font-display:swap;src:url('/fonts/poppins-latin-300.woff2') format('woff2')}`,
        `@font-face{font-family:Poppins;font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/poppins-latin-400.woff2') format('woff2')}`,
        `@font-face{font-family:Poppins;font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/poppins-latin-500.woff2') format('woff2')}`,
        `@font-face{font-family:Poppins;font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/poppins-latin-600.woff2') format('woff2')}`,
        `@font-face{font-family:Poppins;font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/poppins-latin-700.woff2') format('woff2')}`,
      ].join('')

    case 'Noto Sans':
      return `@font-face{font-family:'Noto Sans';font-style:normal;font-weight:100 900;font-display:swap;src:url('/fonts/noto-sans-latin.woff2') format('woff2')}`

    case 'DM Sans':
      return `@font-face{font-family:'DM Sans';font-style:normal;font-weight:100 1000;font-display:swap;src:url('/fonts/dm-sans-latin.woff2') format('woff2')}`

    case 'Outfit':
      return `@font-face{font-family:Outfit;font-style:normal;font-weight:100 900;font-display:swap;src:url('/fonts/outfit-latin.woff2') format('woff2')}`

    case 'Space Grotesk':
      return `@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:300 700;font-display:swap;src:url('/fonts/space-grotesk-latin.woff2') format('woff2')}`

    case 'Plus Jakarta Sans':
      return `@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:200 800;font-display:swap;src:url('/fonts/plus-jakarta-sans-latin.woff2') format('woff2')}`

    case 'Baloo 2':
      return `@font-face{font-family:'Baloo 2';font-style:normal;font-weight:400 800;font-display:swap;src:url('/fonts/baloo-2-latin.woff2') format('woff2')}`

    case 'IBM Plex Sans':
      return `@font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:300 700;font-display:swap;src:url('/fonts/ibm-plex-sans-latin.woff2') format('woff2')}`

    default:
      return null
  }
}

/**
 * Ensures the @font-face declaration for `font` is present in the document.
 * Idempotent — safe to call on every font change.
 */
export function ensureFontLoaded(font: string): void {
  if (typeof document === 'undefined') return
  if (EAGER_FONTS.has(font) || injected.has(font)) return

  const css = buildFontCSS(font)
  if (css === null) return

  if (import.meta.env.MODE === 'test') {
    injectTestFontStyle(font, css)
  } else if (!adoptFontCSS(css)) {
    return
  }

  injected.add(font)
}

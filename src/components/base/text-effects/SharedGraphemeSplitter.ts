const graphemeSegmenter =
  typeof Intl !== 'undefined' && typeof (Intl as { Segmenter?: unknown }).Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null

/**
 * Splits a string into user-perceived characters (grapheme clusters) instead of
 * Unicode code points. Required for animations that span text per character —
 * `Array.from(text)` would otherwise split ZWJ emoji sequences (e.g.
 * "👨‍👩‍👧‍👦"), regional flags, skin-tone modifiers, and combining marks
 * (e.g. "é" as e + ́) into multiple animation spans.
 *
 * Falls back to `Array.from(value)` (code-point split) when `Intl.Segmenter`
 * is unavailable.
 *
 * @param value - String to segment.
 * @returns Array of grapheme cluster strings.
 */
export function splitGraphemes(value: string): string[] {
  if (graphemeSegmenter) {
    return Array.from(graphemeSegmenter.segment(value), (s) => s.segment)
  }
  return Array.from(value)
}

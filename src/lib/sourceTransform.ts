/**
 * Cleans animation source code for display in the code viewer.
 * Strips demo-harness artifacts so the user sees only the animation-relevant code.
 */
export function cleanSourceForDisplay(source: string): string {
  return source
    .split('\n')
    .map(transformLine)
    .filter((line) => line !== null)
    .join('\n')
    .trim()
}

function transformLine(line: string): string | null {
  // Remove data-animation-id attributes (showcase-internal tracking)
  if (/\s*data-animation-id=".+"/.test(line)) {
    const cleaned = line.replace(/\s*data-animation-id=".+?"/, '')
    // If the line is now just whitespace or an empty tag attr, skip it
    return cleaned.trim() === '' ? null : cleaned
  }

  // Replace DefaultModalContent import with a guidance comment
  if (/import\s+\{?\s*DefaultModalContent\s*\}?\s+from/.test(line)) {
    return '// Replace <DefaultModalContent /> below with your own content'
  }

  return line
}

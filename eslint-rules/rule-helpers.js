/**
 * Shared helpers for custom ESLint animation rules.
 * Used by both animation-rules.js and extra-rules.js.
 */

function getFilename(context) {
  return context.filename
}

function isInFramer(context) {
  return getFilename(context).includes('/framer/')
}

function isAnimationFile(context) {
  const f = getFilename(context)
  return f.includes('/css/') || f.includes('/framer/')
}

function checkCssForAnimations(css) {
  const findings = []
  if (/@keyframes\s/m.test(css)) findings.push('@keyframes')
  if (
    /(?:^|[{;\s])animation(?:-name|-duration|-delay|-timing-function|-iteration-count|-direction|-fill-mode|-play-state)?\s*:/m.test(
      css
    )
  ) {
    findings.push('animation')
  }
  if (/(?:^|[{;\s])transition(?:-property|-duration|-delay|-timing-function)?\s*:/m.test(css)) {
    findings.push('transition')
  }
  return findings
}

export { getFilename, isInFramer, isAnimationFile, checkCssForAnimations }

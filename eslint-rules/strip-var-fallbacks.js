/**
 * Strip CSS var() fallback values before checking for hardcoded colors.
 * Uses a paren-depth parser so nested functions like rgb() are handled.
 */
function stripVarFallbacks(str) {
  let out = ''
  let i = 0

  while (i < str.length) {
    if (
      str.slice(i, i + 4) === 'var(' &&
      str
        .slice(i + 4)
        .trimStart()
        .startsWith('--')
    ) {
      let depth = 1
      let j = i + 4
      let commaAt = -1

      while (j < str.length && depth > 0) {
        if (str[j] === '(') depth++
        else if (str[j] === ')') {
          depth--
          if (depth === 0) break
        } else if (str[j] === ',' && depth === 1 && commaAt === -1) {
          commaAt = j
        }
        j++
      }

      if (commaAt !== -1 && depth === 0) {
        out += 'var(--stripped)'
        i = j + 1
        continue
      }
    }

    out += str[i]
    i++
  }

  return out
}

export { stripVarFallbacks }

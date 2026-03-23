import { describe, expect, it } from 'vitest'
import { cleanSourceForDisplay } from '@/lib/sourceTransform'

describe('cleanSourceForDisplay', () => {
  it('removes data-animation-id attributes from single-attribute lines', () => {
    const source = `<div data-animation-id="modal-base__scale-gentle-pop" className="pf-modal">`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('className="pf-modal"')
  })

  it('drops lines that become empty after removing data-animation-id', () => {
    const source = `<div
      data-animation-id="modal-base__scale"
      className="pf-modal"
    >`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    const lines = result.split('\n')
    expect(lines.every((line: string) => line.trim() !== '')).toBe(true)
  })

  it('preserves other attributes on the same line when removing data-animation-id', () => {
    // Non-greedy regex should only remove the data-animation-id portion
    const source = `<m.div data-animation-id="test__id" className="pf-modal" style={{ color: 'red' }}>`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('className="pf-modal"')
    expect(result).toContain("style={{ color: 'red' }}")
  })

  it('handles data-animation-id as the only attribute on a line', () => {
    const source = `      data-animation-id="group__variant"`
    const result = cleanSourceForDisplay(source)
    // Line becomes whitespace-only after removal → should be dropped
    expect(result).toBe('')
  })

  it('replaces MockModalContent named import with guidance comment', () => {
    const source = `import { MockModalContent } from '../MockModalContent'`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain("from '../MockModalContent'")
    expect(result).toContain('Replace <MockModalContent /> below with your own content')
  })

  it('replaces MockModalContent default import with guidance comment', () => {
    const source = `import MockModalContent from '../MockModalContent'`
    const result = cleanSourceForDisplay(source)
    expect(result).toContain('Replace <MockModalContent /> below with your own content')
  })

  it('passes through normal lines unchanged', () => {
    const source = `import * as m from 'motion/react-m'\n\nexport function MyComponent() {`
    const result = cleanSourceForDisplay(source)
    expect(result).toContain(`import * as m from 'motion/react-m'`)
    expect(result).toContain('export function MyComponent() {')
  })

  it('trims leading and trailing whitespace from result', () => {
    const source = `\n\n  const x = 1\n\n`
    const result = cleanSourceForDisplay(source)
    expect(result).toBe('const x = 1')
  })

  it('handles multi-line source with mixed transformations', () => {
    const source = [
      `import { MockModalContent } from '../MockModalContent'`,
      `import * as m from 'motion/react-m'`,
      ``,
      `export function Demo() {`,
      `  return (`,
      `    <m.div data-animation-id="demo__test" className="pf-modal">`,
      `      <MockModalContent />`,
      `    </m.div>`,
      `  )`,
      `}`,
    ].join('\n')

    const result = cleanSourceForDisplay(source)
    expect(result).toContain('Replace <MockModalContent /> below')
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('<m.div className="pf-modal">')
    expect(result).toContain('<MockModalContent />')
  })

  it('preserves indentation of non-transformed lines', () => {
    const source = `  const x = 1\n    const y = 2`
    const result = cleanSourceForDisplay(source)
    expect(result).toBe('const x = 1\n    const y = 2')
  })

  it('handles source with no transformable content', () => {
    const source = `export function Foo() {\n  return <div>Hello</div>\n}`
    const result = cleanSourceForDisplay(source)
    expect(result).toBe(source)
  })

  it('handles empty string input', () => {
    expect(cleanSourceForDisplay('')).toBe('')
  })

  it('handles single-line input', () => {
    expect(cleanSourceForDisplay('const x = 1')).toBe('const x = 1')
  })

  it('does not remove data-testid or other data attributes', () => {
    const source = `<div data-testid="my-test" data-role="container">`
    const result = cleanSourceForDisplay(source)
    expect(result).toContain('data-testid="my-test"')
    expect(result).toContain('data-role="container"')
  })

  it('handles data-animation-id with single quotes (JSX edge case)', () => {
    // While JSX typically uses double quotes, verify behavior
    const source = `<div data-animation-id='test__id' className="pf-modal">`
    const result = cleanSourceForDisplay(source)
    // The regex matches double quotes only, so single-quoted attributes survive
    // This is expected behavior — the registry always uses double quotes
    expect(result).toContain("data-animation-id='test__id'")
  })

  it('handles multiple data-animation-id occurrences across lines', () => {
    const source = [
      `<div data-animation-id="outer__id" className="outer">`,
      `  <span data-animation-id="inner__id" className="inner">`,
      `    text`,
      `  </span>`,
      `</div>`,
    ].join('\n')

    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('className="outer"')
    expect(result).toContain('className="inner"')
  })

  it('does not match partial attribute names like data-animation-identifier', () => {
    const source = `<div data-animation-identifier="other">`
    const result = cleanSourceForDisplay(source)
    // data-animation-identifier should NOT be removed (different attribute)
    expect(result).toContain('data-animation-identifier="other"')
  })

  it('handles data-animation-id value containing > character (defensive regex)', () => {
    // If the value contained >, the non-greedy regex /.+?/ should stop at the first "
    // This tests that the regex does not over-match beyond the closing quote
    const source = `<div data-animation-id="test__id" className="has>arrow">`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('className="has>arrow"')
  })

  it('handles greedy regex correctly with multiple attributes on same line', () => {
    // The regex /.+?/ is non-greedy, so it should only match the data-animation-id value
    const source = `<div data-animation-id="id1" data-other="keep">`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('data-other="keep"')
  })

  it('handles data-animation-id at end of tag (before closing bracket)', () => {
    const source = `<div className="wrapper" data-animation-id="test__id">`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('className="wrapper"')
    expect(result).toContain('>')
  })

  it('handles consecutive whitespace-only lines after removal', () => {
    const source = [
      `<div`,
      `  data-animation-id="test__id"`,
      `  data-animation-id="test__id2"`,
      `  className="foo"`,
      `>`,
    ].join('\n')
    const result = cleanSourceForDisplay(source)
    // Both data-animation-id lines should be removed
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('className="foo"')
  })

  it('handles data-animation-id on element with JSX expression className', () => {
    const source =
      '<m.div data-animation-id="g__v" className={`pf-modal ${isActive ? "active" : ""}`}>'
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('className={`pf-modal ${isActive ? "active" : ""}`}')
  })

  it('does not transform aliased MockModalContent import (regex limitation)', () => {
    // The regex expects `MockModalContent` directly before optional `}`, so
    // `MockModalContent as Content` does not match. In practice the codebase
    // never uses aliased imports for MockModalContent.
    const source = `import { MockModalContent as Content } from '../MockModalContent'`
    const result = cleanSourceForDisplay(source)
    // NOT transformed because the regex doesn't match the alias syntax
    expect(result).toContain("import { MockModalContent as Content } from '../MockModalContent'")
  })

  it('handles unclosed data-animation-id quote (malformed HTML)', () => {
    // If a quote is never closed, the non-greedy .+? matches to end of line
    const source = `<div data-animation-id="unclosed`
    const result = cleanSourceForDisplay(source)
    // The regex /data-animation-id=".+?"/ requires a closing quote.
    // Without it, the attribute survives (no match).
    expect(result).toContain('data-animation-id')
  })

  it('handles data-animation-id with newline in attribute value', () => {
    // JSX doesn't allow newlines in attribute values, but raw source display might
    const source = `<div data-animation-id="test\n__id" className="keep">`
    const result = cleanSourceForDisplay(source)
    // The regex matches per-line (.+? does not cross newlines), so the first line
    // will not match (no closing quote on that line). Both lines survive.
    expect(result).toContain('data-animation-id')
  })

  it('does not remove data-animation-id from inside a JavaScript string literal', () => {
    // If the attribute appears in a const or template string, it should survive
    // because the regex matches \s*data-animation-id (leading whitespace + attribute)
    const source = `const id = 'data-animation-id="test__id"'`
    const result = cleanSourceForDisplay(source)
    // The regex requires the pattern to appear as an HTML attribute (with whitespace before it)
    // A string literal has quote marks before it, not whitespace, so it MAY still match
    // depending on surrounding characters. Let's verify actual behavior:
    // The regex is: /\s*data-animation-id=".+?"/
    // In this case, the space before 'data-animation-id' inside the string matches \s*
    // So it WILL be removed — this documents a known limitation
    expect(result).not.toContain('data-animation-id')
  })

  it('handles extremely long data-animation-id values without catastrophic backtracking', () => {
    const longId = 'a'.repeat(10000)
    const source = `<div data-animation-id="${longId}" className="keep">`
    // Should complete in reasonable time (< 100ms for a single regex match)
    const start = performance.now()
    const result = cleanSourceForDisplay(source)
    const elapsed = performance.now() - start
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('className="keep"')
    // Should be fast — non-greedy .+? on a 10K char string should not backtrack
    expect(elapsed).toBeLessThan(100)
  })

  it('removes only the first data-animation-id when two appear on the same line (greedy test vs non-greedy replace)', () => {
    // The test regex uses greedy .+ but the replace uses non-greedy .+?
    // This means: test matches the whole line, replace strips only the first occurrence
    const source = `<div data-animation-id="first" data-animation-id="second" className="keep">`
    const result = cleanSourceForDisplay(source)
    // Non-greedy replace removes the first data-animation-id="first" only
    // The second data-animation-id="second" remains
    expect(result).toContain('data-animation-id="second"')
    expect(result).toContain('className="keep"')
  })

  it('data-animation-id="" (empty value) causes over-removal — regex .+? spans to next quoted attr', () => {
    // KNOWN PRODUCTION BUG: When data-animation-id has an empty value "",
    // the non-greedy .+? in the replace regex cannot match zero chars (requires 1+).
    // It overshoots into the next attribute: .+? matches `" className=` to reach
    // the next `"` quote. This strips the className attribute along with the ID.
    //
    // In practice this never triggers because data-animation-id always has a non-empty
    // value (the animation ID), but the behavior is documented here.
    const source = `<div data-animation-id="" className="keep">`
    const result = cleanSourceForDisplay(source)
    // The replace removes ` data-animation-id="" className="` → leaves `<divkeep">`
    expect(result).toBe('<divkeep">')
    // This confirms the over-removal bug with empty attribute values
  })

  it('handles source with only whitespace lines', () => {
    const source = `   \n  \n     `
    const result = cleanSourceForDisplay(source)
    // trim() removes all whitespace → empty string
    expect(result).toBe('')
  })

  it('handles source with CRLF line endings', () => {
    const source = `import foo from 'bar'\r\n<div data-animation-id="test__id" className="keep">\r\n</div>`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('className="keep"')
  })

  it('preserves style={{ animation: "none" }} attribute (consumer-relevant for framer variants)', () => {
    // The styleguide requires framer components to add style={{ animation: 'none' }}
    // on elements sharing class names with CSS variants. This must survive the transform
    // because consumers need it to prevent CSS animation overrides.
    const source = `<m.div className="pf-modal" style={{ animation: 'none' }}>`
    const result = cleanSourceForDisplay(source)
    expect(result).toContain("style={{ animation: 'none' }}")
  })

  it('preserves style={{ animation: "none" }} alongside data-animation-id removal', () => {
    const source = `<m.div data-animation-id="test__id" className="pf-modal" style={{ animation: 'none' }}>`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain("style={{ animation: 'none' }}")
    expect(result).toContain('className="pf-modal"')
  })

  it('handles multi-line JSX with data-animation-id on its own line (typical Prettier output)', () => {
    const source = [
      `<m.div`,
      `  className="pf-modal"`,
      `  data-animation-id="test__id"`,
      `  style={{ animation: 'none' }}`,
      `  initial={{ opacity: 0 }}`,
      `>`,
    ].join('\n')
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('className="pf-modal"')
    expect(result).toContain("style={{ animation: 'none' }}")
    expect(result).toContain('initial={{ opacity: 0 }}')
  })

  it('handles data-animation-id followed by self-closing tag on same line', () => {
    const source = `<m.div data-animation-id="test__id" />`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('/>')
  })

  it('preserves JSX expression attributes adjacent to data-animation-id', () => {
    const source = `<m.div data-animation-id="g__v" animate={{ scale: isHovered ? 1.1 : 1 }} className="pf-card">`
    const result = cleanSourceForDisplay(source)
    expect(result).not.toContain('data-animation-id')
    expect(result).toContain('animate={{ scale: isHovered ? 1.1 : 1 }}')
    expect(result).toContain('className="pf-card"')
  })
})

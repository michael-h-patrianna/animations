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

  it('does not transform aliased MockModalContent import (regex limitation)', () => {
    // The regex expects `MockModalContent` directly before optional `}`, so
    // `MockModalContent as Content` does not match. In practice the codebase
    // never uses aliased imports for MockModalContent.
    const source = `import { MockModalContent as Content } from '../MockModalContent'`
    const result = cleanSourceForDisplay(source)
    // NOT transformed because the regex doesn't match the alias syntax
    expect(result).toContain("import { MockModalContent as Content } from '../MockModalContent'")
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Shared mock state to verify singleton behavior
let createCallCount = 0

vi.mock('shiki/core', () => ({
  createHighlighterCore: vi.fn().mockImplementation(() => {
    createCallCount++
    return Promise.resolve({
      codeToHtml: vi.fn().mockImplementation((code: string, opts: { lang: string }) => {
        // Return something that reflects the input to verify correct arguments are passed
        return `<pre><code lang="${opts.lang}">${code.slice(0, 20)}</code></pre>`
      }),
    })
  }),
}))
vi.mock('shiki/engine/javascript', () => ({
  createJavaScriptRegexEngine: vi.fn().mockReturnValue({}),
}))
vi.mock('@shikijs/langs/tsx', () => ({ default: {} }))
vi.mock('@shikijs/langs/css', () => ({ default: {} }))
vi.mock('@shikijs/themes/github-dark', () => ({ default: {} }))

describe('getHighlighter', () => {
  beforeEach(() => {
    createCallCount = 0
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a highlighter instance with codeToHtml method', async () => {
    // Fresh module to reset singleton
    vi.resetModules()
    const { getHighlighter } = await import('@/lib/highlighter')
    const highlighter = await getHighlighter()
    const html = highlighter.codeToHtml('const x = 1', { lang: 'tsx', theme: 'github-dark' })
    expect(html).toContain('<pre>')
    expect(html).toContain('const x = 1')
  })

  it('returns the same instance on concurrent calls (singleton)', async () => {
    vi.resetModules()
    const { getHighlighter } = await import('@/lib/highlighter')
    // Call concurrently — both should get the same instance without double-initialization
    const [first, second] = await Promise.all([getHighlighter(), getHighlighter()])
    expect(first).toBe(second)
    // createHighlighterCore should have been called only once
    expect(createCallCount).toBe(1)
  })
})

describe('highlightCode', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns highlighted HTML for tsx code', async () => {
    vi.resetModules()
    const { highlightCode } = await import('@/lib/highlighter')
    const result = await highlightCode('const x = 1', 'tsx')
    expect(result).toContain('<pre>')
    expect(result).toContain('lang="tsx"')
  })

  it('returns highlighted HTML for css code', async () => {
    vi.resetModules()
    const { highlightCode } = await import('@/lib/highlighter')
    const result = await highlightCode('.foo { color: red }', 'css')
    expect(result).toContain('<pre>')
    expect(result).toContain('lang="css"')
  })

  it('passes the full source code to the highlighter', async () => {
    vi.resetModules()
    const { highlightCode } = await import('@/lib/highlighter')
    const longSource = 'export function LongComponent() { return <div>Hello World</div> }'
    const result = await highlightCode(longSource, 'tsx')
    // Our mock truncates to 20 chars to prove it received the input
    expect(result).toContain('export function Long')
  })

  it('handles empty string source code', async () => {
    vi.resetModules()
    const { highlightCode } = await import('@/lib/highlighter')
    const result = await highlightCode('', 'tsx')
    expect(result).toContain('<pre>')
  })

  it('handles multiple sequential calls without reinitializing', async () => {
    vi.resetModules()
    createCallCount = 0
    const { highlightCode } = await import('@/lib/highlighter')

    await highlightCode('const a = 1', 'tsx')
    await highlightCode('.foo {}', 'css')
    await highlightCode('const b = 2', 'tsx')

    // Should only have created the highlighter once
    expect(createCallCount).toBe(1)
  })
})

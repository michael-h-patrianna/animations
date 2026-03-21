import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

// Mock the highlighter to avoid loading shiki in tests
vi.mock('@/lib/highlighter', () => ({
  getHighlighter: vi.fn(),
  highlightCode: vi.fn().mockResolvedValue('<pre><code>highlighted</code></pre>'),
}))

// Import after mock is set up
const { CodeViewerModal } = await import('@/components/ui/CodeViewerModal')

const framerComponent = {
  label: 'Component (Motion)',
  code: 'export function Demo() { return <div>Hello</div> }',
  language: 'tsx' as const,
}
const framerStyle = {
  label: 'Styles (Motion)',
  code: '.demo-framer { opacity: 0; }',
  language: 'css' as const,
}
const sharedUtil = {
  label: 'utils.ts',
  code: 'export function rand() { return Math.random() }',
  language: 'tsx' as const,
}

const allSources = [framerComponent, framerStyle, sharedUtil]

const defaultProps = {
  sources: allSources,
  title: 'Test Animation',
  onClose: vi.fn(),
}

describe('CodeViewerModal', () => {
  it('renders JS select with tsx sources and CSS select with css sources', () => {
    render(<CodeViewerModal {...defaultProps} />)

    expect(screen.getByTestId('code-js')).toBeVisible()
    expect(screen.getByTestId('code-css')).toBeVisible()
  })

  it('JS select contains tsx sources as options', () => {
    render(<CodeViewerModal {...defaultProps} />)

    const jsSelect = screen.getByTestId('code-js-select') as HTMLSelectElement
    const options = Array.from(jsSelect.options)

    expect(options).toHaveLength(2)
    expect(options[0]!.textContent).toBe('Component (Motion)')
    expect(options[1]!.textContent).toBe('utils.ts')
  })

  it('CSS select contains css sources as options', () => {
    render(<CodeViewerModal {...defaultProps} />)

    const cssSelect = screen.getByTestId('code-css-select') as HTMLSelectElement
    const options = Array.from(cssSelect.options)

    expect(options).toHaveLength(1)
    expect(options[0]!.textContent).toBe('Styles (Motion)')
  })

  it('defaults JS select to first option (main component)', () => {
    render(<CodeViewerModal {...defaultProps} />)

    const jsSelect = screen.getByTestId('code-js-select') as HTMLSelectElement
    expect(jsSelect.value).toBe('0')
  })

  it('defaults CSS select to first option (main stylesheet)', () => {
    render(<CodeViewerModal {...defaultProps} />)

    const cssSelect = screen.getByTestId('code-css-select') as HTMLSelectElement
    expect(cssSelect.value).toBe('0')
  })

  it('hides JS select when no tsx sources exist', () => {
    render(<CodeViewerModal {...defaultProps} sources={[framerStyle]} />)

    expect(screen.queryByTestId('code-js')).not.toBeInTheDocument()
    expect(screen.getByTestId('code-css')).toBeVisible()
  })

  it('hides CSS select when no css sources exist', () => {
    render(<CodeViewerModal {...defaultProps} sources={[framerComponent]} />)

    expect(screen.getByTestId('code-js')).toBeVisible()
    expect(screen.queryByTestId('code-css')).not.toBeInTheDocument()
  })

  it('shows code from JS select by default when JS sources exist', async () => {
    render(<CodeViewerModal {...defaultProps} />)

    // After highlighting loads, code pane should show content
    const highlighted = await screen.findByTestId('code-highlighted')
    expect(highlighted).toBeVisible()
  })

  it('switches displayed code when JS select changes', async () => {
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} />)

    await expect(screen.findByTestId('code-highlighted')).resolves.toBeVisible()

    // Change JS select to second option (utils.ts)
    const jsSelect = screen.getByTestId('code-js-select') as HTMLSelectElement
    await user.selectOptions(jsSelect, screen.getByRole('option', { name: 'utils.ts' }))

    expect(jsSelect.value).toBe('1')

    // Copy to verify the correct source is active
    const spy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    await user.click(screen.getByTestId('code-copy-btn'))
    expect(spy).toHaveBeenCalledWith(sharedUtil.code)
    spy.mockRestore()
  })

  it('switches to CSS code when CSS select changes', async () => {
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} />)

    await expect(screen.findByTestId('code-highlighted')).resolves.toBeVisible()

    // Select the CSS dropdown to make CSS the active category
    const cssSelect = screen.getByTestId('code-css-select')
    await user.selectOptions(cssSelect, screen.getByRole('option', { name: 'Styles (Motion)' }))

    // Copy to verify CSS source is now active
    const spy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    await user.click(screen.getByTestId('code-copy-btn'))
    expect(spy).toHaveBeenCalledWith(framerStyle.code)
    spy.mockRestore()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} onClose={onClose} />)

    await user.click(screen.getByTestId('code-close-btn'))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} onClose={onClose} />)

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when clicking the overlay background', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} onClose={onClose} />)

    const overlay = screen.getByTestId('code-viewer-modal')
    await user.click(overlay)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose when clicking inside the modal panel', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} onClose={onClose} />)

    const body = screen.getByTestId('code-body')
    await user.click(body)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders dialog with proper aria attributes', () => {
    render(<CodeViewerModal {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Source code for Test Animation')
  })

  it('renders highlighted code after loading', async () => {
    render(<CodeViewerModal {...defaultProps} />)

    const highlighted = await screen.findByTestId('code-highlighted')
    expect(highlighted).toBeVisible()
  })

  it('copies active source to clipboard when copy button is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText)
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} />)

    await user.click(screen.getByTestId('code-copy-btn'))
    expect(await screen.findByText('Copied')).toBeVisible()

    expect(writeText).toHaveBeenCalledOnce()
    expect(writeText).toHaveBeenCalledWith(expect.not.stringContaining('data-animation-id'))
  })

  it('shows "Copied" text after successful copy', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} />)

    await user.click(screen.getByTestId('code-copy-btn'))

    expect(await screen.findByText('Copied')).toBeVisible()
  })

  it('handles clipboard write failure gracefully without crashing', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'))
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} />)

    await user.click(screen.getByTestId('code-copy-btn'))
    await new Promise((r) => setTimeout(r, 0))

    expect(screen.getByTestId('code-copy-btn')).toHaveTextContent('Copy')
  })

  it('handles empty string source without crashing', async () => {
    const emptySource = { label: 'Component', code: '', language: 'tsx' as const }
    render(<CodeViewerModal {...defaultProps} sources={[emptySource]} />)
    expect(screen.getByTestId('code-body')).toBeVisible()
  })

  it('restores focus to previously focused element on close', () => {
    const onClose = vi.fn()

    const triggerBtn = document.createElement('button')
    triggerBtn.textContent = 'Trigger'
    document.body.appendChild(triggerBtn)
    triggerBtn.focus()

    const { unmount } = render(<CodeViewerModal {...defaultProps} onClose={onClose} />)

    expect(triggerBtn).not.toHaveFocus()

    unmount()
    expect(triggerBtn).toHaveFocus()

    triggerBtn.remove()
  })

  it('aria-label includes the animation title', () => {
    render(<CodeViewerModal {...defaultProps} title="Custom Title" />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Source code for Custom Title')
  })

  it('renders with a single tsx source (only JS select visible)', async () => {
    render(<CodeViewerModal {...defaultProps} sources={[framerComponent]} />)

    expect(screen.getByTestId('code-js')).toBeVisible()
    expect(screen.queryByTestId('code-css')).not.toBeInTheDocument()
    expect(screen.getByTestId('code-copy-btn')).toBeVisible()
  })
})

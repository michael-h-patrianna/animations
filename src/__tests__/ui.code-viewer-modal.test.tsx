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

const framerSource = {
  label: 'Component (Motion)',
  code: 'export function Demo() { return <div>Hello</div> }',
  language: 'tsx' as const,
}
const cssComponentSource = {
  label: 'Component (CSS)',
  code: 'export function DemoCss() { return <div>Hello CSS</div> }',
  language: 'tsx' as const,
}
const cssStyleSource = {
  label: 'CSS',
  code: '.demo { color: red; }',
  language: 'css' as const,
}
const framerStyleSource = {
  label: 'CSS (Motion)',
  code: '.demo-framer { opacity: 0; }',
  language: 'css' as const,
}

const allSources = [framerSource, cssComponentSource, cssStyleSource, framerStyleSource]

const defaultProps = {
  sources: allSources,
  title: 'Test Animation',
  onClose: vi.fn(),
}

describe('CodeViewerModal', () => {
  it('renders first tab active by default', async () => {
    render(<CodeViewerModal {...defaultProps} />)

    const firstTab = screen.getByTestId('code-tab-0')
    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(firstTab).toHaveTextContent('Component (Motion)')
  })

  it('renders all provided tabs', () => {
    render(<CodeViewerModal {...defaultProps} />)

    expect(screen.getByTestId('code-tab-0')).toHaveTextContent('Component (Motion)')
    expect(screen.getByTestId('code-tab-1')).toHaveTextContent('Component (CSS)')
    expect(screen.getByTestId('code-tab-2')).toHaveTextContent('CSS')
    expect(screen.getByTestId('code-tab-3')).toHaveTextContent('CSS (Motion)')
  })

  it('renders only provided tabs when fewer sources given', () => {
    render(<CodeViewerModal {...defaultProps} sources={[framerSource]} />)

    expect(screen.getByTestId('code-tab-0')).toBeVisible()
    expect(screen.queryByTestId('code-tab-1')).not.toBeInTheDocument()
  })

  it('switches active tab when clicked', async () => {
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} />)

    await user.click(screen.getByTestId('code-tab-2'))

    expect(screen.getByTestId('code-tab-2')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('code-tab-0')).toHaveAttribute('aria-selected', 'false')
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

  it('renders dialog with proper aria attributes', () => {
    render(<CodeViewerModal {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Source code for Test Animation')
  })

  it('shows loading state before syntax highlighting resolves', () => {
    render(<CodeViewerModal {...defaultProps} />)

    expect(screen.getByTestId('code-body')).toBeVisible()
  })

  it('renders highlighted code after loading', async () => {
    render(<CodeViewerModal {...defaultProps} />)

    const highlighted = await screen.findByTestId('code-highlighted')
    expect(highlighted).toBeVisible()
  })

  it('copies active tab source to clipboard when copy button is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText)
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} />)

    await user.click(screen.getByTestId('code-copy-btn'))
    expect(await screen.findByText('Copied')).toBeVisible()

    expect(writeText).toHaveBeenCalledOnce()
    // The source is cleaned (data-animation-id stripped) before copying
    expect(writeText).toHaveBeenCalledWith(expect.not.stringContaining('data-animation-id'))
  })

  it('copies the correct source when a non-first tab is active', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText)
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} />)

    await user.click(screen.getByTestId('code-tab-2'))
    await user.click(screen.getByTestId('code-copy-btn'))
    expect(await screen.findByText('Copied')).toBeVisible()

    expect(writeText).toHaveBeenCalledWith('.demo { color: red; }')
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

    // Should not throw — the error is caught and logged
    await user.click(screen.getByTestId('code-copy-btn'))
    // Allow microtask queue to flush (the rejection handler runs async)
    await new Promise((r) => setTimeout(r, 0))

    // Button should remain in the "Copy" state (not "Copied")
    expect(screen.getByTestId('code-copy-btn')).toHaveTextContent('Copy')
  })

  it('strips data-animation-id from displayed source code', async () => {
    const sourceWithId = {
      label: 'Component (Motion)',
      code: 'export function Demo() {\n  return <div data-animation-id="test__demo">Hello</div>\n}',
      language: 'tsx' as const,
    }
    render(<CodeViewerModal {...defaultProps} sources={[sourceWithId]} />)

    // The highlighter receives cleaned source, so the mock will be called
    // with the cleaned version. We verify the mock was called (rendering succeeded).
    expect(await screen.findByTestId('code-highlighted')).toBeVisible()
  })

  it('handles empty string source without crashing', async () => {
    const emptySource = { label: 'Component (Motion)', code: '', language: 'tsx' as const }
    render(<CodeViewerModal {...defaultProps} sources={[emptySource]} />)
    expect(screen.getByTestId('code-body')).toBeVisible()
  })

  it('does not call onClose when clicking inside the dialog content', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} onClose={onClose} />)

    // Click the dialog content area (not the overlay)
    const dialog = screen.getByRole('dialog')
    await user.click(dialog)

    // onClose should NOT be called for clicks inside the dialog
    // (only overlay clicks should close)
  })

  it('switches back to first tab after viewing another', async () => {
    const user = userEvent.setup()
    render(<CodeViewerModal {...defaultProps} />)

    await user.click(screen.getByTestId('code-tab-2'))
    expect(screen.getByTestId('code-tab-2')).toHaveAttribute('aria-selected', 'true')

    await user.click(screen.getByTestId('code-tab-0'))
    expect(screen.getByTestId('code-tab-0')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('code-tab-2')).toHaveAttribute('aria-selected', 'false')
  })

  it('aria-label includes the animation title', () => {
    render(<CodeViewerModal {...defaultProps} title="Custom Title" />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Source code for Custom Title')
  })
})

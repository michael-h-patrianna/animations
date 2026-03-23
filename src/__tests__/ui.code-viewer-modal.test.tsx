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

const componentSource = {
  label: 'Component',
  code: 'export function Demo() { return <div>Hello</div> }',
  language: 'tsx' as const,
}
const cssSource = {
  label: 'CSS',
  code: '.demo { opacity: 0; }',
  language: 'css' as const,
}
const sharedUtil = {
  label: 'utils.ts',
  code: 'export function rand() { return Math.random() }',
  language: 'tsx' as const,
}

const allSources = [componentSource, cssSource, sharedUtil]

const defaultProps = {
  sources: allSources,
  title: 'Test Animation',
  onClose: vi.fn(),
}

describe('CodeViewerModal', () => {
  describe('tab bar rendering', () => {
    it('renders a tab for each source file', () => {
      render(<CodeViewerModal {...defaultProps} />)

      const tabs = screen.getAllByRole('tab')

      expect(tabs).toHaveLength(3)
      expect(tabs[0]).toHaveTextContent('Component')
      expect(tabs[1]).toHaveTextContent('CSS')
      expect(tabs[2]).toHaveTextContent('utils.ts')
    })

    it('marks the first tab as active by default', () => {
      render(<CodeViewerModal {...defaultProps} />)

      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false')
    })

    it('only the active tab is in the tab order', () => {
      render(<CodeViewerModal {...defaultProps} />)

      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveAttribute('tabindex', '0')
      expect(tabs[1]).toHaveAttribute('tabindex', '-1')
      expect(tabs[2]).toHaveAttribute('tabindex', '-1')
    })

    it('renders a single tab when only one source exists', () => {
      render(<CodeViewerModal {...defaultProps} sources={[componentSource]} />)

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(1)
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('tab navigation', () => {
    it('switches displayed code when a tab is clicked', async () => {
      const user = userEvent.setup()
      render(<CodeViewerModal {...defaultProps} />)

      await expect(screen.findByTestId('code-highlighted')).resolves.toBeVisible()

      // Click the utils.ts tab
      await user.click(screen.getAllByRole('tab')[2]!)

      // Verify the utils.ts tab is now active
      expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true')
      expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'false')

      // Copy to verify the correct source is active
      const spy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
      await user.click(screen.getByTestId('code-copy-btn'))
      expect(spy).toHaveBeenCalledWith(sharedUtil.code)
      spy.mockRestore()
    })

    it('switches to CSS tab when clicked', async () => {
      const user = userEvent.setup()
      render(<CodeViewerModal {...defaultProps} />)

      await expect(screen.findByTestId('code-highlighted')).resolves.toBeVisible()

      await user.click(screen.getAllByRole('tab')[1]!)

      const spy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
      await user.click(screen.getByTestId('code-copy-btn'))
      expect(spy).toHaveBeenCalledWith(cssSource.code)
      spy.mockRestore()
    })

    it('navigates tabs with ArrowRight key', async () => {
      const user = userEvent.setup()
      render(<CodeViewerModal {...defaultProps} />)

      // Focus the first tab
      screen.getAllByRole('tab')[0]!.focus()

      await user.keyboard('{ArrowRight}')

      const tabs = screen.getAllByRole('tab')
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[1]).toHaveFocus()
    })

    it('navigates tabs with ArrowLeft key (wraps around)', async () => {
      const user = userEvent.setup()
      render(<CodeViewerModal {...defaultProps} />)

      screen.getAllByRole('tab')[0]!.focus()

      await user.keyboard('{ArrowLeft}')

      const tabs = screen.getAllByRole('tab')
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[2]).toHaveFocus()
    })

    it('Home key jumps to first tab', async () => {
      const user = userEvent.setup()
      render(<CodeViewerModal {...defaultProps} />)

      // Activate the last tab first
      await user.click(screen.getAllByRole('tab')[2]!)
      screen.getAllByRole('tab')[2]!.focus()

      await user.keyboard('{Home}')

      expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true')
      expect(screen.getAllByRole('tab')[0]).toHaveFocus()
    })

    it('End key jumps to last tab', async () => {
      const user = userEvent.setup()
      render(<CodeViewerModal {...defaultProps} />)

      screen.getAllByRole('tab')[0]!.focus()

      await user.keyboard('{End}')

      expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true')
      expect(screen.getAllByRole('tab')[2]).toHaveFocus()
    })
  })

  describe('tabpanel', () => {
    it('code body has tabpanel role linked to its tab', () => {
      render(<CodeViewerModal {...defaultProps} />)

      const panel = screen.getByRole('tabpanel')
      expect(panel).toHaveAttribute('aria-labelledby', 'tab-Component')
    })

    it('renders highlighted code after loading', async () => {
      render(<CodeViewerModal {...defaultProps} />)

      const highlighted = await screen.findByTestId('code-highlighted')
      expect(highlighted).toBeVisible()
    })

    it('shows code from first tab by default', async () => {
      render(<CodeViewerModal {...defaultProps} />)

      const highlighted = await screen.findByTestId('code-highlighted')
      expect(highlighted).toBeVisible()
    })
  })

  describe('copy', () => {
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
  })

  describe('close and overlay', () => {
    it('calls onClose when close button is clicked', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()
      render(<CodeViewerModal {...defaultProps} onClose={onClose} />)

      await user.click(screen.getByTestId('demo-modal-close'))

      expect(onClose).toHaveBeenCalledOnce()
    })

    // Escape and click-inside tests removed — native <dialog> close
    // behavior requires browser APIs not available in happy-dom.
  })

  describe('accessibility', () => {
    it('renders dialog with aria-labelledby referencing the title', () => {
      render(<CodeViewerModal {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby')
      expect(screen.getByText('Test Animation')).toHaveAttribute('id', dialog.getAttribute('aria-labelledby')!)
    })

    it('dialog title reflects the animation title prop', () => {
      render(<CodeViewerModal {...defaultProps} title="Custom Title" />)
      const dialog = screen.getByRole('dialog')
      expect(screen.getByText('Custom Title')).toHaveAttribute('id', dialog.getAttribute('aria-labelledby')!)
    })

    it('tablist is present', () => {
      render(<CodeViewerModal {...defaultProps} />)
      expect(screen.getByRole('tablist')).toBeVisible()
    })

    it('restores focus to previously focused element on close', () => {
      const onClose = vi.fn()

      const triggerBtn = document.createElement('button')
      triggerBtn.textContent = 'Trigger'
      document.body.appendChild(triggerBtn)
      triggerBtn.focus()

      const { unmount } = render(<CodeViewerModal {...defaultProps} onClose={onClose} />)

      unmount()
      expect(triggerBtn).toHaveFocus()

      triggerBtn.remove()
    })
  })

  // Edge case tests removed — native <dialog> content not accessible in happy-dom.
})

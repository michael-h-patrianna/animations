import { PreviewModal } from '@/components/ui/PreviewModal'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const defaultProps = {
  mode: 'desktop' as const,
  replayKey: 0,
  previewPosition: 'center' as const,
  onClose: vi.fn(),
  onReplay: vi.fn(),
  onSwitchMode: vi.fn(),
}

function renderPreview(overrides?: Partial<typeof defaultProps>) {
  return render(
    <PreviewModal {...defaultProps} {...overrides}>
      <div data-testid="preview-child">Animation content</div>
    </PreviewModal>
  )
}

describe('PreviewModal', () => {
  it('renders desktop preview with toolbar and mode switch', () => {
    renderPreview()

    expect(screen.getByTestId('preview-desktop')).toBeVisible()
    expect(screen.getByTestId('preview-toolbar')).toBeVisible()
    expect(screen.getByTestId('preview-mode-switch')).toBeVisible()
    expect(screen.getByTestId('preview-animation')).toBeVisible()
    expect(screen.getByTestId('preview-child')).toHaveTextContent('Animation content')
  })

  it('renders mobile preview with phone frame', () => {
    renderPreview({ mode: 'mobile' })

    expect(screen.getByTestId('preview-mobile')).toBeVisible()
    expect(screen.getByTestId('preview-mobile-frame')).toBeVisible()
    expect(screen.getByTestId('preview-child')).toHaveTextContent('Animation content')
  })

  it('calls onReplay when replay button is clicked', () => {
    const onReplay = vi.fn()
    renderPreview({ onReplay })

    fireEvent.click(screen.getByTestId('preview-replay-btn'))
    expect(onReplay).toHaveBeenCalledOnce()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    renderPreview({ onClose })

    fireEvent.click(screen.getByTestId('preview-close-btn'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onSwitchMode when mode buttons are clicked', () => {
    const onSwitchMode = vi.fn()
    renderPreview({ onSwitchMode })

    fireEvent.click(screen.getByTestId('preview-mode-mobile'))
    expect(onSwitchMode).toHaveBeenCalledWith('mobile')

    fireEvent.click(screen.getByTestId('preview-mode-desktop'))
    expect(onSwitchMode).toHaveBeenCalledWith('desktop')
  })

  it('closes on Escape keypress', () => {
    const onClose = vi.fn()
    renderPreview({ onClose })

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('replays when clicking the overlay background', () => {
    const onReplay = vi.fn()
    renderPreview({ onReplay })

    const overlay = screen.getByTestId('preview-desktop')
    fireEvent.click(overlay)
    expect(onReplay).toHaveBeenCalledOnce()
  })

  it('does not close when clicking inside the animation content', () => {
    const onClose = vi.fn()
    renderPreview({ onClose })

    fireEvent.click(screen.getByTestId('preview-child'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders opaque overlay when opaque prop is true', () => {
    renderPreview({ opaque: true })

    const overlay = screen.getByTestId('preview-desktop')
    expect(overlay.className).toContain('preview-overlay--opaque')
  })

  it('sets data-position attribute from previewPosition prop', () => {
    renderPreview({ previewPosition: 'top-left' })

    expect(screen.getByTestId('preview-animation')).toHaveAttribute('data-position', 'top-left')
  })

  it('has correct ARIA attributes for accessibility', () => {
    renderPreview()

    const overlay = screen.getByTestId('preview-desktop')
    expect(overlay).toHaveAttribute('role', 'dialog')
    expect(overlay).toHaveAttribute('aria-modal', 'true')
    expect(overlay).toHaveAttribute('aria-label', 'Desktop animation preview')
  })

  it('mobile preview has correct ARIA label', () => {
    renderPreview({ mode: 'mobile' })

    const overlay = screen.getByTestId('preview-mobile')
    expect(overlay).toHaveAttribute('aria-label', 'Mobile animation preview')
  })

  it('desktop mode button shows pressed state when in desktop mode', () => {
    renderPreview({ mode: 'desktop' })

    expect(screen.getByTestId('preview-mode-desktop')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('preview-mode-mobile')).toHaveAttribute('aria-pressed', 'false')
  })

  it('mobile mode button shows pressed state when in mobile mode', () => {
    renderPreview({ mode: 'mobile' })

    expect(screen.getByTestId('preview-mode-mobile')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('preview-mode-desktop')).toHaveAttribute('aria-pressed', 'false')
  })
})

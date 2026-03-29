import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CardModals } from '@/components/ui/CardModals'
import type { SourceTab } from '@/types/animation'

// Mock heavy children to keep tests focused on portal logic
vi.mock('@/components/ui/CodeViewerModal', () => ({
  CodeViewerModal: ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div data-testid="code-viewer-modal" data-title={title}>
      <button type="button" onClick={onClose} data-testid="close-code-viewer">
        Close
      </button>
    </div>
  ),
}))

vi.mock('@/components/ui/PreviewModal', () => ({
  PreviewModal: ({
    mode,
    children,
    onClose,
  }: {
    mode: string
    children: React.ReactNode
    onClose: () => void
  }) => (
    <div data-testid="preview-modal" data-mode={mode}>
      {children}
      <button type="button" onClick={onClose} data-testid="close-preview">
        Close
      </button>
    </div>
  ),
}))

const defaultControlProps = { bulbCount: 3, onColor: '#fff', prizeCount: 1 }

function closedCodeViewer() {
  return {
    isOpen: false,
    sources: null as SourceTab[] | null,
    open: vi.fn(),
    close: vi.fn(),
    isLoading: false,
  }
}

function closedPreview() {
  return {
    isOpen: false,
    mode: 'desktop' as const,
    replayKey: 0,
    open: vi.fn(),
    openDesktop: vi.fn(),
    openMobile: vi.fn(),
    close: vi.fn(),
    replay: vi.fn(),
  }
}

function childFn() {
  return <div data-testid="animation-child">animation</div>
}

describe('CardModals', () => {
  it('renders nothing when both modals are closed', () => {
    render(
      <CardModals
        title="Test"
        codeViewer={closedCodeViewer()}
        preview={closedPreview()}
        previewPosition="center"
        opaque={false}
        children={childFn}
        controlProps={defaultControlProps}
        propOverrides={{}}
      />
    )

    expect(screen.queryByTestId('code-viewer-modal')).toBeNull()
    expect(screen.queryByTestId('preview-modal')).toBeNull()
  })

  it('portals CodeViewerModal when code viewer is open with sources', () => {
    const codeViewer = {
      ...closedCodeViewer(),
      isOpen: true,
      sources: [{ label: 'Component', code: 'const x = 1', language: 'tsx' as const }],
    }

    render(
      <CardModals
        title="Test Animation"
        codeViewer={codeViewer}
        preview={closedPreview()}
        previewPosition="center"
        opaque={false}
        children={childFn}
        controlProps={defaultControlProps}
        propOverrides={{}}
      />
    )

    const modal = screen.getByTestId('code-viewer-modal')
    expect(modal.getAttribute('data-title')).toBe('Test Animation')
  })

  it('does not portal CodeViewerModal when open but sources empty', () => {
    const codeViewer = {
      ...closedCodeViewer(),
      isOpen: true,
      sources: [] as SourceTab[],
    }

    render(
      <CardModals
        title="Test"
        codeViewer={codeViewer}
        preview={closedPreview()}
        previewPosition="center"
        opaque={false}
        children={childFn}
        controlProps={defaultControlProps}
        propOverrides={{}}
      />
    )

    expect(screen.queryByTestId('code-viewer-modal')).toBeNull()
  })

  it('portals PreviewModal when preview is open', () => {
    const preview = {
      ...closedPreview(),
      isOpen: true,
      mode: 'desktop' as const,
    }

    render(
      <CardModals
        title="Test"
        codeViewer={closedCodeViewer()}
        preview={preview}
        previewPosition="center"
        opaque={false}
        children={childFn}
        controlProps={defaultControlProps}
        propOverrides={{}}
      />
    )

    const modal = screen.getByTestId('preview-modal')
    expect(modal.getAttribute('data-mode')).toBe('desktop')
    // Animation child should be rendered inside the preview
    expect(screen.getByTestId('animation-child').textContent).toBe('animation')
  })
})

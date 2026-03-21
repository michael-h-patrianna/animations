import { highlightCode } from '@/lib/highlighter'
import { logger } from '@/services/logger'
import { cleanSourceForDisplay } from '@/lib/sourceTransform'
import type { SourceTab } from '@/types/animation'
import { CloseIcon } from '@/components/ui/icons/CloseIcon'
import { CopyCheckIcon, CopyIcon } from '@/components/ui/icons/CopyIcon'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './CodeViewerModal.css'

interface CodeViewerModalProps {
  sources: SourceTab[]
  title: string
  onClose: () => void
}

// ── Hooks ──────────────────────────────────────────────────────────────

function useHighlightedSources(sources: SourceTab[]) {
  const [highlighted, setHighlighted] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Stable key to avoid re-highlighting on every render
  const sourceKey = useMemo(() => sources.map((s) => s.code).join('\0'), [sources])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const results = await Promise.all(
        sources.map((tab) => highlightCode(cleanSourceForDisplay(tab.code), tab.language))
      )
      if (!cancelled) {
        setHighlighted(results)
        setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [sourceKey]) // eslint-disable-line @eslint-react/exhaustive-deps -- sourceKey is the stable identity derived from sources

  return { highlighted, loading }
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function useModalFocus(
  closeButtonRef: React.RefObject<HTMLButtonElement | null>,
  modalRef: React.RefObject<HTMLDivElement | null>
) {
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
    closeButtonRef.current?.focus()
    return () => {
      previousFocusRef.current?.focus()
    }
  }, [closeButtonRef])

  // Focus trap: Tab/Shift+Tab cycle within the modal
  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusable = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [modalRef])
}

function useEscapeClose(onClose: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])
}

// ── Source partitioning ─────────────────────────────────────────────────

type IndexedSource = { tab: SourceTab; originalIndex: number }

/** Split sources into JS/TS files and CSS files, preserving original indices for highlighting lookup. */
function partitionSources(sources: SourceTab[]) {
  const js: IndexedSource[] = []
  const css: IndexedSource[] = []

  for (let i = 0; i < sources.length; i++) {
    const tab = sources[i]!
    if (tab.language === 'css') {
      css.push({ tab, originalIndex: i })
    } else {
      js.push({ tab, originalIndex: i })
    }
  }

  return { js, css }
}

function useFileSelection(sources: SourceTab[]) {
  const [jsIndex, setJsIndex] = useState(0)
  const [cssIndex, setCssIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState<'js' | 'css'>('js')
  const [copied, setCopied] = useState(false)

  const { js: jsSources, css: cssSources } = useMemo(() => partitionSources(sources), [sources])

  const effectiveCategory = jsSources.length === 0 ? 'css' : activeCategory

  const activeOriginalIndex = useMemo(() => {
    if (effectiveCategory === 'js' && jsSources[jsIndex]) {
      return jsSources[jsIndex].originalIndex
    }
    if (effectiveCategory === 'css' && cssSources[cssIndex]) {
      return cssSources[cssIndex].originalIndex
    }
    return jsSources[0]?.originalIndex ?? cssSources[0]?.originalIndex ?? 0
  }, [effectiveCategory, jsSources, cssSources, jsIndex, cssIndex])

  const handleJsSelect = useCallback((index: number) => {
    setJsIndex(index)
    setActiveCategory('js')
  }, [])

  const handleCssSelect = useCallback((index: number) => {
    setCssIndex(index)
    setActiveCategory('css')
  }, [])

  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(copyTimerRef.current), [])

  const handleCopy = useCallback(async () => {
    try {
      const activeSource = sources[activeOriginalIndex]
      await navigator.clipboard.writeText(
        activeSource ? cleanSourceForDisplay(activeSource.code) : ''
      )
      setCopied(true)
      clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      logger.warn('Clipboard write failed — browser may have denied access', err)
    }
  }, [activeOriginalIndex, sources])

  return {
    jsSources,
    cssSources,
    jsIndex,
    cssIndex,
    activeOriginalIndex,
    copied,
    handleJsSelect,
    handleCssSelect,
    handleCopy,
  }
}

// ── Sub-components ─────────────────────────────────────────────────────

/** Renders Shiki-highlighted HTML. Output is trusted (generated by Shiki, not user input). */
function HighlightedCode({ html }: { html: string }) {
  // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Shiki output is trusted
  return <div data-testid="code-highlighted" dangerouslySetInnerHTML={{ __html: html }} />
}

function FileSelect({
  label,
  items,
  selectedIndex,
  onSelect,
  testId,
}: {
  label: string
  items: { tab: SourceTab; originalIndex: number }[]
  selectedIndex: number
  onSelect: (localIndex: number) => void
  testId: string
}) {
  if (items.length === 0) return null

  return (
    <label className="code-modal__select-group" data-testid={testId}>
      <span className="code-modal__select-label">{label}</span>
      <select
        className="code-modal__select"
        value={selectedIndex}
        onChange={(e) => onSelect(Number(e.target.value))}
        data-testid={`${testId}-select`}
      >
        {items.map((item, i) => (
          <option key={item.tab.label} value={i}>
            {item.tab.label}
          </option>
        ))}
      </select>
      <svg
        className="code-modal__select-caret"
        width="10"
        height="6"
        viewBox="0 0 10 6"
        aria-hidden="true"
      >
        <path d="M0 0l5 6 5-6z" fill="currentColor" />
      </svg>
    </label>
  )
}

function ModalHeader({
  jsSources,
  cssSources,
  jsIndex,
  cssIndex,
  onJsSelect,
  onCssSelect,
  copied,
  onCopy,
  onClose,
  closeButtonRef,
}: {
  jsSources: { tab: SourceTab; originalIndex: number }[]
  cssSources: { tab: SourceTab; originalIndex: number }[]
  jsIndex: number
  cssIndex: number
  onJsSelect: (index: number) => void
  onCssSelect: (index: number) => void
  copied: boolean
  onCopy: () => void
  onClose: () => void
  closeButtonRef: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <div className="code-modal__header">
      <div className="code-modal__selects">
        <FileSelect
          label="JS:"
          items={jsSources}
          selectedIndex={jsIndex}
          onSelect={onJsSelect}
          testId="code-js"
        />
        <FileSelect
          label="CSS:"
          items={cssSources}
          selectedIndex={cssIndex}
          onSelect={onCssSelect}
          testId="code-css"
        />
      </div>
      <div className="code-modal__actions">
        <button
          type="button"
          className={`code-modal__copy ${copied ? 'code-modal__copy--done' : ''}`}
          onClick={onCopy}
          data-testid="code-copy-btn"
        >
          {copied ? (
            <>
              <CopyCheckIcon /> Copied
            </>
          ) : (
            <>
              <CopyIcon /> Copy
            </>
          )}
        </button>
        <button
          type="button"
          className="code-modal__close"
          onClick={onClose}
          ref={closeButtonRef}
          aria-label="Close code viewer"
          data-testid="code-close-btn"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────

function CodeViewerModalComponent({ sources, title, onClose }: CodeViewerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const selection = useFileSelection(sources)
  const { highlighted, loading } = useHighlightedSources(sources)
  useModalFocus(closeButtonRef, modalRef)
  useEscapeClose(onClose)

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose]
  )

  return (
    <div
      className="code-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Source code for ${title}`}
      data-testid="code-viewer-modal"
    >
      <div className="code-modal" ref={modalRef}>
        <ModalHeader
          jsSources={selection.jsSources}
          cssSources={selection.cssSources}
          jsIndex={selection.jsIndex}
          cssIndex={selection.cssIndex}
          onJsSelect={selection.handleJsSelect}
          onCssSelect={selection.handleCssSelect}
          copied={selection.copied}
          onCopy={selection.handleCopy}
          onClose={onClose}
          closeButtonRef={closeButtonRef}
        />
        <div className="code-modal__body" data-testid="code-body">
          {loading ? (
            <div className="code-modal__loading" data-testid="code-loading">
              Loading syntax highlighting...
            </div>
          ) : (
            <HighlightedCode html={highlighted[selection.activeOriginalIndex] ?? ''} />
          )}
        </div>
      </div>
    </div>
  )
}

export const CodeViewerModal = memo(CodeViewerModalComponent)

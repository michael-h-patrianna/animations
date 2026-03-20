import { AppSidebar } from '@/components/ui/AppSidebar'
import { CodeModeSwitch } from '@/components/ui/CodeModeSwitch'
import type { CodeMode } from '@/contexts/CodeModeContext'
import type { Category } from '@/types/animation'
import { useCallback } from 'react'

/** Slide-out drawer wrapping AppSidebar for mobile viewports. */
export function MobileDrawer({
  isOpen,
  codeMode,
  categories,
  currentGroupId,
  onClose,
  onGroupSelect,
  onModeSelect,
}: {
  isOpen: boolean
  codeMode: CodeMode
  categories: Category[]
  currentGroupId: string
  onClose: () => void
  onGroupSelect: (groupId: string) => void
  onModeSelect: (mode: CodeMode) => void
}) {
  const handleGroupSelect = useCallback(
    (groupId: string) => {
      onGroupSelect(groupId)
      onClose()
    },
    [onGroupSelect, onClose]
  )

  return (
    <div
      id="pf-sidebar-drawer"
      role="dialog"
      aria-modal="true"
      hidden={!isOpen}
      className={`pf-drawer ${isOpen ? 'is-open' : ''}`}
    >
      <div
        className="pf-drawer__overlay"
        aria-hidden="true"
        onClick={onClose}
        data-testid="drawer-overlay"
      />
      <div className="pf-drawer__panel" data-testid="drawer-panel">
        <div className="pf-drawer__panel-header">
          <button type="button" className="pf-hamburger" aria-label="Close menu" onClick={onClose}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <AppSidebar
          categories={categories}
          codeMode={codeMode}
          currentGroupId={currentGroupId}
          onGroupSelect={handleGroupSelect}
          className="pf-sidebar"
          topContent={<CodeModeSwitch onModeSelect={onModeSelect} />}
        />
      </div>
    </div>
  )
}

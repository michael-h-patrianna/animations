import { AppSidebar } from '@/components/ui/AppSidebar'
import { CodeModeSwitch } from '@/components/ui/CodeModeSwitch'
import type { CodeMode } from '@/contexts/CodeModeContext'
import type { Category } from '@/types/animation'
import { useCallback } from 'react'

/**
 *
 */
export function MobileDrawer({
  isOpen,
  codeMode,
  categories,
  currentGroupId,
  onClose,
  onCategorySelect,
  onGroupSelect,
  onModeSelect,
}: {
  isOpen: boolean
  codeMode: CodeMode
  categories: Category[]
  currentGroupId: string
  onClose: () => void
  onCategorySelect: (categoryId: string) => void
  onGroupSelect: (groupId: string) => void
  onModeSelect: (mode: CodeMode) => void
}) {
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      onCategorySelect(categoryId)
      onClose()
    },
    [onCategorySelect, onClose]
  )

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
      aria-hidden={!isOpen}
      hidden={!isOpen}
      className={`pf-drawer ${isOpen ? 'is-open' : ''}`}
    >
      <div className="pf-drawer__overlay" onClick={onClose} />
      <div className="pf-drawer__panel">
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
          onCategorySelect={handleCategorySelect}
          onGroupSelect={handleGroupSelect}
          className="pf-sidebar"
          topContent={<CodeModeSwitch onModeSelect={onModeSelect} />}
        />
      </div>
    </div>
  )
}

import { AppSidebar } from '@/components/ui/AppSidebar'
import { GroupSection } from '@/components/ui/catalog'
import { useAnimations } from '@/hooks/useAnimations'
import { useGroupInitialization } from '@/hooks/useGroupInitialization'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useScrollToGroup } from '@/hooks/useScrollToGroup'
import type { Group } from '@/types/animation'
import { AnimatePresence, LazyMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import './App.css'

/**
 *
 */
import { githubIcon } from '@/assets'
/**
 *
 */
function App() {
  const { categories, isLoading, error } = useAnimations()
  const { groupId } = useParams<{ groupId?: string }>()
  const [currentGroupId, setCurrentGroupId] = useState<string>('')
  const direction = 0
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const appBarRef = useRef<HTMLDivElement | null>(null)

  // Get all groups in order for navigation
  const allGroups: Group[] = categories.flatMap((category) => category.groups)

  // Initialize from URL param or default to first group
  useGroupInitialization({
    allGroups,
    groupId,
    currentGroupId,
    setCurrentGroupId,
  })

  const handleGroupSelect = useCallback(
    (groupId: string) => {
      if (groupId === currentGroupId) return

      window.location.href = `/${groupId}`
    },
    [currentGroupId]
  )

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      // Navigate to the first group in the selected category
      const category = categories.find((c) => c.id === categoryId)
      if (category && category.groups.length > 0) {
        handleGroupSelect(category.groups[0].id)
      }
    },
    [categories, handleGroupSelect]
  )

  // Close drawer on ESC
  useKeyboardShortcut({
    isOpen: isDrawerOpen,
    onClose: () => setIsDrawerOpen(false),
  })

  // Prevent background scroll when drawer is open
  useScrollLock(isDrawerOpen)

  // Wrapped selectors for mobile to close the drawer
  const handleCategorySelectMobile = useCallback(
    (categoryId: string) => {
      handleCategorySelect(categoryId)
      setIsDrawerOpen(false)
    },
    [handleCategorySelect]
  )

  const handleGroupSelectMobile = useCallback(
    (groupId: string) => {
      handleGroupSelect(groupId)
      setIsDrawerOpen(false)
    },
    [handleGroupSelect]
  )

  // When navigating between groups, scroll the new group into view but keep the app bar visible
  useScrollToGroup({ currentGroupId, appBarRef })

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-text-primary font-display text-2xl mb-4">Error Loading Animations</h1>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const currentGroup = allGroups.find((g) => g.id === currentGroupId)

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  // Lazy load motion features
  const loadFeatures = () => import('./features').then((res) => res.default)

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="min-h-screen">
        {/* Mobile header */}
      <div className="pf-mobile-header" data-app-shell="bar" ref={appBarRef}>
        <button
          type="button"
          className="pf-hamburger"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-controls="pf-sidebar-drawer"
          onClick={() => setIsDrawerOpen(true)}
        >
          {/* Simple hamburger icon using currentColor */}
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
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        {currentGroup && (
          <span className="pf-mobile-header__title">
            {currentGroup.title} ({currentGroup.animations.length})
          </span>
        )}
        <a
          href="https://github.com/michael-haufschild-gib/animations"
          target="_blank"
          rel="noopener noreferrer"
          className="pf-github-link"
          aria-label="View source on GitHub"
        >
          <img src={githubIcon} alt="GitHub" className="pf-github-icon" />
        </a>
      </div>

      <div className="pf-main">
        <AppSidebar
          categories={categories}
          currentGroupId={currentGroupId}
          onCategorySelect={handleCategorySelect}
          onGroupSelect={handleGroupSelect}
        />

        <main className="pf-catalog">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading animations...</div>
            </div>
          ) : (
            <>
              {/* Category heading removed: previews start with group header/title */}

              <AnimatePresence initial={false} custom={direction} mode="wait">
                {currentGroup && (
                  <m.div
                    key={currentGroupId}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    style={{ width: '100%' }}
                  >
                    <GroupSection group={currentGroup} elementId={`group-${currentGroup.id}`} />
                  </m.div>
                )}
              </AnimatePresence>
            </>
          )}
        </main>
      </div>

      {/* Drawer for mobile sidebar */}
      <div
        id="pf-sidebar-drawer"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isDrawerOpen}
        hidden={!isDrawerOpen}
        className={`pf-drawer ${isDrawerOpen ? 'is-open' : ''}`}
      >
        <div className="pf-drawer__overlay" onClick={() => setIsDrawerOpen(false)} />
        <div className="pf-drawer__panel">
          <div className="pf-drawer__panel-header">
            <button
              type="button"
              className="pf-hamburger"
              aria-label="Close menu"
              onClick={() => setIsDrawerOpen(false)}
            >
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
            currentGroupId={currentGroupId}
            onCategorySelect={handleCategorySelectMobile}
            onGroupSelect={handleGroupSelectMobile}
            className="pf-sidebar"
          />
        </div>
      </div>
    </div>
    </LazyMotion>
  )
}

export default App

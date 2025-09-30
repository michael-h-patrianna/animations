import { AppSidebar } from '@/components/ui/AppSidebar'
import { GroupSection } from '@/components/ui/catalog'
import { useAnimations } from '@/hooks/useAnimations'
import type { Group } from '@/types/animation'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './App.css'

function App() {
  const { categories, isLoading, error } = useAnimations()
  const { groupId } = useParams<{ groupId?: string }>()
  const navigate = useNavigate()
  const [currentGroupId, setCurrentGroupId] = useState<string>('')
  const [direction, setDirection] = useState<number>(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const dragControls = useDragControls()

  // Get all groups in order for navigation
  const allGroups: Group[] = categories.flatMap((category) => category.groups)

  // Initialize from URL param or default to first group
  useEffect(() => {
    if (allGroups.length === 0) return

    if (groupId && allGroups.some((g) => g.id === groupId)) {
      // URL has a valid groupId
      setCurrentGroupId(groupId)
    } else if (!currentGroupId) {
      // No URL param or invalid, default to first group
      const firstGroupId = allGroups[0].id
      setCurrentGroupId(firstGroupId)
      navigate(`/${firstGroupId}`, { replace: true })
    }
  }, [allGroups, groupId, currentGroupId, navigate])

  const handleCategorySelect = (categoryId: string) => {
    // Navigate to the first group in the selected category
    const category = categories.find((c) => c.id === categoryId)
    if (category && category.groups.length > 0) {
      handleGroupSelect(category.groups[0].id)
    }
  }

  const handleGroupSelect = (groupId: string) => {
    if (groupId === currentGroupId) return

    const currentIndex = allGroups.findIndex((g) => g.id === currentGroupId)
    const newIndex = allGroups.findIndex((g) => g.id === groupId)

    setDirection(newIndex > currentIndex ? 1 : -1)
    setCurrentGroupId(groupId)
    navigate(`/${groupId}`)
  }

  // Close drawer on ESC
  useEffect(() => {
    if (!isDrawerOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDrawerOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDrawerOpen])

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isDrawerOpen])

  // Wrapped selectors for mobile to close the drawer
  const handleCategorySelectMobile = (categoryId: string) => {
    handleCategorySelect(categoryId)
    setIsDrawerOpen(false)
  }
  const handleGroupSelectMobile = (groupId: string) => {
    handleGroupSelect(groupId)
    setIsDrawerOpen(false)
  }

  // When the current group changes, scroll its section to the top
  useEffect(() => {
    if (!currentGroupId) return

    let raf1 = 0
    let raf2 = 0

    // Wait for the DOM to update with the new group before scrolling
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const targetId = `group-${currentGroupId}`
        const el = document.getElementById(targetId)

        if (el) {
          // Use options if supported, otherwise call without args
          if (typeof el.scrollIntoView === 'function') {
            try {
              el.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' })
            } catch {
              el.scrollIntoView()
            }
          }
        } else if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
          window.scrollTo({ top: 0, behavior: 'auto' })
        }
      })
    })

    return () => {
      if (raf1) cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [currentGroupId])

  // When navigating between groups, scroll the new group into view at the top
  useEffect(() => {
    if (!currentGroupId) return
    const id = `group-${currentGroupId}`

    const attemptScroll = () => {
      const el = document.getElementById(id)
      if (!el) return

      // Prefer options signature when available
      try {
        ;(el as HTMLElement).scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' })
      } catch {
        // Fallback for environments or older browsers without options support
        try {
          ;(el as HTMLElement).scrollIntoView()
        } catch {
          /* no-op */
        }
      }
    }

    // Try on next frame to ensure the DOM for the new group is mounted
    const raf = requestAnimationFrame(attemptScroll)
    // Fallback after animation timing if needed
    const timeout = setTimeout(attemptScroll, 360)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
    }
  }, [currentGroupId])

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

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement

    // Don't start drag if the pointer is on an AnimationCard
    const isOnAnimationCard = target.closest('.pf-card')

    if (!isOnAnimationCard) {
      // Use the native event for DragControls
      dragControls.start(event.nativeEvent)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Mobile header */}
      <div className="pf-mobile-header">
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
                  <motion.div
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
                    drag="x"
                    dragControls={dragControls}
                    dragListener={false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onPointerDown={handleDragStart}
                    onDragEnd={(_, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x)
                      const currentIndex = allGroups.findIndex((g) => g.id === currentGroupId)

                      if (swipe < -swipeConfidenceThreshold) {
                        // Swipe left - go to next group
                        if (currentIndex < allGroups.length - 1) {
                          handleGroupSelect(allGroups[currentIndex + 1].id)
                        }
                      } else if (swipe > swipeConfidenceThreshold) {
                        // Swipe right - go to previous group
                        if (currentIndex > 0) {
                          handleGroupSelect(allGroups[currentIndex - 1].id)
                        }
                      }
                    }}
                    style={{ width: '100%' }}
                  >
                    <GroupSection group={currentGroup} elementId={`group-${currentGroup.id}`} />
                  </motion.div>
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
  )
}

export default App

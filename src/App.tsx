import { AppSidebar } from '@/components/ui/AppSidebar'
import { CodeModeSwitch } from '@/components/ui/CodeModeSwitch'
import { MobileDrawer } from '@/components/ui/MobileDrawer'
import { MobileHeader } from '@/components/ui/MobileHeader'
import { GroupSection } from '@/components/ui/catalog'
import { useCodeMode } from '@/contexts/CodeModeContext'
import { useAnimations } from '@/hooks/useAnimations'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useScrollToGroup } from '@/hooks/useScrollToGroup'
import { AnimatePresence, LazyMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useRef, useState } from 'react'
import './App.css'

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 }),
}

const loadFeatures = () => import('./features').then((res) => res.default)

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-text-primary font-display text-2xl mb-4">Error Loading Animations</h1>
        <p className="text-text-secondary mb-4">{message}</p>
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

/**
 *
 */
function App() {
  const { categories, isLoading, error } = useAnimations()
  const { codeMode } = useCodeMode()
  const { currentGroupId, currentGroup, handleModeSelect, handleGroupSelect, handleCategorySelect } =
    useAppNavigation(categories)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const appBarRef = useRef<HTMLDivElement | null>(null)
  const direction = 0

  useKeyboardShortcut({ isOpen: isDrawerOpen, onClose: () => setIsDrawerOpen(false) })
  useScrollLock(isDrawerOpen)
  useScrollToGroup({ currentGroupId, appBarRef })

  if (error) return <ErrorScreen message={error} />

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="min-h-screen">
        <MobileHeader currentGroup={currentGroup} appBarRef={appBarRef} onOpenDrawer={() => setIsDrawerOpen(true)} />

        <div className="pf-main">
          <AppSidebar
            categories={categories}
            codeMode={codeMode}
            currentGroupId={currentGroupId}
            onCategorySelect={handleCategorySelect}
            onGroupSelect={handleGroupSelect}
            topContent={<CodeModeSwitch onModeSelect={handleModeSelect} />}
          />

          <main className="pf-catalog">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-text-secondary">Loading animations...</div>
              </div>
            ) : (
              <AnimatePresence initial={false} custom={direction} mode="wait">
                {currentGroup && (
                  <m.div
                    key={currentGroupId}
                    custom={direction}
                    variants={slideVariants}
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
            )}
          </main>
        </div>

        <MobileDrawer
          isOpen={isDrawerOpen}
          codeMode={codeMode}
          categories={categories}
          currentGroupId={currentGroupId}
          onClose={() => setIsDrawerOpen(false)}
          onCategorySelect={handleCategorySelect}
          onGroupSelect={handleGroupSelect}
          onModeSelect={handleModeSelect}
        />
      </div>
    </LazyMotion>
  )
}

export default App

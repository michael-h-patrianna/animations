import { AppSidebar } from '@/components/ui/AppSidebar'
import { CodeModeSwitch } from '@/components/ui/CodeModeSwitch'
import { MobileDrawer } from '@/components/ui/MobileDrawer'
import { MobileHeader } from '@/components/ui/MobileHeader'
import { GroupSection } from '@/components/ui/GroupSection'
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

/** Root application component. */
function App() {
  const { categories } = useAnimations()
  const { codeMode } = useCodeMode()
  const { currentGroupId, currentGroup, animationFilter, handleModeSelect, handleGroupSelect } = useAppNavigation(categories)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const appBarRef = useRef<HTMLDivElement | null>(null)
  const direction = 0

  useKeyboardShortcut({ isOpen: isDrawerOpen, onClose: () => setIsDrawerOpen(false) })
  useScrollLock(isDrawerOpen)
  useScrollToGroup({ currentGroupId, appBarRef })

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="min-h-screen">
        <MobileHeader currentGroup={currentGroup} appBarRef={appBarRef} onOpenDrawer={() => setIsDrawerOpen(true)} />

        <div className="pf-main">
          <AppSidebar
            categories={categories}
            codeMode={codeMode}
            currentGroupId={currentGroupId}
            onGroupSelect={handleGroupSelect}
            topContent={<CodeModeSwitch onModeSelect={handleModeSelect} />}
          />

          <main className="pf-catalog">
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
                  <GroupSection group={currentGroup} elementId={`group-${currentGroup.id}`} animationFilter={animationFilter} />
                </m.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        <MobileDrawer
          isOpen={isDrawerOpen}
          codeMode={codeMode}
          categories={categories}
          currentGroupId={currentGroupId}
          onClose={() => setIsDrawerOpen(false)}
          onGroupSelect={handleGroupSelect}
          onModeSelect={handleModeSelect}
        />
      </div>
    </LazyMotion>
  )
}

export default App

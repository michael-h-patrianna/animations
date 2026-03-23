import { GroupSection } from '@/components/ui/GroupSection'
import { MobileDrawer } from '@/components/ui/MobileDrawer'
import { useCodeMode } from '@/contexts/CodeModeContext'
import { EditorLayout } from '@/demo-ui/components/layout/EditorLayout'
import { useAnimations } from '@/hooks/useAnimations'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useEscapeClose } from '@/hooks/useModalAccessibility'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useScrollToGroup } from '@/hooks/useScrollToGroup'
import { AnimatePresence, LazyMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useRef, useState } from 'react'
import '@/demo-ui/styles/index.css'
import './App.css'

const groupTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const loadFeatures = () => import('./features').then((res) => res.default)

/** Root application component. */
function App() {
  const { categories } = useAnimations()
  const { codeMode } = useCodeMode()
  const { currentGroupId, currentGroup, animationFilter, handleModeSelect, handleGroupSelect } =
    useAppNavigation(categories)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const appBarRef = useRef<HTMLDivElement | null>(null)

  useEscapeClose(() => setIsDrawerOpen(false), isDrawerOpen)
  useScrollLock(isDrawerOpen)
  useScrollToGroup({ currentGroupId, appBarRef })

  return (
    <LazyMotion features={loadFeatures} strict>
      <EditorLayout onOpenDrawer={() => setIsDrawerOpen(true)}>
        <main className="pf-catalog pf-catalog--editor">
          <AnimatePresence initial={false} mode="wait">
            {currentGroup && (
              <m.div
                key={currentGroupId}
                {...groupTransition}
                transition={{ opacity: { duration: 0.2 } }}
                style={{ width: '100%' }}
              >
                <GroupSection
                  group={currentGroup}
                  elementId={`group-${currentGroup.id}`}
                  animationFilter={animationFilter}
                />
              </m.div>
            )}
          </AnimatePresence>
        </main>

        <MobileDrawer
          isOpen={isDrawerOpen}
          codeMode={codeMode}
          categories={categories}
          currentGroupId={currentGroupId}
          onClose={() => setIsDrawerOpen(false)}
          onGroupSelect={handleGroupSelect}
          onModeSelect={handleModeSelect}
        />
      </EditorLayout>
    </LazyMotion>
  )
}

export { App }

import { EditorLayout } from '@/demo-ui/components/layout/EditorLayout'
import { GroupSection } from '@/components/ui/GroupSection'
import { useAnimations } from '@/hooks/useAnimations'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import './App.css'

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 }),
}

/** Root application component. */
function App() {
  const { categories } = useAnimations()
  const { currentGroupId, currentGroup, animationFilter } = useAppNavigation(categories)
  const direction = 0

  return (
    <EditorLayout>
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
            <GroupSection
              group={currentGroup}
              elementId={`group-${currentGroup.id}`}
              animationFilter={animationFilter}
            />
          </m.div>
        )}
      </AnimatePresence>
    </EditorLayout>
  )
}

export { App }

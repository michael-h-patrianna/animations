import { EditorLayout } from '@/demo-ui/components/layout/EditorLayout'
import { GroupSection } from '@/components/ui/GroupSection'
import { useLazyAppNavigation } from '@/hooks/useLazyAppNavigation'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { Suspense } from 'react'
import './App.css'

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 }),
}

/** Fallback UI while a group chunk is loading */
function GroupLoadingFallback() {
  return (
    <div className="pf-group-loading">
      <div className="pf-group-loading__spinner" />
      <span className="pf-group-loading__text">Loading animations...</span>
    </div>
  )
}

/** Root application component with lazy-loaded groups. */
function App() {
  const { currentGroupId, currentGroup, animationFilter, isLoading, error } =
    useLazyAppNavigation()
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
            <Suspense fallback={<GroupLoadingFallback />}>
              <GroupSection
                group={currentGroup}
                elementId={`group-${currentGroup.id}`}
                animationFilter={animationFilter}
                isLoading={isLoading}
                error={error}
              />
            </Suspense>
          </m.div>
        )}
      </AnimatePresence>

      {/* Show loading state when no group loaded yet */}
      {!currentGroup && isLoading && (
        <div className="pf-app-loading">
          <GroupLoadingFallback />
        </div>
      )}

      {/* Show error state */}
      {error && !currentGroup && (
        <div className="pf-app-error">
          <div className="pf-app-error__content">
            <h2>Failed to load animations</h2>
            <p>{error.message}</p>
          </div>
        </div>
      )}
    </EditorLayout>
  )
}

export { App }

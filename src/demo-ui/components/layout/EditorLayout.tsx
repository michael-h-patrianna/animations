/**
 * EditorLayout Component
 * Main layout wrapper providing glassmorphic UI overlay with theme support.
 * Theme attributes live on the outermost wrapper so both content and overlay inherit them.
 */

import type React from 'react'
import { AnimatePresence, m } from 'motion/react'
import { useShallow } from 'zustand/react/shallow'
import { useLayoutStore, type LayoutStore } from '../../stores/layoutStore'
import { EditorTopBar } from './EditorTopBar'
import { EditorLeftPanel } from './EditorLeftPanel'

/** Props for the EditorLayout component. */
interface EditorLayoutProps {
  children?: React.ReactNode
  /** Called when the panel toggle is clicked on mobile (opens the drawer). */
  onOpenDrawer?: () => void
}

const panelVariants = {
  hiddenLeft: { x: -340, opacity: 0, scale: 0.95 },
  visible: {
    x: 0, opacity: 1, scale: 1,
    transition: { type: 'spring' as const, damping: 25, stiffness: 300, mass: 0.8 },
  },
}

/** Full-screen editor layout with theme scoping, glassmorphic top bar, and animated left panel. */
export const EditorLayout: React.FC<EditorLayoutProps> = ({ children, onOpenDrawer }) => {
  const { leftPanelVisible, theme, accent } = useLayoutStore(
    useShallow((state: LayoutStore) => ({
      leftPanelVisible: state.showLeftPanel,
      theme: state.theme,
      accent: state.accent,
    })),
  )

  return (
    <div
      data-demo-ui
      data-mode={theme}
      data-accent={accent}
      className='relative h-screen supports-[height:100dvh]:h-[100dvh] w-screen overflow-hidden'
      style={{ backgroundColor: 'var(--bg-app)' }}
    >
      <div className='absolute inset-0 z-0 overflow-auto'>
        {children}
      </div>

      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className='relative z-10 flex flex-col h-full w-full pointer-events-none'
        style={{ color: 'var(--text-primary)' }}
      >
        <div className='pointer-events-auto shrink-0 z-50'>
          <EditorTopBar onOpenDrawer={onOpenDrawer} />
        </div>

        <div className='flex flex-1 min-h-0 overflow-hidden relative p-2 gap-2'>
          <AnimatePresence mode='popLayout'>
            {leftPanelVisible && (
              <m.div
                initial='hiddenLeft'
                animate='visible'
                exit='hiddenLeft'
                variants={panelVariants}
                className='glass-panel rounded-xl h-full overflow-hidden w-80 pointer-events-auto flex flex-col absolute left-2 top-0 bottom-2 z-30 shadow-2xl'
              >
                <div className='w-full h-full overflow-hidden'>
                  <EditorLeftPanel />
                </div>
              </m.div>
            )}
          </AnimatePresence>
          <div className='flex-1 flex flex-col min-w-0 relative z-0' />
        </div>
      </m.div>
    </div>
  )
}

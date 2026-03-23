/**
 * EditorLeftPanel Component - Adapted for Animation Catalog
 * Left panel hosting the sidebar navigation with code mode switch.
 */

import type React from 'react'
import { AppSidebar } from '@/components/ui/AppSidebar'
import { CodeModeSwitch } from '@/components/ui/CodeModeSwitch'
import { useCodeMode } from '@/contexts/CodeModeContext'
import { useAnimations } from '@/hooks/useAnimations'
import { useAppNavigation } from '@/hooks/useAppNavigation'

export const EditorLeftPanel: React.FC = () => {
  const { categories } = useAnimations()
  const { codeMode } = useCodeMode()
  const { currentGroupId, handleGroupSelect, handleModeSelect } = useAppNavigation(categories)

  return (
    <AppSidebar
      categories={categories}
      codeMode={codeMode}
      currentGroupId={currentGroupId}
      onGroupSelect={handleGroupSelect}
      className='pf-sidebar--panel'
      topContent={<CodeModeSwitch onModeSelect={handleModeSelect} />}
    />
  )
}

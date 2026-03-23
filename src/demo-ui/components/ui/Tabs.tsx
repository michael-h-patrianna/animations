/**
 * Tabs Component
 * Reusable tab component with keep-alive and mount-on-demand for tab content.
 */

import type React from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useTabsScroll } from './useTabsScroll'
import { TabScrollButton } from './TabScrollButton'
import { TabButton } from './TabButton'

/** Single tab definition. */
export interface Tab {
  id: string
  label: React.ReactNode
  content: React.ReactNode
}

/** Props for the Tabs component. */
export interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (id: string) => void
  className?: string
  tabListClassName?: string
  contentClassName?: string
  variant?: 'default' | 'minimal' | 'pills'
  fullWidth?: boolean
  'data-testid'?: string
}

/** Tabs component with scrollable header, keep-alive panels, and animated indicator. */
export const Tabs: React.FC<TabsProps> = ({
  tabs, value, onChange, className = '', tabListClassName = '', contentClassName = '',
  variant = 'default', fullWidth = false, 'data-testid': testId,
}) => {
  const instanceId = useId()
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(() => new Set([value]))
  const { scrollContainerRef, canScrollLeft, canScrollRight, scroll } = useTabsScroll()

  useEffect(() => { setMountedTabs((prev) => prev.has(value) ? prev : new Set(prev).add(value)) }, [value])

  const handleTabChange = useCallback((id: string) => { if (id !== value) onChange(id) }, [value, onChange])

  const handleKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
    let newIndex = index
    switch (event.key) {
      case 'ArrowLeft': newIndex = index === 0 ? tabs.length - 1 : index - 1; break
      case 'ArrowRight': newIndex = index === tabs.length - 1 ? 0 : index + 1; break
      case 'Home': newIndex = 0; break
      case 'End': newIndex = tabs.length - 1; break
      default: return
    }
    event.preventDefault()
    const target = tabs[newIndex]
    if (target) { handleTabChange(target.id); tabsRef.current[newIndex]?.focus() }
  }, [tabs, handleTabChange])

  const listStyles = variant === 'pills' ? 'bg-[var(--bg-hover)] rounded-lg p-1 gap-1' : 'border-b border-border-subtle pb-[1px]'

  return (
    <div className={`flex flex-col ${className}`} data-testid={testId}>
      <div className={`shrink-0 z-10 ${tabListClassName}`}>
        <div className='relative'>
          {canScrollLeft && <TabScrollButton direction='left' onClick={() => scroll('left')} />}
          <div ref={scrollContainerRef} className={`overflow-x-auto scrollbar-none ${fullWidth ? 'w-full' : ''}`}>
            <div className={`flex items-center ${listStyles} ${fullWidth ? 'w-full min-w-max' : 'min-w-full w-max'}`} role='tablist'>
              {tabs.map((tab, i) => (
                <TabButton key={tab.id} tab={tab} isActive={tab.id === value} instanceId={instanceId} variant={variant} fullWidth={fullWidth} testId={testId} onSelect={handleTabChange} onKeyDown={handleKeyDown} index={i} buttonRef={(el) => { tabsRef.current[i] = el }} />
              ))}
            </div>
          </div>
          {canScrollRight && <TabScrollButton direction='right' onClick={() => scroll('right')} />}
        </div>
      </div>
      <div className={`flex-1 min-h-0 relative overflow-y-auto scrollbar-none ${contentClassName}`}>
        {tabs.map((tab) => mountedTabs.has(tab.id) ? (
          <div key={tab.id} className={`w-full h-full ${tab.id === value ? 'block animate-fade-in' : 'hidden'}`} role='tabpanel' aria-labelledby={`tab-${tab.id}`} data-testid={testId ? `${testId}-panel-${tab.id}` : undefined}>{tab.content}</div>
        ) : null)}
      </div>
    </div>
  )
}

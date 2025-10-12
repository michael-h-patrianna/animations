import { useEffect, useRef, useState } from 'react'
import './ModalOrchestrationTabMorph.css'


export function ModalOrchestrationTabMorph() {
  const tabs = 4
  const [activeTab, setActiveTab] = useState(0)
  const [prevTab, setPrevTab] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])
  const panelRef = useRef<HTMLDivElement>(null)

  // Stagger tab animations on mount
  useEffect(() => {
    const tabElements = tabRefs.current.filter(Boolean)
    tabElements.forEach((tab, index) => {
      if (tab) {
        tab.style.animationDelay = `${index * 0.26}s`
        tab.classList.add('pf-tabs__tab--animated')
      }
    })
  }, [])

  // Handle panel transitions
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const isForward = activeTab > prevTab

    // Exit animation
    panel.classList.remove('pf-tabs__panel--enter', 'pf-tabs__panel--exit-left', 'pf-tabs__panel--exit-right')
    panel.classList.add(isForward ? 'pf-tabs__panel--exit-left' : 'pf-tabs__panel--exit-right')

    const exitTimeout = setTimeout(() => {
      panel.classList.remove('pf-tabs__panel--exit-left', 'pf-tabs__panel--exit-right')
      panel.classList.add('pf-tabs__panel--enter')
    }, 200)

    setPrevTab(activeTab)

    return () => clearTimeout(exitTimeout)
  }, [activeTab])

  return (
    <div
      ref={containerRef}
      className="pf-tabs"
      data-animation-id="modal-orchestration__tab-morph"
    >
      <div className="pf-tabs__nav">
        {Array.from({ length: tabs }, (_, index) => (
          <div
            key={index}
            ref={(el) => { tabRefs.current[index] = el }}
            className={`pf-tabs__tab${index === activeTab ? ' pf-tabs__tab--active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            Tab {index + 1}
          </div>
        ))}
      </div>

      <div className="pf-tabs__content">
        <div ref={panelRef} className="pf-tabs__panel pf-tabs__panel--enter">
          <h5>Content {activeTab + 1}</h5>
          <p>
            Tab morph content for tab {activeTab + 1}. Click tabs to see the swipe animation
            between different content panels.
          </p>
        </div>
      </div>
    </div>
  )
}


import type { ReactNode } from 'react'

import { DemoButton, DemoModal } from '@/components/demo-blocks'

/**
 * Default placeholder content rendered when an animation component receives no children.
 * Provides enough visual substance to see the animation working in the catalog.
 * Consumers replace this with their own modal content.
 */
export function MockModalContent() {
  return (
    <DemoModal
      title="New Creator Quest"
      badge="Modal"
      footer={
        <>
          <DemoButton label="Accept" variant="primary" />
          <DemoButton label="Later" variant="secondary" />
        </>
      }
    >
      <p>Complete 3 live sessions to unlock rewards.</p>
    </DemoModal>
  )
}

/**
 * Wraps children in the default modal placeholder chrome.
 * Used by animation components to provide a visible default when children is omitted.
 */
export function ModalPlaceholder({ children }: { children?: ReactNode }) {
  if (children !== undefined) return <>{children}</>
  return <MockModalContent />
}

import { createElement, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { ToastContent } from './Toast'

/** Provides a `showToast(msg)` function and the portal element to render. */
export function useToast() {
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => setToast(msg), [])
  const clearToast = useCallback(() => setToast(null), [])

  const toastPortal = toast
    ? createPortal(
        createElement(ToastContent, { message: toast, onDone: clearToast }),
        document.body
      )
    : null

  return { showToast, toastPortal }
}

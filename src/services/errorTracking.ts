import type { ErrorInfo } from 'react'

type RuntimeErrorReporter = (error: Error, errorInfo: ErrorInfo) => void

type WindowWithRuntimeReporter = Window & {
  __PF_ANIM_RUNTIME_ERROR_REPORTER__?: RuntimeErrorReporter
}

const getRuntimeErrorReporter = (): RuntimeErrorReporter | null => {
  if (typeof window === 'undefined') return null

  const reporter = (window as WindowWithRuntimeReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__
  return typeof reporter === 'function' ? reporter : null
}

export const reportRuntimeError = (error: Error, errorInfo: ErrorInfo): void => {
  if (!import.meta.env.PROD) return

  const reporter = getRuntimeErrorReporter()
  if (!reporter) return

  try {
    reporter(error, errorInfo)
  } catch (reportError) {
    console.error('Runtime error reporter failed:', reportError)
  }
}

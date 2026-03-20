/**
 * Centralised logger for the animation library.
 *
 * In development, delegates to the browser console.
 * In production, all output is suppressed by default — the host application
 * can attach a custom sink via `logger.setSink()` to forward messages to
 * its own telemetry pipeline.
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

type LogSink = (level: LogLevel, message: string, ...args: unknown[]) => void

const consoleSink: LogSink = (level, message, ...args) => {
  // eslint-disable-next-line no-console -- logger implementation IS the sanctioned console wrapper
  console[level](message, ...args)
}

const noopSink: LogSink = () => {}

let activeSink: LogSink = import.meta.env.PROD ? noopSink : consoleSink

/** Replace the active log sink (e.g. to forward to a telemetry service). */
function setSink(sink: LogSink) {
  activeSink = sink
}

/** Reset to the default sink (console in dev, noop in prod). */
function resetSink() {
  activeSink = import.meta.env.PROD ? noopSink : consoleSink
}

function error(message: string, ...args: unknown[]) {
  activeSink('error', message, ...args)
}

function warn(message: string, ...args: unknown[]) {
  activeSink('warn', message, ...args)
}

function info(message: string, ...args: unknown[]) {
  activeSink('info', message, ...args)
}

function debug(message: string, ...args: unknown[]) {
  activeSink('debug', message, ...args)
}

export const logger = { error, warn, info, debug, setSink, resetSink } as const

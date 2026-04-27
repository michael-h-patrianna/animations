/**
 * Detects stale chunk errors after a new deployment and triggers a single
 * page reload so the browser fetches the updated index.html with correct
 * asset hashes.
 *
 * Copy-paste files: this file
 * Runtime deps: none
 */

const RELOAD_KEY = 'pf-chunk-reload'

/** Returns true if the error looks like a stale-chunk dynamic import failure. */
function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof TypeError)) return false
  const msg = error.message
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('Importing a module script failed')
  )
}

/**
 * Best-effort sessionStorage access. Sandboxed iframes (no `allow-same-origin`),
 * older Safari private mode, and certain embedded WebViews can throw on any
 * `sessionStorage` access — even reading the flag. Treating those failures as
 * "no flag" keeps the original control flow alive instead of replacing the
 * underlying chunk error with a SecurityError or QuotaExceededError.
 */
function readReloadFlag(): boolean {
  try {
    return sessionStorage.getItem(RELOAD_KEY) !== null
  } catch {
    return false
  }
}

function writeReloadFlag(): void {
  try {
    sessionStorage.setItem(RELOAD_KEY, '1')
  } catch {
    // Storage unavailable — the reload still happens; the flag just won't
    // suppress an infinite loop. Better than crashing on the way out.
  }
}

/**
 * Wraps a dynamic import promise with stale-chunk detection.
 * On chunk load failure, reloads the page once. If already reloaded,
 * rethrows so the app's error handling takes over.
 */
export async function importWithReload<T>(importFn: () => Promise<T>): Promise<T> {
  try {
    return await importFn()
  } catch (error) {
    if (isChunkLoadError(error) && !readReloadFlag()) {
      writeReloadFlag()
      window.location.reload()
      // Never resolves — reload is in progress
      return new Promise(() => {})
    }
    throw error
  }
}

/** Clears the reload flag on successful page load. Call once at app startup. */
export function clearStaleChunkFlag(): void {
  try {
    sessionStorage.removeItem(RELOAD_KEY)
  } catch {
    // Storage unavailable — nothing to clear, and we must not throw from app
    // bootstrap (main.tsx calls this synchronously at module init).
  }
}

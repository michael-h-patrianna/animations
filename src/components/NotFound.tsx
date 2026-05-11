import { useNavigate } from 'react-router-dom'
import '@/components/NotFound.css'

/**
 * Catch-all page for unmatched routes (e.g. `/foo/bar/baz`).
 * Renders a self-contained 404 page with a link back to the catalog root.
 */
function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="pf-not-found" data-testid="not-found-page">
      <div className="pf-not-found__card">
        <h1 className="pf-not-found__heading">Page not found</h1>
        <p className="pf-not-found__message">
          The URL you requested doesn't match any animation group.
        </p>
        <button
          type="button"
          className="pf-not-found__back"
          data-testid="not-found-back"
          onClick={() => navigate('/', { replace: true })}
        >
          Back to catalog
        </button>
      </div>
    </div>
  )
}

export { NotFoundPage as NotFound }

import { useNavigate } from 'react-router-dom'

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
      <style>{notFoundStyles}</style>
    </div>
  )
}

const notFoundStyles = `
  .pf-not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: var(--pf-anim-surface-light);
  }
  .pf-not-found__card {
    max-width: 480px;
    padding: 2rem;
    text-align: center;
    background-color: var(--pf-white);
    border-radius: 8px;
    box-shadow: var(--pf-shadow-soft);
  }
  .pf-not-found__heading {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
    color: var(--pf-text-primary);
  }
  .pf-not-found__message {
    margin-bottom: 1.5rem;
    color: var(--pf-anim-muted);
  }
  .pf-not-found__back {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: var(--pf-white);
    background-color: var(--pf-anim-link);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .pf-not-found__back:hover {
    background-color: var(--pf-anim-link-hover);
  }
`

export { NotFoundPage as NotFound }

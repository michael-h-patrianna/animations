import { useAnimations } from '@/hooks/useAnimations';
import './App.css';

function App() {
  const { categories, isLoading, error } = useAnimations();

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-text-primary font-display text-2xl mb-4">Error Loading Animations</h1>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="pf-main">
        <aside className="pf-sidebar">
          <div className="pf-sidebar__intro">
            <h2 className="text-text-primary font-display text-lg">Categories</h2>
          </div>

          <div className="pf-sidebar__nav">
            {isLoading ? (
              <div className="text-text-secondary">Loading categories...</div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className="pf-sidebar__link"
                >
                  {category.title}
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="pf-catalog">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading animations...</div>
            </div>
          ) : (
            categories.map((category) => (
              <section key={category.id} id={category.id} className="mb-16">
                <h1 className="text-text-primary font-display text-3xl mb-4">
                  {category.title}
                </h1>
                <div className="text-text-secondary">
                  {category.animations.length > 0 ? (
                    <div>
                      <p>{category.animations.length} animations available</p>
                      {/* Animation components will be rendered here */}
                    </div>
                  ) : (
                    <p>Animations will be displayed here</p>
                  )}
                </div>
              </section>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

import { CategorySection } from '@/components/catalog';
import { useAnimations } from '@/hooks/useAnimations';
import './App.css';

const scrollIntoView = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function App() {
  const { categories, isLoading, error } = useAnimations();

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
                <div key={category.id} className="pf-sidebar__section">
                  <button
                    onClick={() => scrollIntoView(`category-${category.id}`)}
                    className="pf-sidebar__link pf-sidebar__link--category"
                  >
                    {category.title}
                  </button>
                  <div className="pf-sidebar__subnav">
                    {category.groups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => scrollIntoView(`group-${group.id}`)}
                        className="pf-sidebar__link pf-sidebar__link--group"
                      >
                        {group.title}
                      </button>
                    ))}
                  </div>
                </div>
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
              <CategorySection
                key={category.id}
                category={category}
                elementId={`category-${category.id}`}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

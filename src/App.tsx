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
    <div className="flex min-h-screen gap-8 p-8">
      {/* Sticky Sidebar */}
      <aside className="w-64 sidebar">
        <h2 className="text-text-primary font-display text-lg">Categories</h2>
        {isLoading ? (
          <div className="text-text-secondary py-4">Loading categories...</div>
        ) : (
          <nav>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => scrollToCategory(category.id)}
                    className="w-full text-left text-text-secondary hover:text-text-primary transition-base py-2 px-3 rounded-sm hover:bg-base-10/20"
                  >
                    {category.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1">
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
  );
}

export default App;

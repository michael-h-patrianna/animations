import { CategorySection } from '@/components/catalog';
import { Sidebar } from '@/components/Sidebar';
import { useAnimations } from '@/hooks/useAnimations';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const { categories, isLoading, error } = useAnimations();
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('');
  const [previousCategoryId, setPreviousCategoryId] = useState<string>('');
  const [direction, setDirection] = useState<number>(0);
  const scrollToGroupRef = useRef<string | null>(null);

  // Initialize the first category as current
  useEffect(() => {
    if (categories.length > 0 && !currentCategoryId) {
      setCurrentCategoryId(categories[0].id);
    }
  }, [categories, currentCategoryId]);

  // Handle scrolling to group after category animation completes
  useEffect(() => {
    if (scrollToGroupRef.current) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`group-${scrollToGroupRef.current}`);
        if (element && element.scrollIntoView) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        scrollToGroupRef.current = null;
      }, 500); // Wait for animation to complete
      return () => clearTimeout(timer);
    }
  }, [currentCategoryId]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === currentCategoryId) return;
    
    const currentIndex = categories.findIndex(c => c.id === currentCategoryId);
    const newIndex = categories.findIndex(c => c.id === categoryId);
    
    setPreviousCategoryId(currentCategoryId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentCategoryId(categoryId);
  };

  const handleGroupSelect = (categoryId: string, groupId: string) => {
    scrollToGroupRef.current = groupId;
    
    if (categoryId !== currentCategoryId) {
      handleCategorySelect(categoryId);
    } else {
      // Already in the right category, just scroll
      const element = document.getElementById(`group-${groupId}`);
      if (element && element.scrollIntoView) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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

  const currentCategory = categories.find(c => c.id === currentCategoryId);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="pf-main">
        <Sidebar
          categories={categories}
          currentCategoryId={currentCategoryId}
          onCategorySelect={handleCategorySelect}
          onGroupSelect={handleGroupSelect}
        />

        <main className="pf-catalog" style={{ position: 'relative', overflow: 'hidden' }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading animations...</div>
            </div>
          ) : (
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {currentCategory && (
                <motion.div
                  key={currentCategoryId}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    const currentIndex = categories.findIndex(c => c.id === currentCategoryId);

                    if (swipe < -swipeConfidenceThreshold) {
                      // Swipe left - go to next category
                      if (currentIndex < categories.length - 1) {
                        handleCategorySelect(categories[currentIndex + 1].id);
                      }
                    } else if (swipe > swipeConfidenceThreshold) {
                      // Swipe right - go to previous category
                      if (currentIndex > 0) {
                        handleCategorySelect(categories[currentIndex - 1].id);
                      }
                    }
                  }}
                  style={{ width: '100%' }}
                >
                  <CategorySection
                    category={currentCategory}
                    elementId={`category-${currentCategory.id}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

import { GroupSection } from '@/components/catalog';
import { Sidebar } from '@/components/Sidebar';
import { useAnimations } from '@/hooks/useAnimations';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import type { Group } from '@/types/animation';
import './App.css';

function App() {
  const { categories, isLoading, error } = useAnimations();
  const [currentGroupId, setCurrentGroupId] = useState<string>('');
  const [previousGroupId, setPreviousGroupId] = useState<string>('');
  const [direction, setDirection] = useState<number>(0);
  const dragControls = useDragControls();

  // Get all groups in order for navigation
  const allGroups: Group[] = categories.flatMap(category => category.groups);

  // Initialize the first group as current
  useEffect(() => {
    if (allGroups.length > 0 && !currentGroupId) {
      setCurrentGroupId(allGroups[0].id);
    }
  }, [allGroups, currentGroupId]);

  const handleCategorySelect = (categoryId: string) => {
    // Navigate to the first group in the selected category
    const category = categories.find(c => c.id === categoryId);
    if (category && category.groups.length > 0) {
      handleGroupSelect(category.groups[0].id);
    }
  };

  const handleGroupSelect = (groupId: string) => {
    if (groupId === currentGroupId) return;
    
    const currentIndex = allGroups.findIndex(g => g.id === currentGroupId);
    const newIndex = allGroups.findIndex(g => g.id === groupId);
    
    setPreviousGroupId(currentGroupId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentGroupId(groupId);
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

  const currentGroup = allGroups.find(g => g.id === currentGroupId);

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

  const handleDragStart = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    
    // Don't start drag if the pointer is on an AnimationCard
    const isOnAnimationCard = target.closest('.pf-card');
    
    if (!isOnAnimationCard) {
      dragControls.start(event);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="pf-main">
        <Sidebar
          categories={categories}
          currentGroupId={currentGroupId}
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
              {currentGroup && (
                <motion.div
                  key={currentGroupId}
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
                  dragControls={dragControls}
                  dragListener={false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onPointerDown={handleDragStart}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    const currentIndex = allGroups.findIndex(g => g.id === currentGroupId);

                    if (swipe < -swipeConfidenceThreshold) {
                      // Swipe left - go to next group
                      if (currentIndex < allGroups.length - 1) {
                        handleGroupSelect(allGroups[currentIndex + 1].id);
                      }
                    } else if (swipe > swipeConfidenceThreshold) {
                      // Swipe right - go to previous group
                      if (currentIndex > 0) {
                        handleGroupSelect(allGroups[currentIndex - 1].id);
                      }
                    }
                  }}
                  style={{ width: '100%' }}
                >
                  <GroupSection
                    group={currentGroup}
                    elementId={`group-${currentGroup.id}`}
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

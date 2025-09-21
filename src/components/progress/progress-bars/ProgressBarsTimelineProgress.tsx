import { motion } from 'framer-motion';
import './progress-bars.css';

export function ProgressBarsTimelineProgress() {
  const steps = 4;

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.26,
        delayChildren: 0
      }
    }
  };

  const stepVariants = {
    initial: {
      scale: 0.9,
      opacity: 0.3
    },
    animate: {
      scale: [0.9, 1.06, 1],
      opacity: [0.3, 1, 1],
      transition: {
        duration: 0.46,
        ease: [0.34, 1.56, 0.64, 1] // pop easing
      }
    }
  };

  const connectorVariants = {
    initial: {
      scaleX: 0,
      opacity: 0.3
    },
    animate: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.26, // 520ms * 0.5 (timeline pattern)
        ease: [0.25, 0.46, 0.45, 0.94] // standard easing
      }
    }
  };

  return (
    <motion.div
      className="pf-timeline-progress"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="progress-bars__timeline-progress"
    >
      <div className="pf-timeline-progress__track">
        {Array.from({ length: steps }, (_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', flex: index === steps - 1 ? 'none' : '1' }}>
            <motion.div
              className="pf-timeline-progress__step"
              variants={stepVariants}
              style={{
                background: 'rgba(200, 53, 88, 0.2)',
                borderColor: 'rgba(200, 53, 88, 0.4)',
                color: '#ffffff'
              }}
            >
              {index + 1}
            </motion.div>
            {index < steps - 1 && (
              <motion.div
                className="pf-timeline-progress__connector"
                variants={connectorVariants}
                style={{
                  background: 'linear-gradient(90deg, rgba(200, 53, 88, 0.4), rgba(236, 195, 255, 0.2))',
                  transformOrigin: 'left'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

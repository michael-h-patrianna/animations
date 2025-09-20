import { motion } from 'framer-motion';
import './modal-orchestration.css';

export function ModalOrchestrationTimelineProgress() {
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

  const contentVariants = {
    initial: { 
      y: 16, 
      opacity: 0 
    },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.26, // 520ms * 0.5 (timeline pattern)
        ease: [0.25, 0.46, 0.45, 0.94] // standard easing
      }
    }
  };

  return (
    <motion.div 
      className="pf-timeline"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__timeline-progress"
    >
      <div className="pf-timeline__progress">
        {Array.from({ length: steps }, (_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', flex: index === steps - 1 ? 'none' : '1' }}>
            <motion.div 
              className="pf-timeline__step"
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
                className="pf-timeline__connector"
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
      
      <motion.div 
        className="pf-timeline__content"
        variants={contentVariants}
      >
        <h5>Timeline Progress</h5>
        <p>Timeline progress visualization showing sequential steps with connected flow. Each step represents a milestone in the overall process.</p>
        <div style={{ 
          marginTop: '16px', 
          display: 'flex', 
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {Array.from({ length: steps }, (_, index) => (
            <div 
              key={index}
              style={{ 
                padding: '4px 8px', 
                background: 'rgba(236, 195, 255, 0.1)', 
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              Step {index + 1}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

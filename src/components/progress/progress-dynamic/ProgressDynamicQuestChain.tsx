import React from 'react';
import { motion } from 'framer-motion';
import './progress-dynamic.css';

export function ProgressDynamicQuestChain() {
  const nodes = [1, 2, 3, 4, 5];

  return (
    <div data-animation-id="progress-dynamic__quest-chain">
      <div className="quest-chain" style={{ padding: '20px' }}>
        {nodes.map((nodeNumber, index) => (
          <React.Fragment key={nodeNumber}>
            {/* Quest Node */}
            <motion.div
              className="quest-node"
              initial={{
                background: 'rgba(71, 255, 244, 0.2)',
                scale: 1,
                boxShadow: 'none'
              }}
              animate={{
                background: [
                  'rgba(71, 255, 244, 0.2)',
                  'rgba(71, 255, 244, 0.8)',
                  '#47fff4'
                ],
                scale: [1, 1.2, 1],
                boxShadow: [
                  'none',
                  '0 0 20px rgba(71, 255, 244, 0.8)',
                  '0 0 10px rgba(71, 255, 244, 0.6)'
                ]
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.2,
                ease: "easeOut",
                times: [0, 0.5, 1],
                fill: "forwards"
              }}
              style={{
                border: '2px solid #47fff4',
                color: '#47fff4'
              }}
            >
              {nodeNumber}
            </motion.div>

            {/* Connector between nodes (except after last node) */}
            {index < nodes.length - 1 && (
              <motion.div
                className="quest-connector"
                initial={{
                  background: 'rgba(71, 255, 244, 0.3)',
                  scaleX: 0
                }}
                animate={{
                  background: '#47fff4',
                  scaleX: 1
                }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.2 + 0.15,
                  ease: "easeOut",
                  fill: "forwards"
                }}
                style={{
                  transformOrigin: 'left'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

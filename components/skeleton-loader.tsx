'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="card-base p-4 h-32 bg-surface dark:bg-dark-surface"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

export function CardSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="card-base rounded-2xl overflow-hidden"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="h-48 bg-surface dark:bg-dark-surface" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-surface dark:bg-dark-surface rounded" />
            <div className="h-4 w-3/4 bg-surface dark:bg-dark-surface rounded" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

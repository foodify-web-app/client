'use client';

import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRestaurant } from '@/context/restaurant-context';

export function RestaurantStatusBanner() {
  const { restaurantStatus } = useRestaurant();

  if (restaurantStatus === 'approved') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-warning/10 border-l-4 border-warning p-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="text-warning" size={20} />
        <div>
          <p className="font-semibold text-warning">Your restaurant is under review.</p>
          <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
            Only settings can be updated. All other features will be available once your restaurant is approved.
          </p>
        </div>
      </div>
    </motion.div>
  );
}


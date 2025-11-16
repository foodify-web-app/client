'use client';

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export function StatCard({ title, value, icon: Icon, trend, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary dark:bg-primary/5',
    success: 'bg-success/10 text-success dark:bg-success/5',
    warning: 'bg-warning/10 text-warning dark:bg-warning/5',
    error: 'bg-error/10 text-error dark:bg-error/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="dark:bg-zinc-800 card-base p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground dark:text-dark-foreground">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend.positive ? 'text-success' : 'text-error'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% vs last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}

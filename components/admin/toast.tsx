'use client';

import { Check, AlertCircle, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

export function Toast({ type = 'info', message, onClose }: ToastProps) {
  const icons = {
    success: Check,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-success/10 border-success text-success',
    error: 'bg-error/10 border-error text-error',
    info: 'bg-info/10 border-info text-info',
    warning: 'bg-warning/10 border-warning text-warning',
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colors[type]}`}
    >
      <Icon size={20} />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

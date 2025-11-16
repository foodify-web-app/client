'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'left' | 'right';
}

export function Drawer({ isOpen, onClose, title, children, footer, side = 'right' }: DrawerProps) {
  const variants = {
    hidden: { x: side === 'right' ? 400 : -400 },
    visible: { x: 0 },
    exit: { x: side === 'right' ? 400 : -400 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring', damping: 20 }}
            className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-screen w-96 bg-surface dark:bg-dark-surface shadow-xl z-50 flex flex-col`}
          >
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-white/10">
              <h2 className="text-xl font-semibold text-foreground dark:text-dark-foreground">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
            {footer && (
              <div className="p-6 border-t border-border dark:border-white/10 flex gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

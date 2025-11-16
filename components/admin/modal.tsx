'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface dark:bg-dark-surface rounded-lg shadow-xl z-50"
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
            <div className="p-6 max-h-96 overflow-y-auto">
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

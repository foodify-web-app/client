'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

let toasts: Toast[] = [];
const listeners: ((toasts: Toast[]) => void)[] = [];

export function useToast() {
  const [toastList, setToastList] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    setToastList(toasts);
    const listener = (newToasts: Toast[]) => {
      setToastList(newToasts);
    };
    listeners.push(listener);
    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  }, []);

  return {
    toast: (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { ...toast, id };
      toasts = [...toasts, newToast];
      listeners.forEach(listener => listener(toasts));
      if (toast.duration !== 0) {
        setTimeout(() => {
          toasts = toasts.filter(t => t.id !== id);
          listeners.forEach(listener => listener(toasts));
        }, toast.duration || 3000);
      }
    },
  };
}

export function Toaster() {
  const [toastList, setToastList] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    setToastList(toasts);
    const listener = (newToasts: Toast[]) => {
      setToastList(newToasts);
    };
    listeners.push(listener);
    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toastList.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`rounded-lg px-4 py-3 text-white font-semibold ${
              toast.type === 'error' ? 'bg-error' : toast.type === 'info' ? 'bg-info' : 'bg-success'
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

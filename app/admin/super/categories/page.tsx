'use client';

import { useState } from 'react';
import { Category } from '@/types/admin';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const mockCategories: Category[] = [
  { id: '1', name: 'Biryani', icon: '🍚' },
  { id: '2', name: 'Pizzas', icon: '🍕' },
  { id: '3', name: 'Burgers', icon: '🍔' },
  { id: '4', name: 'Desserts', icon: '🍰' },
  { id: '5', name: 'Beverages', icon: '🥤' },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState(mockCategories);

  return (
    <div className="space-y-6 pl-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Categories</h1>
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Manage global food categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={20} />
          Add Category
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4 }}
            className="dark:bg-zinc-800 card-base p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{cat.icon}</span>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-secondary dark:text-white dark:hover:bg-dark-surface-secondary rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground">{cat.name}</h3>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

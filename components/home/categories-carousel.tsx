'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { id: 1, name: 'Pizza', emoji: '🍕' },
  { id: 2, name: 'Biryani', emoji: '🍛' },
  { id: 3, name: 'Burgers', emoji: '🍔' },
  { id: 4, name: 'Desserts', emoji: '🍰' },
  { id: 5, name: 'Sushi', emoji: '🍣' },
  { id: 6, name: 'Pasta', emoji: '🍝' },
];

export function CategoriesCarousel() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="py-16 bg-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-8">
          Browse by <span className="text-primary">Category</span>
        </h2>

        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelected(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 p-6 rounded-2xl transition-all ${
                  selected === index
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-surface dark:bg-dark-surface text-foreground dark:text-dark-foreground hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-2">{category.emoji}</div>
                <p className="font-semibold">{category.name}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { MenuItem } from '@/types';
import { useCart } from '@/context/cart-context';

const mockFoods: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella and basil',
    price: 12.99,
    image: '/margherita-pizza.png',
    rating: 4.8,
    restaurantId: '1',
    category: 'Pizza',
    isVegetarian: true,
  },
  {
    id: '2',
    name: 'Biryani Special',
    description: 'Aromatic rice with spices',
    price: 14.99,
    image: '/biryani-special.jpg',
    rating: 4.9,
    restaurantId: '2',
    category: 'Rice Dishes',
    isVegetarian: false,
  },
  {
    id: '3',
    name: 'Classic Burger',
    description: 'Beef patty with all the toppings',
    price: 11.99,
    image: '/classic-burger.jpg',
    rating: 4.7,
    restaurantId: '3',
    category: 'Burgers',
    isVegetarian: false,
  },
  {
    id: '4',
    name: 'Chocolate Cake',
    description: 'Rich and moist chocolate',
    price: 8.99,
    image: '/decadent-chocolate-cake.png',
    rating: 4.9,
    restaurantId: '4',
    category: 'Desserts',
    isVegetarian: true,
  },
];

export function PopularFoods() {
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleAddToCart = (food: MenuItem) => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      quantity: 1,
      image: food.image,
      restaurantId: food.restaurantId,
    });
    setAddedItems(prev => new Set(prev).add(food.id));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(food.id);
        return newSet;
      });
    }, 2000);
  };

  return (
    <div className="py-16 bg-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-12">
          Popular <span className="text-primary">Foods</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockFoods.map((food, index) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="dark:bg-zinc-800 card-base overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={food.image || "/placeholder.svg"}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {food.isVegetarian && (
                  <div className="absolute top-3 left-3 bg-success text-white px-2 py-1 rounded-full text-xs font-bold">
                    Veg
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground mb-1">
                  {food.name}
                </h3>
                <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-3">
                  {food.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-semibold text-sm dark:text-dark-foreground-secondary">{food.rating}</span>
                  </div>
                  <span className="text-primary font-bold">₹{food.price}</span>
                </div>

                <motion.button
                  onClick={() => handleAddToCart(food)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-2 rounded-lg font-semibold transition-all ${
                    addedItems.has(food.id)
                      ? 'bg-success text-white'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {addedItems.has(food.id) ? '✓ Added' : 'Add to Cart'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

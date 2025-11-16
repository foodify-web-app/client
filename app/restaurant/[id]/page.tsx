'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Leaf, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/components/ui/toaster';
import { MenuItem } from '@/types';
import { CartSidebar } from '@/components/cart-sidebar';

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, basil, tomato sauce',
    price: 12.99,
    image: '/margherita-pizza.png',
    rating: 4.8,
    restaurantId: '1',
    category: 'Pizza',
    isVegetarian: true,
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Pepperoni, cheese, tomato sauce',
    price: 14.99,
    image: '/pepperoni-pizza.jpg',
    rating: 4.7,
    restaurantId: '1',
    category: 'Pizza',
    isVegetarian: false,
  },
  {
    id: '3',
    name: 'Veggie Supreme',
    description: 'Bell peppers, onions, mushrooms, olives',
    price: 13.99,
    image: '/veggie-pizza.jpg',
    rating: 4.6,
    restaurantId: '1',
    category: 'Pizza',
    isVegetarian: true,
  },
  {
    id: '4',
    name: 'Garlic Bread',
    description: 'Crispy bread with garlic butter',
    price: 5.99,
    image: '/garlic-bread.png',
    rating: 4.9,
    restaurantId: '1',
    category: 'Appetizers',
    isVegetarian: true,
  },
];

const categories = Array.from(new Set(mockMenuItems.map(item => item.category)));

export default function RestaurantDetailsPage({ params }: { params: { id: string } }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const filteredItems = mockMenuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      restaurantId: item.restaurantId,
    });
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
    toast({ message: `${item.name} added to cart!`, type: 'success' });
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      {/* Header Image */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img
          src="/restaurant-banner.jpg"
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Back Button */}
        <Link
          href="/restaurants"
          className="absolute top-6 left-6 bg-white text-foreground rounded-full p-2 hover:bg-surface transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">Urban Bites</h1>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="font-semibold">4.8</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-5 h-5" />
              <span>20-30 min</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf className="w-5 h-5" />
              <span>₹2 Delivery</span>
            </div>
          </div>
          <p className="text-white/90">Italian • Asian • Vegetarian</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            {/* Category Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-surface dark:bg-dark-surface text-foreground dark:text-dark-foreground hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="dark:bg-zinc-800 card-base p-4 flex gap-4"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground">
                          {item.name}
                        </h3>
                        {item.isVegetarian && (
                          <span className="inline-block bg-success/20 text-success text-xs font-bold px-2 py-1 rounded mt-1">
                            Vegetarian
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm font-semibold dark:text-white">{item.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-3">
                      {item.description}
                    </p>

                    <div className="dark:text-white flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">₹{item.price}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setQuantities(prev => ({
                              ...prev,
                              [item.id]: Math.max(0, (prev[item.id] || 0) - 1),
                            }))
                          }
                          className="p-1 hover:bg-surface dark:hover:bg-dark-surface rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-semibold">
                          {quantities[item.id] || 0}
                        </span>
                        <button
                          onClick={() =>
                            setQuantities(prev => ({
                              ...prev,
                              [item.id]: (prev[item.id] || 0) + 1,
                            }))
                          }
                          className="p-1 hover:bg-surface dark:hover:bg-dark-surface rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {(quantities[item.id] || 0) > 0 && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => handleAddToCart(item)}
                        className="w-full mt-3 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                      >
                        Add {quantities[item.id]} to Cart
                      </motion.button>
                    )}
                  </div>
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <CartSidebar />
        </div>
      </div>
    </div>
  );
}

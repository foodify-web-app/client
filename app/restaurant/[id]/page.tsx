'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Leaf, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/components/ui/toaster';
import { MenuItem } from '@/types';
import { CartSidebar } from '@/components/cart-sidebar';
import { getDishes, addToCart } from '@/api/api';

export default function RestaurantDetailsPage({ params }: { params: { id: string } }) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      setIsLoading(true);
      const res = await getDishes();
      if (res.data.success && res.data.data) {
        setMenuItems(res.data.data);
        // Set first category as default
        const categories = Array.from(new Set(res.data.data.map((item: any) => item.category)));
        if (categories.length > 0) {
          setSelectedCategory(categories[0] as string);
        }
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
      toast({ message: 'Error loading menu', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = Array.from(new Set(menuItems.map((item: any) => item.category)));
  const filteredItems = menuItems.filter((item: any) => item.category === selectedCategory);

  // const filteredItems = mockMenuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = async (item: any) => {
    const quantity = quantities[item._id] || 1;
    const userId = localStorage.getItem('userId');

    if (userId) {
      try {
        // Add to cart via API
        for (let i = 0; i < quantity; i++) {
          await addToCart({ userId, itemId: item._id });
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast({ message: 'Error adding to cart', type: 'error' });
        return;
      }
    }

    // Add to local cart state
    addItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      restaurantId: item._id
    });
    setQuantities(prev => ({ ...prev, [item._id]: 0 }));
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
                  className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-surface dark:bg-dark-surface text-foreground dark:text-dark-foreground hover:shadow-md'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Loading menu...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground-secondary dark:text-dark-foreground-secondary">No items in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item._id}
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
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="text-sm font-semibold dark:text-white">4.5</span>
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
                                [item._id]: Math.max(0, (prev[item._id] || 0) - 1),
                              }))
                            }
                            className="p-1 hover:bg-surface dark:hover:bg-dark-surface rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-semibold">
                            {quantities[item._id] || 0}
                          </span>
                          <button
                            onClick={() =>
                              setQuantities(prev => ({
                                ...prev,
                                [item._id]: (prev[item._id] || 0) + 1,
                              }))
                            }
                            className="p-1 hover:bg-surface dark:hover:bg-dark-surface rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {(quantities[item._id] || 0) > 0 && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => handleAddToCart(item)}
                          className="w-full mt-3 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                        >
                          Add {quantities[item._id]} to Cart
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
            )}
          </div>

          {/* Cart Sidebar */}
          <CartSidebar />
        </div>
      </div>
    </div>
  );
}

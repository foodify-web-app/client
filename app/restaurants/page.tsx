'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Leaf } from 'lucide-react';
import Link from 'next/link';
import { Restaurant } from '@/types';
import { getAllRestaurants } from '@/api/api';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [sortBy, setSortBy] = useState('rating');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const res = await getAllRestaurants();
      if (res.data.success && res.data.data) {
        // Map backend data to frontend format
        const mappedRestaurants = res.data.data.map((r: any) => ({
          id: r._id,
          name: r.name,
          image: r.image || '/placeholder.svg',
          rating: r.rating || 4.5,
          deliveryTime: r.deliveryTime || '20-30 min',
          deliveryFee: r.deliveryFee || 2,
          cuisineTypes: r.cuisineTypes || [],
          isOpen: r.isOpen !== false,
          offers: r.offers,
        }));
        setRestaurants(mappedRestaurants);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      // Fallback to empty array or mock data if API fails
    } finally {
      setIsLoading(false);
    }
  };

  const cuisines = Array.from(
    new Set(restaurants.flatMap(r => r.cuisineTypes))
  );

  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisineTypes.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCuisine = !selectedCuisine || r.cuisineTypes.includes(selectedCuisine);
      return matchesSearch && matchesCuisine;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery-time') {
        const aTime = parseInt(a.deliveryTime) || 30;
        const bTime = parseInt(b.deliveryTime) || 30;
        return aTime - bTime;
      }
      if (sortBy === 'price') return a.deliveryFee - b.deliveryFee;
      return 0;
    });
  }, [restaurants, searchQuery, selectedCuisine, sortBy]);

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground dark:text-dark-foreground mb-4">
            Restaurants
          </h1>
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
            Browse and order from your favorite restaurants
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 flex items-center gap-3 bg-surface dark:bg-dark-surface rounded-xl px-6 py-3 shadow-md border border-border dark:border-white/10">
            <Search className="w-5 h-5 text-foreground-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="flex-1 bg-transparent outline-none text-foreground dark:text-dark-foreground placeholder-foreground-secondary"
            />
          </div>
          <button className="px-4 py-3 bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Sort */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="dark:bg-zinc-800 card-base p-6 sticky top-24">
              <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground mb-4">
                Cuisines
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCuisine('')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    !selectedCuisine
                      ? 'bg-primary text-white'
                      : 'hover:bg-surface dark:hover:bg-dark-surface text-foreground dark:text-dark-foreground'
                  }`}
                >
                  All
                </button>
                {cuisines.map(cuisine => (
                  <button
                    key={cuisine}
                    onClick={() => setSelectedCuisine(cuisine)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCuisine === cuisine
                        ? 'bg-primary text-white'
                        : 'hover:bg-surface dark:hover:bg-dark-surface text-foreground dark:text-dark-foreground'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border dark:border-white/10">
                <h3 className=" font-bold text-lg text-foreground dark:text-dark-foreground mb-4">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full input-base"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="delivery-time">Fastest Delivery</option>
                  <option value="price">Lowest Delivery Fee</option>
                </select>
              </div>
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="card-base p-12 text-center">
                <p className="text-foreground-secondary dark:text-dark-foreground-secondary text-lg">
                  Loading restaurants...
                </p>
              </div>
            ) : filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="dark:bg-zinc-800 card-base overflow-hidden cursor-pointer group"
                  >
                    <Link href={`/restaurant/${restaurant.id}`}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={restaurant.image || "/placeholder.svg"}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {restaurant.offers && (
                          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                            {restaurant.offers}
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground mb-2">
                          {restaurant.name}
                        </h3>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="font-semibold text-foreground dark:text-dark-foreground">
                              {restaurant.rating}
                            </span>
                          </div>
                          <span className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                            •
                          </span>
                          <span className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                            {restaurant.cuisineTypes.join(', ')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-foreground-secondary dark:text-dark-foreground-secondary">
                            <Clock className="w-4 h-4" />
                            <span>{restaurant.deliveryTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-foreground-secondary dark:text-dark-foreground-secondary">
                            <Leaf className="w-4 h-4" />
                            <span>₹{restaurant.deliveryFee}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card-base p-12 text-center">
                <p className="text-foreground-secondary dark:text-dark-foreground-secondary text-lg">
                  No restaurants found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

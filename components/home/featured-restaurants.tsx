'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Leaf } from 'lucide-react';
import Link from 'next/link';
import { Restaurant } from '@/types';

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Urban Bites',
    image: '/restaurant-urban-bites.jpg',
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: 2,
    cuisineTypes: ['Italian', 'Asian'],
    isOpen: true,
    offers: '20% OFF',
  },
  {
    id: '2',
    name: 'Spice Garden',
    image: '/restaurant-spice-garden.jpg',
    rating: 4.6,
    deliveryTime: '25-35 min',
    deliveryFee: 2.5,
    cuisineTypes: ['Indian', 'North Indian'],
    isOpen: true,
  },
  {
    id: '3',
    name: 'Burger Paradise',
    image: '/restaurant-burger-paradise.jpg',
    rating: 4.7,
    deliveryTime: '15-25 min',
    deliveryFee: 1.5,
    cuisineTypes: ['Burgers', 'American'],
    isOpen: true,
    offers: '₹100 OFF',
  },
  {
    id: '4',
    name: 'Sweet Dreams',
    image: '/restaurant-sweet-dreams.jpg',
    rating: 4.9,
    deliveryTime: '10-20 min',
    deliveryFee: 1,
    cuisineTypes: ['Desserts', 'Bakery'],
    isOpen: true,
  },
];

export function FeaturedRestaurants() {
  return (
    <div className="py-16 bg-surface dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-12">
          Featured <span className="text-primary">Restaurants</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockRestaurants.map((restaurant, index) => (
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
      </div>
    </div>
  );
}

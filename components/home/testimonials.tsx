'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Enthusiast',
    content: 'FoodHub has completely changed how I order food. Fast delivery and amazing variety!',
    rating: 5,
    image: '/user-profile-sarah.jpg',
  },
  {
    id: 2,
    name: 'Ahmed Khan',
    role: 'Regular Customer',
    content: 'The best food delivery experience I have had. Highly recommended!',
    rating: 5,
    image: '/user-profile-ahmed.jpg',
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Food Blogger',
    content: 'Exceptional service and quality. FoodHub is my go-to app for ordering.',
    rating: 5,
    image: '/user-profile-emma.jpg',
  },
];

export function Testimonials() {
  return (
    <div className="py-16 bg-surface dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-12 text-center">
          What Our <span className="text-primary">Customers</span> Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="dark:bg-zinc-800 card-base p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>

              <p className="text-foreground-secondary dark:text-dark-foreground-secondary mb-6">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground dark:text-dark-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

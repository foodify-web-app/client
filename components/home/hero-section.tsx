'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background to-surface dark:from-dark-background dark:to-dark-surface">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground dark:text-dark-foreground mb-6 leading-tight">
              Order Your Favorite <span className="text-primary">Food</span> Today
            </h1>
            <p className="text-xl text-foreground-secondary dark:text-dark-foreground-secondary mb-8">
              Discover the best restaurants and food delivery service near you. Fast, fresh, and delicious.
            </p>

            {/* Search Bar */}
            <div className="flex gap-3 mb-8">
              <div className="flex-1 flex items-center gap-3 bg-surface dark:bg-dark-surface rounded-full px-6 py-3 shadow-lg">
                <Search className="w-5 h-5 text-foreground-secondary" />
                <input
                  type="text"
                  placeholder="Search restaurants or food..."
                  className="flex-1 bg-transparent outline-none text-foreground dark:text-dark-foreground placeholder-foreground-secondary"
                />
              </div>
              <Link href="/restaurants">
                <button className="btn-primary flex items-center gap-2">
                  Search <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Link href="/restaurants" className="btn-primary">
                Order Now
              </Link>
              <button className="btn-secondary">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src="/delicious-food-delivery-service.jpg"
              alt="Food delivery"
              className="w-full rounded-3xl shadow-2xl"
            />
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-xl"
            >
              <p className="text-sm font-semibold text-foreground">⭐ 4.8 Rating</p>
              <p className="text-xs text-foreground-secondary">1000+ Orders</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

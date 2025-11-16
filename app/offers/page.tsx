'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Clock, Percent } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: '20% OFF on First Order',
    code: 'WELCOME20',
    description: 'Use code WELCOME20 on your first order',
    discount: '20%',
    expiresIn: '7 days',
    restaurants: 'All Restaurants',
    minOrder: '₹200',
  },
  {
    id: 2,
    title: 'Free Delivery',
    code: 'FREEDEL15',
    description: 'Get free delivery on orders above ₹500',
    discount: 'Free',
    expiresIn: '15 days',
    restaurants: 'Selected Partners',
    minOrder: '₹500',
  },
  {
    id: 3,
    title: '₹100 Off on Desserts',
    code: 'SWEET100',
    description: 'Flat ₹100 off on desserts only',
    discount: '₹100',
    expiresIn: '10 days',
    restaurants: 'Sweet Dreams',
    minOrder: '₹300',
  },
  {
    id: 4,
    title: 'Double Loyalty Points',
    code: 'LOYALTY2X',
    description: 'Earn 2x points on all your orders',
    discount: '2x Points',
    expiresIn: 'Ongoing',
    restaurants: 'All Restaurants',
    minOrder: 'No Minimum',
  },
  {
    id: 5,
    title: '₹50 Off on Orders',
    code: 'SAVE50',
    description: 'Get ₹50 off on orders above ₹250',
    discount: '₹50',
    expiresIn: '5 days',
    restaurants: 'Urban Bites, Spice Garden',
    minOrder: '₹250',
  },
  {
    id: 6,
    title: 'Family Combo Deal',
    code: 'FAMILY25',
    description: '25% off on combo orders for 4+ people',
    discount: '25%',
    expiresIn: '20 days',
    restaurants: 'All Restaurants',
    minOrder: '₹800',
  },
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = React.useState<string>('');

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background dark:bg-dark-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground dark:text-dark-foreground mb-4">
            Exclusive <span className="text-primary">Offers</span>
          </h1>
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary text-lg">
            Discover amazing deals and save on your favorite food
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-base overflow-hidden"
            >
              {/* Header with Discount Badge */}
              <div className="relative p-6 bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                      {offer.description}
                    </p>
                  </div>
                  <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <div className="text-center">
                      <Percent className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-xs font-bold">{offer.discount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                {/* Code */}
                <div className="flex items-center gap-3 p-3 bg-surface dark:bg-dark-surface rounded-lg">
                  <Tag className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1">
                      Code
                    </p>
                    <p className="font-bold text-foreground dark:text-dark-foreground">
                      {offer.code}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => handleCopyCode(offer.code)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded font-semibold text-sm transition-colors ${
                      copiedCode === offer.code
                        ? 'bg-success text-white'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {copiedCode === offer.code ? '✓ Copied' : 'Copy'}
                  </motion.button>
                </div>

                {/* Offer Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary dark:text-dark-foreground-secondary">
                      Expires In:
                    </span>
                    <span className="font-semibold text-foreground dark:text-dark-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4 text-warning" />
                      {offer.expiresIn}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary dark:text-dark-foreground-secondary">
                      Valid At:
                    </span>
                    <span className="font-semibold text-foreground dark:text-dark-foreground text-right">
                      {offer.restaurants}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary dark:text-dark-foreground-secondary">
                      Minimum Order:
                    </span>
                    <span className="font-semibold text-foreground dark:text-dark-foreground">
                      {offer.minOrder}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary text-sm"
                >
                  Apply Offer
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

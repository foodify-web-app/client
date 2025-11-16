'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';

export function CartSidebar() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const deliveryFee = items.length > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="card-base p-6 sticky top-24 h-fit hidden lg:block"
    >
      <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground mb-4">
        Your Cart
      </h2>

      {items.length > 0 ? (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-3 bg-surface dark:bg-dark-surface p-3 rounded-lg"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground dark:text-dark-foreground">
                      {item.name}
                    </h3>
                    <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                      ₹{item.price} x {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-error hover:bg-error/10 p-2 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="h-px bg-border dark:bg-white/10 my-4"></div>

          {/* Summary */}
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between text-foreground-secondary dark:text-dark-foreground-secondary">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground-secondary dark:text-dark-foreground-secondary">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-foreground dark:text-dark-foreground pt-2 border-t border-border dark:border-white/10">
              <span>Total</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Link href="/checkout" className="block">
            <button className="w-full btn-primary flex items-center justify-center gap-2">
              Checkout <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary mb-4">
            Your cart is empty
          </p>
          <Link href="/restaurants" className="btn-primary inline-block">
            Start Ordering
          </Link>
        </div>
      )}
    </motion.div>
  );
}

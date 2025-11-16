'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';

export function MobileCartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const deliveryFee = items.length > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  return (
    <>
      {/* Floating Cart Button - Mobile Only */}
      {items.length > 0 && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 btn-primary flex items-center gap-2 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-bold">{items.length}</span>
        </motion.button>
      )}

      {/* Drawer Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background dark:bg-dark-background z-50 lg:hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-white/10">
              <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">
                Your Cart
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface dark:hover:bg-dark-surface rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {items.length > 0 ? (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-3 bg-surface dark:bg-dark-surface p-4 rounded-lg"
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
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-xs bg-primary/20 text-primary rounded"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 text-xs">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-xs bg-primary/20 text-primary rounded"
                            >
                              +
                            </button>
                          </div>
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

                {/* Summary */}
                <div className="border-t border-border dark:border-white/10 p-4 space-y-4">
                  <div className="space-y-2 text-sm">
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

                  <Link href="/checkout" className="block">
                    <button className="w-full btn-primary" onClick={() => setIsOpen(false)}>
                      Checkout
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
                    Your cart is empty
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

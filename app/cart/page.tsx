'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';
import { addToCart, removeFromCart, removeItemFromCart } from '@/api/api';
import { CartItem } from '@/types';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const router = useRouter();
  const deliveryFee = items.length > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;
  const userId = localStorage.getItem('userId')

  const removeOneItemFromCart = async (item: CartItem) => {
    await removeFromCart({ userId, itemId: item._id })
    updateQuantity(item._id, item.quantity - 1)
  }

  const addOneItemToCart = async (item: CartItem) => {
    await addToCart({ userId, itemId: item._id })
    updateQuantity(item._id, item.quantity + 1)
  }

  const removeEntireItemFromCart = async (item: CartItem) => {
    await removeItemFromCart({ userId, itemId: item._id })
    removeItem(item._id)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-background dark:bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-6"
          >
            <ShoppingCart className="w-24 h-24 text-foreground-secondary/50 mx-auto" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">
            Your cart is empty
          </h1>
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary mb-8">
            Add some delicious food items to get started
          </p>
          <Link href="/restaurants" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background dark:bg-dark-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-foreground dark:text-dark-foreground">
            Shopping Cart
          </h1>
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary mt-2">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="dark:bg-zinc-800 dark:text-white card-base p-6 flex gap-6"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-xl text-foreground dark:text-dark-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-foreground-secondary dark:text-dark-foreground-secondary mb-4">
                    ₹{item.price.toFixed(2)} each
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => removeOneItemFromCart(item)}
                      className="p-2 hover:bg-surface dark:hover:bg-dark-surface rounded-lg transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-8 text-center font-bold text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addOneItemToCart(item)}
                      className="p-2 hover:bg-surface dark:hover:bg-dark-surface rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-primary mb-4">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeEntireItemFromCart(item)}
                    className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dark:bg-zinc-800 card-base p-6 h-fit sticky top-24"
          >
            <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-foreground-secondary dark:text-dark-foreground-secondary">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground-secondary dark:text-dark-foreground-secondary">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground-secondary dark:text-dark-foreground-secondary">
                <span>Taxes</span>
                <span>₹{((subtotal + deliveryFee) * 0.05).toFixed(2)}</span>
              </div>

              <div className="h-px bg-border dark:bg-white/10"></div>

              <div className="flex justify-between font-bold text-xl text-foreground dark:text-dark-foreground">
                <span>Total</span>
                <span className="text-primary">
                  ₹{(total + (subtotal + deliveryFee) * 0.05).toFixed(2)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary mb-3"
              >
                Proceed to Checkout
              </motion.button>
            </Link>

            <button
              onClick={() => router.push('/restaurants')}
              className="w-full btn-secondary"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, CreditCard, Wallet, DollarSign, CheckCircle, ArrowRight, Loader } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const deliveryFee = items.length > 0 ? 2 : 0;
  const tax = (subtotal + deliveryFee) * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryAddress) {
      toast({ message: 'Please enter delivery address', type: 'error' });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      clearCart();
      toast({ message: 'Order placed successfully!', type: 'success' });
      router.push('/orders');
      setIsProcessing(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-background dark:bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary mb-4">
            No items in cart
          </p>
          <button
            onClick={() => router.push('/restaurants')}
            className="btn-primary"
          >
            Go to Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background dark:bg-dark-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground dark:text-dark-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="dark:bg-zinc-800 card-base p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">
                    Delivery Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                      Address
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your full delivery address"
                      className="input-base resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                        City
                      </label>
                      <input type="text" placeholder="City" className="input-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                        Postal Code
                      </label>
                      <input type="text" placeholder="12345" className="input-base" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="Ring doorbell twice, gate is on the left..."
                      className="input-base resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="dark:bg-zinc-800 card-base p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI', icon: Wallet },
                    { id: 'cod', label: 'Cash on Delivery', icon: DollarSign },
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border dark:border-white/10 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5"
                      />
                      <method.icon className="w-5 h-5" />
                      <span className="font-semibold text-foreground dark:text-dark-foreground">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-border dark:border-white/10 space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="input-base"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="input-base"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="input-base"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Place Order Button */}
              <motion.button
                type="submit"
                disabled={isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dark:bg-zinc-800 text-white card-base p-6 h-fit sticky top-24"
          >
            <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-foreground-secondary dark:text-dark-foreground-secondary">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-border dark:bg-white/10 my-6"></div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-foreground-secondary dark:text-dark-foreground-secondary">
                  Subtotal
                </span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary dark:text-dark-foreground-secondary">
                  Delivery Fee
                </span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary dark:text-dark-foreground-secondary">
                  Tax (5%)
                </span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="h-px bg-border dark:bg-white/10"></div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-success/10 rounded-lg border border-success/20 flex gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-sm text-success font-semibold">
                You're saving ₹50 with current offers!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

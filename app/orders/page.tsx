'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, MapPin, Phone, MoreVertical, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { getUserOrders } from '@/api/api';

const statuses = {
  'placed': { label: 'Order Placed', color: 'bg-info', icon: Clock },
  'preparing': { label: 'Preparing', color: 'bg-warning', icon: Clock },
  'In Process': { label: 'In Process', color: 'bg-warning', icon: Clock },
  'out-for-delivery': { label: 'Out for Delivery', color: 'bg-primary', icon: MapPin },
  'delivered': { label: 'Delivered', color: 'bg-success', icon: CheckCircle },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (isAuthenticated) {
        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            setIsLoading(true);
            const res = await getUserOrders(userId);
            if (res.data.success && res.data.data) {
              setOrders(res.data.data.orders);
            }
          } catch (error) {
            console.error('Error loading orders:', error);
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-background dark:bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary mb-4">
            Please login to view your orders
          </p>
          <Link href="/login" className="btn-primary inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-background dark:bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background dark:bg-dark-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground dark:text-dark-foreground mb-2">
          My Orders
        </h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary mb-8">
          Track and manage all your orders
        </p>

        {orders.length === 0 ? (
          <div className="card-base p-12 text-center">
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary text-lg">
              No orders found. Start ordering to see your orders here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusInfo = statuses[order.status as keyof typeof statuses] || statuses['placed'];
              const isExpanded = selectedOrder === order._id;
              const items = Array.isArray(order.items) ? order.items : [];
              const itemNames = items.map((item: any) => item.name || item).join(' • ');

              return (
                <motion.div
                  key={order._id
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="dark:bg-zinc-800 card-base overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedOrder(isExpanded ? null : order._id)}
                    className="w-full"
                  >
                    <div className="p-6 flex items-center gap-6 hover:bg-surface/50 dark:hover:bg-dark-surface/50 transition-colors">
                      <div className="w-20 h-20 rounded-lg bg-surface dark:bg-dark-surface flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>

                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground mb-1">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
                          {itemNames || 'No items'}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className={`${statusInfo.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
                            <statusInfo.icon className="w-3 h-3" />
                            {statusInfo.label}
                          </div>
                          <span className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                            {new Date(order.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
                          ₹{order.amount?.toFixed(2) || '0.00'}
                        </p>
                        <ChevronRight className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={isExpanded ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-border dark:border-white/10 space-y-4">
                      {/* Timeline */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground dark:text-dark-foreground">
                          Order Timeline
                        </h4>
                        <div className="space-y-2">
                          {['placed', 'In Process', 'out-for-delivery', 'delivered'].map((s, i) => {
                            const statusValues = ['placed', 'In Process', 'out-for-delivery', 'delivered'];
                            const currentStatus = order.status || 'placed';
                            const isCompleted = statusValues.indexOf(currentStatus) >= i;
                            const info = statuses[s as keyof typeof statuses] || statuses['placed'];

                            return (
                              <div key={s} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-success' : 'bg-surface dark:bg-dark-surface'}`}>
                                  {isCompleted && <CheckCircle className="w-5 h-5 text-white" />}
                                </div>
                                <span className={`text-sm font-semibold ${isCompleted ? 'text-success' : 'text-foreground-secondary dark:text-dark-foreground-secondary'}`}>
                                  {info.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="h-px bg-border dark:bg-white/10"></div>

                      {/* Order Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                            Order ID
                          </p>
                          <p className="font-semibold text-foreground dark:text-dark-foreground">
                            {order._id?.slice(-8) || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                            Total Amount
                          </p>
                          <p className="font-semibold text-foreground dark:text-dark-foreground">
                            ₹{order.amount?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                            Payment Status
                          </p>
                          <p className={`font-semibold ${order.payment ? 'text-success' : 'text-warning'}`}>
                            {order.payment ? 'Paid' : 'Pending'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                            Order Date
                          </p>
                          <p className="font-semibold text-foreground dark:text-dark-foreground">
                            {new Date(order.date).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        {order.status !== 'delivered' && !order.cancelled && (
                          <button className="flex-1 btn-secondary">
                            Track Order
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <button className="flex-1 btn-secondary">
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>

                </motion.div>);
            })}
          </div>
        )
        }
      </div>
    </div >
  );
}

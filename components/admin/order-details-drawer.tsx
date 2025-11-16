'use client';

import { Order } from '@/types/admin';
import { Drawer } from './drawer';
import { MapPin, Phone, Mail, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function OrderDetailsDrawer({ isOpen, onClose, order }: OrderDetailsDrawerProps) {
  if (!order) return null;

  const statusSteps = ['pending', 'preparing', 'out-for-delivery', 'delivered'];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Order Details"
      footer={
        <>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border dark:border-white/10 text-foreground dark:text-dark-foreground hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors"
          >
            Close
          </button>
          <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
            Update Status
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Order ID & Status */}
        <div>
          <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1">Order ID</p>
          <p className="text-lg font-semibold text-foreground dark:text-dark-foreground">{order.id}</p>
        </div>

        {/* Timeline */}
        <div>
          <p className="text-sm font-semibold text-foreground dark:text-dark-foreground mb-3">Order Status</p>
          <div className="space-y-2">
            {statusSteps.map((step, idx) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className={`w-3 h-3 rounded-full ${idx <= currentStep ? 'bg-primary' : 'bg-border dark:bg-white/10'}`} />
                <span className={`text-sm ${idx <= currentStep ? 'text-primary font-medium' : 'text-foreground-secondary dark:text-dark-foreground-secondary'}`}>
                  {step.charAt(0).toUpperCase() + step.slice(1).replace('-', ' ')}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-4 bg-surface dark:bg-dark-surface rounded-lg space-y-3">
          <h4 className="font-semibold text-foreground dark:text-dark-foreground">Customer Information</h4>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground-secondary dark:text-dark-foreground-secondary">Name:</span>
            <span className="text-foreground dark:text-dark-foreground">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} className="text-primary" />
            <span className="text-foreground dark:text-dark-foreground">+91 9876543210</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-primary" />
            <span className="text-foreground dark:text-dark-foreground">customer@example.com</span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground dark:text-dark-foreground">Items</h4>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between p-3 bg-surface dark:bg-dark-surface rounded-lg">
              <span className="text-sm text-foreground dark:text-dark-foreground">{item.name} x {item.quantity}</span>
              <span className="font-semibold text-foreground dark:text-dark-foreground">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Amount */}
        <div className="p-4 bg-primary/10 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">Total Amount</span>
            <span className="text-2xl font-bold text-primary">₹{order.amount}</span>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

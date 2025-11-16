'use client';

import { useState } from 'react';
import { Order } from '@/types/admin';
import { DataTable } from '@/components/admin/data-table';
import { motion } from 'framer-motion';

const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerId: 'C1',
    customerName: 'Rajesh Kumar',
    restaurantName: 'Urban Bites',
    items: [{ id: '1', name: 'Biryani', quantity: 2, price: 350 }],
    amount: 700,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2025-01-14',
    updatedAt: '2025-01-14',
  },
  {
    id: 'ORD002',
    customerId: 'C2',
    customerName: 'Priya Sharma',
    restaurantName: 'Spice Garden',
    items: [{ id: '2', name: 'Paneer Tikka', quantity: 1, price: 280 }],
    amount: 280,
    status: 'preparing',
    paymentStatus: 'paid',
    createdAt: '2025-01-15',
    updatedAt: '2025-01-15',
  },
];

const statusColors = {
  pending: 'bg-warning/10 text-warning',
  preparing: 'bg-info/10 text-info',
  'out-for-delivery': 'bg-primary/10 text-primary',
  delivered: 'bg-success/10 text-success',
};

export default function OrdersMonitoring() {
  return (
    <div className="space-y-6 pl-16">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Orders Monitoring</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Track all platform orders and transactions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <DataTable
          columns={[
            { key: 'id', label: 'Order ID' },
            { key: 'customerName', label: 'Customer' },
            { key: 'restaurantName', label: 'Restaurant' },
            { key: 'amount', label: 'Amount', render: (v) => `₹${v}` },
            { key: 'createdAt', label: 'Date' },
            {
              key: 'status',
              label: 'Status',
              render: (v) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[v as keyof typeof statusColors]}`}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </span>
              ),
            },
            {
              key: 'paymentStatus',
              label: 'Payment',
              render: (v) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </span>
              ),
            },
          ]}
          data={mockOrders}
          searchKeys={['id', 'customerName']}
        />
      </motion.div>
    </div>
  );
}

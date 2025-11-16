'use client';

import { useState } from 'react';
import { Restaurant } from '@/types/admin';
import { DataTable } from '@/components/admin/data-table';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Urban Bites',
    owner: 'Raj Patel',
    status: 'approved',
    createdDate: '2024-12-15',
    revenue: 125000,
    orders: 892,
  },
  {
    id: '2',
    name: 'Spice Garden',
    owner: 'Priya Sharma',
    status: 'approved',
    createdDate: '2024-12-20',
    revenue: 98000,
    orders: 654,
  },
  {
    id: '3',
    name: 'New Pizzeria',
    owner: 'Marco Rossi',
    status: 'pending',
    createdDate: '2025-01-10',
    revenue: 0,
    orders: 0,
  },
];

const statusConfig = {
  approved: { icon: CheckCircle, color: 'bg-success/10 text-success', label: 'Approved' },
  pending: { icon: Clock, color: 'bg-warning/10 text-warning', label: 'Pending' },
  rejected: { icon: XCircle, color: 'bg-error/10 text-error', label: 'Rejected' },
};

export default function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState(mockRestaurants);

  return (
    <div className="space-y-6 pl-16">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Restaurant Management</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Approve, manage, and monitor all restaurants</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <DataTable
          columns={[
            { key: 'id', label: 'Restaurant ID' },
            { key: 'name', label: 'Restaurant Name' },
            { key: 'owner', label: 'Owner' },
            { key: 'createdDate', label: 'Joined Date' },
            { key: 'orders', label: 'Total Orders', render: (v) => v.toLocaleString() },
            { key: 'revenue', label: 'Revenue', render: (v) => `₹${(v / 100000).toFixed(1)}L` },
            {
              key: 'status',
              label: 'Status',
              render: (status) => {
                const config = statusConfig[status as keyof typeof statusConfig];
                const Icon = config.icon;
                return (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit ${config.color}`}>
                    <Icon size={14} />
                    {config.label}
                  </div>
                );
              },
            },
            {
              key: 'id',
              label: 'Actions',
              render: () => (
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs bg-success/10 text-success rounded hover:bg-success/20 transition-colors">
                    Approve
                  </button>
                  <button className="px-3 py-1 text-xs bg-error/10 text-error rounded hover:bg-error/20 transition-colors">
                    Reject
                  </button>
                </div>
              ),
            },
          ]}
          data={restaurants}
          searchKeys={['name', 'owner']}
        />
      </motion.div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { User } from '@/types/admin';
import { DataTable } from '@/components/admin/data-table';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

const mockUsers: User[] = [
  {
    id: 'U1',
    name: 'Amit Verma',
    email: 'amit@example.com',
    joinedDate: '2024-12-01',
    orders: 24,
    status: 'active',
    totalSpent: 15240,
  },
  {
    id: 'U2',
    name: 'Sneha Patel',
    email: 'sneha@example.com',
    joinedDate: '2024-12-15',
    orders: 18,
    status: 'active',
    totalSpent: 12500,
  },
  {
    id: 'U3',
    name: 'Ravi Singh',
    email: 'ravi@example.com',
    joinedDate: '2024-11-20',
    orders: 5,
    status: 'blocked',
    totalSpent: 3200,
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);

  return (
    <div className="space-y-6 pl-16">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">User Management</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Monitor and manage platform users</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <DataTable
          columns={[
            { key: 'id', label: 'User ID' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'joinedDate', label: 'Joined' },
            { key: 'orders', label: 'Orders' },
            { key: 'totalSpent', label: 'Total Spent', render: (v) => `₹${v.toLocaleString()}` },
            {
              key: 'status',
              label: 'Status',
              render: (status) => (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                  status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}>
                  {status === 'active' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              ),
            },
            {
              key: 'id',
              label: 'Actions',
              render: () => (
                <button className="px-3 py-1 text-xs bg-warning/10 text-warning rounded hover:bg-warning/20 transition-colors">
                  Block
                </button>
              ),
            },
          ]}
          data={users}
          searchKeys={['name', 'email']}
        />
      </motion.div>
    </div>
  );
}

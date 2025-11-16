'use client';

import { useState } from 'react';
import { Coupon } from '@/types/admin';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { motion } from 'framer-motion';

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME50',
    type: 'percentage',
    value: 50,
    minAmount: 300,
    applicableTo: 'global',
    active: true,
  },
  {
    id: '2',
    code: 'FLAT100',
    type: 'flat',
    value: 100,
    minAmount: 500,
    applicableTo: 'global',
    active: true,
  },
];

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState(mockCoupons);

  return (
    <div className="space-y-6 pl-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Coupons & Offers</h1>
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Create and manage platform promotions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={20} />
          Create Coupon
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <DataTable
          columns={[
            { key: 'code', label: 'Coupon Code' },
            {
              key: 'type',
              label: 'Type',
              render: (v) => (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-info/10 text-info">
                  {v === 'percentage' ? 'Percentage' : 'Flat Amount'}
                </span>
              ),
            },
            {
              key: 'value',
              label: 'Value',
              render: (v, item: Coupon) => `${item.type === 'percentage' ? v + '%' : '₹' + v}`,
            },
            { key: 'minAmount', label: 'Min Amount', render: (v) => `₹${v}` },
            {
              key: 'active',
              label: 'Status',
              render: (v) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {v ? 'Active' : 'Inactive'}
                </span>
              ),
            },
            {
              key: 'id',
              label: 'Actions',
              render: () => (
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary rounded transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-1 hover:bg-error/10 text-error rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ),
            },
          ]}
          data={coupons}
          searchKeys={['code']}
        />
      </motion.div>
    </div>
  );
}

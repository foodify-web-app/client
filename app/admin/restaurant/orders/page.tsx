'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types/admin';
import { DataTable } from '@/components/admin/data-table';
import { motion } from 'framer-motion';
import { getAllOrders, updateOrderStatus } from '@/api/api';
import { useToast } from '@/components/ui/toaster';

const statusColors = {
  pending: 'bg-warning/10 text-warning',
  preparing: 'bg-info/10 text-info',
  'In Process': 'bg-info/10 text-info',
  'out-for-delivery': 'bg-primary/10 text-primary',
  delivered: 'bg-success/10 text-success',
};

export default function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const res = await getAllOrders();
      if (res.data.success && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({ message: 'Error loading orders', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateOrderStatus({ orderId, status: newStatus });
      if (res.data.success) {
        toast({ message: 'Order status updated', type: 'success' });
        loadOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({ message: 'Error updating order status', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 pl-16 ">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Orders</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Manage and track all restaurant orders</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Loading orders...</p>
          </div>
        ) : (
          <DataTable
            columns={[
              { 
                key: '_id', 
                label: 'Order ID',
                render: (v) => v?.slice(-8) || 'N/A'
              },
              { 
                key: 'userId', 
                label: 'Customer ID',
                render: (v) => v?.slice(-6) || 'N/A'
              },
              { 
                key: 'amount', 
                label: 'Amount', 
                render: (v) => `₹${v?.toFixed(2) || '0.00'}` 
              },
              { 
                key: 'date', 
                label: 'Time',
                render: (v) => new Date(v).toLocaleString()
              },
              {
                key: 'status',
                label: 'Status',
                render: (v, item) => (
                  <select
                    value={v || 'In Process'}
                    onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${statusColors[v as keyof typeof statusColors] || statusColors['In Process']}`}
                  >
                    <option value="In Process">In Process</option>
                    <option value="preparing">Preparing</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                ),
              },
              {
                key: 'payment',
                label: 'Payment',
                render: (v) => (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {v ? 'Paid' : 'Pending'}
                  </span>
                ),
              },
            ]}
            data={orders}
            searchKeys={['_id', 'userId']}
          />
        )}
      </motion.div>
    </div>
  );
}

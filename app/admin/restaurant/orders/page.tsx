'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types/admin';
import { DataTable } from '@/components/admin/data-table';
import { motion } from 'framer-motion';
import { getOrdersByRestaurant, updateOrderStatusById } from '@/api/api';
import { useToast } from '@/components/ui/toaster';
import { useRestaurant } from '@/context/restaurant-context';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  pending: 'bg-warning/10 text-warning',
  rejected: 'bg-error/10 text-error',
  accepted: 'bg-info/10 text-info',
  preparing: 'bg-info/10 text-info',
  'out-for-delivery': 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
  'In Process': 'bg-info/10 text-info',
  delivered: 'bg-success/10 text-success',
};

const statusFlow = [
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'out-for-delivery', label: 'Out for Delivery' },
  { value: 'completed', label: 'Completed' },
];

// Helper to get next valid statuses
const getNextStatuses = (currentStatus: string): string[] => {
  const status = currentStatus.toLowerCase();
  if (status === 'pending') {
    return ['accepted', 'rejected'];
  }
  if (status === 'accepted') {
    return ['preparing'];
  }
  if (status === 'preparing') {
    return ['out-for-delivery'];
  }
  if (status === 'out-for-delivery') {
    return ['completed'];
  }
  if (status === 'rejected' || status === 'completed') {
    return []; // Terminal states
  }
  // For 'In Process' or other statuses, allow progression
  if (status === 'in process') {
    return ['preparing', 'out-for-delivery', 'completed'];
  }
  return ['preparing', 'out-for-delivery', 'completed'];
};

export default function OrdersManagement() {
  const { restaurantId, restaurantStatus } = useRestaurant();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantId) {
      loadOrders();
    }
  }, [restaurantId]);

  const loadOrders = async () => {
    if (!restaurantId) {
      toast({ message: 'Restaurant ID not found', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      const res = await getOrdersByRestaurant(restaurantId);
      if (res.data.success && res.data.data) {
        setOrders(res.data.data);
      } else {
        // Fallback: Get all orders and filter by restaurantId from items
        // This is a workaround if the endpoint doesn't exist
        const allRes = await getAllOrders();
        if (allRes.data.success && allRes.data.data) {
          // Filter orders where items contain this restaurant's dishes
          // This requires restaurantId in order items, which may not exist
          // For now, show all orders (backend needs to add restaurantId to orders)
          setOrders(allRes.data.data);
        }
      }
    } catch (error: any) {
      console.error('Error loading orders:', error);
      // Fallback to get all orders
      try {
        const allRes = await getAllOrders();
        if (allRes.data.success && allRes.data.data) {
          setOrders(allRes.data.data);
        }
      } catch (e) {
        toast({ message: 'Error loading orders', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const res = await updateOrderStatusById(orderId, { status: newStatus });
      if (res.data.success) {
        toast({ message: 'Order status updated successfully', type: 'success' });
        loadOrders();
      } else {
        toast({ message: res.data.message || 'Failed to update order status', type: 'error' });
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        message: error.response?.data?.message || 'Error updating order status',
        type: 'error',
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatItems = (items: any[]): string => {
    if (!items || !Array.isArray(items)) return 'N/A';
    return items.map((item) => `${item.name || item.itemName} (x${item.quantity || 1})`).join(', ');
  };

  const getCustomerName = (order: any): string => {
    // Try different possible fields
    return order.customerName || order.userName || order.user?.name || 'Customer';
  };

  return (
    <div className="space-y-6 pl-16">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Orders</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
          Manage and track all restaurant orders
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin text-primary mx-auto mb-2" size={32} />
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">No orders found</p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: '_id',
                label: 'Order ID',
                render: (v) => <span className="font-mono text-sm">{v?.slice(-8) || 'N/A'}</span>,
              },
              {
                key: 'userId',
                label: 'Customer',
                render: (v, item) => (
                  <span className="font-medium">{getCustomerName(item)}</span>
                ),
              },
              {
                key: 'items',
                label: 'Items',
                render: (v) => (
                  <span className="text-sm text-foreground-secondary">
                    {formatItems(Array.isArray(v) ? v : [])}
                  </span>
                ),
              },
              {
                key: 'amount',
                label: 'Total Amount',
                render: (v) => <span className="font-semibold">₹{Number(v || 0).toFixed(2)}</span>,
              },
              {
                key: 'payment',
                label: 'Payment',
                render: (v) => (
                  <Badge
                    variant={v ? 'default' : 'destructive'}
                    className={v ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
                  >
                    {v ? 'Paid' : 'Pending'}
                  </Badge>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (v, item) => {
                  const currentStatus = (v || 'pending').toLowerCase();
                  const nextStatuses = getNextStatuses(currentStatus);
                  const isUpdating = updatingStatus === item._id;
                  const isApproved = restaurantStatus === 'approved';

                  if (!isApproved) {
                    return (
                      <Badge className={statusColors[v as keyof typeof statusColors] || statusColors.pending}>
                        {v || 'Pending'}
                      </Badge>
                    );
                  }

                  return (
                    <Select
                      value={v || 'pending'}
                      onValueChange={(newStatus) => handleStatusUpdate(item._id, newStatus)}
                      disabled={isUpdating || nextStatuses.length === 0}
                    >
                      <SelectTrigger
                        className={`w-40 ${
                          statusColors[v as keyof typeof statusColors] || statusColors.pending
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="animate-spin mr-2" size={14} />
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {statusFlow
                          .filter((status) => {
                            // Show current status and next valid statuses
                            return (
                              status.value === currentStatus ||
                              nextStatuses.includes(status.value)
                            );
                          })
                          .map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  );
                },
              },
              {
                key: 'date',
                label: 'Order Date',
                render: (v) => (
                  <span className="text-sm text-foreground-secondary">
                    {v ? new Date(v).toLocaleString() : 'N/A'}
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

import { getAllOrders } from '@/api/api';

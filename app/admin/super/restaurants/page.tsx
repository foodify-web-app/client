'use client';

import { useState, useEffect } from 'react';
import { Restaurant } from '@/types/admin';
import { DataTable } from '@/components/admin/data-table';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { getAllRestaurantsAdmin, updateRestaurantStatus } from '@/api/api';
import { useToast } from '@/components/ui/toaster';

const statusConfig = {
  approved: { icon: CheckCircle, color: 'bg-success/10 text-success', label: 'Approved' },
  pending: { icon: Clock, color: 'bg-warning/10 text-warning', label: 'Pending' },
  rejected: { icon: XCircle, color: 'bg-error/10 text-error', label: 'Rejected' },
};

export default function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const res = await getAllRestaurantsAdmin();
      if (res.data.success && res.data.data) {
        setRestaurants(res.data.data);
      }
    } catch (error: any) {
      console.error('Error loading restaurants:', error);
      toast({ message: 'Error loading restaurants', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (restaurantId: string, newStatus: string) => {
    try {
      const res = await updateRestaurantStatus(restaurantId, { status: newStatus });
      if (res.data.success) {
        toast({ message: `Restaurant ${newStatus} successfully`, type: 'success' });
        loadRestaurants();
      } else {
        toast({ message: res.data.message || 'Failed to update status', type: 'error' });
      }
    } catch (error: any) {
      console.error('Error updating restaurant status:', error);
      toast({
        message: error.response?.data?.message || 'Error updating restaurant status',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">
          Restaurant Management
        </h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
          Approve, manage, and monitor all restaurants
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
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
              Loading restaurants...
            </p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
              No restaurants found
            </p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: '_id',
                label: 'Restaurant ID',
                render: (v) => <span className="font-mono text-sm">{v?.slice(-8) || 'N/A'}</span>,
              },
              { key: 'name', label: 'Restaurant Name' },
              {
                key: 'ownerId',
                label: 'Owner ID',
                render: (v) => <span className="font-mono text-sm">{v?.slice(-6) || 'N/A'}</span>,
              },
              {
                key: 'createdAt',
                label: 'Joined Date',
                render: (v) =>
                  v ? new Date(v).toLocaleDateString() : 'N/A',
              },
              {
                key: 'status',
                label: 'Status',
                render: (status) => {
                  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
                  const Icon = config.icon;
                  return (
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit ${config.color}`}
                    >
                      <Icon size={14} />
                      {config.label}
                    </div>
                  );
                },
              },
              {
                key: '_id',
                label: 'Actions',
                render: (_, item) => {
                  const currentStatus = item.status || 'pending';
                  return (
                    <div className="flex gap-2">
                      {currentStatus !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(item._id, 'approved')}
                          className="px-3 py-1 text-xs bg-success/10 text-success rounded hover:bg-success/20 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {currentStatus !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(item._id, 'rejected')}
                          className="px-3 py-1 text-xs bg-error/10 text-error rounded hover:bg-error/20 transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      {currentStatus === 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(item._id, 'pending')}
                          className="px-3 py-1 text-xs bg-warning/10 text-warning rounded hover:bg-warning/20 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  );
                },
              },
            ]}
            data={restaurants}
            searchKeys={['name', 'ownerId']}
          />
        )}
      </motion.div>
    </div>
  );
}

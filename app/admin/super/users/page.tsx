'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/admin';
import { DataTable } from '@/components/admin/data-table';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { getAllUsers, deleteUser } from '@/api/api';
import { useToast } from '@/components/ui/toaster';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const res = await getAllUsers();
      if (res.data.success && res.data.data) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({ message: 'Error loading users', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await deleteUser(id);
      if (res.data.success) {
        toast({ message: 'User deleted successfully', type: 'success' });
        loadUsers();
      } else {
        toast({ message: res.data.message || 'Error deleting user', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({ message: 'Error deleting user', type: 'error' });
    }
  };

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
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Loading users...</p>
          </div>
        ) : (
          <DataTable
            columns={[
              { 
                key: '_id', 
                label: 'User ID',
                render: (v) => v?.slice(-8) || 'N/A'
              },
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { 
                key: 'createdAt', 
                label: 'Joined',
                render: (v) => v ? new Date(v).toLocaleDateString() : 'N/A'
              },
              { 
                key: 'role', 
                label: 'Role',
                render: (v) => v?.charAt(0).toUpperCase() + v?.slice(1) || 'Customer'
              },
              {
                key: 'isDeleted',
                label: 'Status',
                render: (isDeleted) => (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                    !isDeleted ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}>
                    {!isDeleted ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {!isDeleted ? 'Active' : 'Deleted'}
                  </div>
                ),
              },
              {
                key: '_id',
                label: 'Actions',
                render: (_, item) => (
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1 text-xs bg-error/10 text-error rounded hover:bg-error/20 transition-colors"
                  >
                    Delete
                  </button>
                ),
              },
            ]}
            data={users}
            searchKeys={['name', 'email', 'role']}
          />
        )}
      </motion.div>
    </div>
  );
}

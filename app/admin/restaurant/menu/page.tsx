'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { Dish } from '@/types/admin';
import { motion } from 'framer-motion';
import { getDishes, deleteDish } from '@/api/api';
import { useToast } from '@/components/ui/toaster';

export default function MenuManagement() {
  const [dishes, setDishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      setIsLoading(true);
      const res = await getDishes();
      if (res.data.success && res.data.data) {
        setDishes(res.data.data);
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
      toast({ message: 'Error loading dishes', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    try {
      const res = await deleteDish(id);
      if (res.data.success) {
        toast({ message: 'Dish deleted successfully', type: 'success' });
        loadDishes();
      } else {
        toast({ message: res.data.message || 'Error deleting dish', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast({ message: 'Error deleting dish', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 pl-16 ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Menu Management</h1>
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Manage your restaurant dishes and categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDrawer(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={20} />
          Add Dish
        </motion.button>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {['Biryani', 'Pizzas', 'Burgers', 'Desserts', 'Beverages', 'Appetizers'].map((cat) => (
            <motion.div
              key={cat}
              whileHover={{ y: -4 }}
              className="p-3 bg-surface dark:bg-dark-surface rounded-lg text-center cursor-pointer hover:border-primary border border-transparent transition-colors"
            >
              <p className="text-sm font-medium text-foreground dark:text-dark-foreground">{cat}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dishes Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">All Dishes</h3>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Loading dishes...</p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Dish Name',
                render: (_, item: any) => (
                  <div className="flex items-center gap-3">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                ),
              },
              { key: 'category', label: 'Category' },
              { key: 'price', label: 'Price', render: (v) => `₹${v}` },
              {
                key: 'description',
                label: 'Description',
                render: (v) => <span className="text-sm text-foreground-secondary">{v?.substring(0, 50)}...</span>,
              },
              {
                key: '_id',
                label: 'Actions',
                render: (_, item) => (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowDrawer(true)}
                      className="p-1 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary rounded transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="p-1 hover:bg-error/10 text-error rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ),
              },
            ]}
            data={dishes}
            searchKeys={['name', 'category', 'description']}
          />
        )}
      </motion.div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { Dish } from '@/types/admin';
import { motion } from 'framer-motion';

const mockDishes: Dish[] = [
  {
    id: '1',
    name: 'Biryani Supreme',
    description: 'Fragrant basmati rice with tender meat',
    category: 'Biryani',
    price: 350,
    image: '/flavorful-biryani.png',
    isVeg: false,
    isFeatured: true,
    availability: true,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Paneer Tikka',
    description: 'Grilled paneer with spices',
    category: 'Appetizers',
    price: 280,
    image: '/paneer.jpg',
    isVeg: true,
    isFeatured: true,
    availability: true,
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Butter Chicken',
    description: 'Creamy chicken in butter sauce',
    category: 'Main Course',
    price: 380,
    image: '/butter-chicken.jpg',
    isVeg: false,
    isFeatured: false,
    availability: true,
    rating: 4.7,
  },
];

export default function MenuManagement() {
  const [dishes, setDishes] = useState(mockDishes);
  const [showDrawer, setShowDrawer] = useState(false);

  const handleDelete = (id: string) => {
    setDishes(dishes.filter((d) => d.id !== id));
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
        <DataTable
          columns={[
            {
              key: 'name',
              label: 'Dish Name',
              render: (_, item: Dish) => (
                <div className="flex items-center gap-3">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="font-medium">{item.name}</span>
                </div>
              ),
            },
            { key: 'category', label: 'Category' },
            { key: 'price', label: 'Price', render: (v) => `₹${v}` },
            {
              key: 'isVeg',
              label: 'Type',
              render: (v) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${v ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {v ? 'Veg' : 'Non-Veg'}
                </span>
              ),
            },
            {
              key: 'availability',
              label: 'Status',
              render: (v) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${v ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {v ? 'Available' : 'Unavailable'}
                </span>
              ),
            },
            {
              key: 'id',
              label: 'Actions',
              render: (_, item) => (
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary rounded transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-error/10 text-error rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ),
            },
          ]}
          data={dishes}
          searchKeys={['name', 'category']}
        />
      </motion.div>
    </div>
  );
}

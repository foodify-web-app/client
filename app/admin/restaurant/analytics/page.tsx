'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const timeData = [
  { time: '10 AM', orders: 12 },
  { time: '12 PM', orders: 28 },
  { time: '2 PM', orders: 18 },
  { time: '6 PM', orders: 42 },
  { time: '8 PM', orders: 35 },
  { time: '10 PM', orders: 22 },
];

const dishPerformance = [
  { name: 'Biryani', sales: 1500 },
  { name: 'Pizzas', sales: 980 },
  { name: 'Burgers', sales: 820 },
  { name: 'Desserts', sales: 650 },
];

const COLORS = ['#FF6B35', '#FF8555', '#E55A2B', '#D64820'];

export default function Analytics() {
  return (
    <div className="space-y-6 pl-16 ">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Analytics</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Detailed performance metrics and insights</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="dark:bg-zinc-800 card-base p-6"
        >
          <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Orders by Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#FF6B35" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dark:bg-zinc-800 card-base p-6"
        >
          <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Dish Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dishPerformance} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="sales">
                {dishPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

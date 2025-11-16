'use client';

import { useState } from 'react';
import { TrendingUp, ShoppingCart, CheckCircle, DollarSign, Flame } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const orderData = [
  { date: 'Mon', orders: 24 },
  { date: 'Tue', orders: 32 },
  { date: 'Wed', orders: 28 },
  { date: 'Thu', orders: 35 },
  { date: 'Fri', orders: 42 },
  { date: 'Sat', orders: 48 },
  { date: 'Sun', orders: 38 },
];

const revenueData = [
  { date: 'Week 1', revenue: 2400 },
  { date: 'Week 2', revenue: 2210 },
  { date: 'Week 3', revenue: 2290 },
  { date: 'Week 4', revenue: 2800 },
];

const categoryData = [
  { name: 'Biryani', value: 35 },
  { name: 'Pizzas', value: 25 },
  { name: 'Burgers', value: 20 },
  { name: 'Desserts', value: 20 },
];

const COLORS = ['#FF6B35', '#FF8555', '#E55A2B', '#D64820'];

export default function RestaurantDashboard() {
  return (
    <div className="space-y-6 pl-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Dashboard</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Welcome back! Here's your restaurant performance.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={247}
          icon={ShoppingCart}
          trend={{ value: 12, positive: true }}
          color="primary"
        />
        <StatCard
          title="Pending Orders"
          value={8}
          icon={TrendingUp}
          trend={{ value: 5, positive: false }}
          color="warning"
        />
        <StatCard
          title="Completed Orders"
          value={239}
          icon={CheckCircle}
          trend={{ value: 18, positive: true }}
          color="success"
        />
        <StatCard
          title="Total Revenue"
          value="₹45,250"
          icon={DollarSign}
          trend={{ value: 22, positive: true }}
          color="primary"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 dark:bg-zinc-800 card-base p-6"
        >
          <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Orders This Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#FF6B35" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dark:bg-zinc-800 card-base p-6"
        >
          <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Category Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2} dot={{ fill: '#FF6B35' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Popular Dishes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Popular Dishes</h3>
        <div className="space-y-3">
          {[
            { name: 'Biryani Supreme', orders: 156, rating: 4.8 },
            { name: 'Butter Chicken', orders: 134, rating: 4.7 },
            { name: 'Garlic Naan', orders: 128, rating: 4.9 },
            { name: 'Paneer Tikka', orders: 112, rating: 4.6 },
          ].map((dish, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-surface dark:bg-dark-surface rounded-lg">
              <div>
                <p className="font-medium text-foreground dark:text-dark-foreground">{dish.name}</p>
                <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">{dish.orders} orders</p>
              </div>
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-primary" />
                <span className="text-sm font-semibold">{dish.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

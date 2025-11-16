'use client';

import { TrendingUp, Store, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const userGrowthData = [
  { month: 'Jan', users: 2400, orders: 1600 },
  { month: 'Feb', users: 2800, orders: 1900 },
  { month: 'Mar', users: 3200, orders: 2200 },
  { month: 'Apr', users: 3800, orders: 2800 },
  { month: 'May', users: 4200, orders: 3200 },
  { month: 'Jun', users: 4800, orders: 3800 },
];

const restaurantPerformanceData = [
  { name: 'Urban Bites', revenue: 125000 },
  { name: 'Spice Garden', revenue: 98000 },
  { name: 'Burger Paradise', revenue: 87000 },
  { name: 'Sweet Dreams', revenue: 76000 },
  { name: 'Sushi Supreme', revenue: 65000 },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6 pl-16 ">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Super Admin Dashboard</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Platform-wide analytics and management</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Restaurants"
          value={156}
          icon={Store}
          trend={{ value: 8, positive: true }}
          color="primary"
        />
        <StatCard
          title="Pending Approvals"
          value={12}
          icon={TrendingUp}
          trend={{ value: 3, positive: false }}
          color="warning"
        />
        <StatCard
          title="Total Users"
          value="24.8K"
          icon={Users}
          trend={{ value: 15, positive: true }}
          color="success"
        />
        <StatCard
          title="Total Orders"
          value="156K"
          icon={ShoppingCart}
          trend={{ value: 28, positive: true }}
          color="primary"
        />
        <StatCard
          title="Total Revenue"
          value="₹2.4Cr"
          icon={DollarSign}
          trend={{ value: 35, positive: true }}
          color="success"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="dark:bg-zinc-800 card-base p-6"
        >
          <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">User Growth & Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#FF6B35" fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Restaurant Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dark:bg-zinc-800 card-base p-6"
        >
          <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Top Restaurants by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={restaurantPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#FF6B35" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { type: 'Restaurant Joined', desc: 'Urban Bites has registered on platform', time: '2 hours ago', icon: Store },
            { type: 'New User', desc: '1,250 new users signed up', time: '4 hours ago', icon: Users },
            { type: 'High Order Volume', desc: 'Peak orders: 5,420 orders/hour', time: '6 hours ago', icon: ShoppingCart },
            { type: 'Payment Processed', desc: '₹25,48,000 processed successfully', time: '1 day ago', icon: DollarSign },
          ].map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="flex gap-4 p-4 bg-surface dark:bg-dark-surface rounded-lg">
                <div className="p-2 bg-primary/10 text-primary rounded-lg h-fit">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground dark:text-dark-foreground">{activity.type}</p>
                  <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{activity.desc}</p>
                </div>
                <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">{activity.time}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

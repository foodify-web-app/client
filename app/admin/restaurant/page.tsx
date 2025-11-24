'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, CheckCircle, DollarSign, Flame, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useRestaurant } from '@/context/restaurant-context';
import { getOrdersByRestaurant, getAllOrders } from '@/api/api';
import { getDishesByRestaurant, getDishes } from '@/api/api';

export default function RestaurantDashboard() {
  const { restaurantId, restaurantStatus } = useRestaurant();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [orderData, setOrderData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [popularDishes, setPopularDishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      loadDashboardData();
    }
  }, [restaurantId]);

  const loadDashboardData = async () => {
    if (!restaurantId) return;

    try {
      setIsLoading(true);

      // Load orders
      let orders: any[] = [];
      try {
        const ordersRes = await getOrdersByRestaurant(restaurantId);
        if (ordersRes.data.success && ordersRes.data.data) {
          orders = ordersRes.data.data;
        }
      } catch (error) {
        // Fallback to all orders
        const allOrdersRes = await getAllOrders();
        if (allOrdersRes.data.success && allOrdersRes.data.data) {
          orders = allOrdersRes.data.data;
        }
      }

      // Load dishes
      let dishes: any[] = [];
      try {
        const dishesRes = await getDishesByRestaurant(restaurantId);
        if (dishesRes.data.success && dishesRes.data.data) {
          dishes = dishesRes.data.data;
        }
      } catch (error) {
        // Fallback to all dishes
        const allDishesRes = await getDishes();
        if (allDishesRes.data.success && allDishesRes.data.data) {
          dishes = allDishesRes.data.data;
        }
      }

      // Calculate statistics
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(
        (o) => (o.status || '').toLowerCase() === 'pending' || (o.status || '').toLowerCase() === 'in process'
      ).length;
      const completedOrders = orders.filter(
        (o) => (o.status || '').toLowerCase() === 'completed' || (o.status || '').toLowerCase() === 'delivered'
      ).length;
      const totalRevenue = orders
        .filter((o) => o.payment)
        .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
      });

      // Process order data for charts
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      });

      const ordersByDay = last7Days.map((day) => {
        const dayOrders = orders.filter((o) => {
          const orderDate = new Date(o.date || o.createdAt);
          const dayName = orderDate.toLocaleDateString('en-US', { weekday: 'short' });
          return dayName === day;
        });
        return { date: day, orders: dayOrders.length };
      });

      setOrderData(ordersByDay);

      // Process category data
      const categoryCounts: Record<string, number> = {};
      dishes.forEach((dish) => {
        const category = dish.category || 'Other';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      const categoryChartData = Object.entries(categoryCounts)
        .map(([name, value]) => ({ name, value }))
        .slice(0, 4);

      setCategoryData(categoryChartData);

      // Process revenue data (last 4 weeks)
      const last4Weeks = Array.from({ length: 4 }, (_, i) => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (3 - i) * 7);
        return `Week ${i + 1}`;
      });

      const revenueByWeek = last4Weeks.map((week, index) => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (3 - index) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const weekRevenue = orders
          .filter((o) => {
            const orderDate = new Date(o.date || o.createdAt);
            return orderDate >= weekStart && orderDate < weekEnd && o.payment;
          })
          .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

        return { date: week, revenue: weekRevenue };
      });

      setRevenueData(revenueByWeek);

      // Process popular dishes (top 4 by order count)
      const dishOrderCounts: Record<string, { name: string; count: number }> = {};
      orders.forEach((order) => {
        const items = Array.isArray(order.items) ? order.items : [];
        items.forEach((item: any) => {
          const dishName = item.name || item.itemName || 'Unknown';
          if (!dishOrderCounts[dishName]) {
            dishOrderCounts[dishName] = { name: dishName, count: 0 };
          }
          dishOrderCounts[dishName].count += item.quantity || 1;
        });
      });

      const popular = Object.values(dishOrderCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)
        .map((dish) => ({
          name: dish.name,
          orders: dish.count,
          rating: 4.5 + Math.random() * 0.5, // Mock rating for now
        }));

      setPopularDishes(popular);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#FF6B35', '#FF8555', '#E55A2B', '#D64820'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Dashboard</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
          Welcome back! Here's your restaurant performance.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={{ value: 0, positive: true }}
          color="primary"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={TrendingUp}
          trend={{ value: 0, positive: false }}
          color="warning"
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders}
          icon={CheckCircle}
          trend={{ value: 0, positive: true }}
          color="success"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
          trend={{ value: 0, positive: true }}
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
          {orderData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#FF6B35" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-foreground-secondary">
              No order data available
            </div>
          )}
        </motion.div>

        {/* Category Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dark:bg-zinc-800 card-base p-6"
        >
          <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Category Distribution</h3>
          {categoryData.length > 0 ? (
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-foreground-secondary">
              No category data available
            </div>
          )}
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
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2} dot={{ fill: '#FF6B35' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-foreground-secondary">
            No revenue data available
          </div>
        )}
      </motion.div>

      {/* Popular Dishes */}
      {popularDishes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="dark:bg-zinc-800 card-base p-6"
        >
          <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Popular Dishes</h3>
          <div className="space-y-3">
            {popularDishes.map((dish, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-surface dark:bg-dark-surface rounded-lg">
                <div>
                  <p className="font-medium text-foreground dark:text-dark-foreground">{dish.name}</p>
                  <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                    {dish.orders} orders
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-primary" />
                  <span className="text-sm font-semibold">{dish.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

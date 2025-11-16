'use client';

import { motion } from 'framer-motion';
import { Bell, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    { type: 'order', icon: Bell, title: 'New Order', desc: 'Order #ORD001 received', time: '5 mins ago', unread: true },
    { type: 'payment', icon: TrendingUp, title: 'Payment Processed', desc: '₹2,450 credited to account', time: '1 hour ago', unread: true },
    { type: 'alert', icon: AlertCircle, title: 'Low Inventory', desc: 'Biryani stock running low', time: '3 hours ago', unread: false },
    { type: 'success', icon: CheckCircle, title: 'Order Completed', desc: 'Order #ORD998 delivered successfully', time: '5 hours ago', unread: false },
  ];

  return (
    <div className="space-y-6 pl-16">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Notifications</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Stay updated with important alerts and updates</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {notifications.map((notif, idx) => {
          const Icon = notif.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 4 }}
              className={`dark:bg-zinc-800 card-base p-4 cursor-pointer transition-all ${notif.unread ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg h-fit">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-foreground dark:text-dark-foreground">{notif.title}</h4>
                    {notif.unread && <span className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{notif.desc}</p>
                  <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-2">{notif.time}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

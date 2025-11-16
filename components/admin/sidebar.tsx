'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, ShoppingCart, Settings, Users, TrendingUp, FileText, Bell, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const isRestaurantAdmin = pathname.includes('/admin/restaurant');
  const isSuperAdmin = pathname.includes('/admin/super');

  const restaurantMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/restaurant' },
    { label: 'Menu Management', icon: UtensilsCrossed, href: '/admin/restaurant/menu' },
    { label: 'Orders', icon: ShoppingCart, href: '/admin/restaurant/orders' },
    { label: 'Analytics', icon: TrendingUp, href: '/admin/restaurant/analytics' },
    { label: 'Profile', icon: Settings, href: '/admin/restaurant/profile' },
    { label: 'Notifications', icon: Bell, href: '/admin/restaurant/notifications' },
  ];

  const superAdminMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/super' },
    { label: 'Restaurants', icon: UtensilsCrossed, href: '/admin/super/restaurants' },
    { label: 'Users', icon: Users, href: '/admin/super/users' },
    { label: 'Orders', icon: ShoppingCart, href: '/admin/super/orders' },
    { label: 'Categories', icon: FileText, href: '/admin/super/categories' },
    { label: 'Coupons', icon: TrendingUp, href: '/admin/super/coupons' },
    { label: 'Settings', icon: Settings, href: '/admin/super/settings' },
  ];

  const menuItems = isSuperAdmin ? superAdminMenuItems : restaurantMenuItems;
  const adminTitle = isSuperAdmin ? 'Super Admin' : 'Restaurant Admin';

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed left-0 top-0 h-screen bg-surface dark:bg-dark-surface border-r border-border dark:border-white/10 flex flex-col z-40 transition-all duration-300',
        open ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="h-16 border-b border-border dark:border-white/10 flex items-center justify-between px-4">

        <motion.div
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn('flex items-center gap-2', !open && 'hidden')}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground dark:text-dark-foreground">FoodHub</span>
            <span className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">{adminTitle}</span>
          </div>
        </motion.div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-surface-secondary dark:text-white dark:hover:bg-dark-surface-secondary rounded-lg transition-colors"
        >
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-foreground-secondary dark:text-dark-foreground-secondary hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary'
                )}
                whileHover={{ x: 4 }}
              >
                <Icon size={20} />
                <motion.span
                  animate={{ opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn('text-sm font-medium', !open && 'hidden')}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border dark:border-white/10">
        <motion.button
          whileHover={{ x: 4 }}
          className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-foreground-secondary dark:text-dark-foreground-secondary hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-all duration-200"
        >
          <LogOut size={20} />
          <motion.span
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className={cn('text-sm font-medium', !open && 'hidden')}
          >
            Logout
          </motion.span>
        </motion.button>
      </div>
    </motion.aside>
  );
}

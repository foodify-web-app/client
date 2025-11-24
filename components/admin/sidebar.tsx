'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, ShoppingCart, Settings, Users, TrendingUp, FileText, Bell, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRestaurant } from '@/context/restaurant-context';
import { useAuth } from '@/context/auth-context';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isRestaurantAdmin = pathname.includes('/admin/restaurant');
  const isSuperAdmin = pathname.includes('/admin/super');
  const { restaurantStatus } = useRestaurant();
  const { logout } = useAuth();

  const isApproved = restaurantStatus === 'approved';
  const isRestaurantRoute = isRestaurantAdmin && !isSuperAdmin;

  const restaurantMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/restaurant', key: 'dashboard' },
    { label: 'Dishes', icon: UtensilsCrossed, href: '/admin/restaurant/menu', key: 'dishes' },
    { label: 'Orders', icon: ShoppingCart, href: '/admin/restaurant/orders', key: 'orders' },
    { label: 'Analytics', icon: TrendingUp, href: '/admin/restaurant/analytics', key: 'analytics' },
    { label: 'Settings', icon: Settings, href: '/admin/restaurant/profile', key: 'settings' },
    { label: 'Notifications', icon: Bell, href: '/admin/restaurant/notifications', key: 'notifications' },
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
          
          // For restaurant admin, check if item should be disabled
          const isDisabled = isRestaurantRoute && !isApproved && item.key !== 'settings';
          const isSettings = item.key === 'settings';

          const handleClick = (e: React.MouseEvent) => {
            if (isDisabled) {
              e.preventDefault();
              return;
            }
          };

          return (
            <div key={item.href}>
              {isDisabled ? (
                <motion.div
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-not-allowed opacity-50',
                    'text-foreground-secondary dark:text-dark-foreground-secondary'
                  )}
                  title="Restaurant not approved. Only Settings available."
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
              ) : (
                <Link href={item.href} onClick={handleClick}>
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
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border dark:border-white/10">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => {
            logout();
            router.push('/login');
          }}
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

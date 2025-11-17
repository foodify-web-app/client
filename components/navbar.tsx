'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { motion } from 'framer-motion';
import { MobileCartDrawer } from './mobile-cart-drawer';
import ThemeToggle from './ThemeToggle';
import { logoutUser } from '@/api/api';
import { useToast } from '@/components/ui/toaster';


export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const cartCount = items.length;

  const logoutHandler = async () => {
    const res = await logoutUser();

    if (!res.data.success) {
      toast({ message: 'Error while logout', type: 'error' })
    }
    logout();
    toast({ message: 'Logout Successful', type: 'success' })
  }

  return (
    <>
      <nav className="sticky top-0 z-40 bg-background dark:bg-dark-background border-b border-border dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-xl hidden sm:block text-foreground dark:text-dark-foreground">
                FoodHub
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-foreground-secondary hover:text-foreground dark:text-dark-foreground-secondary dark:hover:text-dark-foreground transition-colors">
                Home
              </Link>
              <Link href="/restaurants" className="text-foreground-secondary hover:text-foreground dark:text-dark-foreground-secondary dark:hover:text-dark-foreground transition-colors">
                Restaurants
              </Link>
              {isAuthenticated && (
                <Link href="/orders" className="text-foreground-secondary hover:text-foreground dark:text-dark-foreground-secondary dark:hover:text-dark-foreground transition-colors">
                  Orders
                </Link>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* <ThemeToggle /> */}
              {/* Cart Icon - Desktop */}
              <Link href="/cart" className="hidden lg:block relative">
                <button className="p-2 hover:bg-surface dark:hover:bg-dark-surface rounded-full transition-colors">
                  <ShoppingCart className="w-6 h-6 text-foreground dark:text-dark-foreground" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </button>
              </Link>

              {/* User Menu - Desktop */}
              {isAuthenticated ? (
                <button
                  onClick={logoutHandler}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface dark:bg-dark-surface rounded-full hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              ) : (
                <Link href="/login" className="hidden sm:block px-4 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors">
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden pb-4 space-y-4"
            >
              <Link href="/" className="block text-foreground-secondary hover:text-foreground">
                Home
              </Link>
              <Link href="/restaurants" className="block text-foreground-secondary hover:text-foreground">
                Restaurants
              </Link>
              {isAuthenticated && (
                <Link href="/orders" className="block text-foreground-secondary hover:text-foreground">
                  Orders
                </Link>
              )}
              <Link href="/cart" className="block text-foreground-secondary hover:text-foreground">
                Cart {cartCount > 0 && <span className="text-primary font-bold">({cartCount})</span>}
              </Link>
              {!isAuthenticated && (
                <Link href="/login" className="block px-4 py-2 bg-primary text-white rounded-full font-semibold text-center">
                  Login
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={logoutHandler}
                  className="w-full px-4 py-2 bg-surface dark:bg-dark-surface rounded-full font-semibold text-left"
                >
                  Logout
                </button>
              )}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Mobile Cart Drawer */}
      <MobileCartDrawer />
    </>
  );
}

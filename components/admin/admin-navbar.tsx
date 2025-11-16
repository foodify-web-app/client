'use client';

import { Menu, Search, Bell, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="ml-14 h-16 bg-surface dark:bg-dark-surface border-b border-border dark:border-white/10 flex items-center justify-between px-6 lg:px-8">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary rounded-lg transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center gap-3 bg-background dark:bg-dark-background rounded-lg px-4 py-2 border border-border dark:border-white/10">
          <Search size={18} className="text-foreground-secondary dark:text-dark-foreground-secondary" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-48 placeholder-foreground-secondary dark:placeholder-dark-foreground-secondary"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="p-2 hover:bg-surface-secondary dark:text-white dark:hover:bg-dark-surface-secondary rounded-lg transition-colors relative"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="p-2 hover:bg-surface-secondary dark:text-white dark:hover:bg-dark-surface-secondary rounded-lg transition-colors"
        >
          <Settings size={20} />
        </motion.button>

        {/* Profile Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
          </motion.button>

          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-surface dark:bg-dark-surface rounded-lg shadow-lg border border-border dark:border-white/10 z-50 dark:text-white"
            >
              <div className="p-4 border-b border-border dark:border-white/10">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">admin@foodhub.com</p>
              </div>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors">
                Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors border-t border-border dark:border-white/10">
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}

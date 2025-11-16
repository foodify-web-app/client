'use client';

import { Camera, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function RestaurantProfile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6 pl-16">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Restaurant Profile</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Manage your restaurant information</p>
      </motion.div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="dark:bg-zinc-800 card-base h-40 bg-gradient-to-r from-primary to-primary-dark rounded-lg overflow-hidden relative group cursor-pointer"
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
        </div>
      </motion.div>

      {/* Logo & Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dark:bg-zinc-800 card-base p-6 lg:col-span-1"
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center relative group cursor-pointer">
              <span className="text-4xl">🍴</span>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-colors flex items-center justify-center">
                <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground dark:text-dark-foreground">Urban Bites</h3>
            <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">ID: REST001</p>
          </div>
        </motion.div>

        {/* Information Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="dark:bg-zinc-800 card-base p-6 lg:col-span-2 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2">Restaurant Name</label>
            <input
              type="text"
              defaultValue="Urban Bites"
              disabled={!isEditing}
              className="input-base disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2">Owner Name</label>
              <input
                type="text"
                defaultValue="Raj Patel"
                disabled={!isEditing}
                className="input-base disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2">Email</label>
              <input
                type="email"
                defaultValue="raj@urbanbites.com"
                disabled={!isEditing}
                className="input-base disabled:opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2">Phone</label>
            <input
              type="tel"
              defaultValue="+91 9876543210"
              disabled={!isEditing}
              className="input-base disabled:opacity-50"
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Edit Profile
              </motion.button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-border dark:border-white/10 rounded-lg hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Operating Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Operating Hours</h3>
        <div className="space-y-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <div key={day} className="flex items-center justify-between p-3 bg-surface dark:bg-dark-surface rounded-lg">
              <span className="text-sm font-medium text-foreground dark:text-dark-foreground">{day}</span>
              <div className="flex gap-2">
                <input type="time" defaultValue="11:00" className="input-base w-24 text-sm" />
                <span className="text-foreground-secondary dark:text-dark-foreground-secondary">to</span>
                <input type="time" defaultValue="23:00" className="input-base w-24 text-sm" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

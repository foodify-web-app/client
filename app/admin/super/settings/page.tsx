'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Save } from 'lucide-react';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    platformCommission: 15,
    minOrderAmount: 100,
    deliveryCharge: 50,
    maxDeliveryDistance: 10,
  });

  return (
    <div className="space-y-6 pl-16">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">System Settings</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Configure platform-wide settings</p>
      </motion.div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-6">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2">
              Platform Commission (%)
            </label>
            <input
              type="number"
              value={settings.platformCommission}
              onChange={(e) => setSettings({ ...settings, platformCommission: parseFloat(e.target.value) })}
              className="input-base"
            />
            <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-1">Commission charged per order</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2">
              Minimum Order Amount (₹)
            </label>
            <input
              type="number"
              value={settings.minOrderAmount}
              onChange={(e) => setSettings({ ...settings, minOrderAmount: parseFloat(e.target.value) })}
              className="input-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2">
              Base Delivery Charge (₹)
            </label>
            <input
              type="number"
              value={settings.deliveryCharge}
              onChange={(e) => setSettings({ ...settings, deliveryCharge: parseFloat(e.target.value) })}
              className="input-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2">
              Max Delivery Distance (km)
            </label>
            <input
              type="number"
              value={settings.maxDeliveryDistance}
              onChange={(e) => setSettings({ ...settings, maxDeliveryDistance: parseFloat(e.target.value) })}
              className="input-base"
            />
          </div>
        </div>
      </motion.div>

      {/* Email Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Email Templates</h3>
        <div className="space-y-3">
          {['Order Confirmation', 'Delivery Update', 'Promotional Email', 'Account Verification'].map((template) => (
            <motion.button
              key={template}
              whileHover={{ x: 4 }}
              className="w-full flex items-center justify-between p-4 bg-surface dark:bg-dark-surface rounded-lg hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors"
            >
              <span className="text-sm font-medium text-foreground dark:text-dark-foreground">{template}</span>
              <span className="text-xs text-primary">Edit</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <button className="flex-1 px-4 py-2 border border-border dark:border-white/10 rounded-lg hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors">
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          <Save size={18} />
          Save Settings
        </motion.button>
      </motion.div>
    </div>
  );
}

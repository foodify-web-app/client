'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/api/api';
export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast({ message: 'Please fill all fields', type: 'error' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ message: 'Passwords do not match', type: 'error' });
      return;
    }
    const { confirmPassword, ...safeData } = formData;

    setIsLoading(true);
    const res = await registerUser(safeData)
    if (res.data.success) {
      toast({ message: 'Account created successfully!', type: 'success' });
    }
    router.push('/');
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-background to-surface dark:from-dark-background dark:to-dark-surface flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="dark:bg-zinc-800 card-base p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">
              Create Account
            </h1>
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
              Join FoodHub and start ordering
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                Full Name
              </label>
              <div className="flex items-center gap-3 bg-surface dark:bg-dark-surface border border-border dark:border-white/10 rounded-xl px-4 py-3">
                <User className="w-5 h-5 text-foreground-secondary" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="flex-1 bg-transparent outline-none text-foreground dark:text-dark-foreground placeholder-foreground-secondary"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-surface dark:bg-dark-surface border border-border dark:border-white/10 rounded-xl px-4 py-3">
                <Mail className="w-5 h-5 text-foreground-secondary" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent outline-none text-foreground dark:text-dark-foreground placeholder-foreground-secondary"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-3 bg-surface dark:bg-dark-surface border border-border dark:border-white/10 rounded-xl px-4 py-3">
                <Phone className="w-5 h-5 text-foreground-secondary" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="12345 67890"
                  className="flex-1 bg-transparent outline-none text-foreground dark:text-dark-foreground placeholder-foreground-secondary"
                />
              </div>
            </div>

            {/* role */}
            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                Role
              </label>
              <div className="flex items-center gap-3 bg-surface dark:bg-dark-surface border border-border dark:border-white/10 rounded-xl px-4 py-3">
                <UserCheck className="w-5 h-5 text-foreground-secondary" />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-foreground dark:text-dark-foreground placeholder-foreground-secondary"
                >
                  <option value="customer">Customer</option>
                  <option value="restaurant">Restaurant Owner</option>
                </select>

              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                Password
              </label>
              <div className="flex items-center gap-3 bg-surface dark:bg-dark-surface border border-border dark:border-white/10 rounded-xl px-4 py-3">
                <Lock className="w-5 h-5 text-foreground-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-foreground dark:text-dark-foreground placeholder-foreground-secondary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-foreground-secondary hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                Confirm Password
              </label>
              <div className="flex items-center gap-3 bg-surface dark:bg-dark-surface border border-border dark:border-white/10 rounded-xl px-4 py-3">
                <Lock className="w-5 h-5 text-foreground-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-foreground dark:text-dark-foreground placeholder-foreground-secondary"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
              <input type="checkbox" className="mt-1" required />
              I agree to the Terms of Service and Privacy Policy
            </label>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center text-foreground-secondary dark:text-dark-foreground-secondary mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

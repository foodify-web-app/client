'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Apple, Loader } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ message: 'Please fill all fields', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      login({
        id: '1',
        name: 'User',
        email,
        phone: '+1234567890',
        addresses: [],
      });
      toast({ message: 'Login successful!', type: 'success' });
      router.push('/');
      setIsLoading(false);
    }, 1000);
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
              Welcome Back
            </h1>
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
              Sign in to your FoodHub account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-surface dark:bg-dark-surface border border-border dark:border-white/10 rounded-xl px-4 py-3">
                <Mail className="w-5 h-5 text-foreground-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent outline-none text-foreground dark:text-dark-foreground placeholder-foreground-secondary"
                />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-foreground-secondary dark:text-dark-foreground-secondary">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link href="#" className="text-primary hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>

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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          {/* <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border dark:bg-white/10"></div>
            <span className="text-foreground-secondary dark:text-dark-foreground-secondary text-sm">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-border dark:bg-white/10"></div>
          </div> */}

          {/* Social Login */}
          {/* <div className="space-y-3">
            <button className="w-full btn-secondary flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="w-full btn-secondary flex items-center justify-center gap-3">
              <Apple className="w-5 h-5" />
              Apple
            </button>
          </div> */}

          {/* Sign Up Link */}
          <p className="text-center text-foreground-secondary dark:text-dark-foreground-secondary mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

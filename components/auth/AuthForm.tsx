'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  mode?: 'login' | 'signup';
  onSubmit?: (data: { email: string; password: string; name?: string }) => Promise<void>;
  onToggleMode?: () => void;
  className?: string;
}

export function AuthForm({ 
  mode = 'login', 
  onSubmit, 
  onToggleMode,
  className = "" 
}: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSignup = mode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (isSignup && !formData.name) newErrors.name = 'Name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit?.(formData);
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`auth-container flex items-center justify-center flex-col text-center min-h-screen p-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="form_area flex justify-center items-center flex-col bg-yellow-50 dark:bg-yellow-950/20 h-auto w-auto border-2 border-slate-700 dark:border-slate-300 rounded-3xl shadow-[4px_5px_0px_2px_theme(colors.yellow.400)] dark:shadow-[4px_5px_0px_2px_theme(colors.yellow.500)] p-8"
      >
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="title text-slate-700 dark:text-slate-200 font-black text-2xl mt-4 mb-2"
        >
          {isSignup ? 'Join MyBeing' : 'Welcome Back'}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="sub_title font-semibold text-slate-600 dark:text-slate-400 mb-6"
        >
          {isSignup 
            ? 'Start your self-discovery journey' 
            : 'Continue your journey of self-discovery'
          }
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <AnimatePresence mode="wait">
            {/* Name Field (Signup only) */}
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="form_group flex flex-col items-start mx-2 mb-4"
              >
                <div className="relative w-full">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <motion.input
                    whileFocus={{ 
                      y: 1,
                      boxShadow: '2px_3px_0px_0px_theme(colors.yellow.400)'
                    }}
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="form_style outline-none border-2 border-slate-700 dark:border-slate-300 shadow-[4px_5px_0px_2px_theme(colors.yellow.400)] dark:shadow-[4px_5px_0px_2px_theme(colors.yellow.500)] w-80 py-3 pl-12 pr-4 rounded-lg text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1">{errors.name}</span>
                )}
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="form_group flex flex-col items-start mx-2 mb-4"
            >
              <div className="relative w-full">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <motion.input
                  whileFocus={{ 
                    y: 1,
                    boxShadow: '2px_3px_0px_0px_theme(colors.yellow.400)'
                  }}
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="form_style outline-none border-2 border-slate-700 dark:border-slate-300 shadow-[4px_5px_0px_2px_theme(colors.yellow.400)] dark:shadow-[4px_5px_0px_2px_theme(colors.yellow.500)] w-80 py-3 pl-12 pr-4 rounded-lg text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">{errors.email}</span>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="form_group flex flex-col items-start mx-2 mb-6"
            >
              <div className="relative w-full">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <motion.input
                  whileFocus={{ 
                    y: 1,
                    boxShadow: '2px_3px_0px_0px_theme(colors.yellow.400)'
                  }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="form_style outline-none border-2 border-slate-700 dark:border-slate-300 shadow-[4px_5px_0px_2px_theme(colors.yellow.400)] dark:shadow-[4px_5px_0px_2px_theme(colors.yellow.500)] w-80 py-3 pl-12 pr-12 rounded-lg text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">{errors.password}</span>
              )}
            </motion.div>
          </AnimatePresence>

          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
            >
              {errors.general}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ 
              y: 1,
              boxShadow: '2px_2px_0px_0px_theme(colors.yellow.400)'
            }}
            type="submit"
            disabled={isLoading}
            className="btn py-4 my-6 w-80 text-base bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 text-white rounded-2xl font-bold shadow-[4px_4px_0px_0px_theme(colors.yellow.400)] dark:shadow-[4px_4px_0px_0px_theme(colors.yellow.500)] transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignup ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Toggle Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm"
        >
          <span className="text-slate-600 dark:text-slate-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            onClick={onToggleMode}
            className="link font-bold text-slate-700 dark:text-slate-200 px-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </motion.div>

        {/* Additional Links */}
        {!isSignup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4"
          >
            <Link 
              href="/forgot-password"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Forgot your password?
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-slate-500 mt-8 max-w-md text-center"
      >
        By {isSignup ? 'creating an account' : 'signing in'}, you agree to our{' '}
        <Link href="/terms" className="text-purple-600 hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
      </motion.p>
    </div>
  );
}

export default AuthForm;

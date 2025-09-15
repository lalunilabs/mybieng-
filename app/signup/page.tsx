'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Brain, Sparkles, Search, Lightbulb, BookOpen } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/ui/Button';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-100 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-yellow-300/30 to-purple-500/20" />
      
      <div className="pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Inspired Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Begin your journey of
                  <br />
                  <span className="text-purple-600">self-discovery</span>
                </h1>
                <p className="text-xl text-gray-700">
                  Join thousands discovering their patterns and unlocking their potential
                </p>
              </div>

              {/* Meditation Figure with Floating Icons */}
              <div className="relative flex justify-center items-center h-80">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-b from-purple-600 to-purple-800 rounded-full relative overflow-hidden shadow-2xl">
                    {/* Inner glow effect */}
                    <div className="absolute inset-3 bg-gradient-to-b from-yellow-300 to-orange-500 rounded-full opacity-90 blur-sm"></div>
                    
                    {/* Meditation pose silhouette */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl">🧘‍♂️</div>
                    </div>
                  </div>
                  
                  {/* Floating icons */}
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <Search className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -top-2 -right-8 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg"
                  >
                    <Lightbulb className="w-5 h-5 text-white" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, -6, 0], x: [0, 3, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-4 -right-6 w-11 h-11 bg-blue-400 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <BookOpen className="w-5 h-5 text-white" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 10, 0], x: [0, -2, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute -bottom-2 -left-8 w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center shadow-lg"
                  >
                    <Brain className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-md mx-auto lg:mx-0"
            >
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Join MyBeing</h2>
                  <p className="text-gray-600">Start your journey of self-discovery</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 h-12 rounded-lg focus-visible:ring-brand-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 h-12 rounded-lg focus-visible:ring-brand-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 pr-10 h-12 rounded-lg focus-visible:ring-brand-500"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 pr-10 h-12 rounded-lg focus-visible:ring-brand-500"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg rounded-lg">
                    Create Account
                  </Button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>

                {/* Terms */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms" className="text-purple-600 hover:text-purple-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-purple-600 hover:text-purple-700">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

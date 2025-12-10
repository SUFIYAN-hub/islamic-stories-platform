// frontend/src/app/signup/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      router.push('/');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 backdrop-pattern opacity-40" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative max-w-md w-full animate-scale-in">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-xl mb-6 hover:glass-strong transition-all"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 shadow-glass-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-premium">
              <span className="text-3xl">🕌</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join thousands learning Islamic stories
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ahmed Khan"
                  className={`input-premium w-full pl-12 pr-4 py-3 ${
                    errors.name ? 'ring-2 ring-red-500' : ''
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className={`input-premium w-full pl-12 pr-4 py-3 ${
                    errors.email ? 'ring-2 ring-red-500' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`input-premium w-full pl-12 pr-12 py-3 ${
                    errors.password ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`input-premium w-full pl-12 pr-4 py-3 ${
                    errors.confirmPassword ? 'ring-2 ring-red-500' : ''
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Login here
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 space-y-3">
            {[
              'Save your favorite stories',
              'Sync progress across devices',
              'Create custom playlists',
              'Get personalized recommendations'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
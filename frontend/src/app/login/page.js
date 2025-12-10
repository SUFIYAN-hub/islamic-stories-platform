// frontend/src/app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData, rememberMe);
    
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
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Continue your Islamic learning journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="input-premium w-full pl-12 pr-4 py-3"
                />
              </div>
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
                  className="input-premium w-full pl-12 pr-12 py-3"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
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
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Login to Continue
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="divider-gradient" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass px-3 text-sm text-gray-500">
                or
              </span>
            </div>

            {/* Social Login (Optional - coming soon) */}
            <div className="space-y-3">
              <button
                type="button"
                disabled
                className="w-full glass-light px-4 py-3 rounded-xl font-medium hover:glass-strong transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🔜</span>
                  Continue with Google (Coming Soon)
                </span>
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 glass-light rounded-2xl p-4">
            <div className="flex items-start gap-3 text-sm">
              <Sparkles className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  Premium Features with Account
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Save your favorite stories</li>
                  <li>• Sync progress across devices</li>
                  <li>• Create custom playlists</li>
                  <li>• Get personalized recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
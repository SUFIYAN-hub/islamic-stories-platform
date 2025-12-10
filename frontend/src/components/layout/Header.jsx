// frontend/src/components/layout/Header.jsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Menu, X, Search, Home, BookOpen, Heart, User as UserIcon, LogIn, LogOut, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Stories', href: '/stories', icon: BookOpen },
    { name: 'Categories', href: '/categories', icon: BookOpen },
    { name: 'Favorites', href: '/favorites', icon: Heart, protected: true },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-400",
        isScrolled 
          ? "glass-strong shadow-glass" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-400 shadow-premium">
                IS
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                Islamic Stories
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic" dir="rtl">
                قصص إسلامية
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              // Skip protected routes if not authenticated
              if (item.protected && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-xl" />
                  <Icon className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10 font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Link
              href="/search"
              className="w-10 h-10 glass-light rounded-xl flex items-center justify-center hover:glass-strong transition-all duration-300 hover:scale-110"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Link>

            {/* User Menu - Desktop */}
            {isAuthenticated ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 glass-light px-4 py-2.5 rounded-xl hover:glass-strong transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user?.name}</span>
                  {isAdmin && (
                    <Shield className="w-4 h-4 text-gold-500" />
                  )}
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 glass-strong rounded-2xl shadow-glass-lg p-2 animate-fade-in-down z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 rounded-lg text-xs font-semibold">
                            <Shield className="w-3 h-3" />
                            Administrator
                          </span>
                        )}
                      </div>
                      <div className="py-2">
                        {/* Admin Panel Link - Only for Admins */}
                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gold-500/10 text-gold-600 dark:text-gold-400 transition-all font-medium"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-primary-500/10 transition-all"
                        >
                          <UserIcon className="w-4 h-4" />
                          <span className="font-medium">Profile</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-primary-500/10 transition-all"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">Settings</span>
                        </Link>
                        <Link
                          href="/favorites"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-primary-500/10 transition-all"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="font-medium">Favorites</span>
                        </Link>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-red-500/10 text-red-600 transition-all w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 glass-light px-4 py-2.5 rounded-xl hover:glass-strong transition-all duration-300 group"
              >
                <UserIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 glass-light rounded-xl flex items-center justify-center hover:glass-strong transition-all duration-300"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 animate-fade-in-down">
            <div className="glass rounded-2xl p-4 space-y-2">
              {/* User Info */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 px-4 py-3 glass-light rounded-xl mb-2">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                      {user?.name}
                      {isAdmin && <Shield className="w-4 h-4 text-gold-500" />}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Admin Panel Link - Mobile (Only for Admins) */}
              {isAuthenticated && isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-500/10 text-gold-600 dark:text-gold-400 hover:bg-gold-500/20 transition-all duration-300 font-medium"
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Navigation Links */}
              {navigation.map((item) => {
                const Icon = item.icon;
                if (item.protected && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-primary-500/10 hover:text-primary-600 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Login/Logout */}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-primary-500/10 hover:text-primary-600 transition-all duration-300"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-primary-500/10 hover:text-primary-600 transition-all duration-300"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-500/10 transition-all duration-300 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-primary text-white font-medium hover:shadow-premium transition-all duration-300"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login / Sign Up</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>

      {/* Divider */}
      {isScrolled && (
        <div className="divider-gradient animate-fade-in" />
      )}
    </header>
  );
}
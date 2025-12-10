// frontend/src/app/settings/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { userAPI } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Bell,
  BellOff,
  Volume2,
  Languages,
  Loader2,
  Save,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function SettingsPage() {
  const { isAuthenticated, loading: authLoading } = useUser();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [settings, setSettings] = useState({
    theme: 'system',
    language: 'hindi',
    autoplay: true,
    notifications: true,
    emailNotifications: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getSettings();
      setSettings(response.data.data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userAPI.updateSettings(settings);
      
      // Apply theme change
      if (settings.theme) {
        setTheme(settings.theme);
      }
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4">
      {/* Background */}
      <div className="fixed inset-0 backdrop-pattern opacity-40 pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-premium">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Customize your experience
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          
          {/* Appearance Section */}
          <div className="card-premium animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              {mounted && theme === 'dark' ? (
                <Moon className="w-5 h-5 text-primary-600" />
              ) : (
                <Sun className="w-5 h-5 text-primary-600" />
              )}
              Appearance
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = settings.theme === option.value;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => updateSetting('theme', option.value)}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all group
                          ${isActive 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                          }
                        `}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          isActive ? 'text-primary-600' : 'text-gray-500'
                        }`} />
                        <p className={`text-sm font-semibold ${
                          isActive ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {option.label}
                        </p>
                        {isActive && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-5 h-5 text-primary-600 fill-current" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Audio Preferences */}
          <div className="card-premium animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary-600" />
              Audio Preferences
            </h2>
            
            <div className="space-y-4">
              {/* Autoplay */}
              <div className="flex items-center justify-between p-4 glass-light rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    Autoplay Next Story
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically play the next story in queue
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('autoplay', !settings.autoplay)}
                  className={`
                    relative w-14 h-8 rounded-full transition-colors duration-300
                    ${settings.autoplay ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                >
                  <div className={`
                    absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300
                    ${settings.autoplay ? 'translate-x-6' : 'translate-x-0'}
                  `} />
                </button>
              </div>
            </div>
          </div>

          {/* Language Preferences */}
          <div className="card-premium animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary-600" />
              Language Preferences
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Preferred Audio Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="input-premium w-full"
                >
                  <option value="hindi">Hindi (हिंदी)</option>
                  <option value="urdu">Urdu (اردو)</option>
                  <option value="english">English</option>
                  <option value="arabic">Arabic (العربية)</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  More languages coming soon!
                </p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card-premium animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              {settings.notifications ? (
                <Bell className="w-5 h-5 text-primary-600" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              Notifications
            </h2>
            
            <div className="space-y-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 glass-light rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    Push Notifications
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified about new stories and updates
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('notifications', !settings.notifications)}
                  className={`
                    relative w-14 h-8 rounded-full transition-colors duration-300
                    ${settings.notifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                >
                  <div className={`
                    absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300
                    ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}
                  `} />
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 glass-light rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive weekly digest of new stories
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('emailNotifications', !settings.emailNotifications)}
                  className={`
                    relative w-14 h-8 rounded-full transition-colors duration-300
                    ${settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                >
                  <div className={`
                    absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300
                    ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'}
                  `} />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="sticky bottom-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-premium w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Changes...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  Save All Settings
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
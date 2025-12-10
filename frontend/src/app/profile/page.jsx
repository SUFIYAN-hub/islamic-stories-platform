// frontend/src/app/profile/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { userAPI } from '@/services/api';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  Mail, 
  Calendar,
  Loader2,
  Edit2,
  Save,
  X,
  Settings,
  Heart,
  ListMusic,
  BarChart3,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';
import { formatDate, formatListeningTime, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [isAuthenticated]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getStats()
      ]);

      setProfileData(profileRes.data.data);
      setStats(statsRes.data.data);
      setFormData({
        name: profileRes.data.data.name || '',
        bio: profileRes.data.data.bio || ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userAPI.updateProfile(formData);
      await fetchProfileData();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4">
      {/* Background */}
      <div className="fixed inset-0 backdrop-pattern opacity-40 pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>
            <Link
              href="/settings"
              className="btn-glass flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="card-premium animate-scale-in">
              <div className="text-center">
                {/* Avatar */}
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-primary rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-premium">
                  {getInitials(profileData.name)}
                </div>

                {isEditing ? (
                  <div className="space-y-4 mb-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-premium w-full"
                      placeholder="Your name"
                    />
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="input-premium w-full resize-none"
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {profileData.name}
                    </h2>
                    {profileData.bio && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {profileData.bio}
                      </p>
                    )}
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 justify-center">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-premium flex items-center gap-2"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: profileData.name || '',
                            bio: profileData.bio || ''
                          });
                        }}
                        className="btn-glass flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-premium flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="divider-gradient my-6" />
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {profileData.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Joined {formatDate(profileData.createdAt, 'short')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card-premium animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Favorites</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats?.favoriteCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListMusic className="w-4 h-4 text-primary-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Playlists</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats?.playlistCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gold-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats?.storiesCompleted || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-premium animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Listening Time</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.formattedListeningTime || '0m'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-premium animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stories Played</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.totalStories || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-premium animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.completionRate || 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="card-premium animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 p-4 glass-light rounded-xl hover:glass-strong transition-all group"
                >
                  <Heart className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Favorites</p>
                    <p className="text-xs text-gray-500">View saved stories</p>
                  </div>
                </Link>

                <Link
                  href="/playlists"
                  className="flex items-center gap-3 p-4 glass-light rounded-xl hover:glass-strong transition-all group"
                >
                  <ListMusic className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Playlists</p>
                    <p className="text-xs text-gray-500">Manage collections</p>
                  </div>
                </Link>

                <Link
                  href="/history"
                  className="flex items-center gap-3 p-4 glass-light rounded-xl hover:glass-strong transition-all group"
                >
                  <Clock className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">History</p>
                    <p className="text-xs text-gray-500">Recently played</p>
                  </div>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 p-4 glass-light rounded-xl hover:glass-strong transition-all group"
                >
                  <Settings className="w-5 h-5 text-gray-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Settings</p>
                    <p className="text-xs text-gray-500">Preferences</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
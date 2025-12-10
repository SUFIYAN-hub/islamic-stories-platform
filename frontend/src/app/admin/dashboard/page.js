// frontend/src/app/admin/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  LayoutDashboard, 
  BookOpen, 
  FolderOpen, 
  TrendingUp,
  Play,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token) => {
    try {
      // Fetch stats
      const statsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(statsRes.data.data);

      // Fetch recent stories
      const storiesRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stories?limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStories(storiesRes.data.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/admin/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">🕌</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Islamic Stories</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Stories"
            value={stats?.overview.totalStories || 0}
            icon={<BookOpen className="w-6 h-6" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Active Stories"
            value={stats?.overview.activeStories || 0}
            icon={<Eye className="w-6 h-6" />}
            color="bg-green-500"
          />
          <StatCard
            title="Categories"
            value={stats?.overview.totalCategories || 0}
            icon={<FolderOpen className="w-6 h-6" />}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Plays"
            value={stats?.overview.totalPlays || 0}
            icon={<Play className="w-6 h-6" />}
            color="bg-orange-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/stories/new"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                <Plus className="w-5 h-5 text-emerald-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add New Story</p>
                <p className="text-sm text-gray-500">Upload audio & details</p>
              </div>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <FolderOpen className="w-5 h-5 text-purple-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Categories</p>
                <p className="text-sm text-gray-500">Edit & organize</p>
              </div>
            </Link>

            <Link
              href="/admin/stories"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <BookOpen className="w-5 h-5 text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">All Stories</p>
                <p className="text-sm text-gray-500">View & edit</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Most Played Stories */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Most Played Stories</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.mostPlayed?.map((story, index) => (
              <div key={story._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-600">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{story.title}</p>
                  <p className="text-sm text-gray-500">
                    {story.category?.icon} {story.category?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{story.playCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">plays</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Stories */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Stories</h2>
            <Link href="/admin/stories" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Plays</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.slice(0, 5).map((story) => (
                  <tr key={story._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{story.title}</p>
                      <p className="text-sm text-gray-500">{story.language}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-sm">
                        {story.category?.icon} {story.category?.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{story.playCount}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        story.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {story.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/stories/${story._id}/edit`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
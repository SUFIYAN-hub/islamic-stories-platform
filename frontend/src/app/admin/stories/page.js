// frontend/src/app/admin/stories/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Filter,
  Play,
  Clock
} from 'lucide-react';

export default function StoriesManagementPage() {
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchData(token);
  }, [router, selectedCategory, statusFilter]);

  const fetchData = async (token) => {
    try {
      setLoading(true);

      // Fetch categories
      const catRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(catRes.data.data);

      // Fetch stories with filters
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (statusFilter !== 'all') params.isActive = statusFilter === 'active';

      const storiesRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stories`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      );
      setStories(storiesRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stories/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Story deleted successfully');
      setStories(stories.filter(s => s._id !== id));
    } catch (error) {
      toast.error('Failed to delete story');
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stories/${id}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setStories(stories.map(s => 
        s._id === id ? { ...s, isActive: !currentStatus } : s
      ));
      
      toast.success(`Story ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update story');
    }
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Stories</h1>
                <p className="text-sm text-gray-500">
                  {filteredStories.length} total stories
                </p>
              </div>
            </div>

            <Link
              href="/admin/stories/new"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Story
            </Link>
          </div>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first story</p>
            <Link
              href="/admin/stories/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div
                key={story._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  {story.thumbnailUrl ? (
                    <img
                      src={story.thumbnailUrl}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">🎵</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      story.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {story.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {story.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {story.title}
                      </h3>
                      {story.titleArabic && (
                        <p className="text-sm text-gray-500 font-arabic truncate" dir="rtl">
                          {story.titleArabic}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {story.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      {story.category?.icon} {story.category?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(story.duration / 60)}:{(story.duration % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {story.playCount}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/stories/${story._id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => toggleActive(story._id, story.isActive)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title={story.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {story.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(story._id, story.title)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
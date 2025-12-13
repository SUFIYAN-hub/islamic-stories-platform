// frontend/src/app/categories/[slug]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { storiesAPI, categoriesAPI } from '@/services/api';
import StoryCard from '@/components/stories/StoryCard';
import { 
  Loader2, 
  ArrowLeft,
  Search,
  SortAsc,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug;
  
  const [category, setCategory] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch category details
      const categoryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`);
      const categoryData = await categoryRes.json();
      
      if (!categoryData.success) {
        throw new Error('Category not found');
      }
      
      setCategory(categoryData.data);
      
      // Fetch stories in this category
      const storiesRes = await storiesAPI.getAll({ category: categoryData.data._id });
      setStories(storiesRes.data.data || []);
      
    } catch (error) {
      toast.error('Failed to load category');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort stories
  const filteredStories = stories
    .filter(story => 
      story.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'popular') return (b.playCount || 0) - (a.playCount || 0);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Category Not Found
          </h1>
          <Link href="/categories" className="text-primary-600 hover:text-primary-700">
            ← Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4">
      {/* Background */}
      <div className="fixed inset-0 backdrop-pattern opacity-40 pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Back Button */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-xl mb-6 hover:glass-strong transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Categories</span>
        </Link>

        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-premium"
              style={{ 
                backgroundColor: `${category.color}20`,
                borderTop: `4px solid ${category.color}`
              }}
            >
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h1>
              {category.nameArabic && (
                <p className="text-xl text-gray-600 dark:text-gray-400 font-arabic" dir="rtl">
                  {category.nameArabic}
                </p>
              )}
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {stories.length} {stories.length === 1 ? 'story' : 'stories'}
              </p>
            </div>
          </div>

          {category.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {category.description}
            </p>
          )}

          {/* Search & Filter */}
          {stories.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories..."
                  className="w-full pl-12 pr-4 py-3 glass-light rounded-xl focus:glass-strong outline-none transition-all"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-12 pr-8 py-3 glass-light rounded-xl focus:glass-strong outline-none cursor-pointer appearance-none transition-all"
                >
                  <option value="recent">Most Recent</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-20 animate-scale-in">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {category.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {searchQuery ? 'No Results Found' : 'No Stories Yet'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Stories will appear here once they are added to this category'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn-glass"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStories.map((story, index) => (
              <div
                key={story._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
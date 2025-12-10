'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { storiesAPI, categoriesAPI } from '@/services/api';
import StoryCard from '@/components/stories/StoryCard';
import { Search, Filter, Loader2, X } from 'lucide-react';

export default function StoriesPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    language: '',
    ageGroup: '',
    page: 1,
  });

  // Fetch categories for filter
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return response.data;
    },
  });

  // Fetch stories with filters
  const { data: storiesData, isLoading } = useQuery({
    queryKey: ['stories', filters],
    queryFn: async () => {
      const response = await storiesAPI.getAll(filters);
      return response.data;
    },
  });

  const categories = categoriesData?.data || [];
  const stories = storiesData?.data || [];
  const pagination = storiesData?.pagination || {};

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      language: '',
      ageGroup: '',
      page: 1,
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.language || filters.ageGroup;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          All Stories
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover authentic Islamic stories for children
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          {/* Language Filter */}
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Languages</option>
            <option value="hindi">Hindi</option>
            <option value="urdu">Urdu</option>
            <option value="english">English</option>
          </select>

          {/* Age Group Filter */}
          <select
            value={filters.ageGroup}
            onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Ages</option>
            <option value="3-5">3-5 years</option>
            <option value="6-8">6-8 years</option>
            <option value="9-12">9-12 years</option>
            <option value="13+">13+ years</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {pagination.total > 0 ? (
          <span>Found {pagination.total} stories</span>
        ) : (
          <span>No stories found</span>
        )}
      </div>

      {/* Stories Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No stories found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters or search terms
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleFilterChange('page', filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handleFilterChange('page', pageNum)}
                      className={`w-10 h-10 rounded-lg ${
                        filters.page === pageNum
                          ? 'bg-emerald-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handleFilterChange('page', filters.page + 1)}
                disabled={filters.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
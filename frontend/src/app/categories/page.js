'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '@/services/api';
import Link from 'next/link';
import { Loader2, ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return response.data;
    },
  });

  const categories = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Story Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse stories by categories
        </p>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              style={{
                borderTop: `4px solid ${category.color || '#10b981'}`
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-arabic" dir="rtl">
                  {category.nameArabic}
                </p>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span 
                    className="px-3 py-1 rounded-full font-medium"
                    style={{ 
                      backgroundColor: `${category.color}20`,
                      color: category.color 
                    }}
                  >
                    {category.storyCount || 0} stories
                  </span>
                  
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    Explore
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
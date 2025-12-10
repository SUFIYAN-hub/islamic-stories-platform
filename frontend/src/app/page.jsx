'use client';

import { useQuery } from '@tanstack/react-query';
import { storiesAPI, categoriesAPI } from '@/services/api';
import StoryCard from '@/components/stories/StoryCard';
import { Sparkles, TrendingUp, Loader2, Play, Headphones, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  // Fetch data
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return response.data;
    },
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['stories', 'featured'],
    queryFn: async () => {
      const response = await storiesAPI.getAll({ featured: true, limit: 6 });
      return response.data;
    },
  });

  const { data: latestData, isLoading: latestLoading } = useQuery({
    queryKey: ['stories', 'latest'],
    queryFn: async () => {
      const response = await storiesAPI.getAll({ limit: 12 });
      return response.data;
    },
  });

  const categories = categoriesData?.data || [];
  const featuredStories = featuredData?.data || [];
  const latestStories = latestData?.data || [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 backdrop-pattern opacity-40 pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-strong px-6 py-3 rounded-full mb-8 animate-fade-in-down">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <span className="text-sm font-semibold bg-gradient-gold bg-clip-text text-transparent">
                Premium Islamic Audio Stories
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fade-in-up">
              <span className="text-gradient">Discover</span>
              <br />
              <span className="text-dark-900 dark:text-white">Beautiful Islamic Stories</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
              Authentic stories from Quran and Hadith, beautifully narrated in Hindi for children and families
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/stories" className="btn-premium group">
                <Play className="w-5 h-5 inline mr-2 group-hover:scale-110 transition-transform" />
                Start Listening
              </Link>
              <Link href="/categories" className="btn-glass group">
                <BookOpen className="w-5 h-5 inline mr-2 group-hover:rotate-12 transition-transform" />
                Browse Categories
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-1">
                  {latestStories.length}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Stories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-1">
                  {categories.length}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-1">
                  1000+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Listeners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-2">
                Explore Categories
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Find stories by topics that interest you
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="card-premium card-glow group hover-lift animate-fade-in"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  borderTop: `3px solid ${category.color || '#10b981'}`
                }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-400 float">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic mb-3" dir="rtl">
                    {category.nameArabic}
                  </p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${category.color}15`,
                      color: category.color 
                    }}>
                    <Headphones className="w-3 h-3" />
                    {category.storyCount || 0}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="relative py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-gold-500" fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white">
                    Featured Stories
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Most loved by our community
                  </p>
                </div>
              </div>
              <Link
                href="/stories?featured=true"
                className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
              >
                View All
                <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {featuredLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredStories.slice(0, 6).map((story, index) => (
                  <div key={story._id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <StoryCard story={story} variant="premium" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Latest Stories */}
<section className="relative py-16 px-4">
  <div className="container mx-auto max-w-7xl">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white">
            Latest Additions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fresh stories added recently
          </p>
        </div>
      </div>

      <Link
        href="/stories"
        className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
      >
        View All
        <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>

    {latestLoading ? (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {latestStories.slice(0, 8).map((story, index) => (
          <div
            key={story._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <StoryCard story={story} variant="compact" />
          </div>
        ))}
      </div>
    )}
  </div>
</section>


      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-strong rounded-4xl p-12 text-center relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-primary opacity-10" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-6 float">
                <Headphones className="w-10 h-10 text-primary-600" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4">
                Start Your Islamic Learning Journey
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of families learning beautiful Islamic stories. All stories are carefully selected from authentic sources.
              </p>
              <Link href="/stories" className="btn-premium inline-flex items-center gap-2">
                <Play className="w-5 h-5" />
                Start Listening Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

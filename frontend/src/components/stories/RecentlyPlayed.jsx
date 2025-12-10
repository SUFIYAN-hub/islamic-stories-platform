'use client';

import { useEffect, useState } from 'react';
import { getRecentlyPlayed } from '@/store/audioStore';
import StoryCard from '@/components/stories/StoryCard';
import { History, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RecentlyPlayed() {
  const [recentStories, setRecentStories] = useState([]);

  useEffect(() => {
    // Load recently played
    loadRecentlyPlayed();

    // Refresh when window gains focus
    const handleFocus = () => loadRecentlyPlayed();
    window.addEventListener('focus', handleFocus);

    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadRecentlyPlayed = () => {
    const stories = getRecentlyPlayed();
    // Filter out stories that are in "Continue Listening"
    // Show only completed or barely started ones
    const filtered = stories.filter(story => {
      const progress = localStorage.getItem(`story-progress-${story._id}`);
      if (!progress) return true;
      
      const data = JSON.parse(progress);
      return data.completed || data.percentage < 5 || data.percentage > 95;
    }).slice(0, 8);
    
    setRecentStories(filtered);
  };

  if (recentStories.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
              <History className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white">
                Recently Played
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Stories you've listened to
              </p>
            </div>
          </div>
          
          <Link
            href="/history"
            className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
          >
            View All
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentStories.map((story, index) => (
            <div key={story._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <StoryCard story={story} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
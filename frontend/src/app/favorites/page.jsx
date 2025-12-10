// frontend/src/app/favorites/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { userAPI } from '@/services/api';
import { useRouter } from 'next/navigation';
import StoryCard from '@/components/stories/StoryCard';
import { 
  Heart,
  Loader2,
  Sparkles,
  Search,
  Filter,
  SortAsc
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const { isAuthenticated, loading: authLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getFavorites();
      setFavorites(response.data.data);
    } catch (error) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (storyId) => {
    try {
      await userAPI.removeFromFavorites(storyId);
      setFavorites(prev => prev.filter(story => story._id !== storyId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  // Filter and sort
  const filteredFavorites = favorites
    .filter(story => 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') return 0; // Keep original order
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'duration') return a.duration - b.duration;
      return 0;
    });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4">
      {/* Background */}
      <div className="fixed inset-0 backdrop-pattern opacity-40 pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-premium">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Favorites
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {favorites.length} {favorites.length === 1 ? 'story' : 'stories'} saved
              </p>
            </div>
          </div>

          {/* Search & Filter */}
          {favorites.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search favorites..."
                  className="input-premium w-full pl-12"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-premium pl-12 pr-8 cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          // Empty State
          <div className="text-center py-20 animate-scale-in">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-red-300 dark:text-red-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Favorites Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start adding stories to your favorites by clicking the heart icon on any story.
            </p>
            <a
              href="/stories"
              className="btn-premium inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Browse Stories
            </a>
          </div>
        ) : filteredFavorites.length === 0 ? (
          // No Results
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Results Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          // Stories Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((story, index) => (
              <div
                key={story._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <StoryCard 
                  story={story} 
                  onFavoriteRemove={() => handleRemoveFavorite(story._id)}
                  showRemove
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
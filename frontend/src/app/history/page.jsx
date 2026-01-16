'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { userAPI } from '@/services/api';
import { useRouter } from 'next/navigation';
import StoryCard from '@/components/stories/StoryCard';
import { 
  Clock,
  Loader2,
  CheckCircle,
  PlayCircle,
  AlertCircle
} from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const { isAuthenticated, loading: authLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated, filter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'completed') params.completed = 'true';
      if (filter === 'incomplete') params.completed = 'false';
      
      const response = await userAPI.getHistory(params);
      
      // FIX: Filter out items with null/undefined stories
      const validHistory = (response.data.data || []).filter(item => item.story && item.story._id);
      setHistory(validHistory);
      
      // Show warning if some stories were filtered
      const totalItems = response.data.data?.length || 0;
      const filteredCount = totalItems - validHistory.length;
      if (filteredCount > 0) {
        console.warn(`${filteredCount} history items had missing stories`);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      toast.error('Failed to load history');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-premium">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Listening History
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {history.length} {history.length === 1 ? 'story' : 'stories'} played
                </p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-gradient-primary text-white shadow-premium'
                  : 'glass-light hover:glass-strong'
              }`}
            >
              All Stories
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                filter === 'completed'
                  ? 'bg-gradient-primary text-white shadow-premium'
                  : 'glass-light hover:glass-strong'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Completed
            </button>
            <button
              onClick={() => setFilter('incomplete')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                filter === 'incomplete'
                  ? 'bg-gradient-primary text-white shadow-premium'
                  : 'glass-light hover:glass-strong'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              In Progress
            </button>
          </div>
        </div>

        {/* Content */}
        {history.length === 0 ? (
          // Empty State
          <div className="text-center py-20 animate-scale-in">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-16 h-16 text-blue-300 dark:text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {filter === 'all' ? 'No History Yet' : `No ${filter} Stories`}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {filter === 'all' 
                ? 'Start listening to stories to see them here.'
                : `You don't have any ${filter} stories yet.`
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="btn-glass"
              >
                View All History
              </button>
            )}
          </div>
        ) : (
          // History List
          <div className="space-y-4">
            {history.map((item, index) => {
              // Double-check story exists (extra safety)
              if (!item.story || !item.story._id) {
                return null;
              }

              return (
                <div
                  key={`${item.story._id}-${index}`}
                  className="card-premium flex flex-col md:flex-row gap-4 animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Story Card */}
                  <div className="flex-1">
                    <StoryCard story={item.story} variant="compact" />
                  </div>

                  {/* History Info */}
                  <div className="md:w-64 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Last Played */}
                      {item.lastPlayedAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeAgo(item.lastPlayedAt)}</span>
                        </div>
                      )}

                      {/* Play Count */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <PlayCircle className="w-4 h-4" />
                        <span>Played {item.playCount || 0} {item.playCount === 1 ? 'time' : 'times'}</span>
                      </div>

                      {/* Completion Status */}
                      {item.completed ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400 text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Progress</span>
                            <span>
                              {item.story.duration > 0 
                                ? Math.round(((item.lastPosition || 0) / item.story.duration) * 100)
                                : 0
                              }%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-primary transition-all"
                              style={{
                                width: `${
                                  item.story.duration > 0 
                                    ? Math.round(((item.lastPosition || 0) / item.story.duration) * 100)
                                    : 0
                                }%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Resume Button */}
                    {!item.completed && (item.lastPosition || 0) > 0 && item.story.slug && (
                      <button
                        onClick={() => {
                          router.push(`/stories/${item.story.slug}`);
                        }}
                        className="btn-premium text-sm py-2 mt-4"
                      >
                        Resume
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
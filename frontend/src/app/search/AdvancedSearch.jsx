'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { storiesAPI } from '@/services/api';
import { formatDuration, cn } from '@/lib/utils';
import Image from 'next/image';

export default function AdvancedSearch({ onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const trendingSearches = [
    'Prophets Stories',
    'Sahaba Stories', 
    'Quran Stories',
    'Bedtime Stories',
    'Islamic History'
  ];

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // FIX: ESC key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Search with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await storiesAPI.getAll({ 
          search: query,
          limit: 8 
        });
        setResults(response.data.data || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const saveRecentSearch = (searchTerm) => {
    const updated = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, 5);
    
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // FIX: Better navigation with fallback
  const handleResultClick = (story) => {
    saveRecentSearch(story.title);
    
    // DEBUG: Log to see what we have
    console.log('Story data:', story);
    console.log('Story slug:', story.slug);
    console.log('Story _id:', story._id);
    
    // Try slug first, fallback to _id
    const urlPath = story.slug ? `/stories/${story.slug}` : `/stories/${story._id}`;
    
    console.log('Navigating to:', urlPath);
    router.push(urlPath);
    onClose();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    saveRecentSearch(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="fixed inset-0 z-[60] animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Search Container */}
      <div className="relative z-10 container mx-auto px-4 pt-8 max-w-3xl">
        <div className="glass-strong rounded-3xl shadow-2xl animate-scale-in">
          
          {/* Search Header */}
          <div className="p-6 border-b border-white/10">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Islamic stories, categories, narrators..."
                  className="w-full pl-12 pr-12 py-4 bg-white/50 dark:bg-dark-800/50 border-2 border-transparent focus:border-primary-500 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all text-lg"
                />
                
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </form>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Press <kbd className="px-2 py-1 bg-white/50 dark:bg-dark-700/50 rounded text-xs font-mono">ESC</kbd> to close
            </p>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto scrollbar-premium p-6">
            
            {query.trim().length >= 2 ? (
              <>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Searching stories...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Found {results.length} results for "{query}"
                    </p>
                    {results.map((story) => (
                      <button
                        key={story._id}
                        onClick={() => handleResultClick(story)}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/50 dark:hover:bg-dark-700/50 transition-all group text-left"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={story.thumbnail || '/images/default-thumbnail.jpg'}
                            alt={story.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                            {story.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{story.category?.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(story.duration)}
                            </span>
                          </div>
                        </div>

                        {story.playCount > 0 && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {story.playCount}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold mb-2">
                      No results found
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Try different keywords
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setQuery(search)}
                          className="px-4 py-2 glass-light rounded-xl text-sm hover:glass-strong transition-all"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="px-4 py-2 glass-light rounded-xl text-sm hover:glass-strong transition-all flex items-center gap-2"
                      >
                        <span className="text-primary-500">🔥</span>
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
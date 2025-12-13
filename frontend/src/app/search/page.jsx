'use client';

import { useState } from 'react';
import { storiesAPI } from '@/services/api';
import StoryCard from '@/components/stories/StoryCard';
import { Search, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      const response = await storiesAPI.getAll({ search: query });
      setResults(response.data.data || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Search Stories</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for stories..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </form>

        {loading && (
          <div className="flex justify-center">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.map(story => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
}
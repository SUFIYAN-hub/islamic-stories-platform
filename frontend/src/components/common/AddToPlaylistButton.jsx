// frontend/src/components/common/AddToPlaylistButton.jsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { userAPI } from '@/services/api';
import { ListMusic, Loader2, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AddToPlaylistButton({ 
  storyId, 
  size = 'md',
  className = '' 
}) {
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    if (showMenu && isAuthenticated) {
      fetchPlaylists();
    }
  }, [showMenu, isAuthenticated]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getPlaylists();
      setPlaylists(response.data.data);
    } catch (error) {
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (adding) return;

    try {
      setAdding(playlistId);
      await userAPI.addStoryToPlaylist(playlistId, storyId);
      toast.success('Added to playlist');
      setShowMenu(false);
    } catch (error) {
      if (error.response?.data?.message?.includes('already in playlist')) {
        toast.error('Story already in this playlist');
      } else {
        toast.error('Failed to add to playlist');
      }
    } finally {
      setAdding(null);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to create playlists');
      router.push('/login');
      return;
    }

    setShowMenu(!showMenu);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const isInPlaylist = (playlist) => {
    return playlist.stories?.some(story => 
      (typeof story === 'string' ? story : story._id) === storyId
    );
  };

  return (
    <div className="relative">
      <button
        onClick={handleButtonClick}
        className={cn(
          sizeClasses[size],
          'glass-light rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:glass-strong',
          className
        )}
        title="Add to playlist"
      >
        <ListMusic className={cn(iconSizes[size])} />
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-72 glass-strong rounded-2xl shadow-glass-lg p-3 z-50 animate-fade-in-down">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Add to Playlist
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/playlists');
                  setShowMenu(false);
                }}
                className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                New
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
              </div>
            ) : playlists.length === 0 ? (
              <div className="text-center py-6">
                <ListMusic className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  No playlists yet
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/playlists');
                    setShowMenu(false);
                  }}
                  className="btn-premium text-xs py-2 px-4"
                >
                  Create Playlist
                </button>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-1">
                {playlists.map((playlist) => {
                  const inPlaylist = isInPlaylist(playlist);
                  
                  return (
                    <button
                      key={playlist._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!inPlaylist) {
                          handleAddToPlaylist(playlist._id);
                        }
                      }}
                      disabled={adding === playlist._id || inPlaylist}
                      className={cn(
                        'w-full flex items-center justify-between p-3 rounded-xl transition-all text-left',
                        inPlaylist
                          ? 'bg-primary-50 dark:bg-primary-900/20 cursor-default'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800',
                        adding === playlist._id && 'opacity-50 cursor-wait'
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <ListMusic className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                            {playlist.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {playlist.stories?.length || 0} stories
                          </p>
                        </div>
                      </div>
                      
                      {adding === playlist._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary-600 flex-shrink-0" />
                      ) : inPlaylist ? (
                        <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
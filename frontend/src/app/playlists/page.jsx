// frontend/src/app/playlists/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { userAPI } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ListMusic,
  Loader2,
  Plus,
  Music,
  Lock,
  Globe,
  MoreVertical,
  Edit2,
  Trash2,
  Play
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function PlaylistsPage() {
  const { isAuthenticated, loading: authLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaylists();
    }
  }, [isAuthenticated]);

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

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    try {
      await userAPI.createPlaylist(formData);
      toast.success('Playlist created successfully!');
      setShowCreateModal(false);
      setFormData({ name: '', description: '', isPublic: false });
      fetchPlaylists();
    } catch (error) {
      toast.error('Failed to create playlist');
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      await userAPI.deletePlaylist(playlistId);
      toast.success('Playlist deleted');
      fetchPlaylists();
    } catch (error) {
      toast.error('Failed to delete playlist');
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
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-premium">
                <ListMusic className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  My Playlists
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-premium flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Playlist
            </button>
          </div>
        </div>

        {/* Content */}
        {playlists.length === 0 ? (
          // Empty State
          <div className="text-center py-20 animate-scale-in">
            <div className="w-32 h-32 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ListMusic className="w-16 h-16 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Playlists Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Create your first playlist to organize your favorite Islamic stories.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-premium inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Playlist
            </button>
          </div>
        ) : (
          // Playlists Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist, index) => (
              <div
                key={playlist._id}
                className="card-premium card-glow hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  {/* Playlist Cover */}
                  <div className="relative w-full aspect-square bg-gradient-primary rounded-2xl mb-4 overflow-hidden group">
                    {playlist.stories && playlist.stories.length > 0 ? (
                      <div className="grid grid-cols-2 gap-0.5 h-full">
                        {playlist.stories.slice(0, 4).map((story, idx) => (
                          <div 
                            key={story._id || idx}
                            className="relative bg-gray-200 dark:bg-gray-800"
                          >
                            {story.thumbnail && (
                              <img
                                src={story.thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Music className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    
                    {/* Play Overlay */}
                    {playlist.stories && playlist.stories.length > 0 && (
                      <Link
                        href={`/playlists/${playlist._id}`}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* Menu */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setShowMenu(showMenu === playlist._id ? null : playlist._id)}
                      className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:glass-strong transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {showMenu === playlist._id && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowMenu(null)}
                        />
                        <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-glass-lg p-2 z-50">
                          <Link
                            href={`/playlists/${playlist._id}/edit`}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-500/10 transition-all"
                            onClick={() => setShowMenu(null)}
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="font-medium">Edit</span>
                          </Link>
                          <button
                            onClick={() => {
                              handleDeletePlaylist(playlist._id);
                              setShowMenu(null);
                            }}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/10 text-red-600 transition-all w-full"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="font-medium">Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <Link href={`/playlists/${playlist._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 transition-colors">
                      {playlist.name}
                    </h3>
                  </Link>
                  
                  {playlist.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      {playlist.isPublic ? (
                        <Globe className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {playlist.stories?.length || 0} {playlist.stories?.length === 1 ? 'story' : 'stories'}
                      </span>
                    </div>
                    <span>{formatDate(playlist.createdAt, 'compact')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-3xl p-8 max-w-md w-full shadow-glass-lg animate-scale-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Create New Playlist
            </h2>
            
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Favorite Stories"
                  className="input-premium w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your playlist..."
                  className="input-premium w-full resize-none"
                  rows="3"
                />
              </div>

              <div className="flex items-center justify-between p-4 glass-light rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    Make Public
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Others can view this playlist
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                  className={`
                    relative w-14 h-8 rounded-full transition-colors duration-300
                    ${formData.isPublic ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                >
                  <div className={`
                    absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300
                    ${formData.isPublic ? 'translate-x-6' : 'translate-x-0'}
                  `} />
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', description: '', isPublic: false });
                  }}
                  className="btn-glass flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-premium flex-1"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
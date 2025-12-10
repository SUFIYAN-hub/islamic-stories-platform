// frontend/src/components/audio/AudioPlayer.jsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { userAPI } from '@/services/api';
import useAudioStore from '@/store/audioStore';
import { formatDuration, cn } from '@/lib/utils';
import FavoriteButton from '@/components/common/FavoriteButton';
import AddToPlaylistButton from '@/components/common/AddToPlaylistButton';
import Image from 'next/image';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Loader2,
  X,
  Maximize2,
  Minimize2,
  Share2
} from 'lucide-react';

export default function AudioPlayer() {
  const { isAuthenticated } = useUser();
  const {
    currentStory,
    isPlaying,
    volume,
    playbackRate,
    currentTime,
    duration,
    isLoading,
    togglePlayPause,
    skip,
    seek,
    setVolume,
    setPlaybackRate,
    cleanup,
  } = useAudioStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(0);

  // Sync progress to backend every 30 seconds
  useEffect(() => {
    if (!isAuthenticated || !currentStory) return;

    const syncProgress = async () => {
      const now = Date.now();
      // Only sync every 30 seconds to avoid too many requests
      if (now - lastSyncTime < 30000) return;

      try {
        const completed = currentTime > 0 && currentTime >= duration * 0.95;
        await userAPI.updateProgress(currentStory._id, {
          position: Math.floor(currentTime),
          duration: Math.floor(duration),
          completed
        });
        setLastSyncTime(now);
      } catch (error) {
        console.error('Failed to sync progress:', error);
      }
    };

    if (isPlaying && currentTime > 0) {
      syncProgress();
    }
  }, [currentTime, isPlaying, isAuthenticated, currentStory, duration, lastSyncTime]);

  // Sync progress when pausing or closing
  useEffect(() => {
    return () => {
      if (isAuthenticated && currentStory && currentTime > 0) {
        const completed = currentTime >= duration * 0.95;
        userAPI.updateProgress(currentStory._id, {
          position: Math.floor(currentTime),
          duration: Math.floor(duration),
          completed
        }).catch(err => console.error('Failed to save progress:', err));
      }
    };
  }, []);

  if (!currentStory) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Mini Player (Collapsed)
  if (!isExpanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        {/* Progress Bar */}
        <div 
          className="relative h-1 bg-gray-200 dark:bg-dark-800 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            seek(percentage * duration);
          }}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>

        {/* Mini Player Content */}
        <div className="glass-strong border-t border-white/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Thumbnail & Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 group cursor-pointer">
                  <Image
                    src={currentStory.thumbnail || '/images/default-thumbnail.jpg'}
                    alt={currentStory.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="audio-wave">
                        <span className="bg-white"></span>
                        <span className="bg-white"></span>
                        <span className="bg-white"></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {currentStory.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {currentStory.category?.name} • {formatDuration(currentTime)} / {formatDuration(duration)}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Favorite & Playlist Buttons */}
                {isAuthenticated && (
                  <>
                    <FavoriteButton 
                      storyId={currentStory._id} 
                      size="sm"
                      className="hidden sm:flex"
                    />
                    <AddToPlaylistButton 
                      storyId={currentStory._id}
                      size="sm"
                      className="hidden sm:flex"
                    />
                  </>
                )}

                {/* Skip Back */}
                <button
                  onClick={() => skip(-15)}
                  className="hidden sm:flex w-9 h-9 glass-light rounded-xl items-center justify-center hover:glass-strong transition-all"
                  title="15s back"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  disabled={isLoading}
                  className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-premium disabled:opacity-50"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 text-white" fill="white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  )}
                </button>

                {/* Skip Forward */}
                <button
                  onClick={() => skip(15)}
                  className="hidden sm:flex w-9 h-9 glass-light rounded-xl items-center justify-center hover:glass-strong transition-all"
                  title="15s forward"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Playback Speed */}
                <select
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(Number(e.target.value))}
                  className="hidden md:block glass-light px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:glass-strong transition-all outline-none"
                  title="Speed"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>

                {/* Expand Button */}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="w-9 h-9 glass-light rounded-xl flex items-center justify-center hover:glass-strong transition-all"
                  title="Expand"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={cleanup}
                  className="w-9 h-9 glass-light rounded-xl flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Expanded Player
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="glass-strong rounded-3xl p-8 max-w-2xl w-full shadow-glass-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Now Playing
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <FavoriteButton storyId={currentStory._id} size="md" />
                <AddToPlaylistButton storyId={currentStory._id} size="md" />
              </>
            )}
            <button className="w-9 h-9 glass-light rounded-xl flex items-center justify-center hover:glass-strong transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-9 h-9 glass-light rounded-xl flex items-center justify-center hover:glass-strong transition-all"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Album Art */}
        <div className="relative w-full aspect-square max-w-md mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={currentStory.thumbnail || '/images/default-thumbnail.jpg'}
            alt={currentStory.title}
            fill
            className="object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-gradient-primary/20 flex items-center justify-center">
              <div className="audio-wave scale-150">
                <span className="bg-white"></span>
                <span className="bg-white"></span>
                <span className="bg-white"></span>
                <span className="bg-white"></span>
              </div>
            </div>
          )}
        </div>

        {/* Story Info */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {currentStory.title}
          </h2>
          {currentStory.titleArabic && (
            <p className="text-lg text-gray-600 dark:text-gray-400 font-arabic mb-2" dir="rtl">
              {currentStory.titleArabic}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{currentStory.category?.icon}</span>
            <span>{currentStory.category?.name}</span>
            {currentStory.narrator && (
              <>
                <span>•</span>
                <span>{currentStory.narrator}</span>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div 
            className="relative h-2 bg-gray-200 dark:bg-dark-700 rounded-full cursor-pointer group mb-2"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              seek(percentage * duration);
            }}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-primary rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-opacity"
              style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
          <div className="flex items-center justify-between text-sm font-mono text-gray-600 dark:text-gray-400">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => skip(-15)}
            className="w-12 h-12 glass-light rounded-xl flex items-center justify-center hover:glass-strong transition-all"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-premium disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-7 h-7 animate-spin text-white" />
            ) : isPlaying ? (
              <Pause className="w-7 h-7 text-white" fill="white" />
            ) : (
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            )}
          </button>

          <button
            onClick={() => skip(15)}
            className="w-12 h-12 glass-light rounded-xl flex items-center justify-center hover:glass-strong transition-all"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-between">
          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className="w-9 h-9 glass-light rounded-xl flex items-center justify-center hover:glass-strong transition-all"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            {showVolume && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-2 bg-gray-200 dark:bg-dark-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            )}
          </div>

          {/* Playback Speed */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            className="glass-light px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer hover:glass-strong transition-all outline-none"
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
    </div>
  );
}
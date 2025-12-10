'use client';

import { useEffect, useState } from 'react';
import { getContinueListening, clearStoryProgress } from '@/store/audioStore';
import useAudioStore from '@/store/audioStore';
import Image from 'next/image';
import { Play, Pause, X, Clock, RotateCcw } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

export default function ContinueListening() {
  const [continueStories, setContinueStories] = useState([]);
  const { currentStory, isPlaying, loadStory, togglePlayPause } = useAudioStore();

  useEffect(() => {
    // Load continue listening data
    loadContinueStories();

    // Refresh every minute to update times
    const interval = setInterval(() => {
      loadContinueStories();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadContinueStories = () => {
    const stories = getContinueListening();
    setContinueStories(stories);
  };

  const handlePlay = (story) => {
    const isCurrentStory = currentStory?._id === story._id;
    
    if (isCurrentStory) {
      togglePlayPause();
    } else {
      loadStory(story);
      setTimeout(() => {
        useAudioStore.getState().play();
      }, 100);
    }
  };

  const handleRemove = (e, storyId) => {
    e.stopPropagation();
    clearStoryProgress(storyId);
    loadContinueStories();
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const played = new Date(timestamp);
    const diffMs = now - played;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  if (continueStories.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white">
                Continue Listening
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Pick up where you left off
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {continueStories.map((story, index) => {
            const isCurrentStory = currentStory?._id === story._id;
            const progress = story.progress;

            return (
              <div
                key={story._id}
                className="group glass rounded-2xl overflow-hidden hover-lift transition-all duration-400 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handlePlay(story)}
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={story.thumbnailUrl || '/images/default-thumbnail.jpg'}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(story);
                        }}
                        className="w-10 h-10 glass-strong rounded-full flex items-center justify-center"
                      >
                        {isCurrentStory && isPlaying ? (
                          <Pause className="w-5 h-5 text-white" fill="white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                        )}
                      </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div 
                        className="h-full bg-gradient-primary"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                          {story.title}
                        </h3>
                        {story.titleArabic && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic truncate" dir="rtl">
                            {story.titleArabic}
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => handleRemove(e, story._id)}
                        className="w-7 h-7 glass-light rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Category */}
                    {story.category && (
                      <div className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <span>{story.category.icon}</span>
                        <span>{story.category.name}</span>
                      </div>
                    )}

                    {/* Progress Info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDuration(progress.position)} / {formatDuration(progress.duration)}
                        </span>
                      </div>
                      <span>•</span>
                      <span className="font-semibold text-primary-600">
                        {progress.percentage}% complete
                      </span>
                      <span>•</span>
                      <span>{getTimeAgo(story.playedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Full Width Progress Bar */}
                <div className="h-1 bg-gray-200 dark:bg-dark-700">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>

                {/* Playing Indicator */}
                {isCurrentStory && isPlaying && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 glass-strong px-2 py-1 rounded-lg">
                    <div className="audio-wave scale-75">
                      <span className="bg-primary-600"></span>
                      <span className="bg-primary-600"></span>
                      <span className="bg-primary-600"></span>
                    </div>
                    <span className="text-xs font-semibold text-primary-600">Playing</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
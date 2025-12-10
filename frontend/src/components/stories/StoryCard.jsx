// frontend/src/components/stories/StoryCard.jsx
'use client';

import Image from 'next/image';
import { Play, Clock, Headphones, Pause, Star, Bookmark } from 'lucide-react';
import { formatDuration, formatNumber, cn } from '@/lib/utils';
import useAudioStore from '@/store/audioStore';
import { useState } from 'react';

export default function StoryCard({ story, variant = 'default' }) {
  const { currentStory, isPlaying, loadStory, togglePlayPause } = useAudioStore();
  const isCurrentStory = currentStory?._id === story._id;
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrentStory) {
      togglePlayPause();
    } else {
      loadStory(story);
      setTimeout(() => {
        useAudioStore.getState().play();
      }, 100);
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // TODO: Save to backend or localStorage
  };

  // Compact variant for lists
  if (variant === 'compact') {
    return (
      <div 
        className={cn(
          "group relative glass-light rounded-2xl overflow-hidden hover-lift transition-all duration-400",
          isCurrentStory && "ring-2 ring-primary-500 shadow-premium"
        )}
      >
        {/* Thumbnail */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={story.thumbnailUrl || '/images/default-thumbnail.jpg'}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePlay}
              className="w-14 h-14 glass-strong rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              {isCurrentStory && isPlaying ? (
                <Pause className="w-6 h-6 text-white" fill="white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              )}
            </button>
          </div>

          {/* Category Badge */}
          {story.category && (
            <div className="absolute top-3 left-3 glass-strong px-3 py-1 rounded-full">
              <span className="text-xs font-semibold text-white flex items-center gap-1">
                <span>{story.category.icon}</span>
                <span className="hidden sm:inline">{story.category.name}</span>
              </span>
            </div>
          )}

          {/* Duration */}
          <div className="absolute bottom-3 right-3 glass-strong px-2 py-1 rounded-lg">
            <div className="flex items-center gap-1 text-xs text-white font-semibold">
              <Clock className="w-3 h-3" />
              {formatDuration(story.duration)}
            </div>
          </div>

          {/* Bookmark */}
          <button
            onClick={handleBookmark}
            className="absolute top-3 right-3 w-8 h-8 glass-strong rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Bookmark 
              className={cn(
                "w-4 h-4 transition-all",
                isBookmarked ? "fill-gold-500 text-gold-500" : "text-white"
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {story.title}
          </h3>
          
          {story.titleArabic && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-arabic line-clamp-1" dir="rtl">
              {story.titleArabic}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            {story.playCount > 0 && (
              <div className="flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                <span>{formatNumber(story.playCount)}</span>
              </div>
            )}
            {story.isFeatured && (
              <div className="flex items-center gap-1 text-gold-500">
                <Star className="w-3 h-3" fill="currentColor" />
                <span>Featured</span>
              </div>
            )}
          </div>
        </div>

        {/* Playing Indicator */}
        {isCurrentStory && isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary">
            <div className="h-full w-full bg-white/30 animate-pulse" />
          </div>
        )}
      </div>
    );
  }

  // Premium variant (default)
  return (
    <div 
      className={cn(
        "group relative glass rounded-3xl overflow-hidden hover-lift transition-all duration-400 cursor-pointer",
        isCurrentStory && "ring-2 ring-primary-500 shadow-premium"
      )}
      onClick={handlePlay}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={story.thumbnailUrl || '/images/default-thumbnail.jpg'}
          alt={story.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Floating Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handlePlay}
            className="w-20 h-20 glass-strong rounded-full flex items-center justify-center hover:scale-110 transition-transform pulse-glow"
          >
            {isCurrentStory && isPlaying ? (
              <Pause className="w-8 h-8 text-white" fill="white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            )}
          </button>
        </div>

        {/* Category Badge */}
        {story.category && (
          <div 
            className="absolute top-4 left-4 glass-strong px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${story.category.color}20` }}
          >
            <span className="text-sm font-semibold text-white flex items-center gap-1.5">
              <span className="text-base">{story.category.icon}</span>
              <span>{story.category.name}</span>
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {story.isFeatured && (
          <div className="absolute top-4 right-4 glass-strong px-3 py-1.5 rounded-full">
            <div className="flex items-center gap-1.5 text-gold-500">
              <Star className="w-4 h-4" fill="currentColor" />
              <span className="text-sm font-semibold text-white">Featured</span>
            </div>
          </div>
        )}

        {/* Duration & Stats */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="glass-strong px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5 text-sm text-white font-semibold">
              <Clock className="w-4 h-4" />
              {formatDuration(story.duration)}
            </div>
          </div>
          
          {story.playCount > 0 && (
            <div className="glass-strong px-3 py-1.5 rounded-lg">
              <div className="flex items-center gap-1.5 text-sm text-white font-semibold">
                <Headphones className="w-4 h-4" />
                {formatNumber(story.playCount)}
              </div>
            </div>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className="absolute top-4 right-4 w-10 h-10 glass-strong rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          style={{ display: story.isFeatured ? 'none' : 'flex' }}
        >
          <Bookmark 
            className={cn(
              "w-5 h-5 transition-all",
              isBookmarked ? "fill-gold-500 text-gold-500" : "text-white"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {story.title}
        </h3>
        
        {story.titleArabic && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-arabic line-clamp-1" dir="rtl">
            {story.titleArabic}
          </p>
        )}
        
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
          {story.description}
        </p>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {story.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="badge-premium text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {story.ageGroup && (
              <span className="glass-light px-2 py-1 rounded-lg font-medium">
                Age {story.ageGroup}
              </span>
            )}
            {story.language && (
              <span className="capitalize font-medium">
                {story.language}
              </span>
            )}
          </div>
          
          {story.narrator && (
            <span className="text-xs text-gray-500 dark:text-gray-400 italic">
              by {story.narrator}
            </span>
          )}
        </div>
      </div>

      {/* Playing Indicator with Animation */}
      {isCurrentStory && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-1 bg-gradient-primary">
            <div className="h-full bg-white/40 animate-shimmer" />
          </div>
          {/* Audio Wave Animation */}
          <div className="absolute -top-8 left-6 audio-wave">
            <span className="bg-white"></span>
            <span className="bg-white"></span>
            <span className="bg-white"></span>
            <span className="bg-white"></span>
          </div>
        </div>
      )}

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
      </div>
    </div>
  );
}
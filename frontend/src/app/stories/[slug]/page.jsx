'use client';

import { useQuery } from '@tanstack/react-query';
import { storiesAPI } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  Clock, 
  User, 
  BookOpen, 
  Heart,
  Share2,
  ArrowLeft,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import useAudioStore from '@/store/audioStore';
import { useState } from 'react';

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { loadStory, play, currentStory, isPlaying, togglePlayPause } = useAudioStore();
  const [imageError, setImageError] = useState(false);

  // Fetch story by slug
  const { data, isLoading, error } = useQuery({
    queryKey: ['story', params.slug],
    queryFn: async () => {
      const response = await storiesAPI.getBySlug(params.slug);
      return response.data;
    },
  });

  const story = data?.data;
  const isCurrentStory = currentStory?._id === story?._id;

  const handlePlayPause = () => {
    if (isCurrentStory) {
      togglePlayPause();
    } else {
      loadStory(story);
      setTimeout(() => {
        useAudioStore.getState().play();
      }, 100);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading story...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Story Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The story you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/stories" className="btn-premium inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const getThumbnailUrl = () => {
    if (imageError) {
      return 'https://placehold.co/800x800/10b981/white?text=Islamic+Stories';
    }
    const thumbnail = story.thumbnail || story.thumbnailUrl;
    if (!thumbnail || thumbnail === '' || thumbnail === 'null') {
      return 'https://placehold.co/800x800/10b981/white?text=Islamic+Stories';
    }
    return thumbnail.replace('http://', 'https://');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Left: Story Image */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl mb-6">
                <img
                  src={getThumbnailUrl()}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                
                {/* Play Overlay */}
                {isCurrentStory && isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="audio-wave scale-150">
                      <span className="bg-white"></span>
                      <span className="bg-white"></span>
                      <span className="bg-white"></span>
                      <span className="bg-white"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePlayPause}
                  className="flex-1 btn-premium text-lg py-4 flex items-center justify-center gap-2"
                >
                  {isCurrentStory && isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" fill="currentColor" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 ml-1" fill="currentColor" />
                      Play Now
                    </>
                  )}
                </button>
                
                <button className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:glass-strong transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                
                <button className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:glass-strong transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Story Details */}
          <div className="lg:col-span-3">
            
            {/* Category Badge */}
            {story.category && (
              <Link
                href={`/categories/${story.category.slug}`}
                className="inline-flex items-center gap-2 glass px-4 py-2 rounded-xl hover:glass-strong transition-all mb-4"
              >
                <span className="text-2xl">{story.category.icon}</span>
                <span className="font-semibold">{story.category.name}</span>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              {story.title}
            </h1>

            {/* Arabic Title */}
            {story.titleArabic && (
              <p className="text-2xl text-gray-600 dark:text-gray-400 font-arabic mb-6" dir="rtl">
                {story.titleArabic}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-8">
              {story.narrator && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <User className="w-5 h-5" />
                  <span>Narrated by <strong>{story.narrator}</strong></span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5" />
                <span><strong>{formatDuration(story.duration)}</strong></span>
              </div>

              {story.language && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span>Language: <strong className="capitalize">{story.language}</strong></span>
                </div>
              )}
            </div>

            {/* Description */}
            {story.description && (
              <div className="glass rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  About this Story
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {story.description}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {story.playCount || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Plays</div>
              </div>
              
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {story.ageGroup || 'All'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Age Group</div>
              </div>
              
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {story.isFeatured ? '⭐' : '📖'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {story.isFeatured ? 'Featured' : 'Story'}
                </div>
              </div>
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge-premium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/stories" className="hover:text-primary-600 transition-colors">Stories</Link>
          <ChevronRight className="w-4 h-4" />
          {story.category && (
            <>
              <Link 
                href={`/categories/${story.category.slug}`}
                className="hover:text-primary-600 transition-colors"
              >
                {story.category.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
            {story.title}
          </span>
        </div>
      </div>
    </div>
  );
}
// frontend/src/components/common/FavoriteButton.jsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { userAPI } from '@/services/api';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function FavoriteButton({ 
  storyId, 
  size = 'md',
  showLabel = false,
  className = '',
  onToggle = null 
}) {
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated && storyId) {
      checkFavoriteStatus();
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, storyId]);

  const checkFavoriteStatus = async () => {
    try {
      setChecking(true);
      const response = await userAPI.checkFavorite(storyId);
      setIsFavorite(response.data.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setChecking(false);
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      router.push('/login');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      
      if (isFavorite) {
        await userAPI.removeFromFavorites(storyId);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await userAPI.addToFavorites(storyId);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }

      if (onToggle) {
        onToggle(isFavorite);
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  if (checking) {
    return (
      <button
        disabled
        className={cn(
          sizeClasses[size],
          'glass-light rounded-xl flex items-center justify-center',
          className
        )}
      >
        <Loader2 className={cn(iconSizes[size], 'animate-spin text-gray-400')} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={cn(
        sizeClasses[size],
        'glass-light rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        isFavorite 
          ? 'text-red-500 hover:glass-strong' 
          : 'text-gray-600 dark:text-gray-400 hover:text-red-500 hover:glass-strong',
        showLabel && 'px-4 w-auto gap-2',
        className
      )}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? (
        <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
      ) : (
        <Heart 
          className={cn(
            iconSizes[size],
            isFavorite && 'fill-current',
            'transition-all'
          )} 
        />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isFavorite ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
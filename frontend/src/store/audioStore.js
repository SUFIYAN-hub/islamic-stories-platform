import { create } from 'zustand';
import { Howl } from 'howler';
import { storage } from '@/lib/utils';

const useAudioStore = create((set, get) => ({
  // State
  currentStory: null,
  sound: null,
  isPlaying: false,
  volume: storage.get('audio-volume') || 1,
  playbackRate: storage.get('playback-rate') || 1,
  currentTime: 0,
  duration: 0,
  isLoading: false,
  
  // Actions
  loadStory: (story) => {
    const { sound, currentStory } = get();
    
    // Save progress of previous story before switching
    if (currentStory && sound) {
      saveStoryProgress(currentStory._id, sound.seek(), sound.duration(), false);
      sound.unload();
    }
    
    // Create new Howl instance
    const newSound = new Howl({
      src: [story.audioUrl],
      html5: true,
      volume: get().volume,
      rate: get().playbackRate,
      onplay: () => {
        set({ isPlaying: true, isLoading: false });
        // Add to recently played
        addToRecentlyPlayed(story);
      },
      onpause: () => {
        set({ isPlaying: false });
        // Save progress when paused
        const { currentStory, currentTime, duration } = get();
        if (currentStory) {
          saveStoryProgress(currentStory._id, currentTime, duration, false);
        }
      },
      onstop: () => {
        set({ isPlaying: false, currentTime: 0 });
      },
      onend: () => {
        set({ isPlaying: false, currentTime: 0 });
        // Mark as completed
        const { currentStory } = get();
        if (currentStory) {
          saveStoryProgress(currentStory._id, 0, newSound.duration(), true);
        }
      },
      onload: () => {
        const dur = newSound.duration();
        set({ duration: dur });
        
        // Restore saved position
        const progress = getStoryProgress(story._id);
        if (progress && progress.position > 0 && !progress.completed) {
          // Don't resume if less than 5 seconds or more than 95% complete
          if (progress.position > 5 && progress.position < dur * 0.95) {
            newSound.seek(progress.position);
            set({ currentTime: progress.position });
          }
        }
      },
      onloaderror: (id, error) => {
        console.error('Audio load error:', error);
        set({ isLoading: false });
      },
    });
    
    set({ 
      currentStory: story, 
      sound: newSound, 
      isLoading: true,
      currentTime: 0,
    });
  },
  
  play: () => {
    const { sound } = get();
    if (sound) {
      sound.play();
    }
  },
  
  pause: () => {
    const { sound } = get();
    if (sound) {
      sound.pause();
    }
  },
  
  togglePlayPause: () => {
    const { isPlaying, play, pause } = get();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  },
  
  seek: (time) => {
    const { sound } = get();
    if (sound) {
      sound.seek(time);
      set({ currentTime: time });
    }
  },
  
  skip: (seconds) => {
    const { sound, currentTime } = get();
    if (sound) {
      const newTime = Math.max(0, Math.min(currentTime + seconds, sound.duration()));
      sound.seek(newTime);
      set({ currentTime: newTime });
    }
  },
  
  setVolume: (volume) => {
    const { sound } = get();
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (sound) {
      sound.volume(clampedVolume);
    }
    storage.set('audio-volume', clampedVolume);
    set({ volume: clampedVolume });
  },
  
  setPlaybackRate: (rate) => {
    const { sound } = get();
    if (sound) {
      sound.rate(rate);
    }
    storage.set('playback-rate', rate);
    set({ playbackRate: rate });
  },
  
  updateCurrentTime: () => {
    const { sound, currentStory } = get();
    if (sound && sound.playing()) {
      const time = sound.seek();
      set({ currentTime: time });
      
      // Auto-save progress every 10 seconds
      if (currentStory && Math.floor(time) % 10 === 0) {
        saveStoryProgress(currentStory._id, time, sound.duration(), false);
      }
    }
  },
  
  cleanup: () => {
    const { sound, currentStory, currentTime, duration } = get();
    
    // Save progress before cleanup
    if (currentStory && sound) {
      saveStoryProgress(currentStory._id, currentTime, duration, false);
      sound.unload();
    }
    
    set({ 
      sound: null, 
      currentStory: null,
      isPlaying: false, 
      currentTime: 0,
      duration: 0,
    });
  },
}));

// Helper Functions for Progress Tracking

// Save story progress
function saveStoryProgress(storyId, position, duration, completed) {
  const progress = {
    storyId,
    position: Math.floor(position),
    duration: Math.floor(duration),
    percentage: duration > 0 ? Math.floor((position / duration) * 100) : 0,
    completed,
    lastPlayed: new Date().toISOString(),
  };
  
  storage.set(`story-progress-${storyId}`, progress);
}

// Get story progress
function getStoryProgress(storyId) {
  return storage.get(`story-progress-${storyId}`);
}

// Add to recently played list
function addToRecentlyPlayed(story) {
  let recentlyPlayed = storage.get('recently-played') || [];
  
  // Remove if already exists
  recentlyPlayed = recentlyPlayed.filter(s => s._id !== story._id);
  
  // Add to beginning with timestamp
  recentlyPlayed.unshift({
    ...story,
    playedAt: new Date().toISOString()
  });
  
  // Keep only last 20
  recentlyPlayed = recentlyPlayed.slice(0, 20);
  
  storage.set('recently-played', recentlyPlayed);
}

// Public helper functions for components
export function getRecentlyPlayed() {
  return storage.get('recently-played') || [];
}

export function getContinueListening() {
  const recentlyPlayed = getRecentlyPlayed();
  
  // Filter stories with progress that aren't completed
  return recentlyPlayed
    .map(story => {
      const progress = getStoryProgress(story._id);
      return progress ? { ...story, progress } : null;
    })
    .filter(story => 
      story && 
      story.progress && 
      !story.progress.completed && 
      story.progress.percentage > 5 && 
      story.progress.percentage < 95
    )
    .slice(0, 10);
}

export function clearStoryProgress(storyId) {
  storage.remove(`story-progress-${storyId}`);
}

export function clearAllProgress() {
  storage.remove('recently-played');
  // Clear individual progress items
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('story-progress-')) {
      storage.remove(key);
    }
  });
}

// Update current time every second
if (typeof window !== 'undefined') {
  setInterval(() => {
    useAudioStore.getState().updateCurrentTime();
  }, 1000);
}

export default useAudioStore;
// frontend/src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind + clsx merge helper
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Duration formatting helper
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Number formatting helper
export function formatNumber(number) {
  if (number == null || isNaN(number)) return "0";
  return number.toLocaleString();
}

// Storage helper for localStorage
export const storage = {
  get(key) {
    if (typeof window !== "undefined") {
      try {
        const value = localStorage.getItem(key);
        if (!value) return null;
        
        // Try to parse as JSON, if it fails return as string
        try {
          return JSON.parse(value);
        } catch {
          return value; // Return as plain string if not JSON
        }
      } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return null;
      }
    }
    return null;
  },
  set(key, value) {
    if (typeof window !== "undefined") {
      try {
        // If value is string, store directly. Otherwise stringify
        const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, valueToStore);
      } catch (error) {
        console.error(`Error setting ${key}:`, error);
      }
    }
  },
  remove(key) {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing ${key}:`, error);
      }
    }
  },
};

// Format time ago
export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

// Format date
export const formatDate = (date, format = 'full') => {
  if (!date) return '';
  
  const d = new Date(date);
  const options = {
    full: { year: 'numeric', month: 'long', day: 'numeric' },
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    compact: { month: 'short', day: 'numeric' },
  };
  
  return d.toLocaleDateString('en-US', options[format] || options.full);
};

// Format listening time
export const formatListeningTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminAPI } from '@/services/api';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditStoryPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState(null);

  useEffect(() => {
    fetchStory();
  }, [params.id]);

  const fetchStory = async () => {
    try {
      const response = await adminAPI.getStory(params.id);
      setStory(response.data.data);
    } catch (error) {
      toast.error('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Story</h1>
      {/* Add your edit form here */}
      <p>Story: {story?.title}</p>
      <button 
        onClick={() => router.push('/admin/stories')}
        className="btn-glass"
      >
        Back to Stories
      </button>
    </div>
  );
}
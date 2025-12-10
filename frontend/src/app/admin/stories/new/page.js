// frontend/src/app/admin/stories/new/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, Music, Image as ImageIcon, Loader2, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

export default function NewStoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    titleArabic: '',
    description: '',
    category: '',
    audioUrl: '',
    thumbnailUrl: '',
    duration: 0,
    language: 'hindi',
    narrator: '',
    source: '',
    ageGroup: 'all',
    tags: '',
    isFeatured: false,
    isActive: true
  });

  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioDragActive, setAudioDragActive] = useState(false);
  const [imageDragActive, setImageDragActive] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchCategories(token);
  }, [router]);

  const fetchCategories = async (token) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Audio file upload
  const handleAudioDrop = (e) => {
    e.preventDefault();
    setAudioDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      handleAudioUpload(file);
    } else {
      toast.error('Please upload an audio file');
    }
  };

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleAudioUpload(file);
    }
  };

  const handleAudioUpload = async (file) => {
    setAudioFile(file);
    setAudioUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append('audio', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/upload/audio`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Get audio duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.addEventListener('loadedmetadata', () => {
        setFormData(prev => ({
          ...prev,
          audioUrl: res.data.data.url,
          duration: Math.round(audio.duration)
        }));
      });

      toast.success('Audio uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload audio');
      setAudioFile(null);
    } finally {
      setAudioUploading(false);
    }
  };

  // Image file upload
  const handleImageDrop = (e) => {
    e.preventDefault();
    setImageDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      toast.error('Please upload an image file');
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    setImageFile(file);
    setImageUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append('thumbnail', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/upload/thumbnail`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        thumbnailUrl: res.data.data.url
      }));

      toast.success('Thumbnail uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload thumbnail');
      setImageFile(null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.audioUrl) {
      toast.error('Please upload an audio file');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const submitData = {
        ...formData,
        tags: tagsArray
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stories`,
        submitData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Story created successfully!');
      router.push('/admin/stories');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Story</h1>
              <p className="text-sm text-gray-500">Upload audio and fill in story details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Audio Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Audio File *</h2>
            
            <div
              onDrop={handleAudioDrop}
              onDragOver={(e) => { e.preventDefault(); setAudioDragActive(true); }}
              onDragLeave={() => setAudioDragActive(false)}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                audioDragActive 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {audioUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                  <p className="text-sm text-gray-600">Uploading audio...</p>
                </div>
              ) : audioFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Music className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{audioFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB • {formData.duration}s
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioFile(null);
                      setFormData(prev => ({ ...prev, audioUrl: '', duration: 0 }));
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium mb-2">
                    Drop your audio file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports MP3, WAV, M4A (Max 50MB)
                  </p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Thumbnail (Optional)</h2>
            
            <div
              onDrop={handleImageDrop}
              onDragOver={(e) => { e.preventDefault(); setImageDragActive(true); }}
              onDragLeave={() => setImageDragActive(false)}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                imageDragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {imageUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                  <p className="text-sm text-gray-600">Uploading image...</p>
                </div>
              ) : imageFile ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <p className="font-medium text-gray-900">{imageFile.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setFormData(prev => ({ ...prev, thumbnailUrl: '' }));
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium mb-2">
                    Drop your thumbnail image here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    PNG, JPG (Recommended: 400x300px)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Story Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Story Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Hindi) *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Hazrat Nuh aur Kashti ki Kahani"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Title Arabic */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Arabic)
                </label>
                <input
                  type="text"
                  name="titleArabic"
                  value={formData.titleArabic}
                  onChange={handleChange}
                  placeholder="حضرت نوح والسفينة"
                  dir="rtl"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-arabic"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Brief description of the story..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language *
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="hindi">Hindi</option>
                  <option value="urdu">Urdu</option>
                  <option value="english">English</option>
                  <option value="arabic">Arabic</option>
                </select>
              </div>

              {/* Narrator */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Narrator
                </label>
                <input
                  type="text"
                  name="narrator"
                  value={formData.narrator}
                  onChange={handleChange}
                  placeholder="Maulana Ahmed"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Age Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group
                </label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Ages</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-8">6-8 years</option>
                  <option value="9-12">9-12 years</option>
                  <option value="13+">13+ years</option>
                </select>
              </div>

              {/* Source */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Reference
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="Quran - Surah Nuh, Sahih Bukhari, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="prophet, patience, faith, flood"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="md:col-span-2 flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Featured Story</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Active (visible to users)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !formData.audioUrl}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Story...
                </>
              ) : (
                'Create Story'
              )}
            </button>

            <Link
              href="/admin/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
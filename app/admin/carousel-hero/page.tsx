'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Plus, GripVertical, Save, AlertCircle, Eye } from 'lucide-react';

interface Slide {
  url: string;
  publicId?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageLink?: string;
  order: number;
}

interface CarouselSettings {
  slides: Slide[];
  autoPlayInterval: number;
  isActive: boolean;
  carouselHeight?: number;
}

export default function CarouselHeroPage() {
  const [settings, setSettings] = useState<CarouselSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/carousel-hero');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      setError('Failed to load carousel settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/carousel-hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSuccess('Carousel settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save settings');
      }
    } catch (err) {
      setError('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSlideImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && settings) {
      setError('');
      setUploading(true);
      
      // Upload to Cloudinary via backend API
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          const newSlides = [...settings.slides];
          newSlides[index].url = data.secure_url;
          newSlides[index].publicId = data.public_id;
          setSettings({ ...settings, slides: newSlides });
          setSuccess('Image uploaded successfully!');
          setTimeout(() => setSuccess(''), 2000);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to upload image');
        }
      } catch (err) {
        setError('Error uploading image');
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddSlide = () => {
    if (settings) {
      setSettings({
        ...settings,
        slides: [
          ...settings.slides,
          {
            url: '',
            title: 'New Slide',
            subtitle: 'Add your subtitle',
            ctaText: 'Learn More',
            ctaLink: '/products',
            imageLink: '/products',
            order: settings.slides.length,
          },
        ],
      });
    }
  };

  const handleRemoveSlide = (index: number) => {
    if (settings) {
      setSettings({
        ...settings,
        slides: settings.slides.filter((_, i) => i !== index),
      });
    }
  };

  const handleUpdateSlide = (index: number, field: string, value: string) => {
    if (settings) {
      const newSlides = [...settings.slides];
      newSlides[index] = { ...newSlides[index], [field]: value };
      setSettings({ ...settings, slides: newSlides });
    }
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    if (!settings) return;
    const newSlides = [...settings.slides];
    if (direction === 'up' && index > 0) {
      [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
    } else if (direction === 'down' && index < newSlides.length - 1) {
      [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
    }
    setSettings({ ...settings, slides: newSlides });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-white font-bold uppercase tracking-wider text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Carousel Hero Settings</h1>
        <p className="text-gray-400">Manage rotating carousel slides on the landing page</p>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400"
        >
          <AlertCircle size={20} />
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400"
        >
          ✓ {success}
        </motion.div>
      )}

      {/* Settings */}
      <div className="bg-jet-900 border border-jet-800 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Auto-Play Interval (ms)
          </label>
          <input
            type="number"
            value={settings.autoPlayInterval}
            onChange={(e) =>
              setSettings({
                ...settings,
                autoPlayInterval: parseInt(e.target.value) || 4000,
              })
            }
            className="w-full px-4 py-2 bg-jet-800 border border-jet-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={settings.isActive}
            onChange={(e) =>
              setSettings({ ...settings, isActive: e.target.checked })
            }
            className="w-4 h-4 rounded border-jet-700 text-primary-500 focus:ring-primary-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
            Enable Carousel
          </label>
        </div>
      </div>

      {/* Preview */}
      {settings.slides.length > 0 && (
        <div className="bg-jet-900 border border-jet-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Eye size={20} />
            Preview (50% Screen Height)
          </h2>
          <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
            <img
              src={settings.slides[previewIndex].url}
              alt={settings.slides[previewIndex].title}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center">
              <div className="text-white p-6">
                <h3 className="text-2xl font-bold mb-2">{settings.slides[previewIndex].title}</h3>
                <p className="text-gray-200 mb-4">{settings.slides[previewIndex].subtitle}</p>
                <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-colors">
                  {settings.slides[previewIndex].ctaText}
                </button>
              </div>
            </div>
          </div>
          {settings.slides.length > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {settings.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPreviewIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === previewIndex
                      ? 'bg-primary-500 w-8'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Slides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Slides ({settings.slides.length})</h2>
          <button
            onClick={handleAddSlide}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
          >
            <Plus size={18} />
            Add Slide
          </button>
        </div>

        {settings.slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-jet-900 border border-jet-800 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Slide {index + 1}</h3>
              <div className="flex items-center gap-2">
                {index > 0 && (
                  <button
                    onClick={() => handleMoveSlide(index, 'up')}
                    className="p-2 hover:bg-jet-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    ↑
                  </button>
                )}
                {index < settings.slides.length - 1 && (
                  <button
                    onClick={() => handleMoveSlide(index, 'down')}
                    className="p-2 hover:bg-jet-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    ↓
                  </button>
                )}
                <button
                  onClick={() => handleRemoveSlide(index)}
                  className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slide Image
              </label>
              {slide.url && (
                <div className="mb-3 relative w-full h-32 bg-black rounded-lg overflow-hidden">
                  <img
                    src={slide.url}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-jet-800 hover:bg-jet-700 border border-jet-700 rounded-lg cursor-pointer text-gray-300 hover:text-white transition-colors disabled:opacity-50">
                <Upload size={18} />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSlideImageChange(index, e)}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">Images are stored on Cloudinary CDN</p>
            </div>

            {/* Text Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => handleUpdateSlide(index, 'title', e.target.value)}
                  className="w-full px-4 py-2 bg-jet-800 border border-jet-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={slide.subtitle}
                  onChange={(e) => handleUpdateSlide(index, 'subtitle', e.target.value)}
                  className="w-full px-4 py-2 bg-jet-800 border border-jet-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={slide.ctaText}
                  onChange={(e) => handleUpdateSlide(index, 'ctaText', e.target.value)}
                  className="w-full px-4 py-2 bg-jet-800 border border-jet-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CTA Link
                </label>
                <input
                  type="text"
                  value={slide.ctaLink}
                  onChange={(e) => handleUpdateSlide(index, 'ctaLink', e.target.value)}
                  className="w-full px-4 py-2 bg-jet-800 border border-jet-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image Click Link
                </label>
                <input
                  type="text"
                  value={slide.imageLink || ''}
                  onChange={(e) => handleUpdateSlide(index, 'imageLink', e.target.value)}
                  placeholder="/products or /products/[slug]"
                  className="w-full px-4 py-2 bg-jet-800 border border-jet-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">Route to navigate when image is clicked</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

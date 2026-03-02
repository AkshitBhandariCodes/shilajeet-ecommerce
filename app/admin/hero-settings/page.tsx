'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Plus, GripVertical, Save, AlertCircle } from 'lucide-react';

interface ForegroundImage {
  url: string;
  publicId?: string;
  title: string;
  subtitle: string;
  order: number;
}

interface HeroSettings {
  backgroundImage: {
    url: string;
    publicId?: string;
  };
  foregroundImages: ForegroundImage[];
  autoPlayInterval: number;
  isActive: boolean;
}

export default function HeroSettingsPage() {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/hero-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      setError('Failed to load hero settings');
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
      const response = await fetch('/api/admin/hero-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSuccess('Hero settings saved successfully!');
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

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && settings) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings({
          ...settings,
          backgroundImage: {
            url: event.target?.result as string,
            publicId: file.name,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleForegroundImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && settings) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImages = [...settings.foregroundImages];
        newImages[index].url = event.target?.result as string;
        newImages[index].publicId = file.name;
        setSettings({ ...settings, foregroundImages: newImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddForegroundImage = () => {
    if (settings) {
      setSettings({
        ...settings,
        foregroundImages: [
          ...settings.foregroundImages,
          {
            url: '',
            title: 'New Product',
            subtitle: '',
            order: settings.foregroundImages.length,
          },
        ],
      });
    }
  };

  const handleRemoveForegroundImage = (index: number) => {
    if (settings) {
      setSettings({
        ...settings,
        foregroundImages: settings.foregroundImages.filter((_, i) => i !== index),
      });
    }
  };

  const handleUpdateForegroundImage = (index: number, field: string, value: string) => {
    if (settings) {
      const newImages = [...settings.foregroundImages];
      newImages[index] = { ...newImages[index], [field]: value };
      setSettings({ ...settings, foregroundImages: newImages });
    }
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
        <h1 className="text-3xl font-bold text-white uppercase tracking-wider mb-2">Hero Section Settings</h1>
        <p className="text-gray-400">Manage background and foreground images for the hero section</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 p-4 rounded flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/50 p-4 rounded"
        >
          <p className="text-green-400">{success}</p>
        </motion.div>
      )}

      {/* Background Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg"
      >
        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Background Image</h2>
        
        <div className="space-y-4">
          {/* Current Background Preview */}
          {settings.backgroundImage.url && (
            <div className="relative w-full h-48 bg-black/50 rounded border border-white/10 overflow-hidden">
              <img
                src={settings.backgroundImage.url}
                alt="Background"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Upload Button */}
          <label className="flex items-center justify-center gap-2 bg-primary-400/20 border border-primary-400/50 p-4 rounded cursor-pointer hover:bg-primary-400/30 transition-colors">
            <Upload className="w-5 h-5 text-primary-400" />
            <span className="text-primary-400 font-medium">Upload Background Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageChange}
              className="hidden"
            />
          </label>
        </div>
      </motion.div>

      {/* Foreground Images Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Foreground Images</h2>
          <button
            onClick={handleAddForegroundImage}
            className="flex items-center gap-2 bg-primary-400 text-black px-4 py-2 rounded font-bold hover:bg-primary-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>
        </div>

        <div className="space-y-4">
          {settings.foregroundImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 border border-white/10 p-4 rounded"
            >
              <div className="flex items-start gap-4">
                {/* Drag Handle */}
                <div className="text-gray-400 mt-2">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Image Preview and Upload */}
                <div className="flex-1 space-y-3">
                  {/* Preview */}
                  {image.url && (
                    <div className="relative w-full h-32 bg-black/50 rounded border border-white/10 overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Upload Button */}
                  <label className="flex items-center justify-center gap-2 bg-primary-400/20 border border-primary-400/50 p-3 rounded cursor-pointer hover:bg-primary-400/30 transition-colors text-sm">
                    <Upload className="w-4 h-4 text-primary-400" />
                    <span className="text-primary-400 font-medium">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleForegroundImageChange(index, e)}
                      className="hidden"
                    />
                  </label>

                  {/* Title Input */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Title</label>
                    <input
                      type="text"
                      value={image.title}
                      onChange={(e) => handleUpdateForegroundImage(index, 'title', e.target.value)}
                      className="w-full bg-black border border-white/20 text-white px-3 py-2 rounded focus:border-primary-400 outline-none transition-colors"
                      placeholder="Product title"
                    />
                  </div>

                  {/* Subtitle Input */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={image.subtitle}
                      onChange={(e) => handleUpdateForegroundImage(index, 'subtitle', e.target.value)}
                      className="w-full bg-black border border-white/20 text-white px-3 py-2 rounded focus:border-primary-400 outline-none transition-colors"
                      placeholder="Product subtitle"
                    />
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleRemoveForegroundImage(index)}
                  className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg"
      >
        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Settings</h2>

        <div className="space-y-4">
          {/* Auto Play Interval */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Auto Play Interval (ms)</label>
            <input
              type="number"
              value={settings.autoPlayInterval}
              onChange={(e) => setSettings({ ...settings, autoPlayInterval: parseInt(e.target.value) })}
              className="w-full bg-black border border-white/20 text-white px-4 py-2 rounded focus:border-primary-400 outline-none transition-colors"
              min="1000"
              step="500"
            />
            <p className="text-gray-500 text-xs mt-1">Time between image transitions in milliseconds</p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.isActive}
              onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
              className="w-4 h-4 cursor-pointer"
            />
            <label className="text-gray-400 cursor-pointer">Hero section is active</label>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-primary-400 text-black font-bold py-3 px-6 rounded uppercase tracking-wider hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Changes'}
      </motion.button>
    </div>
  );
}

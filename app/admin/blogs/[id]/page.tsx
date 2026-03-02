'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Upload, ArrowLeft } from 'lucide-react';

interface BlogData {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: number;
  published: boolean;
  tags: string[];
  featuredImage?: {
    url: string;
    publicId?: string;
  };
  metaDescription: string;
  metaKeywords: string;
}

const categories = ['Health', 'Wellness', 'Fitness', 'Nutrition', 'Lifestyle', 'Science'];

export default function BlogEditorPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [blog, setBlog] = useState<BlogData>({
    title: '',
    excerpt: '',
    content: '',
    category: 'Wellness',
    author: 'Agnishila Team',
    readTime: 5,
    published: false,
    tags: [],
    metaDescription: '',
    metaKeywords: '',
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchBlog();
    }
  }, [isNew]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = isNew ? '/api/admin/blogs' : `/api/admin/blogs/${blog._id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      });

      if (response.ok) {
        const data = await response.json();
        router.push('/admin/blogs');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBlog({
          ...blog,
          featuredImage: {
            url: event.target?.result as string,
            publicId: file.name,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !blog.tags.includes(tagInput.trim())) {
      setBlog({
        ...blog,
        tags: [...blog.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setBlog({
      ...blog,
      tags: blog.tags.filter(t => t !== tag),
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
            {isNew ? 'Create Blog' : 'Edit Blog'}
          </h1>
          <p className="text-gray-400">Write and manage your blog content</p>
        </div>
      </div>

      {/* Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Title */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg">
          <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors text-lg font-bold"
            placeholder="Enter blog title"
          />
        </div>

        {/* Featured Image */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg">
          <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Featured Image</label>
          {blog.featuredImage?.url && (
            <div className="mb-4 relative w-full h-48 bg-black/50 rounded border border-white/10 overflow-hidden">
              <img
                src={blog.featuredImage.url}
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <label className="flex items-center justify-center gap-2 bg-primary-400/20 border border-primary-400/50 p-4 rounded cursor-pointer hover:bg-primary-400/30 transition-colors">
            <Upload className="w-5 h-5 text-primary-400" />
            <span className="text-primary-400 font-medium">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Excerpt */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg">
          <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Excerpt</label>
          <textarea
            value={blog.excerpt}
            onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
            placeholder="Brief summary of the blog post"
            rows={3}
          />
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg">
          <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Content</label>
          <textarea
            value={blog.content}
            onChange={(e) => setBlog({ ...blog, content: e.target.value })}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors font-mono text-sm"
            placeholder="Write your blog content here..."
            rows={15}
          />
          <p className="text-xs text-gray-500 mt-2">Supports Markdown formatting</p>
        </div>

        {/* Metadata */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category */}
          <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg">
            <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Category</label>
            <select
              value={blog.category}
              onChange={(e) => setBlog({ ...blog, category: e.target.value })}
              className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg">
            <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Author</label>
            <input
              type="text"
              value={blog.author}
              onChange={(e) => setBlog({ ...blog, author: e.target.value })}
              className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="Author name"
            />
          </div>

          {/* Read Time */}
          <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg">
            <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Read Time (minutes)</label>
            <input
              type="number"
              value={blog.readTime}
              onChange={(e) => setBlog({ ...blog, readTime: parseInt(e.target.value) || 5 })}
              className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
              min="1"
            />
          </div>

          {/* Meta Description */}
          <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg">
            <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Meta Description</label>
            <input
              type="text"
              value={blog.metaDescription}
              onChange={(e) => setBlog({ ...blog, metaDescription: e.target.value })}
              className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="SEO meta description"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">{blog.metaDescription.length}/160</p>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg">
          <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Tags</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1 bg-black border border-white/20 text-white px-4 py-2 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="Add tag and press Enter"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-primary-400 text-black rounded font-bold hover:bg-primary-500 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map(tag => (
              <div
                key={tag}
                className="flex items-center gap-2 bg-primary-400/20 text-primary-400 px-3 py-1 rounded text-sm"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-primary-400 hover:text-primary-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Status */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={blog.published}
              onChange={(e) => setBlog({ ...blog, published: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-white font-bold uppercase tracking-wider">Publish this blog</span>
          </label>
          <p className="text-gray-400 text-sm mt-2">
            {blog.published ? 'This blog is visible to the public' : 'This blog is saved as a draft'}
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || !blog.title || !blog.excerpt || !blog.content}
          className="w-full bg-primary-400 text-black font-bold py-3 px-6 rounded uppercase tracking-wider hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Blog'}
        </button>
      </motion.div>
    </div>
  );
}

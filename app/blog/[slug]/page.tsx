'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, Eye, ArrowLeft, Share2 } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  category: string;
  author: string;
  readTime: number;
  views: number;
  featuredImage?: {
    url: string;
  };
  tags: string[];
  createdAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [params.slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${params.slug}`);
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{paragraph.slice(2)}</h1>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">{paragraph.slice(3)}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold text-white mt-4 mb-2">{paragraph.slice(4)}</h3>;
      }
      if (paragraph.startsWith('- ')) {
        return <li key={index} className="text-gray-300 ml-6 mb-2">{paragraph.slice(2)}</li>;
      }
      return <p key={index} className="text-gray-300 mb-4 leading-relaxed">{paragraph}</p>;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-white font-bold uppercase tracking-wider text-sm">Loading blog...</div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Blog not found</p>
          <Link href="/blog" className="text-primary-400 hover:text-primary-300 font-bold">
            Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-jet-900 to-jet-800 border-b border-white/20 py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-6 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blogs
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary-400 text-black text-xs font-bold rounded">
                {blog.category}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              {blog.title}
            </h1>
            <p className="text-gray-400 text-lg">{blog.excerpt}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-gray-400">
                <User className="w-4 h-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span>{blog.readTime} min read</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{blog.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Featured Image */}
      {blog.featuredImage?.url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full h-96 bg-black/50 overflow-hidden"
        >
          <img
            src={blog.featuredImage.url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none">
            {renderContent(blog.content)}
          </div>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?search=${tag}`}
                    className="px-3 py-1 bg-primary-400/20 text-primary-400 text-sm rounded hover:bg-primary-400/30 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Share</h3>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/blog/${blog.slug}`;
                  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${blog.title}`, '_blank');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-400/20 text-primary-400 rounded hover:bg-primary-400/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share on Twitter
              </button>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/blog/${blog.slug}`;
                  navigator.clipboard.writeText(url);
                  alert('Link copied to clipboard!');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-400/20 text-primary-400 rounded hover:bg-primary-400/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

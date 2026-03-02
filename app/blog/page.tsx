'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Calendar, User, Eye } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  author: string;
  readTime: number;
  views: number;
  featuredImage?: {
    url: string;
  };
  createdAt: string;
}

const categories = ['All', 'Health', 'Wellness', 'Fitness', 'Nutrition', 'Lifestyle', 'Science'];

export default function BlogPage() {
  const [blogs, setBlog] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchBlogs();
  }, [page, category]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/blogs', window.location.origin);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', '9');
      if (category !== 'All') {
        url.searchParams.set('category', category);
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setBlog(data.blogs);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-jet-950 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-wider"
          >
            Agnishila Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Discover insights, tips, and stories about health, wellness, and high-performance living
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 space-y-6"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-jet-900 border border-white/20 text-white rounded-lg focus:border-primary-400 outline-none transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${
                    category === cat
                      ? 'bg-primary-400 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
                </div>
                <div className="text-white font-bold uppercase tracking-wider text-sm">Loading blogs...</div>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-400 text-lg">No blogs found</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/blog/${blog.slug}`}>
                      <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg overflow-hidden hover:border-primary-400/50 transition-all duration-300 h-full flex flex-col">
                        {/* Featured Image */}
                        {blog.featuredImage?.url && (
                          <div className="relative h-48 overflow-hidden bg-black/50">
                            <img
                              src={blog.featuredImage.url}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-primary-400 text-black text-xs font-bold rounded">
                                {blog.category}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                            {blog.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                            {blog.excerpt}
                          </p>

                          {/* Meta */}
                          <div className="space-y-3 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3" />
                                {blog.author}
                              </div>
                              <span>{blog.readTime} min read</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {formatDate(blog.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {blog.views}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {total > 9 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-6 py-2 bg-primary-400/20 text-primary-400 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-400/30 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">
                    Page {page} of {Math.ceil(total / 9)}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page * 9 >= total}
                    className="px-6 py-2 bg-primary-400/20 text-primary-400 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-400/30 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

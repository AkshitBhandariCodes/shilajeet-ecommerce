'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Trash2, Edit2, Eye, EyeOff, Search } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  published: boolean;
  views: number;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, [page, filter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const published = filter === 'published' ? 'true' : filter === 'draft' ? 'false' : null;
      const url = new URL('/api/admin/blogs', window.location.origin);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', '10');
      if (published !== null) {
        url.searchParams.set('published', published);
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog._id !== id));
        setTotal(total - 1);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      const response = await fetch(`/api/admin/blogs/${blog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...blog, published: !blog.published }),
      });

      if (response.ok) {
        setBlogs(blogs.map(b => b._id === blog._id ? { ...b, published: !b.published } : b));
      }
    } catch (error) {
      console.error('Error updating blog:', error);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider mb-2">Blog Management</h1>
          <p className="text-gray-400">Create, edit, and manage blog posts</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 bg-primary-400 text-black px-6 py-3 rounded font-bold hover:bg-primary-500 transition-colors w-fit"
        >
          <Plus className="w-5 h-5" />
          New Blog
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black border border-white/20 text-white rounded focus:border-primary-400 outline-none transition-colors"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-black border border-white/20 text-white rounded focus:border-primary-400 outline-none transition-colors"
        >
          <option value="all">All Blogs</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* Blogs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
              </div>
              <div className="text-white font-bold uppercase tracking-wider text-sm">Loading...</div>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-gray-400 mb-4">No blogs found</p>
              <Link
                href="/admin/blogs/new"
                className="text-primary-400 hover:text-primary-300 font-bold"
              >
                Create your first blog
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-black/50">
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, index) => (
                  <motion.tr
                    key={blog._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white truncate max-w-xs">{blog.title}</div>
                      <div className="text-xs text-gray-400 truncate">{blog.excerpt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs font-bold rounded">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{blog.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{blog.views}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-colors ${
                          blog.published
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        }`}
                      >
                        {blog.published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{formatDate(blog.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blogs/${blog._id}`}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deleting === blog._id}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {!loading && blogs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} blogs
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-primary-400/20 text-primary-400 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-400/30 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * 10 >= total}
              className="px-4 py-2 bg-primary-400/20 text-primary-400 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-400/30 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

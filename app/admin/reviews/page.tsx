'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';

interface Review {
  _id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  helpful: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    setFilteredReviews(filtered);
  };

  const updateReviewStatus = async (reviewId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, status: newStatus })
      });
      
      if (response.ok) {
        setReviews(reviews.map(review => 
          review._id === reviewId ? { ...review, status: newStatus } : review
        ));
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`/api/admin/reviews?reviewId=${reviewId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setReviews(reviews.filter(review => review._id !== reviewId));
        }
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'rejected':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-primary-400 text-primary-400' : 'text-gray-600'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-white font-bold uppercase tracking-wider text-sm">Loading Reviews...</div>
        </div>
      </div>
    );
  }

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0'
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1">Reviews Management</h1>
          <p className="text-gray-400 text-sm">Manage customer reviews and ratings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-8 h-8 text-primary-400" />
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Total Reviews</div>
        </div>

        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{stats.avgRating}</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Avg Rating</div>
        </div>

        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{stats.approved}</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Approved</div>
        </div>

        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{stats.pending}</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Pending</div>
        </div>

        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-400" />
            <span className="text-2xl font-bold text-white">{stats.rejected}</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/20 text-white pl-10 pr-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all text-sm placeholder:text-gray-500 rounded"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">No Reviews Found</h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'all' || ratingFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Reviews will appear here once customers start reviewing products'}
            </p>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg hover:border-primary-400/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Left: Customer & Product Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-bold">{review.customerName}</h3>
                      <p className="text-gray-400 text-xs">{review.customerEmail}</p>
                      <p className="text-primary-400 text-sm mt-1">{review.productName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {renderStars(review.rating)}
                    <span className="text-gray-400 text-xs">{formatDate(review.createdAt)}</span>
                  </div>

                  <p className="text-gray-300 text-sm mb-3">{review.comment}</p>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <ThumbsUp size={14} />
                    <span>{review.helpful} found this helpful</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex md:flex-col gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReviewStatus(review._id, 'approved')}
                        className="px-3 py-2 bg-green-400/20 hover:bg-green-400/30 text-green-400 font-bold text-xs uppercase tracking-wider transition-all rounded flex items-center gap-1"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() => updateReviewStatus(review._id, 'rejected')}
                        className="px-3 py-2 bg-red-400/20 hover:bg-red-400/30 text-red-400 font-bold text-xs uppercase tracking-wider transition-all rounded flex items-center gap-1"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteReview(review._id)}
                    className="px-3 py-2 bg-gray-400/20 hover:bg-gray-400/30 text-gray-400 font-bold text-xs uppercase tracking-wider transition-all rounded flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

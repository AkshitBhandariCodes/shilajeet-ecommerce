'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Check, X, Calendar, Tag, Percent, DollarSign } from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  maxUses?: number;
  field?: string;
  expiryDate?: string;
  active: boolean;
  createdAt: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: '',
    maxUses: '',
    field: '',
    expiryDate: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (err) {
      setError('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        discountValue: parseFloat(formData.discountValue.toString()),
        minOrderAmount: parseFloat(formData.minOrderAmount.toString()),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
      };

      const url = editingId ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to save coupon');
        return;
      }

      setSuccess(editingId ? 'Coupon updated successfully' : 'Coupon created successfully');
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderAmount: 0,
        maxDiscount: '',
        maxUses: '',
        field: '',
        expiryDate: '',
      });
      setEditingId(null);
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Coupon deleted successfully');
        fetchCoupons();
      } else {
        setError('Failed to delete coupon');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount?.toString() || '',
      maxUses: coupon.maxUses?.toString() || '',
      field: coupon.field || '',
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
    });
    setEditingId(coupon._id);
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white uppercase tracking-wider">Coupon Management</h1>
          <p className="text-gray-400 mt-2">Create and manage discount coupons</p>
        </div>
        <motion.button
          onClick={() => {
            setEditingId(null);
            setFormData({
              code: '',
              description: '',
              discountType: 'percentage',
              discountValue: 0,
              minOrderAmount: 0,
              maxDiscount: '',
              maxUses: '',
              field: '',
              expiryDate: '',
            });
            setShowForm(!showForm);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-400 text-black px-6 py-3 font-bold flex items-center space-x-2 hover:bg-primary-500 transition-colors"
        >
          <Plus size={20} />
          <span>New Coupon</span>
        </motion.button>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600/20 border border-red-600/30 p-4 text-red-400"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-600/20 border border-green-600/30 p-4 text-green-400"
        >
          {success}
        </motion.div>
      )}

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-jet-900 border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">
            {editingId ? 'Edit Coupon' : 'Create New Coupon'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Code */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SAVE20"
                  disabled={!!editingId}
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary-400 transition-colors disabled:opacity-50"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., 20% off on all products"
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                  Discount Type
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary-400 transition-colors"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                  Discount Value
                </label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                  placeholder={formData.discountType === 'percentage' ? '20' : '500'}
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary-400 transition-colors"
                  required
                />
              </div>

              {/* Min Order Amount */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>

              {/* Max Discount */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                  Max Discount (₹) - Optional
                </label>
                <input
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  placeholder="e.g., 1000"
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                  Max Uses - Optional (Leave empty for unlimited)
                </label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="e.g., 100"
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>

              {/* Field */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                  Field - Optional
                </label>
                <input
                  type="text"
                  value={formData.field}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  placeholder="e.g., Product Category, User Segment"
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                  Expiry Date - Optional
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary-400 text-black px-8 py-3 font-bold uppercase tracking-wider hover:bg-primary-500 transition-colors"
              >
                {editingId ? 'Update Coupon' : 'Create Coupon'}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowForm(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-700 text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-600 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Coupons List */}
      <div className="bg-jet-900 border border-white/20 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto"></div>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No coupons created yet. Create your first coupon to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold uppercase tracking-wider text-sm">Code</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold uppercase tracking-wider text-sm">Description</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold uppercase tracking-wider text-sm">Discount</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold uppercase tracking-wider text-sm">Min Order</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold uppercase tracking-wider text-sm">Field</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold uppercase tracking-wider text-sm">Expiry</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold uppercase tracking-wider text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold uppercase tracking-wider text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-black/30 transition-colors">
                    <td className="px-6 py-4 text-white font-bold">{coupon.code}</td>
                    <td className="px-6 py-4 text-gray-300">{coupon.description || '-'}</td>
                    <td className="px-6 py-4 text-white">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </td>
                    <td className="px-6 py-4 text-gray-300">₹{coupon.minOrderAmount}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {coupon.field || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.active ? (
                        <span className="text-green-400 flex items-center space-x-1">
                          <Check size={16} />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center space-x-1">
                          <X size={16} />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <motion.button
                        onClick={() => handleEdit(coupon)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-primary-400 hover:bg-primary-400/20 transition-colors"
                      >
                        <Edit2 size={18} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(coupon._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-400 hover:bg-red-400/20 transition-colors"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

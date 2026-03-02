'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Edit2, Check, X, ExternalLink, Package, Calendar, Phone, Mail } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  userId?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  payment: {
    mode: 'COD' | 'Prepaid';
    method?: string;
    status: string;
    transactionId?: string;
  };
  trackingNumber?: string;
  createdAt: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', paymentMode: '' });
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.paymentMode) params.append('paymentMode', filter.paymentMode);

      const response = await fetch(`/api/admin/orders?${params}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order._id);
    setEditData({
      status: order.status,
      paymentMode: order.payment?.mode || 'COD',
      paymentStatus: order.payment?.status || 'pending',
    });
  };

  const handleSave = async (orderId: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          ...editData,
        }),
      });

      if (response.ok) {
        setEditingOrder(null);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30',
      confirmed: 'text-green-400 bg-green-400/20 border-green-400/30',
      processing: 'text-blue-400 bg-blue-400/20 border-blue-400/30',
      shipped: 'text-primary-400 bg-primary-400/20 border-primary-400/30',
      delivered: 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30',
      cancelled: 'text-red-400 bg-red-400/20 border-red-400/30',
    };
    return colors[status] || 'text-gray-400 bg-gray-400/20 border-gray-400/30';
  };

  const getPaymentModeColor = (mode: string) => {
    return mode === 'COD' 
      ? 'text-blue-400 bg-blue-400/20 border-blue-400/30' 
      : 'text-green-400 bg-green-400/20 border-green-400/30';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-white font-bold uppercase tracking-wider text-sm">Loading Orders...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1">Orders</h1>
        <p className="text-gray-400 text-sm">Manage all customer orders and shipments</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="bg-black/50 border border-white/20 text-white px-4 py-2.5 rounded-lg focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all text-sm hover:bg-black/70"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={filter.paymentMode}
          onChange={(e) => setFilter({ ...filter, paymentMode: e.target.value })}
          className="bg-black/50 border border-white/20 text-white px-4 py-2.5 rounded-lg focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all text-sm hover:bg-black/70"
        >
          <option value="">All Payment Modes</option>
          <option value="COD">Cash on Delivery</option>
          <option value="Prepaid">Online Payment</option>
        </select>
      </div>

      {/* Orders Table */}
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-black/50 border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Order #</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tracking</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-mono text-sm font-semibold text-white">{order.orderNumber}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-white">{order.userId?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Phone size={12} />
                        {order.userId?.phone || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-300">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.items.map((item, i) => (
                          <div key={i}>{item.quantity}x {item.name}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-primary-400">{formatPrice(order.total)}</div>
                    </td>
                    <td className="px-4 py-3">
                      {editingOrder === order._id ? (
                        <select
                          value={editData.paymentMode}
                          onChange={(e) => setEditData({ ...editData, paymentMode: e.target.value })}
                          className="bg-black/50 border border-white/20 text-white px-2 py-1 rounded text-xs focus:border-primary-400 focus:outline-none"
                        >
                          <option value="COD">COD</option>
                          <option value="Prepaid">Online</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getPaymentModeColor(order.payment?.mode || 'COD')}`}>
                          {order.payment?.mode === 'COD' ? 'COD' : 'Online'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingOrder === order._id ? (
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="bg-black/50 border border-white/20 text-white px-2 py-1 rounded text-xs focus:border-primary-400 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.trackingNumber ? (
                        <div className="flex items-center gap-1">
                          <div className="text-xs">
                            <div className="font-mono text-gray-300">{order.trackingNumber}</div>
                            <a
                              href={`https://track.delhivery.com/track/package/${order.trackingNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:text-primary-300 text-[10px] flex items-center gap-0.5 mt-0.5"
                            >
                              Track <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editingOrder === order._id ? (
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => handleSave(order._id)}
                            className="p-1.5 text-green-400 hover:bg-green-400/20 rounded transition-colors"
                            title="Save"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingOrder(null)}
                            className="p-1.5 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(order)}
                          className="p-1.5 text-primary-400 hover:bg-primary-400/20 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg p-12 text-center"
        >
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Orders Found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your filters or check back later</p>
        </motion.div>
      )}
    </motion.div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Edit2,
  Check,
  X,
  ExternalLink,
  Package,
  Calendar,
  Phone,
  Mail,
  Truck,
  RefreshCw,
  Trash2,
} from 'lucide-react';

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
  trackingNumber?: string;
  trackingStatus?: string;
  payment: {
    mode: 'COD' | 'Prepaid';
    method?: string;
    status: string;
    transactionId?: string;
  };
  createdAt: string;
}

const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-purple-500/20 text-purple-400',
  shipped: 'bg-indigo-500/20 text-indigo-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const trackingStatusColors: { [key: string]: string } = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  picked: 'bg-blue-500/20 text-blue-400',
  in_transit: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400',
};

export default function OrderManagementWithDelhivery() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', paymentMode: '' });
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: string; text: string } | null>(null);

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

  const handleDelhiveryAction = async (
    orderId: string,
    action: 'track' | 'cancel' | 'update'
  ) => {
    try {
      setActionLoading(`${orderId}-${action}`);
      setActionMessage(null);

      const response = await fetch('/api/admin/orders/delhivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          action,
          ...(action === 'update' && editData),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform action');
      }

      const result = await response.json();
      setActionMessage({
        type: 'success',
        text: result.message || `${action} completed successfully`,
      });

      // Refresh orders
      setTimeout(() => {
        fetchOrders();
        setActionMessage(null);
      }, 2000);
    } catch (error: any) {
      setActionMessage({
        type: 'error',
        text: error.message || 'Failed to perform action',
      });
    } finally {
      setActionLoading(null);
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

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      setActionMessage({
        type: 'success',
        text: 'Order updated successfully',
      });

      setEditingOrder(null);
      setTimeout(() => {
        fetchOrders();
        setActionMessage(null);
      }, 1500);
    } catch (error: any) {
      setActionMessage({
        type: 'error',
        text: error.message || 'Failed to update order',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="bg-jet-800 border border-white/20 rounded-lg px-4 py-2 text-white text-sm"
        >
          <option value="">All Statuses</option>
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
          className="bg-jet-800 border border-white/20 rounded-lg px-4 py-2 text-white text-sm"
        >
          <option value="">All Payment Modes</option>
          <option value="COD">COD</option>
          <option value="Prepaid">Prepaid</option>
        </select>

        <button
          onClick={fetchOrders}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            actionMessage.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {actionMessage.text}
        </motion.div>
      )}

      {/* Orders Table */}
      <div className="bg-jet-900 border border-white/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Order</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Items</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Tracking</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-white font-medium">{order.orderNumber}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-white">{order.userId?.name || 'N/A'}</p>
                      <p className="text-gray-500 text-xs">{order.userId?.email}</p>
                      <p className="text-gray-500 text-xs">{order.userId?.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-400">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white font-medium">
                      ₹{order.total.toLocaleString('en-IN')}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    {editingOrder === order._id ? (
                      <select
                        value={editData.status}
                        onChange={(e) =>
                          setEditData({ ...editData, status: e.target.value })
                        }
                        className="bg-jet-800 border border-white/20 rounded px-2 py-1 text-white text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {order.trackingNumber && (
                        <>
                          <p className="text-gray-400 text-xs">
                            Waybill: {order.trackingNumber}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              trackingStatusColors[order.trackingStatus || 'pending']
                            }`}
                          >
                            {order.trackingStatus || 'pending'}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {editingOrder === order._id ? (
                        <>
                          <button
                            onClick={() => handleSave(order._id)}
                            className="p-2 hover:bg-green-500/20 rounded transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4 text-green-400" />
                          </button>
                          <button
                            onClick={() => setEditingOrder(null)}
                            className="p-2 hover:bg-red-500/20 rounded transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(order)}
                            className="p-2 hover:bg-blue-500/20 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-blue-400" />
                          </button>
                          {order.trackingNumber && (
                            <button
                              onClick={() =>
                                handleDelhiveryAction(order._id, 'track')
                              }
                              disabled={actionLoading === `${order._id}-track`}
                              className="p-2 hover:bg-purple-500/20 rounded transition-colors disabled:opacity-50"
                              title="Refresh Tracking"
                            >
                              {actionLoading === `${order._id}-track` ? (
                                <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
                              ) : (
                                <Truck className="w-4 h-4 text-purple-400" />
                              )}
                            </button>
                          )}
                          {order.status !== 'delivered' &&
                            order.status !== 'cancelled' &&
                            order.trackingNumber && (
                              <button
                                onClick={() =>
                                  handleDelhiveryAction(order._id, 'cancel')
                                }
                                disabled={actionLoading === `${order._id}-cancel`}
                                className="p-2 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50"
                                title="Cancel Shipment"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No orders found</p>
        </div>
      )}
    </div>
  );
}

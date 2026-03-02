'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  RefreshCw,
} from 'lucide-react';

interface ShipmentStats {
  _id: string;
  count: number;
  totalAmount: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  trackingNumber: string;
  trackingStatus: string;
  status: string;
  payment: {
    mode: string;
  };
  total: number;
  createdAt: string;
  userId?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface DashboardData {
  success: boolean;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    dateRange: {
      start: string;
      end: string;
      days: number;
    };
  };
  trackingStatus: ShipmentStats[];
  orderStatus: ShipmentStats[];
  paymentMode: ShipmentStats[];
  recentOrders: RecentOrder[];
}

const statusColors: { [key: string]: { bg: string; text: string; icon: any } } = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Package },
  picked: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Package },
  in_transit: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Truck },
  delivered: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
  failed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertCircle },
};

export default function DelhiveryDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/delhivery-stats?days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const result = await response.json();
      setData(result);
      setLastRefresh(new Date());
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-400 font-medium">Error Loading Dashboard</p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const trackingStatusMap: { [key: string]: string } = {
    pending: 'Pending',
    picked: 'Picked',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    failed: 'Failed',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Delhivery Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">
            Last updated: {lastRefresh?.toLocaleTimeString('en-IN')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="bg-jet-800 border border-white/20 rounded-lg px-4 py-2 text-white text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={fetchStats}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-jet-900 border border-white/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-white mt-2">
                {data.summary.totalOrders}
              </p>
            </div>
            <Package className="w-12 h-12 text-primary-400/30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-jet-900 border border-white/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">
                ₹{data.summary.totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-400/30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-jet-900 border border-white/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Date Range</p>
              <p className="text-lg font-bold text-white mt-2">
                {data.summary.dateRange.days} days
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(data.summary.dateRange.start).toLocaleDateString('en-IN')} -{' '}
                {new Date(data.summary.dateRange.end).toLocaleDateString('en-IN')}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-blue-400/30" />
          </div>
        </motion.div>
      </div>

      {/* Tracking Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-jet-900 border border-white/20 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Tracking Status</h3>
          <div className="space-y-3">
            {data.trackingStatus.map((status) => {
              const percentage = (status.count / data.summary.totalOrders) * 100;
              const statusKey = status._id?.toLowerCase() || 'pending';
              const colors = statusColors[statusKey] || statusColors.pending;

              return (
                <div key={status._id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm capitalize">
                      {trackingStatusMap[statusKey] || status._id}
                    </span>
                    <span className="text-white font-medium">{status.count}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors.bg}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-jet-900 border border-white/20 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Payment Mode</h3>
          <div className="space-y-3">
            {data.paymentMode.map((mode) => {
              const percentage = (mode.count / data.summary.totalOrders) * 100;

              return (
                <div key={mode._id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">{mode._id}</span>
                    <span className="text-white font-medium">
                      {mode.count} (₹{mode.totalAmount.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-jet-900 border border-white/20 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Order</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Waybill</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Payment</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => {
                const statusKey = order.trackingStatus?.toLowerCase() || 'pending';
                const colors = statusColors[statusKey] || statusColors.pending;

                return (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{order.orderNumber}</p>
                        <p className="text-gray-500 text-xs">
                          {order.userId?.name || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{order.trackingNumber}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {trackingStatusMap[statusKey] || order.trackingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{order.payment.mode}</td>
                    <td className="py-3 px-4 text-white font-medium">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

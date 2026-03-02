'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface DelhiveryStatsData {
  totalShipments: number;
  deliveredShipments: number;
  inTransitShipments: number;
  pendingShipments: number;
  failedShipments: number;
  deliveryRate: number;
  averageDeliveryTime: number;
}

export default function DelhiveryStats() {
  const [stats, setStats] = useState<DelhiveryStatsData>({
    totalShipments: 0,
    deliveredShipments: 0,
    inTransitShipments: 0,
    pendingShipments: 0,
    failedShipments: 0,
    deliveryRate: 0,
    averageDeliveryTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDelhiveryStats();
  }, []);

  const fetchDelhiveryStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/delhivery-stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching Delhivery stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-3">
            <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-gray-400 text-sm">Loading Delhivery stats...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 relative overflow-hidden rounded-lg"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/5 rounded-full -mr-24 -mt-24"></div>
      <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-blue-400/20"></div>

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-400/20 flex items-center justify-center rounded">
              <Truck className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Delhivery Shipping Stats</h2>
          </div>
          <button
            onClick={fetchDelhiveryStats}
            className="text-blue-400 hover:text-blue-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            <TrendingUp className="w-3 h-3" />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
          {/* Total Shipments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 border border-white/10 p-3 rounded hover:border-blue-400/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total</span>
            </div>
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={stats.totalShipments} duration={1} />
            </div>
          </motion.div>

          {/* Delivered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-black/40 border border-white/10 p-3 rounded hover:border-green-400/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Delivered</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              <AnimatedCounter value={stats.deliveredShipments} duration={1} />
            </div>
          </motion.div>

          {/* In Transit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 border border-white/10 p-3 rounded hover:border-blue-400/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">In Transit</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              <AnimatedCounter value={stats.inTransitShipments} duration={1} />
            </div>
          </motion.div>

          {/* Pending */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-black/40 border border-white/10 p-3 rounded hover:border-yellow-400/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pending</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              <AnimatedCounter value={stats.pendingShipments} duration={1} />
            </div>
          </motion.div>

          {/* Failed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 border border-white/10 p-3 rounded hover:border-red-400/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Failed</span>
            </div>
            <div className="text-2xl font-bold text-red-400">
              <AnimatedCounter value={stats.failedShipments} duration={1} />
            </div>
          </motion.div>

          {/* Delivery Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-black/40 border border-white/10 p-3 rounded hover:border-primary-400/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary-400" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Rate</span>
            </div>
            <div className="text-2xl font-bold text-primary-400">
              {(stats.deliveryRate || 0).toFixed(1)}%
            </div>
          </motion.div>

          {/* Avg Delivery Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/40 border border-white/10 p-3 rounded hover:border-purple-400/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Avg Days</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {(stats.averageDeliveryTime || 0).toFixed(1)}
            </div>
          </motion.div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-black/20 border border-white/10 p-4 rounded">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shipment Status Breakdown</h3>
          
          <div className="space-y-3">
            {/* Delivered Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-bold">Delivered</span>
                <span className="text-xs text-green-400 font-bold">
                  {stats.totalShipments > 0 ? ((stats.deliveredShipments / stats.totalShipments) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stats.totalShipments > 0 ? `${(stats.deliveredShipments / stats.totalShipments) * 100}%` : 0 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                />
              </div>
            </div>

            {/* In Transit Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-bold">In Transit</span>
                <span className="text-xs text-blue-400 font-bold">
                  {stats.totalShipments > 0 ? ((stats.inTransitShipments / stats.totalShipments) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stats.totalShipments > 0 ? `${(stats.inTransitShipments / stats.totalShipments) * 100}%` : 0 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                />
              </div>
            </div>

            {/* Pending Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-bold">Pending</span>
                <span className="text-xs text-yellow-400 font-bold">
                  {stats.totalShipments > 0 ? ((stats.pendingShipments / stats.totalShipments) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stats.totalShipments > 0 ? `${(stats.pendingShipments / stats.totalShipments) * 100}%` : 0 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                />
              </div>
            </div>

            {/* Failed Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-bold">Failed</span>
                <span className="text-xs text-red-400 font-bold">
                  {stats.totalShipments > 0 ? ((stats.failedShipments / stats.totalShipments) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stats.totalShipments > 0 ? `${(stats.failedShipments / stats.totalShipments) * 100}%` : 0 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-red-400 to-pink-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

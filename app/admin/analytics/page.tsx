'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import { 
  TrendingUp, 
  TrendingDown,
  IndianRupee, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  orders: {
    current: number;
    previous: number;
    growth: number;
  };
  customers: {
    current: number;
    previous: number;
    growth: number;
  };
  avgOrderValue: {
    current: number;
    previous: number;
    growth: number;
  };
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  salesByCategory: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    time: string;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        const error = await response.json();
        console.error('Analytics error:', error);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatGrowth = (growth: number | undefined) => {
    if (growth === undefined || growth === null) {
      return <span className="text-gray-400">-</span>;
    }
    const isPositive = growth >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {Math.abs(growth).toFixed(1)}%
      </span>
    );
  };

  const formatPrice = (price: number | undefined) => {
    if (!price && price !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const isValidAnalytics = (data: AnalyticsData | null): boolean => {
    if (!data) return false;
    return !!(
      data.revenue &&
      data.orders &&
      data.customers &&
      data.avgOrderValue &&
      Array.isArray(data.topProducts) &&
      Array.isArray(data.salesByCategory) &&
      Array.isArray(data.recentActivity)
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
          <div className="text-white font-bold uppercase tracking-wider text-sm">Loading Analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics || !isValidAnalytics(analytics)) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-gray-400 mb-4">No analytics data available</div>
          <button
            onClick={() => fetchAnalytics()}
            className="px-4 py-2 bg-primary-400 text-black font-bold rounded hover:bg-primary-500 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1">Analytics</h1>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            Business insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          {['7days', '30days', '90days', '1year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded ${
                timeRange === range
                  ? 'bg-primary-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {range === '7days' && '7 Days'}
              {range === '30days' && '30 Days'}
              {range === '90days' && '90 Days'}
              {range === '1year' && '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-400/5 rounded-full -mr-12 -mt-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-400/20 rounded">
                <IndianRupee className="w-5 h-5 text-black" />
              </div>
              {formatGrowth(analytics.revenue.growth)}
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatPrice(analytics.revenue.current)}
            </div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Total Revenue</div>
            <div className="text-gray-500 text-[10px] mt-1">vs {formatPrice(analytics.revenue.previous)}</div>
          </div>
        </motion.div>

        {/* Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/5 rounded-full -mr-12 -mt-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-400/20 rounded">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              {formatGrowth(analytics.orders.growth)}
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              <AnimatedCounter value={analytics.orders.current} duration={1.5} />
            </div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Total Orders</div>
            <div className="text-gray-500 text-[10px] mt-1">vs {analytics.orders.previous}</div>
          </div>
        </motion.div>

        {/* Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/5 rounded-full -mr-12 -mt-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-400/20 rounded">
                <Users className="w-5 h-5 text-white" />
              </div>
              {formatGrowth(analytics.customers.growth)}
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              <AnimatedCounter value={analytics.customers.current} duration={1.5} />
            </div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">New Customers</div>
            <div className="text-gray-500 text-[10px] mt-1">vs {analytics.customers.previous}</div>
          </div>
        </motion.div>

        {/* Avg Order Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/5 rounded-full -mr-12 -mt-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-400/20 rounded">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              {formatGrowth(analytics.avgOrderValue.growth)}
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatPrice(analytics.avgOrderValue.current)}
            </div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Avg Order Value</div>
            <div className="text-gray-500 text-[10px] mt-1">vs {formatPrice(analytics.avgOrderValue.previous)}</div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Top Products</h2>
          </div>
          <div className="space-y-3">
            {analytics.topProducts.map((product, index) => (
              <div key={index} className="bg-black/30 p-3 rounded border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">{product.name}</span>
                  <span className="text-primary-400 font-bold text-sm">{formatPrice(product.revenue)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{product.sales} sales</span>
                  <div className="flex-1 mx-3 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-400 h-full rounded-full"
                      style={{ width: `${(product.sales / analytics.topProducts[0].sales) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sales by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Sales by Category</h2>
          </div>
          <div className="space-y-3">
            {analytics.salesByCategory.map((category, index) => (
              <div key={index} className="bg-black/30 p-3 rounded border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">{category.category}</span>
                  <span className="text-primary-400 font-bold text-sm">{category.percentage}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-xs">{category.count} orders</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Recent Activity</h2>
        </div>
        <div className="space-y-2">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-black/30 rounded border border-white/10 hover:border-primary-400/30 transition-all">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'order' ? 'bg-blue-400' :
                activity.type === 'customer' ? 'bg-green-400' :
                activity.type === 'review' ? 'bg-yellow-400' :
                'bg-gray-400'
              }`}></div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.description}</p>
              </div>
              <span className="text-gray-400 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

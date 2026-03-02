'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import DelhiveryStats from '@/components/admin/DelhiveryStats';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package,
  IndianRupee,
  Eye,
  ArrowUp,
  ArrowDown,
  Mail,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalSubscribers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  subscribersGrowth: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  userId?: {
    name: string;
    email: string;
    phone: string;
  };
  customerName?: string;
  total: number;
  status: string;
  date: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 3,
    totalSubscribers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    subscribersGrowth: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders to calculate stats
      const ordersResponse = await fetch('/api/admin/orders');
      const ordersData = ordersResponse.ok ? await ordersResponse.json() : { orders: [] };
      const orders = Array.isArray(ordersData) ? ordersData : (ordersData.orders || []);
      
      // Fetch customers
      const customersResponse = await fetch('/api/admin/customers');
      const customers = customersResponse.ok ? await customersResponse.json() : [];

      // Fetch newsletter subscribers
      const newsletterResponse = await fetch('/api/admin/newsletter?limit=1');
      const newsletterData = newsletterResponse.ok ? await newsletterResponse.json() : { statistics: { total: 0 } };

      // Calculate stats
      const totalRevenue = Array.isArray(orders) ? orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0) : 0;
      const totalOrders = Array.isArray(orders) ? orders.length : 0;
      const totalCustomers = Array.isArray(customers) ? customers.length : 0;
      const totalSubscribers = newsletterData.statistics?.total || 0;

      // Mock growth data (in real app, compare with previous period)
      const mockStats: DashboardStats = {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts: 3,
        totalSubscribers,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        customersGrowth: 15.2,
        subscribersGrowth: 22.1,
      };

      setStats(mockStats);
      
      // Map orders to RecentOrder format
      const mappedOrders = Array.isArray(orders) ? orders.slice(0, 5).map((order: any) => ({
        id: order._id,
        orderNumber: order.orderNumber,
        userId: order.userId,
        customerName: order.userId?.name || 'Unknown Customer',
        total: order.total,
        status: order.status,
        date: order.createdAt,
        createdAt: order.createdAt,
      })) : [];
      
      setRecentOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'processing':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'shipped':
        return 'text-primary-400 bg-primary-400/20 border-primary-400/30';
      case 'delivered':
        return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-white font-bold uppercase tracking-wider text-sm">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header with Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1">Dashboard</h1>
          <p className="text-gray-400 flex items-center gap-2 text-sm">
            <Activity className="w-3.5 h-3.5" />
            Welcome back to Agnishila Admin Panel
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/admin/orders"
            className="px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-black font-bold uppercase tracking-wider text-xs transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary-400/30 flex items-center gap-2 active:scale-95 rounded"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            View Orders
          </Link>
          <Link 
            href="/admin/products"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-all hover:scale-105 border border-white/20 hover:border-white/40 flex items-center gap-2 active:scale-95 rounded"
          >
            <Package className="w-3.5 h-3.5" />
            Manage Products
          </Link>
        </div>
      </div>

      {/* Time Info Bar */}
      <div className="bg-gradient-to-r from-primary-400/10 to-transparent border-l-2 border-primary-400 p-3 rounded-r">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-xs">Last updated: {new Date().toLocaleString('en-IN')}</span>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="text-primary-400 hover:text-primary-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 relative overflow-hidden group cursor-pointer rounded-lg"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-400/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-b-[20px] border-b-primary-400/20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-400/20 rounded">
                <IndianRupee className="w-5 h-5 text-black" />
              </div>
              <div className="flex items-center space-x-1 text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
                <ArrowUp size={12} />
                <span className="text-[10px] font-bold">{stats.revenueGrowth}%</span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">{formatPrice(stats.totalRevenue)}</div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Total Revenue</div>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 relative overflow-hidden group cursor-pointer rounded-lg"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-b-[20px] border-b-blue-400/20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-400/20 rounded">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
                <ArrowUp size={14} />
                <span className="text-[10px] font-bold">{stats.ordersGrowth}%</span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
              <AnimatedCounter value={stats.totalOrders} duration={1.5} />
            </div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Total Orders</div>
          </div>
        </motion.div>

        {/* Total Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 relative overflow-hidden group cursor-pointer rounded-lg"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-b-[20px] border-b-green-400/20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-400/20 rounded">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
                <ArrowUp size={14} />
                <span className="text-[10px] font-bold">{stats.customersGrowth}%</span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
              <AnimatedCounter value={stats.totalCustomers} duration={1.5} />
            </div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Total Customers</div>
          </div>
        </motion.div>

        {/* Total Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 relative overflow-hidden group cursor-pointer rounded-lg"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-b-[20px] border-b-purple-400/20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-400/20 rounded">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded">
                <CheckCircle size={14} />
                <span className="text-[10px] font-bold">Active</span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
              <AnimatedCounter value={stats.totalProducts} duration={1.5} />
            </div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Total Products</div>
          </div>
        </motion.div>

        {/* Newsletter Subscribers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 relative overflow-hidden group cursor-pointer rounded-lg"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-400/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-b-[20px] border-b-orange-400/20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-400/20 rounded">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
                <ArrowUp size={14} />
                <span className="text-[10px] font-bold">{stats.subscribersGrowth}%</span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
              <AnimatedCounter value={stats.totalSubscribers} duration={1.5} />
            </div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Newsletter Subscribers</div>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 relative overflow-hidden rounded-lg"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-400/5 rounded-full -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/20"></div>
        
        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-400/20 flex items-center justify-center rounded">
                <ShoppingCart className="w-4 h-4 text-primary-400" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Recent Orders</h2>
            </div>
            <Link 
              href="/admin/orders"
              className="text-primary-400 hover:text-primary-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1 group"
            >
              View All
              <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-16 bg-black/20 rounded-lg">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">No Orders Yet</h3>
              <p className="text-gray-400 mb-4">Orders will appear here once customers start purchasing</p>
              <Link 
                href="/admin/orders"
                className="inline-block px-6 py-2 bg-primary-400 hover:bg-primary-500 text-black font-bold uppercase tracking-wider text-sm transition-all"
              >
                View All Orders
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-primary-400/20">
                    <th className="text-left py-4 px-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Order #</th>
                    <th className="text-left py-4 px-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Customer</th>
                    <th className="text-left py-4 px-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Total</th>
                    <th className="text-left py-4 px-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Status</th>
                    <th className="text-left py-4 px-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Date</th>
                    <th className="text-center py-4 px-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-primary-400/5 transition-all group"
                    >
                      <td className="py-4 px-2">
                        <span className="text-white font-bold text-sm">{order.orderNumber}</span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-400/20 flex items-center justify-center">
                            <span className="text-primary-400 font-bold text-xs">
                              {(order.customerName || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-300 font-medium">{order.customerName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-primary-400 font-bold text-sm">{formatPrice(order.total)}</span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-gray-400 text-sm">{formatDate(order.date)}</span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-primary-400 hover:bg-primary-400/10 transition-all group-hover:scale-110">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delhivery Shipping Stats */}
      <DelhiveryStats />
    </div>
  );
}



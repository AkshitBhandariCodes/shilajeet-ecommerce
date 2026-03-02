'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Truck, 
  CheckCircle, 
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPinIcon
} from 'lucide-react';

interface OrderStats {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentMode: string;
  paymentStatus: string;
  items: {
    count: number;
    total: number;
  };
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    couponCode: string | null;
  };
  shipping: {
    provider: string;
    trackingNumber: string;
    trackingStatus: string;
    trackingUrl: string | null;
  };
  delivery: {
    expectedDeliveryDate: string;
    expectedDeliveryDays: number;
    lastLocation: string | null;
    attemptCount: number;
  };
  timeline: {
    orderCreated: string;
    pickedDate: string | null;
    inTransitDate: string | null;
    deliveredDate: string | null;
  };
  trackingScans: Array<{
    status: string;
    location: string;
    timestamp: string;
    remarks: string;
  }>;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface OrderStatsDisplayProps {
  orderId: string;
}

export default function OrderStatsDisplay({ orderId }: OrderStatsDisplayProps) {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}/stats`);
        if (!response.ok) {
          throw new Error('Failed to fetch order stats');
        }
        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 p-6 text-red-300">
        {error || 'Failed to load order stats'}
      </div>
    );
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-400';
      case 'shipped':
      case 'in_transit':
        return 'text-blue-400';
      case 'confirmed':
      case 'processing':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-jet-900 border border-white/20 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Order #{stats.orderNumber}</h2>
            <p className="text-gray-400 text-sm">Order ID: {stats.orderId}</p>
          </div>
          <div className={`flex items-center space-x-2 ${getStatusColor(stats.status)}`}>
            {getStatusIcon(stats.status)}
            <span className="font-bold uppercase text-sm">{stats.status}</span>
          </div>
        </div>
      </motion.div>

      {/* Pricing Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-jet-900 border border-white/20 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-primary-400" />
          <span>Pricing Details</span>
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal ({stats.items.count} items)</span>
            <span>{formatPrice(stats.pricing.subtotal)}</span>
          </div>
          {stats.pricing.tax > 0 && (
            <div className="flex justify-between text-gray-300">
              <span>Tax</span>
              <span>{formatPrice(stats.pricing.tax)}</span>
            </div>
          )}
          {stats.pricing.shipping > 0 && (
            <div className="flex justify-between text-gray-300">
              <span>Shipping</span>
              <span>{formatPrice(stats.pricing.shipping)}</span>
            </div>
          )}
          {stats.pricing.discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Discount {stats.pricing.couponCode && `(${stats.pricing.couponCode})`}</span>
              <span>-{formatPrice(stats.pricing.discount)}</span>
            </div>
          )}
          <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold text-primary-400">
            <span>Total</span>
            <span>{formatPrice(stats.pricing.total)}</span>
          </div>
        </div>
      </motion.div>

      {/* Shipping & Delivery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-jet-900 border border-white/20 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Truck className="w-5 h-5 text-primary-400" />
          <span>Shipping & Delivery</span>
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Tracking Number</p>
            <p className="text-white font-mono">{stats.shipping.trackingNumber || 'N/A'}</p>
            {stats.shipping.trackingUrl && (
              <a
                href={stats.shipping.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block"
              >
                Track on Delhivery →
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Expected Delivery</p>
              <p className="text-white font-bold">{formatDate(stats.delivery.expectedDeliveryDate)}</p>
              <p className="text-gray-400 text-xs mt-1">In {stats.delivery.expectedDeliveryDays} days</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Last Location</p>
              <p className="text-white">{stats.delivery.lastLocation || 'In warehouse'}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Payment Mode</p>
            <p className="text-white font-bold">{stats.paymentMode}</p>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-jet-900 border border-white/20 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-400" />
          <span>Timeline</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 rounded-full bg-primary-400"></div>
            <div className="flex-1">
              <p className="text-gray-400 text-sm">Order Created</p>
              <p className="text-white">{formatDate(stats.timeline.orderCreated)}</p>
            </div>
          </div>
          {stats.timeline.pickedDate && (
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Picked Up</p>
                <p className="text-white">{formatDate(stats.timeline.pickedDate)}</p>
              </div>
            </div>
          )}
          {stats.timeline.inTransitDate && (
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">In Transit</p>
                <p className="text-white">{formatDate(stats.timeline.inTransitDate)}</p>
              </div>
            </div>
          )}
          {stats.timeline.deliveredDate && (
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Delivered</p>
                <p className="text-white">{formatDate(stats.timeline.deliveredDate)}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tracking Scans */}
      {stats.trackingScans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-jet-900 border border-white/20 p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5 text-primary-400" />
            <span>Tracking Updates</span>
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {stats.trackingScans.map((scan, index) => (
              <div key={index} className="border-l-2 border-primary-400/50 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white font-semibold">{scan.status}</p>
                  <p className="text-gray-400 text-xs">{formatDate(scan.timestamp)}</p>
                </div>
                <p className="text-gray-300 text-sm">{scan.location}</p>
                {scan.remarks && (
                  <p className="text-gray-400 text-xs mt-1">{scan.remarks}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Shipping Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-jet-900 border border-white/20 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary-400" />
          <span>Shipping Address</span>
        </h3>
        <div className="space-y-2 text-gray-300">
          <p className="text-white font-semibold">{stats.shippingAddress.name}</p>
          <p>{stats.shippingAddress.address}</p>
          <p>{stats.shippingAddress.city}, {stats.shippingAddress.state} {stats.shippingAddress.zipCode}</p>
          <p>{stats.shippingAddress.country}</p>
          <div className="pt-3 space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-primary-400" />
              <span>{stats.shippingAddress.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-primary-400" />
              <span>{stats.shippingAddress.email}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

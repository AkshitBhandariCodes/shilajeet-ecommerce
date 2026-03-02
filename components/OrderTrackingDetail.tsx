'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, AlertCircle, Clock, MapPin, Calendar } from 'lucide-react';

interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description?: string;
}

interface TrackingData {
  waybill: string;
  status: string;
  last_update: string;
  location: string;
  events?: TrackingEvent[];
  tat?: string;
  destination_location?: string;
}

interface OrderTrackingDetailProps {
  orderId: string;
  waybill: string;
  orderStatus: string;
}

const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  picked: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  in_transit: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcons: { [key: string]: any } = {
  pending: Clock,
  picked: Package,
  in_transit: Truck,
  delivered: CheckCircle,
  failed: AlertCircle,
};

export default function OrderTrackingDetail({
  orderId,
  waybill,
  orderStatus,
}: OrderTrackingDetailProps) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/shipments/track?waybill=${waybill}&orderId=${orderId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch tracking information');
        }

        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setTracking(data.data[0]);
          setLastUpdated(new Date());
        } else {
          setError('No tracking data available');
        }
      } catch (err) {
        console.error('Error fetching tracking:', err);
        setError('Unable to fetch tracking information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (waybill) {
      fetchTracking();
      // Auto-refresh every 5 minutes
      const interval = setInterval(fetchTracking, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [waybill, orderId]);

  if (loading) {
    return (
      <div className="bg-jet-900 border border-white/20 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          <span className="ml-3 text-gray-400">Loading tracking information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-jet-900 border border-red-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-400 font-medium">Tracking Unavailable</p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="bg-jet-900 border border-white/20 rounded-lg p-6">
        <p className="text-gray-400">No tracking information available yet.</p>
      </div>
    );
  }

  const StatusIcon = statusIcons[tracking.status?.toLowerCase()] || Package;
  const statusColor = statusColors[tracking.status?.toLowerCase()] || statusColors.pending;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <div className="bg-jet-900 border border-white/20 rounded-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Shipment Status</h3>
            <p className="text-gray-400 text-sm">Waybill: {waybill}</p>
          </div>
          <div className={`px-4 py-2 rounded-lg border ${statusColor}`}>
            <div className="flex items-center gap-2">
              <StatusIcon className="w-4 h-4" />
              <span className="font-medium capitalize">{tracking.status}</span>
            </div>
          </div>
        </div>

        {/* Status Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary-400" />
              <p className="text-gray-400 text-sm">Current Location</p>
            </div>
            <p className="text-white font-medium">{tracking.location || 'In Transit'}</p>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary-400" />
              <p className="text-gray-400 text-sm">Last Updated</p>
            </div>
            <p className="text-white font-medium">
              {tracking.last_update
                ? new Date(tracking.last_update).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A'}
            </p>
          </div>

          {tracking.destination_location && (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-primary-400" />
                <p className="text-gray-400 text-sm">Destination</p>
              </div>
              <p className="text-white font-medium">{tracking.destination_location}</p>
            </div>
          )}

          {tracking.tat && (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary-400" />
                <p className="text-gray-400 text-sm">Estimated Delivery</p>
              </div>
              <p className="text-white font-medium">{tracking.tat}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tracking Timeline */}
      {tracking.events && tracking.events.length > 0 && (
        <div className="bg-jet-900 border border-white/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Tracking History</h3>
          <div className="space-y-4">
            {tracking.events.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary-400 mt-1.5"></div>
                  {index < tracking.events!.length - 1 && (
                    <div className="w-0.5 h-12 bg-white/10 my-2"></div>
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-white font-medium">{event.status}</p>
                  <p className="text-gray-400 text-sm">{event.location}</p>
                  {event.description && (
                    <p className="text-gray-500 text-sm mt-1">{event.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(event.timestamp).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-400 text-sm">
          💡 Tracking information is updated automatically. Last refreshed:{' '}
          {lastUpdated?.toLocaleTimeString('en-IN')}
        </p>
      </div>
    </div>
  );
}

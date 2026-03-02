'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';

interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
}

interface TrackingData {
  waybill: string;
  status: string;
  last_update: string;
  location: string;
  events?: TrackingEvent[];
}

export default function OrderTracking({ waybill }: { waybill: string }) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/shipments/delhivery/track/${waybill}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tracking information');
        }
        
        const data = await response.json();
        setTracking(data);
      } catch (err) {
        console.error('Error fetching tracking:', err);
        setError('Unable to fetch tracking information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (waybill) {
      fetchTracking();
      // Update every 5 minutes
      const interval = setInterval(fetchTracking, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [waybill]);

  if (loading) {
    return (
      <div className="bg-jet-900 border border-white/20 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          <span className="ml-3 text-gray-400">Loading tracking information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-jet-900 border border-white/20 p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-medium">Tracking Information</p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
            <p className="text-gray-500 text-xs mt-2">Waybill: {waybill}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('delivered')) {
      return <CheckCircle className="w-6 h-6 text-green-400" />;
    } else if (lowerStatus.includes('transit') || lowerStatus.includes('in-transit')) {
      return <Truck className="w-6 h-6 text-blue-400" />;
    } else if (lowerStatus.includes('picked') || lowerStatus.includes('processing')) {
      return <Package className="w-6 h-6 text-purple-400" />;
    }
    return <Package className="w-6 h-6 text-gray-400" />;
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('delivered')) {
      return 'text-green-400 bg-green-400/20 border-green-400/30';
    } else if (lowerStatus.includes('transit') || lowerStatus.includes('in-transit')) {
      return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
    } else if (lowerStatus.includes('picked') || lowerStatus.includes('processing')) {
      return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
    }
    return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
  };

  return (
    <div className="bg-jet-900 border border-white/20 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30"></div>
      
      <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider flex items-center">
        <Truck className="w-5 h-5 mr-2 text-primary-400" />
        Shipment Tracking
      </h3>

      {/* Current Status */}
      <div className="bg-black border border-white/10 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Current Status</p>
            <p className="text-white font-bold text-lg mt-1">{tracking.status}</p>
            <p className="text-gray-500 text-sm mt-1">{tracking.location}</p>
          </div>
          <div className="flex-shrink-0">
            {getStatusIcon(tracking.status)}
          </div>
        </div>
      </div>

      {/* Waybill and Last Update */}
      <div className="space-y-2 mb-6 pb-6 border-b border-white/10">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Waybill Number:</span>
          <span className="text-primary-400 font-mono">{tracking.waybill}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Last Updated:</span>
          <span className="text-gray-300">
            {new Date(tracking.last_update).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      {/* Tracking Events */}
      {tracking.events && tracking.events.length > 0 && (
        <div>
          <p className="text-gray-400 text-sm mb-4">Tracking History</p>
          <div className="space-y-3">
            {tracking.events.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(event.status)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{event.status}</p>
                  <p className="text-gray-400 text-sm">{event.location}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(event.timestamp).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking Link */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <a
          href={`https://track.delhivery.com/tracking/${tracking.waybill}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-500 transition-colors text-sm font-medium"
        >
          <span>Track on Delhivery</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

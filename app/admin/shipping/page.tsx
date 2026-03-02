'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Package,
  IndianRupee,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';

interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  methods: ShippingMethod[];
}

interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  estimatedDays: string;
  enabled: boolean;
}

export default function ShippingPage() {
  const [zones, setZones] = useState<ShippingZone[]>([
    {
      id: '1',
      name: 'Metro Cities',
      regions: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'],
      methods: [
        { id: '1-1', name: 'Standard Delivery', cost: 0, estimatedDays: '3-5', enabled: true },
        { id: '1-2', name: 'Express Delivery', cost: 99, estimatedDays: '1-2', enabled: true }
      ]
    },
    {
      id: '2',
      name: 'Tier 2 Cities',
      regions: ['Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh'],
      methods: [
        { id: '2-1', name: 'Standard Delivery', cost: 49, estimatedDays: '4-6', enabled: true },
        { id: '2-2', name: 'Express Delivery', cost: 149, estimatedDays: '2-3', enabled: true }
      ]
    },
    {
      id: '3',
      name: 'Rest of India',
      regions: ['All other locations'],
      methods: [
        { id: '3-1', name: 'Standard Delivery', cost: 79, estimatedDays: '5-7', enabled: true }
      ]
    }
  ]);

  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [showAddZone, setShowAddZone] = useState(false);

  const formatPrice = (price: number) => {
    return price === 0 ? 'FREE' : `₹${price}`;
  };

  const toggleMethod = (zoneId: string, methodId: string) => {
    setZones(zones.map(zone => {
      if (zone.id === zoneId) {
        return {
          ...zone,
          methods: zone.methods.map(method =>
            method.id === methodId ? { ...method, enabled: !method.enabled } : method
          )
        };
      }
      return zone;
    }));
  };

  const deleteZone = (zoneId: string) => {
    if (confirm('Are you sure you want to delete this shipping zone?')) {
      setZones(zones.filter(zone => zone.id !== zoneId));
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1">Shipping Management</h1>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Truck className="w-3.5 h-3.5" />
            Configure shipping zones and delivery methods
          </p>
        </div>
        <button
          onClick={() => setShowAddZone(true)}
          className="px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-black font-bold uppercase tracking-wider text-xs transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary-400/30 flex items-center gap-2 active:scale-95 rounded w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Shipping Zone
        </button>
      </div>

      {/* Shipping Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="w-8 h-8 text-primary-400" />
            <span className="text-2xl font-bold text-white">{zones.length}</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Shipping Zones</div>
        </div>

        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">
              {zones.reduce((sum, zone) => sum + zone.methods.length, 0)}
            </span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Delivery Methods</div>
        </div>

        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">
              {zones.reduce((sum, zone) => sum + zone.methods.filter(m => m.enabled).length, 0)}
            </span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Active Methods</div>
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="space-y-4">
        {zones.map((zone, index) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg overflow-hidden"
          >
            {/* Zone Header */}
            <div className="bg-black/30 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-400/20 flex items-center justify-center rounded">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{zone.name}</h3>
                    <p className="text-gray-400 text-xs">{zone.regions.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingZone(zone.id)}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteZone(zone.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="p-4">
              <div className="space-y-2">
                {zone.methods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-3 bg-black/30 rounded border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleMethod(zone.id, method.id)}
                        className={`w-10 h-6 rounded-full transition-all ${
                          method.enabled ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                          method.enabled ? 'ml-5' : 'ml-1'
                        }`}></div>
                      </button>
                      <div>
                        <div className="text-white font-semibold text-sm">{method.name}</div>
                        <div className="text-gray-400 text-xs">{method.estimatedDays} business days</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-primary-400 font-bold">{formatPrice(method.cost)}</div>
                        <div className="text-gray-400 text-xs">Shipping Cost</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Shipping Settings */}
      <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4">Shipping Settings</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs mb-2">Free Shipping Threshold</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  defaultValue="999"
                  className="w-full bg-black/50 border border-white/20 text-white pl-10 pr-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">Orders above this amount get free shipping</p>
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-2">Default Processing Time</label>
              <input
                type="text"
                defaultValue="1-2 business days"
                className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
              />
              <p className="text-gray-500 text-xs mt-1">Time to process orders before shipping</p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-white text-sm">Enable real-time shipping rate calculation</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-white text-sm">Send shipping confirmation emails</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-white text-sm">Require signature on delivery</span>
            </label>
          </div>

          <button className="px-6 py-2 bg-primary-400 hover:bg-primary-500 text-black font-bold uppercase tracking-wider text-xs transition-all hover:scale-105 rounded flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

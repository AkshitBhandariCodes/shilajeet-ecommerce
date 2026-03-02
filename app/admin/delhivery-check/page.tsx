'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface WarehouseData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
  email: string;
  status: string;
  workingDays: string;
  createdAt: string;
}

interface CheckResponse {
  success: boolean;
  registered: boolean;
  message: string;
  warehouses?: WarehouseData[];
  nextSteps?: string[];
  configuration?: {
    apiToken: string;
    environment: string;
    baseUrl: string;
  };
  error?: string;
  suggestion?: string;
  details?: any;
}

export default function DelhiveryCheckPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CheckResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkWarehouse();
  }, []);

  const checkWarehouse = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/delhivery/check-warehouse');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error checking warehouse:', error);
      setData({
        success: false,
        registered: false,
        message: 'Failed to check warehouse status',
        error: 'Network error',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-white font-bold">Checking Delhivery warehouse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-primary-400 hover:text-primary-300 mb-4 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Delhivery Warehouse Check</h1>
          <p className="text-gray-400">Verify your warehouse registration status</p>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border p-8 rounded-lg mb-8 ${
            data?.success
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-start gap-4">
            {data?.success ? (
              <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h2 className={`text-2xl font-bold mb-2 ${
                data?.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {data?.message}
              </h2>
              {data?.suggestion && (
                <p className="text-gray-300 mb-4">{data.suggestion}</p>
              )}
              {data?.error && (
                <p className="text-gray-300 mb-4">Error: {data.error}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Warehouses List */}
        {data?.warehouses && data.warehouses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-jet-900 border border-white/20 p-8 rounded-lg mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-6">Registered Warehouses</h3>
            <div className="space-y-6">
              {data.warehouses.map((warehouse, idx) => (
                <div key={idx} className="bg-black/50 p-6 rounded border border-white/10">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Warehouse Name</p>
                      <p className="text-white font-bold">{warehouse.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className="text-green-400 font-bold capitalize">{warehouse.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="text-white">{warehouse.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white">{warehouse.city}, {warehouse.state} {warehouse.pin}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white">{warehouse.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{warehouse.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Working Days</p>
                      <p className="text-white">{warehouse.workingDays}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Created</p>
                      <p className="text-white">{new Date(warehouse.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        {data?.nextSteps && data.nextSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-yellow-500/10 border border-yellow-500/30 p-8 rounded-lg mb-8"
          >
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Setup Required</h3>
            <ol className="space-y-3">
              {data.nextSteps.map((step, idx) => (
                <li key={idx} className="text-gray-300 flex gap-3">
                  <span className="text-yellow-400 font-bold flex-shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 pt-6 border-t border-yellow-500/20">
              <a
                href="https://track.delhivery.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-6 py-3 rounded font-bold transition-colors"
              >
                Go to Delhivery Dashboard
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        )}

        {/* Configuration */}
        {data?.configuration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-jet-900 border border-white/20 p-8 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-6">Configuration</h3>
            <div className="space-y-4">
              <div className="bg-black/50 p-4 rounded border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Environment</p>
                <p className="text-white font-mono">{data.configuration.environment}</p>
              </div>
              <div className="bg-black/50 p-4 rounded border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Base URL</p>
                <p className="text-white font-mono">{data.configuration.baseUrl}</p>
              </div>
              <div className="bg-black/50 p-4 rounded border border-white/10">
                <p className="text-gray-400 text-sm mb-2">API Token</p>
                <div className="flex items-center gap-2">
                  <p className="text-white font-mono flex-1">{data.configuration.apiToken}</p>
                  <button
                    onClick={() => copyToClipboard(data.configuration?.apiToken || '')}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <Copy size={16} className="text-gray-400" />
                  </button>
                </div>
                {copied && <p className="text-green-400 text-sm mt-2">Copied!</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Retry Button */}
        <div className="mt-8 text-center">
          <button
            onClick={checkWarehouse}
            className="bg-primary-400 hover:bg-primary-500 text-black px-8 py-3 font-bold rounded transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}

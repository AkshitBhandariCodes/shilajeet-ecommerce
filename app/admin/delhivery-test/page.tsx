'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Link from 'next/link';

export default function DelhiveryTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/delhivery/test-shipment', {
        method: 'POST',
      });

      const data = await response.json();
      setResult(data);

      if (!response.ok) {
        setError(data.error || 'Test failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to run test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-primary-400 hover:text-primary-300 mb-4 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Delhivery Shipment Test</h1>
          <p className="text-gray-400">Test if Delhivery shipment creation is working</p>
        </div>

        {/* Test Button */}
        <motion.button
          onClick={runTest}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-primary-400 hover:bg-primary-500 disabled:bg-gray-600 text-black px-8 py-4 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mb-8"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Run Test
            </>
          )}
        </motion.button>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border p-8 rounded-lg mb-8 ${
              result.success
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-start gap-4">
              {result.success ? (
                <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-2 ${
                  result.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.status}
                </h2>
                <p className="text-gray-300 mb-4">{result.message}</p>

                {result.success && (
                  <div className="bg-black/50 p-4 rounded border border-green-500/20 mb-4">
                    <p className="text-green-400 font-bold mb-2">✅ Shipment Created Successfully!</p>
                    <p className="text-gray-300">Waybill: {result.result.waybill}</p>
                    <p className="text-gray-300">Tracking: {result.result.trackingUrl}</p>
                  </div>
                )}

                {result.nextSteps && (
                  <div className="bg-black/50 p-4 rounded border border-green-500/20">
                    <p className="text-green-400 font-bold mb-2">Next Steps:</p>
                    <ul className="space-y-1">
                      {result.nextSteps.map((step: string, idx: number) => (
                        <li key={idx} className="text-gray-300">• {step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.fixSteps && (
                  <div className="bg-black/50 p-4 rounded border border-red-500/20">
                    <p className="text-red-400 font-bold mb-2">Fix Required:</p>
                    <p className="text-gray-300 mb-3">{result.issue}</p>
                    <ol className="space-y-1">
                      {result.fixSteps.map((step: string, idx: number) => (
                        <li key={idx} className="text-gray-300">{step}</li>
                      ))}
                    </ol>
                    {result.documentation && (
                      <p className="text-gray-400 mt-3 text-sm">📖 {result.documentation}</p>
                    )}
                  </div>
                )}

                {result.troubleshooting && (
                  <div className="bg-black/50 p-4 rounded border border-yellow-500/20">
                    <p className="text-yellow-400 font-bold mb-2">Troubleshooting:</p>
                    <ul className="space-y-1">
                      {result.troubleshooting.map((step: string, idx: number) => (
                        <li key={idx} className="text-gray-300">• {step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 p-8 rounded-lg"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
                <p className="text-gray-300">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info */}
        <div className="bg-jet-900 border border-white/20 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-bold text-white mb-4">What This Test Does</h3>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Creates a test shipment with Delhivery API</li>
            <li>✓ Checks if warehouse is properly configured</li>
            <li>✓ Verifies working days are set</li>
            <li>✓ Tests if waybill can be generated</li>
            <li>✓ Shows detailed error messages if something is wrong</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

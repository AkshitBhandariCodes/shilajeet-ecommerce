'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  IndianRupee,
  Mail,
  Star
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  type: string;
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [generating, setGenerating] = useState<string | null>(null);

  const reports: Report[] = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Comprehensive sales data including revenue, orders, and trends',
      icon: TrendingUp,
      color: 'primary',
      type: 'sales'
    },
    {
      id: 'orders',
      name: 'Orders Report',
      description: 'Detailed order information, status, and fulfillment data',
      icon: ShoppingCart,
      color: 'blue',
      type: 'orders'
    },
    {
      id: 'customers',
      name: 'Customers Report',
      description: 'Customer demographics, behavior, and purchase history',
      icon: Users,
      color: 'green',
      type: 'customers'
    },
    {
      id: 'products',
      name: 'Products Report',
      description: 'Product performance, inventory, and sales analytics',
      icon: Package,
      color: 'purple',
      type: 'products'
    },
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Financial overview including revenue, costs, and profit margins',
      icon: IndianRupee,
      color: 'yellow',
      type: 'revenue'
    },
    {
      id: 'newsletter',
      name: 'Newsletter Report',
      description: 'Subscriber growth, engagement, and campaign performance',
      icon: Mail,
      color: 'orange',
      type: 'newsletter'
    },
    {
      id: 'reviews',
      name: 'Reviews Report',
      description: 'Customer reviews, ratings, and feedback analysis',
      icon: Star,
      color: 'pink',
      type: 'reviews'
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Stock levels, low inventory alerts, and reorder recommendations',
      icon: Package,
      color: 'indigo',
      type: 'inventory'
    }
  ];

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const generateReport = async (reportId: string) => {
    setGenerating(reportId);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, this would call an API to generate and download the report
    setGenerating(null);
    
    // Show success message
    alert(`${reports.find(r => r.id === reportId)?.name} generated successfully!`);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'from-primary-400 to-primary-500 shadow-primary-400/20',
      blue: 'from-blue-400 to-blue-500 shadow-blue-400/20',
      green: 'from-green-400 to-green-500 shadow-green-400/20',
      purple: 'from-purple-400 to-purple-500 shadow-purple-400/20',
      yellow: 'from-yellow-400 to-yellow-500 shadow-yellow-400/20',
      orange: 'from-orange-400 to-orange-500 shadow-orange-400/20',
      pink: 'from-pink-400 to-pink-500 shadow-pink-400/20',
      indigo: 'from-indigo-400 to-indigo-500 shadow-indigo-400/20'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1">Reports</h1>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Generate and download business reports
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Select Time Period</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded ${
                selectedPeriod === period.value
                  ? 'bg-primary-400 text-black'
                  : 'bg-black/50 text-white hover:bg-black/70 border border-white/20'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
        {selectedPeriod === 'custom' && (
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Start Date</label>
              <input
                type="date"
                className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">End Date</label>
              <input
                type="date"
                className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, index) => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg hover:border-primary-400/50 transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(report.color)} flex items-center justify-center shadow-lg rounded`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">{report.name}</h3>
                  <p className="text-gray-400 text-xs">{report.description}</p>
                </div>
              </div>

              <button
                onClick={() => generateReport(report.id)}
                disabled={isGenerating}
                className={`w-full px-4 py-2 font-bold uppercase tracking-wider text-xs transition-all rounded flex items-center justify-center gap-2 ${
                  isGenerating
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-400 hover:bg-primary-500 text-black hover:scale-105 active:scale-95'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Export Formats */}
      <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">Export Formats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['PDF', 'Excel', 'CSV', 'JSON'].map((format) => (
            <div key={format} className="bg-black/30 p-3 rounded border border-white/10 text-center">
              <FileText className="w-8 h-8 text-primary-400 mx-auto mb-2" />
              <span className="text-white font-bold text-sm">{format}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-primary-400/10 to-transparent border-l-2 border-primary-400 p-4 rounded-r">
        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-400" />
          Report Information
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Reports are generated based on the selected time period</li>
          <li>• All reports include detailed analytics and visualizations</li>
          <li>• Reports can be exported in multiple formats (PDF, Excel, CSV, JSON)</li>
          <li>• Generated reports are automatically saved to your downloads folder</li>
          <li>• Historical reports can be accessed from the Reports Archive</li>
        </ul>
      </div>
    </div>
  );
}

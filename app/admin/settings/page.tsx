'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Store,
  Mail,
  Bell,
  Lock,
  Palette,
  Globe,
  CreditCard,
  Shield,
  Save,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'payment', label: 'Payment', icon: CreditCard }
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1">Settings</h1>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <SettingsIcon className="w-3.5 h-3.5" />
            Configure your store settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 font-bold uppercase tracking-wider text-xs transition-all rounded flex items-center gap-2 ${
            saving
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-black hover:scale-105 active:scale-95'
          }`}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-primary-400 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-semibold text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4">General Settings</h2>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Store Name</label>
                  <input
                    type="text"
                    defaultValue="Agnishila - Pure Himalayan Shilajit"
                    className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Store Description</label>
                  <textarea
                    rows={3}
                    defaultValue="Premium quality Himalayan Shilajit products for health and wellness"
                    className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="info@agnishila.in"
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Store Address</label>
                  <textarea
                    rows={2}
                    defaultValue="123 Business Street, Mumbai, Maharashtra 400001, India"
                    className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Store Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-black/50 border border-white/20 rounded flex items-center justify-center">
                      <Store className="w-8 h-8 text-gray-600" />
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-all border border-white/20 rounded flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Logo
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4">Email Settings</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">SMTP Host</label>
                    <input
                      type="text"
                      placeholder="smtp.gmail.com"
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">SMTP Port</label>
                    <input
                      type="number"
                      placeholder="587"
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">SMTP Username</label>
                  <input
                    type="email"
                    placeholder="your-email@gmail.com"
                    className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">SMTP Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 pr-10 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-white text-sm">Send order confirmation emails</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-white text-sm">Send shipping notification emails</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-white text-sm">Send promotional emails</span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4">Notification Settings</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded border border-white/10">
                    <h3 className="text-white font-bold mb-3">Order Notifications</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-gray-300 text-sm">New order received</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-gray-300 text-sm">Order status changed</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-gray-300 text-sm">Order cancelled</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-black/30 p-4 rounded border border-white/10">
                    <h3 className="text-white font-bold mb-3">Product Notifications</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-gray-300 text-sm">Low stock alert</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-gray-300 text-sm">Out of stock alert</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-gray-300 text-sm">New product added</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-black/30 p-4 rounded border border-white/10">
                    <h3 className="text-white font-bold mb-3">Customer Notifications</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-gray-300 text-sm">New customer registration</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-gray-300 text-sm">New review submitted</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-gray-300 text-sm">Newsletter subscription</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4">Security Settings</h2>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                  />
                </div>

                <div className="bg-primary-400/10 border-l-2 border-primary-400 p-4 rounded-r">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-primary-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Password Requirements</h3>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Contains uppercase and lowercase letters</li>
                        <li>• Contains at least one number</li>
                        <li>• Contains at least one special character</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-white text-sm">Enable two-factor authentication</span>
                  </label>
                </div>

                <button className="px-6 py-2 bg-primary-400 hover:bg-primary-500 text-black font-bold uppercase tracking-wider text-xs transition-all hover:scale-105 rounded">
                  Update Password
                </button>
              </motion.div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4">Appearance Settings</h2>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      defaultValue="#D4AF37"
                      className="w-16 h-10 bg-black/50 border border-white/20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      defaultValue="#D4AF37"
                      className="flex-1 bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Theme Mode</label>
                  <select className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded">
                    <option value="dark">Dark Mode</option>
                    <option value="light">Light Mode</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-white text-sm">Show product ratings</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-white text-sm">Enable animations</span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4">Payment Settings</h2>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Razorpay Key ID</label>
                  <input
                    type="text"
                    defaultValue="rzp_test_RKkNoqkW7sQisX"
                    className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Razorpay Key Secret</label>
                  <input
                    type="password"
                    defaultValue="Dfe20218e1WYafVRRZQUH9Qx"
                    className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Currency</label>
                  <select className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-all text-sm rounded">
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-white text-sm">Enable Razorpay payments</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-white text-sm">Enable Cash on Delivery</span>
                  </label>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

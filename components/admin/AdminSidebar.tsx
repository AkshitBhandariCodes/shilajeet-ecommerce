'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Star, 
  Settings,
  BarChart3,
  FileText,
  Truck,
  Mail,
  Tag,
  Image as ImageIcon,
  BookOpen
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/coupons', icon: Tag, label: 'Coupons' },
  { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
  { href: '/admin/reviews', icon: Star, label: 'Reviews' },
  { href: '/admin/blogs', icon: BookOpen, label: 'Blog' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/carousel-hero', icon: ImageIcon, label: 'Carousel Hero' },
  { href: '/admin/hero-settings', icon: ImageIcon, label: 'Hero Section' },
  { href: '/admin/reports', icon: FileText, label: 'Reports' },
  { href: '/admin/shipping', icon: Truck, label: 'Shipping' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:relative top-0 left-0 z-50 w-64 h-screen bg-gradient-to-b from-jet-900 to-black border-r border-white/20 shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-black/30 h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-400/30">
              <div className="w-4 h-4 bg-black transform rotate-45"></div>
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wider">AGNISHILA</div>
              <div className="text-[10px] text-primary-400 uppercase tracking-widest font-semibold">Admin</div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 overflow-y-auto h-[calc(100vh-140px)]">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center space-x-2.5 px-3 py-2.5 transition-all duration-200 relative group rounded-sm ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-400/20 to-transparent text-primary-400 border-r-2 border-primary-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className={`p-1 rounded ${isActive ? 'bg-primary-400/20' : 'group-hover:bg-white/10'}`}>
                      <Icon size={16} />
                    </div>
                    <span className="font-semibold uppercase tracking-wider text-[11px]">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary-400"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/20 bg-black/50 backdrop-blur-sm h-16">
          <div className="text-center space-y-0.5">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Agnishila v1.0.0</div>
            <div className="flex items-center justify-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-green-400 font-semibold">Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
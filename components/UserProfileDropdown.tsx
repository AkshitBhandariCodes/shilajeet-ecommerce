'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  CreditCard,
  Bell,
  Heart,
  Star
} from 'lucide-react';

interface UserProfileDropdownProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    initials: string;
  };
  onLogout: () => Promise<void>;
}

export default function UserProfileDropdown({ user, onLogout }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems: Array<{
    icon: React.ReactElement;
    label: string;
    description: string;
    action: () => void;
    badge?: string;
  }> = [
    {
      icon: <User size={16} />,
      label: 'My Profile',
      description: 'Manage your account settings',
      action: () => window.location.href = '/profile'
    },
    {
      icon: <Package size={16} />,
      label: 'My Orders',
      description: 'Track your order status',
      action: () => window.location.href = '/orders'
    },
    {
      icon: <MapPin size={16} />,
      label: 'Addresses',
      description: 'Manage shipping addresses',
      action: () => window.location.href = '/addresses'
    },
    {
      icon: <CreditCard size={16} />,
      label: 'Payment Methods',
      description: 'Manage payment options',
      action: () => window.location.href = '/payment-methods'
    },
    {
      icon: <Heart size={16} />,
      label: 'Wishlist',
      description: 'Your saved products',
      action: () => window.location.href = '/wishlist'
    },
    {
      icon: <Bell size={16} />,
      label: 'Notifications',
      description: 'Manage your preferences',
      action: () => window.location.href = '/notifications',
      badge: 'New'
    },
    {
      icon: <Settings size={16} />,
      label: 'Account Settings',
      description: 'Privacy and security',
      action: () => window.location.href = '/profile'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center space-x-3 text-white hover:text-primary-400 transition-colors group"
      >
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 object-cover border-2 border-white/20 group-hover:border-primary-400/50 transition-colors"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-2 border-white/20 group-hover:border-primary-400/50 transition-colors">
              <span className="text-black font-bold text-sm">{user.initials}</span>
            </div>
          )}
          
          {/* Online Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-black"></div>
        </div>

        {/* User Info */}
        <div className="hidden lg:block text-left">
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-gray-400">Premium Member</div>
        </div>

        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 bg-jet-900 border border-white/20 shadow-2xl z-50 overflow-hidden"
          >
            {/* Sharp corner accents */}
            <div className="absolute top-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-t-[20px] border-t-primary-400/30"></div>
            <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-primary-400/30"></div>

            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-jet-800 to-jet-900">
              <div className="flex items-center space-x-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 object-cover border-2 border-primary-400/50"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-2 border-primary-400/50">
                    <span className="text-black font-bold">{user.initials}</span>
                  </div>
                )}
                <div>
                  <div className="text-white font-bold text-lg">{user.name}</div>
                  <div className="text-gray-400 text-sm">{user.email}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-3 h-3 text-primary-400 fill-current" />
                    <span className="text-xs text-primary-400 uppercase tracking-wider font-medium">Premium Member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  className="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors group flex items-center space-x-4"
                >
                  <div className="text-gray-400 group-hover:text-primary-400 transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm uppercase tracking-wider">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="bg-primary-400 text-black text-xs px-2 py-0.5 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">{item.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-4">
              <motion.button
                onClick={async () => {
                  await onLogout();
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-3 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-600/50 transition-all duration-300 font-bold uppercase tracking-wider text-sm"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
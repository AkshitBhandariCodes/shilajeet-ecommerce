'use client';

import { Menu, Bell, Search, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-jet-900 to-black border-b border-white/20 px-4 md:px-6 py-3 shadow-lg backdrop-blur-sm h-16 flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Left Side */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded"
          >
            <Menu size={20} />
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse"></div>
            <h1 className="text-lg font-bold text-white uppercase tracking-wider">
              Admin Dashboard
            </h1>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 group-focus-within:text-primary-400 transition-colors" />
            <input
              type="text"
              placeholder="Search orders, customers, products..."
              className="w-full bg-black/50 border border-white/20 text-white pl-9 pr-3 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all text-sm placeholder:text-gray-500 hover:bg-black/70 rounded"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <button className="relative text-gray-400 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded group">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg shadow-red-500/50">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 pl-2 ml-2 border-l border-white/20">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-400/30 rounded">
              <span className="text-black font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden lg:block">
              <div className="text-white font-semibold text-xs leading-tight">{user?.name}</div>
              <div className="text-gray-400 text-[10px] uppercase tracking-wider">Admin</div>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-red-400 transition-all p-1.5 hover:bg-red-400/10 rounded"
              title="Logout"
            >
              <User size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
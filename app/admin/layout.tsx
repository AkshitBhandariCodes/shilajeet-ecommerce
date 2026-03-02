'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Allow login page to render without authentication
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isLoginPage && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, user, isLoading, router, isLoginPage]);

  // Show loading state
  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-jet-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-primary-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <div className="text-white font-bold uppercase tracking-wider mb-2">Loading Admin Panel</div>
          <div className="text-gray-400 text-sm">Please wait...</div>
        </div>
      </div>
    );
  }

  // Render login page without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Redirect if not authenticated (except login page)
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  // Render admin layout for authenticated users
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main Content with Scroll */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-black via-jet-950 to-black">
          <div className="p-4 md:p-6">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </div>
          
          {/* Footer */}
          <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm py-3 px-4 md:px-6 mt-8">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span>© 2025 Agnishila</span>
                <span className="text-gray-700">|</span>
                <span>All rights reserved</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Made with ❤️ for Agnishila</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
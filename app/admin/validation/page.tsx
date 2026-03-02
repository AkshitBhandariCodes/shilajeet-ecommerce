'use client';

import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function ValidationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-jet-950">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Validation</h1>
            <div className="bg-jet-900 border border-white/20 rounded-lg p-6">
              <p className="text-gray-400">Validation page content coming soon...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

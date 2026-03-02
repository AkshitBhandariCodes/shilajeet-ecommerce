'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  totalOrders?: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      if (response.ok) {
        const data = await response.json();
        // Map the API response to match our interface
        const formattedCustomers = data.map((customer: any) => ({
          _id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          address: customer.address || '',
          createdAt: customer.joinDate,
          totalOrders: customer.orderCount || 0
        }));
        setCustomers(formattedCustomers);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-white font-bold uppercase tracking-wider text-sm">Loading Customers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1">Customers</h1>
        <p className="text-gray-400 text-sm">Manage your customer base</p>
      </div>

      <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary-400" />
          <span className="text-2xl font-bold text-white">{customers.length}</span>
        </div>
        <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Total Customers</div>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">No Customers Yet</h3>
          <p className="text-gray-400">Customers will appear here once they place orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer, index) => (
            <motion.div
              key={customer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg hover:border-primary-400/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary-400/20 rounded-full flex items-center justify-center">
                  <span className="text-primary-400 font-bold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold">{customer.name}</h3>
                  <p className="text-gray-400 text-xs">{customer.totalOrders || 0} orders</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs">{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs">Joined {new Date(customer.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

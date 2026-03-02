'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    MapPin,
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
    Home,
    Building,
    Check
} from 'lucide-react';

interface Address {
    id: string;
    type: 'home' | 'work' | 'other';
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        
        // For now, show mock data since this would require additional backend setup
        setAddresses([
            {
                id: '1',
                type: 'home',
                firstName: 'John',
                lastName: 'Doe',
                address1: '123 Main Street',
                address2: 'Apartment 4B',
                city: 'Mumbai',
                state: 'Maharashtra',
                zipCode: '400001',
                country: 'India',
                phone: '+91 98765 43210',
                isDefault: true
            },
            {
                id: '2',
                type: 'work',
                firstName: 'John',
                lastName: 'Doe',
                address1: '456 Business Park',
                city: 'Mumbai',
                state: 'Maharashtra',
                zipCode: '400002',
                country: 'India',
                phone: '+91 98765 43210',
                isDefault: false
            }
        ]);
        setLoading(false);
    }, [isAuthenticated, isLoading, router]);

    const getAddressIcon = (type: string) => {
        switch (type) {
            case 'home':
                return <Home className="w-5 h-5 text-primary-400" />;
            case 'work':
                return <Building className="w-5 h-5 text-primary-400" />;
            default:
                return <MapPin className="w-5 h-5 text-primary-400" />;
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading addresses...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <main className="min-h-screen bg-black relative">
            {/* Universal background */}
            <div className="fixed inset-0 z-0">
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url(https://res.cloudinary.com/dsejv31js/image/upload/v1767090389/agnishila/bg/vd.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed'
                    }}
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <Navbar />

                <section className="pt-32 pb-20 bg-transparent relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-16 left-16 w-24 h-24 border-l-2 border-t-2 border-primary-400/20"></div>
                    <div className="absolute bottom-16 right-16 w-24 h-24 border-r-2 border-b-2 border-primary-400/20"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors mb-4"
                            >
                                <ArrowLeft size={20} />
                                <span className="text-sm uppercase tracking-wider">Back</span>
                            </button>
                            <h1 className="text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">
                                My Addresses
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Manage your shipping addresses
                            </p>
                        </div>
                        <MapPin className="w-16 h-16 text-primary-400" />
                    </div>

                    {/* Add Address Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center space-x-2 bg-primary-400 text-black px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Add New Address</span>
                        </button>
                    </motion.div>

                    {/* Addresses List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
                        </div>
                    ) : addresses.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <MapPin className="w-24 h-24 text-gray-600 mx-auto mb-8" />
                            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
                                No Addresses Saved
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Add an address to make checkout faster
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {addresses.map((address, index) => (
                                <motion.div
                                    key={address.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-jet-900 border border-white/20 p-6 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            {getAddressIcon(address.type)}
                                            <div>
                                                <h3 className="text-white font-bold text-lg capitalize">
                                                    {address.type} Address
                                                </h3>
                                                {address.isDefault && (
                                                    <div className="flex items-center space-x-1 mt-1">
                                                        <Check className="w-4 h-4 text-green-400" />
                                                        <span className="text-green-400 text-sm font-medium">Default</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button className="text-gray-400 hover:text-primary-400 transition-colors p-1">
                                                <Edit size={16} />
                                            </button>
                                            <button className="text-gray-400 hover:text-red-400 transition-colors p-1">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-gray-300 space-y-1">
                                        <div className="font-medium">
                                            {address.firstName} {address.lastName}
                                        </div>
                                        <div>{address.address1}</div>
                                        {address.address2 && <div>{address.address2}</div>}
                                        <div>
                                            {address.city}, {address.state} {address.zipCode}
                                        </div>
                                        <div>{address.country}</div>
                                        <div className="pt-2 border-t border-white/10 mt-2">
                                            <div className="text-sm">{address.phone}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Quick Actions */}
                    {addresses.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 bg-jet-900 border border-white/20 p-6 text-center relative overflow-hidden"
                        >
                            <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
                            
                            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
                                Quick Actions
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push('/products')}
                                    className="bg-primary-400 text-black px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    onClick={() => router.push('/profile')}
                                    className="border border-white/20 text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                                >
                                    Back to Profile
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

                <Footer />
            </div>
        </main>
    );
}
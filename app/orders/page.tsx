'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    ArrowLeft,
    Eye,
    Star,
    Calendar
} from 'lucide-react';

interface Order {
    _id: string;
    orderNumber: string;
    items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
}

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Don't redirect while authentication is still loading
        if (isLoading) return;
        
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        fetchOrders();
    }, [isAuthenticated, isLoading, router]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            if (response.ok) {
                const ordersData = await response.json();
                setOrders(ordersData);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-400" />;
            case 'processing':
                return <Package className="w-5 h-5 text-blue-400" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-purple-400" />;
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
            case 'processing':
                return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
            case 'shipped':
                return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
            case 'delivered':
                return 'text-green-400 bg-green-400/20 border-green-400/30';
            default:
                return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
        }
    };

    // Show loading spinner while authentication is being checked
    if (isLoading) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading your orders...</p>
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
                                My Orders
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Track and manage your orders
                            </p>
                        </div>
                        <Package className="w-16 h-16 text-primary-400" />
                    </div>

                    {/* Orders Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <Package className="w-24 h-24 text-gray-600 mx-auto mb-8" />
                            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
                                No Orders Yet
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Start shopping to see your orders here
                            </p>
                            <button
                                onClick={() => router.push('/products')}
                                className="bg-primary-400 text-black px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                            >
                                Browse Products
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {orders.map((order, index) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-jet-900 border border-white/20 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>

                                    <div className="p-8">
                                        {/* Order Header */}
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                                            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                                                {getStatusIcon(order.status)}
                                                <div>
                                                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                                                        Order #{order.orderNumber}
                                                    </h3>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <span className="text-gray-400 text-sm">
                                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary-400 mb-2">
                                                    ₹{order.totalAmount}
                                                </div>
                                                <button 
                                                    onClick={() => router.push(`/orders/${order._id}`)}
                                                    className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors"
                                                >
                                                    <Eye size={16} />
                                                    <span className="text-sm uppercase tracking-wider">View Details</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            {order.items.map((item, itemIndex) => (
                                                <div key={itemIndex} className="bg-black border border-white/10 p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-primary-400/20 flex items-center justify-center">
                                                            <div className="w-6 h-6 bg-primary-400 transform rotate-45"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-white font-bold text-sm">{item.name}</h4>
                                                            <div className="text-gray-400 text-xs">
                                                                Qty: {item.quantity} × ₹{item.price}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="bg-black border border-white/10 p-4">
                                            <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-sm">
                                                Shipping Address
                                            </h4>
                                            <div className="text-gray-300 text-sm">
                                                <div>{order.shippingAddress.fullName}</div>
                                                <div>{order.shippingAddress.address}</div>
                                                <div>
                                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                                </div>
                                                <div>Phone: {order.shippingAddress.phone}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

                <Footer />
            </div>
        </main>
    );
}
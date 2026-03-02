'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderTracking from '@/components/OrderTracking';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    ArrowLeft,
    MapPin,
    CreditCard,
    Calendar,
    Phone,
    Mail,
    User
} from 'lucide-react';

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface ShippingAddress {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    total: number;
    subtotal: number;
    tax: number;
    shipping: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    shippingAddress: ShippingAddress;
    payment: {
        cardNumber: string;
        cardholderName: string;
        paymentMethod: string;
        transactionId?: string;
    };
    trackingNumber?: string;
}

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading) return;
        
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        
        if (params.orderId) {
            fetchOrderDetails();
        }
    }, [isAuthenticated, isLoading, params.orderId, router]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/api/orders/${params.orderId}`);
            if (response.ok) {
                const orderData = await response.json();
                setOrder(orderData);
            } else if (response.status === 404) {
                setError('Order not found');
            } else {
                setError('Failed to load order details');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-6 h-6 text-yellow-400" />;
            case 'confirmed':
            case 'processing':
                return <Package className="w-6 h-6 text-blue-400" />;
            case 'shipped':
                return <Truck className="w-6 h-6 text-purple-400" />;
            case 'delivered':
                return <CheckCircle className="w-6 h-6 text-green-400" />;
            default:
                return <Clock className="w-6 h-6 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
            case 'confirmed':
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

    const getStatusSteps = (currentStatus: string) => {
        const steps = [
            { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
            { key: 'processing', label: 'Processing', icon: Package },
            { key: 'shipped', label: 'Shipped', icon: Truck },
            { key: 'delivered', label: 'Delivered', icon: CheckCircle }
        ];

        const statusOrder = ['confirmed', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(currentStatus);

        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            active: index === currentIndex
        }));
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading order details...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (error || !order) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <Package className="w-24 h-24 text-gray-600 mx-auto mb-8" />
                        <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
                            {error || 'Order Not Found'}
                        </h1>
                        <button
                            onClick={() => router.push('/orders')}
                            className="bg-primary-400 text-black px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const statusSteps = getStatusSteps(order.status);

    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            <section className="pt-32 pb-20 bg-black relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-16 left-16 w-24 h-24 border-l-2 border-t-2 border-primary-400/20"></div>
                    <div className="absolute bottom-16 right-16 w-24 h-24 border-r-2 border-b-2 border-primary-400/20"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <button
                                onClick={() => router.push('/orders')}
                                className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors mb-4"
                            >
                                <ArrowLeft size={20} />
                                <span className="text-sm uppercase tracking-wider">Back to Orders</span>
                            </button>
                            <h1 className="text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">
                                Order #{order.orderNumber}
                            </h1>
                            <div className="flex items-center space-x-4 mt-4">
                                <span className="text-gray-400">
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
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
                        {getStatusIcon(order.status)}
                    </div>

                    {/* Order Status Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-jet-900 border border-white/20 p-8 mb-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
                        
                        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Order Status</h2>
                        
                        <div className="flex items-center justify-between">
                            {statusSteps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.key} className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                            step.completed 
                                                ? 'bg-primary-400 text-black' 
                                                : 'bg-gray-600 text-gray-400'
                                        }`}>
                                            <Icon size={20} />
                                        </div>
                                        <span className={`text-sm font-medium uppercase tracking-wider ${
                                            step.completed ? 'text-primary-400' : 'text-gray-400'
                                        }`}>
                                            {step.label}
                                        </span>
                                        {index < statusSteps.length - 1 && (
                                            <div className={`absolute top-6 w-full h-0.5 ${
                                                step.completed ? 'bg-primary-400' : 'bg-gray-600'
                                            }`} style={{ 
                                                left: `${(100 / statusSteps.length) * (index + 0.5)}%`,
                                                width: `${100 / statusSteps.length}%`
                                            }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {order.trackingNumber && (
                            <div className="mt-6 pt-6 border-t border-white/20">
                                <div className="flex items-center space-x-2">
                                    <Truck className="w-5 h-5 text-primary-400" />
                                    <span className="text-white font-bold">Tracking Number:</span>
                                    <span className="text-primary-400 font-mono">{order.trackingNumber}</span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Tracking Information */}
                    {order.trackingNumber && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <OrderTracking waybill={order.trackingNumber} />
                        </motion.div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
                                
                                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Order Items</h2>
                                
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="bg-black border border-white/10 p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-primary-400/20 flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-primary-400 transform rotate-45"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-white font-bold text-lg">{item.name}</h3>
                                                    <div className="text-gray-400 mt-1">
                                                        Quantity: {item.quantity} × ₹{item.price}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-primary-400 font-bold text-lg">
                                                        ₹{item.price * item.quantity}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="mt-8 pt-6 border-t border-white/20">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-gray-300">
                                            <span>Subtotal:</span>
                                            <span>₹{order.subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-300">
                                            <span>Shipping:</span>
                                            <span className="text-primary-400 font-bold">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                                        </div>
                                        <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/20">
                                            <span>Total:</span>
                                            <span className="text-primary-400">₹{order.total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Details Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            {/* Shipping Address */}
                            <div className="bg-jet-900 border border-white/20 p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30"></div>
                                
                                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-primary-400" />
                                    Shipping Address
                                </h3>
                                
                                <div className="text-gray-300 space-y-1">
                                    <div className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
                                    <div>{order.shippingAddress.address1}</div>
                                    {order.shippingAddress.address2 && <div>{order.shippingAddress.address2}</div>}
                                    <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
                                    <div>{order.shippingAddress.country}</div>
                                    <div className="pt-2 border-t border-white/10 mt-2">
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-primary-400" />
                                            <span>{order.shippingAddress.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Mail className="w-4 h-4 text-primary-400" />
                                            <span>{order.shippingAddress.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-jet-900 border border-white/20 p-6 relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-b-[20px] border-b-primary-400/30"></div>
                                
                                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-primary-400" />
                                    Payment Details
                                </h3>
                                
                                <div className="text-gray-300 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Method:</span>
                                        <span className="font-medium">{order.payment.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Card:</span>
                                        <span className="font-mono">{order.payment.cardNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Cardholder:</span>
                                        <span>{order.payment.cardholderName}</span>
                                    </div>
                                    {order.payment.transactionId && (
                                        <div className="flex justify-between">
                                            <span>Transaction ID:</span>
                                            <span className="font-mono text-xs">{order.payment.transactionId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
    Shield,
    Check
} from 'lucide-react';

interface PaymentMethod {
    id: string;
    type: 'card' | 'upi' | 'netbanking';
    cardNumber?: string;
    cardholderName?: string;
    expiryMonth?: string;
    expiryYear?: string;
    upiId?: string;
    bankName?: string;
    isDefault: boolean;
}

export default function PaymentMethodsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        
        // For now, show mock data since this would require additional backend setup
        setPaymentMethods([
            {
                id: '1',
                type: 'card',
                cardNumber: '**** **** **** 1234',
                cardholderName: 'John Doe',
                expiryMonth: '12',
                expiryYear: '25',
                isDefault: true
            },
            {
                id: '2',
                type: 'upi',
                upiId: 'john@paytm',
                isDefault: false
            }
        ]);
        setLoading(false);
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading payment methods...</p>
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
                                Payment Methods
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Manage your saved payment methods
                            </p>
                        </div>
                        <CreditCard className="w-16 h-16 text-primary-400" />
                    </div>

                    {/* Add Payment Method Button */}
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
                            <span>Add Payment Method</span>
                        </button>
                    </motion.div>

                    {/* Payment Methods List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
                        </div>
                    ) : paymentMethods.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <CreditCard className="w-24 h-24 text-gray-600 mx-auto mb-8" />
                            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
                                No Payment Methods
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Add a payment method to make checkout faster
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {paymentMethods.map((method, index) => (
                                <motion.div
                                    key={method.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-jet-900 border border-white/20 p-6 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-primary-400/20 flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-primary-400" />
                                            </div>
                                            <div>
                                                {method.type === 'card' && (
                                                    <>
                                                        <h3 className="text-white font-bold text-lg">
                                                            {method.cardNumber}
                                                        </h3>
                                                        <p className="text-gray-400">
                                                            {method.cardholderName} • Expires {method.expiryMonth}/{method.expiryYear}
                                                        </p>
                                                    </>
                                                )}
                                                {method.type === 'upi' && (
                                                    <>
                                                        <h3 className="text-white font-bold text-lg">UPI</h3>
                                                        <p className="text-gray-400">{method.upiId}</p>
                                                    </>
                                                )}
                                                {method.isDefault && (
                                                    <div className="flex items-center space-x-1 mt-2">
                                                        <Check className="w-4 h-4 text-green-400" />
                                                        <span className="text-green-400 text-sm font-medium">Default</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button className="text-gray-400 hover:text-primary-400 transition-colors p-2">
                                                <Edit size={16} />
                                            </button>
                                            <button className="text-gray-400 hover:text-red-400 transition-colors p-2">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Security Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 bg-jet-900 border border-white/20 p-6 relative overflow-hidden"
                    >
                        <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
                        
                        <div className="flex items-start space-x-4">
                            <Shield className="w-6 h-6 text-primary-400 mt-1" />
                            <div>
                                <h3 className="text-white font-bold mb-2 uppercase tracking-wider">
                                    Your Payment Information is Secure
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    We use industry-standard encryption to protect your payment information. 
                                    Your card details are never stored on our servers and are processed securely 
                                    through our payment partners.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

                <Footer />
            </div>
        </main>
    );
}
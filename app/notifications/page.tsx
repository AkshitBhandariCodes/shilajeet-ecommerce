'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    Bell,
    ArrowLeft,
    Settings,
    Mail,
    Package,
    Heart,
    Star,
    Check,
    X
} from 'lucide-react';

interface NotificationSettings {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    productRecommendations: boolean;
    reviewReminders: boolean;
    wishlistAlerts: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
}

export default function NotificationsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [settings, setSettings] = useState<NotificationSettings>({
        orderUpdates: true,
        promotions: true,
        newsletter: true,
        productRecommendations: false,
        reviewReminders: true,
        wishlistAlerts: false,
        emailNotifications: true,
        smsNotifications: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSettingChange = (key: keyof NotificationSettings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        alert('Notification preferences saved successfully!');
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading notifications...</p>
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
                                Notifications
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Manage your notification preferences
                            </p>
                        </div>
                        <Bell className="w-16 h-16 text-primary-400" />
                    </div>

                    <div className="space-y-8">
                        {/* Email & SMS Preferences */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
                            
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider flex items-center">
                                <Settings className="w-6 h-6 mr-3 text-primary-400" />
                                Delivery Methods
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-black border border-white/10">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-5 h-5 text-primary-400" />
                                        <div>
                                            <h3 className="text-white font-bold">Email Notifications</h3>
                                            <p className="text-gray-400 text-sm">Receive notifications via email</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSettingChange('emailNotifications')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.emailNotifications ? 'bg-primary-400' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-black border border-white/10">
                                    <div className="flex items-center space-x-3">
                                        <Bell className="w-5 h-5 text-primary-400" />
                                        <div>
                                            <h3 className="text-white font-bold">SMS Notifications</h3>
                                            <p className="text-gray-400 text-sm">Receive notifications via SMS</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSettingChange('smsNotifications')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.smsNotifications ? 'bg-primary-400' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.smsNotifications ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Notification Types */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
                        >
                            <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
                            
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">
                                Notification Types
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-black border border-white/10">
                                    <div className="flex items-center space-x-3">
                                        <Package className="w-5 h-5 text-primary-400" />
                                        <div>
                                            <h3 className="text-white font-bold">Order Updates</h3>
                                            <p className="text-gray-400 text-sm">Get notified about order status changes</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSettingChange('orderUpdates')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.orderUpdates ? 'bg-primary-400' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.orderUpdates ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-black border border-white/10">
                                    <div className="flex items-center space-x-3">
                                        <Star className="w-5 h-5 text-primary-400" />
                                        <div>
                                            <h3 className="text-white font-bold">Promotions & Offers</h3>
                                            <p className="text-gray-400 text-sm">Receive exclusive deals and discounts</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSettingChange('promotions')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.promotions ? 'bg-primary-400' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.promotions ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-black border border-white/10">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-5 h-5 text-primary-400" />
                                        <div>
                                            <h3 className="text-white font-bold">Newsletter</h3>
                                            <p className="text-gray-400 text-sm">Weekly wellness tips and product updates</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSettingChange('newsletter')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.newsletter ? 'bg-primary-400' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.newsletter ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-black border border-white/10">
                                    <div className="flex items-center space-x-3">
                                        <Package className="w-5 h-5 text-primary-400" />
                                        <div>
                                            <h3 className="text-white font-bold">Product Recommendations</h3>
                                            <p className="text-gray-400 text-sm">Personalized product suggestions</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSettingChange('productRecommendations')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.productRecommendations ? 'bg-primary-400' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.productRecommendations ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-black border border-white/10">
                                    <div className="flex items-center space-x-3">
                                        <Star className="w-5 h-5 text-primary-400" />
                                        <div>
                                            <h3 className="text-white font-bold">Review Reminders</h3>
                                            <p className="text-gray-400 text-sm">Reminders to review purchased products</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSettingChange('reviewReminders')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.reviewReminders ? 'bg-primary-400' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.reviewReminders ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-black border border-white/10">
                                    <div className="flex items-center space-x-3">
                                        <Heart className="w-5 h-5 text-primary-400" />
                                        <div>
                                            <h3 className="text-white font-bold">Wishlist Alerts</h3>
                                            <p className="text-gray-400 text-sm">Notifications when wishlist items go on sale</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSettingChange('wishlistAlerts')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.wishlistAlerts ? 'bg-primary-400' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.wishlistAlerts ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Save Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-center"
                        >
                            <button
                                onClick={handleSaveSettings}
                                disabled={loading}
                                className="bg-primary-400 text-black px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        <span>Save Preferences</span>
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

                <Footer />
            </div>
        </main>
    );
}
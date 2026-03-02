'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit3,
    Save,
    X,
    Shield,
    Star,
    Package,
    Heart,
    CreditCard
} from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: ''
    });

    useEffect(() => {
        // Don't redirect while authentication is still loading
        if (isLoading) return;
        
        // Only redirect if we're sure the user is not authenticated
        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        // Set profile data when user is available
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth || ''
            });
        }
    }, [isAuthenticated, isLoading, user, router]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                updateUser(updatedUser);
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth || ''
            });
        }
        setIsEditing(false);
    };

    // Show loading spinner while authentication is being checked
    if (isLoading) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading your profile...</p>
                    </div>
                </div>
            </main>
        );
    }

    // Don't render anything if not authenticated (will redirect)
    if (!isAuthenticated || !user) {
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
                            My Profile
                        </h1>
                        <p className="text-gray-400 text-lg">Manage your account settings and preferences</p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>

                                <div className="text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 mx-auto mb-6 flex items-center justify-center">
                                        <span className="text-black font-bold text-2xl">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">
                                        {user.name}
                                    </h2>
                                    <div className="flex items-center justify-center space-x-2 mb-4">
                                        <Star className="w-4 h-4 text-primary-400 fill-current" />
                                        <span className="text-primary-400 text-sm uppercase tracking-wider font-medium">
                                            Premium Member
                                        </span>
                                    </div>
                                    <p className="text-gray-400 mb-6">{user.email}</p>

                                    <div className="space-y-3">
                                        <button
                                            onClick={() => router.push('/orders')}
                                            className="w-full flex items-center justify-center space-x-2 bg-primary-400 text-black py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                                        >
                                            <Package size={16} />
                                            <span>View Orders</span>
                                        </button>
                                        <button
                                            onClick={() => router.push('/wishlist')}
                                            className="w-full flex items-center justify-center space-x-2 border border-white/20 text-white py-3 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                                        >
                                            <Heart size={16} />
                                            <span>Wishlist</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Profile Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>

                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
                                        Personal Information
                                    </h3>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 text-primary-400 hover:text-primary-500 transition-colors"
                                        >
                                            <Edit3 size={16} />
                                            <span className="text-sm uppercase tracking-wider">Edit</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleSave}
                                                disabled={loading}
                                                className="flex items-center space-x-2 bg-primary-400 text-black px-4 py-2 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors disabled:opacity-50"
                                            >
            
                                           <Save size={16} />
                                                <span>{loading ? 'Saving...' : 'Save'}</span>
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center space-x-2 border border-white/20 text-white px-4 py-2 font-bold uppercase tracking-wider text-sm hover:border-red-400 hover:text-red-400 transition-colors"
                                            >
                                                <X size={16} />
                                                <span>Cancel</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-white font-bold mb-2 uppercase tracking-wider text-sm">
                                            Full Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-3 p-3 bg-black border border-white/10">
                                                <User className="w-5 h-5 text-primary-400" />
                                                <span className="text-gray-300">{profileData.name || 'Not provided'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-white font-bold mb-2 uppercase tracking-wider text-sm">
                                            Email Address
                                        </label>
                                        <div className="flex items-center space-x-3 p-3 bg-black border border-white/10">
                                            <Mail className="w-5 h-5 text-primary-400" />
                                            <span className="text-gray-300">{profileData.email}</span>
                                            <span className="bg-green-600/20 text-green-400 px-2 py-1 text-xs font-bold uppercase tracking-wider border border-green-600/30">
                                                Verified
                                            </span>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-white font-bold mb-2 uppercase tracking-wider text-sm">
                                            Phone Number
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-3 p-3 bg-black border border-white/10">
                                                <Phone className="w-5 h-5 text-primary-400" />
                                                <span className="text-gray-300">{profileData.phone || 'Not provided'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-white font-bold mb-2 uppercase tracking-wider text-sm">
                                            Address
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                value={profileData.address}
                                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                                rows={3}
                                                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors resize-none"
                                                placeholder="Enter your address"
                                            />
                                        ) : (
                                            <div className="flex items-start space-x-3 p-3 bg-black border border-white/10">
                                                <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                                                <span className="text-gray-300">{profileData.address || 'Not provided'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <label className="block text-white font-bold mb-2 uppercase tracking-wider text-sm">
                                            Date of Birth
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={profileData.dateOfBirth}
                                                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                                                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-3 p-3 bg-black border border-white/10">
                                                <Calendar className="w-5 h-5 text-primary-400" />
                                                <span className="text-gray-300">
                                                    {profileData.dateOfBirth 
                                                        ? new Date(profileData.dateOfBirth).toLocaleDateString('en-IN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })
                                                        : 'Not provided'
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </section>

                <Footer />
            </div>
        </main>
    );
}
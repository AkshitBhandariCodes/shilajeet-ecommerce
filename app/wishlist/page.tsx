'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    Heart,
    ShoppingCart,
    Trash2,
    ArrowLeft,
    Star
} from 'lucide-react';

export default function WishlistPage() {
    const router = useRouter();
    const { wishlistItems, removeFromWishlist, loading } = useWishlist();
    const { addItem } = useCart();
    const { isAuthenticated, isLoading } = useAuth();
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    // Remove authentication redirect - allow all users to access wishlist

    const handleAddToCart = async (item: any) => {
        setAddingToCart(item.productId);
        
        await addItem({
            id: item.productId,
            name: item.productName,
            price: item.productPrice,
            image: item.productImage,
        });

        setTimeout(() => {
            setAddingToCart(null);
        }, 1000);
    };

    const handleRemoveFromWishlist = async (productId: string) => {
        await removeFromWishlist(productId);
    };

    // Show loading spinner while wishlist is being loaded
    if (loading && wishlistItems.length === 0) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading your wishlist...</p>
                    </div>
                </div>
            </main>
        );
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
                                My Wishlist
                            </h1>
                            <p className="text-gray-400 mt-2">
                                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
                            </p>
                            {!isAuthenticated && wishlistItems.length > 0 && (
                                <div className="mt-4 p-3 bg-primary-400/10 border border-primary-400/20 text-primary-300 text-sm">
                                    <p>💡 Sign up to sync your wishlist across devices and never lose your favorites!</p>
                                </div>
                            )}
                        </div>
                        <Heart className="w-16 h-16 text-primary-400 fill-current" />
                    </div>

                    {/* Wishlist Content */}
                    {wishlistItems.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <Heart className="w-24 h-24 text-gray-600 mx-auto mb-8" />
                            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
                                Your Wishlist is Empty
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                {isAuthenticated 
                                    ? "Start adding products you love to keep track of them"
                                    : "Add products to your wishlist to save them for later. Items will be saved locally and synced when you sign up."
                                }
                            </p>
                            <button
                                onClick={() => router.push('/products')}
                                className="bg-primary-400 text-black px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                            >
                                Browse Products
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wishlistItems.map((item, index) => (
                                <motion.div
                                    key={item._id || item.productId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-jet-900 border border-white/20 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>

                                    {/* Product Image */}
                                    <div className="aspect-square bg-jet-800 flex items-center justify-center p-8">
                                        <div className="w-32 h-32 bg-primary-400/20 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-primary-400 transform rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">
                                            {item.productName}
                                        </h3>
                                        
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="flex space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-primary-400 text-primary-400" />
                                                ))}
                                            </div>
                                            <span className="text-gray-400 text-sm">4.8</span>
                                        </div>

                                        <div className="text-2xl font-bold text-primary-400 mb-6">
                                            ₹{item.productPrice}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={addingToCart === item.productId}
                                                className="w-full bg-primary-400 text-black py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                            >
                                                <ShoppingCart size={16} />
                                                <span>
                                                    {addingToCart === item.productId ? 'Adding...' : 'Add to Cart'}
                                                </span>
                                            </button>

                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => router.push(`/products/${item.productId}`)}
                                                    className="flex-1 border border-white/20 text-white py-3 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveFromWishlist(item.productId)}
                                                    className="border border-red-600/30 text-red-400 px-4 py-3 hover:bg-red-600/10 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Added Date */}
                                    <div className="px-6 pb-6">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                                            Added {new Date(item.addedAt).toLocaleDateString('en-IN', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Quick Actions */}
                    {wishlistItems.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-16 bg-jet-900 border border-white/20 p-8 text-center"
                        >
                            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
                                Quick Actions
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push('/products')}
                                    className="bg-primary-400 text-black px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    onClick={() => router.push('/cart')}
                                    className="border border-white/20 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                                >
                                    View Cart
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
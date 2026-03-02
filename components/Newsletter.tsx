'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Send, Check, X, Loader, Zap, Star, CheckCircle } from 'lucide-react';
import SectionBlend from './SectionBlend';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setStatus('error');
            setMessage('Please enter your email address');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);
        setStatus('idle');

        // Simulate API call (replace with actual API endpoint)
        try {
            // For demo purposes, we'll simulate a successful subscription
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setStatus('success');
            setMessage('Successfully subscribed! Welcome to the Agnishila community.');
            setEmail('');
        } catch (error) {
            setStatus('error');
            setMessage('Failed to subscribe. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setStatus('idle');
        setMessage('');
        setEmail('');
    };

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Jet Black Background */}
            <div className="absolute inset-0 bg-black"></div>
            
            {/* Section blending for smooth transitions */}
            <div className="absolute inset-0">
                <SectionBlend position="top" height="xl" intensity="medium" />
            </div>

            {/* Geometric accents */}
            <div className="absolute inset-0 z-10">
                <div className="absolute top-20 left-20 w-24 h-24 border-l-2 border-t-2 border-gold-400/20"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 border-r-2 border-b-2 border-gold-400/20"></div>
                <div className="absolute top-1/2 left-1/4 w-2 h-16 bg-gradient-to-b from-gold-400/30 to-transparent"></div>
                <div className="absolute top-1/3 right-1/4 w-16 h-2 bg-gradient-to-r from-gold-400/30 to-transparent"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        <div className="w-12 h-1 bg-mauve-gradient"></div>
                        <span className="text-white-to-mauve font-medium text-sm uppercase tracking-[0.2em]">
                            Stay Connected
                        </span>
                        <div className="w-12 h-1 bg-mauve-gradient"></div>
                    </div>
                    
                    <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 uppercase tracking-wider">
                        UNLOCK
                        <span className="block text-white-to-mauve" style={{ display: 'inline-block', width: '100%' }}>EXCLUSIVE</span>
                        <span className="block text-white">INSIGHTS</span>
                    </h2>
                    
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Join thousands of high-performance individuals who receive exclusive wellness insights, 
                        product updates, and ancient wisdom delivered directly to their inbox.
                    </p>
                </motion.div>

                {/* Main Newsletter Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-jet-900 border border-gold-400/30 p-12 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-gold-400/50"></div>
                            <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-gold-400/50"></div>
                            
                            <div className="w-20 h-20 bg-mauve-gradient mx-auto mb-8 flex items-center justify-center">
                                <Check className="w-10 h-10 text-black" />
                            </div>
                            
                            <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
                                Welcome to the Elite Circle!
                            </h3>
                            
                            <p className="text-gray-300 mb-6 text-lg">{message}</p>
                            
                            <p className="text-gray-400 mb-8">
                                Check your email for exclusive content and prepare to unlock your potential.
                            </p>
                            
                            <button
                                onClick={resetForm}
                                className="border-mauve-gradient text-white-to-mauve hover:text-black hover:bg-mauve-gradient px-8 py-3 font-bold uppercase tracking-wider text-sm transition-all duration-300"
                            >
                                Subscribe Another Email
                            </button>
                        </motion.div>
                    ) : (
                        <div className="bg-jet-900 border border-white/20 relative overflow-hidden">
                            {/* Corner accents */}
                            <div className="absolute top-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-t-[24px] border-t-gold-500/30"></div>
                            <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[24px] border-r-transparent border-b-[24px] border-b-gold-500/30"></div>
                            
                            <div className="p-8 lg:p-12">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Email Input Section */}
                                    <div className="grid lg:grid-cols-3 gap-6 items-end">
                                        <div className="lg:col-span-2">
                                            <label className="block text-white font-bold mb-3 uppercase tracking-wider text-sm">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-black border-2 border-white/20 text-white px-6 py-4 text-lg focus:border-gold-400 focus:outline-none transition-all duration-300 placeholder-gray-500"
                                                placeholder="Enter your email address"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !email.trim()}
                                            className="bg-mauve-gradient hover:bg-mauve-shine text-white py-4 px-8 font-bold uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-mauve"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader className="w-5 h-5 animate-spin" />
                                                    <span>Joining...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="w-5 h-5" />
                                                    <span>Join Elite Circle</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Error Message */}
                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center space-x-3 text-red-400 bg-red-600/10 border border-red-600/30 p-4"
                                        >
                                            <X className="w-5 h-5 flex-shrink-0" />
                                            <span>{message}</span>
                                        </motion.div>
                                    )}

                                    {/* Privacy Notice */}
                                    <div className="pt-6 border-t border-white/10">
                                        <p className="text-xs text-gray-400 text-center leading-relaxed">
                                            By subscribing, you join our exclusive community and agree to receive premium content from Agnishila. 
                                            Unsubscribe anytime. Your privacy is protected - we never share your information.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Benefits Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="grid md:grid-cols-3 gap-8 mt-16"
                >
                    {[
                        {
                            icon: <Zap className="w-8 h-8" />,
                            title: 'Exclusive Insights',
                            description: 'Access premium wellness content and ancient wisdom before anyone else'
                        },
                        {
                            icon: <Star className="w-8 h-8" />,
                            title: 'VIP Access',
                            description: 'First access to new products, special discounts, and limited editions'
                        },
                        {
                            icon: <CheckCircle className="w-8 h-8" />,
                            title: 'Expert Guidance',
                            description: 'Personalized health tips and guidance from wellness professionals'
                        }
                    ].map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="w-16 h-16 bg-mauve-gradient mx-auto mb-6 flex items-center justify-center group-hover:bg-mauve-shine transition-all duration-300 transform group-hover:scale-110">
                                <div className="text-black">
                                    {benefit.icon}
                                </div>
                            </div>
                            <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-lg">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Social Proof */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-16 pt-12 border-t border-white/10"
                >
                    
                </motion.div>
            </div>
        </section>
    );
}
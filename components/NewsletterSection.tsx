'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight, Shield, Clock, Users, Zap } from 'lucide-react';
import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="py-32 bg-jet-950 relative overflow-hidden">
      {/* Sharp geometric background */}
      <div className="absolute inset-0">
        {/* Corner brackets */}
        <div className="absolute top-16 left-16 w-16 h-16 border-l-2 border-t-2 border-primary-400/20"></div>
        <div className="absolute top-16 right-16 w-16 h-16 border-r-2 border-t-2 border-primary-400/20"></div>
        <div className="absolute bottom-16 left-16 w-16 h-16 border-l-2 border-b-2 border-primary-400/20"></div>
        <div className="absolute bottom-16 right-16 w-16 h-16 border-r-2 border-b-2 border-primary-400/20"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-1 bg-primary-400"></div>
              <span className="text-primary-400 font-medium text-sm uppercase tracking-[0.2em]">
                Executive Updates
              </span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-none">
              STAY
              <span className="block text-primary-400">INFORMED</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 font-light leading-relaxed">
              Exclusive insights, product launches, and industry intelligence delivered to 
              high-performance professionals and wellness leaders.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-primary-400 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-black" />
                </div>
                <span className="text-gray-300 font-medium">Priority access to new products</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-primary-400 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-black" />
                </div>
                <span className="text-gray-300 font-medium">Exclusive research and studies</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-primary-400 flex items-center justify-center">
                  <Users className="w-3 h-3 text-black" />
                </div>
                <span className="text-gray-300 font-medium">VIP customer benefits</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary-400 mb-1 tracking-tight">25K+</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Professionals</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-400 mb-1 tracking-tight">Weekly</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Intelligence</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-400 mb-1 tracking-tight">Zero</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Spam Policy</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Newsletter Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-jet-900 border border-white/20 p-12 relative overflow-hidden">
              {/* Sharp corner accents */}
              <div className="absolute top-0 left-0 w-0 h-0 border-r-[24px] border-r-transparent border-t-[24px] border-t-primary-400/30"></div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-b-[24px] border-b-primary-400/30"></div>

              <div className="relative">
                {/* Icon */}
                <div className="w-16 h-16 bg-primary-400 flex items-center justify-center mb-8">
                  <Mail className="w-8 h-8 text-black" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  Executive Newsletter
                </h3>
                <p className="text-gray-400 mb-8 font-light">
                  Join industry leaders and wellness professionals
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@company.com"
                      className="w-full px-6 py-4 bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-primary-400 transition-all duration-300 font-light"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary-400 hover:bg-primary-500 text-black px-8 py-4 font-bold flex items-center justify-center space-x-3 transition-all duration-300 uppercase tracking-wider"
                    disabled={isSubmitted}
                  >
                    {isSubmitted ? (
                      <span>SUBSCRIBED ✓</span>
                    ) : (
                      <>
                        <span>Subscribe Now</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Privacy Notice */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-4 h-4 text-primary-400" />
                    <span className="text-gray-300 text-sm font-medium">Privacy Protected</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Your information is encrypted and never shared. Unsubscribe with one click. 
                    GDPR compliant data handling.
                  </p>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border border-white/10">
                    <Clock className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Weekly Delivery</div>
                  </div>
                  <div className="text-center p-4 border border-white/10">
                    <Users className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                    <div className="text-xs text-gray-400 uppercase tracking-wider">25K+ Members</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
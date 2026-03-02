'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Building, Users, TrendingUp, Award, Package, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    location: '',
    expectedVolume: '',
    message: ''
  });

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Competitive Pricing',
      description: 'Attractive wholesale rates with volume-based discounts for maximum profitability'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Premium Quality',
      description: 'Lab-tested, certified pure Himalayan Shilajit with consistent quality standards'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Flexible Orders',
      description: 'Minimum order quantities designed for businesses of all sizes'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Dedicated Support',
      description: 'Personal account manager and priority customer service for wholesale partners'
    }
  ];

  const requirements = [
    'Valid business license or registration',
    'Minimum order quantity of 50 units per SKU',
    'Established retail or distribution network',
    'Commitment to brand guidelines and quality standards'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your wholesale inquiry! We will contact you within 24 hours.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center space-x-4 mb-8">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-primary-400"
                ></motion.div>
                <span className="text-primary-400 font-medium text-sm uppercase tracking-[0.2em]">
                  Business Partnership
                </span>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-primary-400"
                ></motion.div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-none">
                WHOLESALE
                <span className="block text-primary-400">OPPORTUNITIES</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Partner with Agnishila to bring premium Himalayan wellness products to your customers. 
                Exclusive wholesale pricing and support for qualified retailers.
              </p>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-12 uppercase tracking-wider text-center">
                Why Partner With Us?
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    className="bg-jet-900 border border-white/20 p-6 text-center relative overflow-hidden group hover:border-primary-400/50 transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30 group-hover:border-t-primary-400/50 transition-all duration-300"></div>
                    
                    <div className="w-16 h-16 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center mx-auto mb-6">
                      <div className="text-primary-400">
                        {benefit.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
                      {benefit.title}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Requirements & Application */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
                
                <div className="flex items-center space-x-4 mb-8">
                  <Building className="w-8 h-8 text-primary-400" />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                    Partnership Requirements
                  </h2>
                </div>

                <ul className="space-y-4 mb-8">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 leading-relaxed">{requirement}</span>
                    </li>
                  ))}
                </ul>

              
              </motion.div>

              {/* Application Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
                
                <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-wider">
                  Apply for Wholesale
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                        placeholder="Your business name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                        placeholder="business@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                        Business Type *
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                      >
                        <option value="">Select business type</option>
                        <option value="retail-store">Retail Store</option>
                        <option value="online-retailer">Online Retailer</option>
                        <option value="distributor">Distributor</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="health-store">Health Store</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                      Expected Monthly Volume
                    </label>
                    <select
                      name="expectedVolume"
                      value={formData.expectedVolume}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                    >
                      <option value="">Select expected volume</option>
                      <option value="50-99">50-99 units</option>
                      <option value="100-499">100-499 units</option>
                      <option value="500-999">500-999 units</option>
                      <option value="1000+">1000+ units</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                      Additional Information
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your business and wholesale needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-400 text-black py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Submit Application</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-16 bg-jet-900 border border-white/20 p-8 text-center relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-primary-400/30"></div>
              
              <Users className="w-12 h-12 text-primary-400 mx-auto mb-6" />
              
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
                Ready to Partner With Us?
              </h3>
              
              <p className="text-gray-300 mb-8 leading-relaxed">
                Join our network of successful wholesale partners and start offering premium Himalayan wellness products to your customers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = 'mailto:wholesale@agnishila.com'}
                  className="bg-primary-400 text-black px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                >
                  Email Wholesale Team
                </button>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="border border-white/20 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
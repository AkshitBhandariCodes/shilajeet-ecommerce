'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Truck, Package, Clock, MapPin, Shield, Globe, CheckCircle, AlertCircle } from 'lucide-react';

export default function ShippingPolicyPage() {
  const shippingOptions = [
    {
      title: 'Free Shipping',
      icon: <Package className="w-6 h-6" />,
      duration: '5-7 Business Days',
      cost: 'FREE',
      description: 'Complimentary shipping on all orders across India'
    },
    {
      title: 'Express Delivery',
      icon: <Truck className="w-6 h-6" />,
      duration: '2-3 Business Days',
      cost: 'FREE',
      description: 'Faster delivery available for most locations'
    },
    {
      title: 'Priority Shipping',
      icon: <Clock className="w-6 h-6" />,
      duration: '1-2 Business Days',
      cost: 'FREE',
      description: 'Priority delivery for metro cities and major locations'
    }
  ];

  const shippingZones = [
    {
      zone: 'Zone 1 - Metro Cities',
      cities: 'Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad',
      duration: '2-3 days',
      icon: <Globe className="w-5 h-5" />
    },
    {
      zone: 'Zone 2 - Major Cities',
      cities: 'Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur',
      duration: '3-5 days',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      zone: 'Zone 3 - Other Areas',
      cities: 'All other serviceable locations across India',
      duration: '5-7 days',
      icon: <MapPin className="w-5 h-5" />
    }
  ];

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

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
                  Delivery
                </span>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-primary-400"
                ></motion.div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-none">
                SHIPPING &
                <span className="block text-primary-400">DELIVERY</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Enjoy FREE shipping on all orders! Fast, secure, and reliable delivery of your wellness products across India.
              </p>
            </motion.div>

            {/* Shipping Options */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {shippingOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden text-center"
                >
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
                  
                  <div className="w-16 h-16 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center mx-auto mb-6">
                    <div className="text-primary-400">
                      {option.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">
                    {option.title}
                  </h3>

                  <div className="text-primary-400 font-bold text-lg mb-2">
                    {option.duration}
                  </div>

                  <div className="text-white font-medium mb-4">
                    {option.cost}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed">
                    {option.description}
                  </p>
                </motion.div>
              ))}
            </div>


            {/* Important Information */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-green-400/30"></div>
                
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                    What's Included
                  </h3>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">100% FREE shipping on all orders - No minimum purchase required</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Real-time tracking for all orders</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Secure packaging to ensure product integrity</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">SMS and email notifications for order updates</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">No hidden charges - What you see is what you pay</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-yellow-400/30"></div>
                
                <div className="flex items-center space-x-3 mb-6">
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                    Important Notes
                  </h3>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Orders placed before 2 PM are processed same day</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Delivery times may vary during festivals and peak seasons</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Remote areas may require additional 1-2 days</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Age verification required for delivery</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="mt-16 bg-jet-900 border border-white/20 p-8 text-center relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-primary-400/30"></div>
              
              <Shield className="w-12 h-12 text-primary-400 mx-auto mb-6" />
              
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
                Need Help with Your Order?
              </h3>
              
              <p className="text-gray-300 mb-8 leading-relaxed">
                Our customer support team is here to help with any shipping questions or concerns.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/orders'}
                  className="bg-primary-400 text-black px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                >
                  Track Your Order
                </button>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="border border-white/20 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                >
                  Contact Support
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
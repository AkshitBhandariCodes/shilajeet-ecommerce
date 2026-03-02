'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Users } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Thank you for your message! We will get back to you within 24 hours.');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Toll Free No.',
      description: 'Speak directly with our wellness experts',
      contact: '+91 08071502811',
      action: 'tel:+9108071502811'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Us',
      description: 'Send us a detailed message',
      contact: 'info@agnishila.in',
      action: 'mailto:info@agnishila.in'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Live Chat',
      description: 'Get instant support online',
      contact: 'Available 9 AM - 6 PM',
      action: '#'
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
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-24 h-24 border-l-2 border-t-2 border-primary-400/20"></div>
          <div className="absolute bottom-16 right-16 w-24 h-24 border-r-2 border-b-2 border-primary-400/20"></div>
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 bg-primary-400"
              ></motion.div>
              <span className="text-primary-400 font-medium text-sm uppercase tracking-[0.2em]">
                Get In Touch
              </span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 bg-primary-400"
              ></motion.div>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-none">
              CONTACT
              <span className="block text-primary-400">US</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Have questions about our premium Himalayan Shilajit products? 
              Our expert team is here to help you on your wellness journey.
            </p>
          </motion.div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                className="bg-jet-900 border border-white/20 p-6 text-center relative overflow-hidden group hover:border-primary-400/50 transition-all duration-300 cursor-pointer"
                onClick={() => method.action !== '#' && (window.location.href = method.action)}
              >
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30 group-hover:border-t-primary-400/50 transition-all duration-300"></div>
                
                <div className="w-16 h-16 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-400">
                    {method.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">
                  {method.title}
                </h3>

                <p className="text-gray-400 text-sm mb-3">
                  {method.description}
                </p>

                <div className="text-primary-400 font-bold">
                  {method.contact}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-jet-900 border border-white/20 p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
              
              <div className="flex items-center space-x-3 mb-8">
                <Send className="w-8 h-8 text-primary-400" />
                <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Send Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

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
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                    Subject *
                  </label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="order-support">Order Support</option>
                    <option value="wholesale">Wholesale Opportunities</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-400 text-black py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-b-[20px] border-b-primary-400/30"></div>
                
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-8 h-8 text-primary-400" />
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Contact Information</h3>
                </div>
                
                <div className="space-y-6">
                  

                  <div className="bg-black border border-white/10 p-4">
                    <div className="flex items-start space-x-4">
                      <Phone className="w-6 h-6 text-primary-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1 uppercase tracking-wider">Toll Free No.</h4>
                        <p className="text-gray-400">08071502811</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black border border-white/10 p-4">
                    <div className="flex items-start space-x-4">
                      <Mail className="w-6 h-6 text-primary-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1 uppercase tracking-wider">Email Us</h4>
                        <p className="text-gray-400">info@agnishila.in</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black border border-white/10 p-4">
                    <div className="flex items-start space-x-4">
                      <Clock className="w-6 h-6 text-primary-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1 uppercase tracking-wider">Business Hours</h4>
                        <p className="text-gray-400">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* FAQ Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30"></div>
                
                <div className="flex items-center space-x-3 mb-6">
                  <HelpCircle className="w-8 h-8 text-primary-400" />
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Quick Help</h3>
                </div>
                
                <div className="space-y-4">
                  <motion.a 
                    href="/faq" 
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 text-gray-300 hover:text-primary-400 transition-colors border-l-2 border-transparent hover:border-primary-400 pl-4 py-3 bg-black border border-white/10 group"
                  >
                    <HelpCircle className="w-5 h-5 group-hover:text-primary-400 transition-colors" />
                    <span>Frequently Asked Questions</span>
                  </motion.a>
                  <motion.a 
                    href="/shipping" 
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 text-gray-300 hover:text-primary-400 transition-colors border-l-2 border-transparent hover:border-primary-400 pl-4 py-3 bg-black border border-white/10 group"
                  >
                    <MapPin className="w-5 h-5 group-hover:text-primary-400 transition-colors" />
                    <span>Shipping & Delivery Info</span>
                  </motion.a>
                  <motion.a 
                    href="/returns" 
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 text-gray-300 hover:text-primary-400 transition-colors border-l-2 border-transparent hover:border-primary-400 pl-4 py-3 bg-black border border-white/10 group"
                  >
                    <Mail className="w-5 h-5 group-hover:text-primary-400 transition-colors" />
                    <span>Returns & Exchanges</span>
                  </motion.a>
                  <motion.a 
                    href="/wholesale" 
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 text-gray-300 hover:text-primary-400 transition-colors border-l-2 border-transparent hover:border-primary-400 pl-4 py-3 bg-black border border-white/10 group"
                  >
                    <Users className="w-5 h-5 group-hover:text-primary-400 transition-colors" />
                    <span>Wholesale Inquiries</span>
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </main>
  );
}
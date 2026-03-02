'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Mountain, Leaf, Award, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary-400/20"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary-400/20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src='https://res.cloudinary.com/dsejv31js/image/upload/v1767090440/agnishila/logo/WhatsApp_Image_2025-11-01_at_11.59.11_e8d2c796-removebg-preview.png' 
                  alt="Agnishila Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <img 
                  src='https://res.cloudinary.com/dsejv31js/image/upload/v1767090439/agnishila/logo/name.png' 
                  alt="Agnishila" 
                  className="h-8 object-contain mb-1"
                />
                <div className="text-xs text-white uppercase tracking-[0.2em]">Ignite the fire within</div>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed font-light">
              Premium Himalayan wellness products sourced from pristine heights of 16,000+ feet. 
              Awakening the fire within through ancient wisdom and modern science.
            </p>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Shield className="w-4 h-4 text-primary-400" />
                <span>Lab Tested</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Award className="w-4 h-4 text-primary-400" />
                <span>Certified Pure</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Mountain className="w-4 h-4 text-primary-400" />
                <span>16,000+ Feet</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Leaf className="w-4 h-4 text-primary-400" />
                <span>100% Natural</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/share/19uSv1KKnn/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-jet-900 border border-white/20 flex items-center justify-center text-gray-400 hover:text-primary-400 hover:border-primary-400/50 transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
             
              <a 
                href="https://www.instagram.com/agnishila?igsh=dnVsenAyenc4ZGo3&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-jet-900 border border-white/20 flex items-center justify-center text-gray-400 hover:text-primary-400 hover:border-primary-400/50 transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary-400 transition-colors font-light border-l-2 border-transparent hover:border-primary-400 pl-3 py-1 block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-primary-400 transition-colors font-light border-l-2 border-transparent hover:border-primary-400 pl-3 py-1 block">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/benefits" className="text-gray-300 hover:text-primary-400 transition-colors font-light border-l-2 border-transparent hover:border-primary-400 pl-3 py-1 block">
                  Benefits
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary-400 transition-colors font-light border-l-2 border-transparent hover:border-primary-400 pl-3 py-1 block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors font-light border-l-2 border-transparent hover:border-primary-400 pl-3 py-1 block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/orders" className="text-gray-300 hover:text-primary-400 transition-colors font-light border-l-2 border-transparent hover:border-primary-400 pl-3 py-1 block">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-primary-400 transition-colors font-light border-l-2 border-transparent hover:border-primary-400 pl-3 py-1 block">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-gray-300 hover:text-primary-400 transition-colors font-light border-l-2 border-transparent hover:border-primary-400 pl-3 py-1 block">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-primary-400 transition-colors font-light border-l-2 border-transparent hover:border-primary-400 pl-3 py-1 block">
                  Shopping Cart
                </Link>
              </li>
            
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Connect</h4>
            <div className="space-y-6">
              
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Toll Free</p>
                    <span className="text-white font-medium">08071502811</span>
                  </div>
                </div>
                
                
                
                
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/20 mt-16 pt-12">
          <div className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30"></div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
                  Ignite The Fire Within
                </h3>
                <p className="text-gray-300 font-light leading-relaxed">
                  Join our wellness community and receive exclusive insights, product updates, 
                  and ancient wisdom for modern living.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors placeholder-gray-400"
                />
                <button className="bg-primary-400 text-black px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <p>© 2025 Agnishila. All rights reserved.</p>
             
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/shipping" className="text-gray-400 hover:text-primary-400 transition-colors">
                Shipping Policy
              </Link>
              <Link href="/returns" className="text-gray-400 hover:text-primary-400 transition-colors">
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
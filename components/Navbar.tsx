'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, ChevronDown, Heart } from 'lucide-react';
import AuthModal from './AuthModal';
import SignupDiscountPopup from './SignupDiscountPopup';
import UserProfileDropdown from './UserProfileDropdown';
import FireCoinsDisplay from './FireCoinsDisplay';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { itemCount, isLoading } = useCart();
  const { wishlistCount } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [signupDiscountPopupOpen, setSignupDiscountPopupOpen] = useState(false);
  const [signupCouponCode, setSignupCouponCode] = useState('');

  // Listen for signup modal event from promotion popup
  useEffect(() => {
    const handleOpenSignup = () => {
      setAuthMode('signup');
      setAuthModalOpen(true);
    };

    window.addEventListener('openSignupModal', handleOpenSignup);
    return () => window.removeEventListener('openSignupModal', handleOpenSignup);
  }, []);

  return (
    <nav className="bg-black text-white fixed w-full z-50 top-0 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 relative">
            <Link href="/" className="flex items-center space-x-3">
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
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-12">
              <Link href="/" className="text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm">
                About us
              </Link>
              <Link href="/products" className="text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm">
                Products
              </Link>
              <Link href="/benefits" className="text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm">
                Benefits
              </Link>
              <Link href="/contact" className="text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm">
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Fire Coins - Only show when authenticated */}
            {isAuthenticated && user && (
              <FireCoinsDisplay />
            )}
            
            <Link href="/wishlist" className="relative text-white hover:text-primary-400 transition-colors p-2 border border-white/20 hover:border-primary-400/50">
              <Heart size={16} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative text-white hover:text-primary-400 transition-colors p-2 border border-white/20 hover:border-primary-400/50">
              <ShoppingCart size={16} className={isLoading ? 'animate-pulse' : ''} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {authLoading ? (
              <div className="animate-pulse bg-white/20 h-8 w-20 rounded"></div>
            ) : isAuthenticated && user ? (
              <UserProfileDropdown user={user} onLogout={logout} />
            ) : (
              <>
                <button 
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthModalOpen(true);
                  }}
                  className="text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-xs px-3"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="bg-primary-400 text-black px-4 py-2 font-bold uppercase tracking-wider text-xs hover:bg-primary-500 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-primary-400 transition-colors p-2 border border-white/20"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-white/20">
          <div className="px-4 pt-4 pb-6 space-y-4 bg-jet-900">
            <Link
              href="/"
              className="block px-4 py-3 text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm border-l-2 border-transparent hover:border-primary-400"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-4 py-3 text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm border-l-2 border-transparent hover:border-primary-400"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/benefits"
              className="block px-4 py-3 text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm border-l-2 border-transparent hover:border-primary-400"
              onClick={() => setIsOpen(false)}
            >
              Benefits
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm border-l-2 border-transparent hover:border-primary-400"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-3 text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm border-l-2 border-transparent hover:border-primary-400"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center justify-between px-4 py-3 text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm border-l-2 border-transparent hover:border-primary-400"
              onClick={() => setIsOpen(false)}
            >
              <span>Wishlist</span>
              <div className="flex items-center space-x-2">
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="bg-primary-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-between px-4 py-3 text-white hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm border-l-2 border-transparent hover:border-primary-400"
              onClick={() => setIsOpen(false)}
            >
              <span>Cart</span>
              <div className="flex items-center space-x-2">
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="bg-primary-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>
            <div className="pt-4 border-t border-white/20 space-y-3">
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-3 text-center">
                    <div className="text-white font-bold">{user.name}</div>
                    <div className="text-gray-400 text-sm">{user.email}</div>
                  </div>
                  <button
                    onClick={async () => {
                      await logout();
                      setIsOpen(false);
                    }}
                    className="block w-full bg-red-600/20 text-red-400 px-4 py-3 font-bold uppercase tracking-wider text-sm text-center border border-red-600/30 hover:bg-red-600/30 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="block w-full text-white hover:text-primary-400 px-4 py-3 font-bold uppercase tracking-wider text-sm text-center border border-white/20 hover:border-primary-400/50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="block w-full bg-primary-400 text-black px-4 py-3 font-bold uppercase tracking-wider text-sm text-center hover:bg-primary-500 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSignupComplete={(couponCode) => {
          setSignupCouponCode(couponCode);
          setSignupDiscountPopupOpen(true);
        }}
      />

      {/* Signup Discount Popup */}
      <SignupDiscountPopup
        isOpen={signupDiscountPopupOpen}
        onClose={() => setSignupDiscountPopupOpen(false)}
        couponCode={signupCouponCode}
      />
    </nav>
  );
}
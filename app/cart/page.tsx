'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useCoupon } from '@/contexts/CouponContext';
import { useCartCoins } from '@/contexts/CartCoinsContext';
import CouponInput from '@/components/CouponInput';
import CoinRedemption from '@/components/CoinRedemption';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const { appliedCoupon } = useCoupon();
  const { redeemedCoins, setRedeemedCoins } = useCartCoins();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (items.length === 0) {
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
          
          <section className="pt-32 pb-32 bg-transparent relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-16 left-16 w-24 h-24 border-l-2 border-t-2 border-primary-400/20"></div>
            <div className="absolute bottom-16 right-16 w-24 h-24 border-r-2 border-b-2 border-primary-400/20"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-12 h-1 bg-primary-400"></div>
                <span className="text-primary-400 font-medium text-sm uppercase tracking-[0.2em]">
                  Shopping Cart
                </span>
                <div className="w-12 h-1 bg-primary-400"></div>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-none">
                YOUR
                <span className="block text-primary-400">CART</span>
              </h1>

              <div className="bg-jet-900 border border-white/20 p-16 max-w-2xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
                
                <ShoppingBag className="w-24 h-24 text-primary-400/50 mx-auto mb-8" />
                
                <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">Empty Cart</h2>
                <p className="text-gray-400 mb-8 font-light leading-relaxed">
                  Your cart is currently empty. Discover our premium Himalayan Shilajit products 
                  and start your wellness journey today.
                </p>
                
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-3 bg-primary-400 text-black px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                >
                  <span>Shop Products</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

          <Footer />
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
        
        <section className="pt-32 pb-32 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-24 h-24 border-l-2 border-t-2 border-primary-400/20"></div>
          <div className="absolute bottom-16 right-16 w-24 h-24 border-r-2 border-b-2 border-primary-400/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-1 bg-primary-400"></div>
              <span className="text-primary-400 font-medium text-sm uppercase tracking-[0.2em]">
                Shopping Cart
              </span>
              <div className="w-12 h-1 bg-primary-400"></div>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-none">
              YOUR
              <span className="block text-primary-400">CART</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-jet-900 border border-white/20 p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30"></div>
                    
                    <div className="flex items-center space-x-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-jet-800 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-primary-400/20 flex items-center justify-center">
                            <div className="w-8 h-8 bg-primary-400 transform rotate-45"></div>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-gray-400 text-sm mb-2">{item.variant}</p>
                        )}
                        <p className="text-primary-400 font-bold text-lg">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-black border border-white/20">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isLoading}
                            className="p-2 text-white hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-white font-bold px-4 py-2 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                            className="p-2 text-white hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id, item.variant)}
                          disabled={isLoading}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors border border-red-400/30 hover:border-red-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart Button */}
              <div className="pt-6 border-t border-white/20">
                <button
                  onClick={clearCart}
                  disabled={isLoading}
                  className="text-red-400 hover:text-red-300 transition-colors font-medium uppercase tracking-wider text-sm border border-red-400/30 hover:border-red-400/50 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Clear Cart'}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-jet-900 border border-white/20 p-8 sticky top-32 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
                
                <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-wider">
                  Order Summary
                </h2>

                {/* Coupon Input */}
                <CouponInput orderAmount={total} />

                {/* Coin Redemption */}
                <div className="mb-8">
                  <CoinRedemption 
                    maxRedeemable={total - (appliedCoupon?.discountAmount || 0)}
                    onRedemptionChange={setRedeemedCoins}
                    appliedCoins={redeemedCoins}
                  />
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Subtotal ({itemCount} items)</span>
                    <span className="text-white font-bold">{formatPrice(total)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-green-400">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span className="font-bold">-{formatPrice(appliedCoupon.discountAmount)}</span>
                    </div>
                  )}

                  {redeemedCoins > 0 && (
                    <div className="flex justify-between items-center text-orange-400">
                      <span>Fire Coins Discount</span>
                      <span className="font-bold">-{formatPrice(redeemedCoins)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-primary-400 font-bold">FREE</span>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white uppercase tracking-wider">Total</span>
                      <span className="text-2xl font-bold text-primary-400">
                        {formatPrice(Math.max(0, total - (appliedCoupon?.discountAmount || 0) - redeemedCoins))}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-primary-400 text-black py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors text-center"
                >
                  Proceed to Checkout
                </Link>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <Link
                    href="/products"
                    className="block text-center text-gray-400 hover:text-primary-400 transition-colors font-medium uppercase tracking-wider text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useCoupon } from '@/contexts/CouponContext';
import { useCartCoins } from '@/contexts/CartCoinsContext';
import { useFireCoins } from '@/contexts/FireCoinsContext';
import AuthModal from '@/components/AuthModal';
import CheckoutSteps from '@/components/CheckoutSteps';
import AddressForm from '@/components/AddressForm';
import PaymentForm from '@/components/PaymentForm';
import OrderSummary from '@/components/OrderSummary';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Lock } from 'lucide-react';

type CheckoutStep = 'auth' | 'address' | 'payment' | 'confirmation';

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { items, total, itemCount, clearCart } = useCart();
  const { appliedCoupon, removeCoupon } = useCoupon();
  const { redeemedCoins, clearRedeemedCoins } = useCartCoins();
  const { redeemCoins } = useFireCoins();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('auth');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (itemCount === 0) {
      router.push('/cart');
    }
  }, [itemCount, router]);

  // Set initial step based on authentication
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentStep('address');
    } else {
      setCurrentStep('auth');
    }
  }, [isAuthenticated]);

  const handleAuthComplete = () => {
    setAuthModalOpen(false);
    setCurrentStep('address');
  };

  const handleAddressComplete = (addressData: Address) => {
    setAddress(addressData);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = async (paymentData: any) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create order in database
      // Note: Don't calculate total here - let the backend recalculate to ensure consistency
      const orderData = {
        items,
        address,
        payment: paymentData,
        couponCode: appliedCoupon?.code,
        redeemedCoins: redeemedCoins,
        idempotencyKey: `${user?.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Redeem coins if any were used
        if (redeemedCoins > 0) {
          await redeemCoins(redeemedCoins, responseData.order.orderNumber);
        }
        
        clearCart();
        removeCoupon();
        clearRedeemedCoins();
        
        // Redirect to order confirmation page
        router.push(`/order-confirmation?orderNumber=${responseData.order.orderNumber}`);
      } else {
        const errorData = await response.json();
        console.error('Order creation failed:', errorData);
        throw new Error(errorData.error || 'Order creation failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate final total with coupon and coin discounts
  const finalTotal = Math.max(0, total - (appliedCoupon?.discountAmount || 0) - redeemedCoins);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (itemCount === 0) {
    return null; // Will redirect
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
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-1 bg-primary-400"></div>
              <span className="text-primary-400 font-medium text-sm uppercase tracking-[0.2em]">
                Secure Checkout
              </span>
              <div className="w-12 h-1 bg-primary-400"></div>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-none">
              CHECK
              <span className="block text-primary-400">OUT</span>
            </h1>

            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Lock size={16} />
              <span className="text-sm uppercase tracking-wider">SSL Secured</span>
            </div>
          </div>

          {/* Back to Cart */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/cart')}
              className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm uppercase tracking-wider">Back to Cart</span>
            </button>
          </div>

          {/* Checkout Steps */}
          <CheckoutSteps currentStep={currentStep} />

          <div className="grid lg:grid-cols-3 gap-12 mt-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 'auth' && (
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
                    
                    <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-wider">
                      Sign In Required
                    </h2>
                    
                    <p className="text-gray-300 mb-8 font-light leading-relaxed">
                      Please sign in to your account or create a new one to continue with your order. 
                      This helps us provide you with order tracking and customer support.
                    </p>

                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="w-full bg-primary-400 text-black py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                    >
                      Sign In / Sign Up
                    </button>
                  </motion.div>
                )}

                {currentStep === 'address' && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <AddressForm onComplete={handleAddressComplete} />
                  </motion.div>
                )}

                {currentStep === 'payment' && address && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <PaymentForm 
                      onComplete={handlePaymentComplete}
                      isProcessing={isProcessing}
                      total={finalTotal}
                      shippingAddress={address}
                    />
                  </motion.div>
                )}

                {currentStep === 'confirmation' && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-jet-900 border border-primary-400/50 p-12 text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-t-[30px] border-t-primary-400/50"></div>
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-primary-400/50"></div>
                    
                    <div className="w-24 h-24 bg-primary-400/20 mx-auto mb-8 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-primary-400" />
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-wider">
                      Order Confirmed
                    </h2>
                    
                    <p className="text-gray-300 mb-8 font-light leading-relaxed">
                      Thank you for your order! You will receive a confirmation email shortly 
                      with your order details and tracking information.
                    </p>

                    <button
                      onClick={() => router.push('/products')}
                      className="bg-primary-400 text-black px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary items={items} total={total} />
            </div>
          </div>
        </div>
      </section>

        <Footer />

        {/* Auth Modal */}
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthComplete}
          initialMode="signin"
        />
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Wallet, Truck, CreditCard } from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentData {
  mode: 'COD' | 'Prepaid';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  billingAddress?: {
    sameAsShipping: boolean;
    address1?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

interface PaymentFormProps {
  onComplete: (paymentData: PaymentData & { razorpayData?: any }) => void;
  isProcessing: boolean;
  total: number;
  shippingAddress: any;
}

export default function PaymentForm({ onComplete, isProcessing, total, shippingAddress }: PaymentFormProps) {
  const { user } = useAuth();
  const { isLoaded: razorpayLoaded, isLoading: razorpayLoading, processPayment } = useRazorpay();
  const [paymentMode, setPaymentMode] = useState<'COD' | 'Prepaid'>('COD');
  const [formData] = useState<PaymentData>({
    mode: 'COD',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      sameAsShipping: true,
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMode === 'COD') {
      handleCODPayment();
    } else {
      handleRazorpayPayment();
    }
  };

  const handleCODPayment = () => {
    onComplete({
      mode: 'COD',
      billingAddress: {
        sameAsShipping: true,
      },
    });
  };

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment gateway is loading. Please try again.');
      return;
    }

    if (!user || !shippingAddress) {
      alert('User information is missing. Please try again.');
      return;
    }

    const userDetails = {
      name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      email: shippingAddress.email || user.email || '',
      contact: shippingAddress.phone || '',
    };

    processPayment(
      total,
      userDetails,
      (response) => {
        // Payment successful
        onComplete({
          mode: 'Prepaid',
          razorpayData: response,
        });
      },
      (error) => {
        // Payment failed
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
      },
      () => {
        // Payment dismissed by user
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-6 h-6 text-primary-400" />
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
            Payment Details
          </h2>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-400">
          <Wallet size={16} />
          <span className="text-sm uppercase tracking-wider">Secure</span>
        </div>
      </div>

      {/* Total Amount */}
      <div className="bg-black border border-primary-400/30 p-6 mb-8">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-lg uppercase tracking-wider">Total Amount</span>
          <span className="text-3xl font-bold text-primary-400">{formatPrice(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Mode Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4">Select Payment Method</h3>
          
          {/* COD Option */}
          <motion.button
            type="button"
            onClick={() => setPaymentMode('COD')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-6 border-2 transition-all ${
              paymentMode === 'COD'
                ? 'border-primary-400 bg-primary-400/10'
                : 'border-white/20 bg-black hover:border-primary-400/50'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                paymentMode === 'COD' ? 'border-primary-400' : 'border-gray-400'
              }`}>
                {paymentMode === 'COD' && (
                  <div className="w-3 h-3 rounded-full bg-primary-400"></div>
                )}
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="w-5 h-5 text-primary-400" />
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                    Cash on Delivery
                  </h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Pay when your order arrives at your doorstep. No payment required now.
                </p>
              </div>
            </div>
          </motion.button>

          {/* Online Payment Option */}
          <motion.button
            type="button"
            onClick={() => setPaymentMode('Prepaid')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-6 border-2 transition-all ${
              paymentMode === 'Prepaid'
                ? 'border-primary-400 bg-primary-400/10'
                : 'border-white/20 bg-black hover:border-primary-400/50'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                paymentMode === 'Prepaid' ? 'border-primary-400' : 'border-gray-400'
              }`}>
                {paymentMode === 'Prepaid' && (
                  <div className="w-3 h-3 rounded-full bg-primary-400"></div>
                )}
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-5 h-5 text-primary-400" />
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                    Pay Online
                  </h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Secure payment via Razorpay. Cards, UPI, Wallets accepted.
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Razorpay Information (shown only when Prepaid is selected) */}
        {paymentMode === 'Prepaid' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black border border-primary-400/30 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Wallet className="w-6 h-6 text-primary-400" />
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                Secure Payment with Razorpay
              </h4>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-jet-900 border border-white/10">
                <div className="text-primary-400 font-bold text-sm mb-1">UPI</div>
                <div className="text-gray-400 text-xs">Google Pay, PhonePe, Paytm</div>
              </div>
              <div className="p-3 bg-jet-900 border border-white/10">
                <div className="text-primary-400 font-bold text-sm mb-1">Cards</div>
                <div className="text-gray-400 text-xs">Visa, Mastercard, RuPay</div>
              </div>
              <div className="p-3 bg-jet-900 border border-white/10">
                <div className="text-primary-400 font-bold text-sm mb-1">Wallets</div>
                <div className="text-gray-400 text-xs">Paytm, Mobikwik, Freecharge</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-primary-400/10 border border-primary-400/30">
              <p className="text-primary-300 text-sm text-center">
                Click "Pay with Razorpay" to proceed to secure payment gateway
              </p>
            </div>
          </motion.div>
        )}

        {/* COD Information (shown only when COD is selected) */}
        {paymentMode === 'COD' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black border border-primary-400/30 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Truck className="w-6 h-6 text-primary-400" />
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                Cash on Delivery Details
              </h4>
            </div>
            
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-start space-x-3">
                <span className="text-primary-400 font-bold">✓</span>
                <span>No payment required now. Pay when your order arrives.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-primary-400 font-bold">✓</span>
                <span>Our delivery partner will collect payment at your doorstep.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-primary-400 font-bold">✓</span>
                <span>You can verify the product before making payment.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-primary-400 font-bold">✓</span>
                <span>Available for most locations in India.</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-primary-400/10 border border-primary-400/30">
              <p className="text-primary-300 text-sm text-center">
                Click "Place Order (COD)" to confirm your order
              </p>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || (paymentMode === 'Prepaid' && (!razorpayLoaded || razorpayLoading))}
          className="w-full bg-primary-400 text-black py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing || razorpayLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              <span>Processing...</span>
            </>
          ) : paymentMode === 'COD' ? (
            <>
              <Truck size={16} />
              <span>Place Order (COD) - {formatPrice(total)}</span>
            </>
          ) : (
            <>
              <Smartphone size={16} />
              <span>Pay with Razorpay - {formatPrice(total)}</span>
            </>
          )}
        </button>

        {/* Payment Method Status */}
        {paymentMode === 'Prepaid' && !razorpayLoaded && (
          <div className="text-center">
            <p className="text-yellow-400 text-sm">Loading payment gateway...</p>
          </div>
        )}

        {/* Security Notice */}
        <div className="text-center pt-4">
          <p className="text-gray-400 text-xs">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </form>
    </motion.div>
  );
}
'use client';

import { useState } from 'react';
import { Truck, CreditCard } from 'lucide-react';

interface PaymentOption {
  mode: 'COD' | 'Prepaid';
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface CheckoutPaymentOptionsProps {
  selectedMode: 'COD' | 'Prepaid';
  onModeChange: (mode: 'COD' | 'Prepaid') => void;
  total: number;
}

export default function CheckoutPaymentOptions({
  selectedMode,
  onModeChange,
  total,
}: CheckoutPaymentOptionsProps) {
  const paymentOptions: PaymentOption[] = [
    {
      mode: 'COD',
      label: 'Cash on Delivery',
      description: 'Pay when your order arrives at your doorstep',
      icon: <Truck className="w-6 h-6" />,
    },
    {
      mode: 'Prepaid',
      label: 'Pay Online',
      description: 'Secure payment via Razorpay (Cards, UPI, Wallets)',
      icon: <CreditCard className="w-6 h-6" />,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentOptions.map((option) => (
          <button
            key={option.mode}
            onClick={() => onModeChange(option.mode)}
            className={`p-4 border-2 rounded-lg transition-all text-left ${
              selectedMode === option.mode
                ? 'border-gold-500 bg-gold-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 ${
                  selectedMode === option.mode ? 'text-gold-600' : 'text-gray-400'
                }`}
              >
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{option.label}</h4>
                  {selectedMode === option.mode && (
                    <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Total:</span>
            <span className="font-semibold">₹{total.toFixed(2)}</span>
          </div>
          
          {selectedMode === 'COD' && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-green-700 font-medium">
                ✓ No payment required now. Pay on delivery.
              </p>
            </div>
          )}
          
          {selectedMode === 'Prepaid' && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-blue-700 font-medium">
                ✓ Secure payment. You'll be redirected to Razorpay.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

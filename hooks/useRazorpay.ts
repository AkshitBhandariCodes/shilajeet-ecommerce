'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setIsLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const createOrder = async (amount: number, orderId?: string) => {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount, 
          orderId: orderId || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: any) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const openRazorpay = (options: RazorpayOptions) => {
    if (!isLoaded || !window.Razorpay) {
      throw new Error('Razorpay is not loaded');
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const processPayment = async (
    amount: number,
    userDetails: {
      name: string;
      email: string;
      contact: string;
    },
    onSuccess: (response: any) => void,
    onError: (error: any) => void,
    onDismiss?: () => void
  ) => {
    if (!isLoaded) {
      onError(new Error('Razorpay is not loaded'));
      return;
    }

    setIsLoading(true);

    try {
      // Create order on server
      const orderData = await createOrder(amount);

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Agnishila',
        description: 'Premium Himalayan Wellness Products',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment on server
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.success) {
              onSuccess({
                ...response,
                verified: true,
                paymentId: verificationResult.paymentId,
              });
            } else {
              onError(new Error('Payment verification failed'));
            }
          } catch (error) {
            onError(error);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact,
        },
        theme: {
          color: '#D4AF37', // Primary gold color
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            if (onDismiss) onDismiss();
          },
        },
      };

      openRazorpay(options);
    } catch (error) {
      setIsLoading(false);
      onError(error);
    }
  };

  return {
    isLoaded,
    isLoading,
    processPayment,
    createOrder,
    verifyPayment,
  };
};
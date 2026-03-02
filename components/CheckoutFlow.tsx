'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CheckoutPaymentOptions from './CheckoutPaymentOptions';
import { createRazorpayOrder, initiateRazorpayCheckout } from '@/lib/razorpay-checkout';

interface CheckoutFlowProps {
  onOrderComplete?: (orderData: any) => void;
}

export default function CheckoutFlow({ onOrderComplete }: CheckoutFlowProps) {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMode, setPaymentMode] = useState<'COD' | 'Prepaid'>('COD');
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: user?.phone || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!address.firstName || !address.lastName || !address.phone || !address.address1 || !address.city || !address.state || !address.zipCode) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const idempotencyKey = `${user?.id}-${Date.now()}`;

      if (paymentMode === 'Prepaid') {
        // Create Razorpay order first
        const razorpayOrder = await createRazorpayOrder(total, idempotencyKey);

        // Initiate Razorpay checkout
        await new Promise((resolve, reject) => {
          initiateRazorpayCheckout({
            orderId: razorpayOrder.orderId,
            amount: total,
            customerName: `${address.firstName} ${address.lastName}`,
            customerEmail: address.email,
            customerPhone: address.phone,
            onSuccess: async (paymentData) => {
              // Create order with payment data
              const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  items,
                  address,
                  payment: {
                    mode: 'Prepaid',
                    razorpayData: {
                      verified: true,
                      paymentId: paymentData.paymentId,
                      orderId: paymentData.orderId,
                      userDetails: {
                        name: `${address.firstName} ${address.lastName}`,
                        email: address.email,
                        phone: address.phone,
                      },
                    },
                  },
                  idempotencyKey,
                }),
              });

              if (orderResponse.ok) {
                const orderData = await orderResponse.json();
                clearCart();
                onOrderComplete?.(orderData.order);
                resolve(orderData);
              } else {
                reject(new Error('Failed to create order'));
              }
            },
            onError: (error) => {
              setError(error.message || 'Payment failed');
              reject(error);
            },
          });
        });
      } else {
        // COD - Create order directly
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            address,
            payment: {
              mode: 'COD',
            },
            idempotencyKey,
          }),
        });

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          clearCart();
          onOrderComplete?.(orderData.order);
        } else {
          const errorData = await orderResponse.json();
          throw new Error(errorData.error || 'Failed to create order');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Checkout Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={address.firstName}
                onChange={handleAddressChange}
                className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={address.lastName}
                onChange={handleAddressChange}
                className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={address.email}
                onChange={handleAddressChange}
                className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone *"
                value={address.phone}
                onChange={handleAddressChange}
                className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <input
                type="text"
                name="address1"
                placeholder="Address Line 1 *"
                value={address.address1}
                onChange={handleAddressChange}
                className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <input
                type="text"
                name="address2"
                placeholder="Address Line 2 (Optional)"
                value={address.address2}
                onChange={handleAddressChange}
                className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City *"
                value={address.city}
                onChange={handleAddressChange}
                className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <input
                type="text"
                name="state"
                placeholder="State *"
                value={address.state}
                onChange={handleAddressChange}
                className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code *"
                value={address.zipCode}
                onChange={handleAddressChange}
                className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <select
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="India">India</option>
              </select>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <CheckoutPaymentOptions
              selectedMode={paymentMode}
              onModeChange={setPaymentMode}
              total={total}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total:</span>
                <span className="text-gold-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || items.length === 0}
              className="w-full mt-6 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : paymentMode === 'COD' ? 'Place Order (COD)' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

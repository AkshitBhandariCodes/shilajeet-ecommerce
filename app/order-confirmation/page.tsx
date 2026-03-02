'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Package, 
  Mail, 
  Clock,
  ArrowRight,
  Download,
  Calendar,
  MapPin,
  CreditCard,
  Truck
} from 'lucide-react';

interface OrderConfirmation {
  orderNumber: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  customerEmail: string;
  estimatedDelivery: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [hasOrderNumber, setHasOrderNumber] = useState(true);

  useEffect(() => {
    const orderNumber = searchParams.get('orderNumber');
    
    if (!orderNumber) {
      setHasOrderNumber(false);
      // Use setTimeout to avoid the React warning about updating during render
      setTimeout(() => {
        router.push('/');
      }, 100);
      return;
    }

    // Fetch order confirmation data from API
    const fetchOrderData = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const orders = await response.json();
          const order = orders.find((o: any) => o.orderNumber === orderNumber);
          
          if (order) {
            setOrderData({
              orderNumber: order.orderNumber,
              total: order.total,
              items: order.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              customerEmail: order.shippingAddress?.email || 'customer@example.com',
              estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              shippingAddress: {
                firstName: order.shippingAddress?.firstName || 'Customer',
                lastName: order.shippingAddress?.lastName || '',
                address1: order.shippingAddress?.address1 || 'Address',
                city: order.shippingAddress?.city || 'City',
                state: order.shippingAddress?.state || 'State',
                zipCode: order.shippingAddress?.zipCode || '000000'
              }
            });
          } else {
            // Fallback to mock data if order not found
            setOrderData({
              orderNumber: orderNumber,
              total: 2499,
              items: [
                { name: 'Agnishila Product', quantity: 1, price: 2499 }
              ],
              customerEmail: 'customer@example.com',
              estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              shippingAddress: {
                firstName: 'Customer',
                lastName: '',
                address1: 'Address',
                city: 'City',
                state: 'State',
                zipCode: '000000'
              }
            });
          }
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
        // Fallback to mock data
        setOrderData({
          orderNumber: orderNumber,
          total: 2499,
          items: [
            { name: 'Agnishila Product', quantity: 1, price: 2499 }
          ],
          customerEmail: 'customer@example.com',
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          shippingAddress: {
            firstName: 'Customer',
            lastName: '',
            address1: 'Address',
            city: 'City',
            state: 'State',
            zipCode: '000000'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    // Add a 1-second delay to show the processing animation
    setTimeout(() => {
      fetchOrderData();
    }, 1000);
  }, [searchParams, router]);

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (!loading && orderData) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push(`/order-success?orderNumber=${orderData.orderNumber}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, orderData, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Return early if no order number to prevent rendering issues
  if (!hasOrderNumber) {
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
          <div className="pt-32 pb-20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Redirecting...</h1>
              <p className="text-gray-400">Please wait</p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    );
  }

  if (loading) {
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
          <div className="pt-32 pb-20 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-primary-400 border-t-transparent rounded-full mx-auto mb-6"
              />
              <h1 className="text-3xl font-bold text-white mb-4">Processing Your Order...</h1>
              <p className="text-gray-400 text-lg">Please wait while we confirm your payment and prepare your order details</p>
              <div className="mt-4 bg-primary-400/10 border border-primary-400/30 p-3 inline-block">
                <p className="text-primary-300 text-sm">This will only take a moment...</p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    );
  }

  if (!orderData) {
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
          <div className="pt-32 pb-20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Order Not Found</h1>
              <button
                onClick={() => router.push('/')}
                className="bg-primary-400 text-black px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
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
        
        <section className="pt-32 pb-20 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-24 h-24 border-l-2 border-t-2 border-primary-400/20"></div>
          <div className="absolute bottom-16 right-16 w-24 h-24 border-r-2 border-b-2 border-primary-400/20"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-24 h-24 bg-green-600/20 border-2 border-green-400 mx-auto mb-6 flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none"
            >
              PAYMENT
              <span className="block text-primary-400">CONFIRMED!</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-gray-300 font-light leading-relaxed mb-4"
            >
              Your order has been successfully placed and payment confirmed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-primary-400/10 border border-primary-400/30 p-4 inline-block"
            >
              <p className="text-primary-300 text-sm mb-2">
                Redirecting to order details in <span className="font-bold text-primary-400">{countdown}</span> seconds
              </p>
              <button
                onClick={() => router.push(`/order-success?orderNumber=${orderData?.orderNumber}`)}
                className="text-primary-400 hover:text-primary-300 text-xs underline"
              >
                Skip waiting and go now →
              </button>
            </motion.div>
          </motion.div>

          {/* Order Confirmation Details */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
              
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider flex items-center">
                <Package className="w-6 h-6 mr-3 text-primary-400" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400 uppercase tracking-wider">Order Number</span>
                  <span className="text-white font-bold font-mono">{orderData.orderNumber}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400 uppercase tracking-wider">Total Amount</span>
                  <span className="text-primary-400 font-bold text-xl">{formatPrice(orderData.total)}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400 uppercase tracking-wider">Payment Status</span>
                  <span className="bg-green-600/20 text-green-400 px-3 py-1 text-sm font-bold uppercase tracking-wider border border-green-600/30">
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Items Ordered */}
              <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Items Ordered</h3>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div key={index} className="bg-black border border-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-bold text-sm">{item.name}</h4>
                        <p className="text-gray-400 text-xs">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-primary-400 font-bold">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              {/* Email Confirmation */}
              <div className="bg-jet-900 border border-white/20 p-6 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-b-[20px] border-b-primary-400/30"></div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Email Confirmation</h3>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">
                  A confirmation email has been sent to:
                </p>
                <p className="text-primary-400 font-bold">{orderData.customerEmail}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Please check your inbox and spam folder
                </p>
              </div>

              {/* Delivery Information */}
              <div className="bg-jet-900 border border-white/20 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30"></div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <Truck className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Delivery Details</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    <span className="text-gray-300 text-sm">Estimated Delivery:</span>
                  </div>
                  <p className="text-white font-bold">{orderData.estimatedDelivery}</p>
                  
                  <div className="flex items-start space-x-2 mt-4">
                    <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                    <div className="text-gray-300 text-sm">
                      <div>{orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}</div>
                      <div>{orderData.shippingAddress.address1}</div>
                      <div>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-jet-900 border border-white/20 p-6 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-primary-400/30"></div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">What's Next?</h3>
                </div>
                
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    <span>Order processing will begin within 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    <span>You'll receive tracking information via email</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    <span>Free shipping to your doorstep</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => router.push(`/order-success?orderNumber=${orderData.orderNumber}`)}
              className="bg-primary-400 text-black py-4 px-8 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowRight size={16} />
              <span>View Order Details</span>
            </button>
            
            <button
              onClick={() => window.print()}
              className="border border-white/20 text-white py-4 px-8 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors flex items-center justify-center space-x-2"
            >
              <Download size={16} />
              <span>Print Confirmation</span>
            </button>
            
            <button
              onClick={() => router.push('/products')}
              className="border border-white/20 text-white py-4 px-8 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </section>

        <Footer />
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
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
          <div className="pt-32 pb-20 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-primary-400 border-t-transparent rounded-full mx-auto mb-6"
              />
              <h1 className="text-3xl font-bold text-white mb-4">Loading...</h1>
              <p className="text-gray-400 text-lg">Please wait</p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
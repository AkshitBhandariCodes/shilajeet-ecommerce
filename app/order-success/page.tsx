'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Calendar, 
  Download,
  Share2,
  ArrowRight,
  Star,
  Gift
} from 'lucide-react';

interface OrderDetails {
  orderNumber: string;
  total: number;
  status: string;
  estimatedDelivery: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderNumber = searchParams.get('orderNumber');
    
    if (!orderNumber) {
      // If no order number, redirect to home
      router.push('/');
      return;
    }

    // Fetch order details from API
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const orders = await response.json();
          // Find the order with matching order number
          const order = orders.find((o: any) => o.orderNumber === orderNumber);
          
          if (order) {
            setOrderDetails({
              orderNumber: order.orderNumber,
              total: order.total,
              status: order.status,
              estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
              items: order.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              }))
            });
          } else {
            // Order not found, redirect to home
            router.push('/');
            return;
          }
        } else {
          // API error, show mock data as fallback
          const mockOrder: OrderDetails = {
            orderNumber: orderNumber,
            total: 2499,
            status: 'confirmed',
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
            items: [
              { name: 'Agnishila Gold Shilajit Resin', quantity: 1, price: 2499 }
            ]
          };
          setOrderDetails(mockOrder);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        // Show mock data as fallback
        const mockOrder: OrderDetails = {
          orderNumber: orderNumber,
          total: 2499,
          status: 'confirmed',
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
          items: [
            { name: 'Agnishila Gold Shilajit Resin', quantity: 1, price: 2499 }
          ]
        };
        setOrderDetails(mockOrder);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

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
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mx-auto mb-4"></div>
              <p className="text-white text-lg">Processing your order...</p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    );
  }

  if (!orderDetails) {
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
              <p className="text-gray-400 mb-6">
                {searchParams.get('orderNumber') 
                  ? `Order ${searchParams.get('orderNumber')} could not be found.`
                  : 'No order number provided.'
                }
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => router.push('/orders')}
                  className="bg-primary-400 text-black px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                >
                  View Orders
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="border border-white/20 text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                >
                  Go Home
                </button>
              </div>
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 bg-green-600/20 border-2 border-green-400 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
              ORDER
              <span className="block text-primary-400">CONFIRMED!</span>
            </h1>
            
            <p className="text-xl text-gray-300 font-light leading-relaxed">
              Thank you for choosing Agnishila. Your wellness journey begins now!
            </p>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-jet-900 border border-white/20 p-8 mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Info */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Order Details</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400 uppercase tracking-wider">Order Number</span>
                    <span className="text-white font-bold">{orderDetails.orderNumber}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400 uppercase tracking-wider">Total Amount</span>
                    <span className="text-primary-400 font-bold text-xl">{formatPrice(orderDetails.total)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400 uppercase tracking-wider">Status</span>
                    <span className="bg-green-600/20 text-green-400 px-3 py-1 text-sm font-bold uppercase tracking-wider border border-green-600/30">
                      {orderDetails.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-400 uppercase tracking-wider">Estimated Delivery</span>
                    <span className="text-white font-bold">{orderDetails.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Items Ordered</h3>
                
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="bg-black border border-white/10 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-bold text-sm uppercase tracking-wider">{item.name}</h4>
                          <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-primary-400 font-bold">{formatPrice(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-jet-900 border border-white/20 p-8 mb-8 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
            
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">What Happens Next?</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-400/20 mx-auto mb-4 flex items-center justify-center">
                  <Package className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-wider">Processing</h3>
                <p className="text-gray-400 text-sm">Your order is being prepared with care</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-400/20 mx-auto mb-4 flex items-center justify-center">
                  <Truck className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-wider">Shipping</h3>
                <p className="text-gray-400 text-sm">Free shipping to your doorstep</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-400/20 mx-auto mb-4 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-wider">Enjoy</h3>
                <p className="text-gray-400 text-sm">Begin your wellness transformation</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-4"
          >
            <button
              onClick={() => router.push('/orders')}
              className="bg-primary-400 text-black py-4 px-6 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors flex items-center justify-center space-x-2"
            >
              <Package size={16} />
              <span>Track Order</span>
            </button>
            
            <button
              onClick={() => window.print()}
              className="border border-white/20 text-white py-4 px-6 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors flex items-center justify-center space-x-2"
            >
              <Download size={16} />
              <span>Download Receipt</span>
            </button>
            
            <button
              onClick={() => router.push('/products')}
              className="border border-white/20 text-white py-4 px-6 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowRight size={16} />
              <span>Continue Shopping</span>
            </button>
          </motion.div>

          {/* Review Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-12 text-center bg-primary-400/10 border border-primary-400/30 p-8"
          >
            <Star className="w-12 h-12 text-primary-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Love Your Experience?</h3>
            <p className="text-gray-300 mb-6">Share your Agnishila journey and help others discover the fire within.</p>
            <button className="bg-primary-400 text-black px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors">
              Write a Review
            </button>
          </motion.div>
        </div>
      </section>

        <Footer />
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
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
      <OrderSuccessContent />
    </Suspense>
  );
}
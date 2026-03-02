'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { RotateCcw, Package, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: '01',
      title: 'Initiate Return',
      description: 'Contact our support team or use your account dashboard to start the return process',
      icon: <RotateCcw className="w-6 h-6" />
    },
    {
      step: '02',
      title: 'Package Items',
      description: 'Pack items in original packaging with all accessories and documentation',
      icon: <Package className="w-6 h-6" />
    },
    {
      step: '03',
      title: 'Schedule Pickup',
      description: 'We will arrange free pickup from your address within 2-3 business days',
      icon: <Clock className="w-6 h-6" />
    },
    {
      step: '04',
      title: 'Processing',
      description: 'Once received, we will inspect and process your return within 5-7 business days',
      icon: <RefreshCw className="w-6 h-6" />
    }
  ];

  const returnConditions = [
    {
      title: 'Eligible for Return',
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      items: [
        'Items returned within 30 days of delivery',
        'Products in original, unopened packaging',
        'Items with original seals intact',
        'Defective or damaged products',
        'Wrong items delivered'
      ]
    },
    {
      title: 'Not Eligible for Return',
      icon: <XCircle className="w-6 h-6 text-red-400" />,
      items: [
        'Opened or used products (for hygiene reasons)',
        'Items without original packaging',
        'Products damaged by misuse',
        'Items returned after 30 days',
        'Personalized or custom products'
      ]
    }
  ];

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

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center space-x-4 mb-8">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-primary-400"
                ></motion.div>
                <span className="text-primary-400 font-medium text-sm uppercase tracking-[0.2em]">
                  Customer Care
                </span>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-primary-400"
                ></motion.div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-none">
                RETURNS &
                <span className="block text-primary-400">EXCHANGES</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                We want you to be completely satisfied with your purchase. Easy returns within 30 days.
              </p>
            </motion.div>

            {/* Return Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-jet-900 border border-white/20 p-8 mb-16 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
              
              <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-wider text-center">
                Return Process
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {returnSteps.map((step, index) => (
                  <div key={step.step} className="relative">
                    <div className="bg-black border border-white/10 p-6 text-center relative overflow-hidden group hover:border-primary-400/50 transition-all duration-300">
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      
                      <div className="text-4xl font-bold text-primary-400/30 mb-4">{step.step}</div>
                      
                      <div className="w-12 h-12 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center mx-auto mb-4">
                        <div className="text-primary-400">
                          {step.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {index < returnSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <div className="w-6 h-6 bg-primary-400 flex items-center justify-center">
                          <ArrowLeft className="w-4 h-4 text-black rotate-180" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Return Conditions */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {returnConditions.map((condition, index) => (
                <motion.div
                  key={condition.title}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
                >
                  <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
                  
                  <div className="flex items-center space-x-3 mb-6">
                    {condition.icon}
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                      {condition.title}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {condition.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          index === 0 ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-gray-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Refund Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-jet-900 border border-white/20 p-8 mb-16 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-t-[30px] border-t-primary-400/30"></div>
              
              <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-wider text-center">
                Refund Information
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">
                    Processing Time
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Refunds are processed within 5-7 business days after we receive your return
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-8 h-8 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">
                    Refund Method
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Refunds are issued to the original payment method used for the purchase
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">
                    Full Refund
                  </h3>
                  <p className="text-gray-300 text-sm">
                    You will receive a full refund including original shipping charges (if applicable)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-jet-900 border border-yellow-400/30 p-8 relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-yellow-400/30"></div>
              
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
                    Important Notice
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <p>
                      • Due to the nature of our wellness products, we cannot accept returns of opened or used items for health and safety reasons.
                    </p>
                    <p>
                      • All returns must be initiated within 30 days of delivery date.
                    </p>
                    <p>
                      • Products must be returned in their original condition with all seals intact.
                    </p>
                    <p>
                      • We reserve the right to refuse returns that do not meet our return policy criteria.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="mt-16 bg-jet-900 border border-white/20 p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
              
              <RotateCcw className="w-12 h-12 text-primary-400 mx-auto mb-6" />
              
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
                Need to Return an Item?
              </h3>
              
              <p className="text-gray-300 mb-8 leading-relaxed">
                Our customer support team is here to help you with your return or exchange.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/orders'}
                  className="bg-primary-400 text-black px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                >
                  Start Return Process
                </button>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="border border-white/20 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
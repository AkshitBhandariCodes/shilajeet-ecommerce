'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Search, Package, Shield, Clock, Heart } from 'lucide-react';
import { useState } from 'react';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<string | null>('what-is-shilajit');

  const faqCategories = [
    {
      id: 'product',
      title: 'Product Information',
      icon: <Package className="w-6 h-6" />,
      faqs: [
        {
          id: 'what-is-shilajit',
          question: 'What is Shilajit and where does it come from?',
          answer: 'Shilajit is a natural substance found primarily in the rocks of the Himalayas. It develops over centuries from the slow decomposition of plants and is rich in minerals and fulvic acid. Our Shilajit is sourced from pristine locations at 16,000+ feet altitude in the Himalayas, ensuring maximum purity and potency.'
        },
        {
          id: 'how-to-use',
          question: 'How do I use Agnishila Shilajit products?',
          answer: 'For our resin: Take a rice grain-sized portion (300-500mg) and dissolve it in warm water or milk. For gummies: Take 2 gummies daily with meals. Always start with the recommended dosage and consult with a healthcare professional if you have any concerns.'
        },
        {
          id: 'benefits',
          question: 'What are the main benefits of Shilajit?',
          answer: 'Shilajit may help boost energy levels, enhance cognitive function, support immune system, improve physical performance, and provide anti-aging properties. It contains over 84 minerals and fulvic acid that support overall wellness and vitality.'
        },
        {
          id: 'quality-testing',
          question: 'How do you ensure product quality?',
          answer: 'Every batch undergoes rigorous 3rd party lab testing for heavy metals, contaminants, and authenticity. We maintain strict quality control from sourcing to packaging, ensuring you receive only the purest, most potent Shilajit available.'
        }
      ]
    },
    {
      id: 'orders',
      title: 'Orders & Shipping',
      icon: <Clock className="w-6 h-6" />,
      faqs: [
        {
          id: 'shipping-time',
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Same Day delivery is available in select metro cities. Free shipping is available on orders above ₹999.'
        },
        {
          id: 'order-tracking',
          question: 'How can I track my order?',
          answer: 'Once your order ships, you will receive a tracking number via email and SMS. You can also track your order by logging into your account and visiting the Orders section.'
        },
        {
          id: 'order-changes',
          question: 'Can I modify or cancel my order?',
          answer: 'Orders can be modified or cancelled within 2 hours of placement. After this time, orders enter processing and cannot be changed. Please contact our support team immediately if you need to make changes.'
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Usage',
      icon: <Shield className="w-6 h-6" />,
      faqs: [
        {
          id: 'side-effects',
          question: 'Are there any side effects?',
          answer: 'Shilajit is generally safe for most people when taken as directed. Some may experience mild digestive discomfort initially. Start with a smaller dose and gradually increase. Consult your healthcare provider before use, especially if pregnant, nursing, or taking medications.'
        },
        {
          id: 'who-should-not-use',
          question: 'Who should not use Shilajit?',
          answer: 'Pregnant or nursing women, children under 18, and individuals with certain medical conditions should consult a healthcare professional before use. Those with iron overload disorders should avoid Shilajit due to its mineral content.'
        },
        {
          id: 'storage',
          question: 'How should I store Shilajit products?',
          answer: 'Store in a cool, dry place away from direct sunlight. Keep the container tightly sealed. Resin may become harder in cold temperatures and softer in warm temperatures - this is normal and does not affect quality.'
        }
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: <Heart className="w-6 h-6" />,
      faqs: [
        {
          id: 'return-policy',
          question: 'What is your return policy?',
          answer: 'We offer a 7-days return policy for unopened products in original packaging. Due to health and safety regulations, opened products cannot be returned. Defective or damaged items can be returned regardless of condition.'
        },
        {
          id: 'refund-process',
          question: 'How long do refunds take?',
          answer: 'Refunds are processed within 5-7 business days after we receive your return. The refund will be issued to your original payment method. You will receive an email confirmation once the refund is processed.'
        },
        {
          id: 'return-shipping',
          question: 'Who pays for return shipping?',
          answer: 'We provide free return shipping for defective or damaged products. For other returns, customers are responsible for return shipping costs unless the return is due to our error.'
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

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
                  Help Center
                </span>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-primary-400"
                ></motion.div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-none">
                FREQUENTLY
                <span className="block text-primary-400">ASKED QUESTIONS</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Find answers to common questions about our products, shipping, and wellness journey.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative mb-12"
            >
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-jet-900 border border-white/20 text-white pl-12 pr-4 py-4 focus:outline-none focus:border-primary-400 transition-colors placeholder-gray-400"
                />
              </div>
            </motion.div>

            {/* FAQ Categories */}
            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + categoryIndex * 0.1, duration: 0.6 }}
                  className="bg-jet-900 border border-white/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
                  
                  {/* Category Header */}
                  <div className="p-6 border-b border-white/20">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center">
                        <div className="text-primary-400">
                          {category.icon}
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                        {category.title}
                      </h2>
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="divide-y divide-white/10">
                    {category.faqs.map((faq, faqIndex) => (
                      <div key={faq.id} className="p-6">
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full flex items-center justify-between text-left group"
                        >
                          <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors pr-4">
                            {faq.question}
                          </h3>
                          <div className="flex-shrink-0">
                            {openFAQ === faq.id ? (
                              <ChevronUp className="w-5 h-5 text-primary-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
                            )}
                          </div>
                        </button>
                        
                        {openFAQ === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-white/10"
                          >
                            <p className="text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-16 bg-jet-900 border border-white/20 p-8 text-center relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
              
              <HelpCircle className="w-12 h-12 text-primary-400 mx-auto mb-6" />
              
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
                Still Have Questions?
              </h3>
              
              <p className="text-gray-300 mb-8 leading-relaxed">
                Can't find what you're looking for? Our customer support team is here to help.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="bg-primary-400 text-black px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => window.location.href = 'mailto:info@agnishila.in'}
                  className="border border-white/20 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                >
                  Email Us
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
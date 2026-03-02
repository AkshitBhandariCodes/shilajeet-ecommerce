'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, Users } from 'lucide-react';

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: <CheckCircle className="w-6 h-6" />,
      content: [
        'By accessing and using our website, you accept and agree to be bound by these terms',
        'If you do not agree to these terms, please do not use our services',
        'We reserve the right to modify these terms at any time',
        'Continued use of our services constitutes acceptance of updated terms'
      ]
    },
    {
      title: 'Product Information',
      icon: <FileText className="w-6 h-6" />,
      content: [
        'All product descriptions and information are provided for general guidance only',
        'We strive for accuracy but cannot guarantee all information is error-free',
        'Products are subject to availability and may be discontinued without notice',
        'Prices are subject to change without prior notification'
      ]
    },
    {
      title: 'User Responsibilities',
      icon: <Users className="w-6 h-6" />,
      content: [
        'Provide accurate and complete information when creating accounts',
        'Maintain the security of your account credentials',
        'Use our services only for lawful purposes',
        'Respect intellectual property rights and do not misuse our content'
      ]
    },
    {
      title: 'Limitation of Liability',
      icon: <Shield className="w-6 h-6" />,
      content: [
        'Our liability is limited to the maximum extent permitted by law',
        'We are not responsible for indirect, incidental, or consequential damages',
        'Total liability shall not exceed the amount paid for the specific product or service',
        'Some jurisdictions do not allow limitation of liability, so these may not apply to you'
      ]
    },
    {
      title: 'Health Disclaimers',
      icon: <AlertTriangle className="w-6 h-6" />,
      content: [
        'Our products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease',
        'Consult with a healthcare professional before using our products',
        'Individual results may vary and are not guaranteed',
        'Pregnant or nursing women should consult their physician before use'
      ]
    },
    {
      title: 'Governing Law',
      icon: <Scale className="w-6 h-6" />,
      content: [
        'These terms are governed by the laws of India',
        'Any disputes will be resolved in the courts of India',
        'If any provision is found unenforceable, the remainder shall remain in effect',
        'These terms constitute the entire agreement between you and Agnishila'
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
                  Legal
                </span>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-primary-400"
                ></motion.div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-none">
                TERMS OF
                <span className="block text-primary-400">SERVICE</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Please read these terms carefully before using our services. They govern your use of our website and products.
              </p>
              
              <div className="mt-8 bg-primary-400/10 border border-primary-400/30 p-4 inline-block">
                <p className="text-primary-300 text-sm">Last updated: December 2025</p>
              </div>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center">
                      <div className="text-primary-400">
                        {section.icon}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                      {section.title}
                    </h2>
                  </div>

                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-12 bg-jet-900 border border-white/20 p-8 text-center relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
              
              <Scale className="w-12 h-12 text-primary-400 mx-auto mb-6" />
              
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
                Questions About These Terms?
              </h3>
              
              <p className="text-gray-300 mb-8 leading-relaxed">
                If you have any questions about these terms of service, please contact our legal team.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="bg-primary-400 text-black px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => window.location.href = 'mailto:legal@agnishila.com'}
                  className="border border-white/20 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                >
                  Email Legal Team
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
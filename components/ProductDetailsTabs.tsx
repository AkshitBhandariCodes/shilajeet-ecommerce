'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface ProductDetailsTabsProps {
  features: string[];
  detailedDescription: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  certifications: string[];
}

export default function ProductDetailsTabs({
  features,
  detailedDescription,
  ingredients,
  benefits,
  usage,
  certifications
}: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'howToUse'>('details');

  return (
    <div className="bg-jet-900 border border-white/20 p-8">
      {/* Tabs */}
      <div className="flex border-b border-white/20 mb-8">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-6 py-3 font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === 'details'
            ? 'text-white border-b-2 border-primary-400'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('howToUse')}
          className={`px-6 py-3 font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === 'howToUse'
            ? 'text-white border-b-2 border-primary-400'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          How to Use?
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'details' ? (
          <div className="space-y-8">
            {/* Product Description */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
                Presenting India's First Shilajit Gummies!
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                {detailedDescription}
              </p>
            </div>

            {/* Key Features */}
            <div>
              <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
                Key Features
              </h4>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
                Benefits
              </h4>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                Certifications & Quality
              </h4>
              <div className="flex flex-wrap gap-6 items-center mb-6">
                <div className="w-24 h-24 flex items-center justify-center">
                  <Image 
                    src='https://res.cloudinary.com/dsejv31js/image/upload/v1767090392/agnishila/certification/GMP.png' 
                    alt="GMP Certified" 
                    width={96} 
                    height={96}
                    className="object-contain transition-all duration-300"
                    style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(15%) saturate(500%) hue-rotate(290deg) brightness(95%) contrast(90%)' }}
                  />
                </div>
                <div className="w-24 h-24 flex items-center justify-center">
                  <Image 
                    src='https://res.cloudinary.com/dsejv31js/image/upload/v1767090393/agnishila/certification/HACCP.png' 
                    alt="HACCP Certified" 
                    width={96} 
                    height={96}
                    className="object-contain transition-all duration-300"
                    style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(15%) saturate(500%) hue-rotate(290deg) brightness(95%) contrast(90%)' }}
                  />
                </div>
                <div className="w-24 h-24 flex items-center justify-center">
                  <Image 
                    src='https://res.cloudinary.com/dsejv31js/image/upload/v1767090394/agnishila/certification/ISO-22000.png' 
                    alt="ISO 22000 Certified" 
                    width={96} 
                    height={96}
                    className="object-contain transition-all duration-300"
                    style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(15%) saturate(500%) hue-rotate(290deg) brightness(95%) contrast(90%)' }}
                  />
                </div>
                <div className="w-24 h-24 flex items-center justify-center">
                  <Image 
                    src='https://res.cloudinary.com/dsejv31js/image/upload/v1767090391/agnishila/certification/FDA.png' 
                    alt="FDA Approved" 
                    width={96} 
                    height={96}
                    className="object-contain transition-all duration-300"
                    style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(15%) saturate(500%) hue-rotate(290deg) brightness(95%) contrast(90%)' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{cert}</span>
                  </div>
                ))}
              </div>
            </div>


          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              How to Use
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {usage}
            </p>

            <div className="bg-black border border-white/20 p-6 mt-6">
              <h4 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">
                Dosage Instructions
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Take 2 gummies daily after meals</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Do not exceed recommended dosage</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Best results when taken consistently for 3 months</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-400/10 border border-primary-400/30 p-6 mt-6">
              <h4 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">
                Important Notes
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Consult your healthcare provider before use if pregnant or nursing</li>
                <li>• Keep out of reach of children</li>
                <li>• Store in a cool, dry place away from direct sunlight</li>
                <li>• Not intended to diagnose, treat, cure, or prevent any disease</li>
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

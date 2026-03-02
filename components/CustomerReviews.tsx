'use client';

import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Star, Quote, CheckCircle, ThumbsUp, Heart, Zap } from 'lucide-react';
import { useState } from 'react';

const reviews = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    title: 'IT Professional',
    rating: 5,
    comment: 'Shilajit ShilaBoost Gummies have completely transformed my energy levels! The combination of Gokhru and Ginger Extract is incredible. I feel more focused at work and my stamina has improved significantly. These gummies are worth every rupee.',
    date: 'December 2025',
    verified: true,
    location: 'Bangalore, India'
  },
  {
    id: 2,
    name: 'Priya Patel',
    title: 'Fitness Enthusiast',
    rating: 5,
    comment: 'The Shilajit Gummies are a game-changer! So convenient and tasty. I take them before my morning workout and the energy boost is amazing. No bitterness like traditional shilajit. Perfect for my busy lifestyle.',
    date: 'December 2025',
    verified: true,
    location: 'Mumbai, India'
  },
  {
    id: 3,
    name: 'Amit Verma',
    title: 'Business Owner',
    rating: 5,
    comment: 'I\'ve tried many Shilajit brands, but KSM-66 AshwaGlow Gummies stand out. The lab certification and purity are evident. These gummies have improved my mental clarity and stress management remarkably. Highly recommended!',
    date: 'December 2025',
    verified: true,
    location: 'Delhi, India'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    title: 'Yoga Instructor',
    rating: 5,
    comment: 'KSM-66 AshwaGlow Gummies are perfect for stress relief! The quality is top-notch. I recommend these to all my students. Natural taste, effective results, and helps with sleep quality too.',
    date: 'December 2025',
    verified: true,
    location: 'Hyderabad, India'
  },
  {
    id: 5,
    name: 'Arjun Nair',
    title: 'Athlete & Sports Nutritionist',
    rating: 5,
    comment: 'TruBlk Gold Resin is exceptional! The combination of Shilajit with KSM-66 Ashwagandha and Safed Musli is scientifically brilliant. My performance metrics have improved dramatically - better endurance, faster recovery, and enhanced mental focus. This is the premium product I\'ve been searching for.',
    date: 'January 2026',
    verified: true,
    location: 'Chennai, India'
  },
  {
    id: 6,
    name: 'Deepika Sharma',
    title: 'Wellness Coach',
    rating: 5,
    comment: 'TruBlk Gold Resin has revolutionized my wellness practice! The lab certifications and purity are unmatched. My clients report significant improvements in energy, stamina, and hormonal balance within weeks. The Swarna Bhasma addition makes it truly premium. Highly recommend to serious wellness enthusiasts.',
    date: 'January 2026',
    verified: true,
    location: 'Pune, India'
  }
];

const ReviewCard = ({ review, index }: { review: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      viewport={{ once: true }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-jet-900 border border-white/20 hover:border-primary-400/50 transition-all duration-500 overflow-hidden h-full flex flex-col">
        {/* Sharp corner accent */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/20 group-hover:border-t-primary-400/40 transition-all duration-300"></div>
        
        {/* Content */}
        <div className="p-8 flex flex-col flex-grow">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-white font-bold text-lg tracking-tight">{review.name}</h4>
                {review.verified && (
                  <div className="w-2 h-2 bg-primary-400 transform rotate-45"></div>
                )}
              </div>
              <p className="text-gray-400 text-sm font-medium">{review.title}</p>
              <p className="text-gray-500 text-xs mt-1">{review.location}</p>
            </div>

            {/* Quote Icon */}
            <div className="text-white/10 group-hover:text-primary-400/20 transition-colors duration-300">
              <Quote size={24} />
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-4 bg-primary-400"></div>
              ))}
            </div>
            <span className="text-white font-bold text-sm">{review.rating}.0</span>
          </div>

          {/* Review Text */}
          <blockquote className="text-gray-300 leading-relaxed mb-8 font-light text-base flex-grow">
            "{review.comment}"
          </blockquote>

          {/* Bottom */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">
              {review.date}
            </div>
            
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-primary-400"></div>
              <div className="w-1 h-1 bg-primary-400/60"></div>
              <div className="w-1 h-1 bg-primary-400/30"></div>
            </div>
          </div>
        </div>

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-400/5 to-transparent opacity-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

import SectionBlend from './SectionBlend';

export default function CustomerReviews() {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Jet Black Background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Section blending for smooth transitions */}
      <div className="absolute inset-0">
        <SectionBlend position="both" height="xl" intensity="medium" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-1 bg-primary-400"></div>
            <span className="text-primary-400 font-medium text-sm uppercase tracking-[0.2em]">
              Client Testimonials
            </span>
          </div>

          <h2 className="text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
            PREMIUM
            <span className="block text-primary-400">VALIDATION</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
            Testimonials from industry leaders, medical professionals, and high-performance individuals who demand excellence.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* Overall Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-jet-900 border border-white/20 p-16 max-w-4xl mx-auto relative overflow-hidden">
            {/* Sharp corner accents */}
            <div className="absolute top-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-t-[30px] border-t-primary-400/30"></div>
            <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-primary-400/30"></div>

            <div className="relative">
              {/* Rating Display */}
              <div className="flex items-center justify-center space-x-6 mb-12">
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-8 bg-primary-400"></div>
                  ))}
                </div>
                <span className="text-6xl font-bold text-white tracking-tight">4.9</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-400 mb-2 tracking-tight">1,247+</div>
                  <div className="text-gray-400 text-sm uppercase tracking-[0.15em]">Verified Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-400 mb-2 tracking-tight">98%</div>
                  <div className="text-gray-400 text-sm uppercase tracking-[0.15em]">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-400 mb-2 tracking-tight">5.0</div>
                  <div className="text-gray-400 text-sm uppercase tracking-[0.15em]">Average Rating</div>
                </div>
              </div>

              {/* Bottom text */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-gray-300 font-light text-lg">
                  Trusted by professionals who demand the highest standards of quality and performance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Shield, Award, Leaf, Mountain, Microscope, Sparkles } from 'lucide-react';
import SectionBlend from './SectionBlend';

// Product-specific benefits configuration
const productBenefits: { [key: string]: any[] } = {
  'ashwa-glo-gummies': [
    {
      id: 1,
      icon: <Sparkles className="w-16 h-16" />,
      title: 'Powered by KSM-66 Ashwagandha',
      description: 'The world\'s most clinically researched Ashwagandha extract',
      detail: 'The world\'s most clinically researched Ashwagandha extract for stress & sleep.',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=600&fit=crop&auto=format',
      stats: 'KSM-66',
      benefit: 'Clinically Proven'
    },
    {
      id: 2,
      icon: <Sparkles className="w-16 h-16" />,
      title: 'Delicious Gummies, No Bitter Taste',
      description: 'All the benefits in a tasty, easy-to-eat gummy',
      detail: 'All the benefits of Ashwagandha in a tasty, easy-to-eat gummy.',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=800&h=600&fit=crop&auto=format',
      stats: 'Tasty',
      benefit: 'Easy to Take'
    },
    {
      id: 3,
      icon: <Shield className="w-16 h-16" />,
      title: 'Natural Stress Relief + Deep Sleep Support',
      description: 'Calms your mind, relaxes your body',
      detail: 'Calms your mind, relaxes your body, and improves sleep quality.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop&auto=format',
      stats: 'Natural',
      benefit: 'Stress Relief'
    },
    {
      id: 4,
      icon: <Award className="w-16 h-16" />,
      title: 'Non-Habit Forming',
      description: 'Safe for daily long-term use',
      detail: 'Safe for daily long-term use — no drowsiness or dependency.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&auto=format',
      stats: 'Safe',
      benefit: 'No Dependency'
    },
    {
      id: 5,
      icon: <Microscope className="w-16 h-16" />,
      title: 'Clean, Pure & Safe',
      description: 'Made in GMP, HACCP & FDA-compliant facilities',
      detail: 'Made in GMP, HACCP & FDA-compliant facilities. Lab-tested for purity, safety & quality.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090380/agnishila/background/GMP%2CHACCP.jpg',
      stats: 'Lab Tested',
      benefit: 'Quality Assured'
    },
    {
      id: 6,
      icon: <Zap className="w-16 h-16" />,
      title: 'Perfect for Modern, Busy Lifestyles',
      description: 'Helps manage work stress, anxiety, mood swings',
      detail: 'Helps manage work stress, anxiety, mood swings, and poor sleep naturally.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090379/agnishila/background/Formodernwellness.jpg',
      stats: 'Daily Use',
      benefit: 'Modern Wellness'
    }
  ],
  'agnishila-shilajit-gummies': [
    {
      id: 1,
      icon: <Sparkles className="w-16 h-16" />,
      title: 'Pure Shilajit Resin for Real Energy',
      description: 'Authentic Shilajit Resin rich in fulvic minerals',
      detail: 'Unlike ordinary gummies that use low-quality extracts, ShilaBoost is made with authentic Shilajit Resin rich in fulvic minerals — giving you better stamina, strength, and recovery.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090383/agnishila/background/realenergy.jpg',
      stats: 'Pure Resin',
      benefit: 'Real Energy'
    },
    {
      id: 2,
      icon: <Leaf className="w-16 h-16" />,
      title: 'Enhanced with Ayurvedic Performance Herbs',
      description: 'Gokhru, Black Musli, and Ginger Extract',
      detail: 'Our formulation combines Gokhru for strength and endurance, Black Musli for vitality and performance, and Ginger Extract for better digestion and absorption. This powerful blend makes ShilaBoost more effective than regular Shilajit supplements.',
      image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=800&h=600&fit=crop&auto=format',
      stats: 'Ayurvedic',
      benefit: 'Performance Herbs'
    },
    {
      id: 3,
      icon: <Zap className="w-16 h-16" />,
      title: 'Fast-Absorbing & Delicious',
      description: 'No bitter taste. No mixing.',
      detail: 'Each gummy is designed for quick absorption, delivering smooth, sustained energy throughout the day.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090378/agnishila/background/fastabsorbing.jpg',
      stats: 'Fast Acting',
      benefit: 'Quick Absorption'
    },
    {
      id: 4,
      icon: <Award className="w-16 h-16" />,
      title: 'Daily Stamina for Active Lifestyles',
      description: 'Perfect for professionals, athletes, gym-goers',
      detail: 'Perfect for professionals, athletes, gym-goers, or anyone who needs an all-day natural boost in energy, focus, and performance.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
      stats: 'All Day',
      benefit: 'Active Lifestyle'
    },
    {
      id: 5,
      icon: <Shield className="w-16 h-16" />,
      title: 'Clean, Safe & Lab Tested',
      description: 'Made in GMP & HACCP-certified facilities',
      detail: 'Made in GMP & HACCP-certified facilities, each batch is tested for purity, safety, heavy metals, and quality. You get wellness you can trust — without compromise.',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop&auto=format',
      stats: 'Lab Verified',
      benefit: 'Total Safety'
    },
    {
      id: 6,
      icon: <Microscope className="w-16 h-16" />,
      title: 'Agnishila\'s Promise of Purity & Potency',
      description: 'Honest, high-quality, and effective wellness products',
      detail: 'From sourcing to formulation, we ensure honest, high-quality, and effective wellness products backed by ancient Ayurveda and modern science.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090382/agnishila/background/pureand.jpg',
      stats: '100%',
      benefit: 'Pure & Potent'
    }
  ],
  'agnishila-trublk-gold-resin': [
    {
      id: 1,
      icon: <Zap className="w-16 h-16" />,
      title: 'Pure & Potent Formulations',
      description: 'High fulvic acid, maximum bioavailability, zero fillers',
      detail: 'Our TruBlk™ Shilajit embodies the finest expression of Shilajit - contain high fulvic acid, maximum bioavailability, and zero unnecessary fillers.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090382/agnishila/background/pureand.jpg',
      stats: 'TruBlk™',
      benefit: 'Premium Quality'
    },
    {
      id: 2,
      icon: <Mountain className="w-16 h-16" />,
      title: 'Authentic Himalayan Sourcing',
      description: 'Sourced from untouched high-altitude regions',
      detail: 'We source Shilajit from the untouched high-altitude Himalayan regions, ensuring purity, strength, and natural energy.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
      stats: '16,000+ Feet',
      benefit: 'Pure Origin'
    },
    {
      id: 3,
      icon: <Shield className="w-16 h-16" />,
      title: 'Lab-Tested for Safety',
      description: 'FSSAI approved, 3rd-party verified',
      detail: 'Every batch is FSSAI approved, 3rd-party lab verified and tested for heavy metals, ensuring total safety.',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop&auto=format',
      stats: 'Lab Verified',
      benefit: 'Total Safety'
    },
    {
      id: 4,
      icon: <Award className="w-16 h-16" />,
      title: 'GMP, HACCP & FDA-Compliant Manufacturing',
      description: 'International benchmarks for excellence',
      detail: 'Every batch of TruBlk™ undergoes exhaustive screening for heavy metals, solvent residues, microbial contaminants, and adulterants. Manufactured in GMP- and ISO-certified facilities, validated for stability and safety — it meets international benchmarks for excellence. Because the world\'s finest Shilajit deserves uncompromising purity.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090380/agnishila/background/GMP%2CHACCP.jpg',
      stats: 'GMP & ISO',
      benefit: 'Certified'
    },
    {
      id: 5,
      icon: <Leaf className="w-16 h-16" />,
      title: 'Modern Wellness Meets Ancient Ayurveda',
      description: 'Ancient wisdom with cutting-edge technology',
      detail: 'Agnishila blends ancient wisdom with cutting-edge extraction technology for maximum results.',
      image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=800&h=600&fit=crop&auto=format',
      stats: '5000+ Years',
      benefit: 'Ayurvedic'
    },
    {
      id: 6,
      icon: <Microscope className="w-16 h-16" />,
      title: 'Transparency You Can Trust',
      description: 'Clinically evaluated, scientifically standardized',
      detail: 'No shortcuts. Agnishila TruBlk™ is Clinically Evaluated, Scientifically Standardized & Absolutely Traceable.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090385/agnishila/background/transparency.jpg',
      stats: '100%',
      benefit: 'Traceable'
    },
    {
      id: 7,
      icon: <Sparkles className="w-16 h-16" />,
      title: 'Crafted for Everyday Performance',
      description: 'Trusted by global brands for strength and vitality',
      detail: 'Agnishila TruBlk™ embodies the finest expression of Shilajit — crafted through precision, validated through science, and trusted by global brands for its strength, stamina, stress relief, or daily vitality.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
      stats: 'Daily Use',
      benefit: 'Performance'
    }
  ],
  'default': [
    {
      id: 1,
      icon: <Zap className="w-16 h-16" />,
      title: 'Pure & Potent Formulations',
      description: 'High fulvic acid, maximum bioavailability, zero fillers',
      detail: 'Our Shilajit and Ashwagandha products contain high fulvic acid, maximum bioavailability, and zero unnecessary fillers.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090382/agnishila/background/pureand.jpg',
      stats: 'Premium',
      benefit: 'Quality'
    },
    {
      id: 2,
      icon: <Mountain className="w-16 h-16" />,
      title: 'Authentic Himalayan Sourcing',
      description: 'Sourced from untouched high-altitude regions',
      detail: 'We source Shilajit from the untouched high-altitude Himalayan regions, ensuring purity, strength, and natural energy.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
      stats: '16,000+ Feet',
      benefit: 'Pure Origin'
    },
    {
      id: 3,
      icon: <Shield className="w-16 h-16" />,
      title: 'Lab-Tested for Safety',
      description: 'FSSAI approved, 3rd-party verified',
      detail: 'Every batch is FSSAI approved, 3rd-party lab verified and tested for heavy metals, ensuring total safety.',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop&auto=format',
      stats: 'Lab Verified',
      benefit: 'Total Safety'
    },
    {
      id: 4,
      icon: <Award className="w-16 h-16" />,
      title: 'GMP, HACCP & FDA-Compliant Manufacturing',
      description: 'International benchmarks for excellence',
      detail: 'We follow the strictest global quality standards so every product delivers consistent results.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090380/agnishila/background/GMP%2CHACCP.jpg',
      stats: 'GMP & ISO',
      benefit: 'Certified'
    },
    {
      id: 5,
      icon: <Leaf className="w-16 h-16" />,
      title: 'Modern Wellness Meets Ancient Ayurveda',
      description: 'Ancient wisdom with cutting-edge technology',
      detail: 'Agnishila blends ancient wisdom with cutting-edge extraction technology for maximum results.',
      image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=800&h=600&fit=crop&auto=format',
      stats: '5000+ Years',
      benefit: 'Ayurvedic'
    },
    {
      id: 6,
      icon: <Microscope className="w-16 h-16" />,
      title: 'Transparency You Can Trust',
      description: 'No shortcuts. No marketing gimmicks.',
      detail: 'No shortcuts. No marketing gimmicks. Only clean, honest ingredients.',
      image: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090385/agnishila/background/transparency.jpg',
      stats: '100%',
      benefit: 'Transparent'
    },
    {
      id: 7,
      icon: <Sparkles className="w-16 h-16" />,
      title: 'Crafted for Everyday Performance',
      description: 'Support your lifestyle naturally',
      detail: 'Whether it\'s strength, stamina, stress relief, or daily vitality — Agnishila products support your lifestyle naturally.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
      stats: 'Daily Use',
      benefit: 'Performance'
    }
  ]
};

interface InnovativeCarouselProps {
  productName?: string;
  productId?: string;
  startIndex?: number;
}

// Product-specific intro texts
const productIntros: { [key: string]: { intro: string; tagline: string } } = {
  'ashwa-glo-gummies': {
    intro: 'Experience calmness like never before. KSM-66 AshwaGlow Gummies combine clinically proven KSM-66 Ashwagandha with a delicious gummy format to help your mind relax, your stress melt away, and your nights become peaceful.',
    tagline: 'Stress Relief & Deep Sleep, The Natural Way'
  },
  'agnishila-shilajit-gummies': {
    intro: 'Agnishila ShilaBoost Gummies are crafted for those who want natural energy, stamina, and vitality in the easiest and tastiest form. Powered by pure Shilajit Resin, Gokhru, Ginger Extract, and Black Musli, they deliver maximum benefits with zero bitterness.',
    tagline: 'Natural Energy & Stamina in Every Gummy'
  },
  'agnishila-trublk-gold-resin': {
    intro: 'At Agnishila, after years of research we bring the purest form of Himalayan wellness straight to you — Shilajit enters a new era - one defined by proof, purity, and purpose.',
    tagline: 'Introducing Agnishila TruBlk™ — the gold standard in clinically validated, globally compliant Shilajit. Born in India. Built for global trust.'
   },
  'default': {
    
     intro: 'At Agnishila, after years of research we bring the purest form of Himalayan wellness straight to you — Shilajit enters a new era - one defined by proof, purity, and purpose.',
    tagline: 'The gold standard in clinically validated, globally compliant Shilajit. Born in India. Built for global trust.'
  
  }
};

export default function InnovativeCarousel({ productName, productId, startIndex = 0 }: InnovativeCarouselProps = {}) {
  // Get product-specific benefits or use default
  const benefits = productId && productBenefits[productId] ? productBenefits[productId] : productBenefits['default'];
  const intro = productId && productIntros[productId] ? productIntros[productId] : productIntros['default'];
  const slideRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize carousel with startIndex
  useEffect(() => {
    if (slideRef.current && !isInitialized && startIndex > 0) {
      const items = slideRef.current.querySelectorAll('.carousel-item');
      // Rotate items to start from the specified index
      for (let i = 0; i < startIndex % items.length; i++) {
        slideRef.current.appendChild(items[i]);
      }
      setIsInitialized(true);
    }
  }, [startIndex, isInitialized]);

  const nextSlide = () => {
    if (slideRef.current) {
      const items = slideRef.current.querySelectorAll('.carousel-item');
      slideRef.current.appendChild(items[0]);
    }
  };

  const prevSlide = () => {
    if (slideRef.current) {
      const items = slideRef.current.querySelectorAll('.carousel-item');
      slideRef.current.prepend(items[items.length - 1]);
    }
  };

  return (
    <section className="py-24 bg-black overflow-hidden relative">
      {/* Jet Black Background */}
    
      
      {/* Section blending for smooth transitions */}

        <SectionBlend position="both" height="xl" intensity="medium" />
    
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20 px-4"
        >

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white-to-mauve mb-8 leading-tight pb-4">
            Why Choose {productName || 'Agnishila'}?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6">
            {intro.intro}
          </p>
          <p className="text-lg sm:text-xl text-primary-400 max-w-4xl mx-auto leading-relaxed font-semibold">
            {intro.tagline}
          </p>
        </motion.div>

        {/* Enhanced Carousel Container */}
        <div className="relative">
          <div className="carousel-container relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-jet-900 to-black rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-white/10">

            {/* Carousel Slide Container */}
            <div ref={slideRef} className="carousel-slide relative w-full h-full">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className="carousel-item absolute w-[280px] md:w-[320px] h-[380px] md:h-[420px] top-1/2 transform -translate-y-1/2 rounded-xl md:rounded-2xl shadow-2xl transition-all duration-500 ease-in-out overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${benefit.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Content that appears on the active slide */}
                  <div className="content absolute top-1/2 left-4 md:left-[80px] w-[calc(100%-2rem)] md:w-[500px] text-left text-white transform -translate-y-1/2 hidden pr-4 md:pr-8">
                    <motion.div
                      className="mb-6 text-primary-400"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      
                    </motion.div>

                    <motion.h3
                      className="text-4xl font-bold uppercase mb-6 leading-tight"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      {benefit.title}
                    </motion.h3>

                    <motion.p
                      className="text-lg mb-8 opacity-90 leading-relaxed"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {benefit.detail}
                    </motion.p>

                    <motion.div
                      className="flex items-center space-x-6 mb-8"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <div className="bg-primary-400/10 border border-primary-400/30 px-6 py-3">
                        <div className="text-2xl font-bold text-primary-400">{benefit.stats}</div>
                        <div className="text-sm text-gray-300">{benefit.benefit}</div>
                      </div>
                    </motion.div>

                    
                  </div>

                  {/* Card overlay for non-active slides */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 pb-8">
                    <div className="text-primary-400 mb-3">
                      {benefit.icon}
                    </div>
                    <h4 className="text-white font-bold text-xl mb-3 leading-tight">{benefit.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="navigation-buttons absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6">
              <motion.button
                onClick={prevSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/20 transition-all duration-300 flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </motion.button>

              <motion.button
                onClick={nextSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/20 transition-all duration-300 flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">100%</div>
            <div className="text-gray-300">Pure & Natural</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">84+</div>
            <div className="text-gray-300">Essential Minerals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">16K+</div>
            <div className="text-gray-300">Feet Altitude</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">50+</div>
            <div className="text-gray-300">Research Studies</div>
          </div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        /* Mobile: Show only active slide */
        @media (max-width: 768px) {
          .carousel-item:nth-child(1),
          .carousel-item:nth-child(2) {
            top: 0;
            left: 0;
            transform: translate(0, 0);
            border-radius: 16px;
            width: 100%;
            height: 100%;
          }

          .carousel-item:nth-child(n + 3) {
            display: none;
          }

          .carousel-item:nth-child(2) .content {
            display: none;
          }
        }

        /* Desktop: Show carousel effect */
        @media (min-width: 769px) {
          .carousel-item:nth-child(1),
          .carousel-item:nth-child(2) {
            top: 0;
            left: 0;
            transform: translate(0, 0);
            border-radius: 0;
            width: 100%;
            height: 100%;
            border-radius: 24px;
          }

          .carousel-item:nth-child(2) .content {
            display: block;
          }

          .carousel-item:nth-child(3) {
            left: 50%;
          }

          .carousel-item:nth-child(4) {
            left: calc(50% + 300px);
          }

          .carousel-item:nth-child(5) {
            left: calc(50% + 600px);
          }

          .carousel-item:nth-child(n + 6) {
            left: calc(50% + 900px);
            opacity: 0;
          }
        }

        .content h3,
        .content p,
        .content button,
        .content div {
          animation: slideInUp 1s ease-in-out forwards;
        }

        .content p {
          animation-delay: 0.3s;
        }

        .content button {
          animation-delay: 0.6s;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(100px);
            filter: blur(33px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
}
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SectionBlend from './SectionBlend';

interface ForegroundImage {
  url: string;
  title: string;
  subtitle: string;
}

interface HeroSettings {
  backgroundImage: {
    url: string;
  };
  foregroundImages: ForegroundImage[];
  autoPlayInterval: number;
  isActive: boolean;
}

const defaultSettings: HeroSettings = {
  backgroundImage: {
    url: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090389/agnishila/bg/vd.jpg',
  },
  foregroundImages: [
    {
      url: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090441/agnishila/out12/2.png',
      title: 'Shilajit ShilaBoost Gummies',
      subtitle: '',
    },
    {
      url: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090443/agnishila/out12/3.png',
      title: 'KSM-66 AshwaGlow Gummies',
      subtitle: '',
    }, {
      url: 'Untitleddesign.png',
      title: 'Agnishila TruBlk Gold Resin',
      subtitle: '',
    },
  ],
  autoPlayInterval: 3500,
  isActive: true,
};

export default function HeroSection() {
  const [settings, setSettings] = useState<HeroSettings>(defaultSettings);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/hero-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch hero settings:', error);
      setSettings(defaultSettings);
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || !settings.isActive) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % settings.foregroundImages.length);
    }, settings.autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, settings.autoPlayInterval, settings.foregroundImages.length, settings.isActive]);

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % settings.foregroundImages.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + settings.foregroundImages.length) % settings.foregroundImages.length);
  };

  return (
    <section className="relative min-h-screen bg-black flex items-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={settings.backgroundImage.url}
          alt="Hero Background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <SectionBlend position="bottom" height="xl" intensity="medium" />
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Mobile Product Carousel - Shows first on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:hidden relative order-1 w-full"
            onTouchStart={() => setIsAutoPlaying(false)}
            onTouchEnd={() => setIsAutoPlaying(true)}
          >
            <div className="relative w-full max-w-[320px] mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div
                  className="w-48 h-48 rounded-full opacity-50"
                  style={{
                    background: 'radial-gradient(circle, rgba(212, 165, 184, 0.5) 0%, rgba(200, 153, 172, 0.3) 50%, transparent 70%)',
                    filter: 'blur(20px)'
                  }}
                />
              </div>

              {/* Product Image Container */}
              <div className="relative w-full aspect-square z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: direction > 0 ? 50 : -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: direction > 0 ? -50 : 50, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full"
                  >
                    <img
                      src={settings.foregroundImages[currentImageIndex].url}
                      alt={settings.foregroundImages[currentImageIndex].title}
                      className="w-full h-full object-contain drop-shadow-2xl"
                      loading="eager"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center gap-2 mt-6 z-20 relative">
                {settings.foregroundImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentImageIndex ? 1 : -1);
                      setCurrentImageIndex(index);
                    }}
                    className={`transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'w-6 h-2 bg-primary-400'
                        : 'w-2 h-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
              <div className="w-8 h-0.5 bg-primary-400"></div>
              <span className="text-primary-400 font-medium text-xs uppercase tracking-[0.15em]">
                Premium Himalayan
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 lg:mb-6 leading-[1.1] tracking-tight">
              UNLOCK
              <span className="block text-white-to-mauve">ANCIENT</span>
              <span className="block">POWER</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 lg:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Experience the legendary power of pure Himalayan Shilajit. 
              Pharmaceutical-grade quality for high-performance individuals.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8 lg:mb-12">
              <Link 
                href="/products" 
                className="bg-mauve-gradient text-white px-6 py-3 font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform uppercase tracking-wider text-sm"
              >
                <span>Shop Now</span>
                <ArrowRight size={16} />
              </Link>
              <Link 
                href="/benefits" 
                className="border border-white/30 text-white hover:border-primary-400 hover:text-primary-400 px-6 py-3 font-bold transition-all uppercase tracking-wider text-sm text-center"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8">
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white-to-mauve">100%</div>
                <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Pure Grade</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white-to-mauve">Lab</div>
                <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Verified</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white-to-mauve">16K+</div>
                <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Feet Source</div>
              </div>
            </div>

            {/* 2 Raisins Validation Badge */}
       
          </motion.div>

          {/* Desktop Product Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-40 hidden lg:block order-2"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="w-[450px] h-[450px] mx-auto flex items-center justify-center relative">
                  {/* Glow background */}
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <div
                      className="w-96 h-96 rounded-full opacity-40"
                      style={{
                        background: 'radial-gradient(circle, rgba(212, 165, 184, 0.6) 0%, rgba(200, 153, 172, 0.3) 50%, transparent 70%)',
                        filter: 'blur(25px)'
                      }}
                    />
                  </div>

                  {/* Product carousel */}
                  <div className="relative w-[420px] h-[420px] overflow-hidden z-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100, scale: 0.8 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="relative w-[450px] h-[450px]">
                          <img
                            src={settings.foregroundImages[currentImageIndex].url}
                            alt={settings.foregroundImages[currentImageIndex].title}
                            className="w-full h-full object-contain drop-shadow-2xl"
                            loading="eager"
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-primary-400 p-3 z-50 transition-all border border-primary-400/30"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-primary-400 p-3 z-50 transition-all border border-primary-400/30"
                >
                  <ChevronRight size={20} />
                </button>
              </motion.div>

              {/* Product Info - Below carousel */}
              <motion.div
                key={`info-${currentImageIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center mt-8 z-30"
              >
                <div className="bg-black/80 backdrop-blur-sm border border-primary-400/30 px-6 py-3">
                  <h3 className="text-white font-bold text-lg uppercase tracking-wider">
                    {settings.foregroundImages[currentImageIndex].title}
                  </h3>
                  <p className="text-primary-400 text-sm uppercase tracking-wider">
                    {settings.foregroundImages[currentImageIndex].subtitle}
                  </p>
                </div>
              </motion.div>

              {/* Progress Indicator */}
              <div className="mt-6 z-30">
                <div className="flex items-center gap-2">
                  {settings.foregroundImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentImageIndex ? 1 : -1);
                        setCurrentImageIndex(index);
                      }}
                      className={`transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'w-8 h-2 bg-primary-400'
                          : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

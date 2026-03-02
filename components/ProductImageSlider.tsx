'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';

interface ProductImageSliderProps {
  productId: string;
  productName: string;
  frontImage: string;
  images?: string[];
  isInWishlist?: (id: string) => boolean;
  onWishlistToggle?: () => void;
  onShare?: () => void;
  wishlistLoading?: boolean;
}

export default function ProductImageSlider({ 
  productId, 
  productName, 
  frontImage, 
  images: productImages,
  isInWishlist = () => false,
  onWishlistToggle = () => {},
  onShare = () => {},
  wishlistLoading = false
}: ProductImageSliderProps) {
  // Use product images array if provided, otherwise fallback to front image
  const imageArray = productImages && productImages.length > 0 ? productImages : [frontImage];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageArray.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-br from-jet-800 to-black border border-white/20 p-8 relative overflow-hidden flex flex-col lg:sticky lg:top-24 lg:self-start"
    >
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-primary-400/40"></div>

      {/* Image Container - Larger and Better Framed */}
      <div className="relative w-full bg-gradient-to-b from-jet-900 to-jet-800 flex items-center justify-center mb-8 rounded-lg overflow-hidden aspect-square border border-white/10">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="relative w-full h-full flex items-center justify-center p-8"
        >
          <Image
            src={imageArray[currentImageIndex]}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            width={800}
            height={800}
            quality={100}
            className="w-full h-full object-contain drop-shadow-2xl"
            priority
            unoptimized
          />
        </motion.div>

        {/* Navigation Buttons - Larger and More Visible */}
        {imageArray.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-primary-400/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-primary-400/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Indicators - Larger and More Prominent */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
              {imageArray.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'w-3 h-3 bg-primary-400 rounded-full' 
                      : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Image Label - Better Styled */}
      <div className="text-center mb-6 text-sm text-gray-300 uppercase tracking-wider font-medium">
        <span className="text-primary-400">{currentImageIndex + 1}</span> of <span className="text-primary-400">{imageArray.length}</span>
      </div>

      {/* Product Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-white/20 mt-auto">
        <button
          onClick={onWishlistToggle}
          disabled={wishlistLoading}
          className={`flex items-center space-x-2 transition-colors disabled:opacity-50 ${isInWishlist(productId)
            ? 'text-primary-400'
            : 'text-gray-400 hover:text-primary-400'
            }`}
        >
          <Heart
            size={20}
            className={isInWishlist(productId) ? 'fill-current' : ''}
          />
          <span className="text-sm uppercase tracking-wider">
            {wishlistLoading
              ? 'Loading...'
              : isInWishlist(productId)
                ? 'In Wishlist'
                : 'Add to Wishlist'
            }
          </span>
        </button>
        <button
          onClick={onShare}
          className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors"
        >
          <Share2 size={20} />
          <span className="text-sm uppercase tracking-wider">Share</span>
        </button>
      </div>
    </motion.div>
  );
}

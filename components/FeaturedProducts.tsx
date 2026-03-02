'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ShoppingCart, Sparkles, Award, Zap, Heart, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import SectionBlend from './SectionBlend';
import { getProductFireCoins } from '@/lib/fireCoins';

const getIconForBadge = (badge: string) => {
  switch (badge) {
    case 'BESTSELLER':
      return <Award className="w-5 h-5" />;
    case 'POPULAR':
      return <Zap className="w-5 h-5" />;
    case 'NEW':
      return <Sparkles className="w-5 h-5" />;
    default:
      return <Award className="w-5 h-5" />;
  }
};

const ProductCard = ({ product, index }: { product: any; index: number }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);

    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
    });

    // Show feedback animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsWishlistLoading(true);

    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    };

    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(productData);
    }

    setIsWishlistLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true }}
      className="group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        whileHover={{ z: 50 }}
        onClick={() => {
          if (product.status !== 'coming-soon') {
            router.push(`/products/${product.id}`);
          }
        }}
        className={`relative bg-gradient-to-br from-jet-800 to-black border border-white/20 overflow-hidden transform-gpu flex flex-col h-full ${product.status === 'coming-soon' ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
      >
        {/* Sharp corner accent */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-t-[24px] border-t-white/10 group-hover:border-t-white/20 transition-all duration-300"></div>

        {/* Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.15 + 0.5, type: "spring", stiffness: 200 }}
          className="absolute top-4 left-4 z-20"
        >
          <div className="bg-mauve-gradient text-white px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-mauve">
            {product.badge}
          </div>
        </motion.div>

        {/* Discount Badge - Below Badge */}
        {product.status !== 'coming-soon' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.15 + 0.6, type: "spring", stiffness: 200 }}
            className="absolute top-14 left-4 z-20"
          >
            <div className="bg-green-600/20 text-green-400 px-3 py-1 text-xs font-bold uppercase tracking-wide border border-green-600/30">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          </motion.div>
        )}



        {/* Wishlist Heart Icon */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleWishlistToggle(e);
          }}
          disabled={isWishlistLoading}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.15 + 0.7, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-sm border border-white/20 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${isInWishlist(product.id)
              ? 'fill-red-500 text-red-500'
              : 'text-white hover:text-red-500'
              }`}
          />
        </motion.button>

        {/* Discount Badge */}
        {product.status !== 'coming-soon' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.15 + 0.8, type: "spring", stiffness: 200 }}
            className="absolute top-14 left-4 z-20"
          >
            <div className="bg-green-600/20 text-green-400 px-3 py-1 text-xs font-bold uppercase tracking-wide border border-green-600/30">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          </motion.div>
        )}

        {/* Product image section */}
        <div className="relative overflow-hidden bg-jet-900 w-full">
          {/* Product image */}
          <motion.div
            className="relative w-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              quality={100}
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority={index === 0}
              unoptimized
            />
          </motion.div>
        </div>

        {/* Content section */}
        <div className="relative p-6 flex flex-col flex-grow">
          {/* Fire Coins Badge - Above Rating */}
          {product.status !== 'coming-soon' && (
            <motion.div
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.6, type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 shadow-lg whitespace-nowrap w-fit">
                <Flame className="w-4 h-4" />
                <span>Earn {getProductFireCoins(product.id)} Coins</span>
              </div>
            </motion.div>
          )}

          {/* 2 Raisins Validation Badge */}
          {product.twoRaisinsValidated && product.status !== 'coming-soon' && (
            <motion.div
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.7, type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <div className="bg-gradient-to-r from-primary-400/20 to-primary-400/10 text-primary-400 px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 border border-primary-400/40 whitespace-nowrap w-fit">
                <span>🍇🍇</span>
                <span>2 Raisins Validated</span>
              </div>
            </motion.div>
          )}

          {/* Rating and price */}
          {product.status !== 'coming-soon' && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-4 bg-mauve-gradient"></div>
                  ))}
                </div>
                <span className="text-white font-bold text-sm">{product.rating}</span>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm line-through">₹{product.originalPrice}</span>
                  <span className="text-2xl font-bold text-white-to-mauve tracking-tight">
                    ₹{product.price}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Product name */}
          <h3 className="text-xl font-bold text-white normal-case tracking-wider mb-4">{product.name}</h3>

          {/* Description */}
          {product.status !== 'coming-soon' && (
            <p className="text-gray-300 text-sm leading-relaxed font-light mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Features */}
          

          {/* Product Actions */}
          <div className="flex space-x-2 mt-auto">
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (product.status !== 'coming-soon') {
                  handleAddToCart();
                }
              }}
              disabled={isAdding || product.status === 'coming-soon'}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-mauve-gradient hover:bg-mauve-shine text-white py-3 px-4 font-bold flex items-center justify-center space-x-2 transition-all duration-300 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-mauve"
            >
              <motion.div
                animate={{
                  rotate: isHovered ? 360 : 0,
                  scale: isAdding ? [1, 1.2, 1] : 1
                }}
                transition={{
                  rotate: { duration: 0.6 },
                  scale: { duration: 0.3, repeat: isAdding ? 2 : 0 }
                }}
              >
                <ShoppingCart size={16} />
              </motion.div>
              <span>{product.status === 'coming-soon' ? 'Coming Soon' : isAdding ? 'Added!' : 'Add to Cart'}</span>
            </motion.button>
          </div>
        </div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true');
        const data = await response.json();
        // Add icon to each product based on badge
        const productsWithIcons = data.map((product: any) => ({
          ...product,
          icon: getIconForBadge(product.badge)
        }));
        setProducts(productsWithIcons);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      {/* Seamless background continuation */}
      <div className="absolute inset-0">
        <Image
          src='https://res.cloudinary.com/dsejv31js/image/upload/v1767090389/agnishila/bg/vd.jpg'
          alt="Rocky Background"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0
          }}
          quality={90}
        />

        {/* Section blending - same as HeroSection pattern */}
        <SectionBlend position="both" height="xl" intensity="medium" />

        {/* Main section overlay */}
        <div className="absolute inset-0 bg-black/30 z-5"></div>
      </div>

      {/* Content with proper spacing */}
      <div className="relative z-30 py-24">

        {/* Rocky background elements */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Rocky texture overlay */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 2px, transparent 4px),
            radial-gradient(circle at 80% 70%, rgba(101, 67, 33, 0.08) 1px, transparent 3px),
            radial-gradient(circle at 40% 80%, rgba(160, 82, 45, 0.06) 1px, transparent 2px)
          `,
            backgroundSize: '100px 100px, 150px 150px, 80px 80px'
          }}></div>

          {/* Mineral veins */}
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/5 rotate-45" style={{
            background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)'
          }}></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/5 rotate-12" style={{
            background: 'linear-gradient(-45deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.05)'
          }}></div>

          {/* Additional rock formations */}
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-stone-800/20 rotate-45 border border-stone-600/10"></div>
          <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-stone-700/20 rotate-12 border border-stone-500/10"></div>

          {/* Scattered particles */}
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white/10 rounded-full"></div>
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-white/15 rounded-full"></div>
          <div className="absolute bottom-1/2 left-2/3 w-3 h-3 bg-stone-600/20 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >


            <h2 className="text-5xl lg:text-6xl font-bold text-white-to-mauve mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover our premium collection of authentic Himalayan Shilajit products,
              each carefully sourced and lab-tested for purity and potency.
            </p>
          </motion.div>

          {/* Products grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* View all button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-transparent border-mauve-gradient text-white-to-mauve hover:text-black px-10 py-4 font-bold transition-all duration-300 overflow-hidden uppercase tracking-wider"
              >
                <motion.div
                  className="absolute inset-0 bg-mauve-gradient"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center space-x-2 text-white-to-mauve">
                  <span>View All Products</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
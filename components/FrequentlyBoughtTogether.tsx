'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
}

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
  bundleProducts: Product[];
}

export default function FrequentlyBoughtTogether({ mainProduct, bundleProducts }: FrequentlyBoughtTogetherProps) {
  // Filter out coming soon products from bundle
  const availableBundleProducts = bundleProducts.filter((p: any) => p.status !== 'coming-soon');
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>([mainProduct.id, ...availableBundleProducts.map(p => p.id)]);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const toggleProduct = (productId: string) => {
    if (productId === mainProduct.id) return; // Main product always selected
    
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const allProducts = [mainProduct, ...availableBundleProducts];
  const subtotal = allProducts
    .filter(p => selectedProducts.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0);
  
  // Apply 5% extra discount on bundle
  const bundleDiscount = Math.round(subtotal * 0.05);
  const totalPrice = subtotal - bundleDiscount;
  
  const totalOriginalPrice = allProducts
    .filter(p => selectedProducts.includes(p.id))
    .reduce((sum, p) => sum + p.originalPrice, 0);
  const savings = totalOriginalPrice - totalPrice;

  const handleAddToCart = async () => {
    setIsAdding(true);
    const selectedItems = allProducts.filter(p => selectedProducts.includes(p.id));
    
    // Apply 5% discount proportionally to each item
    const discountMultiplier = 0.95; // 5% off = multiply by 0.95
    
    for (const product of selectedItems) {
      const discountedPrice = Math.round(product.price * discountMultiplier);
      
      await addItem({
        id: product.id,
        name: product.name,
        price: discountedPrice,
        image: product.image,
      });
    }
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/checkout');
  };

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider text-center">
            Frequently Bought Together
          </h2>
          <p className="text-primary-400 text-center mb-8">
            Bundle up and get extra 5% off
          </p>

          {/* Products Grid */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {allProducts.map((product, index) => (
              <div key={product.id} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="relative"
                >
                  <div className="p-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                  
                  {product.id !== mainProduct.id && (
                    <button
                      onClick={() => toggleProduct(product.id)}
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        selectedProducts.includes(product.id)
                          ? 'bg-primary-400 text-white'
                          : 'bg-gray-600 text-white hover:bg-gray-500'
                      }`}
                    >
                      {selectedProducts.includes(product.id) ? '✓' : ''}
                    </button>
                  )}

                  <div className="mt-3 text-center">
                    <p className="text-white text-sm font-medium line-clamp-2">{product.name}</p>
                    <p className="text-primary-400 font-bold mt-1">₹{product.price}</p>
                  </div>
                </motion.div>

                {index < allProducts.length - 1 && (
                  <Plus className="w-6 h-6 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="bg-black border border-white/20 p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300">Subtotal:</span>
              <span className="text-white font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
              <span className="text-green-400 text-sm">Bundle Discount (5%):</span>
              <span className="text-green-400 font-bold">-₹{bundleDiscount}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 text-lg">Total Price:</span>
              <div className="text-right">
                <span className="text-gray-500 line-through mr-2 text-sm">₹{totalOriginalPrice}</span>
                <span className="text-3xl font-bold text-primary-400">₹{totalPrice}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm bg-green-600/10 border border-green-600/20 p-3 rounded">
              <span className="text-gray-300">Total Savings:</span>
              <span className="text-green-400 font-bold">₹{savings} ({Math.round((savings / totalOriginalPrice) * 100)}% off)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={isAdding || selectedProducts.length === 0}
              className="bg-mauve-gradient text-white py-4 px-6 font-bold uppercase tracking-wider hover:bg-mauve-shine transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Adding...' : 'Add Selected to Cart'}
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={isAdding || selectedProducts.length === 0}
              className="border-2 border-primary-400 text-primary-400 py-4 px-6 font-bold uppercase tracking-wider hover:bg-primary-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Bundle Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

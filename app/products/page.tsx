'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ShoppingCart, Heart, Search, Filter, X, ChevronDown, Flame } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { getProductFireCoins } from '@/lib/fireCoins';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [addingStates, setAddingStates] = useState<{[key: string]: boolean}>({});
  const [wishlistStates, setWishlistStates] = useState<{[key: string]: boolean}>({});
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const categories = ['All', 'Shilajit', 'Ashwagandha'];
  const types = ['All', 'Resin', 'Gummies'];
  const priceRanges = [
    { label: 'All', value: 'All' },
    { label: 'Under ₹1,000', value: '0-1000' },
    { label: '₹1,000 - ₹2,000', value: '1000-2000' },
    { label: 'Above ₹2,000', value: '2000+' }
  ];
  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Rating: High to Low', value: 'rating-desc' },
    { label: 'Name: A to Z', value: 'name-asc' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product: any) => {
    setAddingStates(prev => ({ ...prev, [product.id]: true }));
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setTimeout(() => {
      setAddingStates(prev => ({ ...prev, [product.id]: false }));
    }, 1000);
  };

  const handleWishlistToggle = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    setWishlistStates(prev => ({ ...prev, [product.id]: true }));
    
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
    
    setWishlistStates(prev => ({ ...prev, [product.id]: false }));
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.features.some((feature: string) => feature.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
      // Type filter
      const matchesType = selectedType === 'All' || product.type === selectedType;
      
      // Price filter
      let matchesPrice = true;
      if (priceRange !== 'All') {
        const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
        if (max) {
          matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max);
        } else {
          matchesPrice = product.price >= parseInt(min);
        }
      }
      
      return matchesSearch && matchesCategory && matchesType && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedType, priceRange, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType('All');
    setPriceRange('All');
    setSortBy('featured');
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
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-transparent relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-24 h-24 border-l-2 border-t-2 border-white/10"></div>
          <div className="absolute bottom-16 right-16 w-24 h-24 border-r-2 border-b-2 border-white/10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-1 bg-mauve-gradient"></div>
              <span className="text-white-to-mauve font-medium text-sm uppercase tracking-[0.2em]">
                Agnishila Collection
              </span>
              <div className="w-12 h-1 bg-mauve-gradient"></div>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-none">
              OUR
              <span className="block text-white-to-mauve" style={{ display: 'inline-block', width: '100%' }}>PRODUCTS</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Discover our curated collection of premium Himalayan wellness products, 
              each crafted to Ignite the fire within you.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, features, or benefits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-jet-900 border border-white/20 text-white pl-12 pr-4 py-4 focus:outline-none focus:border-white/50 transition-colors placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center space-x-2 bg-jet-900 border border-white/20 text-white px-4 py-2 hover:border-white/50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm  tracking-wider">Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Results count */}
                <div className="text-gray-400 text-sm">
                  {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-jet-900 border border-white/20 text-white px-4 py-2 pr-8 focus:outline-none focus:border-white/50 transition-colors text-sm uppercase tracking-wider appearance-none cursor-pointer"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-jet-900">
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-jet-900 border border-white/20 text-white px-3 py-2 focus:outline-none focus:border-white/50 transition-colors text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-jet-900">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-jet-900 border border-white/20 text-white px-3 py-2 focus:outline-none focus:border-white/50 transition-colors text-sm"
                  >
                    {types.map(type => (
                      <option key={type} value={type} className="bg-jet-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full bg-jet-900 border border-white/20 text-white px-3 py-2 focus:outline-none focus:border-white/50 transition-colors text-sm"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value} className="bg-jet-900">
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="w-full bg-red-600/20 border border-red-600/30 text-red-400 px-3 py-2 hover:bg-red-600/30 transition-colors text-sm uppercase tracking-wider"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {(searchQuery || selectedCategory !== 'All' || selectedType !== 'All' || priceRange !== 'All' || sortBy !== 'featured') && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Active filters:</span>
                  {searchQuery && (
                    <span className="bg-white/10 text-white px-3 py-1 text-xs border border-white/20 flex items-center space-x-2">
                      <span>Search: "{searchQuery}"</span>
                      <button onClick={() => setSearchQuery('')} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'All' && (
                    <span className="bg-white/10 text-white px-3 py-1 text-xs border border-white/20 flex items-center space-x-2">
                      <span>Category: {selectedCategory}</span>
                      <button onClick={() => setSelectedCategory('All')} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedType !== 'All' && (
                    <span className="bg-white/10 text-white px-3 py-1 text-xs border border-white/20 flex items-center space-x-2">
                      <span>Type: {selectedType}</span>
                      <button onClick={() => setSelectedType('All')} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {priceRange !== 'All' && (
                    <span className="bg-white/10 text-white px-3 py-1 text-xs border border-white/20 flex items-center space-x-2">
                      <span>Price: {priceRanges.find(r => r.value === priceRange)?.label}</span>
                      <button onClick={() => setPriceRange('All')} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {sortBy !== 'featured' && (
                    <span className="bg-white/10 text-white px-3 py-1 text-xs border border-white/20 flex items-center space-x-2">
                      <span>Sort: {sortOptions.find(s => s.value === sortBy)?.label}</span>
                      <button onClick={() => setSortBy('featured')} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gray-600/20 mx-auto mb-8 flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
                No Products Found
              </h3>
              <p className="text-gray-400 text-lg mb-8">
                Try adjusting your search or filters to find what you're looking for
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-mauve-gradient text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-mauve-shine transition-colors shadow-mauve"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 60, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                className="group perspective-1000"
              >
                <motion.div
                  onClick={() => {
                    if (product.status !== 'coming-soon') {
                      window.location.href = `/products/${product.id}`;
                    }
                  }}
                  className={`relative bg-gradient-to-br from-jet-800 to-black border border-white/20 overflow-hidden transform-gpu flex flex-col h-full ${product.status === 'coming-soon' ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                  whileHover={{ y: product.status === 'coming-soon' ? 0 : -2 }}
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
                      handleWishlistToggle(e, product);
                    }}
                    disabled={wishlistStates[product.id]}
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
                      transition={{ delay: index * 0.15 + 0.7, type: "spring", stiffness: 200 }}
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
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-contain drop-shadow-2xl"
                        loading={index === 0 ? "eager" : "lazy"}
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

                    {/* Product Actions */}
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (product.status !== 'coming-soon') {
                          handleAddToCart(product);
                        }
                      }}
                      disabled={addingStates[product.id] || product.status === 'coming-soon'}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-mauve-gradient hover:bg-mauve-shine text-white py-3 px-4 font-bold flex items-center justify-center space-x-2 transition-all duration-300 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-mauve mt-auto"
                    >
                      <motion.div
                        animate={{
                          rotate: addingStates[product.id] ? [0, 360] : 0,
                          scale: addingStates[product.id] ? [1, 1.2, 1] : 1
                        }}
                        transition={{
                          rotate: { duration: 0.6 },
                          scale: { duration: 0.3, repeat: addingStates[product.id] ? 2 : 0 }
                        }}
                      >
                        <ShoppingCart size={16} />
                      </motion.div>
                      <span>{product.status === 'coming-soon' ? 'Coming Soon' : addingStates[product.id] ? 'Added!' : 'Add to Cart'}</span>
                    </motion.button>
                  </div>

                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"
                    animate={{
                      opacity: 0,
                    }}
                    whileHover={{
                      opacity: 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

       

        <Footer />
      </div>
    </main>
  );
}
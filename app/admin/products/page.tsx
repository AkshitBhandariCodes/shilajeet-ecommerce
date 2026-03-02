'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Search,
  Filter,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  featured: boolean;
  image?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-white font-bold uppercase tracking-wider text-sm">Loading Products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-1">Products</h1>
          <p className="text-gray-400 text-sm">Manage your Shilajit products</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-black font-bold uppercase tracking-wider text-xs transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary-400/30 flex items-center gap-2 active:scale-95 rounded w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-primary-400" />
            <span className="text-2xl font-bold text-white">{products.length}</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Total Products</div>
        </div>

        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-orange-400" />
            <span className="text-2xl font-bold text-white">{products.filter(p => p.featured).length}</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Featured</div>
        </div>

        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{products.filter(p => p.inStock).length}</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">In Stock</div>
        </div>

        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-400" />
            <span className="text-2xl font-bold text-white">{products.filter(p => !p.inStock).length}</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Out of Stock</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/20 text-white pl-10 pr-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all text-sm placeholder:text-gray-500 rounded"
            />
          </div>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-all border border-white/20 flex items-center gap-2 rounded">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg overflow-hidden group hover:border-primary-400/50 transition-all"
          >
            <div className="aspect-square bg-black/50 flex items-center justify-center relative overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-16 h-16 text-gray-600" />
              )}
              {product.featured && (
                <div className="absolute top-2 right-2 bg-orange-400 text-black px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{product.category}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-primary-400 font-bold text-xl">₹{product.price}</span>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  product.inStock 
                    ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                    : 'bg-red-400/20 text-red-400 border border-red-400/30'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/products/${product._id}/edit`}
                  className="flex-1 px-3 py-2 bg-primary-400/20 hover:bg-primary-400/30 text-primary-400 font-bold text-xs uppercase tracking-wider transition-all rounded flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Link>
                <button 
                  onClick={() => handleDeleteProduct(product._id)}
                  disabled={deleting === product._id}
                  className="px-3 py-2 bg-red-400/20 hover:bg-red-400/30 text-red-400 font-bold text-xs uppercase tracking-wider transition-all rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 rounded-lg">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">No Products Found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search' : 'Start by adding your first product'}
          </p>
          <Link 
            href="/admin/products/new"
            className="inline-block px-6 py-2 bg-primary-400 hover:bg-primary-500 text-black font-bold uppercase tracking-wider text-sm transition-all rounded"
          >
            Add Product
          </Link>
        </div>
      )}
    </div>
  );
}

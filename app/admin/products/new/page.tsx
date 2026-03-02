'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: 'Shilajit',
    type: 'Resin',
    badge: 'NEW',
    badgeColor: 'from-red-500 to-pink-500',
    features: [] as string[],
    detailedDescription: '',
    ingredients: [] as string[],
    benefits: [] as string[],
    usage: '',
    certifications: [] as string[],
    inStock: true,
    status: 'available',
    featured: false,
  });

  const [featureInput, setFeatureInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }));
      setIngredientInput('');
    }
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    if (certificationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()],
      }));
      setCertificationInput('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">Add New Product</h1>
          <p className="text-gray-400 text-sm">Create a new product for your store</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-400/20 border border-red-400/30 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
                placeholder="e.g., TruBlk Shilajit Gold Resin"
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
              >
                <option value="Shilajit">Shilajit</option>
                <option value="Ashwagandha">Ashwagandha</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded resize-none"
              placeholder="Short product description"
            />
          </div>

          <div>
            <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Detailed Description *</label>
            <textarea
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded resize-none"
              placeholder="Detailed product description"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Pricing</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
                placeholder="1320"
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Original Price (₹) *</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
                placeholder="1649"
              />
            </div>
          </div>
        </div>

        {/* Images & Media */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Images & Media</h2>

          <div>
            <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Product Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              required
              className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Product Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
              >
                <option value="Resin">Resin</option>
                <option value="Gummies">Gummies</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Badge</label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
              >
                <option value="NEW">NEW</option>
                <option value="BESTSELLER">BESTSELLER</option>
                <option value="POPULAR">POPULAR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Usage Instructions *</label>
            <textarea
              name="usage"
              value={formData.usage}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded resize-none"
              placeholder="How to use this product"
            />
          </div>
        </div>

        {/* Features */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Features</h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
              placeholder="Add a feature"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-primary-400/20 hover:bg-primary-400/30 text-primary-400 font-bold text-xs uppercase tracking-wider transition-all rounded"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="bg-primary-400/20 border border-primary-400/30 text-primary-400 px-3 py-1 rounded text-sm flex items-center gap-2">
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="hover:text-primary-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Ingredients</h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
              className="flex-1 bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
              placeholder="Add an ingredient"
            />
            <button
              type="button"
              onClick={addIngredient}
              className="px-4 py-2 bg-primary-400/20 hover:bg-primary-400/30 text-primary-400 font-bold text-xs uppercase tracking-wider transition-all rounded"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="bg-primary-400/20 border border-primary-400/30 text-primary-400 px-3 py-1 rounded text-sm flex items-center gap-2">
                {ingredient}
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="hover:text-primary-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Benefits</h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              className="flex-1 bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
              placeholder="Add a benefit"
            />
            <button
              type="button"
              onClick={addBenefit}
              className="px-4 py-2 bg-primary-400/20 hover:bg-primary-400/30 text-primary-400 font-bold text-xs uppercase tracking-wider transition-all rounded"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="bg-primary-400/20 border border-primary-400/30 text-primary-400 px-3 py-1 rounded text-sm flex items-center gap-2">
                {benefit}
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="hover:text-primary-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Certifications</h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={certificationInput}
              onChange={(e) => setCertificationInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
              className="flex-1 bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
              placeholder="Add a certification"
            />
            <button
              type="button"
              onClick={addCertification}
              className="px-4 py-2 bg-primary-400/20 hover:bg-primary-400/30 text-primary-400 font-bold text-xs uppercase tracking-wider transition-all rounded"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.certifications.map((cert, index) => (
              <div key={index} className="bg-primary-400/20 border border-primary-400/30 text-primary-400 px-3 py-1 rounded text-sm flex items-center gap-2">
                {cert}
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="hover:text-primary-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Visibility */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Status & Visibility</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/20 transition-all rounded"
              >
                <option value="available">Available</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
            </div>

            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-white font-bold text-sm uppercase tracking-wider">In Stock</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-white font-bold text-sm uppercase tracking-wider">Featured</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-black font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Product'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-sm transition-all border border-white/20 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

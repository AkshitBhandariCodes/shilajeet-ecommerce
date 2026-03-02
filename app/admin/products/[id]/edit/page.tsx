'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X, Upload, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  images?: string[];
  category: string;
  type: string;
  badge: string;
  badgeColor: string;
  features: string[];
  detailedDescription: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  certifications: string[];
  inStock: boolean;
  status: string;
  featured: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product | null>(null);

  const [featureInput, setFeatureInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setImagePreview(data.image);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!product) return;
    const { name, value, type } = e.target;
    setProduct(prev => prev ? {
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    } : null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && product) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setProduct(prev => prev ? {
          ...prev,
          image: imageUrl,
        } : null);
        setImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (product) {
      setProduct(prev => prev ? {
        ...prev,
        image: '',
      } : null);
      setImagePreview('');
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && product) {
      setProduct(prev => prev ? {
        ...prev,
        features: [...prev.features, featureInput.trim()],
      } : null);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    if (product) {
      setProduct(prev => prev ? {
        ...prev,
        features: prev.features.filter((_, i) => i !== index),
      } : null);
    }
  };

  const addIngredient = () => {
    if (ingredientInput.trim() && product) {
      setProduct(prev => prev ? {
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      } : null);
      setIngredientInput('');
    }
  };

  const removeIngredient = (index: number) => {
    if (product) {
      setProduct(prev => prev ? {
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      } : null);
    }
  };

  const addBenefit = () => {
    if (benefitInput.trim() && product) {
      setProduct(prev => prev ? {
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      } : null);
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    if (product) {
      setProduct(prev => prev ? {
        ...prev,
        benefits: prev.benefits.filter((_, i) => i !== index),
      } : null);
    }
  };

  const addCertification = () => {
    if (certificationInput.trim() && product) {
      setProduct(prev => prev ? {
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()],
      } : null);
      setCertificationInput('');
    }
  };

  const removeCertification = (index: number) => {
    if (product) {
      setProduct(prev => prev ? {
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== index),
      } : null);
    }
  };

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        setError('Failed to save product');
      }
    } catch (err) {
      setError('Error saving product');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-400/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-white font-bold uppercase tracking-wider text-sm">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => router.back()}
            className="text-primary-400 hover:text-primary-300 font-bold"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Edit Product</h1>
          <p className="text-gray-400">Update product information</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 p-4 rounded text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Basic Info */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Basic Information</h2>

          {/* Product Name */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="Product name"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Short Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="Brief product description"
              rows={3}
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Detailed Description</label>
            <textarea
              name="detailedDescription"
              value={product.detailedDescription}
              onChange={handleInputChange}
              className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="Detailed product description"
              rows={5}
            />
          </div>
        </div>

        {/* Product Image */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Product Image</h2>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden border border-white/10">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 rounded-lg text-white transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}

          {/* Upload Button */}
          <label className="flex items-center justify-center gap-2 px-4 py-3 bg-jet-800 hover:bg-jet-700 border border-jet-700 rounded-lg cursor-pointer text-gray-300 hover:text-white transition-colors">
            <Upload size={20} />
            <span className="font-semibold">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {/* URL Input Alternative */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Or Paste Image URL</label>
            <input
              type="url"
              value={product.image}
              onChange={(e) => {
                if (product) {
                  setProduct({ ...product, image: e.target.value });
                  setImagePreview(e.target.value);
                }
              }}
              className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Sub Images / Gallery */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Product Gallery (Sub Images)</h2>
            <button
              onClick={() => {
                if (product) {
                  setProduct({
                    ...product,
                    images: [...(product.images || []), ''],
                  });
                }
              }}
              className="flex items-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              <Plus size={16} />
              Add Image
            </button>
          </div>

          {product.images && product.images.length > 0 ? (
            <div className="space-y-4">
              {product.images.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/50 border border-white/10 p-4 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Image {index + 1}</h3>
                    <button
                      onClick={() => {
                        if (product) {
                          setProduct({
                            ...product,
                            images: product.images?.filter((_, i) => i !== index),
                          });
                        }
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Image Preview */}
                  {img && (
                    <div className="relative w-full h-40 bg-black rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={img}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Upload or URL */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-jet-800 hover:bg-jet-700 border border-jet-700 rounded-lg cursor-pointer text-gray-300 hover:text-white transition-colors text-sm">
                      <Upload size={16} />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && product) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const newImages = [...(product.images || [])];
                              newImages[index] = event.target?.result as string;
                              setProduct({ ...product, images: newImages });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={img}
                      onChange={(e) => {
                        if (product) {
                          const newImages = [...(product.images || [])];
                          newImages[index] = e.target.value;
                          setProduct({ ...product, images: newImages });
                        }
                      }}
                      className="w-full bg-black border border-white/20 text-white px-4 py-2 rounded focus:border-primary-400 outline-none transition-colors text-sm"
                      placeholder="Or paste image URL"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="mb-4">No sub-images added yet</p>
              <button
                onClick={() => {
                  if (product) {
                    setProduct({
                      ...product,
                      images: [''],
                    });
                  }
                }}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
              >
                Add First Image
              </button>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Pricing</h2>

          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Price</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
                placeholder="Price"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Original Price</label>
              <input
                type="number"
                name="originalPrice"
                value={product.originalPrice}
                onChange={handleInputChange}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
                placeholder="Original price"
              />
            </div>
          </div>
        </div>

        {/* Category & Type */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Category & Type</h2>

          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Category</label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
              >
                <option value="Shilajit">Shilajit</option>
                <option value="Ashwagandha">Ashwagandha</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Type</label>
              <select
                name="type"
                value={product.type}
                onChange={handleInputChange}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
              >
                <option value="Resin">Resin</option>
                <option value="Gummies">Gummies</option>
                <option value="Capsules">Capsules</option>
                <option value="Powder">Powder</option>
              </select>
            </div>
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
              onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              className="flex-1 bg-black border border-white/20 text-white px-4 py-2 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="Add feature"
            />
            <button
              onClick={addFeature}
              className="px-4 py-2 bg-primary-400 text-black rounded font-bold hover:bg-primary-500 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between bg-black/50 p-3 rounded border border-white/10">
                <span className="text-white">{feature}</span>
                <button
                  onClick={() => removeFeature(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
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
              onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              className="flex-1 bg-black border border-white/20 text-white px-4 py-2 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="Add ingredient"
            />
            <button
              onClick={addIngredient}
              className="px-4 py-2 bg-primary-400 text-black rounded font-bold hover:bg-primary-500 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {product.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between bg-black/50 p-3 rounded border border-white/10">
                <span className="text-white">{ingredient}</span>
                <button
                  onClick={() => removeIngredient(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
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
              onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
              className="flex-1 bg-black border border-white/20 text-white px-4 py-2 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="Add benefit"
            />
            <button
              onClick={addBenefit}
              className="px-4 py-2 bg-primary-400 text-black rounded font-bold hover:bg-primary-500 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {product.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-between bg-black/50 p-3 rounded border border-white/10">
                <span className="text-white">{benefit}</span>
                <button
                  onClick={() => removeBenefit(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Usage */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Usage Instructions</h2>

          <textarea
            name="usage"
            value={product.usage}
            onChange={handleInputChange}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded focus:border-primary-400 outline-none transition-colors"
            placeholder="Usage instructions"
            rows={5}
          />
        </div>

        {/* Certifications */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Certifications</h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={certificationInput}
              onChange={(e) => setCertificationInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCertification()}
              className="flex-1 bg-black border border-white/20 text-white px-4 py-2 rounded focus:border-primary-400 outline-none transition-colors"
              placeholder="Add certification"
            />
            <button
              onClick={addCertification}
              className="px-4 py-2 bg-primary-400 text-black rounded font-bold hover:bg-primary-500 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {product.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between bg-black/50 p-3 rounded border border-white/10">
                <span className="text-white">{cert}</span>
                <button
                  onClick={() => removeCertification(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-gradient-to-br from-jet-900 to-jet-800 border border-white/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Status</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={product.inStock}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span className="text-white font-bold">In Stock</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={product.featured}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span className="text-white font-bold">Featured Product</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary-400 text-black font-bold py-3 px-6 rounded uppercase tracking-wider hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.div>
    </div>
  );
}

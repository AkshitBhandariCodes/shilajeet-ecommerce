import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  badge: {
    type: String,
    required: false,
  },
  badgeColor: {
    type: String,
    required: false,
  },
  features: [{
    type: String,
  }],
  detailedDescription: {
    type: String,
    required: true,
  },
  ingredients: [{
    type: String,
  }],
  benefits: [{
    type: String,
  }],
  usage: {
    type: String,
    required: true,
  },
  certifications: [{
    type: String,
  }],
  batchNumber: {
    type: String,
    required: false,
  },
  certificatePdfUrl: {
    type: String,
    required: false,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['available', 'coming-soon'],
    default: 'available',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  twoRaisinsValidated: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
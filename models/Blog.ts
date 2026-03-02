import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      url: String,
      publicId: String,
    },
    category: {
      type: String,
      enum: ['Health', 'Wellness', 'Fitness', 'Nutrition', 'Lifestyle', 'Science'],
      default: 'Wellness',
    },
    author: {
      type: String,
      default: 'Agnishila Team',
    },
    readTime: {
      type: Number,
      default: 5,
    },
    views: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    metaDescription: String,
    metaKeywords: String,
  },
  { timestamps: true }
);

// Auto-generate slug from title
BlogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

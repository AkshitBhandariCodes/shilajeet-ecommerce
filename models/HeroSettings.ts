import mongoose from 'mongoose';

const heroSettingsSchema = new mongoose.Schema(
  {
    backgroundImage: {
      url: String,
      publicId: String,
    },
    foregroundImages: [
      {
        url: String,
        publicId: String,
        title: String,
        subtitle: String,
        order: Number,
      }
    ],
    autoPlayInterval: {
      type: Number,
      default: 3500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HeroSettings || mongoose.model('HeroSettings', heroSettingsSchema);

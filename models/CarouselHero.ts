import mongoose from 'mongoose';

const carouselHeroSchema = new mongoose.Schema(
  {
    slides: [
      {
        url: String,
        publicId: String,
        title: String,
        subtitle: String,
        ctaText: String,
        ctaLink: String,
        imageLink: String,
        order: Number,
      }
    ],
    autoPlayInterval: {
      type: Number,
      default: 4000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    carouselHeight: {
      type: Number,
      default: 500,
      description: 'Height in pixels'
    },
  },
  { timestamps: true }
);

export default mongoose.models.CarouselHero || mongoose.model('CarouselHero', carouselHeroSchema);

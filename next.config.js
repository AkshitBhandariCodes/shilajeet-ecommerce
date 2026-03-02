/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    unoptimized: false,
  },
  // Memory optimization for build
  swcMinify: true,
  productionBrowserSourceMaps: false,
  compress: true,
  // Reduce build memory usage
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Disable static generation for heavy pages
  staticPageGenerationTimeout: 120,
}

module.exports = nextConfig
#!/bin/bash

# Render build script with memory optimization
echo "🔨 Starting optimized build for Render..."

# Set Node memory limit to prevent OOM
export NODE_OPTIONS="--max-old-space-size=2048"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies with optimizations
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Build with optimizations
echo "🏗️ Building application..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build completed successfully!"
else
  echo "❌ Build failed!"
  exit 1
fi

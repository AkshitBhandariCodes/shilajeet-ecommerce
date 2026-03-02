# Hero Section Admin Management Guide

## Overview
The hero section images are now fully editable through the admin panel. Admins can upload, delete, and manage both background and foreground images without touching code.

## Features

### 1. Background Image Management
- Upload custom background image for the hero section
- Replace the default Himalayan mountain background
- Preview before saving

### 2. Foreground Images (Product Carousel)
- Add multiple product images
- Edit product title and subtitle for each image
- Delete images from the carousel
- Reorder images (drag and drop ready)
- Auto-preview of each image

### 3. Settings
- **Auto Play Interval**: Control how long each image displays (default: 3500ms)
- **Active Toggle**: Enable/disable the hero section

## How to Access

1. Go to Admin Panel: `https://agnishila.in/admin`
2. Click on **"Hero Section"** in the sidebar (under Analytics)
3. You'll see the Hero Settings page

## How to Use

### Upload Background Image
1. Scroll to "Background Image" section
2. Click "Upload Background Image"
3. Select your image file
4. Preview appears automatically
5. Click "Save Changes" at the bottom

### Manage Foreground Images (Product Carousel)

#### Add New Image
1. Click "Add Image" button in the Foreground Images section
2. Click "Upload Image" to select a product photo
3. Enter product title (e.g., "Shilajit ShilaBoost Gummies")
4. Enter product subtitle (optional)
5. Click "Save Changes"

#### Edit Image
1. Click "Upload Image" to replace the current image
2. Edit the title or subtitle fields
3. Click "Save Changes"

#### Delete Image
1. Click the trash icon on the image card
2. Click "Save Changes" to confirm

### Adjust Settings
1. **Auto Play Interval**: Change the milliseconds between image transitions
   - Default: 3500ms (3.5 seconds)
   - Minimum: 1000ms (1 second)
   - Adjust in 500ms increments
2. **Active Toggle**: Check/uncheck to enable/disable the hero section
3. Click "Save Changes"

## Technical Details

### Database Model
- **Collection**: `herosettings`
- **Fields**:
  - `backgroundImage`: URL and public ID of background
  - `foregroundImages`: Array of product images with title/subtitle
  - `autoPlayInterval`: Milliseconds between transitions
  - `isActive`: Boolean to enable/disable

### API Endpoints
- **GET** `/api/admin/hero-settings` - Fetch current settings
- **PUT** `/api/admin/hero-settings` - Update settings

### Frontend Component
- **Component**: `components/HeroSection.tsx`
- Fetches settings on mount
- Falls back to defaults if API fails
- Responsive on mobile and desktop

## Default Settings

If no settings exist, the system uses these defaults:
- Background: Himalayan mountain image
- Products: 3 default products (Gummies, AshwaGlow, TruBlk Resin)
- Auto Play: 3500ms
- Active: true

## Tips

1. **Image Optimization**: Use compressed images for faster loading
2. **Aspect Ratio**: Keep product images with transparent backgrounds for best results
3. **Titles**: Keep product titles short and descriptive
4. **Testing**: After saving, refresh the homepage to see changes
5. **Backup**: Keep copies of your images before uploading new ones

## Troubleshooting

### Changes not appearing on homepage
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page (F5)
- Check if "Active" toggle is enabled

### Image upload fails
- Check file size (keep under 5MB)
- Ensure file is a valid image format (JPG, PNG, WebP)
- Check internet connection

### Auto play not working
- Verify `autoPlayInterval` is set to a valid number (1000+)
- Check if "Active" toggle is enabled
- Ensure at least 2 images are uploaded

## Admin Credentials
- Email: `admin@agnishila.com`
- Password: `admin123`

## Support
For issues or questions, contact the development team.

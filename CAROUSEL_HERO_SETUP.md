# Carousel Hero Section Setup Guide

## Overview
A rotating carousel hero section has been added to the landing page, positioned **above** the existing hero section. It's fully managed through the admin panel.

## What Was Created

### 1. **Database Model** (`models/CarouselHero.ts`)
- Stores carousel slides with images, titles, subtitles, and CTA buttons
- Configurable auto-play interval
- Enable/disable toggle

### 2. **API Route** (`app/api/admin/carousel-hero/route.ts`)
- `GET` - Fetches carousel settings (creates defaults if none exist)
- `PUT` - Updates carousel settings (admin only)
- Admin authentication required

### 3. **Admin Page** (`app/admin/carousel-hero/page.tsx`)
- Add/edit/delete slides
- Reorder slides (move up/down)
- Upload slide images
- Edit slide titles, subtitles, CTA text, and links
- Live preview of current slide
- Configure auto-play interval
- Enable/disable carousel

### 4. **Frontend Component** (`components/CarouselHeroSection.tsx`)
- Smooth slide transitions with Framer Motion
- Auto-play functionality
- Manual navigation (prev/next buttons)
- Dot indicators for slide selection
- Responsive design
- Fetches settings from API

### 5. **Landing Page Integration** (`app/page.tsx`)
- Carousel hero appears above the existing hero section
- Automatically fetches and displays slides

### 6. **Admin Sidebar** (`components/admin/AdminSidebar.tsx`)
- Added "Carousel Hero" menu item for easy access

## How to Use

### For Admins:
1. Go to `/admin/carousel-hero`
2. Click "Add Slide" to create new slides
3. Upload an image for each slide
4. Add title, subtitle, button text, and link
5. Reorder slides using up/down arrows
6. Adjust auto-play interval (in milliseconds)
7. Toggle carousel on/off
8. Click "Save Changes"

### For Users:
- Carousel automatically rotates through slides
- Click arrows to manually navigate
- Click dots to jump to specific slide
- Click CTA button to navigate to specified link

## Features

✅ **Admin Management** - Full CRUD operations for slides
✅ **Image Upload** - Support for any image format
✅ **Auto-Play** - Configurable rotation interval
✅ **Manual Navigation** - Prev/next buttons and dot indicators
✅ **Smooth Animations** - Framer Motion transitions
✅ **Responsive** - Works on all screen sizes
✅ **Preview** - Live preview in admin panel
✅ **Reordering** - Drag slides up/down
✅ **Enable/Disable** - Toggle carousel visibility

## Default Slides

Two default slides are created on first load:
1. Premium Shilajit
2. Ashwagandha Gummies

You can edit or delete these and add your own.

## Customization

### Change Auto-Play Interval
- Default: 4000ms (4 seconds)
- Edit in admin panel or database

### Change Slide Styling
- Edit `components/CarouselHeroSection.tsx`
- Modify Tailwind classes for colors, sizes, etc.

### Change Animation Speed
- Edit `transition={{ duration: 0.8 }}` in CarouselHeroSection.tsx
- Adjust to your preference

## API Endpoints

### Get Carousel Settings
```
GET /api/admin/carousel-hero
```

### Update Carousel Settings
```
PUT /api/admin/carousel-hero
Authorization: Required (admin)
Body: {
  slides: [...],
  autoPlayInterval: 4000,
  isActive: true
}
```

## Database Schema

```typescript
{
  slides: [
    {
      url: string,           // Image URL
      publicId: string,      // File reference
      title: string,         // Slide title
      subtitle: string,      // Slide subtitle
      ctaText: string,       // Button text
      ctaLink: string,       // Button link
      order: number          // Display order
    }
  ],
  autoPlayInterval: number,  // Rotation speed in ms
  isActive: boolean,         // Enable/disable carousel
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Carousel not showing?
- Check if `isActive` is set to `true` in admin panel
- Verify slides have images uploaded
- Check browser console for errors

### Images not loading?
- Ensure image URLs are valid
- Check Cloudinary access if using Cloudinary URLs
- Try uploading a new image

### Auto-play not working?
- Check `autoPlayInterval` value (should be > 0)
- Verify `isActive` is true
- Check if manual navigation was triggered (disables auto-play temporarily)

## File Locations

- Model: `models/CarouselHero.ts`
- API: `app/api/admin/carousel-hero/route.ts`
- Admin Page: `app/admin/carousel-hero/page.tsx`
- Component: `components/CarouselHeroSection.tsx`
- Landing Page: `app/page.tsx`
- Sidebar: `components/admin/AdminSidebar.tsx`

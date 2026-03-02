# Carousel Hero - Visibility Fix

## What Was Fixed

The carousel hero section wasn't visible because:
1. The carousel data might not have been created in the database
2. `isActive` flag might have been false
3. No slides were configured

## Changes Made

### 1. Updated API Route (`app/api/admin/carousel-hero/route.ts`)
- Now ensures carousel data always exists
- Creates default slides if none exist
- Forces `isActive: true` if it's false
- Adds console logging for debugging

### 2. Enhanced Carousel Component (`components/CarouselHeroSection.tsx`)
- Added detailed console logging
- Better error messages for debugging
- Checks each condition separately with warnings

### 3. Default Slides
If no carousel exists, it creates two default slides:
- Premium Shilajit
- Ashwagandha Gummies

## How to Test

1. **Open Browser Console**
   - Press F12 or right-click → Inspect
   - Go to Console tab

2. **Refresh Landing Page**
   - Go to `http://localhost:3000`
   - Check console for messages like:
     ```
     Carousel settings loaded: {
       isActive: true,
       slidesCount: 2,
       autoPlayInterval: 4000
     }
     ```

3. **Verify Carousel Appears**
   - You should see the rotating carousel above the hero section
   - Images should auto-rotate every 4 seconds
   - Navigation arrows and dots should be visible

## Debugging

If carousel still doesn't appear, check console for these messages:

**"Carousel: No settings available"**
- API didn't return data
- Check MongoDB connection
- Check server logs

**"Carousel: Not active"**
- Go to admin panel: `http://localhost:3000/admin/carousel-hero`
- Check "Enable Carousel" checkbox
- Click "Save Changes"

**"Carousel: No slides available"**
- Go to admin panel
- Add at least one slide
- Upload an image
- Click "Save Changes"

**"Failed to fetch carousel settings: [error]"**
- Check network tab in browser DevTools
- Verify API endpoint is working
- Check server logs

## Admin Panel

To manage carousel:
1. Go to `http://localhost:3000/admin/carousel-hero`
2. Add/edit/delete slides
3. Upload images (now uses Cloudinary)
4. Configure auto-play interval
5. Enable/disable carousel
6. Click "Save Changes"

## Expected Behavior

✅ Carousel appears above hero section
✅ Images rotate automatically every 4 seconds
✅ Manual navigation with arrow buttons
✅ Dot indicators show current slide
✅ Clicking image navigates to configured link
✅ Responsive on mobile devices

## If Still Not Working

1. **Clear Browser Cache**
   - Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Clear all cache
   - Refresh page

2. **Restart Dev Server**
   - Stop: Ctrl+C
   - Run: `npm run dev`
   - Wait for compilation

3. **Check Database**
   - Verify MongoDB is running
   - Check connection string in .env
   - Verify database has CarouselHero collection

4. **Check Logs**
   - Look at server console output
   - Look at browser console (F12)
   - Check for any error messages

# Carousel Hero - Cloudinary Upload Fix

## What Was Fixed

The 400 error was caused by using an invalid Cloudinary upload preset. I've switched to a secure backend API approach.

## Changes Made

### 1. Created Backend Upload API
- **File**: `app/api/admin/upload/route.ts`
- Handles Cloudinary uploads securely on the server
- Uses Cloudinary SDK with API credentials
- Requires admin authentication

### 2. Updated Carousel Admin Page
- **File**: `app/admin/carousel-hero/page.tsx`
- Changed from direct Cloudinary API to backend API
- Now calls `/api/admin/upload` instead of Cloudinary directly

### 3. Added Cloudinary Credentials to .env
- **File**: `.env`
- Added three new variables:
  ```
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dsejv31js
  CLOUDINARY_API_KEY=your_cloudinary_api_key
  CLOUDINARY_API_SECRET=your_cloudinary_api_secret
  ```

### 4. Installed Cloudinary Package
- Installed `cloudinary` npm package for server-side uploads

## Next Steps - YOU NEED TO DO THIS

1. **Get Cloudinary API Credentials**
   - Go to: https://cloudinary.com/console/dashboard
   - Click Settings → API Keys
   - Copy your API Key and API Secret

2. **Update .env File**
   - Open `.env` in your editor
   - Find these lines:
     ```
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```
   - Replace with your actual credentials from Cloudinary

3. **Restart Dev Server**
   - Stop current server (Ctrl+C)
   - Run: `npm run dev`

4. **Test Upload**
   - Go to: `http://localhost:3000/admin/carousel-hero`
   - Click "Upload Image"
   - Select an image file
   - Should see "Image uploaded successfully!"

## How It Works Now

1. User selects image in admin panel
2. Image sent to `/api/admin/upload` (backend)
3. Backend authenticates user (must be admin)
4. Backend uploads to Cloudinary using API credentials
5. Cloudinary returns secure URL
6. URL stored in database
7. Image displayed in carousel

## Security Benefits

✅ API credentials never exposed to client
✅ Only admins can upload images
✅ Secure server-side authentication
✅ Images stored on Cloudinary CDN
✅ No base64 strings in database

## Troubleshooting

**Still getting errors?**
1. Check that API Key and Secret are correct
2. Verify no extra spaces in .env
3. Restart dev server after updating .env
4. Check browser console for error messages
5. Check server logs for detailed errors

**Image not uploading?**
1. Make sure you're logged in as admin
2. Check file size (should be reasonable)
3. Check Cloudinary account has available storage
4. Verify API credentials are correct

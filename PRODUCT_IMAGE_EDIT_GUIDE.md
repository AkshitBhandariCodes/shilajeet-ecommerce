# Product Image Edit Guide

## Overview
The product edit page now has full image management capabilities - upload, preview, delete, and edit images directly from the admin panel.

## Features Added

✅ **Image Upload** - Upload images directly from your computer
✅ **Image Preview** - See the image before saving
✅ **Image Delete** - Remove the current image with one click
✅ **URL Input** - Paste image URLs directly (Cloudinary or external)
✅ **Base64 Storage** - Images are converted to base64 and stored in database

## How to Use

### Upload an Image
1. Go to `/admin/products/[id]/edit`
2. Scroll to "Product Image" section
3. Click "Upload Image" button
4. Select an image file from your computer
5. Image preview will appear
6. Click "Save Changes" to save

### Delete an Image
1. Hover over the image preview
2. Click the trash icon in the top-right corner
3. Click "Save Changes" to confirm

### Use Image URL
1. Scroll to "Or Paste Image URL" section
2. Paste a Cloudinary or external image URL
3. Click "Save Changes"

### Edit Image
1. Delete the current image
2. Upload a new one or paste a URL
3. Click "Save Changes"

## Image Format Support

Supported formats:
- JPG / JPEG
- PNG
- GIF
- WebP
- SVG
- BMP

## File Size Recommendations

- **Recommended**: Under 5MB
- **Maximum**: No hard limit (but larger files = slower uploads)
- **Optimal**: 1-2MB for web use

## Image Storage

- Images are converted to **base64** format
- Stored directly in MongoDB database
- No external upload service required
- Works with Cloudinary URLs or local uploads

## Technical Details

### Image Upload Handler
```typescript
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && product) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setProduct(prev => prev ? {
        ...prev,
        image: imageUrl,
      } : null);
      setImagePreview(imageUrl);
    };
    reader.readAsDataURL(file);
  }
};
```

### Image Delete Handler
```typescript
const handleRemoveImage = () => {
  if (product) {
    setProduct(prev => prev ? {
      ...prev,
      image: '',
    } : null);
    setImagePreview('');
  }
};
```

## API Endpoint

**Update Product with Image:**
```
PUT /api/products/[id]
Content-Type: application/json

{
  "name": "Product Name",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  ...other fields
}
```

## Troubleshooting

### Image not showing after upload?
- Check browser console for errors
- Verify file format is supported
- Try a different image file
- Clear browser cache and reload

### Image too large?
- Compress the image before uploading
- Use online image compressor tools
- Recommended size: 1-2MB

### Can't delete image?
- Refresh the page
- Try uploading a new image instead
- Check if image field is required in database

### URL not working?
- Verify the URL is complete (starts with http:// or https://)
- Check if the image is publicly accessible
- Try uploading the image instead

## Best Practices

1. **Use Cloudinary URLs** - Better performance and CDN delivery
2. **Optimize Images** - Compress before uploading
3. **Consistent Sizing** - Use similar dimensions for all product images
4. **High Quality** - Use high-resolution images for better appearance
5. **Backup URLs** - Keep Cloudinary URLs as backup

## File Locations

- Edit Page: `app/admin/products/[id]/edit/page.tsx`
- API Route: `app/api/products/[id]/route.ts`
- Product Model: `models/Product.ts`

## Related Features

- **Product Creation**: `app/admin/products/new/page.tsx`
- **Product List**: `app/admin/products/page.tsx`
- **Image Optimization**: `lib/cloudinary-urls.ts`

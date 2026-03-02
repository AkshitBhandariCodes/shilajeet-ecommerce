# Product Gallery Management Guide

## Overview
The product edit page now supports managing multiple product images - a main image and a gallery of sub-images. This allows customers to view products from different angles and perspectives.

## Features

✅ **Main Product Image** - Primary image displayed on product cards
✅ **Product Gallery** - Multiple sub-images for detailed product views
✅ **Image Upload** - Upload images directly from your computer
✅ **Image URLs** - Paste Cloudinary or external image URLs
✅ **Image Preview** - See images before saving
✅ **Image Management** - Add, edit, and delete gallery images
✅ **Reordering** - Images display in the order you add them

## How to Use

### Edit Main Product Image
1. Go to `/admin/products/[id]/edit`
2. Scroll to "Product Image" section
3. Click "Upload Image" or paste a URL
4. Image preview will appear
5. Click trash icon to delete
6. Click "Save Changes"

### Add Sub-Images to Gallery
1. Scroll to "Product Gallery (Sub Images)" section
2. Click "Add Image" button
3. Upload an image or paste a URL
4. Image preview will appear
5. Repeat to add more images
6. Click "Save Changes"

### Delete Sub-Image
1. Find the image in the gallery
2. Click the trash icon on the image card
3. Click "Save Changes"

### Edit Sub-Image
1. Click the upload button to replace with new image
2. Or paste a new URL in the text field
3. Click "Save Changes"

## Image Display Order

Images are displayed in the order they appear in the gallery:
- **First image** - Shown first in the product slider
- **Subsequent images** - Shown in order when user clicks next

## Image Format Support

Supported formats:
- JPG / JPEG
- PNG
- GIF
- WebP
- SVG
- BMP

## File Size Recommendations

- **Recommended**: Under 5MB per image
- **Optimal**: 1-2MB for web use
- **Total Gallery**: Keep total under 20MB for best performance

## Best Practices

1. **Consistent Sizing** - Use similar dimensions for all images
2. **High Quality** - Use high-resolution images (at least 800x800px)
3. **Multiple Angles** - Show product from different perspectives
4. **Lifestyle Shots** - Include images of product in use
5. **Close-ups** - Show details and texture
6. **Packaging** - Include front and back packaging images
7. **Cloudinary URLs** - Better performance and CDN delivery

## Database Schema

### Product Model
```typescript
{
  image: string,           // Main product image (required)
  images: [string],        // Gallery of sub-images (optional)
  ...other fields
}
```

### Example Product Data
```json
{
  "_id": "696e73cb5ffd0ccd201fcbce",
  "name": "Agnishila Shilajit",
  "image": "https://res.cloudinary.com/dsejv31js/image/upload/v1767090441/agnishila/out12/2.png",
  "images": [
    "https://res.cloudinary.com/dsejv31js/image/upload/v1767090441/agnishila/out12/2.png",
    "https://res.cloudinary.com/dsejv31js/image/upload/v1767090443/agnishila/out12/3.png",
    "https://res.cloudinary.com/dsejv31js/image/upload/v1767090445/agnishila/out12/4.png"
  ]
}
```

## Frontend Display

### ProductImageSlider Component
The `ProductImageSlider` component displays:
- Main image from `product.image`
- Gallery images from `product.images` array
- Navigation buttons (prev/next)
- Dot indicators for each image
- Image counter (e.g., "1 of 5")

### Usage in Product Details Page
```typescript
<ProductImageSlider 
  productId={product.id}
  productName={product.name}
  frontImage={product.image}
  images={product.images}
  isInWishlist={isInWishlist}
  onWishlistToggle={handleWishlistToggle}
  onShare={handleShare}
  wishlistLoading={wishlistLoading}
/>
```

## API Endpoints

### Get Product
```
GET /api/products/[id]
Response: { image, images, ...other fields }
```

### Update Product
```
PUT /api/products/[id]
Content-Type: application/json

{
  "image": "https://...",
  "images": ["https://...", "https://..."],
  ...other fields
}
```

## Troubleshooting

### Images not showing after upload?
- Check browser console for errors
- Verify file format is supported
- Try a different image file
- Clear browser cache and reload

### Image too large?
- Compress the image before uploading
- Use online image compressor tools
- Recommended size: 1-2MB

### Can't add more images?
- Refresh the page
- Check browser console for errors
- Try uploading one image at a time

### URL not working?
- Verify the URL is complete (starts with http:// or https://)
- Check if the image is publicly accessible
- Try uploading the image instead

## Image Optimization Tips

### For Cloudinary URLs
Use transformation parameters:
```
https://res.cloudinary.com/dsejv31js/image/upload/w_800,h_800,c_fill,q_auto/path/to/image.jpg
```

Parameters:
- `w_800` - Width 800px
- `h_800` - Height 800px
- `c_fill` - Crop to fill
- `q_auto` - Auto quality

### For Local Uploads
- Compress before uploading
- Use WebP format when possible
- Resize to 800x800px minimum

## File Locations

- Edit Page: `app/admin/products/[id]/edit/page.tsx`
- Product Model: `models/Product.ts`
- API Route: `app/api/products/[id]/route.ts`
- Display Component: `components/ProductImageSlider.tsx`
- Product Details: `app/products/[slug]/page.tsx`

## Related Features

- **Product Creation**: `app/admin/products/new/page.tsx`
- **Product List**: `app/admin/products/page.tsx`
- **Image Optimization**: `lib/cloudinary-urls.ts`
- **Product Display**: `components/ProductImageSlider.tsx`

## Example Workflow

1. **Create Product** with main image
2. **Edit Product** to add gallery images
3. **Upload 3-5 images** showing different angles
4. **Save Changes**
5. **View on Frontend** - Images appear in slider
6. **Customer Experience** - Users can browse all images

## Performance Considerations

- **Lazy Loading** - Images load on demand
- **CDN Delivery** - Use Cloudinary for better performance
- **Image Compression** - Reduces file size and load time
- **Caching** - Browser caches images for faster loading

## Future Enhancements

Potential improvements:
- Drag-and-drop reordering
- Bulk image upload
- Image cropping tool
- Automatic image optimization
- Image alt text management
- Video support

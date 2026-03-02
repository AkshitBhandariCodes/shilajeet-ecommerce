# Product Not Found - Troubleshooting & Fix Guide

## Issue
The product page shows "Product Not Found" when accessing `/products/agnishila-shilajit-gummies` or other product slugs.

## Root Causes

### 1. **Product Lookup Order Issue** ✅ FIXED
**Problem:** API was trying MongoDB `_id` first, which doesn't match the slug format
**Solution:** Changed lookup order to prioritize custom `id` field (slug) first

**Before:**
```typescript
let product = await Product.findById(params.id);  // Fails for slugs
if (!product) {
  product = await Product.findOne({ id: params.id });  // Fallback
}
```

**After:**
```typescript
product = await Product.findOne({ id: params.id });  // Try slug first
if (!product) {
  try {
    product = await Product.findById(params.id);  // Try ObjectId
  } catch (err) {
    // Invalid ObjectId format
  }
}
```

### 2. **Missing Products in Database**
**Problem:** Products might not exist in the database
**Solution:** Check what products exist using debug endpoint

**Debug Endpoint:**
```
GET /api/admin/debug/products
```

This returns all products with their IDs and names.

### 3. **Product Model Schema Change**
**Problem:** Added `images` field to Product model, but existing products might not have this field
**Solution:** The field is optional, so existing products will work fine

## How to Fix

### Step 1: Check if Products Exist
1. Open browser console
2. Go to `http://localhost:3000/api/admin/debug/products`
3. Check the response - it shows all products in database

### Step 2: Verify Product IDs Match URLs
- If database has `id: 'agnishila-shilajit-gummies'`
- URL should be `/products/agnishila-shilajit-gummies`
- They must match exactly (case-sensitive)

### Step 3: Seed Database if Empty
If no products exist, run the seed script:

```bash
node scripts/seed-database.js
```

This creates sample products with correct IDs.

### Step 4: Test the Fix
1. Go to `/products` page
2. Click on a product
3. Should now load the product details page

## API Endpoint Changes

### Updated: `/api/products/[id]` (GET)
**File:** `app/api/products/[id]/route.ts`

**Changes:**
- Lookup order: custom `id` field first, then MongoDB `_id`
- Better error handling for invalid ObjectIds
- Improved logging for debugging

**Lookup Strategy:**
1. Try `Product.findOne({ id: params.id })` - matches slug
2. Try `Product.findById(params.id)` - matches MongoDB ObjectId
3. Return 404 if not found

### New: `/api/admin/debug/products` (GET)
**File:** `app/api/admin/debug/products/route.ts`

**Purpose:** Debug endpoint to list all products in database

**Response:**
```json
{
  "count": 3,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "id": "agnishila-trublk-gold-resin",
      "name": "Agnishila TruBlk Gold Resin"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "id": "agnishila-shilajit-gummies",
      "name": "Agnishila ShilaBoost Gummies"
    }
  ]
}
```

## Product Model Updates

### Added Field: `images`
**File:** `models/Product.ts`

```typescript
images: [{
  type: String,
}],
```

**Purpose:** Store multiple product images for gallery/slider
**Optional:** Existing products without this field will work fine

## Testing Checklist

- [ ] Debug endpoint returns products: `/api/admin/debug/products`
- [ ] Product IDs in database match URL slugs
- [ ] Can access product page: `/products/agnishila-shilajit-gummies`
- [ ] Product details load correctly
- [ ] Images display (main + gallery)
- [ ] Add to cart works
- [ ] Reviews load

## Common Issues & Solutions

### Issue: Still showing "Product Not Found"
**Solution:**
1. Check debug endpoint: `/api/admin/debug/products`
2. Verify product ID matches URL slug exactly
3. Check browser console for error messages
4. Clear browser cache and reload

### Issue: Products exist but page still fails
**Solution:**
1. Check MongoDB connection in `.env`
2. Verify database has products
3. Check API response: `/api/products/agnishila-shilajit-gummies`
4. Look for error in browser console

### Issue: Images not showing
**Solution:**
1. Check if `images` array is populated in database
2. Verify image URLs are valid
3. Check Cloudinary access if using Cloudinary URLs
4. Try uploading new images from admin panel

## File Locations

- **API Route:** `app/api/products/[id]/route.ts`
- **Debug Endpoint:** `app/api/admin/debug/products/route.ts`
- **Product Model:** `models/Product.ts`
- **Product Page:** `app/products/[slug]/page.tsx`
- **Seed Script:** `scripts/seed-database.js`

## Next Steps

1. **Verify Fix:** Test accessing product pages
2. **Check Images:** Ensure gallery images display correctly
3. **Monitor:** Watch for any "Product Not Found" errors
4. **Update:** If issues persist, check database directly

## Database Query Examples

### Find product by custom ID
```javascript
db.products.findOne({ id: "agnishila-shilajit-gummies" })
```

### Find product by MongoDB ID
```javascript
db.products.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") })
```

### List all products
```javascript
db.products.find({}).limit(10)
```

### Check if images field exists
```javascript
db.products.findOne({ images: { $exists: true } })
```

## Performance Notes

- Lookup by custom `id` field is faster (indexed)
- MongoDB `_id` lookup is fallback for direct ObjectId access
- No database queries for static product data
- Images are stored as URLs, not files

## Security Notes

- Debug endpoint is public (consider adding auth in production)
- Product IDs are case-sensitive
- No sensitive data exposed in API responses
- Images served from Cloudinary CDN

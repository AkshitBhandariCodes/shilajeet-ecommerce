# Certificate of Analysis - Setup & Implementation Guide

## Overview

The Certificate of Analysis feature displays batch numbers and allows customers to download quality assurance certificates for Agnishila products. This builds trust by showing third-party lab testing results.

## What Was Implemented

### 1. Database Updates
**`models/Product.ts`** - Added two new fields:
- `batchNumber` (String) - Unique batch identifier (e.g., "BAKG-0125")
- `certificatePdfUrl` (String) - URL to the PDF certificate on Cloudinary

### 2. Components
**`components/CertificateOfAnalysis.tsx`**
- Displays certificates in a grid layout
- Shows batch number for each product
- Download button for PDF certificates
- Quality assurance information
- Auto-fetches certificate data from API
- Responsive design for mobile and desktop

### 3. API Route
**`app/api/certificates/route.ts`**
- GET endpoint to fetch all products with certificates
- Returns: productId, productName, batchNumber, certificatePdfUrl
- Only returns products that have both batchNumber and certificatePdfUrl

### 4. Homepage Integration
**`app/page.tsx`** - Updated to include:
- Import CertificateOfAnalysis component
- Added component before Newsletter section
- Positioned at the bottom of the page for maximum visibility

### 5. Scripts
**`scripts/upload-certificates.js`**
- Uploads PDF files to Cloudinary
- Organizes certificates in `/agnishila/certificates/` folder
- Supports batch uploads

**`scripts/update-certificates.js`**
- Updates MongoDB products with certificate data
- Links batch numbers to products
- Sets certificate PDF URLs

## Setup Instructions

### Step 1: Upload PDFs to Cloudinary

```bash
# Make sure your PDFs are in the public folder:
# - public/Agnishila Shilajit Fulvic Acid.pdf
# - public/Agnishila Ashwagandha.pdf

# Run the upload script
node scripts/upload-certificates.js
```

This will output URLs like:
```
https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf
```

### Step 2: Update Products with Certificate Data

Edit `scripts/update-certificates.js` and update the URLs from Step 1:

```javascript
const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',
  },
  {
    productId: 'ashwa-glo-gummies',
    batchNumber: 'BAKA-0126',
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',
  },
];
```

Then run:
```bash
node scripts/update-certificates.js
```

### Step 3: Verify on Homepage

1. Start the development server: `npm run dev`
2. Go to http://localhost:3000
3. Scroll to the bottom of the page
4. Look for "Certificate of Analysis" section
5. Verify batch numbers and download buttons work

## File Structure

```
components/
├── CertificateOfAnalysis.tsx          # Main component

app/
├── api/
│   └── certificates/
│       └── route.ts                   # API endpoint

models/
├── Product.ts                         # Updated with certificate fields

scripts/
├── upload-certificates.js             # Upload PDFs to Cloudinary
└── update-certificates.js             # Update products in MongoDB

app/
└── page.tsx                           # Homepage (updated)
```

## Component Features

### Display
- Grid layout (2 columns on desktop, 1 on mobile)
- Product name with checkmark icon
- Batch number in highlighted box
- Quality assurance checklist
- Download and view buttons

### Functionality
- Auto-fetches certificates from API
- Download button saves PDF with product name
- "View in Browser" link opens PDF in new tab
- Loading state while fetching
- Error handling if certificates unavailable

### Styling
- Matches Agnishila brand (black background, primary-400 accents)
- Hover effects on cards
- Responsive design
- Decorative corner accents
- Smooth animations

## API Response Format

```json
[
  {
    "productId": "agnishila-shilajit-gummies",
    "productName": "Shilajit ShilaBoost Gummies",
    "batchNumber": "BAKG-0125",
    "certificatePdfUrl": "https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf"
  },
  {
    "productId": "ashwa-glo-gummies",
    "productName": "KSM-66 AshwaGlow Gummies",
    "batchNumber": "BAKA-0126",
    "certificatePdfUrl": "https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf"
  }
]
```

## Adding New Certificates

To add certificates for new products:

1. **Upload PDF to Cloudinary**
   ```bash
   # Add to scripts/upload-certificates.js
   {
     name: 'Product Name',
     file: 'public/Product-Certificate.pdf',
     productId: 'product-id',
     batchNumber: 'BATCH-0127',
   }
   ```

2. **Update Product in Database**
   ```bash
   # Add to scripts/update-certificates.js
   {
     productId: 'product-id',
     batchNumber: 'BATCH-0127',
     certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/product-id.pdf',
   }
   ```

3. **Run Scripts**
   ```bash
   node scripts/upload-certificates.js
   node scripts/update-certificates.js
   ```

## Batch Number Format

Suggested batch number format:
- `BAKG-XXXX` for Shilajit Gummies (BAKG = Batch Agnishila Gummies)
- `BAKA-XXXX` for Ashwagandha Gummies (BAKA = Batch Agnishila Ashwagandha)
- `BAKR-XXXX` for Resin products (BAKR = Batch Agnishila Resin)

Example: `BAKG-0125` = Batch 125 of Agnishila Gummies

## Certificate PDF Requirements

The PDF should include:
- Agnishila logo
- "Certificate of Analysis" header
- Batch number
- Date of receipt
- Date of analysis
- Manufacturing date
- Expiry date
- Test parameters and results
- Lab testing seal/stamp

## Troubleshooting

### Certificates Not Showing
1. Check if products have `batchNumber` and `certificatePdfUrl` in database
2. Verify API endpoint returns data: `GET /api/certificates`
3. Check browser console for errors

### Download Not Working
1. Verify PDF URL is accessible
2. Check CORS settings if PDF is from different domain
3. Try opening PDF in browser first

### Missing Products
1. Ensure product IDs match exactly
2. Check MongoDB for product records
3. Verify `batchNumber` and `certificatePdfUrl` fields are set

## Performance Considerations

- Component fetches certificates on mount
- Data is cached in component state
- No pagination needed (typically 2-5 products)
- API response is lightweight (only 4 fields per product)

## Security Notes

- PDFs are stored on Cloudinary (secure CDN)
- No sensitive data in batch numbers
- API endpoint is public (no authentication needed)
- PDFs are read-only (no modification possible)

## Testing Checklist

- [ ] PDFs uploaded to Cloudinary
- [ ] Products updated with batch numbers
- [ ] API endpoint returns certificate data
- [ ] Component displays on homepage
- [ ] Download button works
- [ ] View in browser link works
- [ ] Mobile responsive
- [ ] No console errors

## Next Steps

1. ✅ Implementation complete
2. Upload PDFs to Cloudinary
3. Update products with certificate data
4. Test on homepage
5. Deploy to production

---

**Status**: Ready for deployment
**Last Updated**: January 7, 2026
**Component**: CertificateOfAnalysis.tsx
**API Route**: /api/certificates

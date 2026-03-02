# Certificate of Analysis - Quick Start

## What It Does

Displays batch numbers and downloadable PDF certificates on the homepage to show customers that products are lab-tested and quality-assured.

## Quick Setup (5 minutes)

### 1. Upload PDFs to Cloudinary

Make sure these files exist:
- `public/Agnishila Shilajit Fulvic Acid.pdf`
- `public/Agnishila Ashwagandha.pdf`

Run:
```bash
node scripts/upload-certificates.js
```

Copy the URLs from the output.

### 2. Update Certificate URLs

Edit `scripts/update-certificates.js` and replace the URLs:

```javascript
const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',
    certificatePdfUrl: 'PASTE_URL_HERE',  // From step 1
  },
  {
    productId: 'ashwa-glo-gummies',
    batchNumber: 'BAKA-0126',
    certificatePdfUrl: 'PASTE_URL_HERE',  // From step 1
  },
];
```

### 3. Update Database

```bash
node scripts/update-certificates.js
```

### 4. Test

```bash
npm run dev
```

Go to http://localhost:3000 and scroll to the bottom. You should see the "Certificate of Analysis" section.

## Files Created

| File | Purpose |
|------|---------|
| `components/CertificateOfAnalysis.tsx` | Main component |
| `app/api/certificates/route.ts` | API endpoint |
| `scripts/upload-certificates.js` | Upload PDFs |
| `scripts/update-certificates.js` | Update database |
| `models/Product.ts` | Added certificate fields |
| `app/page.tsx` | Added component to homepage |

## What Users See

- **Section Title**: "Certificate of Analysis"
- **For Each Product**:
  - Product name
  - Batch number (e.g., "BAKG-0125")
  - Quality assurance checklist
  - Download button
  - View in browser link

## Batch Number Examples

- `BAKG-0125` = Shilajit Gummies Batch 125
- `BAKA-0126` = Ashwagandha Gummies Batch 126
- `BAKR-0127` = Resin Batch 127

## Adding More Products

1. Add PDF to `public/` folder
2. Add entry to `scripts/upload-certificates.js`
3. Run upload script
4. Add entry to `scripts/update-certificates.js` with URL from step 3
5. Run update script

## Troubleshooting

**Certificates not showing?**
- Check if PDFs uploaded: `node scripts/upload-certificates.js`
- Check if database updated: `node scripts/update-certificates.js`
- Check API: `curl http://localhost:3000/api/certificates`

**Download not working?**
- Verify PDF URL is accessible
- Check browser console for errors

## Done!

The Certificate of Analysis section is now live on your homepage. Customers can download quality certificates for each product.

---

**Time to setup**: ~5 minutes
**Status**: Ready to deploy

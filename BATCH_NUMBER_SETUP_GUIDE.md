# Where to Put Batch Numbers & PDFs - Step by Step

## Overview

You need to put batch numbers and PDF URLs in ONE file: `scripts/update-certificates.js`

This file will automatically update your database with the certificate information.

---

## Step 1: Upload PDFs to Cloudinary

First, make sure your PDF files are in the `public` folder:
- `public/Agnishila Shilajit Fulvic Acid.pdf`
- `public/Agnishila Ashwagandha.pdf`

Then run:
```bash
node scripts/upload-certificates.js
```

This will output URLs like:
```
✅ Uploaded: Agnishila Shilajit Fulvic Acid
   URL: https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf
   Batch: BAKG-0125

✅ Uploaded: Agnishila Ashwagandha
   URL: https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf
   Batch: BAKA-0126
```

**Copy these URLs** - you'll need them in the next step.

---

## Step 2: Edit `scripts/update-certificates.js`

Open the file: `scripts/update-certificates.js`

You'll see this section:

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

### What Each Field Means:

| Field | What to Put | Example |
|-------|------------|---------|
| `productId` | Product ID (don't change) | `'agnishila-shilajit-gummies'` |
| `batchNumber` | Batch number from your PDF | `'BAKG-0125'` |
| `certificatePdfUrl` | URL from Cloudinary upload | `'https://res.cloudinary.com/...'` |

---

## Step 3: Update with Your Data

### For Shilajit Gummies:

```javascript
{
  productId: 'agnishila-shilajit-gummies',
  batchNumber: 'BAKG-0125',  // ← PUT YOUR BATCH NUMBER HERE
  certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  // ← PUT YOUR PDF URL HERE
},
```

**Example with real data:**
```javascript
{
  productId: 'agnishila-shilajit-gummies',
  batchNumber: 'BAKG-0125',  // From your PDF
  certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  // From Cloudinary
},
```

### For Ashwagandha Gummies:

```javascript
{
  productId: 'ashwa-glo-gummies',
  batchNumber: 'BAKA-0126',  // ← PUT YOUR BATCH NUMBER HERE
  certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',  // ← PUT YOUR PDF URL HERE
},
```

---

## Step 4: Run the Update Script

After updating the file, run:

```bash
node scripts/update-certificates.js
```

You should see:
```
Updating products with certificate data...

✅ Updated: agnishila-shilajit-gummies
   Batch: BAKG-0125
   Certificate: https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf

✅ Updated: ashwa-glo-gummies
   Batch: BAKA-0126
   Certificate: https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf

Certificate update complete!
```

---

## Step 5: Test on Homepage

```bash
npm run dev
```

Visit: http://localhost:3000

Scroll to the bottom and you should see:

```
📄 CERTIFICATE OF ANALYSIS

✓ Shilajit ShilaBoost Gummies
  Batch: BAKG-0125
  [Download Certificate] [View in Browser]

✓ KSM-66 AshwaGlow Gummies
  Batch: BAKA-0126
  [Download Certificate] [View in Browser]
```

---

## Complete Example

Here's the complete `scripts/update-certificates.js` file with real data:

```javascript
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://developerduco:p2nDgP07paBQewdi@cluster0.sms0okt.mongodb.net/shilajit-store?retryWrites=true&w=majority&appName=Cluster0';

const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',  // ← YOUR BATCH NUMBER
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  // ← YOUR PDF URL
  },
  {
    productId: 'ashwa-glo-gummies',
    batchNumber: 'BAKA-0126',  // ← YOUR BATCH NUMBER
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',  // ← YOUR PDF URL
  },
];

// Rest of the file stays the same...
```

---

## Adding More Products

To add certificates for more products:

1. Add a new object to `certificateData`:

```javascript
const certificateData = [
  // ... existing products ...
  {
    productId: 'new-product-id',
    batchNumber: 'BAKR-0127',
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/new-product-id.pdf',
  },
];
```

2. Run the update script:
```bash
node scripts/update-certificates.js
```

---

## Batch Number Format

Use this format for batch numbers:

| Product Type | Prefix | Example |
|--------------|--------|---------|
| Shilajit Gummies | BAKG | BAKG-0125 |
| Ashwagandha Gummies | BAKA | BAKA-0126 |
| Resin Products | BAKR | BAKR-0127 |
| Other Products | BAKO | BAKO-0128 |

Format: `PREFIX-XXXX` where XXXX is the batch number

---

## Troubleshooting

### "Product not found" error?
- Check that `productId` matches exactly
- Product IDs are case-sensitive
- Verify product exists in database

### PDF URL not working?
- Make sure you ran `node scripts/upload-certificates.js` first
- Copy the exact URL from the upload output
- Check that URL is accessible in browser

### Batch number not showing?
- Make sure you ran `node scripts/update-certificates.js`
- Check that batch number is in quotes: `'BAKG-0125'`
- Verify no typos in the file

---

## Quick Checklist

- [ ] PDFs in `public/` folder
- [ ] Run `node scripts/upload-certificates.js`
- [ ] Copy URLs from output
- [ ] Edit `scripts/update-certificates.js`
- [ ] Paste URLs into `certificatePdfUrl` fields
- [ ] Add batch numbers to `batchNumber` fields
- [ ] Run `node scripts/update-certificates.js`
- [ ] Test on homepage: `npm run dev`
- [ ] Verify certificates display
- [ ] Test download button

---

## Summary

**One file to edit**: `scripts/update-certificates.js`

**Two things to add**:
1. Batch number (e.g., `'BAKG-0125'`)
2. PDF URL from Cloudinary (e.g., `'https://res.cloudinary.com/...'`)

**Then run**: `node scripts/update-certificates.js`

**Done!** Certificates will appear on homepage.

---

**Time to setup**: ~5 minutes
**Difficulty**: Easy
**Status**: Ready to implement

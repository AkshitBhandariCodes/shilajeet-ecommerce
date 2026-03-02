# Where to Put Batch Numbers & PDFs - ANSWER

## TL;DR (Too Long; Didn't Read)

**Edit ONE file**: `scripts/update-certificates.js`

**Put TWO things**:
1. Batch number (e.g., `'BAKG-0125'`)
2. PDF URL (e.g., `'https://res.cloudinary.com/...'`)

**Then run**: `node scripts/update-certificates.js`

**Done!** Certificates appear on homepage.

---

## The Exact File

**Location**: `scripts/update-certificates.js`

**Lines to edit**: 8, 9, 13, 14

---

## What to Put

### Line 8 - Shilajit Batch Number

```javascript
batchNumber: 'BAKG-0125',  ← PUT YOUR BATCH NUMBER HERE
```

Example:
```javascript
batchNumber: 'BAKG-0125',  // From your Shilajit PDF
```

### Line 9 - Shilajit PDF URL

```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  ← PUT YOUR PDF URL HERE
```

Example:
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  // From Cloudinary upload
```

### Line 13 - Ashwagandha Batch Number

```javascript
batchNumber: 'BAKA-0126',  ← PUT YOUR BATCH NUMBER HERE
```

Example:
```javascript
batchNumber: 'BAKA-0126',  // From your Ashwagandha PDF
```

### Line 14 - Ashwagandha PDF URL

```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',  ← PUT YOUR PDF URL HERE
```

Example:
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',  // From Cloudinary upload
```

---

## How to Get the Data

### Batch Number

1. Open your PDF file
2. Look for "Batch Number:" field
3. Copy the number (e.g., BAKG-0125)
4. Paste into line 8 or 13

### PDF URL

1. Run: `node scripts/upload-certificates.js`
2. Copy the URL from the output
3. Paste into line 9 or 14

---

## Complete Example

### Your Shilajit PDF has:
```
Batch Number: BAKG-0125
```

### Your Ashwagandha PDF has:
```
Batch Number: BAKA-0126
```

### You upload PDFs:
```bash
node scripts/upload-certificates.js
```

### You get URLs:
```
https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf
https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf
```

### You edit file:
```javascript
const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',  ← Line 8
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  ← Line 9
  },
  {
    productId: 'ashwa-glo-gummies',
    batchNumber: 'BAKA-0126',  ← Line 13
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',  ← Line 14
  },
];
```

### You run:
```bash
node scripts/update-certificates.js
```

### Result on homepage:
```
✓ Shilajit ShilaBoost Gummies
  Batch: BAKG-0125
  [Download Certificate]

✓ KSM-66 AshwaGlow Gummies
  Batch: BAKA-0126
  [Download Certificate]
```

---

## Quick Steps

```
1. Extract batch number from PDF
2. Upload PDF: node scripts/upload-certificates.js
3. Copy URL from output
4. Edit: scripts/update-certificates.js
5. Paste batch number on line 8 or 13
6. Paste PDF URL on line 9 or 14
7. Run: node scripts/update-certificates.js
8. Test: npm run dev
9. Visit: http://localhost:3000
10. Scroll to bottom → See certificates!
```

---

## File Structure

```
scripts/
└── update-certificates.js
    ├── Line 8: batchNumber for Shilajit
    ├── Line 9: certificatePdfUrl for Shilajit
    ├── Line 13: batchNumber for Ashwagandha
    └── Line 14: certificatePdfUrl for Ashwagandha
```

---

## That's All!

**One file to edit**: `scripts/update-certificates.js`

**Four lines to update**: 8, 9, 13, 14

**Two things to add**: Batch number + PDF URL

**One command to run**: `node scripts/update-certificates.js`

**Result**: Certificates on homepage!

---

## Related Guides

- `BATCH_NUMBER_SETUP_GUIDE.md` - Detailed setup
- `BATCH_NUMBER_VISUAL_GUIDE.md` - Visual diagrams
- `BATCH_NUMBER_QUICK_REFERENCE.md` - Quick reference
- `EXACT_FILE_LOCATION.md` - Line-by-line guide
- `CERTIFICATE_OF_ANALYSIS_SETUP.md` - Full documentation

---

**Time**: 5 minutes
**Difficulty**: Very Easy
**Status**: Ready to implement

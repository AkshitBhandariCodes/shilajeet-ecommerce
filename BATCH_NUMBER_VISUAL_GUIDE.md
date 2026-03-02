# Batch Number & PDF - Visual Location Guide

## File Location

```
your-project/
├── scripts/
│   └── update-certificates.js  ← EDIT THIS FILE
├── public/
│   ├── Agnishila Shilajit Fulvic Acid.pdf
│   └── Agnishila Ashwagandha.pdf
└── ...
```

---

## Inside `scripts/update-certificates.js`

### The Exact Location

```javascript
const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',  ← ← ← PUT BATCH NUMBER HERE
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  ← ← ← PUT PDF URL HERE
  },
  {
    productId: 'ashwa-glo-gummies',
    batchNumber: 'BAKA-0126',  ← ← ← PUT BATCH NUMBER HERE
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',  ← ← ← PUT PDF URL HERE
  },
];
```

---

## Step-by-Step Visual

### Step 1: Your PDF File

```
┌─────────────────────────────────────────────────────────┐
│ Agnishila Shilajit Fulvic Acid.pdf                      │
│                                                         │
│ CERTIFICATE OF ANALYSIS                                │
│                                                         │
│ Batch Number: BAKG-0125  ← ← ← COPY THIS              │
│ Date of Receipt: 20/12/2025                            │
│ Date of Analysis: 22/12/2025                           │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

### Step 2: Upload to Cloudinary

```bash
$ node scripts/upload-certificates.js

✅ Uploaded: Agnishila Shilajit Fulvic Acid
   URL: https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf
   ↑ ↑ ↑ COPY THIS URL ↑ ↑ ↑
```

### Step 3: Edit `scripts/update-certificates.js`

```javascript
const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',  ← PASTE BATCH NUMBER HERE
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  ← PASTE URL HERE
  },
];
```

### Step 4: Run Update Script

```bash
$ node scripts/update-certificates.js

✅ Updated: agnishila-shilajit-gummies
   Batch: BAKG-0125
   Certificate: https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf
```

### Step 5: See on Homepage

```
Homepage (http://localhost:3000)
↓
Scroll to bottom
↓
┌─────────────────────────────────────────────────────────┐
│ 📄 CERTIFICATE OF ANALYSIS                              │
│                                                         │
│ ✓ Shilajit ShilaBoost Gummies                           │
│                                                         │
│ Batch: BAKG-0125  ← ← ← SHOWS HERE                     │
│                                                         │
│ [Download Certificate]  ← ← ← DOWNLOADS PDF            │
│ View in Browser →       ← ← ← OPENS PDF                │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
PDF File (public/)
    ↓
    ├─ Extract Batch Number: BAKG-0125
    └─ Upload to Cloudinary
         ↓
         Get URL: https://res.cloudinary.com/.../agnishila-shilajit-gummies.pdf
         ↓
         Put in scripts/update-certificates.js
         ├─ batchNumber: 'BAKG-0125'
         └─ certificatePdfUrl: 'https://...'
         ↓
         Run: node scripts/update-certificates.js
         ↓
         Update MongoDB
         ├─ Product: agnishila-shilajit-gummies
         ├─ batchNumber: BAKG-0125
         └─ certificatePdfUrl: https://...
         ↓
         Homepage displays
         ├─ Batch Number: BAKG-0125
         ├─ Download Button (uses PDF URL)
         └─ View Button (uses PDF URL)
```

---

## Before & After

### BEFORE (No Certificates)

```javascript
const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',  // ← EMPTY
    certificatePdfUrl: 'https://...',  // ← EMPTY
  },
];
```

### AFTER (With Certificates)

```javascript
const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',  // ← FILLED WITH BATCH NUMBER
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  // ← FILLED WITH PDF URL
  },
];
```

---

## Complete Example

### Your PDF Contains:

```
CERTIFICATE OF ANALYSIS

Batch Number: BAKG-0125
Date of Receipt: 20/12/2025
Date of Analysis: 22/12/2025
Mfg. Date: December 2025
Exp. Date: May 2027

PARAMETERS                          RESULTS
Withanolides in KSM-66             5.0%
Ashwagandha Extract (%)

Metal Contaminants:
Arsenic (ppm)                      Complies
Lead (ppm)                         Complies
Cadmium (ppm)                      Complies
Mercury (ppm)                      Complies
```

### You Extract:

```
Batch Number: BAKG-0125
```

### You Upload PDF:

```bash
node scripts/upload-certificates.js
```

### You Get URL:

```
https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf
```

### You Put in File:

```javascript
const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',  ← BATCH NUMBER
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  ← PDF URL
  },
];
```

### Result on Homepage:

```
✓ Shilajit ShilaBoost Gummies
  Batch: BAKG-0125
  [Download Certificate]
  View in Browser →
```

---

## Quick Reference

| What | Where | Example |
|-----|-------|---------|
| Batch Number | In PDF file | BAKG-0125 |
| Extract from | Certificate of Analysis | Look for "Batch Number:" |
| Put in file | `scripts/update-certificates.js` | `batchNumber: 'BAKG-0125'` |
| PDF URL | From Cloudinary upload | `https://res.cloudinary.com/...` |
| Put in file | `scripts/update-certificates.js` | `certificatePdfUrl: 'https://...'` |
| Run script | Terminal | `node scripts/update-certificates.js` |
| See result | Homepage | Bottom of page |

---

## Common Mistakes to Avoid

❌ **Wrong**: Forgetting quotes
```javascript
batchNumber: BAKG-0125,  // ← WRONG (no quotes)
```

✅ **Right**: Using quotes
```javascript
batchNumber: 'BAKG-0125',  // ← CORRECT
```

---

❌ **Wrong**: Incomplete URL
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/',  // ← INCOMPLETE
```

✅ **Right**: Complete URL
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  // ← COMPLETE
```

---

❌ **Wrong**: Wrong product ID
```javascript
productId: 'shilajit-gummies',  // ← WRONG
```

✅ **Right**: Exact product ID
```javascript
productId: 'agnishila-shilajit-gummies',  // ← CORRECT
```

---

## Summary

1. **Find batch number** in your PDF
2. **Upload PDF** to Cloudinary
3. **Copy batch number** and **PDF URL**
4. **Edit** `scripts/update-certificates.js`
5. **Paste** batch number and URL
6. **Run** `node scripts/update-certificates.js`
7. **Test** on homepage

**Done!** Certificates appear on homepage.

---

**Time**: 5 minutes
**Difficulty**: Very Easy
**Status**: Ready to implement

# BATCH NUMBER & PDF - FINAL ANSWER

## Your Question: "Where to put batch number to get those pdf?"

## The Answer

**File**: `scripts/update-certificates.js`

**What to put**:
1. Batch number (from your PDF)
2. PDF URL (from Cloudinary)

---

## The Exact Location

### For Shilajit Gummies

```javascript
{
  productId: 'agnishila-shilajit-gummies',
  batchNumber: 'BAKG-0125',  ← PUT YOUR BATCH NUMBER HERE
  certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  ← PUT YOUR PDF URL HERE
},
```

### For Ashwagandha Gummies

```javascript
{
  productId: 'ashwa-glo-gummies',
  batchNumber: 'BAKA-0126',  ← PUT YOUR BATCH NUMBER HERE
  certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',  ← PUT YOUR PDF URL HERE
},
```

---

## How to Get the Data

### Batch Number

1. Open your PDF file
2. Look for "Batch Number:" field
3. Copy the number (e.g., BAKG-0125)

### PDF URL

1. Run: `node scripts/upload-certificates.js`
2. Copy the URL from the output

---

## Complete Process

```
Step 1: Extract batch number from PDF
        ↓
Step 2: Upload PDF to Cloudinary
        $ node scripts/upload-certificates.js
        ↓
Step 3: Copy URL from output
        ↓
Step 4: Edit scripts/update-certificates.js
        ↓
Step 5: Paste batch number in batchNumber field
        ↓
Step 6: Paste PDF URL in certificatePdfUrl field
        ↓
Step 7: Run update script
        $ node scripts/update-certificates.js
        ↓
Step 8: Test on homepage
        $ npm run dev
        Visit: http://localhost:3000
        Scroll to bottom
        ↓
Step 9: See certificates displayed!
```

---

## Real Example

### Your PDF contains:
```
CERTIFICATE OF ANALYSIS

Batch Number: BAKG-0125
Date of Receipt: 20/12/2025
Date of Analysis: 22/12/2025
...
```

### You extract:
```
Batch Number: BAKG-0125
```

### You upload PDF:
```bash
$ node scripts/upload-certificates.js

✅ Uploaded: Agnishila Shilajit Fulvic Acid
   URL: https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf
```

### You copy:
```
Batch: BAKG-0125
URL: https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf
```

### You edit file:
```javascript
const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',  ← PASTED HERE
    certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  ← PASTED HERE
  },
];
```

### You run:
```bash
$ node scripts/update-certificates.js

✅ Updated: agnishila-shilajit-gummies
   Batch: BAKG-0125
   Certificate: https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf

Certificate update complete!
```

### Result on homepage:
```
📄 CERTIFICATE OF ANALYSIS

✓ Shilajit ShilaBoost Gummies
  Batch: BAKG-0125
  [Download Certificate]
  View in Browser →
```

---

## Summary

| What | Where | How |
|-----|-------|-----|
| Batch Number | `scripts/update-certificates.js` | Copy from PDF, paste in `batchNumber` field |
| PDF URL | `scripts/update-certificates.js` | Upload to Cloudinary, copy URL, paste in `certificatePdfUrl` field |
| Run Update | Terminal | `node scripts/update-certificates.js` |
| See Result | Homepage | `npm run dev` → http://localhost:3000 → Scroll to bottom |

---

## Quick Checklist

- [ ] Open PDF file
- [ ] Find batch number (e.g., BAKG-0125)
- [ ] Run: `node scripts/upload-certificates.js`
- [ ] Copy URL from output
- [ ] Open: `scripts/update-certificates.js`
- [ ] Paste batch number in `batchNumber` field
- [ ] Paste PDF URL in `certificatePdfUrl` field
- [ ] Save file
- [ ] Run: `node scripts/update-certificates.js`
- [ ] Test: `npm run dev`
- [ ] Visit: http://localhost:3000
- [ ] Scroll to bottom
- [ ] See certificates!

---

## That's It!

**One file to edit**: `scripts/update-certificates.js`

**Two things to add**: Batch number + PDF URL

**One command to run**: `node scripts/update-certificates.js`

**Result**: Certificates appear on homepage!

---

## Related Documentation

- `BATCH_NUMBER_SETUP_GUIDE.md` - Detailed setup guide
- `BATCH_NUMBER_VISUAL_GUIDE.md` - Visual diagrams
- `BATCH_NUMBER_QUICK_REFERENCE.md` - Quick reference card
- `EXACT_FILE_LOCATION.md` - Line-by-line guide
- `VISUAL_FILE_LOCATION.txt` - Visual file layout
- `CERTIFICATE_OF_ANALYSIS_SETUP.md` - Full documentation

---

**Time to implement**: 5 minutes
**Difficulty**: Very Easy
**Status**: Ready to deploy

# Batch Number & PDF - Quick Reference Card

## The One File You Need to Edit

**File**: `scripts/update-certificates.js`

---

## What to Put Where

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
- Open your PDF file
- Look for "Batch Number:" field
- Copy the number (e.g., BAKG-0125)

### PDF URL
- Run: `node scripts/upload-certificates.js`
- Copy the URL from the output
- Paste into `certificatePdfUrl`

---

## Complete Steps

```
1. Open PDF → Find batch number → Copy it
2. Run: node scripts/upload-certificates.js → Copy URL
3. Edit: scripts/update-certificates.js
4. Paste batch number in batchNumber field
5. Paste PDF URL in certificatePdfUrl field
6. Run: node scripts/update-certificates.js
7. Test: npm run dev → Visit http://localhost:3000
8. Scroll to bottom → See certificates
```

---

## Example

### Your PDF has:
```
Batch Number: BAKG-0125
```

### Cloudinary gives you:
```
https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf
```

### You put in file:
```javascript
{
  productId: 'agnishila-shilajit-gummies',
  batchNumber: 'BAKG-0125',
  certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',
},
```

### Result on homepage:
```
✓ Shilajit ShilaBoost Gummies
  Batch: BAKG-0125
  [Download Certificate]
```

---

## Batch Number Format

| Product | Format | Example |
|---------|--------|---------|
| Shilajit Gummies | BAKG-XXXX | BAKG-0125 |
| Ashwagandha Gummies | BAKA-XXXX | BAKA-0126 |
| Resin | BAKR-XXXX | BAKR-0127 |

---

## Commands to Run

```bash
# Upload PDFs to Cloudinary
node scripts/upload-certificates.js

# Update database with batch numbers and URLs
node scripts/update-certificates.js

# Test on homepage
npm run dev
```

---

## Checklist

- [ ] PDFs in `public/` folder
- [ ] Batch number copied from PDF
- [ ] PDF uploaded to Cloudinary
- [ ] URL copied from Cloudinary
- [ ] `scripts/update-certificates.js` edited
- [ ] Batch number pasted in file
- [ ] PDF URL pasted in file
- [ ] Update script run
- [ ] Homepage tested
- [ ] Certificates visible

---

## That's It!

Edit one file → Run one script → Done!

Certificates appear on homepage automatically.

---

**Time**: 5 minutes
**Difficulty**: Easy
**Status**: Ready

# Exact File Location - Line by Line

## File to Edit

**Path**: `scripts/update-certificates.js`

---

## The Exact Content

```javascript
1  const { MongoClient } = require('mongodb');
2
3  const MONGODB_URI = 'mongodb+srv://developerduco:p2nDgP07paBQewdi@cluster0.sms0okt.mongodb.net/shilajit-store?retryWrites=true&w=majority&appName=Cluster0';
4
5  const certificateData = [
6    {
7      productId: 'agnishila-shilajit-gummies',
8      batchNumber: 'BAKG-0125',  ← ← ← LINE 8: PUT BATCH NUMBER HERE
9      certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  ← ← ← LINE 9: PUT PDF URL HERE
10   },
11   {
12     productId: 'ashwa-glo-gummies',
13     batchNumber: 'BAKA-0126',  ← ← ← LINE 13: PUT BATCH NUMBER HERE
14     certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',  ← ← ← LINE 14: PUT PDF URL HERE
15   },
16 ];
17
18 async function updateCertificates() {
19   const client = new MongoClient(MONGODB_URI);
20
21   try {
22     await client.connect();
23     const db = client.db('shilajit-store');
24     const productsCollection = db.collection('products');
25
26     console.log('Updating products with certificate data...\n');
27
28     for (const cert of certificateData) {
29       const result = await productsCollection.updateOne(
30         { id: cert.productId },
31         {
32           $set: {
33             batchNumber: cert.batchNumber,
34             certificatePdfUrl: cert.certificatePdfUrl,
35           },
36         }
37       );
38
39       if (result.matchedCount > 0) {
40         console.log(`✅ Updated: ${cert.productId}`);
41         console.log(`   Batch: ${cert.batchNumber}`);
42         console.log(`   Certificate: ${cert.certificatePdfUrl}\n`);
43       } else {
44         console.log(`⚠️  Product not found: ${cert.productId}\n`);
45       }
46     }
47
48     console.log('Certificate update complete!');
49   } catch (error) {
50     console.error('Error updating certificates:', error);
51   } finally {
52     await client.close();
53   }
}
54
55 updateCertificates();
```

---

## What to Change

### Change Line 8 (Shilajit Batch Number)

**Before**:
```javascript
batchNumber: 'BAKG-0125',
```

**After** (if your batch number is different):
```javascript
batchNumber: 'BAKG-0125',  // Keep as is or change to your batch number
```

### Change Line 9 (Shilajit PDF URL)

**Before**:
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',
```

**After** (paste URL from Cloudinary upload):
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  // Paste your URL here
```

### Change Line 13 (Ashwagandha Batch Number)

**Before**:
```javascript
batchNumber: 'BAKA-0126',
```

**After** (if your batch number is different):
```javascript
batchNumber: 'BAKA-0126',  // Keep as is or change to your batch number
```

### Change Line 14 (Ashwagandha PDF URL)

**Before**:
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',
```

**After** (paste URL from Cloudinary upload):
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',  // Paste your URL here
```

---

## Step by Step

### Step 1: Open File

Open: `scripts/update-certificates.js`

### Step 2: Find Lines 5-16

Look for:
```javascript
const certificateData = [
  {
    productId: 'agnishila-shilajit-gummies',
    batchNumber: 'BAKG-0125',
    certificatePdfUrl: '...',
  },
  {
    productId: 'ashwa-glo-gummies',
    batchNumber: 'BAKA-0126',
    certificatePdfUrl: '...',
  },
];
```

### Step 3: Update Line 8

Replace:
```javascript
batchNumber: 'BAKG-0125',
```

With your batch number (from your PDF):
```javascript
batchNumber: 'BAKG-0125',  // Your batch number
```

### Step 4: Update Line 9

Replace:
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',
```

With URL from Cloudinary:
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf',  // Your URL
```

### Step 5: Update Line 13

Replace:
```javascript
batchNumber: 'BAKA-0126',
```

With your batch number (from your PDF):
```javascript
batchNumber: 'BAKA-0126',  // Your batch number
```

### Step 6: Update Line 14

Replace:
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',
```

With URL from Cloudinary:
```javascript
certificatePdfUrl: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf',  // Your URL
```

### Step 7: Save File

Save the file (Ctrl+S or Cmd+S)

### Step 8: Run Script

```bash
node scripts/update-certificates.js
```

### Step 9: Test

```bash
npm run dev
```

Visit: http://localhost:3000

Scroll to bottom → See certificates!

---

## Real Example

### Your PDFs contain:

**Shilajit PDF**:
```
Batch Number: BAKG-0125
```

**Ashwagandha PDF**:
```
Batch Number: BAKA-0126
```

### Cloudinary gives you:

**Shilajit URL**:
```
https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/agnishila-shilajit-gummies.pdf
```

**Ashwagandha URL**:
```
https://res.cloudinary.com/dsejv31js/image/upload/v1767090399/agnishila/certificates/ashwa-glo-gummies.pdf
```

### You edit file to:

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

### Result:

Homepage shows:
```
✓ Shilajit ShilaBoost Gummies
  Batch: BAKG-0125
  [Download Certificate]

✓ KSM-66 AshwaGlow Gummies
  Batch: BAKA-0126
  [Download Certificate]
```

---

## Summary

| Line | What | Where |
|------|------|-------|
| 8 | Shilajit Batch Number | `batchNumber: 'BAKG-0125'` |
| 9 | Shilajit PDF URL | `certificatePdfUrl: 'https://...'` |
| 13 | Ashwagandha Batch Number | `batchNumber: 'BAKA-0126'` |
| 14 | Ashwagandha PDF URL | `certificatePdfUrl: 'https://...'` |

---

**File**: `scripts/update-certificates.js`
**Lines to edit**: 8, 9, 13, 14
**Time**: 2 minutes
**Status**: Ready

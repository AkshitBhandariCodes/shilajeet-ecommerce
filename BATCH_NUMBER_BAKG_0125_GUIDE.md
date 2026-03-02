# Batch Number BAKG-0125 - Complete Guide

## Status: ✅ Already Implemented and Working

The batch number BAKG-0125 is already configured in the system to download the Agnishila Ashwagandha PDF.

## How It Works

### Batch Number System

The Certificate of Analysis section on the landing page allows users to enter a batch number and download the corresponding PDF certificate.

**Batch Numbers Configured:**
- `BAKG-0125` → Downloads "Agnishila Shilajit Fulvic Acid.pdf"
- `BAKA-0126` → Downloads "Agnishila Ashwagandha.pdf"

### User Flow

1. User visits landing page
2. Scrolls to "Certificate of Analysis" section
3. Enters batch number (e.g., BAKG-0125)
4. Presses Enter
5. PDF downloads automatically
6. Success message displayed

## File Structure

### Component
- `components/CertificateOfAnalysis.tsx` - Batch number input and download logic

### PDF Files
- `public/Agnishila Shilajit Fulvic Acid.pdf` - For BAKG-0125
- `public/Agnishila Ashwagandha.pdf` - For BAKA-0126

### Landing Page
- `app/page.tsx` - Includes CertificateOfAnalysis component

## How to Use BAKG-0125

### On Landing Page

1. Open: http://localhost:3000
2. Scroll down to "Certificate of Analysis" section
3. In the input field, type: `BAKG-0125`
4. Press Enter
5. ✅ "Agnishila Shilajit Fulvic Acid.pdf" downloads

### Expected Behavior

**Input:** BAKG-0125
**Output:** Downloads "Agnishila Shilajit Fulvic Acid-Certificate-BAKG-0125.pdf"
**Message:** "✓ Downloaded certificate for Shilajit ShilaBoost Gummies"

## Certificate Mapping

```typescript
const certificates: Certificate[] = [
  {
    productId: 'agnishila-shilajit-gummies',
    productName: 'Shilajit ShilaBoost Gummies',
    batchNumber: 'BAKG-0125',
    pdfPath: '/Agnishila Shilajit Fulvic Acid.pdf',
  },
  {
    productId: 'ashwa-glo-gummies',
    productName: 'KSM-66 AshwaGlow Gummies',
    batchNumber: 'BAKA-0126',
    pdfPath: '/Agnishila Ashwagandha.pdf',
  },
];
```

## Features

✅ **Batch Number Lookup** - Enter batch number to find certificate
✅ **PDF Download** - Automatic download with proper filename
✅ **Error Handling** - Shows error if batch number not found
✅ **Success Message** - Confirms successful download
✅ **Case Insensitive** - Works with uppercase or lowercase input
✅ **Responsive Design** - Works on all devices
✅ **Loading State** - Shows loading while downloading

## Testing

### Test BAKG-0125

1. Open landing page: http://localhost:3000
2. Scroll to "Certificate of Analysis"
3. Enter: `BAKG-0125`
4. Press Enter
5. ✅ PDF downloads
6. ✅ Success message shows
7. ✅ Input clears

### Test Invalid Batch

1. Enter: `INVALID-123`
2. Press Enter
3. ✅ Error message: "Batch number not found"

### Test Case Insensitivity

1. Enter: `bakg-0125` (lowercase)
2. Press Enter
3. ✅ Still works (converted to uppercase)

## Adding New Batch Numbers

To add a new batch number:

1. Open `components/CertificateOfAnalysis.tsx`
2. Add to `certificates` array:
   ```typescript
   {
     productId: 'product-id',
     productName: 'Product Name',
     batchNumber: 'BATCH-NUMBER',
     pdfPath: '/path/to/pdf.pdf',
   }
   ```
3. Ensure PDF file exists in `public/` folder
4. Save and test

## PDF Files

### Current PDFs
- `public/Agnishila Shilajit Fulvic Acid.pdf` - Shilajit certificate
- `public/Agnishila Ashwagandha.pdf` - Ashwagandha certificate

### Adding New PDFs
1. Place PDF in `public/` folder
2. Add batch number mapping in CertificateOfAnalysis.tsx
3. Test with batch number

## Component Details

### Input Field
- Accepts batch number input
- Converts to uppercase automatically
- Clears on successful download
- Disabled during download

### Messages
- **Success**: Green message with checkmark
- **Error**: Red message with alert icon
- Auto-clears after 3 seconds

### Download Logic
1. Validates batch number
2. Finds matching certificate
3. Creates download link
4. Triggers download
5. Shows success message

## Troubleshooting

### PDF Not Downloading

**Check 1: File Exists**
- Verify PDF exists in `public/` folder
- Check filename matches exactly

**Check 2: Batch Number Correct**
- Verify batch number in certificates array
- Check spelling and format

**Check 3: Browser Settings**
- Check if browser is blocking downloads
- Check download folder

### Batch Number Not Found

**Solution:**
- Verify batch number is in certificates array
- Check spelling (case-insensitive)
- Ensure PDF path is correct

## Summary

🟢 **Status**: Fully Implemented
🟢 **BAKG-0125**: Working
🟢 **PDF Download**: Working
🟢 **User Experience**: Complete

The batch number BAKG-0125 is already configured and working on the landing page. Users can enter this batch number to download the Agnishila Shilajit Fulvic Acid certificate.

## Quick Reference

**Batch Number:** BAKG-0125
**Product:** Shilajit ShilaBoost Gummies
**PDF:** Agnishila Shilajit Fulvic Acid.pdf
**Location:** Landing page → Certificate of Analysis section
**How to Use:** Enter BAKG-0125 and press Enter


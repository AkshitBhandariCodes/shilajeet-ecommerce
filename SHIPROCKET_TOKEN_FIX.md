# Shiprocket API Token Fix

## Issue
Getting error: `Wrong number of segments` when trying to create shipments.

This means the API token format is invalid or corrupted.

## Solution

### Step 1: Get Correct API Token from Shiprocket

1. **Log in to Shiprocket Dashboard**
   - Go to: https://www.shiprocket.in/
   - Log in with your credentials

2. **Navigate to API Settings**
   - Click on your profile icon (top right)
   - Go to **Settings** → **API Keys**
   - Or directly: https://www.shiprocket.in/settings/api-keys

3. **Copy Your API Token**
   - You should see a long token string (usually 50+ characters)
   - It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT format)
   - Click "Copy" button or select and copy manually

### Step 2: Update .env File

1. **Open `.env` file** in your editor

2. **Find this line:**
   ```
   SHIPROCKET_API_TOKEN=bCnLDSBd@!%O9881YI@tRDUDw$J1GvoS
   ```

3. **Replace with your actual token:**
   ```
   SHIPROCKET_API_TOKEN=your_actual_token_here
   ```

4. **Make sure:**
   - No extra spaces before or after the token
   - No quotes around the token
   - The entire token is copied (it's usually very long)

### Step 3: Restart Dev Server

1. **Stop current server**
   - Press Ctrl+C in terminal

2. **Start server again**
   - Run: `npm run dev`

3. **Wait for compilation**
   - Should see "ready - started server on 0.0.0.0:3000"

### Step 4: Test

1. **Create a test order**
   - Go to `http://localhost:3000`
   - Add product to cart
   - Go to checkout
   - Complete payment

2. **Check console**
   - Should see: `Shiprocket shipment result: { success: true, ... }`
   - Should NOT see: `Wrong number of segments`

## Troubleshooting

**Still getting "Wrong number of segments"?**

1. **Verify token format**
   - Token should start with `eyJ` (JWT format)
   - Should be 100+ characters long
   - Should NOT have special characters like `@!%`

2. **Check for copy errors**
   - Make sure entire token was copied
   - No spaces at beginning or end
   - No line breaks in the middle

3. **Generate new token**
   - In Shiprocket settings, click "Generate New Token"
   - Copy the new token
   - Update .env
   - Restart server

4. **Check Shiprocket account**
   - Make sure account is active
   - Make sure you have API access enabled
   - Check if account has any restrictions

## Expected Token Format

Valid Shiprocket token looks like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5MCwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Characteristics:**
- Starts with `eyJ`
- Contains two dots (.)
- Only alphanumeric characters, hyphens, and underscores
- Usually 100-200+ characters long
- NO special characters like `@!%$`

## If Token Still Doesn't Work

1. **Check Shiprocket API Status**
   - Visit: https://status.shiprocket.in/
   - Make sure API is operational

2. **Verify Pickup Location**
   - In Shiprocket dashboard, go to Settings → Pickup Locations
   - Make sure you have at least one pickup location
   - Note the ID (usually 1 for first location)
   - Update `SHIPROCKET_PICKUP_LOCATION_ID` in .env if needed

3. **Contact Shiprocket Support**
   - If token is correct but still not working
   - Contact: support@shiprocket.in
   - Provide error message and order ID

## Current Status

After fixing the token:
- Orders will create successfully
- Shipments will be created automatically
- Tracking information will be available
- Customers can track their orders

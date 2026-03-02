# Shiprocket Pickup Location Setup

## The Error

```
Please select a pickup location as primary location from settings.
```

This means Shiprocket needs a **primary pickup location** configured in your account.

## How to Fix

### Step 1: Log in to Shiprocket Dashboard

1. Go to: https://www.shiprocket.in/
2. Log in with your main account (not the API user)

### Step 2: Configure Pickup Location

1. **Left sidebar** → **Settings**
2. Click **Pickup Locations**
3. You should see a list of pickup locations

### Step 3: Set Primary Location

1. **Find your warehouse/pickup location**
   - Look for "Agnishila Warehouse" or similar
   - If none exists, click **Add New Pickup Location**

2. **Add New Pickup Location (if needed)**
   - Click **Add New Pickup Location**
   - Fill in details:
     - **Location Name**: Agnishila Warehouse
     - **Address**: Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
     - **City**: Delhi
     - **State**: Delhi
     - **Pincode**: 110039
     - **Phone**: 8448893545
     - **Email**: info@agnishila.in
   - Click **Save**

3. **Set as Primary**
   - Find your location in the list
   - Look for a **"Set as Primary"** button or checkbox
   - Click it to make it the primary pickup location
   - You should see a checkmark or "Primary" label

### Step 4: Verify

1. Go back to **Settings** → **Pickup Locations**
2. Confirm your location shows as **Primary** or has a checkmark
3. Note the **Pickup Location ID** (usually 1 for the first location)

### Step 5: Update .env (if needed)

If your pickup location ID is different from 1:

```
SHIPROCKET_PICKUP_LOCATION_ID=1
```

Change `1` to your actual location ID if different.

### Step 6: Restart Dev Server

```bash
# Stop: Ctrl+C
# Start: npm run dev
```

### Step 7: Test Again

1. Go to `http://localhost:3000`
2. Add product to cart
3. Complete checkout
4. Check console for success message

## Expected Success Message

```
Shiprocket shipment result: {
  success: true,
  waybill: '...',
  shipmentId: ...,
  trackingUrl: 'https://track.shiprocket.in/tracking/...'
}
```

## Troubleshooting

**Still getting the same error?**

1. **Verify primary location is set**
   - Go to Settings → Pickup Locations
   - Make sure one location shows as "Primary"
   - If not, click "Set as Primary" button

2. **Check location details**
   - Location must have:
     - Valid address
     - Valid city
     - Valid state
     - Valid pincode
     - Phone number
     - Email

3. **Wait a few minutes**
   - Sometimes Shiprocket takes time to sync
   - Wait 5 minutes and try again

4. **Try a different location**
   - If you have multiple locations, try setting a different one as primary
   - Then restart server and test

5. **Contact Shiprocket Support**
   - If still not working: support@shiprocket.com
   - Provide your account email and error message

## Current Status

✅ API Token: Working
✅ Authentication: Working
❌ Pickup Location: Needs to be set as primary

**Next Action**: Set primary pickup location in Shiprocket dashboard, then restart server and test again.

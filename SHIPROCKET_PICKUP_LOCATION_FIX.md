# Shiprocket Pickup Location Error Fix

## The Problem

Even though your pickup location is set as primary in the dashboard, Shiprocket API is still saying:
```
Please select a pickup location as primary location from settings.
```

This is likely a **caching or sync issue** on Shiprocket's side.

## Solution: Try Different Pickup Location IDs

The pickup location ID might not be `1`. Let's try different IDs:

### Step 1: Update .env with Different ID

Try each of these in order:

**Option 1: Try ID 2**
```
SHIPROCKET_PICKUP_LOCATION_ID=2
```

**Option 2: Try ID 3**
```
SHIPROCKET_PICKUP_LOCATION_ID=3
```

**Option 3: Try ID 0**
```
SHIPROCKET_PICKUP_LOCATION_ID=0
```

### Step 2: For Each ID

1. Update `.env` with the ID
2. Restart dev server: `npm run dev`
3. Create a test order
4. Check console for success or error
5. If still fails, try next ID

### Step 3: When It Works

Once you find the correct ID:
- Keep it in `.env`
- Orders will create successfully
- Shipments will be created automatically

## Alternative: Contact Shiprocket Support

If none of the IDs work:

1. **Email Shiprocket Support**
   - Email: support@shiprocket.com
   - Subject: "Pickup Location API Error - 400 Bad Request"
   - Include:
     - Your account email
     - Error message
     - Screenshot of your pickup location settings

2. **They can help you:**
   - Verify your pickup location is properly configured
   - Provide the correct pickup location ID for API
   - Check for any account restrictions

## Current Workaround

For now, orders are still being created successfully (200 status). The shipment creation just fails, but:
- ✅ Orders are saved to database
- ✅ Customers can see their orders
- ✅ You can manually create shipments in Shiprocket dashboard
- ❌ Automatic shipment creation not working yet

## Expected Timeline

Once pickup location ID is fixed:
- Orders create: ✅
- Shipments create automatically: ✅
- Tracking numbers generated: ✅
- Customers can track: ✅

## Testing Steps

1. Go to `http://localhost:3000`
2. Add product to cart
3. Complete checkout
4. Check server console
5. Look for either:
   - ✅ `Shiprocket shipment result: { success: true, ... }`
   - ❌ `Please select a pickup location...` (try next ID)

---

**Status**: Investigating pickup location ID
**Next Action**: Try different pickup location IDs in .env

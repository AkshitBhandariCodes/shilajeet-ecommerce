# Delhivery 'end_date' Error Fix

## Problem
Shipments failing with: `'NoneType' object has no attribute 'end_date'`

This error occurs when the warehouse's return address configuration is incomplete or missing working days/hours setup.

## Solution

### Step 1: Update Warehouse Configuration in Delhivery Dashboard

1. **Log in to Delhivery One Panel**
   - URL: https://one.delhivery.com

2. **Go to Pickup Locations**
   - Settings → Pickup Locations
   - Click "Edit" on "Agnishila Warehouse"

3. **Verify/Update Return Address**
   - Return Address: `Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area`
   - Return City: `Delhi`
   - Return State: `Delhi`
   - Return Pincode: `110035`
   - Return Country: `India`

4. **Set Working Days**
   - Check all days: Monday through Saturday (or your working days)
   - Set Default Pickup Slot: Evening 14:00:00 - 18:00:00
   - Save Changes

5. **Save and Wait**
   - Click "Save Changes"
   - Wait 5-10 minutes for changes to sync

### Step 2: Update Warehouse via API (Optional)

```bash
curl -X POST http://localhost:3000/api/delhivery/warehouse-fix \
  -H "Content-Type: application/json"
```

### Step 3: Test Shipment Creation

```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "shipment"}'
```

Should return waybill number.

### Step 4: Create Test Order

Place a test order on your website. It should now work.

## What Was Fixed

1. **Enhanced Error Handling** - Better error messages from Delhivery
2. **Improved Payload Validation** - Checks for waybill in response
3. **Better Fallback Values** - Ensures all required fields have values
4. **Warehouse Fix Endpoint** - API to update warehouse configuration

## Key Points

⚠️ **Warehouse Name Must Match Exactly**
- Delhivery: `Agnishila Warehouse` (with space)
- `.env`: `DELHIVERY_WAREHOUSE_NAME=Agnishila Warehouse`

⚠️ **Return Address is Required**
- Must be set in Delhivery dashboard
- Must have working days configured
- Must have pickup slot set

⚠️ **Working Days Must Be Set**
- At least one day must be selected
- Pickup slot must be configured
- This is what causes the 'end_date' error

## Troubleshooting

### Still Getting 'end_date' Error
1. Log in to Delhivery dashboard
2. Edit warehouse
3. Scroll down to "Working Days"
4. Ensure at least one day is checked
5. Ensure "Default Pickup Slot" is set
6. Save changes
7. Wait 10 minutes
8. Try again

### Warehouse Not Showing Changes
1. Refresh Delhivery dashboard
2. Log out and log back in
3. Wait 10 minutes for sync
4. Try creating shipment again

### Still Failing After Changes
1. Check server logs for detailed error
2. Verify all environment variables are correct
3. Test with API endpoint
4. Contact Delhivery support with error message

## Environment Variables (Verify)

```env
DELHIVERY_WAREHOUSE_NAME=Agnishila Warehouse
DELHIVERY_WAREHOUSE_PHONE=8448893545
DELHIVERY_WAREHOUSE_ADDRESS=Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
DELHIVERY_WAREHOUSE_CITY=Delhi
DELHIVERY_WAREHOUSE_STATE=Delhi
DELHIVERY_WAREHOUSE_PIN=110035
DELHIVERY_RETURN_ADDRESS=Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
DELHIVERY_RETURN_CITY=Delhi
DELHIVERY_RETURN_STATE=Delhi
DELHIVERY_RETURN_PIN=110035
DELHIVERY_RETURN_PHONE=8448893545
SELLER_NAME=NK INTERNATIONAL
SELLER_GST_TIN=07TACPB3424K1Z9
DELHIVERY_API_TOKEN=657916e717816069e427826ab385b665a245088a
DELHIVERY_ENVIRONMENT=staging
```

## Testing Steps

1. **Update warehouse in Delhivery dashboard** (most important)
2. **Wait 10 minutes** for changes to sync
3. **Test shipment creation**:
   ```bash
   curl -X POST http://localhost:3000/api/delhivery/test \
     -H "Content-Type: application/json" \
     -d '{"testType": "shipment"}'
   ```
4. **Create test order** on website
5. **Verify waybill** is generated
6. **Check Delhivery dashboard** for order

## Success Indicators

✅ Warehouse shows in Delhivery dashboard
✅ Working days are configured
✅ Pickup slot is set
✅ Shipment test returns waybill
✅ Order creates with waybill
✅ Order appears in Delhivery dashboard

## Files Updated

- `lib/delhivery.ts` - Enhanced error handling and validation
- `app/api/delhivery/warehouse-fix/route.ts` - Warehouse update endpoint

## Next Steps

1. Update warehouse in Delhivery dashboard (most important!)
2. Set working days and pickup slot
3. Wait 10 minutes
4. Test shipment creation
5. Create real order

## Support

If issue persists:
1. Check Delhivery dashboard warehouse configuration
2. Verify working days are set
3. Verify pickup slot is configured
4. Check server logs for error details
5. Contact Delhivery support: tech.admin@delhivery.com

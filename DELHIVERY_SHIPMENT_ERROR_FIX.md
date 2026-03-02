# Delhivery Shipment Error Fix

## Error
```
Package creation API error. Package might be saved. 
Error message is 'NoneType' object has no attribute 'end_date'
```

## Root Cause
The warehouse was not properly registered in Delhivery with all required fields. Delhivery requires warehouses to have complete configuration including return address details.

## Solution

### 1. Register Warehouse

**Using API**:
```bash
curl -X POST http://localhost:3000/api/delhivery/warehouse \
  -H "Content-Type: application/json" \
  -d '{"action": "register"}'
```

**Using GET**:
```bash
curl "http://localhost:3000/api/delhivery/warehouse?action=register"
```

### 2. Verify in Delhivery Dashboard
1. Log in to https://one.delhivery.com
2. Go to Settings → Pickup Locations
3. Verify warehouse `Agnishila_Warehouse` appears with:
   - City: Delhi
   - Pincode: 110035
   - Address: Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area

### 3. Test Shipment Creation
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "shipment"}'
```

## Changes Made

### 1. Added Warehouse Methods to Delhivery Service
**File**: `lib/delhivery.ts`

New methods:
- `registerWarehouse()` - Register warehouse with all required fields
- `updateWarehouse()` - Update existing warehouse

### 2. Created Warehouse API Endpoint
**File**: `app/api/delhivery/warehouse/route.ts`

Endpoints:
- `POST /api/delhivery/warehouse` - Register/update warehouse
- `GET /api/delhivery/warehouse?action=register` - Register warehouse

### 3. Enhanced Shipment Payload
**File**: `lib/delhivery.ts`

Added missing fields:
- `seller_gst_tin` - GST number
- Better handling of return address fields
- Proper fallback values for all fields

## Required Environment Variables

```env
# Warehouse
DELHIVERY_WAREHOUSE_NAME=Agnishila_Warehouse
DELHIVERY_WAREHOUSE_PHONE=8448893545
DELHIVERY_WAREHOUSE_ADDRESS=Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
DELHIVERY_WAREHOUSE_CITY=Delhi
DELHIVERY_WAREHOUSE_STATE=Delhi
DELHIVERY_WAREHOUSE_PIN=110035
DELHIVERY_WAREHOUSE_COUNTRY=India
DELHIVERY_WAREHOUSE_EMAIL=info@agnishila.in

# Return Address
DELHIVERY_RETURN_ADDRESS=Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
DELHIVERY_RETURN_CITY=Delhi
DELHIVERY_RETURN_STATE=Delhi
DELHIVERY_RETURN_PIN=110035
DELHIVERY_RETURN_COUNTRY=India
DELHIVERY_RETURN_PHONE=8448893545

# Seller
SELLER_NAME=NK INTERNATIONAL
SELLER_GST_TIN=07TACPB3424K1Z9

# API
DELHIVERY_API_TOKEN=your_token
DELHIVERY_ENVIRONMENT=staging
```

## Testing Steps

### 1. Check Configuration
```bash
curl http://localhost:3000/api/delhivery/test?type=config
```

### 2. Register Warehouse
```bash
curl -X POST http://localhost:3000/api/delhivery/warehouse \
  -H "Content-Type: application/json" \
  -d '{"action": "register"}'
```

### 3. Verify Warehouse in Dashboard
- Log in to Delhivery One Panel
- Check Settings → Pickup Locations
- Verify warehouse appears

### 4. Test Shipment
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "shipment"}'
```

### 5. Create Real Order
- Place order on website
- Check if waybill is generated
- Verify order appears in Delhivery dashboard

## Troubleshooting

### Still Getting Error
1. Verify warehouse is registered in Delhivery dashboard
2. Check all environment variables are set correctly
3. Verify API token is valid
4. Check warehouse name matches exactly (case-sensitive)
5. Ensure return address is set

### Warehouse Not Appearing
1. Wait a few minutes for changes to sync
2. Refresh Delhivery dashboard
3. Try registering again
4. Check API response for errors

### Shipment Still Fails
1. Check pincode is serviceable
2. Verify all required fields are present
3. Check server logs for detailed error
4. Contact Delhivery support with error message

## Files Modified/Created

### Created
- `app/api/delhivery/warehouse/route.ts` - Warehouse registration endpoint
- `DELHIVERY_WAREHOUSE_SETUP.md` - Warehouse setup guide
- `DELHIVERY_SHIPMENT_ERROR_FIX.md` - This file

### Modified
- `lib/delhivery.ts` - Added warehouse methods, enhanced payload

## Next Steps

1. Register warehouse using API
2. Verify in Delhivery dashboard
3. Test shipment creation
4. Create real order
5. Verify waybill is generated
6. Check order in Delhivery dashboard

## Success Indicators

✓ Warehouse appears in Delhivery dashboard
✓ Shipment creation returns waybill
✓ Order appears in Delhivery dashboard
✓ Tracking URL is generated
✓ Expected delivery date is calculated

## Support

For detailed information:
- See `DELHIVERY_WAREHOUSE_SETUP.md` for warehouse setup
- See `DELHIVERY_TROUBLESHOOTING.md` for troubleshooting
- Check server logs for error messages
- Contact Delhivery support if needed

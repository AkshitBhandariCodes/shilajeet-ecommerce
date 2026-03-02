# Delhivery Quick Fix

## Problem
Shipments failing: `'NoneType' object has no attribute 'end_date'`

## Quick Fix (2 Steps)

### Step 1: Register Warehouse
```bash
curl -X POST http://localhost:3000/api/delhivery/warehouse \
  -H "Content-Type: application/json" \
  -d '{"action": "register"}'
```

### Step 2: Verify in Delhivery Dashboard
1. Go to https://one.delhivery.com
2. Settings → Pickup Locations
3. Check `Agnishila_Warehouse` appears

## Done!
Try creating an order now. Shipments should work.

## If Still Not Working

### Check Configuration
```bash
curl http://localhost:3000/api/delhivery/test?type=config
```

### Test Shipment
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "shipment"}'
```

### Verify Environment Variables
```env
DELHIVERY_WAREHOUSE_NAME=Agnishila_Warehouse
DELHIVERY_WAREHOUSE_PIN=110035
DELHIVERY_WAREHOUSE_CITY=Delhi
DELHIVERY_WAREHOUSE_STATE=Delhi
DELHIVERY_WAREHOUSE_ADDRESS=Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
DELHIVERY_RETURN_ADDRESS=Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
DELHIVERY_RETURN_CITY=Delhi
DELHIVERY_RETURN_STATE=Delhi
DELHIVERY_RETURN_PIN=110035
SELLER_NAME=NK INTERNATIONAL
SELLER_GST_TIN=07TACPB3424K1Z9
DELHIVERY_API_TOKEN=your_token
DELHIVERY_ENVIRONMENT=staging
```

## See Also
- `DELHIVERY_WAREHOUSE_SETUP.md` - Detailed setup
- `DELHIVERY_TROUBLESHOOTING.md` - Troubleshooting
- `DELHIVERY_SHIPMENT_ERROR_FIX.md` - Error details

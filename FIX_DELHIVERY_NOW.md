# Fix Delhivery Shipment Error - NOW

## The Problem
Orders are created but shipments fail with: `'NoneType' object has no attribute 'end_date'`

This means warehouse is not registered in Delhivery.

## The Fix (Choose One)

### Option A: One Command (Easiest)
```bash
curl -X POST http://localhost:3000/api/delhivery/warehouse \
  -H "Content-Type: application/json" \
  -d '{"action": "register"}'
```

Wait for response showing success.

### Option B: Manual in Delhivery Dashboard
1. Go to https://one.delhivery.com
2. Settings → Pickup Locations → Add Warehouse
3. Fill in:
   - Name: `Agnishila_Warehouse`
   - Phone: `8448893545`
   - Address: `Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area`
   - City: `Delhi`
   - State: `Delhi`
   - Pincode: `110035`
   - Return Address: Same as above
4. Save

### Option C: Direct API Call
```bash
curl -X POST https://staging-express.delhivery.com/api/backend/clientwarehouse/create/ \
  -H "Authorization: Token 657916e717816069e427826ab385b665a245088a" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agnishila_Warehouse",
    "phone": "8448893545",
    "address": "Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area",
    "city": "Delhi",
    "pin": "110035",
    "country": "India",
    "return_address": "Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area",
    "return_city": "Delhi",
    "return_pin": "110035",
    "return_state": "Delhi",
    "return_country": "India"
  }'
```

## Verify It Worked

### Check Warehouse Registered
```bash
curl http://localhost:3000/api/delhivery/test?type=config
```

### Test Shipment
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "shipment"}'
```

Should return waybill number.

### Check Dashboard
1. Log in to https://one.delhivery.com
2. Settings → Pickup Locations
3. Look for `Agnishila_Warehouse`

## Then Try Creating Order

Place a test order on your website. It should now:
- Create order ✓
- Generate waybill ✓
- Show in Delhivery dashboard ✓

## If Still Not Working

1. Wait 5-10 minutes for changes to sync
2. Check warehouse name is exactly `Agnishila_Warehouse` (case-sensitive)
3. Verify return address is set
4. Check API token is valid
5. See `DELHIVERY_WAREHOUSE_REGISTRATION_STEPS.md` for detailed help

## That's It!

Once warehouse is registered, shipments will work automatically.

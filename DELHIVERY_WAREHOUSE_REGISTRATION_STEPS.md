# Delhivery Warehouse Registration - Step by Step

## Current Issue
Shipments are failing because warehouse `Agnishila_Warehouse` is not registered in Delhivery system.

## Solution: Register Warehouse in Delhivery

### Option 1: Using Our API (Recommended)

```bash
curl -X POST http://localhost:3000/api/delhivery/warehouse \
  -H "Content-Type: application/json" \
  -d '{"action": "register"}'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Warehouse registered successfully",
  "data": {
    "status": "success"
  }
}
```

### Option 2: Manual Registration via Delhivery Dashboard

1. **Log in to Delhivery One Panel**
   - URL: https://one.delhivery.com
   - Use your Delhivery account credentials

2. **Navigate to Warehouse Settings**
   - Click on Settings (gear icon)
   - Select "Pickup Locations" or "Warehouses"
   - Click "Add New Warehouse" or "Create Warehouse"

3. **Fill in Warehouse Details**
   ```
   Warehouse Name: Agnishila_Warehouse
   Contact Person: Vivek
   Phone: 8448893545
   Email: info@agnishila.in
   Address: Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
   City: Delhi
   State: Delhi
   Pincode: 110035
   Country: India
   ```

4. **Fill in Return Address**
   ```
   Return Address: Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
   Return City: Delhi
   Return State: Delhi
   Return Pincode: 110035
   Return Country: India
   ```

5. **Save Warehouse**
   - Click "Save" or "Create"
   - Wait for confirmation

### Option 3: Using Delhivery API Directly

```bash
curl -X POST https://staging-express.delhivery.com/api/backend/clientwarehouse/create/ \
  -H "Authorization: Token 657916e717816069e427826ab385b665a245088a" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agnishila_Warehouse",
    "registered_name": "NK INTERNATIONAL",
    "phone": "8448893545",
    "email": "info@agnishila.in",
    "address": "Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area",
    "city": "Delhi",
    "pin": "110035",
    "country": "India",
    "return_address": "Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area",
    "return_pin": "110035",
    "return_city": "Delhi",
    "return_state": "Delhi",
    "return_country": "India"
  }'
```

## Verification Steps

### 1. Check if Warehouse is Registered
```bash
# This will show if warehouse exists in Delhivery
curl http://localhost:3000/api/delhivery/test?type=config
```

### 2. Verify in Delhivery Dashboard
1. Log in to https://one.delhivery.com
2. Go to Settings → Pickup Locations
3. Look for "Agnishila_Warehouse" in the list
4. Verify all details are correct

### 3. Test Shipment Creation
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "shipment"}'
```

Should return:
```json
{
  "success": true,
  "testType": "shipment",
  "result": {
    "success": true,
    "waybill": "1234567890123",
    "trackingUrl": "https://track.delhivery.com/tracking/1234567890123"
  }
}
```

## Important Notes

⚠️ **Warehouse Name is Case-Sensitive**
- Must be exactly: `Agnishila_Warehouse`
- Not: `agnishila_warehouse` or `AGNISHILA_WAREHOUSE`

⚠️ **Warehouse Name Must be Unique**
- Cannot have duplicate warehouse names
- If already exists, use existing name

⚠️ **Return Address is Required**
- Delhivery requires return address for all warehouses
- Can be same as warehouse address

⚠️ **Changes May Take Time**
- After registration, wait 5-10 minutes
- Changes may not appear immediately in dashboard
- Try creating shipment after waiting

## Troubleshooting

### Warehouse Already Exists
If you get error "Warehouse already exists":
1. Log in to Delhivery dashboard
2. Find existing warehouse
3. Update it with correct details
4. Use existing warehouse name in `.env`

### Still Getting 'end_date' Error
1. Verify warehouse appears in Delhivery dashboard
2. Check warehouse has return address set
3. Wait 10 minutes for changes to sync
4. Try creating shipment again

### Warehouse Not Appearing in Dashboard
1. Check API response for errors
2. Verify all required fields are filled
3. Try registering again
4. Contact Delhivery support

## Next Steps

1. **Register Warehouse** (choose one option above)
2. **Verify in Dashboard** (check warehouse appears)
3. **Test Shipment** (run test command)
4. **Create Order** (place test order)
5. **Check Waybill** (verify waybill is generated)

## Success Indicators

✅ Warehouse appears in Delhivery dashboard
✅ Shipment test returns waybill
✅ Order creates successfully
✅ Waybill is generated
✅ Order appears in Delhivery dashboard

## Support

If registration fails:
1. Check API token is valid
2. Verify all environment variables
3. Check warehouse name is unique
4. Ensure return address is set
5. Contact Delhivery support: tech.admin@delhivery.com

## Environment Variables (Verify These Are Set)

```env
DELHIVERY_API_TOKEN=657916e717816069e427826ab385b665a245088a
DELHIVERY_ENVIRONMENT=staging
DELHIVERY_WAREHOUSE_NAME=Agnishila_Warehouse
DELHIVERY_WAREHOUSE_PHONE=8448893545
DELHIVERY_WAREHOUSE_ADDRESS=Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
DELHIVERY_WAREHOUSE_CITY=Delhi
DELHIVERY_WAREHOUSE_STATE=Delhi
DELHIVERY_WAREHOUSE_PIN=110035
DELHIVERY_WAREHOUSE_COUNTRY=India
DELHIVERY_WAREHOUSE_EMAIL=info@agnishila.in
DELHIVERY_RETURN_ADDRESS=Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
DELHIVERY_RETURN_CITY=Delhi
DELHIVERY_RETURN_STATE=Delhi
DELHIVERY_RETURN_PIN=110035
DELHIVERY_RETURN_COUNTRY=India
SELLER_NAME=NK INTERNATIONAL
SELLER_GST_TIN=07TACPB3424K1Z9
```

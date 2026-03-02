# Delhivery Warehouse Setup Guide

## Problem
Shipments were failing with error: `'NoneType' object has no attribute 'end_date'`

This error occurs when the warehouse is not properly registered in Delhivery with all required fields.

## Solution

### Step 1: Register Warehouse in Delhivery

#### Using API Endpoint
```bash
curl -X POST http://localhost:3000/api/delhivery/warehouse \
  -H "Content-Type: application/json" \
  -d '{"action": "register"}'
```

#### Using GET Request
```bash
curl "http://localhost:3000/api/delhivery/warehouse?action=register"
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Warehouse registered successfully",
  "data": {
    "status": "success",
    "message": "Warehouse created/updated successfully"
  }
}
```

### Step 2: Verify Warehouse Registration

Log in to Delhivery One Panel:
1. Go to `https://one.delhivery.com`
2. Navigate to Settings → Pickup Locations
3. Verify warehouse appears with correct details:
   - Name: `Agnishila_Warehouse`
   - City: `Delhi`
   - Pincode: `110035`
   - Address: `Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area`

### Step 3: Update Warehouse (if needed)

```bash
curl -X POST http://localhost:3000/api/delhivery/warehouse \
  -H "Content-Type: application/json" \
  -d '{"action": "update"}'
```

## Required Environment Variables

Ensure these are set in `.env`:

```env
# Warehouse Details
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

# Seller Details
SELLER_NAME=NK INTERNATIONAL
SELLER_GST_TIN=07TACPB3424K1Z9
SELLER_ADDRESS=Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area

# Delhivery API
DELHIVERY_API_TOKEN=your_token_here
DELHIVERY_ENVIRONMENT=staging
```

## Warehouse Registration Fields

### Required Fields
- **name**: Warehouse name (must be unique, case-sensitive)
- **phone**: Contact phone number
- **address**: Complete warehouse address
- **city**: City name
- **pin**: Pincode (6 digits)
- **country**: Country name

### Optional Fields
- **registered_name**: Your registered account name
- **email**: Contact email
- **return_address**: Return address (can be same as warehouse)
- **return_city**: Return city
- **return_state**: Return state
- **return_pin**: Return pincode
- **return_country**: Return country

## Troubleshooting

### Error: 'NoneType' object has no attribute 'end_date'
**Cause**: Warehouse not registered or missing required fields

**Solution**:
1. Register warehouse using API endpoint
2. Verify all required fields are set in `.env`
3. Check warehouse appears in Delhivery dashboard
4. Try creating shipment again

### Error: Warehouse not found
**Cause**: Warehouse name doesn't match registered name

**Solution**:
1. Check warehouse name in Delhivery dashboard
2. Update `DELHIVERY_WAREHOUSE_NAME` to match exactly
3. Re-register warehouse

### Error: Invalid pincode
**Cause**: Pincode not serviceable or invalid format

**Solution**:
1. Verify pincode is 6 digits
2. Check if pincode is serviceable by Delhivery
3. Use valid Indian pincode

### Error: Unauthorized
**Cause**: Invalid API token

**Solution**:
1. Verify `DELHIVERY_API_TOKEN` is correct
2. Check token is for correct environment (staging/production)
3. Regenerate token if expired

## Testing Warehouse Setup

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

### 3. Check Pincode Serviceability
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "pincode", "data": {"pincode": "110001"}}'
```

### 4. Create Test Shipment
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "shipment"}'
```

## Warehouse Registration API

### Register Warehouse
```
POST /api/backend/clientwarehouse/create/
```

**Payload**:
```json
{
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
}
```

### Update Warehouse
```
POST /api/backend/clientwarehouse/edit/
```

**Payload**:
```json
{
  "name": "Agnishila_Warehouse",
  "phone": "8448893545",
  "address": "Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area",
  "pin": "110035"
}
```

## Next Steps

1. Register warehouse using API endpoint
2. Verify warehouse in Delhivery dashboard
3. Test shipment creation
4. Create actual order and verify waybill is generated
5. Check order appears in Delhivery dashboard

## Support

If warehouse registration fails:
1. Check all environment variables are set
2. Verify API token is valid
3. Check warehouse name is unique
4. Ensure all required fields are present
5. Contact Delhivery support if issue persists

## Important Notes

- Warehouse name is **case-sensitive**
- Warehouse name must be **unique** across your account
- Pincode must be **6 digits**
- Phone number should be **10 digits**
- Return address can be same as warehouse address
- Changes may take a few minutes to reflect in dashboard

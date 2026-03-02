# Delhivery Integration Troubleshooting Guide

## Issue: Order Not Showing on Delhivery Dashboard

### Root Causes & Solutions

#### 1. **Incorrect API Payload Format**
**Problem**: Delhivery API expects URL-encoded form data, not JSON.

**Solution**: 
- Changed from `Content-Type: application/json` to `application/x-www-form-urlencoded`
- Payload must be sent as: `format=json&data={...JSON...}`

**Check**: Look at `lib/delhivery.ts` - `createShipment()` method uses `URLSearchParams`

#### 2. **Missing or Invalid Warehouse Name**
**Problem**: Warehouse name must match exactly (case-sensitive) with registered warehouse in Delhivery.

**Solution**:
- Verify warehouse name in `.env`: `DELHIVERY_WAREHOUSE_NAME=Agnishila_Warehouse`
- Must match exactly with Delhivery dashboard registration
- Check for spaces and special characters

**Test**:
```bash
curl http://localhost:3000/api/delhivery/test?type=config
```

#### 3. **Invalid Pincode**
**Problem**: Destination pincode not serviceable by Delhivery.

**Solution**:
- Check if pincode is serviceable before creating shipment
- Use pincode serviceability API

**Test**:
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "pincode", "data": {"pincode": "110001"}}'
```

#### 4. **Missing Required Fields**
**Problem**: Delhivery requires certain fields to be present.

**Required Fields**:
- `name` - Customer name
- `order` - Order ID (must be unique)
- `phone` - Customer phone (as array)
- `add` - Delivery address
- `pin` - Pincode (as integer)
- `city` - City name
- `state` - State name
- `country` - Country (default: India)
- `payment_mode` - COD or Prepaid
- `pickup_location.name` - Warehouse name

**Check**: Verify all fields are being sent in `app/api/orders/route.ts`

#### 5. **Invalid API Token**
**Problem**: Delhivery API token is incorrect or expired.

**Solution**:
- Verify token in `.env`: `DELHIVERY_API_TOKEN=...`
- Token should be 40 characters long
- Check if token is for staging or production environment

**Test**:
```bash
curl http://localhost:3000/api/delhivery/test?type=config
# Check if hasApiToken is true
```

#### 6. **Wrong Environment**
**Problem**: Using staging token with production URL or vice versa.

**Solution**:
- For testing: Use `DELHIVERY_ENVIRONMENT=staging`
- For production: Use `DELHIVERY_ENVIRONMENT=production`
- Staging URL: `https://staging-express.delhivery.com`
- Production URL: `https://track.delhivery.com`

#### 7. **Duplicate Order ID**
**Problem**: Order ID already exists in Delhivery system.

**Solution**:
- Order IDs must be unique
- Current format: `AG{timestamp}{random}`
- If retrying, use different order ID

## Testing Delhivery Integration

### 1. Check Configuration
```bash
curl http://localhost:3000/api/delhivery/test?type=config
```

**Expected Response**:
```json
{
  "success": true,
  "config": {
    "baseUrl": "https://staging-express.delhivery.com",
    "environment": "staging",
    "warehouseName": "Agnishila_Warehouse",
    "warehousePin": "110035",
    "hasApiToken": true
  }
}
```

### 2. Test Pincode Serviceability
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "pincode",
    "data": {"pincode": "110001"}
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "testType": "pincode",
  "result": {
    "success": true,
    "isServiceable": true,
    "data": [...]
  }
}
```

### 3. Test TAT Fetch
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "tat",
    "data": {
      "originPin": "110035",
      "destinationPin": "110001"
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "testType": "tat",
  "result": {
    "success": true,
    "data": {
      "tat": 5,
      "expected_delivery_date": "2024-01-25"
    }
  }
}
```

### 4. Test Shipment Creation
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "shipment",
    "data": {
      "orderId": "TEST_'$(date +%s)'",
      "customerName": "Test User",
      "customerPhone": "9999999999",
      "customerEmail": "test@example.com",
      "deliveryAddress": "Test Address",
      "deliveryCity": "Delhi",
      "deliveryState": "Delhi",
      "deliveryPin": "110001",
      "weight": 0.5,
      "paymentMode": "COD",
      "codAmount": 100,
      "productsDesc": "Test Product",
      "quantity": "1"
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "testType": "shipment",
  "result": {
    "success": true,
    "waybill": "1234567890123",
    "shipmentId": "...",
    "trackingUrl": "https://track.delhivery.com/tracking/1234567890123"
  }
}
```

## Common Error Messages

### "Failed to create shipment with Delhivery"
- Check API token validity
- Verify warehouse name matches exactly
- Ensure all required fields are present
- Check if pincode is serviceable

### "Invalid pincode"
- Destination pincode not serviceable
- Use pincode serviceability API to check
- Try with a different pincode

### "Duplicate order ID"
- Order ID already exists
- Use unique order ID
- Check if order was already created

### "Unauthorized"
- API token is invalid or expired
- Check token in `.env`
- Verify token is for correct environment

### "Bad request"
- Missing required fields
- Invalid field values
- Check payload format

## Debugging Steps

### 1. Check Server Logs
Look for console logs in your Next.js server:
```
Creating Delhivery shipment with data: {...}
Delhivery response: {...}
Delhivery shipment creation error: {...}
```

### 2. Verify Environment Variables
```bash
# Check if variables are set
echo $DELHIVERY_API_TOKEN
echo $DELHIVERY_WAREHOUSE_NAME
echo $DELHIVERY_ENVIRONMENT
```

### 3. Test with cURL
Use the test endpoint to verify each component works independently.

### 4. Check Delhivery Dashboard
- Log in to Delhivery One Panel
- Check if warehouse is registered
- Verify warehouse details match `.env`
- Check if orders appear in dashboard

### 5. Monitor Network Requests
- Open browser DevTools
- Check Network tab for API calls
- Look for failed requests to Delhivery
- Check response status and body

## Quick Checklist

- [ ] API token is valid and not expired
- [ ] Environment is set correctly (staging/production)
- [ ] Warehouse name matches exactly (case-sensitive)
- [ ] Warehouse is registered in Delhivery
- [ ] Destination pincode is serviceable
- [ ] Order ID is unique
- [ ] All required fields are present
- [ ] Payload format is URL-encoded
- [ ] Phone number is in array format
- [ ] Pincode is integer, not string

## Next Steps

1. Run configuration test: `curl http://localhost:3000/api/delhivery/test?type=config`
2. Test pincode serviceability for your destination
3. Test TAT fetch to verify delivery estimates
4. Create test shipment using test endpoint
5. Verify shipment appears in Delhivery dashboard
6. Create actual order and verify it shows up

## Support

If issues persist:
1. Check Delhivery API documentation
2. Verify all environment variables
3. Test each component independently
4. Check server logs for detailed error messages
5. Contact Delhivery support with waybill number

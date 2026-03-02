# Delhivery to Shiprocket Migration Guide

## Overview
This guide explains how to migrate from Delhivery to Shiprocket for shipment management.

## What Changed

### Files Modified
1. **lib/shiprocket.ts** - New Shiprocket service (replaces delhivery.ts)
2. **.env** - Updated configuration
3. **app/api/orders/route.ts** - Uses Shiprocket instead of Delhivery
4. **app/api/shipments/delhivery/create/route.ts** - Now uses Shiprocket
5. **app/api/shipments/delhivery/cancel/route.ts** - Now uses Shiprocket
6. **app/api/shipments/delhivery/track/route.ts** - Now uses Shiprocket
7. **app/api/shipments/track/route.ts** - Now uses Shiprocket

### Key Differences

| Feature | Delhivery | Shiprocket |
|---------|-----------|-----------|
| API Token | DELHIVERY_API_TOKEN | SHIPROCKET_API_TOKEN |
| Base URL | staging-express.delhivery.com | apiv2.shiprocket.in/v1/external |
| Shipment Creation | /api/cmu/create.json | /orders/create/adhoc |
| Tracking | /api/v1/packages/json/ | /shipments/track/ |
| Cancellation | /api/p/edit | /shipments/cancel/ |
| Warehouse Setup | Manual on one.delhivery.com | Pickup Location ID in Shiprocket |

## Setup Instructions

### 1. Get Shiprocket API Token

1. Go to https://www.shiprocket.in/
2. Sign up or log in to your account
3. Go to **Settings → API Keys**
4. Copy your API token

### 2. Get Pickup Location ID

1. In Shiprocket dashboard, go to **Settings → Pickup Locations**
2. Create or select a pickup location
3. Note the **Pickup Location ID** (usually 1 for first location)

### 3. Update .env File

```env
# Shiprocket Configuration
SHIPROCKET_API_TOKEN=your_api_token_here
SHIPROCKET_PICKUP_LOCATION_ID=1
SHIPROCKET_WAREHOUSE_NAME=Agnishila Warehouse
SHIPROCKET_WAREHOUSE_ADDRESS=Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area
SHIPROCKET_WAREHOUSE_CITY=Delhi
SHIPROCKET_WAREHOUSE_STATE=Delhi
SHIPROCKET_WAREHOUSE_PIN=110039
SHIPROCKET_WAREHOUSE_PHONE=8448893545
SHIPROCKET_WAREHOUSE_EMAIL=info@agnishila.in
```

### 4. Test the Integration

```bash
# Make sure server is running
npm run dev

# In another terminal, run the test
node scripts/test-shiprocket.js
```

Expected output:
```
🎉 SUCCESS! Shipment Created:
   Waybill: [shipment_id]
   Shipment ID: [id]
   Tracking URL: https://track.shiprocket.in/tracking/[id]
```

## API Endpoints

All endpoints remain the same, but now use Shiprocket:

### Create Shipment
```bash
POST /api/shipments/delhivery/create
{
  "orderId": "AG074492052"
}
```

### Track Shipment
```bash
GET /api/shipments/track?waybill=12345&orderId=AG074492052
```

### Cancel Shipment
```bash
POST /api/shipments/delhivery/cancel
{
  "waybill": "12345"
}
```

## Shiprocket Features

### Supported Payment Modes
- **Prepaid** - Customer pays before delivery
- **COD** - Cash on Delivery

### Supported Shipping Modes
- **Standard** - Regular delivery (5-7 days)
- **Express** - Fast delivery (1-2 days)

### Tracking
- Real-time tracking updates
- Webhook notifications available
- Multiple courier options

## Troubleshooting

### Error: "Invalid API Token"
- Verify token in .env is correct
- Check token hasn't expired
- Generate new token from Shiprocket dashboard

### Error: "Pickup Location Not Found"
- Verify SHIPROCKET_PICKUP_LOCATION_ID is correct
- Check location exists in Shiprocket dashboard
- Default is usually 1

### Error: "Pincode Not Serviceable"
- Check if destination pincode is serviceable
- Use Shiprocket's pincode checker
- Some pincodes may not be covered

### Shipment Not Created
- Check order details are complete
- Verify customer address is valid
- Check weight is specified
- Ensure payment mode is valid

## Rollback to Delhivery

If you need to rollback:

1. Revert the changes to use `delhiveryService` instead of `shiprocketService`
2. Update .env with Delhivery configuration
3. Restart the server

## Support

For Shiprocket support:
- Website: https://www.shiprocket.in/
- Email: support@shiprocket.in
- Phone: +91-9876543210

## Next Steps

1. ✅ Update .env with Shiprocket credentials
2. ✅ Test shipment creation with test-shiprocket.js
3. ✅ Create a test order to verify end-to-end flow
4. ✅ Monitor shipments in Shiprocket dashboard
5. ✅ Set up webhook notifications (optional)

## Notes

- Old Delhivery routes still exist but now use Shiprocket
- No database migration needed
- Existing orders will continue to work
- New orders will use Shiprocket automatically

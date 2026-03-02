# Orders & Delhivery Integration Guide

## Overview
Complete integration of order management with Delhivery shipping provider, including real-time tracking, expected delivery dates, and comprehensive order statistics.

## Fixed Issues

### 1. 404 Error on Order Fetch
**Problem**: GET `/api/orders/[orderId]` was returning 404 because it only looked for `orderNumber` but requests used MongoDB `_id`.

**Solution**: Updated the route to try both:
- First: Find by `orderNumber` (preferred)
- Second: Find by MongoDB `_id` (fallback)

### 2. Missing Expected Delivery Date
**Problem**: Orders didn't have expected delivery dates from Delhivery.

**Solution**: 
- Integrated Delhivery's Expected TAT API
- Fetches TAT (Turn Around Time) based on origin and destination pincodes
- Calculates expected delivery date automatically
- Falls back to 5-day default if API fails

### 3. No Tracking Statistics
**Problem**: No comprehensive order stats or tracking information.

**Solution**: Created new `/api/orders/[orderId]/stats` endpoint that returns:
- Complete order details
- Pricing breakdown
- Shipping information
- Delivery estimates
- Timeline of events
- All tracking scans from Delhivery

## API Endpoints

### Get Order Details
```
GET /api/orders/[orderId]
```
Returns order with latest Delhivery tracking data.

**Response**:
```json
{
  "_id": "...",
  "orderNumber": "AG123456789",
  "status": "shipped",
  "trackingNumber": "...",
  "delhiveryData": {
    "waybill": "...",
    "expectedDeliveryDate": "2024-01-25T00:00:00Z",
    "expectedDeliveryDays": 5,
    "currentStatus": "In Transit",
    "scans": [...]
  },
  "shippingStats": {
    "estimatedDelivery": "2024-01-25T00:00:00Z",
    "lastLocation": "Delhi Hub",
    "attemptCount": 0
  }
}
```

### Get Order Statistics
```
GET /api/orders/[orderId]/stats
```
Returns comprehensive order statistics with all tracking information.

**Response**:
```json
{
  "success": true,
  "stats": {
    "orderId": "...",
    "orderNumber": "AG123456789",
    "status": "shipped",
    "pricing": {
      "subtotal": 1000,
      "tax": 0,
      "shipping": 0,
      "discount": 100,
      "total": 900,
      "couponCode": "SAVE10"
    },
    "delivery": {
      "expectedDeliveryDate": "2024-01-25T00:00:00Z",
      "expectedDeliveryDays": 5,
      "lastLocation": "Delhi Hub",
      "attemptCount": 0
    },
    "timeline": {
      "orderCreated": "2024-01-20T10:00:00Z",
      "pickedDate": "2024-01-20T14:00:00Z",
      "inTransitDate": "2024-01-21T08:00:00Z",
      "deliveredDate": null
    },
    "trackingScans": [
      {
        "status": "Picked",
        "location": "Delhi Warehouse",
        "timestamp": "2024-01-20T14:00:00Z",
        "remarks": "Package picked up"
      }
    ],
    "shippingAddress": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9999999999",
      "address": "123 Main St",
      "city": "Delhi",
      "state": "Delhi",
      "zipCode": "110001",
      "country": "India"
    }
  }
}
```

## Database Schema Updates

### Order Model
Added new fields to track Delhivery data:

```typescript
delhiveryData: {
  waybill: String,
  shipmentId: String,
  trackingUrl: String,
  expectedDeliveryDate: Date,
  expectedDeliveryDays: Number,
  currentStatus: String,
  lastUpdate: Date,
  scans: [{
    status: String,
    location: String,
    timestamp: Date,
    remarks: String,
  }],
}

shippingStats: {
  pickedDate: Date,
  inTransitDate: Date,
  deliveredDate: Date,
  attemptCount: Number,
  lastLocation: String,
  estimatedDelivery: Date,
}
```

## Delhivery Service Enhancements

### New Methods

#### getExpectedTAT()
Fetches expected delivery time from Delhivery.

```typescript
const tatResult = await delhiveryService.getExpectedTAT(
  originPin,      // Warehouse pincode
  destinationPin, // Customer pincode
  'S',            // Shipping mode: 'S' (Surface) or 'E' (Express)
  pickupDate      // Optional: YYYY-MM-DD HH:mm format
);
```

#### checkPincodeServiceability()
Checks if a pincode is serviceable by Delhivery.

```typescript
const result = await delhiveryService.checkPincodeServiceability(pincode);
// Returns: { success: true, isServiceable: true, data: [...] }
```

## Order Creation Flow

1. **Order Created**: User places order
2. **Shipment Created**: Delhivery shipment automatically created
3. **TAT Fetched**: Expected delivery date calculated from Delhivery
4. **Tracking Enabled**: Waybill stored for tracking
5. **Stats Available**: Full order stats accessible via `/stats` endpoint

## Frontend Integration

### Using OrderStatsDisplay Component

```tsx
import OrderStatsDisplay from '@/components/OrderStatsDisplay';

export default function OrderPage({ orderId }: { orderId: string }) {
  return <OrderStatsDisplay orderId={orderId} />;
}
```

The component displays:
- Order header with status
- Pricing breakdown
- Shipping & delivery info
- Timeline of events
- Tracking updates
- Shipping address

## Environment Variables

Required in `.env`:
```
DELHIVERY_API_TOKEN=your_token
DELHIVERY_ENVIRONMENT=staging|production
DELHIVERY_WAREHOUSE_NAME=Agnishila_Warehouse
DELHIVERY_WAREHOUSE_PIN=110035
DELHIVERY_WAREHOUSE_ADDRESS=...
DELHIVERY_WAREHOUSE_CITY=Delhi
DELHIVERY_WAREHOUSE_STATE=Delhi
SELLER_NAME=NK INTERNATIONAL
SELLER_GST_TIN=07TACPB3424K1Z9
```

## Testing

### Test Order Creation with Tracking
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "address": {...},
    "payment": {...}
  }'
```

### Test Order Stats
```bash
curl http://localhost:3000/api/orders/AG123456789/stats \
  -H "Authorization: Bearer token"
```

## Error Handling

- If Delhivery shipment creation fails, order is still created
- If TAT fetch fails, defaults to 5-day delivery
- If tracking fetch fails, cached data is used
- All errors are logged but don't block order flow

## Performance Considerations

- Tracking data is cached in database
- Stats endpoint fetches fresh data from Delhivery on each call
- Consider implementing caching for frequently accessed stats
- Tracking updates can be scheduled via cron jobs

## Future Enhancements

1. Webhook integration for real-time tracking updates
2. SMS/Email notifications on status changes
3. Bulk order tracking dashboard
4. Return shipment management
5. Delhivery RVP (Reverse Pickup) integration
6. Analytics and delivery performance metrics

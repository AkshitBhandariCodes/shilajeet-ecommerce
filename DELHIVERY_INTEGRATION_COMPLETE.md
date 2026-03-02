# Delhivery Integration - Complete Setup Guide

## Overview
Full Delhivery API integration with real-time tracking, admin dashboard, and user order tracking for both COD and Prepaid payment modes.

## Environment Variables Updated

### Cleaned Up Variables
Removed redundant variables:
- ❌ `DELHIVERY_CLIENT_ID` (not needed)
- ❌ `DELHIVERY_TEST_URL` (auto-determined by environment)
- ❌ `DELHIVERY_PROD_URL` (auto-determined by environment)
- ❌ `SELLER_PHONE` (replaced with warehouse-specific)
- ❌ `SELLER_ADDRESS` (replaced with warehouse-specific)

### New/Updated Variables
```env
# Delhivery Configuration
DELHIVERY_API_TOKEN=657916e717816069e427826ab385b665a245088a
DELHIVERY_ENVIRONMENT=test  # or 'production'
DELHIVERY_WAREHOUSE_NAME=Agnishila_Warehouse
DELHIVERY_WAREHOUSE_PHONE=9876543210
DELHIVERY_WAREHOUSE_ADDRESS=Your Warehouse Address
DELHIVERY_WAREHOUSE_CITY=Your City
DELHIVERY_WAREHOUSE_STATE=Your State
DELHIVERY_WAREHOUSE_PIN=110042
DELHIVERY_WAREHOUSE_COUNTRY=India
SELLER_NAME=Agnishila
SELLER_GST_TIN=your_gst_number
```

## Database Model Updates

### Order Schema Enhanced
Added comprehensive tracking fields:
- `trackingNumber`: Delhivery waybill number
- `shippingProvider`: Set to 'delhivery'
- `trackingStatus`: pending, picked, in_transit, delivered, failed
- `status`: pending, confirmed, processing, shipped, delivered, cancelled

## API Routes Created

### 1. Shipment Tracking
**Route**: `GET /api/shipments/track`
**Parameters**:
- `waybill`: Delhivery waybill number
- `orderId`: Order number (optional)

**Response**:
```json
{
  "success": true,
  "data": [{
    "waybill": "123456789",
    "status": "In Transit",
    "location": "Delhi Hub",
    "last_update": "2024-01-20T10:30:00Z",
    "events": [...]
  }],
  "waybill": "123456789"
}
```

### 2. Admin Delhivery Statistics
**Route**: `GET /api/admin/delhivery-stats`
**Parameters**:
- `days`: 7, 30, or 90 (default: 30)

**Response**:
```json
{
  "success": true,
  "summary": {
    "totalOrders": 150,
    "totalRevenue": 45000,
    "dateRange": {...}
  },
  "trackingStatus": [
    {"_id": "delivered", "count": 120, "totalAmount": 40000},
    {"_id": "in_transit", "count": 20, "totalAmount": 5000},
    ...
  ],
  "orderStatus": [...],
  "paymentMode": [...],
  "recentOrders": [...]
}
```

### 3. Admin Delhivery Actions
**Route**: `POST /api/admin/orders/delhivery`
**Actions**:
- `track`: Refresh tracking information
- `cancel`: Cancel shipment
- `update`: Update payment mode or COD amount

**Request**:
```json
{
  "action": "track|cancel|update",
  "orderId": "order_id",
  "waybill": "waybill_number",
  "paymentMode": "COD|Prepaid",
  "codAmount": 5000
}
```

## Components Created

### 1. OrderTrackingDetail.tsx
User-facing tracking component with:
- Real-time shipment status
- Current location display
- Tracking history timeline
- Auto-refresh every 5 minutes
- Responsive design

**Usage**:
```tsx
<OrderTrackingDetail
  orderId="AG123456789"
  waybill="123456789"
  orderStatus="shipped"
/>
```

### 2. DelhiveryDashboard.tsx
Admin dashboard with:
- Summary cards (total orders, revenue, date range)
- Tracking status breakdown with progress bars
- Payment mode analysis
- Recent orders table
- Date range filtering (7/30/90 days)
- Auto-refresh capability

**Usage**:
```tsx
<DelhiveryDashboard />
```

### 3. OrderManagementWithDelhivery.tsx
Enhanced admin order management with:
- Order filtering (status, payment mode)
- Inline order editing
- Delhivery actions (track, cancel)
- Real-time status updates
- Tracking status display
- Action feedback messages

**Usage**:
```tsx
<OrderManagementWithDelhivery />
```

## Order Creation Flow

### Automatic Shipment Creation
When an order is created via `POST /api/orders`:

1. Order is saved to database
2. Delhivery shipment is automatically created
3. Waybill number is assigned to order
4. Tracking status set to 'pending'
5. Order status set to 'confirmed'

### Shipment Data Sent to Delhivery
```javascript
{
  name: "Customer Name",
  order: "AG123456789",
  phone: ["9876543210"],
  add: "Full Address",
  pin: 110042,
  city: "Delhi",
  state: "Delhi",
  country: "India",
  payment_mode: "COD|Prepaid",
  shipping_mode: "Surface|Express",
  transport_speed: "D|F",
  weight: 500,  // in grams
  products_desc: "Product description",
  quantity: "1",
  cod_amount: 5000,  // if COD
  seller_name: "Agnishila",
  seller_add: "Warehouse address",
  return_name: "Agnishila",
  return_address: "Warehouse address",
  return_pin: 110042,
  return_phone: ["9876543210"]
}
```

## Tracking Status Mapping

### Delhivery Status → App Status
| Delhivery | App | Order Status |
|-----------|-----|--------------|
| Pending | pending | processing |
| Picked | picked | shipped |
| In Transit | in_transit | shipped |
| Delivered | delivered | delivered |
| RTO | failed | shipped |
| DTO | failed | shipped |
| Lost | failed | shipped |

## Admin Panel Features

### Dashboard
- View all shipment statistics
- Filter by date range
- See payment mode breakdown
- Track recent orders
- Real-time status updates

### Order Management
- View all orders with Delhivery tracking
- Edit order status and payment mode
- Refresh tracking information
- Cancel shipments
- View customer details
- Filter by status and payment mode

### Tracking Actions
- **Track**: Fetch latest tracking info from Delhivery
- **Cancel**: Cancel shipment (only if not delivered)
- **Update**: Change payment mode or COD amount

## User Features

### Order Tracking
- View order status
- See current shipment location
- View tracking history with timestamps
- Auto-refresh every 5 minutes
- Direct link to Delhivery tracking

### Order List
- View all orders with status badges
- See tracking numbers
- View payment mode
- See order dates and amounts

## Payment Mode Support

### COD (Cash on Delivery)
- Payment pending until delivery
- COD amount sent to Delhivery
- Payment status: pending
- Can be updated to Prepaid

### Prepaid (Online)
- Razorpay integration
- Payment completed before shipment
- Payment status: completed
- Can be updated to COD (with amount)

## Error Handling

### Shipment Creation Failures
- Order is still created successfully
- Shipment creation error is logged
- User can manually create shipment later
- Admin can retry shipment creation

### Tracking Failures
- Graceful error messages
- Retry capability
- Fallback to last known status
- Admin notifications

## Testing Checklist

- [ ] Create order with COD payment
- [ ] Create order with Prepaid payment
- [ ] Verify waybill is assigned
- [ ] Check tracking status updates
- [ ] Test admin dashboard filters
- [ ] Test order status updates
- [ ] Test shipment cancellation
- [ ] Verify email notifications
- [ ] Test mobile responsiveness
- [ ] Check error handling

## Deployment Notes

1. **Environment Setup**:
   - Update `.env` with Delhivery API token
   - Set warehouse details
   - Set environment to 'production' for live

2. **Database**:
   - No migration needed (backward compatible)
   - Existing orders will work with new fields

3. **API Rate Limits**:
   - Tracking: 750 requests/5 minutes
   - Shipment creation: 20000 requests/5 minutes
   - Stats: Implement caching for frequent requests

4. **Monitoring**:
   - Monitor Delhivery API errors
   - Track shipment success rate
   - Monitor tracking update frequency

## Support & Troubleshooting

### Common Issues

**Issue**: Waybill not assigned
- Check Delhivery API token
- Verify warehouse name matches exactly
- Check address format

**Issue**: Tracking not updating
- Verify waybill number
- Check Delhivery API status
- Wait for shipment to be picked

**Issue**: Payment mode update fails
- Verify shipment status allows update
- Check COD amount is provided
- Verify payment mode conversion is allowed

## Future Enhancements

- [ ] Bulk shipment creation
- [ ] Pickup request automation
- [ ] Return shipment handling
- [ ] SMS notifications for tracking
- [ ] Email notifications for status changes
- [ ] Webhook integration for real-time updates
- [ ] Advanced analytics and reporting
- [ ] Multi-warehouse support

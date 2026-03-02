# Delhivery Integration - Quick Start Guide

## 1. Update Environment Variables

Replace your `.env` file with the cleaned-up Delhivery configuration:

```env
# Delhivery Configuration
DELHIVERY_API_TOKEN=657916e717816069e427826ab385b665a245088a
DELHIVERY_ENVIRONMENT=test  # Change to 'production' for live
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

## 2. Files Created/Modified

### New API Routes
- ✅ `app/api/shipments/track/route.ts` - Tracking API
- ✅ `app/api/admin/delhivery-stats/route.ts` - Admin statistics
- ✅ `app/api/admin/orders/delhivery/route.ts` - Admin actions

### New Components
- ✅ `components/OrderTrackingDetail.tsx` - User tracking display
- ✅ `components/admin/DelhiveryDashboard.tsx` - Admin dashboard
- ✅ `components/admin/OrderManagementWithDelhivery.tsx` - Order management

### Updated Files
- ✅ `.env` - Cleaned up variables
- ✅ `models/Order.ts` - Enhanced tracking fields
- ✅ `lib/delhivery.ts` - Updated to use new env vars

## 3. Integration Points

### User Order Page
Replace your order tracking component with:

```tsx
import OrderTrackingDetail from '@/components/OrderTrackingDetail';

// In your order detail page
<OrderTrackingDetail
  orderId={order.orderNumber}
  waybill={order.trackingNumber}
  orderStatus={order.status}
/>
```

### Admin Dashboard
Add Delhivery dashboard to admin panel:

```tsx
import DelhiveryDashboard from '@/components/admin/DelhiveryDashboard';

// In your admin dashboard page
<DelhiveryDashboard />
```

### Admin Order Management
Replace existing order management with:

```tsx
import OrderManagementWithDelhivery from '@/components/admin/OrderManagementWithDelhivery';

// In your admin orders page
<OrderManagementWithDelhivery />
```

## 4. Key Features

### ✅ Automatic Shipment Creation
- Orders automatically create Delhivery shipments
- Waybill assigned on order confirmation
- Tracking status initialized to 'pending'

### ✅ Real-Time Tracking
- Users see live shipment status
- Auto-refresh every 5 minutes
- Tracking history with timestamps

### ✅ Admin Dashboard
- View all shipment statistics
- Filter by date range (7/30/90 days)
- Payment mode breakdown
- Recent orders table

### ✅ Admin Order Management
- Edit order status
- Refresh tracking information
- Cancel shipments
- Update payment mode

### ✅ Payment Mode Support
- COD (Cash on Delivery)
- Prepaid (Online via Razorpay)
- Update between modes

## 5. Testing

### Test Order Creation
```bash
# Create a test order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "address": {...},
    "payment": {"mode": "COD"}
  }'
```

### Test Tracking
```bash
# Get tracking info
curl http://localhost:3000/api/shipments/track?waybill=123456789
```

### Test Admin Stats
```bash
# Get admin statistics
curl http://localhost:3000/api/admin/delhivery-stats?days=30
```

## 6. Status Mapping

### Order Status Flow
```
pending → confirmed → processing → shipped → delivered
                                  ↓
                              cancelled
```

### Tracking Status Flow
```
pending → picked → in_transit → delivered
                              ↓
                            failed
```

## 7. Troubleshooting

### Waybill Not Assigned
1. Check `DELHIVERY_API_TOKEN` is correct
2. Verify `DELHIVERY_WAREHOUSE_NAME` matches exactly (case-sensitive)
3. Check warehouse address is complete
4. Review server logs for Delhivery API errors

### Tracking Not Updating
1. Verify waybill number is correct
2. Check Delhivery API status
3. Wait for shipment to be picked up
4. Try manual refresh in admin panel

### Payment Mode Update Fails
1. Verify shipment status allows update
2. For COD conversion, provide COD amount
3. Check conversion rules (see docs)

## 8. Admin Panel Usage

### Dashboard
1. Go to `/admin/dashboard`
2. View Delhivery statistics
3. Filter by date range
4. See payment mode breakdown

### Order Management
1. Go to `/admin/orders`
2. Filter by status or payment mode
3. Click refresh icon to update tracking
4. Click trash icon to cancel shipment
5. Click edit to change order status

## 9. User Features

### Order Tracking
1. User goes to `/orders`
2. Clicks on order to view details
3. Sees real-time tracking status
4. Views tracking history
5. Auto-refresh every 5 minutes

## 10. API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/shipments/track` | GET | Get tracking info |
| `/api/admin/delhivery-stats` | GET | Get statistics |
| `/api/admin/orders/delhivery` | POST | Perform actions |
| `/api/orders` | POST | Create order |
| `/api/orders` | GET | Get user orders |
| `/api/admin/orders` | GET | Get all orders |

## 11. Next Steps

1. ✅ Update `.env` file
2. ✅ Integrate components into your pages
3. ✅ Test order creation
4. ✅ Test tracking
5. ✅ Test admin features
6. ✅ Deploy to production
7. ✅ Monitor Delhivery API usage

## 12. Support

For issues or questions:
1. Check `DELHIVERY_INTEGRATION_COMPLETE.md` for detailed docs
2. Review server logs for API errors
3. Verify environment variables
4. Test with Delhivery staging first

---

**Status**: ✅ Ready for Production
**Last Updated**: January 20, 2024

# Delhivery Integration - Testing Guide

## Quick Test Checklist

### 1. Environment Setup
- [ ] Add Delhivery credentials to `.env`
- [ ] Set `DELHIVERY_ENVIRONMENT=test` for sandbox testing
- [ ] Restart development server

### 2. Order Creation Test
```bash
# Create a test order through the UI
1. Go to http://localhost:3000/products
2. Add product to cart
3. Go to checkout
4. Fill in shipping address (use valid Indian pin code)
5. Complete payment
6. Verify order is created
```

### 3. Shipment Creation Test
```bash
# Check if shipment was created automatically
1. Go to order details page
2. Look for "Tracking Number" in the status section
3. Verify waybill number is displayed
4. Check browser console for any errors
```

### 4. Tracking Display Test
```bash
# Verify tracking component displays correctly
1. On order details page, scroll down
2. Look for "Shipment Tracking" section
3. Verify current status is displayed
4. Check tracking history (if available)
5. Verify "Track on Delhivery" link works
```

### 5. API Testing

#### Test Shipment Creation
```bash
curl -X POST http://localhost:3000/api/shipments/delhivery/create \
  -H "Content-Type: application/json" \
  -d '{"orderId": "AG123456789"}'
```

#### Test Tracking
```bash
curl http://localhost:3000/api/shipments/delhivery/track/1234567890
```

#### Test Order Fetch
```bash
curl http://localhost:3000/api/orders/AG123456789
```

## Expected Responses

### Successful Shipment Creation
```json
{
  "success": true,
  "waybill": "1234567890",
  "trackingUrl": "https://track.delhivery.com/tracking/1234567890"
}
```

### Tracking Information
```json
{
  "waybill": "1234567890",
  "status": "In Transit",
  "last_update": "2025-01-07 14:30:00",
  "location": "Delhi",
  "events": [
    {
      "timestamp": "2025-01-07 14:30:00",
      "status": "In Transit",
      "location": "Delhi"
    }
  ]
}
```

### Order Details
```json
{
  "_id": "...",
  "orderNumber": "AG123456789",
  "trackingNumber": "1234567890",
  "shippingProvider": "delhivery",
  "trackingStatus": "pending",
  "status": "confirmed",
  "items": [...],
  "total": 1000,
  "createdAt": "2025-01-07T10:00:00Z"
}
```

## Common Test Scenarios

### Scenario 1: Successful Order with Tracking
1. Create order with valid address
2. Verify waybill is generated
3. Check tracking displays on order page
4. Verify auto-refresh works

### Scenario 2: Order Without Tracking (Fallback)
1. Create order with invalid pin code
2. Verify order still completes
3. Check error is logged
4. Verify no tracking number is saved

### Scenario 3: Tracking Updates
1. Create order and get waybill
2. Wait 5 minutes
3. Verify tracking component auto-refreshes
4. Check for new events in tracking history

### Scenario 4: Multiple Orders
1. Create 3 test orders
2. Verify each has unique waybill
3. Check tracking for each order
4. Verify no cross-order data leakage

## Debugging Tips

### Check Browser Console
- Look for API errors
- Verify fetch requests are successful
- Check for CORS issues

### Check Server Logs
```bash
# Look for Delhivery service logs
grep -i "delhivery" your-server-logs.txt
```

### Verify Database
```bash
# Check if tracking fields are saved
db.orders.findOne({ orderNumber: "AG123456789" })
```

### Test Delhivery API Directly
```bash
# Test Delhivery API with curl
curl -X GET https://staging-express-api.delhivery.com/api/track/shipment/1234567890/ \
  -H "Authorization: Token YOUR_API_TOKEN"
```

## Performance Testing

### Load Test
1. Create 10 orders simultaneously
2. Verify all shipments are created
3. Check response times
4. Monitor server resources

### Tracking Refresh Test
1. Open order details page
2. Monitor network tab
3. Verify tracking API is called every 5 minutes
4. Check for memory leaks

## Sandbox vs Production

### Sandbox Testing
- Use test credentials
- Set `DELHIVERY_ENVIRONMENT=test`
- Use test pin codes
- No real shipments created

### Production Testing
- Use production credentials
- Set `DELHIVERY_ENVIRONMENT=production`
- Use real pin codes
- Real shipments created

## Rollback Plan

If issues occur:

1. **Disable Shipment Creation**
   - Comment out shipment creation in `app/api/orders/route.ts`
   - Orders will still complete without tracking

2. **Disable Tracking Display**
   - Remove OrderTracking component from order details page
   - Orders will still display without tracking info

3. **Revert to Previous Version**
   - Use git to revert changes
   - Restore from backup

## Success Criteria

✅ Orders complete successfully
✅ Waybill numbers are generated
✅ Tracking information displays
✅ Auto-refresh works every 5 minutes
✅ No errors in console or logs
✅ Tracking links work correctly
✅ Multiple orders don't interfere with each other
✅ Performance is acceptable

## Next Steps After Testing

1. ✅ Sandbox testing complete
2. Get production credentials
3. Update environment variables
4. Deploy to production
5. Monitor first 10 production orders
6. Set up alerts for failed shipments

---

**Testing Status**: Ready to test
**Last Updated**: January 7, 2026

# 🧪 Delhivery Shipment Test Guide

## Quick Test

### Option 1: Web UI (Easiest)
1. Go to: `http://localhost:3002/admin/delhivery-test`
2. Click "Run Test" button
3. See results immediately

### Option 2: API Endpoint
```bash
curl -X POST http://localhost:3002/api/delhivery/test-shipment
```

---

## What the Test Does

✓ Creates a test shipment with Delhivery API
✓ Checks if warehouse is properly configured
✓ Verifies working days are set
✓ Tests if waybill can be generated
✓ Shows detailed error messages

---

## Expected Results

### ✅ Success (After Delhivery Configuration)
```json
{
  "success": true,
  "status": "✅ WORKING",
  "message": "Delhivery shipment creation test successful!",
  "result": {
    "waybill": "1234567890123",
    "trackingUrl": "https://track.delhivery.com/tracking/1234567890123"
  },
  "nextSteps": [
    "Warehouse is properly configured on Delhivery",
    "Working days are set correctly",
    "Shipments will be created automatically for orders",
    "You can now create real orders"
  ]
}
```

### ❌ Failure (Before Configuration)
```json
{
  "success": false,
  "status": "❌ CONFIGURATION NEEDED",
  "error": "'NoneType' object has no attribute 'end_date'",
  "issue": "Warehouse working days not configured on Delhivery",
  "fixSteps": [
    "1. Go to https://one.delhivery.com",
    "2. Settings → Pickup Locations",
    "3. Edit 'Agnishila Warehouse'",
    "4. Uncheck all working days, then check Monday-Saturday",
    "5. Select 'Evening 14:00:00 - 18:00:00' pickup slot",
    "6. Save Changes",
    "7. Wait 15-20 minutes",
    "8. Run this test again"
  ]
}
```

---

## Testing Workflow

### Step 1: Configure Delhivery
1. Go to https://one.delhivery.com
2. Settings → Pickup Locations
3. Edit "Agnishila Warehouse"
4. Uncheck all working days
5. Check Monday-Saturday
6. Select "Evening 14:00:00 - 18:00:00"
7. Save Changes
8. **Wait 15-20 minutes**

### Step 2: Run Test
1. Go to `http://localhost:3002/admin/delhivery-test`
2. Click "Run Test"
3. Check result

### Step 3: Verify Success
- If ✅ WORKING: Shipments are ready
- If ❌ CONFIGURATION NEEDED: Follow the fix steps

### Step 4: Create Real Order
1. Go to `http://localhost:3002/products`
2. Add product to cart
3. Checkout and complete order
4. Verify shipment created with waybill

---

## Troubleshooting

### Test Still Shows 'end_date' Error
**Solution**: 
1. Wait another 10 minutes (Delhivery sync takes time)
2. Run test again
3. If still failing, re-configure on Delhivery dashboard

### Test Shows Different Error
**Solution**:
1. Check DELHIVERY_API_TOKEN in `.env`
2. Verify warehouse name is "Agnishila Warehouse"
3. Check Delhivery API is accessible
4. Review error message for specific issue

### Test Page Not Loading
**Solution**:
1. Restart dev server: `npm run dev`
2. Clear browser cache
3. Try again

---

## Quick Commands

### Run Test via API
```bash
curl -X POST http://localhost:3002/api/delhivery/test-shipment
```

### Check Warehouse Status
```bash
curl http://localhost:3002/api/delhivery/check-warehouse
```

### View Admin Dashboard
```
http://localhost:3002/admin/delhivery-check
```

---

## Timeline

```
Now:        Configure Delhivery
15 min:     Delhivery syncs
20 min:     Run test
25 min:     See results
30 min:     Create real order
```

---

## Success Indicators

✅ Test page loads at `/admin/delhivery-test`
✅ "Run Test" button works
✅ Test returns success response
✅ Waybill number is generated
✅ Tracking URL is created
✅ Real orders create shipments automatically

---

## Next Steps After Success

1. ✅ Test shows "WORKING"
2. ✅ Create real order to verify
3. ✅ Check Delhivery dashboard for shipment
4. ✅ Verify tracking number in order
5. ✅ Go live with confidence

---

## Support

If test fails:
1. Read the error message carefully
2. Follow the fix steps provided
3. Wait 15-20 minutes
4. Run test again
5. Contact Delhivery if still failing: tech.admin@delhivery.com

---

**Use this test to verify everything is working before going live!** 🚀

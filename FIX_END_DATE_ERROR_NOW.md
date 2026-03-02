# Fix 'end_date' Error - Action Steps

## The Real Issue
The warehouse needs **working days and pickup slot** configured in Delhivery dashboard.

## Quick Fix (5 Minutes)

### Step 1: Log in to Delhivery
- Go to https://one.delhivery.com
- Sign in with your account

### Step 2: Edit Warehouse
- Settings → Pickup Locations
- Click "Edit" on "Agnishila Warehouse"

### Step 3: Scroll Down to "Working Days"
- Check boxes for: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
- (Or your actual working days)

### Step 4: Set Pickup Slot
- Find "Default Pickup Slot"
- Set to: Evening 14:00:00 - 18:00:00
- (Or your preferred time)

### Step 5: Save
- Click "Save Changes"
- Wait 10 minutes

### Step 6: Test
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "shipment"}'
```

Should return waybill number.

## Done!
Try creating an order now. It should work.

## If Still Not Working

1. Refresh Delhivery dashboard
2. Verify working days are checked
3. Verify pickup slot is set
4. Wait another 5 minutes
5. Try test again

## See Also
- `DELHIVERY_END_DATE_ERROR_FIX.md` - Detailed guide
- `DELHIVERY_WAREHOUSE_REGISTRATION_STEPS.md` - Full setup

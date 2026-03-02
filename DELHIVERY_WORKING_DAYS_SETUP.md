# Delhivery Working Days Setup - Visual Guide

## The Error
`'NoneType' object has no attribute 'end_date'`

This means the warehouse is missing **working days** and **pickup slot** configuration.

## Step-by-Step Setup

### Step 1: Log in to Delhivery One Panel
```
URL: https://one.delhivery.com
Email: Your Delhivery account email
Password: Your password
```

### Step 2: Navigate to Pickup Locations
```
Left Menu → Settings (gear icon)
         → Pickup Locations
```

### Step 3: Find and Edit Agnishila Warehouse
```
Look for: "Agnishila Warehouse"
Click: "Edit" button (pencil icon)
```

### Step 4: Scroll Down to "Working Days" Section
You should see a section like:

```
┌─────────────────────────────────────┐
│         Working Days                │
├─────────────────────────────────────┤
│ ☑ Monday                            │
│ ☑ Tuesday                           │
│ ☑ Wednesday                         │
│ ☑ Thursday                          │
│ ☑ Friday                            │
│ ☑ Saturday                          │
│ ☐ Sunday                            │
└─────────────────────────────────────┘
```

**Make sure at least Monday-Saturday are checked** (or your working days)

### Step 5: Set Default Pickup Slot
Look for "Default Pickup Slot" section:

```
┌─────────────────────────────────────┐
│    Default Pickup Slot              │
├─────────────────────────────────────┤
│ ⊙ Evening 14:00:00 - 18:00:00      │
│ ○ Morning 09:00:00 - 12:00:00      │
│ ○ Afternoon 12:00:00 - 14:00:00    │
└─────────────────────────────────────┘
```

**Select one option** (Evening is recommended)

### Step 6: Save Changes
```
Click: "Save Changes" button (bottom right)
Wait: 10-15 minutes for changes to sync
```

## Verification

### Check if Configuration is Saved
1. Go back to Pickup Locations
2. Click Edit on Agnishila Warehouse again
3. Scroll down to Working Days
4. Verify checkboxes are still checked
5. Verify pickup slot is still selected

### Test Shipment Creation
```bash
curl -X POST http://localhost:3000/api/delhivery/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "shipment"}'
```

Expected response:
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

## Common Issues

### Issue 1: Working Days Not Saving
- Refresh page after saving
- Try again
- Check if at least one day is selected

### Issue 2: Pickup Slot Not Showing
- Scroll down in the edit form
- It should be below Working Days
- Select one option

### Issue 3: Changes Not Taking Effect
- Wait 15 minutes (not just 5)
- Log out and log back in
- Refresh browser cache (Ctrl+Shift+Delete)
- Try test again

### Issue 4: Still Getting 'end_date' Error
- Verify working days are checked
- Verify pickup slot is selected
- Check warehouse name is "Agnishila Warehouse"
- Wait another 10 minutes
- Try test again

## What Each Setting Does

### Working Days
- Tells Delhivery when your warehouse is open
- At least one day must be selected
- Affects pickup scheduling

### Pickup Slot
- Tells Delhivery when to pick up packages
- Must be set for shipments to work
- This is what causes the 'end_date' error if missing

## After Configuration

1. **Wait 10-15 minutes** for Delhivery to process changes
2. **Test shipment creation** using API
3. **Create test order** on website
4. **Verify waybill** is generated
5. **Check Delhivery dashboard** for order

## Success Indicators

✅ Working days are checked (at least Monday-Saturday)
✅ Pickup slot is selected (Evening 14:00:00 - 18:00:00)
✅ Changes are saved
✅ Test shipment returns waybill
✅ Order creates successfully
✅ Waybill appears in Delhivery dashboard

## If Still Not Working

1. **Double-check working days** - Are they really checked?
2. **Double-check pickup slot** - Is one selected?
3. **Wait longer** - Try 20 minutes instead of 10
4. **Clear browser cache** - Ctrl+Shift+Delete
5. **Try incognito mode** - Open in private window
6. **Contact Delhivery** - Email: tech.admin@delhivery.com

## Important Notes

⚠️ **This is a Delhivery Configuration Issue**
- Not a code problem
- Must be done in Delhivery dashboard
- Cannot be done via API
- Requires manual setup

⚠️ **Changes Take Time to Sync**
- Wait at least 10-15 minutes
- Don't try immediately after saving
- Delhivery needs time to process

⚠️ **Warehouse Name Must Match**
- Delhivery: `Agnishila Warehouse`
- `.env`: `DELHIVERY_WAREHOUSE_NAME=Agnishila Warehouse`
- Must be exactly the same

## Next Steps

1. **Log in to Delhivery One Panel**
2. **Go to Pickup Locations**
3. **Edit Agnishila Warehouse**
4. **Check Working Days** (Monday-Saturday)
5. **Select Pickup Slot** (Evening 14:00:00 - 18:00:00)
6. **Save Changes**
7. **Wait 15 minutes**
8. **Test shipment creation**
9. **Create order**

That's it! Once configured, shipments will work automatically.

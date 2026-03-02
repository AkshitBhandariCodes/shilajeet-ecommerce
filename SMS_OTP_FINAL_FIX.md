# SMS OTP - Final Fix Guide

## Problem Identified
OTP and company name were missing from SMS messages because:
1. The `company` parameter was not being sent to AuthKey.io API
2. The template variables `{#2fa#}` and `{#company#}` were not being replaced

## Solution Implemented

### Code Changes
Updated `lib/authkey-sms.ts` to use **POST endpoint** with template variables:

**Before (GET endpoint - no variables):**
```
GET /restapi/request.php?authkey=...&mobile=...&country_code=...&sid=...
```

**After (POST endpoint - with variables):**
```
POST /restapi/request.php
{
  "country_code": "91",
  "mobile": "9876543210",
  "sid": "33097",
  "company": "Agnishila"
}
```

### What Changed
1. Changed from GET to POST request
2. Added `company` parameter to payload
3. Added proper error logging
4. Removed unused `sendOTPPost()` method

## AuthKey.io Template Configuration

### CRITICAL: Update Your Template

**Go to**: https://console.authkey.io

**Steps**:
1. Click on "SMS Templates" in left sidebar
2. Find template ID: **33097**
3. Edit the template
4. **Replace the entire template text with:**

```
Use {#2fa#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

**Important Variables**:
- `{#2fa#}` - Auto-generated OTP (AuthKey.io replaces this)
- `{#company#}` - Company name (we pass "Agnishila")

5. Click "Save"
6. Keep the same Template ID (33097)

### What Users Will Receive

After fix, SMS will look like:
```
Use 123456 as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

## Testing the Fix

### Step 1: Update Template in AuthKey.io Console
- Go to https://console.authkey.io
- Update template ID 33097 with the correct format
- Save changes

### Step 2: Restart Dev Server
```bash
npm run dev
```

### Step 3: Test Sign Up
1. Open homepage
2. Click "Sign In" button
3. Select "Sign Up" mode
4. Enter phone number (e.g., 9876543210)
5. Click "Send OTP"
6. **Check phone for SMS** - should now show:
   ```
   Use 123456 as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
   ```
7. Enter OTP in modal
8. Fill in details (First Name, Last Name, Email)
9. Click "Verify OTP"
10. Account created successfully

### Step 4: Test Sign In
1. Click "Sign In" button
2. Enter registered phone number
3. Click "Send OTP"
4. **Check phone for SMS** - should show OTP
5. Enter OTP
6. Click "Verify OTP"
7. Logged in successfully

## Debugging

### Check Console Logs
When you send OTP, check browser console and server logs for:

```
Sending OTP to: 9876543210
Using template ID: 33097
Company name: Agnishila
Payload: {
  country_code: "91",
  mobile: "9876543210",
  sid: "33097",
  company: "Agnishila"
}
AuthKey.io 2FA response: {
  LogID: "28bf7375bb54540ba03a4eb873d4da44",
  Message: "Submitted Successfully"
}
```

### If OTP Still Missing
1. Verify template in AuthKey.io console has `{#2fa#}` (not `{#otp#}`)
2. Verify template has `{#company#}` variable
3. Check that Template ID 33097 is correct in `.env`
4. Check that API Key is correct in `.env`
5. Restart dev server after any changes

### If Company Name Missing
1. Verify template has `{#company#}` variable
2. Check that code is sending `company: "Agnishila"` in payload
3. Verify POST request is being sent (not GET)

## Environment Variables (Already Set)
```env
AUTHKEY_API_KEY=a36c6502b63a844c
AUTHKEY_OTP_TEMPLATE_ID=33097
```

## API Flow

### Send OTP Flow
```
User enters phone → AuthModal calls /api/auth/send-otp
  ↓
send-otp route calls authKeySMS.sendOTP(phone, '91', 'Agnishila')
  ↓
sendOTP() sends POST to AuthKey.io with company parameter
  ↓
AuthKey.io generates OTP and replaces {#2fa#} and {#company#}
  ↓
SMS sent to user with OTP and company name
  ↓
AuthKey.io returns LogID
  ↓
LogID stored in OTPSession
  ↓
Response sent to frontend with LogID
```

### Verify OTP Flow
```
User enters OTP → AuthModal calls /api/auth/verify-otp
  ↓
verify-otp route calls authKeySMS.verifyOTP(otp, logId)
  ↓
verifyOTP() sends GET to AuthKey.io with OTP and LogID
  ↓
AuthKey.io verifies OTP
  ↓
If valid: Create/Login user
If invalid: Return error
```

## Summary of Changes

| Component | Change | Reason |
|-----------|--------|--------|
| `lib/authkey-sms.ts` | Changed to POST endpoint | To send template variables |
| `lib/authkey-sms.ts` | Added `company` to payload | To replace `{#company#}` in template |
| `lib/authkey-sms.ts` | Added error logging | Better debugging |
| AuthKey.io Template | Update to use `{#2fa#}` and `{#company#}` | Correct variable names |

## Next Steps

1. ✅ Code is updated and ready
2. ⏳ **YOU MUST**: Update template in AuthKey.io console
3. ⏳ Restart dev server
4. ⏳ Test the flow
5. ✅ SMS will now show OTP and company name

## Support

If SMS still doesn't work:
1. Check AuthKey.io console for delivery reports
2. Verify template configuration
3. Check `.env` for correct API key and template ID
4. Review server logs for API responses
5. Test with different phone numbers

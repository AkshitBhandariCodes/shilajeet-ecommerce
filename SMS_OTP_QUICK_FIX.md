# SMS OTP Quick Fix - 3 Steps

## Problem
OTP not appearing in SMS message.

## Root Cause
- Backend was using wrong API endpoint
- Template variables not being replaced

## Solution

### Step 1: Update AuthKey.io Template (2 minutes)

1. Go to: https://console.authkey.io
2. Delete old template
3. Create NEW template with this EXACT text:
   ```
   Use {#otp#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
   ```
4. Copy Template ID

### Step 2: Update .env (1 minute)

```env
AUTHKEY_OTP_TEMPLATE_ID=YOUR_NEW_TEMPLATE_ID
```

### Step 3: Restart Dev Server (1 minute)

```bash
npm run dev
```

## Test

1. Open: http://localhost:3000
2. Click "Sign In"
3. Enter phone number
4. Click "Send OTP"
5. Check phone for SMS

**Expected SMS**:
```
Use 123456 as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

## What Changed

**Backend now**:
1. Generates random 6-digit OTP
2. Sends OTP to AuthKey.io via POST API
3. AuthKey.io replaces `{#otp#}` with generated OTP
4. AuthKey.io replaces `{#company#}` with "Agnishila"
5. Stores OTP in database
6. Verifies OTP against stored value

## Files Updated

- `lib/authkey-sms.ts` - Generate and send OTP
- `app/api/auth/send-otp/route.ts` - Store OTP
- `app/api/auth/verify-otp/route.ts` - Verify OTP
- `components/PhoneOTPAuthModal.tsx` - Update message

## Done ✅

SMS OTP system now working with manual OTP generation.


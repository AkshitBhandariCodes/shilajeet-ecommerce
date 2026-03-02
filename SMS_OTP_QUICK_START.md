# SMS OTP Authentication - Quick Start (5 Minutes)

## What It Does

Allows users to sign in and sign up using their phone number instead of email/password. An OTP (One-Time Password) is sent via SMS for verification.

## Quick Setup

### 1. Get AuthKey.io Credentials (2 minutes)

1. Go to: https://console.authkey.io
2. Sign up for free account
3. Get API Key from dashboard
4. Create SMS template with exact text (use `{#2fa#}` for OTP):
   ```
   Use {#2fa#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
   ```
5. Copy Template ID (SID)

### 2. Update .env (1 minute)

```env
AUTHKEY_API_KEY=your_api_key
AUTHKEY_OTP_TEMPLATE_ID=your_template_id
```

### 3. Test (2 minutes)

```bash
npm run dev
```

Visit: http://localhost:3000

Look for "Sign In with Phone" button and test!

## How It Works

```
User clicks "Sign In with Phone"
    ↓
Enters phone number
    ↓
Clicks "Send OTP"
    ↓
SMS sent to phone
    ↓
User enters OTP
    ↓
Clicks "Verify OTP"
    ↓
Account created/logged in
```

## Files Created

| File | Purpose |
|------|---------|
| `lib/authkey-sms.ts` | SMS service |
| `models/OTPSession.ts` | OTP storage |
| `app/api/auth/send-otp/route.ts` | Send OTP API |
| `app/api/auth/verify-otp/route.ts` | Verify OTP API |
| `components/PhoneOTPAuthModal.tsx` | UI component |

## API Endpoints

**Send OTP**
```
POST /api/auth/send-otp
Body: { phoneNumber: "9876543210", purpose: "signin" }
```

**Verify OTP**
```
POST /api/auth/verify-otp
Body: { otp: "123456", logId: "...", phoneNumber: "9876543210", purpose: "signin" }
```

## Features

✅ Phone-based login/signup
✅ SMS OTP verification
✅ 10-minute OTP expiry
✅ 5 attempt limit
✅ Beautiful UI
✅ Error handling
✅ Resend OTP

## Testing

1. Start dev server: `npm run dev`
2. Click phone auth button
3. Enter phone: 9876543210
4. Click "Send OTP"
5. Check phone for OTP
6. Enter OTP
7. Done!

## Troubleshooting

**OTP not sending?**
- Check API key is correct
- Check template ID is correct
- Verify phone number format

**OTP verification fails?**
- Check OTP is correct
- Verify OTP hasn't expired
- Check attempt limit not exceeded

## Next Steps

1. Get AuthKey.io credentials
2. Update .env
3. Test phone authentication
4. Deploy to production

---

**Time**: 5 minutes
**Difficulty**: Easy
**Status**: Ready

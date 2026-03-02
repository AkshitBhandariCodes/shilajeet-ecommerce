# Immediate Action Required - Fix 404 Error

## Current Issue

Getting 404 error on `/api/auth/send-otp` endpoint.

## Root Cause

Dev server was running when API route files were created. Next.js needs to restart to recognize new routes.

## Fix (3 Steps - 2 Minutes)

### Step 1: Stop Dev Server

In your terminal, press:
```
Ctrl+C
```

Wait for prompt to return.

### Step 2: Clear Cache

Run this command:
```bash
rm -rf .next
```

Or on Windows PowerShell:
```powershell
Remove-Item -Recurse -Force .next
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

Wait for:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Verify Fix

1. Open browser: http://localhost:3000
2. Press `Ctrl+Shift+R` (hard refresh)
3. Click "Sign In"
4. Enter phone number
5. Click "Send OTP"
6. Should work now ✅

## If Still Getting 404

1. Check file exists:
   ```bash
   ls app/api/auth/send-otp/route.ts
   ```
   Should show the file

2. Check .env has:
   ```env
   AUTHKEY_API_KEY=a36c6502b63a844c
   AUTHKEY_OTP_TEMPLATE_ID=YOUR_TEMPLATE_ID
   ```

3. Check terminal for errors when dev server starts

## Expected Response

After fix, you should get:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "expiresIn": 600
}
```

## Summary

**Action**: Restart dev server with cache clear

**Command**:
```bash
rm -rf .next && npm run dev
```

**Time**: 2 minutes

**Result**: 404 error fixed ✅


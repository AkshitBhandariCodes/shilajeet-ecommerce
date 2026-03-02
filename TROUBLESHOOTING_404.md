# Troubleshooting 404 Error - Complete Guide

## Error Message

```
POST http://localhost:3000/api/auth/send-otp 404 (Not Found)
handleSendOTP@AuthModal.tsx:58
```

## Root Cause

The API route file exists but Next.js dev server hasn't recognized it yet. This happens when:
1. New API routes are created
2. Dev server was running when files were created
3. Next.js cache is stale

## Solution (Step by Step)

### Step 1: Stop Dev Server

In your terminal where `npm run dev` is running:
```
Press Ctrl+C
```

Wait for it to fully stop (you should see the prompt return).

### Step 2: Clear Next.js Cache

```bash
rm -rf .next
```

Or on Windows PowerShell:
```powershell
Remove-Item -Recurse -Force .next
```

Or on Windows CMD:
```cmd
rmdir /s /q .next
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

Wait for it to say:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 4: Hard Refresh Browser

1. Open http://localhost:3000
2. Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. This clears browser cache

### Step 5: Test

1. Click "Sign In"
2. Enter phone number
3. Click "Send OTP"
4. Should work now ✅

## Verification Checklist

- [ ] Dev server stopped
- [ ] `.next` folder deleted
- [ ] Dev server restarted
- [ ] Browser hard refreshed
- [ ] API route file exists: `app/api/auth/send-otp/route.ts`
- [ ] Verify route file exists: `app/api/auth/verify-otp/route.ts`
- [ ] `.env` has `AUTHKEY_API_KEY`
- [ ] `.env` has `AUTHKEY_OTP_TEMPLATE_ID`

## File Locations

These files should exist:
```
app/api/auth/send-otp/route.ts ✓
app/api/auth/verify-otp/route.ts ✓
lib/authkey-sms.ts ✓
components/AuthModal.tsx ✓
components/PhoneOTPAuthModal.tsx ✓
```

## Expected Behavior After Fix

### Send OTP Request
```
POST /api/auth/send-otp
{
  "phoneNumber": "9876543210",
  "countryCode": "91",
  "purpose": "signin"
}
```

### Response
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "expiresIn": 600
}
```

## If Still Getting 404

### Check 1: Terminal Output

Look for any errors in terminal when dev server starts:
```
error - ENOENT: no such file or directory, open 'app/api/auth/send-otp/route.ts'
```

If you see this, the file wasn't created properly.

### Check 2: File Exists

Run this command:
```bash
ls -la app/api/auth/send-otp/route.ts
```

Or on Windows:
```powershell
Get-Item app/api/auth/send-otp/route.ts
```

Should show the file exists.

### Check 3: File Content

Check if file has proper export:
```bash
head -20 app/api/auth/send-otp/route.ts
```

Should show:
```typescript
import { NextRequest, NextResponse } from 'next/server';
...
export async function POST(request: NextRequest) {
```

### Check 4: Environment Variables

Verify `.env` has:
```env
AUTHKEY_API_KEY=a36c6502b63a844c
AUTHKEY_OTP_TEMPLATE_ID=YOUR_TEMPLATE_ID
```

### Check 5: Browser Console

Open browser DevTools (F12):
1. Go to Network tab
2. Click "Send OTP"
3. Look for request to `/api/auth/send-otp`
4. Check response status and body

## Common Issues

### Issue: Still 404 after restart

**Solution**: 
1. Check if file exists: `ls app/api/auth/send-otp/route.ts`
2. Check file size: Should be ~2.6 KB
3. Check file content: Should have `export async function POST`

### Issue: 500 Error instead of 404

**Solution**: 
1. Check `.env` variables
2. Check MongoDB connection
3. Check AuthKey.io API key
4. Look at terminal for error logs

### Issue: Dev server won't start

**Solution**:
1. Check for syntax errors: `npm run build`
2. Check Node version: `node --version` (should be 18+)
3. Check npm version: `npm --version` (should be 8+)

## Quick Commands

```bash
# Stop dev server
Ctrl+C

# Clear cache and restart
rm -rf .next && npm run dev

# Check file exists
ls app/api/auth/send-otp/route.ts

# Check file content
cat app/api/auth/send-otp/route.ts

# Check .env
cat .env | grep AUTHKEY

# Build to check for errors
npm run build
```

## Summary

**Most Common Fix**: Restart dev server with `npm run dev`

**If that doesn't work**: 
1. Stop dev server
2. Delete `.next` folder
3. Restart dev server
4. Hard refresh browser

**If still not working**: Check file exists and has proper export


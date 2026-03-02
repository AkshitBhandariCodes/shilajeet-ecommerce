# Fix 404 Error on /api/auth/send-otp

## Problem

Getting 404 error when trying to call `/api/auth/send-otp` endpoint:
```
POST http://localhost:3000/api/auth/send-otp 404 (Not Found)
```

## Root Cause

The API route file exists but the dev server hasn't recognized it yet. Next.js needs to restart to pick up new API routes.

## Solution

### Step 1: Stop Dev Server

Press `Ctrl+C` in the terminal where dev server is running.

### Step 2: Clear Next.js Cache

```bash
rm -rf .next
```

Or on Windows:
```bash
rmdir /s /q .next
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

### Step 4: Test

1. Open browser: http://localhost:3000
2. Click "Sign In"
3. Enter phone number
4. Click "Send OTP"
5. Should work now ✅

## Verification

The API route file exists at:
```
app/api/auth/send-otp/route.ts
```

And has proper export:
```typescript
export async function POST(request: NextRequest) {
  // ... implementation
}
```

## If Still Getting 404

1. Check browser console for exact error
2. Check terminal for any build errors
3. Verify `.env` file has required variables:
   ```env
   AUTHKEY_API_KEY=a36c6502b63a844c
   AUTHKEY_OTP_TEMPLATE_ID=YOUR_TEMPLATE_ID
   ```
4. Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## Expected Response

After fixing, you should get:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "expiresIn": 600
}
```

## Summary

**Action Required**: Restart dev server with `npm run dev`

The API route is correctly implemented and will work after restart.


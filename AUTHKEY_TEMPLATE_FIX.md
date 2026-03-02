# AuthKey.io Template Fix - Use {#2fa#} Not {#otp#}

## Problem

The OTP is not appearing in the SMS because the template is using `{#otp#}` but AuthKey.io uses `{#2fa#}` for the auto-generated OTP variable.

## Solution

You need to update your template in AuthKey.io console to use the correct variable name.

## Correct Template

**Delete the old template and create a NEW one with this exact text:**

```
Use {#2fa#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

## Key Difference

| Wrong | Correct |
|-------|---------|
| `{#otp#}` | `{#2fa#}` |

AuthKey.io uses `{#2fa#}` for the auto-generated OTP, not `{#otp#}`.

## Steps to Fix

### 1. Go to AuthKey.io Console
- Visit: https://console.authkey.io
- Login to your account

### 2. Delete Old Template
- Go to: SMS Templates
- Find your old template with `{#otp#}`
- Delete it

### 3. Create New Template
- Click: Create New Template
- Paste this exact text:
  ```
  Use {#2fa#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
  ```
- Save template
- Copy the new Template ID (SID)

### 4. Update Environment Variable
```env
AUTHKEY_OTP_TEMPLATE_ID=your_new_template_id
```

### 5. Restart Dev Server
```bash
npm run dev
```

### 6. Test Again
1. Click "Sign In with Phone"
2. Enter phone number
3. Click "Send OTP"
4. Check phone for SMS

**You should now receive:**
```
Use 123456 as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

## Why This Works

According to AuthKey.io documentation:
- `{#2fa#}` = Auto-generated OTP (4-6 digits)
- `{#company#}` = Custom variable (passed from API)

The system automatically:
1. Generates a random OTP
2. Replaces `{#2fa#}` with the generated OTP
3. Replaces `{#company#}` with "Agnishila"
4. Sends the complete SMS

## Verification

After creating the new template, you should see:

**SMS Received:**
```
Use 456789 as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

Where:
- `456789` = Auto-generated OTP (replaces `{#2fa#}`)
- `Agnishila` = Company name (replaces `{#company#}`)

## Summary

**Change this:**
```
Use {#otp#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

**To this:**
```
Use {#2fa#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

The only change is: `{#otp#}` → `{#2fa#}`

---

**Status**: Ready to fix
**Action Required**: Update template in AuthKey.io console
**Time to Fix**: 2 minutes

# AuthKey.io Template Update - Step by Step Guide

## Quick Summary

**Problem**: OTP number not appearing in SMS
**Cause**: Template uses `{#otp#}` but should use `{#2fa#}`
**Solution**: Update template in AuthKey.io console

---

## Step-by-Step Instructions

### STEP 1: Go to AuthKey.io Console

1. Open browser
2. Go to: https://console.authkey.io
3. Login with your credentials

**Expected**: You see the AuthKey.io dashboard

---

### STEP 2: Navigate to SMS Templates

1. In the left sidebar, find: **SMS Templates**
2. Click on it

**Expected**: You see a list of your SMS templates

---

### STEP 3: Find and Delete Old Template

1. Look for your template with `{#otp#}` in it
2. It should look like:
   ```
   Use {#otp#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
   ```
3. Click the **Delete** button (usually a trash icon)
4. Confirm deletion

**Expected**: Template is removed from the list

---

### STEP 4: Create New Template

1. Click: **Create New Template** (or **+ New Template**)
2. You'll see a form with a text field

**Expected**: Empty template creation form

---

### STEP 5: Enter Template Text

In the template text field, paste this EXACT text:

```
Use {#2fa#} as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

**Important**: 
- Copy the text exactly as shown
- Use `{#2fa#}` (not `{#otp#}`)
- Use `Agnishila` (not `{#company#}`)
- Include "This sms sent by authkey.io" at the end

**Expected**: Template text appears in the field

---

### STEP 6: Save Template

1. Click: **Save** button
2. Wait for confirmation

**Expected**: You see a success message and the template is created

---

### STEP 7: Copy Template ID

1. After saving, you'll see the new template in the list
2. Look for the **Template ID** or **SID** (usually a number like 33097)
3. Click the copy icon or select and copy the ID

**Expected**: Template ID is copied to clipboard

Example Template ID: `33097`

---

### STEP 8: Update .env File

1. Open your project in code editor
2. Open `.env` file
3. Find this line:
   ```
   AUTHKEY_OTP_TEMPLATE_ID=33097
   ```
4. Replace `33097` with your NEW template ID from Step 7

**Example**:
```env
AUTHKEY_API_KEY=a36c6502b63a844c
AUTHKEY_OTP_TEMPLATE_ID=33098  # Your new template ID
AUTHKEY_DLT_PE_ID=1101432621000095221
AUTHKEY_DLT_TEMPLATE_ID=1707911215678100001
```

**Expected**: `.env` file is updated with new template ID

---

### STEP 9: Restart Dev Server

1. In terminal, stop the dev server:
   ```
   Ctrl+C
   ```
2. Start it again:
   ```
   npm run dev
   ```

**Expected**: Dev server starts without errors

---

### STEP 10: Test the SMS OTP

1. Open app in browser: http://localhost:3000
2. Click "Sign In" button (top right)
3. Enter a phone number (10 digits, e.g., 9876543210)
4. Click "Send OTP"
5. **Check your phone for SMS**

**Expected SMS**:
```
Use 123456 as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

Where `123456` is the actual OTP number.

---

### STEP 11: Verify OTP

1. Copy the OTP from SMS
2. Enter it in the modal
3. Click "Verify OTP"

**Expected**: 
- ✅ OTP verified successfully
- ✅ Account created/logged in
- ✅ Redirected to dashboard

---

## Troubleshooting

### Issue: Template not saving

**Solution**:
1. Check text is exactly as shown
2. No extra spaces or characters
3. Try again

### Issue: SMS still not showing OTP

**Solution**:
1. Verify template ID is updated in `.env`
2. Restart dev server
3. Hard refresh browser (Ctrl+Shift+R)
4. Try again

### Issue: Can't find template ID

**Solution**:
1. Go back to SMS Templates
2. Find your newly created template
3. Look for "ID", "SID", or "Template ID" field
4. Copy that number

### Issue: Old template still being used

**Solution**:
1. Make sure old template is deleted
2. Make sure `.env` has NEW template ID
3. Restart dev server
4. Clear browser cache

---

## Template Comparison

### OLD (Wrong - Don't Use)
```
Use {#otp#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

### NEW (Correct - Use This)
```
Use {#2fa#} as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

### Differences
| Part | Old | New |
|------|-----|-----|
| Variable | `{#otp#}` | `{#2fa#}` |
| Company | `{#company#}` | `Agnishila` |

---

## Why This Works

**2FA API** (what we use):
- Automatically generates OTP
- Uses `{#2fa#}` variable
- AuthKey.io replaces `{#2fa#}` with generated OTP
- Sends SMS with OTP number

**Example**:
- Template: `Use {#2fa#} as your OTP...`
- Generated OTP: `456789`
- SMS sent: `Use 456789 as your OTP...`

---

## Verification Checklist

Before testing, verify:

- [ ] Old template deleted from AuthKey.io
- [ ] New template created with `{#2fa#}`
- [ ] Template ID copied
- [ ] `.env` file updated with new template ID
- [ ] Dev server restarted
- [ ] Browser cache cleared (Ctrl+Shift+R)

After testing, verify:

- [ ] SMS received with OTP number
- [ ] OTP verification works
- [ ] User account created/logged in
- [ ] User redirected to dashboard

---

## Summary

1. ✅ Delete old template from AuthKey.io
2. ✅ Create new template with `{#2fa#}`
3. ✅ Copy new template ID
4. ✅ Update `.env` with new template ID
5. ✅ Restart dev server
6. ✅ Test SMS OTP flow

**Time to complete**: 5 minutes

**Status**: Ready to implement

---

## Support

If you encounter issues:

1. Check AuthKey.io console for template
2. Verify template ID in `.env`
3. Check server logs for errors
4. Try hard refresh browser (Ctrl+Shift+R)
5. Restart dev server


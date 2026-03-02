# SMS OTP Testing Guide

## Quick Start - Test the SMS OTP System

### Prerequisites
- Dev server running: `npm run dev`
- AuthKey.io template created with correct variables
- `.env` updated with template ID
- Real phone number for testing

## Test Scenario 1: Sign Up with Phone OTP

### Steps:
1. Open app in browser: `http://localhost:3000`
2. Click "Sign In" button (top right)
3. Click "Sign Up" link in modal
4. Enter phone number (10 digits, e.g., 9876543210)
5. Click "Send OTP"
6. **Check phone for SMS**
7. Copy OTP from SMS
8. Enter OTP in modal
9. Click "Verify OTP"
10. Enter signup details:
    - First Name: John
    - Last Name: Doe
    - Email: john@example.com
11. Click "Create Account"
12. Should see success message and redirect to dashboard

### Expected SMS Format:
```
Use 123456 as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

### Expected Result:
- ✅ Account created
- ✅ User logged in
- ✅ Redirected to dashboard
- ✅ User profile shows phone number

---

## Test Scenario 2: Sign In with Phone OTP

### Steps:
1. Open app in browser: `http://localhost:3000`
2. Click "Sign In" button
3. Enter phone number (same as signup)
4. Click "Send OTP"
5. **Check phone for SMS**
6. Copy OTP from SMS
7. Enter OTP in modal
8. Click "Verify OTP"
9. Should see success message and redirect to dashboard

### Expected Result:
- ✅ User logged in
- ✅ Redirected to dashboard
- ✅ User profile shows correct name and phone

---

## Test Scenario 3: Invalid OTP

### Steps:
1. Open app in browser
2. Click "Sign In"
3. Enter phone number
4. Click "Send OTP"
5. Enter wrong OTP (e.g., 000000)
6. Click "Verify OTP"

### Expected Result:
- ❌ Error message: "Invalid OTP"
- ✅ Attempts remaining counter shows
- ✅ Can retry with correct OTP

---

## Test Scenario 4: OTP Expiry

### Steps:
1. Open app in browser
2. Click "Sign In"
3. Enter phone number
4. Click "Send OTP"
5. Wait 10 minutes (or check timer in modal)
6. Enter OTP
7. Click "Verify OTP"

### Expected Result:
- ❌ Error message: "OTP has expired"
- ✅ Can click "Resend" to get new OTP

---

## Test Scenario 5: Resend OTP

### Steps:
1. Open app in browser
2. Click "Sign In"
3. Enter phone number
4. Click "Send OTP"
5. Wait 30 seconds
6. Click "Resend"
7. **Check phone for new SMS**

### Expected Result:
- ✅ New OTP sent
- ✅ New SMS received with different OTP
- ✅ Timer resets to 10 minutes
- ✅ Can verify with new OTP

---

## Debugging Checklist

### If OTP Not Sending:

**Check 1: Server Logs**
```bash
# Look for these logs in terminal:
# "Sending OTP to: 9876543210"
# "Using template ID: 33097"
# "Company: Agnishila"
# "AuthKey.io response: { LogID: '...' }"
```

**Check 2: Environment Variables**
```bash
# Verify in .env:
AUTHKEY_API_KEY=a36c6502b63a844c
AUTHKEY_OTP_TEMPLATE_ID=33097  # Your template ID
```

**Check 3: AuthKey.io Console**
- Go to: https://console.authkey.io
- Check SMS Templates
- Verify template exists with `{#otp#}` and `{#company#}`
- Check account has SMS credits

**Check 4: Phone Number**
- Must be 10 digits
- Must be valid Indian number
- No country code prefix

### If OTP Not Appearing in SMS:

**Check 1: Template Variables**
- Template must have `{#otp#}` (not `{#2fa#}`)
- Template must have `{#company#}`
- Template must be exactly:
  ```
  Use {#otp#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
  ```

**Check 2: Restart Dev Server**
```bash
# Stop: Ctrl+C
# Start: npm run dev
```

**Check 3: Clear Browser Cache**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### If OTP Verification Fails:

**Check 1: OTP Correct**
- Verify you entered exact OTP from SMS
- No spaces or extra characters

**Check 2: OTP Not Expired**
- Check timer in modal
- OTP valid for 10 minutes

**Check 3: LogID Correct**
- LogID must match send-otp response
- Don't use old LogID from previous request

**Check 4: Server Logs**
```bash
# Look for:
# "Error verifying OTP: ..."
# "AuthKey.io response: { status: false, message: '...' }"
```

---

## Browser Console Debugging

Open browser DevTools (F12) and check Console tab:

### Network Tab:
1. Click "Network" tab
2. Send OTP
3. Look for request to `/api/auth/send-otp`
4. Check response:
   ```json
   {
     "success": true,
     "logId": "28bf7375bb54540ba03a4eb873d4da44",
     "expiresIn": 600
   }
   ```

### Console Tab:
1. Click "Console" tab
2. Look for any error messages
3. Check for warnings about missing env variables

---

## Common Issues and Solutions

### Issue: "Invalid phone number"
**Solution**: Enter exactly 10 digits, no country code

### Issue: "User not found. Please sign up first."
**Solution**: Use Sign Up flow first, then Sign In

### Issue: "Phone number already registered"
**Solution**: Use different phone number or Sign In instead

### Issue: "Maximum OTP attempts exceeded"
**Solution**: Click "Resend" to get new OTP

### Issue: "OTP has expired"
**Solution**: Click "Resend" to get new OTP

### Issue: SMS not received
**Solution**:
1. Check phone number is correct
2. Check AuthKey.io account has credits
3. Check DLT template is approved (for India)
4. Wait 30 seconds (SMS can be delayed)

---

## Performance Testing

### Test 1: OTP Send Time
- Measure time from "Send OTP" click to SMS received
- Expected: 5-15 seconds

### Test 2: OTP Verify Time
- Measure time from "Verify OTP" click to success
- Expected: 2-5 seconds

### Test 3: Multiple Requests
- Send OTP 5 times in a row
- Verify each one works
- Check for rate limiting

---

## Production Testing Checklist

Before deploying to production:

- [ ] Test with real phone numbers
- [ ] Test signup flow
- [ ] Test signin flow
- [ ] Test OTP resend
- [ ] Test OTP expiry
- [ ] Test invalid OTP
- [ ] Test maximum attempts
- [ ] Verify SMS format is correct
- [ ] Check server logs for errors
- [ ] Monitor AuthKey.io API responses
- [ ] Test on different devices
- [ ] Test on different networks (WiFi, 4G, etc.)
- [ ] Verify user data is saved correctly
- [ ] Verify user can access dashboard after login
- [ ] Verify user can logout and login again

---

## Monitoring in Production

### Key Metrics to Track:
1. **OTP Send Success Rate**: Should be > 99%
2. **OTP Verify Success Rate**: Should be > 95%
3. **Average OTP Send Time**: Should be < 10 seconds
4. **Average OTP Verify Time**: Should be < 5 seconds
5. **Failed Attempts**: Monitor for abuse patterns

### Logs to Monitor:
```
[ERROR] Error sending OTP: ...
[ERROR] Error verifying OTP: ...
[WARN] AUTHKEY_API_KEY is not set
[WARN] AUTHKEY_OTP_TEMPLATE_ID is not set
```

### Alerts to Set Up:
- OTP send failure rate > 5%
- OTP verify failure rate > 10%
- AuthKey.io API errors
- Missing environment variables

---

## Summary

The SMS OTP system is now ready for testing. Follow the test scenarios above to verify:

1. ✅ OTP sends successfully
2. ✅ SMS received with correct format
3. ✅ OTP verification works
4. ✅ User account created/logged in
5. ✅ User redirected to dashboard

**Next Steps**:
1. Test with real phone number
2. Verify SMS format
3. Test complete signin/signup flow
4. Deploy to production


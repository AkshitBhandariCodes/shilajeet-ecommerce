# AuthKey.io Template - Exact Format

## Template to Create in AuthKey.io Console

### Copy This EXACTLY:

```
Use {#otp#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

## Step-by-Step

1. Go to: https://console.authkey.io
2. Login
3. Click: **SMS Templates**
4. Click: **Create New Template**
5. Paste the template above
6. Click: **Save**
7. Copy the **Template ID (SID)**
8. Update `.env`:
   ```env
   AUTHKEY_OTP_TEMPLATE_ID=YOUR_TEMPLATE_ID_HERE
   ```

## Template Variables

| Variable | Replaced With | Example |
|----------|---------------|---------|
| `{#otp#}` | Generated OTP | 456789 |
| `{#company#}` | Company name | Agnishila |

## Example SMS Received

```
Use 456789 as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

## Important Notes

- ✅ Use `{#otp#}` (not `{#2fa#}`)
- ✅ Use `{#company#}` (not `{#company_name#}`)
- ✅ Copy template EXACTLY as shown
- ✅ No extra spaces or characters
- ✅ Restart dev server after updating `.env`

## Verification

After creating template:
1. Restart dev server: `npm run dev`
2. Test: Send OTP
3. Check phone for SMS
4. Verify OTP appears in message

## Done ✅

Template created and ready to use.

